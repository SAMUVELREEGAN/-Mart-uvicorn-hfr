const { body } = require('express-validator');
const auth = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate, authenticateUser, authenticateAdmin } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = require('express').Router();

router.post('/register', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').optional().trim(),
], validate, auth.registerUser);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], validate, auth.loginUser);

router.post('/vendor/register', [
  body('businessName').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], validate, auth.registerVendor);

router.post('/vendor/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], validate, auth.loginVendor);

router.post('/admin/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], validate, auth.adminLogin);

router.post('/refresh', auth.refresh);
router.post('/logout', authenticateUser, auth.logout);
router.get('/me', authenticateUser, auth.me);
router.put('/admin/profile', authenticateAdmin, [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('currentPassword').optional().notEmpty(),
], validate, auth.updateAdminProfile);
router.post('/vendor/enable', authenticateUser, auth.enableVendor);

module.exports = router;
