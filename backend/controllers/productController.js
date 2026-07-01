const Product = require('../models/Product');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const crud = createCrudController(Product, 'product', ['name', 'description', 'category']);

exports.list = crud.list;
exports.getOne = crud.getOne;
exports.create = crud.create;
exports.update = crud.update;
exports.remove = crud.remove;
exports.toggleStatus = crud.toggleStatus;

exports.search = asyncHandler(async (req, res) => {
  const {
    q, category, subcategory, locationId, minRating, priceRange, sort, page = 1, limit = 12,
  } = req.query;
  const query = { status: 'active' };
  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (locationId) query.locationId = locationId;
  if (minRating) query.rating = { $gte: Number(minRating) };
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
    ];
  }
  if (priceRange === 'under50') query.price = { $lt: 50 };
  else if (priceRange === '50to100') query.price = { $gte: 50, $lte: 100 };
  else if (priceRange === 'over100') query.price = { $gt: 100 };

  let sortOpt = { createdAt: -1 };
  if (sort === 'name-asc') sortOpt = { name: 1 };
  if (sort === 'name-desc') sortOpt = { name: -1 };
  if (sort === 'price-asc') sortOpt = { price: 1 };
  if (sort === 'price-desc') sortOpt = { price: -1 };
  if (sort === 'rating-desc') sortOpt = { rating: -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(query).sort(sortOpt).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  return success(res, items.map((i) => i.toJSON()), 'Success', 200, {
    page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum),
  });
});

exports.getAll = asyncHandler(async (req, res) => {
  const items = await Product.find({ status: 'active' }).sort('id');
  return success(res, items.map((i) => i.toJSON()));
});
