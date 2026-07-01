const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, default: '', index: true },
  brandId: { type: Number, index: true },
  type: { type: String, default: 'New' },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  gallery: [{ type: String }],
  youtubeLinks: [{ type: String }],
  specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  availability: { type: String, default: 'in_stock' },
  contactPhone: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  vendorId: { type: Number, index: true },
  vendorName: { type: String, default: '' },
  location: { type: String, default: '' },
  locationId: { type: String, default: '', index: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

productSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);
