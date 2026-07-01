const Vendor = require('../models/Vendor');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

const VENDOR_FIELD_MAP = {
  fullName: 'ownerName',
  ownerName: 'ownerName',
  mobile: 'phone',
  phone: 'phone',
  email: 'email',
  address: 'address',
  city: 'city',
  state: 'state',
  pincode: 'pincode',
  profilePhoto: 'profilePhoto',
  businessName: 'businessName',
  businessType: 'businessType',
  productCategories: 'productCategories',
  serviceCategories: 'serviceCategories',
  businessAddress: 'address',
  gst: 'gst',
  businessDescription: 'businessDescription',
  logo: 'logo',
};

async function resolveVendor(req) {
  const { id, type, role } = req.user;
  const userType = type || role;
  if (userType === 'vendor') return Vendor.findOne({ id });
  if (userType === 'user') return Vendor.findOne({ userId: id });
  return null;
}

function applyFieldValues(vendor, values) {
  Object.entries(values).forEach(([key, value]) => {
    const mapped = VENDOR_FIELD_MAP[key];
    if (mapped && value !== undefined && value !== '') {
      vendor[mapped] = value;
    }
  });
  if (values.productCategories && !Array.isArray(values.productCategories)) {
    vendor.productCategories = [values.productCategories].filter(Boolean);
  }
  if (values.serviceCategories && !Array.isArray(values.serviceCategories)) {
    vendor.serviceCategories = [values.serviceCategories].filter(Boolean);
  }
  if (Array.isArray(values.productCategories)) vendor.productCategories = values.productCategories;
  if (Array.isArray(values.serviceCategories)) vendor.serviceCategories = values.serviceCategories;
  if (values.category) vendor.category = values.category;
}

exports.getMyRegistration = asyncHandler(async (req, res) => {
  const vendor = await resolveVendor(req);
  if (!vendor) return error(res, 'Vendor profile not found', 404);
  return success(res, vendor.toJSON());
});

exports.saveRegistration = asyncHandler(async (req, res) => {
  const vendor = await resolveVendor(req);
  if (!vendor) return error(res, 'Vendor profile not found', 404);
  if (vendor.approvalStatus === 'pending') return error(res, 'Registration already submitted', 400);
  if (vendor.approvalStatus === 'approved') return error(res, 'Registration already approved', 400);

  const { stepIndex, values = {} } = req.body;
  applyFieldValues(vendor, values);
  vendor.registrationData = { ...vendor.registrationData, ...values };
  if (typeof stepIndex === 'number') vendor.registrationStep = stepIndex;
  await vendor.save();
  return success(res, vendor.toJSON(), 'Progress saved');
});

exports.submitRegistration = asyncHandler(async (req, res) => {
  const vendor = await resolveVendor(req);
  if (!vendor) return error(res, 'Vendor profile not found', 404);
  if (vendor.approvalStatus === 'pending') return error(res, 'Registration already submitted', 400);
  if (vendor.approvalStatus === 'approved') return error(res, 'Registration already approved', 400);

  const { values = {}, selectedPlanId, acceptBusinessTerms, acceptPlatformTerms } = req.body;
  if (!acceptBusinessTerms || !acceptPlatformTerms) {
    return error(res, 'You must accept all terms and conditions', 400);
  }
  if (!selectedPlanId) return error(res, 'Please select a pricing plan', 400);

  applyFieldValues(vendor, values);
  vendor.registrationData = { ...vendor.registrationData, ...values };
  vendor.selectedPlanId = Number(selectedPlanId);
  vendor.approvalStatus = 'pending';
  vendor.status = 'inactive';
  vendor.rejectionReason = '';
  await vendor.save();
  return success(res, vendor.toJSON(), 'Registration submitted for approval');
});
