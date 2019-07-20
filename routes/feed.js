const express = require('express');

const feedController = require('../controllers/feed');
const feedValidator = require('../validators/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts);

router.get('/post/:postId', isAuth, feedController.getPost);

router.post('/post', isAuth, feedValidator.createPost, feedController.createPost);

router.put('/post/:postId', isAuth, feedValidator.updatePost, feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
