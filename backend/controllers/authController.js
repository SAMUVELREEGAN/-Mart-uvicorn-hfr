const bcrypt = require('bcrypt');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const { getNextId } = require('../utils/idGenerator');
const {
  signAccessToken,
  signRefreshToken,
  storeRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  setRefreshCookie,
  clearRefreshCookie,
} = require('../utils/tokenService');
const { success, error } = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const issueTokens = async (entity, type, req, res) => {
  const payload = {
    id: entity.id,
    email: entity.email,
    role: entity.role,
    type,
  };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await storeRefreshToken({ userId: entity.id, userType: type, token: refreshToken, req });
  setRefreshCookie(res, refreshToken);
  return { accessToken, user: entity.toJSON() };
};

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return error(res, 'Email already registered', 409);
  const passwordHash = await bcrypt.hash(password, 10);
  const id = await getNextId('user');
  const user = await User.create({ id, name, email, phone, passwordHash });
  const tokens = await issueTokens(user, 'user', req, res);
  return success(res, tokens, 'Registration successful', 201);
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, status: 'active' });
  if (!user) return error(res, 'Invalid credentials', 401);
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return error(res, 'Invalid credentials', 401);
  const tokens = await issueTokens(user, 'user', req, res);
  return success(res, tokens, 'Login successful');
});

exports.registerVendor = asyncHandler(async (req, res) => {
  const { businessName, ownerName, email, phone, address, category, password, businessType } = req.body;
  const exists = await Vendor.findOne({ email });
  if (exists) return error(res, 'Email already registered', 409);
  const passwordHash = await bcrypt.hash(password, 10);
  const id = await getNextId('vendor');
  const vendor = await Vendor.create({
    id, businessName, ownerName, email, phone, address, category,
    passwordHash, businessType: businessType || 'both',
    approvalStatus: 'incomplete',
    status: 'inactive',
  });
  const tokens = await issueTokens(vendor, 'vendor', req, res);
  return success(res, tokens, 'Vendor registered', 201);
});

exports.loginVendor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const vendor = await Vendor.findOne({ email });
  if (!vendor) return error(res, 'Invalid credentials', 401);
  let match = await bcrypt.compare(password, vendor.passwordHash);
  if (!match && vendor.userId) {
    const user = await User.findOne({ id: vendor.userId });
    if (user) match = await bcrypt.compare(password, user.passwordHash);
  }
  if (!match) return error(res, 'Invalid credentials', 401);
  const tokens = await issueTokens(vendor, 'vendor', req, res);
  return success(res, tokens, 'Login successful');
});

exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, status: 'active' });
  if (!admin) return error(res, 'Invalid credentials', 401);
  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) return error(res, 'Invalid credentials', 401);
  const tokens = await issueTokens(admin, 'admin', req, res);
  return success(res, tokens, 'Admin login successful');
});

exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return error(res, 'Refresh token missing', 401);
  const { accessToken, refreshToken } = await rotateRefreshToken(token, req);
  setRefreshCookie(res, refreshToken);
  return success(res, { accessToken }, 'Token refreshed');
});

exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  await revokeRefreshToken(token);
  if (req.user) {
    await revokeAllUserTokens(req.user.id, req.user.type || req.user.role);
  }
  clearRefreshCookie(res);
  return success(res, null, 'Logged out');
});

exports.me = asyncHandler(async (req, res) => {
  const { id, type, role } = req.user;
  const userType = type || role;
  let entity;
  if (userType === 'admin') entity = await Admin.findOne({ id });
  else if (userType === 'vendor') entity = await Vendor.findOne({ id });
  else entity = await User.findOne({ id });
  if (!entity) return error(res, 'User not found', 404);
  const payload = entity.toJSON();
  if (userType === 'user') {
    const linkedVendor = await Vendor.findOne({ userId: id });
    if (linkedVendor) payload.linkedVendor = linkedVendor.toJSON();
  }
  return success(res, payload);
});

exports.updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ id: req.user.id });
  if (!admin) return error(res, 'Admin not found', 404);
  const { name, email, password, currentPassword } = req.body;
  if (password) {
    if (!currentPassword) return error(res, 'Current password is required', 400);
    const match = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!match) return error(res, 'Current password is incorrect', 400);
    admin.passwordHash = await bcrypt.hash(password, 10);
  }
  if (name) admin.name = name;
  if (email && email !== admin.email) {
    const exists = await Admin.findOne({ email });
    if (exists) return error(res, 'Email already in use', 409);
    admin.email = email;
  }
  await admin.save();
  return success(res, admin.toJSON(), 'Profile updated');
});

exports.enableVendor = asyncHandler(async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  if (!user) return error(res, 'User not found', 404);
  let vendor = await Vendor.findOne({ userId: user.id });
  if (!vendor) {
    const id = await getNextId('vendor');
    const passwordHash = req.body.password
      ? await bcrypt.hash(req.body.password, 10)
      : user.passwordHash;
    vendor = await Vendor.create({
      id,
      userId: user.id,
      email: user.email,
      ownerName: user.name,
      businessName: req.body.businessName || user.name,
      phone: user.phone,
      passwordHash,
      businessType: req.body.businessType || 'both',
      approvalStatus: 'incomplete',
      status: 'inactive',
    });
  }
  return success(res, vendor.toJSON(), 'Vendor enabled');
});
