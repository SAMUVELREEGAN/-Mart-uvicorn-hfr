const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Service = require('../models/Service');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const crud = createCrudController(Brand, 'brand', ['name', 'description']);

exports.list = crud.list;
exports.getOne = crud.getOne;
exports.create = crud.create;
exports.update = crud.update;
exports.remove = crud.remove;
exports.toggleStatus = crud.toggleStatus;

exports.getAll = asyncHandler(async (req, res) => {
  const items = await Brand.find({ status: 'active' }).sort('id');
  return success(res, items.map((i) => i.toJSON()));
});

exports.getCarousel = asyncHandler(async (req, res) => {
  const items = await Brand.find({ status: 'active' }).sort('id').limit(20);
  return success(res, items.map((b) => ({
    id: b.id,
    name: b.name,
    logo: b.logo,
  })));
});

exports.getBrandProducts = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ id: Number(req.params.id) });
  if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
  const products = await Product.find({ brandId: brand.id, status: 'active' });
  return success(res, products.map((p) => p.toJSON()));
});

exports.getBrandServices = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ id: Number(req.params.id) });
  if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
  const services = await Service.find({ brandId: brand.id, status: 'active' });
  return success(res, services.map((s) => s.toJSON()));
});
