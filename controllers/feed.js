const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments()
    const posts = await Post.find()
      .populate('creator')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: 'Fetched posts successfully.',
      posts: posts,
      totalItems: totalItems
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: 'Post fetched.',
      post: post
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  try {
    const saveResult = await post.save();
    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(post);
    const pushResult = await user.save();
    res.status(201).json({
      message: 'Post successfully created!',
      post: post,
      creator: { _id: creator._id, name: creator.name }
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No image picked.');
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const result = await post.save();
    res.status(200).json({
      message: 'Post successfully updated!',
      post: result
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    const findResult = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    const saveResult = await user.save();
    res.status(200).json({
      message: 'Post successfully deleted!'
    });
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => {
    if (err) {
      console.log(err);
    }
  });
}
