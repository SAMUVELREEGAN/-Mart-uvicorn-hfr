const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  slug: { type: String, required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['product', 'service', 'highlight'], required: true, index: true },
  icon: { type: String, default: '' },
  color: { type: String, default: '#2563eb' },
  description: { type: String, default: '' },
  bannerImage: { type: String, default: '' },
  image: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  path: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  subscriptionType: { type: String, enum: ['free', 'paid'], default: 'free' },
  price: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

categorySchema.index({ slug: 1, type: 1 }, { unique: true });

categorySchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Category', categorySchema);
