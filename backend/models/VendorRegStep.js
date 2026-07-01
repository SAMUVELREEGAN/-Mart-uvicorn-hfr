const mongoose = require('mongoose');

const vendorRegStepSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  stepType: { type: String, enum: ['form', 'terms', 'pricing'], default: 'form' },
  termsType: { type: String, enum: ['business', 'platform', ''], default: '' },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

vendorRegStepSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('VendorRegStep', vendorRegStepSchema);
