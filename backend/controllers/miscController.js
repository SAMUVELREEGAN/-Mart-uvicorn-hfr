const Location = require('../models/Location');
const Consultant = require('../models/Consultant');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');
const { createCrudController } = require('./crudFactory');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { getNextId } = require('../utils/idGenerator');

const locationCrud = createCrudController(Location, 'location', ['name', 'slug']);
exports.listLocations = locationCrud.list;
exports.getLocation = locationCrud.getOne;
exports.createLocation = locationCrud.create;
exports.updateLocation = locationCrud.update;
exports.removeLocation = locationCrud.remove;
exports.toggleLocationStatus = locationCrud.toggleStatus;
exports.getAllLocations = asyncHandler(async (req, res) => {
  const items = await Location.find({ status: 'active' }).sort('id');
  return success(res, items.map((i) => i.toJSON()));
});

const consultantCrud = createCrudController(Consultant, 'consultant', ['name', 'company', 'city']);
exports.listConsultants = consultantCrud.list;
exports.getConsultant = consultantCrud.getOne;
exports.createConsultant = consultantCrud.create;
exports.updateConsultant = consultantCrud.update;
exports.removeConsultant = consultantCrud.remove;
exports.toggleConsultantStatus = consultantCrud.toggleStatus;
exports.getAllConsultants = asyncHandler(async (req, res) => {
  const query = { status: 'active' };
  if (req.query.locationId) query.locationId = req.query.locationId;
  const items = await Consultant.find(query).sort('id');
  return success(res, items.map((i) => i.toJSON()));
});

const userCrud = createCrudController(User, 'user', ['name', 'email']);
exports.listUsers = userCrud.list;
exports.getUser = userCrud.getOne;
exports.updateUser = userCrud.update;
exports.removeUser = userCrud.remove;
exports.toggleUserStatus = userCrud.toggleStatus;

const vendorCrud = createCrudController(Vendor, 'vendor', ['businessName', 'email', 'ownerName']);
exports.listVendors = vendorCrud.list;
exports.getVendor = vendorCrud.getOne;
exports.updateVendor = vendorCrud.update;
exports.removeVendor = vendorCrud.remove;
exports.toggleVendorStatus = vendorCrud.toggleStatus;
exports.approveVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ id: Number(req.params.id) });
  if (!vendor) return res.status(404).json({ success: false, message: 'Not found' });
  vendor.approvalStatus = 'approved';
  vendor.status = 'active';
  vendor.rejectionReason = '';
  await vendor.save();
  return success(res, vendor.toJSON(), 'Vendor approved');
});
exports.rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ id: Number(req.params.id) });
  if (!vendor) return res.status(404).json({ success: false, message: 'Not found' });
  vendor.approvalStatus = 'rejected';
  vendor.status = 'inactive';
  vendor.rejectionReason = req.body.reason || 'Application rejected';
  await vendor.save();
  return success(res, vendor.toJSON(), 'Vendor rejected');
});
exports.getAllVendors = asyncHandler(async (req, res) => {
  const items = await Vendor.find({ status: 'active', approvalStatus: 'approved' }).sort('id');
  return success(res, items.map((i) => i.toJSON()));
});

const adminCrud = createCrudController(Admin, 'admin', ['name', 'email']);
exports.listAdmins = adminCrud.list;
exports.getAdmin = adminCrud.getOne;
exports.updateAdmin = adminCrud.update;
exports.removeAdmin = adminCrud.remove;
exports.toggleAdminStatus = adminCrud.toggleStatus;

exports.createAdmin = asyncHandler(async (req, res) => {
  const bcrypt = require('bcrypt');
  const { name, email, password } = req.body;
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already exists' });
  const id = await getNextId('admin');
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ id, name, email, passwordHash, status: 'active' });
  return success(res, admin.toJSON(), 'Admin created', 201);
});
