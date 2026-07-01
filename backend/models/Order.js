const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number },
  name: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  image: { type: String, default: '' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: Number, default: null },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  items: [orderItemSchema],
  total: { type: Number, default: 0 },
  shippingAddress: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

orderSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Order', orderSchema);
