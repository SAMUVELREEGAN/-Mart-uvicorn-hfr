const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  icon: { type: String, default: 'FaLocationDot' },
  lat: { type: Number, default: 0 },
  lng: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

locationSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Location', locationSchema);
