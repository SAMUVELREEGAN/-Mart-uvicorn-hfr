const mongoose = require('mongoose');

const vendorFormSectionSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  stepKey: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

vendorFormSectionSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('VendorFormSection', vendorFormSectionSchema);
