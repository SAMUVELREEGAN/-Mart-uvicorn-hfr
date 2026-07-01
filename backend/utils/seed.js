const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Review = require('../models/Review');
const Location = require('../models/Location');
const Consultant = require('../models/Consultant');
const FAQ = require('../models/FAQ');
const HomeSection = require('../models/HomeSection');
const Setting = require('../models/Setting');
const Banner = require('../models/Banner');
const HighlightCategory = require('../models/HighlightCategory');
const VendorRegStep = require('../models/VendorRegStep');
const VendorFormSection = require('../models/VendorFormSection');
const VendorFormField = require('../models/VendorFormField');
const VendorTerms = require('../models/VendorTerms');
const VendorPricingPlan = require('../models/VendorPricingPlan');
const Vendor = require('../models/Vendor');
const { getNextId } = require('./idGenerator');

const frontendJson = path.join(__dirname, '../../frontend/src/json');

const readJson = (file) => {
  const filePath = path.join(frontendJson, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const ensureCategory = async (data) => {
  const existing = await Category.findOne({ slug: data.slug, type: data.type });
  if (existing) return existing;
  const id = await getNextId('category');
  return Category.create({ id, ...data });
};

const seedCms = async () => {
  const heroData = readJson('hero.json');

  const faqItems = heroData.homeContent?.faq?.items || [];
  let faqOrder = 0;
  for (const item of faqItems) {
    const existing = await FAQ.findOne({ question: item.question });
    if (existing) continue;
    const id = await getNextId('faq');
    await FAQ.create({
      id,
      question: item.question,
      answer: item.answer,
      category: 'general',
      sortOrder: faqOrder++,
      status: 'active',
    });
  }

  const sectionOrder = heroData.homeLayout?.sectionOrder || [];
  let sectionSort = 0;
  for (const key of sectionOrder) {
    const existing = await HomeSection.findOne({ key });
    if (existing) continue;
    const sectionMeta = heroData.sections?.[key] || {};
    const sectionConfig = heroData.homeLayout?.sectionConfig?.[key] || {};
    const id = await getNextId('homeSection');
    await HomeSection.create({
      id,
      key,
      title: sectionMeta.title || key,
      subtitle: sectionMeta.subtitle || '',
      enabled: true,
      sortOrder: sectionSort++,
      band: sectionConfig.band || 'default',
      viewAll: sectionConfig.viewAll || '',
      fullWidth: sectionConfig.fullWidth || false,
      status: 'active',
    });
  }

  const defaultSettings = [
    { key: 'site_name', label: 'Site Name', value: 'MartPlace', type: 'text', group: 'general' },
    { key: 'site_tagline', label: 'Site Tagline', value: heroData.subtitle || '', type: 'textarea', group: 'general' },
    { key: 'contact_email', label: 'Contact Email', value: 'support@martplace.com', type: 'text', group: 'contact' },
    { key: 'contact_phone', label: 'Contact Phone', value: '+1 800 000 0000', type: 'text', group: 'contact' },
    { key: 'hero_background', label: 'Hero Background Image', value: heroData.backgroundImage || '', type: 'image', group: 'home' },
  ];
  for (const setting of defaultSettings) {
    const existing = await Setting.findOne({ key: setting.key });
    if (existing) continue;
    const id = await getNextId('setting');
    await Setting.create({ id, ...setting, status: 'active' });
  }

  if (heroData.backgroundImage) {
    const existingBanner = await Banner.findOne({ position: 'home_hero' });
    if (!existingBanner) {
      const id = await getNextId('banner');
      await Banner.create({
        id,
        title: heroData.title || 'Welcome',
        subtitle: heroData.subtitle || '',
        image: heroData.backgroundImage,
        link: '/search',
        position: 'home_hero',
        sortOrder: 0,
        status: 'active',
      });
    }
  }

  const categoriesData = readJson('categories.json');
  const highlightMap = categoriesData.highlightCategoryMap || {};
  let highlightSort = 0;
  for (const item of categoriesData.highlightCategories || []) {
    const existing = await HighlightCategory.findOne({ slug: item.id });
    if (existing) continue;
    const mapping = highlightMap[item.id] || {};
    let mappingType = mapping.itemType || 'product';
    if (mapping.useAllProductCategories) mappingType = 'product';
    if (mapping.useAllServiceCategories) mappingType = 'service';
    const id = await getNextId('highlightCategory');
    await HighlightCategory.create({
      id,
      slug: item.id,
      title: item.title || item.name,
      subtitle: item.subtitle || '',
      image: item.image || '',
      mappingType,
      categorySlugs: mapping.categoryIds || [],
      subcategorySlugs: mapping.subcategoryIds || [],
      sortOrder: highlightSort++,
      status: 'active',
    });
  }

  const contentFiles = [
    ['content_header', 'header.json', 'Header Content', 'cms'],
    ['content_footer', 'footer.json', 'Footer Content', 'cms'],
    ['content_hero', 'hero.json', 'Hero & Home Content', 'cms'],
    ['content_catalog', 'catalog.json', 'Catalog Page Content', 'cms'],
    ['content_forms', 'forms.json', 'Form Labels & Fields', 'cms'],
    ['content_buttons', 'buttons.json', 'Button Labels', 'cms'],
    ['content_icons', 'icons.json', 'UI Icons & Labels', 'cms'],
    ['content_dashboards', 'dashboards.json', 'Dashboard Content', 'cms'],
    ['content_sidebar', 'sidebar.json', 'Sidebar Content', 'cms'],
    ['content_categories', 'categories.json', 'Category UI Content', 'cms'],
    ['content_locations', 'locations.json', 'Locations UI Content', 'cms'],
    ['content_brands', 'brands.json', 'Brands Page Content', 'cms'],
    ['content_theme', 'theme.json', 'Theme Tokens', 'cms'],
    ['content_validations', 'validations.json', 'Validation Messages', 'cms'],
    ['content_vendor', 'hero.json', 'Vendor Landing Content', 'cms'],
    ['content_pages', null, 'Static Page Content', 'cms'],
  ];

  const defaultPages = {
    contact: { title: 'Contact Us', description: 'Get in touch with our support team.' },
    privacy: { title: 'Privacy Policy', description: 'Your privacy matters to us.' },
    terms: { title: 'Terms of Service', description: 'Please read our terms carefully.' },
    vendors: { title: 'Vendors', description: 'Browse all registered vendors.' },
    bookings: { title: 'Bookings', description: 'Your service bookings will appear here.' },
  };

  for (const [key, file, label, group] of contentFiles) {
    const existing = await Setting.findOne({ key });
    if (existing) continue;
    let value;
    if (key === 'content_pages') {
      value = JSON.stringify(defaultPages);
    } else if (key === 'content_vendor') {
      const data = readJson(file);
      value = JSON.stringify({ vendor: data.vendor || {}, startBusiness: data.startBusiness || {}, vendorLanding: data.vendorLanding || {} });
    } else {
      value = JSON.stringify(readJson(file));
    }
    const id = await getNextId('setting');
    await Setting.create({
      id,
      key,
      label,
      value,
      type: 'json',
      group,
      status: 'active',
    });
  }
};

const seed = async () => {
  await Category.syncIndexes();

  const adminExists = await Admin.findOne({ email: 'test@gmail.com' });
  if (!adminExists) {
    const id = await getNextId('admin');
    await Admin.create({
      id,
      name: 'Test Admin',
      email: 'test@gmail.com',
      passwordHash: await bcrypt.hash('123', 10),
      role: 'admin',
      status: 'active',
    });
    console.log('Default admin seeded: test@gmail.com / 123');
  }

  if (await Product.countDocuments()) {
    console.log('Database already seeded');
    await seedCms();
    await seedVendorConfig();
    await Vendor.updateMany(
      { approvalStatus: { $exists: false } },
      { $set: { approvalStatus: 'approved', status: 'active' } },
    );
    return;
  }

  const categoriesData = readJson('categories.json');
  const productsData = readJson('products.json');
  const servicesData = readJson('services.json');
  const brandsData = readJson('brands.json');
  const reviewsData = readJson('reviews.json');
  const locationsData = readJson('locations.json');
  const heroData = readJson('hero.json');

  const brandIdMap = {};
  for (const brand of brandsData.items) {
    const existing = await Brand.findOne({ name: brand.name });
    if (existing) {
      brandIdMap[brand.id] = existing.id;
      continue;
    }
    const id = await getNextId('brand');
    brandIdMap[brand.id] = id;
    await Brand.create({
      id,
      name: brand.name,
      logo: brand.logo,
      coverBanner: brand.coverBanner,
      description: brand.description,
      overview: brand.overview,
      photos: brand.photos || [],
      youtubeLinks: brand.youtubeLinks || [],
      website: brand.website || '',
      contact: brand.contact || {},
      socialMedia: brand.socialMedia || {},
      termsAndConditions: brand.termsAndConditions || '',
      additionalDetails: brand.additionalDetails || '',
      vendorId: null,
      status: 'active',
    });
  }

  let sortOrder = 0;
  for (const cat of categoriesData.productCategories) {
    await ensureCategory({
      slug: cat.id,
      name: cat.name,
      type: 'product',
      icon: cat.icon,
      color: cat.color,
      description: cat.description || '',
      bannerImage: cat.bannerImage || '',
      sortOrder: sortOrder++,
      status: 'active',
    });
  }

  sortOrder = 0;
  for (const cat of categoriesData.serviceCategories) {
    await ensureCategory({
      slug: cat.id,
      name: cat.name,
      type: 'service',
      icon: cat.icon,
      color: cat.color,
      description: cat.description || '',
      bannerImage: cat.bannerImage || '',
      sortOrder: sortOrder++,
      status: 'active',
    });
  }

  for (const [parentSlug, subs] of Object.entries(categoriesData.subcategories || {})) {
    for (const sub of subs) {
      const existing = await Subcategory.findOne({ slug: sub.id, parentSlug });
      if (existing) continue;
      const id = await getNextId('subcategory');
      await Subcategory.create({
        id,
        slug: sub.id,
        parentSlug,
        name: sub.name,
        icon: sub.icon,
        color: sub.color,
        status: 'active',
      });
    }
  }

  for (const loc of locationsData.locations) {
    const existing = await Location.findOne({ slug: loc.id });
    if (existing) continue;
    const id = await getNextId('location');
    await Location.create({
      id,
      slug: loc.id,
      name: loc.name,
      icon: loc.icon,
      lat: loc.lat,
      lng: loc.lng,
      status: 'active',
    });
  }

  const productIdMap = {};
  for (const item of productsData.items) {
    const id = await getNextId('product');
    productIdMap[item.id] = id;
    await Product.create({
      id,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory || '',
      brandId: brandIdMap[item.brandId] || null,
      type: item.type || 'New',
      price: item.price,
      description: item.description || '',
      image: item.image || '',
      gallery: item.gallery || [],
      youtubeLinks: item.youtubeLinks || [],
      specifications: item.specifications || {},
      availability: item.availability || 'in_stock',
      contactPhone: item.contactPhone || '',
      contactEmail: item.contactEmail || '',
      vendorId: null,
      vendorName: item.vendorName || '',
      location: item.location || '',
      locationId: item.locationId || '',
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      status: 'active',
    });
  }

  const serviceIdMap = {};
  for (const item of servicesData.items) {
    const id = await getNextId('service');
    serviceIdMap[item.id] = id;
    await Service.create({
      id,
      name: item.name,
      category: item.category,
      subcategory: item.subcategory || '',
      brandId: brandIdMap[item.brandId] || null,
      description: item.description || '',
      image: item.image || '',
      gallery: item.gallery || [],
      youtubeLinks: item.youtubeLinks || [],
      contactPhone: item.contactPhone || '',
      contactEmail: item.contactEmail || '',
      workingHours: item.workingHours || '',
      serviceArea: item.serviceArea || '',
      vendorId: null,
      vendorName: item.vendorName || '',
      city: item.city || '',
      locationId: item.locationId || '',
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      status: 'active',
    });
  }

  for (const item of reviewsData.items) {
    const id = await getNextId('review');
    const targetId = item.targetType === 'product'
      ? productIdMap[item.targetId]
      : serviceIdMap[item.targetId];
    if (!targetId) continue;
    await Review.create({
      id,
      targetId,
      targetType: item.targetType,
      userId: null,
      userName: item.userName,
      rating: item.rating,
      comment: item.comment || '',
      status: 'active',
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
    });
  }

  const consultants = heroData.homeContent?.realEstateConsultants?.items || [];
  for (const item of consultants) {
    const existing = await Consultant.findOne({ name: item.name, company: item.company });
    if (existing) continue;
    const id = await getNextId('consultant');
    await Consultant.create({
      id,
      name: item.name,
      company: item.company,
      experience: item.experience,
      rating: item.rating || 0,
      reviewCount: item.reviewCount || 0,
      city: item.city || '',
      locationId: item.locationId || '',
      image: item.image || '',
      phone: item.phone || '',
      status: 'active',
    });
  }

  await seedCms();
  await seedVendorConfig();
  await Vendor.updateMany(
    { approvalStatus: { $exists: false } },
    { $set: { approvalStatus: 'approved', status: 'active' } },
  );
  console.log('Database seeded successfully');
};

const seedVendorConfig = async () => {
  const data = readJson('vendorRegistration.json');
  const sectionIdByKey = {};

  for (const step of data.steps || []) {
    const existing = await VendorRegStep.findOne({ key: step.key });
    if (existing) continue;
    const id = await getNextId('vendorRegStep');
    await VendorRegStep.create({
      id,
      key: step.key,
      title: step.title,
      subtitle: step.subtitle || '',
      stepType: step.stepType || 'form',
      termsType: step.termsType || '',
      sortOrder: step.sortOrder ?? 0,
      status: 'active',
    });
  }

  for (const section of data.sections || []) {
    const existing = await VendorFormSection.findOne({ stepKey: section.stepKey, title: section.title });
    if (existing) {
      sectionIdByKey[`${section.stepKey}:${section.sortOrder}`] = existing.id;
      continue;
    }
    const id = await getNextId('vendorFormSection');
    sectionIdByKey[`${section.stepKey}:${section.sortOrder}`] = id;
    await VendorFormSection.create({
      id,
      stepKey: section.stepKey,
      title: section.title,
      description: section.description || '',
      sortOrder: section.sortOrder ?? 0,
      status: 'active',
    });
  }

  for (const field of data.fields || []) {
    const existing = await VendorFormField.findOne({ stepKey: field.stepKey, name: field.name });
    if (existing) continue;
    const sectionId = sectionIdByKey[`${field.stepKey}:${field.sectionSortOrder}`];
    const id = await getNextId('vendorFormField');
    await VendorFormField.create({
      id,
      stepKey: field.stepKey,
      sectionId: sectionId || null,
      name: field.name,
      label: field.label,
      type: field.type,
      placeholder: field.placeholder || '',
      helpText: field.helpText || '',
      required: !!field.required,
      defaultValue: field.defaultValue || '',
      options: field.options || [],
      optionsKey: field.optionsKey || '',
      validation: field.validation || {},
      showWhen: field.showWhen || null,
      sortOrder: field.sortOrder ?? 0,
      status: 'active',
    });
  }

  for (const terms of data.terms || []) {
    const existing = await VendorTerms.findOne({ type: terms.type });
    if (existing) continue;
    const id = await getNextId('vendorTerms');
    await VendorTerms.create({
      id,
      type: terms.type,
      title: terms.title,
      content: terms.content,
      acceptanceLabel: terms.acceptanceLabel || '',
      sortOrder: terms.sortOrder ?? 0,
      status: 'active',
    });
  }

  for (const plan of data.plans || []) {
    const existing = await VendorPricingPlan.findOne({ key: plan.key });
    if (existing) continue;
    const id = await getNextId('vendorPricingPlan');
    await VendorPricingPlan.create({
      id,
      key: plan.key,
      name: plan.name,
      price: plan.price ?? 0,
      priceLabel: plan.priceLabel || '',
      description: plan.description || '',
      features: plan.features || [],
      highlighted: !!plan.highlighted,
      sortOrder: plan.sortOrder ?? 0,
      status: 'active',
    });
  }

  const existingUi = await Setting.findOne({ key: 'vendor_registration_ui' });
  if (!existingUi && data.ui) {
    const id = await getNextId('setting');
    await Setting.create({
      id,
      key: 'vendor_registration_ui',
      label: 'Vendor Registration UI',
      value: JSON.stringify(data.ui),
      type: 'json',
      group: 'vendor',
      status: 'active',
    });
  }
};

module.exports = seed;
