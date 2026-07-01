const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  key: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  band: { type: String, default: 'default' },
  viewAll: { type: String, default: '' },
  fullWidth: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

homeSectionSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('HomeSection', homeSectionSchema);
