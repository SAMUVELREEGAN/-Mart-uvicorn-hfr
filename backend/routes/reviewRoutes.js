const router = require('express').Router();
const review = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', asyncHandler(review.getByTarget));
router.post('/', authenticateUser, asyncHandler(review.create));

module.exports = router;
