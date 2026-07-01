export function getVendorPostAuthPath(vendor) {
  if (!vendor) return '/vendor/registration';
  if (vendor.approvalStatus === 'approved' && vendor.status === 'active') {
    return '/vendor/dashboard';
  }
  if (vendor.approvalStatus === 'pending') return '/vendor/pending-approval';
  return '/vendor/registration';
}

export function isVendorDashboardReady(vendor) {
  return vendor?.approvalStatus === 'approved' && vendor?.status === 'active';
}
