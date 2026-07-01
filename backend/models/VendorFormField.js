const mongoose = require('mongoose');

const vendorFormFieldSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  stepKey: { type: String, required: true, index: true },
  sectionId: { type: Number, index: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['text', 'textarea', 'number', 'email', 'mobile', 'select', 'multiselect', 'radio', 'checkbox', 'date', 'file', 'image'],
    default: 'text',
  },
  placeholder: { type: String, default: '' },
  helpText: { type: String, default: '' },
  required: { type: Boolean, default: false },
  defaultValue: { type: String, default: '' },
  options: { type: [mongoose.Schema.Types.Mixed], default: [] },
  optionsKey: { type: String, default: '' },
  validation: { type: mongoose.Schema.Types.Mixed, default: {} },
  showWhen: { type: mongoose.Schema.Types.Mixed, default: null },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

vendorFormFieldSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('VendorFormField', vendorFormFieldSchema);
