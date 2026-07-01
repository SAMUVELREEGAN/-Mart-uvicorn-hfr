const router = require('express').Router();
const category = require('../controllers/categoryController');
const asyncHandler = require('../utils/asyncHandler');

router.get('/tree', asyncHandler(category.getFullTree));
router.get('/type/:type', asyncHandler(category.getByType));
router.get('/:slug/subcategories', asyncHandler(category.getSubcategories));

module.exports = router;
