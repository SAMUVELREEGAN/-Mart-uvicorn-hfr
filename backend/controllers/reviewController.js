const Review = require('../models/Review');
const Product = require('../models/Product');
const Service = require('../models/Service');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { getNextId } = require('../utils/idGenerator');

const crud = createCrudController(Review, 'review', ['comment', 'userName']);

exports.list = crud.list;
exports.getOne = crud.getOne;
exports.update = crud.update;
exports.remove = crud.remove;
exports.toggleStatus = crud.toggleStatus;

const updateTargetRating = async (targetId, targetType) => {
  const reviews = await Review.find({ targetId, targetType, status: 'active' });
  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const Model = targetType === 'product' ? Product : Service;
  await Model.updateOne({ id: targetId }, { rating: Math.round(avg * 10) / 10, reviewCount: reviews.length });
};

exports.getByTarget = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.query;
  const reviews = await Review.find({ targetId: Number(targetId), targetType, status: 'active' }).sort('-createdAt');
  return success(res, reviews.map((r) => r.toJSON()));
});

exports.create = asyncHandler(async (req, res) => {
  const id = await getNextId('review');
  const review = await Review.create({
    id,
    ...req.body,
    targetId: Number(req.body.targetId),
    userId: req.user?.id,
    userName: req.body.userName || req.user?.email?.split('@')[0] || 'User',
  });
  await updateTargetRating(review.targetId, review.targetType);
  return success(res, review.toJSON(), 'Review created', 201);
});
