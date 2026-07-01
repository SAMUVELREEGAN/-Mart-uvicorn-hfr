const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const vendorReg = require('../controllers/vendorRegistrationController');
const asyncHandler = require('../utils/asyncHandler');

router.use(authenticateUser);

router.get('/registration', asyncHandler(vendorReg.getMyRegistration));
router.patch('/registration', asyncHandler(vendorReg.saveRegistration));
router.post('/registration/submit', asyncHandler(vendorReg.submitRegistration));

module.exports = router;
