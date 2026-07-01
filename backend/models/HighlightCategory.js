const mongoose = require('mongoose');

const highlightCategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  mappingType: { type: String, enum: ['product', 'service', 'both'], required: true },
  categorySlugs: [{ type: String }],
  subcategorySlugs: [{ type: String }],
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  detailsPageTemplate: {
    type: String,
    enum: ['template1', 'template2', 'template3', 'template4', 'template5'],
    default: 'template1',
  },
}, { timestamps: true });

highlightCategorySchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('HighlightCategory', highlightCategorySchema);
