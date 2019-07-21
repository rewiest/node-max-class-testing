const express = require('express');

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.put('/signup', authValidator.signup, authController.signup);

router.put('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.put('/status', isAuth, authValidator.updateUserStatus, authController.updateUserStatus);

module.exports = router;