const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Banner = require('../models/Banner');
const FAQ = require('../models/FAQ');
const HomeSection = require('../models/HomeSection');
const Setting = require('../models/Setting');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Review = require('../models/Review');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { getNextId } = require('../utils/idGenerator');
const { parseDateRange, buildDayBuckets, aggregateByDay } = require('../utils/dateRange');

const orderCrud = createCrudController(Order, 'order', ['orderNumber', 'userName', 'userEmail']);
const bookingCrud = createCrudController(Booking, 'booking', ['bookingNumber', 'serviceName', 'userName', 'userEmail']);
const bannerCrud = createCrudController(Banner, 'banner', ['title', 'position']);
const faqCrud = createCrudController(FAQ, 'faq', ['question', 'answer', 'category']);
const homeSectionCrud = createCrudController(HomeSection, 'homeSection', ['key', 'title']);
const settingCrud = createCrudController(Setting, 'setting', ['key', 'label', 'group']);

exports.listOrders = orderCrud.list;
exports.getOrder = orderCrud.getOne;
exports.updateOrder = orderCrud.update;
exports.removeOrder = orderCrud.remove;
exports.toggleOrderStatus = orderCrud.toggleStatus;
exports.createOrder = asyncHandler(async (req, res) => {
  const id = await getNextId('order');
  const orderNumber = req.body.orderNumber || `ORD-${Date.now()}-${id}`;
  const item = await Order.create({ id, orderNumber, ...req.body });
  return success(res, item.toJSON(), 'Created', 201);
});

exports.listBookings = bookingCrud.list;
exports.getBooking = bookingCrud.getOne;
exports.updateBooking = bookingCrud.update;
exports.removeBooking = bookingCrud.remove;
exports.toggleBookingStatus = bookingCrud.toggleStatus;
exports.createBooking = asyncHandler(async (req, res) => {
  const id = await getNextId('booking');
  const bookingNumber = req.body.bookingNumber || `BKG-${Date.now()}-${id}`;
  const item = await Booking.create({ id, bookingNumber, ...req.body });
  return success(res, item.toJSON(), 'Created', 201);
});

exports.listBanners = bannerCrud.list;
exports.getBanner = bannerCrud.getOne;
exports.createBanner = bannerCrud.create;
exports.updateBanner = bannerCrud.update;
exports.removeBanner = bannerCrud.remove;
exports.toggleBannerStatus = bannerCrud.toggleStatus;

exports.listFaqs = faqCrud.list;
exports.getFaq = faqCrud.getOne;
exports.createFaq = faqCrud.create;
exports.updateFaq = faqCrud.update;
exports.removeFaq = faqCrud.remove;
exports.toggleFaqStatus = faqCrud.toggleStatus;

exports.listHomeSections = homeSectionCrud.list;
exports.getHomeSection = homeSectionCrud.getOne;
exports.createHomeSection = homeSectionCrud.create;
exports.updateHomeSection = homeSectionCrud.update;
exports.removeHomeSection = homeSectionCrud.remove;
exports.toggleHomeSectionStatus = homeSectionCrud.toggleStatus;

exports.listSettings = settingCrud.list;
exports.getSetting = settingCrud.getOne;
exports.createSetting = settingCrud.create;
exports.updateSetting = settingCrud.update;
exports.removeSetting = settingCrud.remove;
exports.toggleSettingStatus = settingCrud.toggleStatus;

exports.getPublicSite = asyncHandler(async (req, res) => {
  const [settings, homeSections, faqs, banners] = await Promise.all([
    Setting.find({ status: 'active' }),
    HomeSection.find({ status: 'active', enabled: true }).sort('sortOrder'),
    FAQ.find({ status: 'active' }).sort('sortOrder'),
    Banner.find({ status: 'active' }).sort('sortOrder'),
  ]);

  const settingsMap = {};
  const content = {};

  settings.forEach((s) => {
    settingsMap[s.key] = s.value;
    if (s.type === 'json' && s.key.startsWith('content_')) {
      const sectionKey = s.key.replace(/^content_/, '');
      try {
        content[sectionKey] = JSON.parse(s.value || '{}');
      } catch {
        content[sectionKey] = {};
      }
    }
  });

  return success(res, {
    settings: settingsMap,
    content,
    homeSections: homeSections.map((h) => h.toJSON()),
    faqs: faqs.map((f) => f.toJSON()),
    banners: banners.map((b) => b.toJSON()),
  });
});

exports.dashboardStats = asyncHandler(async (req, res) => {
  const { start, end, range } = parseDateRange(req.query);
  const dateFilter = { createdAt: { $gte: start, $lte: end } };
  const { buckets, allDays } = buildDayBuckets(start, end);

  const [
    users, vendors, products, services, categories, subcategories,
    brands, orders, bookings, reviews, banners, faqs, homeSections,
    ordersInRange, usersInRange, vendorsInRange, productsInRange, servicesInRange,
    recentOrders, recentUsers, topProducts, topServices,
  ] = await Promise.all([
    User.countDocuments(),
    Vendor.countDocuments(),
    Product.countDocuments(),
    Service.countDocuments(),
    Category.countDocuments(),
    Subcategory.countDocuments(),
    Brand.countDocuments(),
    Order.countDocuments(),
    Booking.countDocuments(dateFilter),
    Review.countDocuments(),
    Banner.countDocuments(),
    FAQ.countDocuments(),
    HomeSection.countDocuments(),
    Order.find(dateFilter).lean(),
    User.find(dateFilter).lean(),
    Vendor.find(dateFilter).lean(),
    Product.find(dateFilter).lean(),
    Service.find(dateFilter).lean(),
    Order.find().sort('-createdAt').limit(5).lean(),
    User.find().sort('-createdAt').limit(5).lean(),
    Product.find({ status: 'active' }).sort('-rating -reviewCount').limit(5).lean(),
    Service.find({ status: 'active' }).sort('-rating -reviewCount').limit(5).lean(),
  ]);

  const [pendingOrders, pendingBookings, activeProducts, activeServices, revenueTotal] = await Promise.all([
    Order.countDocuments({ orderStatus: 'pending', createdAt: dateFilter.createdAt }),
    Booking.countDocuments({ bookingStatus: 'pending', createdAt: dateFilter.createdAt }),
    Product.countDocuments({ status: 'active' }),
    Service.countDocuments({ status: 'active' }),
    Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
  ]);

  const revenueOrdersChart = aggregateByDay(
    ordersInRange,
    'createdAt',
    (o) => ({ value: o.total || 0, count: 1 }),
    allDays,
  ).map((d) => ({ date: d.label, revenue: Math.round(d.value * 100) / 100, orders: d.count }));

  const productsServicesChart = allDays.map((b) => {
    const pCount = productsInRange.filter((p) => new Date(p.createdAt).toISOString().slice(0, 10) === b.date).length;
    const sCount = servicesInRange.filter((s) => new Date(s.createdAt).toISOString().slice(0, 10) === b.date).length;
    return { date: b.label, products: pCount, services: sCount };
  });

  const usersVendorsChart = allDays.map((b) => {
    const uCount = usersInRange.filter((u) => new Date(u.createdAt).toISOString().slice(0, 10) === b.date).length;
    const vCount = vendorsInRange.filter((v) => new Date(v.createdAt).toISOString().slice(0, 10) === b.date).length;
    return { date: b.label, users: uCount, vendors: vCount };
  });

  const stripMongo = (doc) => {
    const { _id, __v, passwordHash, ...rest } = doc;
    return rest;
  };

  return success(res, {
    range: { key: range, start, end },
    users,
    vendors,
    products,
    services,
    categories,
    subcategories,
    brands,
    orders: ordersInRange.length,
    bookings,
    reviews,
    banners,
    faqs,
    homeSections,
    pendingOrders,
    pendingBookings,
    activeProducts,
    activeServices,
    revenue: revenueTotal[0]?.total || 0,
    ordersInRange: ordersInRange.length,
    usersInRange: usersInRange.length,
    vendorsInRange: vendorsInRange.length,
    revenueOrdersChart,
    productsServicesChart,
    usersVendorsChart,
    recentOrders: recentOrders.map(stripMongo),
    recentUsers: recentUsers.map(stripMongo),
    topProducts: topProducts.map(stripMongo),
    topServices: topServices.map(stripMongo),
  });
});
