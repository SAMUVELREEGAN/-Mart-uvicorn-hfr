const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  id: { type: Number, unique: true, index: true },
  bookingNumber: { type: String, required: true, unique: true },
  serviceId: { type: Number, default: null },
  serviceName: { type: String, default: '' },
  userId: { type: Number, default: null },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  bookingDate: { type: Date, default: Date.now },
  timeSlot: { type: String, default: '' },
  notes: { type: String, default: '' },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

bookingSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
