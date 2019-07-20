const express = require('express');

const authController = require('../controllers/auth');
const authValidator = require('../validators/auth');

const router = express.Router();

router.put('/signup', authValidator.signup, authController.signup);

router.put('/login', authController.login);

module.exports = router;