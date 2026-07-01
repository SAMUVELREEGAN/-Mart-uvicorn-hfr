const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  targetId: { type: Number, required: true, index: true },
  targetType: { type: String, enum: ['product', 'service'], required: true, index: true },
  userId: { type: Number, index: true },
  userName: { type: String, default: 'Anonymous' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

reviewSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Review', reviewSchema);
