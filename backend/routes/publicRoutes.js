const router = require('express').Router();
const misc = require('../controllers/miscController');
const cms = require('../controllers/cmsController');
const vendorConfig = require('../controllers/vendorConfigController');
const asyncHandler = require('../utils/asyncHandler');

router.get('/cms/site', asyncHandler(cms.getPublicSite));
router.get('/vendor-config', asyncHandler(vendorConfig.getPublicConfig));
router.get('/locations', asyncHandler(misc.getAllLocations));
router.get('/consultants', asyncHandler(misc.getAllConsultants));
router.get('/vendors', asyncHandler(misc.getAllVendors));

module.exports = router;
