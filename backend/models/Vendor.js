const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  userId: { type: Number, index: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  businessName: { type: String, required: true },
  ownerName: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  category: { type: String, default: '' },
  businessType: { type: String, enum: ['product', 'service', 'both'], default: 'both' },
  productCategories: { type: [String], default: [] },
  serviceCategories: { type: [String], default: [] },
  gst: { type: String, default: '' },
  businessDescription: { type: String, default: '' },
  logo: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  registrationData: { type: mongoose.Schema.Types.Mixed, default: {} },
  selectedPlanId: { type: Number },
  registrationStep: { type: Number, default: 0 },
  approvalStatus: {
    type: String,
    enum: ['incomplete', 'pending', 'approved', 'rejected'],
    default: 'incomplete',
  },
  rejectionReason: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'vendor' },
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
}, { timestamps: true });

vendorSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

module.exports = mongoose.model('Vendor', vendorSchema);
