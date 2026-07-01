const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  slug: { type: String, required: true, index: true },
  parentSlug: { type: String, required: true, index: true },
  name: { type: String, required: true },
  icon: { type: String, default: '' },
  color: { type: String, default: '#2563eb' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

subcategorySchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
