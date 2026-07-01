const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  userType: { type: String, enum: ['user', 'vendor', 'admin'], required: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  userAgent: String,
  ip: String,
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
