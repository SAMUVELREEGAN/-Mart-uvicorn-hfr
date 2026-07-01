const router = require('express').Router();
const { authenticateAdmin } = require('../middleware/auth');
const product = require('../controllers/productController');
const service = require('../controllers/serviceController');
const brand = require('../controllers/brandController');
const category = require('../controllers/categoryController');
const review = require('../controllers/reviewController');
const misc = require('../controllers/miscController');
const upload = require('../controllers/uploadController');
const uploadMw = require('../middleware/upload');
const highlightCategory = require('../controllers/highlightCategoryController');
const cms = require('../controllers/cmsController');
const vendorConfig = require('../controllers/vendorConfigController');
const asyncHandler = require('../utils/asyncHandler');

router.use(authenticateAdmin);

router.get('/dashboard/stats', asyncHandler(cms.dashboardStats));

const crud = (ctrl, prefix) => {
  router.get(`/${prefix}`, asyncHandler(ctrl.list));
  router.get(`/${prefix}/:id`, asyncHandler(ctrl.getOne));
  router.post(`/${prefix}`, asyncHandler(ctrl.create));
  router.put(`/${prefix}/:id`, asyncHandler(ctrl.update));
  router.delete(`/${prefix}/:id`, asyncHandler(ctrl.remove));
  router.patch(`/${prefix}/:id/status`, asyncHandler(ctrl.toggleStatus));
};

crud(product, 'products');
crud(service, 'services');
crud(brand, 'brands');
crud(category, 'categories');
crud(review, 'reviews');

router.get('/highlight-categories', asyncHandler(highlightCategory.list));
router.get('/highlight-categories/:id', asyncHandler(highlightCategory.getOne));
router.post('/highlight-categories', asyncHandler(highlightCategory.create));
router.put('/highlight-categories/:id', asyncHandler(highlightCategory.update));
router.delete('/highlight-categories/:id', asyncHandler(highlightCategory.remove));
router.patch('/highlight-categories/:id/status', asyncHandler(highlightCategory.toggleStatus));

router.get('/subcategories', asyncHandler(category.listSubcategories));
router.get('/subcategories/:id', asyncHandler(category.getSubcategory));
router.post('/subcategories', asyncHandler(category.createSubcategory));
router.put('/subcategories/:id', asyncHandler(category.updateSubcategory));
router.delete('/subcategories/:id', asyncHandler(category.removeSubcategory));
router.patch('/subcategories/:id/status', asyncHandler(category.toggleSubcategoryStatus));

router.get('/locations', asyncHandler(misc.listLocations));
router.get('/locations/:id', asyncHandler(misc.getLocation));
router.post('/locations', asyncHandler(misc.createLocation));
router.put('/locations/:id', asyncHandler(misc.updateLocation));
router.delete('/locations/:id', asyncHandler(misc.removeLocation));
router.patch('/locations/:id/status', asyncHandler(misc.toggleLocationStatus));

router.get('/consultants', asyncHandler(misc.listConsultants));
router.get('/consultants/:id', asyncHandler(misc.getConsultant));
router.post('/consultants', asyncHandler(misc.createConsultant));
router.put('/consultants/:id', asyncHandler(misc.updateConsultant));
router.delete('/consultants/:id', asyncHandler(misc.removeConsultant));
router.patch('/consultants/:id/status', asyncHandler(misc.toggleConsultantStatus));

router.get('/users', asyncHandler(misc.listUsers));
router.get('/users/:id', asyncHandler(misc.getUser));
router.put('/users/:id', asyncHandler(misc.updateUser));
router.delete('/users/:id', asyncHandler(misc.removeUser));
router.patch('/users/:id/status', asyncHandler(misc.toggleUserStatus));

router.get('/vendors', asyncHandler(misc.listVendors));
router.get('/vendors/:id', asyncHandler(misc.getVendor));
router.put('/vendors/:id', asyncHandler(misc.updateVendor));
router.delete('/vendors/:id', asyncHandler(misc.removeVendor));
router.patch('/vendors/:id/status', asyncHandler(misc.toggleVendorStatus));
router.patch('/vendors/:id/approve', asyncHandler(misc.approveVendor));
router.patch('/vendors/:id/reject', asyncHandler(misc.rejectVendor));

router.get('/vendor-reg-steps', asyncHandler(vendorConfig.listSteps));
router.patch('/vendor-reg-steps/reorder', asyncHandler(vendorConfig.reorderSteps));
router.get('/vendor-reg-steps/:id', asyncHandler(vendorConfig.getStep));
router.post('/vendor-reg-steps', asyncHandler(vendorConfig.createStep));
router.put('/vendor-reg-steps/:id', asyncHandler(vendorConfig.updateStep));
router.delete('/vendor-reg-steps/:id', asyncHandler(vendorConfig.removeStep));
router.patch('/vendor-reg-steps/:id/status', asyncHandler(vendorConfig.toggleStepStatus));

router.get('/vendor-form-sections', asyncHandler(vendorConfig.listSections));
router.patch('/vendor-form-sections/reorder', asyncHandler(vendorConfig.reorderSections));
router.get('/vendor-form-sections/:id', asyncHandler(vendorConfig.getSection));
router.post('/vendor-form-sections', asyncHandler(vendorConfig.createSection));
router.put('/vendor-form-sections/:id', asyncHandler(vendorConfig.updateSection));
router.delete('/vendor-form-sections/:id', asyncHandler(vendorConfig.removeSection));
router.patch('/vendor-form-sections/:id/status', asyncHandler(vendorConfig.toggleSectionStatus));

router.get('/vendor-form-fields', asyncHandler(vendorConfig.listFields));
router.patch('/vendor-form-fields/reorder', asyncHandler(vendorConfig.reorderFields));
router.get('/vendor-form-fields/:id', asyncHandler(vendorConfig.getField));
router.post('/vendor-form-fields', asyncHandler(vendorConfig.createField));
router.put('/vendor-form-fields/:id', asyncHandler(vendorConfig.updateField));
router.delete('/vendor-form-fields/:id', asyncHandler(vendorConfig.removeField));
router.patch('/vendor-form-fields/:id/status', asyncHandler(vendorConfig.toggleFieldStatus));

router.get('/vendor-terms', asyncHandler(vendorConfig.listTerms));
router.patch('/vendor-terms/reorder', asyncHandler(vendorConfig.reorderTerms));
router.get('/vendor-terms/:id', asyncHandler(vendorConfig.getTerms));
router.post('/vendor-terms', asyncHandler(vendorConfig.createTerms));
router.put('/vendor-terms/:id', asyncHandler(vendorConfig.updateTerms));
router.delete('/vendor-terms/:id', asyncHandler(vendorConfig.removeTerms));
router.patch('/vendor-terms/:id/status', asyncHandler(vendorConfig.toggleTermsStatus));

router.get('/vendor-pricing-plans', asyncHandler(vendorConfig.listPlans));
router.patch('/vendor-pricing-plans/reorder', asyncHandler(vendorConfig.reorderPlans));
router.get('/vendor-pricing-plans/:id', asyncHandler(vendorConfig.getPlan));
router.post('/vendor-pricing-plans', asyncHandler(vendorConfig.createPlan));
router.put('/vendor-pricing-plans/:id', asyncHandler(vendorConfig.updatePlan));
router.delete('/vendor-pricing-plans/:id', asyncHandler(vendorConfig.removePlan));
router.patch('/vendor-pricing-plans/:id/status', asyncHandler(vendorConfig.togglePlanStatus));

router.get('/vendor-config/ui', asyncHandler(vendorConfig.getUiConfig));
router.put('/vendor-config/ui', asyncHandler(vendorConfig.updateUiConfig));

router.get('/admins', asyncHandler(misc.listAdmins));
router.get('/admins/:id', asyncHandler(misc.getAdmin));
router.post('/admins', asyncHandler(misc.createAdmin));
router.put('/admins/:id', asyncHandler(misc.updateAdmin));
router.delete('/admins/:id', asyncHandler(misc.removeAdmin));
router.patch('/admins/:id/status', asyncHandler(misc.toggleAdminStatus));

router.get('/orders', asyncHandler(cms.listOrders));
router.get('/orders/:id', asyncHandler(cms.getOrder));
router.post('/orders', asyncHandler(cms.createOrder));
router.put('/orders/:id', asyncHandler(cms.updateOrder));
router.delete('/orders/:id', asyncHandler(cms.removeOrder));
router.patch('/orders/:id/status', asyncHandler(cms.toggleOrderStatus));

router.get('/bookings', asyncHandler(cms.listBookings));
router.get('/bookings/:id', asyncHandler(cms.getBooking));
router.post('/bookings', asyncHandler(cms.createBooking));
router.put('/bookings/:id', asyncHandler(cms.updateBooking));
router.delete('/bookings/:id', asyncHandler(cms.removeBooking));
router.patch('/bookings/:id/status', asyncHandler(cms.toggleBookingStatus));

router.get('/banners', asyncHandler(cms.listBanners));
router.get('/banners/:id', asyncHandler(cms.getBanner));
router.post('/banners', asyncHandler(cms.createBanner));
router.put('/banners/:id', asyncHandler(cms.updateBanner));
router.delete('/banners/:id', asyncHandler(cms.removeBanner));
router.patch('/banners/:id/status', asyncHandler(cms.toggleBannerStatus));

router.get('/faqs', asyncHandler(cms.listFaqs));
router.get('/faqs/:id', asyncHandler(cms.getFaq));
router.post('/faqs', asyncHandler(cms.createFaq));
router.put('/faqs/:id', asyncHandler(cms.updateFaq));
router.delete('/faqs/:id', asyncHandler(cms.removeFaq));
router.patch('/faqs/:id/status', asyncHandler(cms.toggleFaqStatus));

router.get('/home-sections', asyncHandler(cms.listHomeSections));
router.get('/home-sections/:id', asyncHandler(cms.getHomeSection));
router.post('/home-sections', asyncHandler(cms.createHomeSection));
router.put('/home-sections/:id', asyncHandler(cms.updateHomeSection));
router.delete('/home-sections/:id', asyncHandler(cms.removeHomeSection));
router.patch('/home-sections/:id/status', asyncHandler(cms.toggleHomeSectionStatus));

router.get('/settings', asyncHandler(cms.listSettings));
router.get('/settings/:id', asyncHandler(cms.getSetting));
router.post('/settings', asyncHandler(cms.createSetting));
router.put('/settings/:id', asyncHandler(cms.updateSetting));
router.delete('/settings/:id', asyncHandler(cms.removeSetting));
router.patch('/settings/:id/status', asyncHandler(cms.toggleSettingStatus));

router.post('/upload', uploadMw.single('image'), asyncHandler(upload.uploadImage));
router.delete('/upload/:filename', asyncHandler(upload.deleteImage));

module.exports = router;
