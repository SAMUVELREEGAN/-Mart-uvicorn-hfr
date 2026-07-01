const router = require('express').Router();
const service = require('../controllers/serviceController');
const asyncHandler = require('../utils/asyncHandler');

router.get('/search', asyncHandler(service.search));
router.get('/', asyncHandler(service.getAll));
router.get('/:id', asyncHandler(service.getOne));

module.exports = router;
