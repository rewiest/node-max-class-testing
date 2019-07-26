const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const feedController = require('../controllers/feed');
const User = require('../models/user');

describe('Feed Controller', function () {

  before(function(done) {
    const MONGODB_URI = 'mongodb+srv://lioncrazed:wrpnst1!@cluster0-ef34a.mongodb.net/test-messages?retryWrites=true&w=majority';
    mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true })
      .then(result => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a'
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  it('should add a created post to the posts of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A test post.',
      },
      file: {
        path: 'abc'
      },
      userId: '5c0f66b979af55031b34728a'
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };
    feedController.createPost(req, res, () => {}).then(savedUser => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });

  afterEach(function() {});

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect()
      })
      .then(() => {
        done();
      });
  });

});
