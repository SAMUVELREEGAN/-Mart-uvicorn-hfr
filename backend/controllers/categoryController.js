const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const HighlightCategory = require('../models/HighlightCategory');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { getNextId } = require('../utils/idGenerator');

const slugify = (text) => String(text)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const crud = createCrudController(Category, 'category', ['name', 'slug']);

exports.list = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    type,
    sort = '-createdAt',
  } = req.query;

  const query = { type: { $in: ['product', 'service'] } };
  if (type && ['product', 'service'].includes(type)) query.type = type;
  if (status) query.status = status;
  if (search) {
    query.$or = ['name', 'slug'].map((field) => ({
      [field]: { $regex: search, $options: 'i' },
    }));
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Category.find(query).sort(sort).skip(skip).limit(limitNum),
    Category.countDocuments(query),
  ]);

  return success(res, items.map((i) => i.toJSON()), 'Success', 200, {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
});

exports.getOne = crud.getOne;

exports.create = asyncHandler(async (req, res) => {
  const catType = req.body.type;
  if (!['product', 'service'].includes(catType)) {
    return res.status(400).json({ success: false, message: 'Category type must be product or service' });
  }
  const id = await getNextId('category');
  const slug = req.body.slug || slugify(req.body.name);
  const subscriptionType = req.body.subscriptionType === 'paid' ? 'paid' : 'free';
  const price = subscriptionType === 'paid' ? Number(req.body.price) || 0 : 0;
  const item = await Category.create({
    id,
    slug,
    name: req.body.name,
    type: catType,
    icon: req.body.icon || '',
    subscriptionType,
    price,
    status: req.body.status || 'active',
    color: '#2563eb',
    sortOrder: req.body.sortOrder || 0,
  });
  return success(res, item.toJSON(), 'Created', 201);
});

exports.update = asyncHandler(async (req, res) => {
  const subscriptionType = req.body.subscriptionType === 'paid' ? 'paid' : 'free';
  const updates = {
    name: req.body.name,
    icon: req.body.icon,
    status: req.body.status,
    subscriptionType,
    price: subscriptionType === 'paid' ? Number(req.body.price) || 0 : 0,
  };
  if (req.body.slug) updates.slug = req.body.slug;
  const item = await Category.findOneAndUpdate(
    { id: Number(req.params.id), type: { $in: ['product', 'service'] } },
    updates,
    { returnDocument: 'after', runValidators: true }
  );
  if (!item) return res.status(404).json({ success: false, message: 'Not found' });
  return success(res, item.toJSON());
});

exports.remove = crud.remove;
exports.toggleStatus = crud.toggleStatus;

exports.getByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const items = await Category.find({ type, status: 'active' }).sort('sortOrder');
  return success(res, items.map((i) => i.toJSON()));
});

exports.getSubcategories = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const items = await Subcategory.find({ parentSlug: slug, status: 'active' }).sort('id');
  return success(res, items.map((i) => i.toJSON()));
});

exports.getFullTree = asyncHandler(async (req, res) => {
  const [productCategories, serviceCategories, highlights, subcategories] = await Promise.all([
    Category.find({ type: 'product', status: 'active' }).sort('sortOrder'),
    Category.find({ type: 'service', status: 'active' }).sort('sortOrder'),
    HighlightCategory.find({ status: 'active' }).sort('sortOrder'),
    Subcategory.find({ status: 'active' }).sort('id'),
  ]);

  const subMap = {};
  subcategories.forEach((sub) => {
    if (!subMap[sub.parentSlug]) subMap[sub.parentSlug] = [];
    subMap[sub.parentSlug].push(sub.toJSON());
  });

  const highlightCategoryMap = {};
  highlights.forEach((h) => {
    highlightCategoryMap[h.slug] = {
      itemType: h.mappingType,
      categoryIds: h.categorySlugs || [],
      subcategoryIds: h.subcategorySlugs || [],
    };
  });

  const highlightCategories = highlights.map((h) => ({
    ...h.toJSON(),
    id: h.slug,
    name: h.title,
    path: `/category/${h.slug}?type=${h.mappingType === 'both' ? 'both' : h.mappingType === 'service' ? 'service' : 'product'}`,
  }));

  return success(res, {
    productCategories: productCategories.map((c) => c.toJSON()),
    serviceCategories: serviceCategories.map((c) => c.toJSON()),
    highlightCategories,
    highlightCategoryMap,
    subcategoriesMap: subMap,
  });
});

const subCrud = createCrudController(Subcategory, 'subcategory', ['name', 'slug']);

exports.listSubcategories = subCrud.list;
exports.getSubcategory = subCrud.getOne;

exports.createSubcategory = asyncHandler(async (req, res) => {
  const parent = await Category.findOne({
    slug: req.body.parentSlug,
    type: { $in: ['product', 'service'] },
  });
  if (!parent) {
    return res.status(400).json({ success: false, message: 'Parent category not found' });
  }
  const id = await getNextId('subcategory');
  const slug = req.body.slug || slugify(req.body.name);
  const item = await Subcategory.create({
    id,
    slug,
    parentSlug: req.body.parentSlug,
    name: req.body.name,
    icon: req.body.icon || '',
    status: req.body.status || 'active',
    color: '#2563eb',
  });
  return success(res, item.toJSON(), 'Created', 201);
});

exports.updateSubcategory = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name,
    icon: req.body.icon,
    status: req.body.status,
  };
  if (req.body.parentSlug) {
    const parent = await Category.findOne({
      slug: req.body.parentSlug,
      type: { $in: ['product', 'service'] },
    });
    if (!parent) {
      return res.status(400).json({ success: false, message: 'Parent category not found' });
    }
    updates.parentSlug = req.body.parentSlug;
  }
  if (req.body.slug) updates.slug = req.body.slug;
  const item = await Subcategory.findOneAndUpdate(
    { id: Number(req.params.id) },
    updates,
    { returnDocument: 'after', runValidators: true }
  );
  if (!item) return res.status(404).json({ success: false, message: 'Not found' });
  return success(res, item.toJSON());
});

exports.removeSubcategory = subCrud.remove;
exports.toggleSubcategoryStatus = subCrud.toggleStatus;
