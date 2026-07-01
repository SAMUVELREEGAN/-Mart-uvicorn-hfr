const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const cart = require('../controllers/cartController');
const asyncHandler = require('../utils/asyncHandler');

router.use(authenticateUser);
router.use(cart.requireUserAccount);

router.get('/', asyncHandler(cart.getCart));
router.post('/items', asyncHandler(cart.addItem));
router.patch('/items/:productId', asyncHandler(cart.updateItem));
router.delete('/items/:productId', asyncHandler(cart.removeItem));
router.delete('/', asyncHandler(cart.clearCart));

module.exports = router;
