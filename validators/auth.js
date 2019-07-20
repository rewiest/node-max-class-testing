const { check } = require('express-validator');

const User = require('../models/user');

exports.signup = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      return User
        .findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email address already exists.');
          }
        })
    })
    .normalizeEmail(),
  check('password')
    .trim()
    .isLength({ min: 4 }),
  check('name')
    .trim()
    .not()
    .isEmpty()
];
