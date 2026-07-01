const mongoose = require('mongoose');

const vendorTermsSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  type: { type: String, enum: ['business', 'platform'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  acceptanceLabel: { type: String, default: 'I have read and accept the terms and conditions' },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

vendorTermsSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('VendorTerms', vendorTermsSchema);
