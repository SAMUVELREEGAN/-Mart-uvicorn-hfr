const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  coverBanner: { type: String, default: '' },
  description: { type: String, default: '' },
  overview: { type: String, default: '' },
  photos: [{ type: String }],
  youtubeLinks: [{ type: String }],
  website: { type: String, default: '' },
  contact: {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  termsAndConditions: { type: String, default: '' },
  additionalDetails: { type: String, default: '' },
  vendorId: { type: Number, index: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

brandSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Brand', brandSchema);
