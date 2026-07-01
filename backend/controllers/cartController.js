const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { getNextId } = require('../utils/idGenerator');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

const requireUserAccount = (req, res, next) => {
  const userType = req.user.type || req.user.role;
  if (userType !== 'user') {
    return error(res, 'Please sign in as a customer to use the cart', 403);
  }
  return next();
};

async function enrichCart(cart) {
  const json = cart.toJSON();
  if (!json.items?.length) {
    return { ...json, items: [], subtotal: 0, itemCount: 0 };
  }

  const productIds = json.items.map((item) => item.productId);
  const products = await Product.find({ id: { $in: productIds }, status: 'active' });
  const productMap = Object.fromEntries(products.map((p) => [p.id, p.toJSON()]));

  const items = json.items
    .map((item) => {
      const product = productMap[item.productId];
      if (!product) return null;
      return {
        productId: item.productId,
        quantity: item.quantity,
        product,
        lineTotal: Math.round(product.price * item.quantity * 100) / 100,
      };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...json,
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    itemCount,
  };
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    const id = await getNextId('cart');
    cart = await Cart.create({ id, userId, items: [] });
  }
  return cart;
}

exports.requireUserAccount = requireUserAccount;

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  const enriched = await enrichCart(cart);
  return success(res, enriched);
});

exports.addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = Math.max(1, Number(quantity) || 1);

  const product = await Product.findOne({ id: Number(productId), status: 'active' });
  if (!product) return error(res, 'Product not found', 404);

  const cart = await getOrCreateCart(req.user.id);
  const pid = Number(productId);
  const existing = cart.items.find((item) => item.productId === pid);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({ productId: pid, quantity: qty });
  }

  cart.markModified('items');
  await cart.save();
  const enriched = await enrichCart(cart);
  return success(res, enriched, 'Added to cart');
});

exports.updateItem = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (!qty || qty < 1) return error(res, 'Quantity must be at least 1', 400);

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return error(res, 'Cart not found', 404);

  const item = cart.items.find((i) => i.productId === productId);
  if (!item) return error(res, 'Item not in cart', 404);

  item.quantity = qty;
  cart.markModified('items');
  await cart.save();
  const enriched = await enrichCart(cart);
  return success(res, enriched, 'Cart updated');
});

exports.removeItem = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) return error(res, 'Cart not found', 404);

  const before = cart.items.length;
  cart.items = cart.items.filter((i) => i.productId !== productId);
  if (cart.items.length === before) return error(res, 'Item not in cart', 404);

  cart.markModified('items');
  await cart.save();
  const enriched = await enrichCart(cart);
  return success(res, enriched, 'Item removed');
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return success(res, { items: [], subtotal: 0, itemCount: 0 }, 'Cart cleared');
  }

  cart.items = [];
  cart.markModified('items');
  await cart.save();
  const enriched = await enrichCart(cart);
  return success(res, enriched, 'Cart cleared');
});
