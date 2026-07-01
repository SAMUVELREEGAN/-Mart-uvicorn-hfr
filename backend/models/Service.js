const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, default: '', index: true },
  brandId: { type: Number, index: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  gallery: [{ type: String }],
  youtubeLinks: [{ type: String }],
  contactPhone: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  workingHours: { type: String, default: '' },
  serviceArea: { type: String, default: '' },
  price: { type: Number },
  vendorId: { type: Number, index: true },
  vendorName: { type: String, default: '' },
  city: { type: String, default: '' },
  locationId: { type: String, default: '', index: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

serviceSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Service', serviceSchema);
