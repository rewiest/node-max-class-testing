const { check } = require('express-validator');

exports.createPost = [
  check('title')
    .trim()
    .isLength({ min: 5 }),
  check('content')
    .trim()
    .isLength({ min: 5 })
];
