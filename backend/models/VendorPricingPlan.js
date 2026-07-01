const mongoose = require('mongoose');

const vendorPricingPlanSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  priceLabel: { type: String, default: '' },
  description: { type: String, default: '' },
  features: { type: [String], default: [] },
  highlighted: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

vendorPricingPlanSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('VendorPricingPlan', vendorPricingPlanSchema);
