const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  key: { type: String, required: true, unique: true },
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  type: { type: String, enum: ['text', 'textarea', 'image', 'boolean', 'number', 'json'], default: 'text' },
  group: { type: String, default: 'general' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

settingSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Setting', settingSchema);
