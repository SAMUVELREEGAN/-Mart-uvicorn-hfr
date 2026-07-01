const router = require('express').Router();
const brand = require('../controllers/brandController');
const asyncHandler = require('../utils/asyncHandler');

router.get('/carousel', asyncHandler(brand.getCarousel));
router.get('/', asyncHandler(brand.getAll));
router.get('/:id/products', asyncHandler(brand.getBrandProducts));
router.get('/:id/services', asyncHandler(brand.getBrandServices));
router.get('/:id', asyncHandler(brand.getOne));

module.exports = router;
