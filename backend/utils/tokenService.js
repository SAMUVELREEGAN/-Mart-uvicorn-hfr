const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

const signAccessToken = (payload) => jwt.sign(
  payload,
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
);

const signRefreshToken = (payload) => jwt.sign(
  payload,
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const storeRefreshToken = async ({ userId, userType, token, req }) => {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    userId,
    userType,
    tokenHash,
    expiresAt,
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip,
  });
};

const rotateRefreshToken = async (oldToken, req) => {
  const tokenHash = hashToken(oldToken);
  const stored = await RefreshToken.findOne({ tokenHash, revoked: false });
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error('Invalid refresh token');
  }
  stored.revoked = true;
  await stored.save();

  const payload = jwt.verify(oldToken, process.env.REFRESH_TOKEN_SECRET);
  const accessToken = signAccessToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
    type: payload.type,
  });
  const refreshToken = signRefreshToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
    type: payload.type,
  });
  await storeRefreshToken({
    userId: payload.id,
    userType: payload.type,
    token: refreshToken,
    req,
  });
  return { accessToken, refreshToken, payload };
};

const revokeRefreshToken = async (token) => {
  if (!token) return;
  const tokenHash = hashToken(token);
  await RefreshToken.updateOne({ tokenHash }, { revoked: true });
};

const revokeAllUserTokens = async (userId, userType) => {
  await RefreshToken.updateMany({ userId, userType }, { revoked: true });
};

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  storeRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  setRefreshCookie,
  clearRefreshCookie,
};
