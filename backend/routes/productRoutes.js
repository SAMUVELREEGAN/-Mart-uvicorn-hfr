const router = require('express').Router();
const product = require('../controllers/productController');
const asyncHandler = require('../utils/asyncHandler');

router.get('/search', asyncHandler(product.search));
router.get('/', asyncHandler(product.getAll));
router.get('/:id', asyncHandler(product.getOne));

module.exports = router;
