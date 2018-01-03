const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const bcrypt = require('bcryptjs');

const config = require('../config/index');
const User = require('../models/User');

exports.login = (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.findOne({ email: req.body.email })
      .then(user => {
        const hassPassword = user.password;
        if (bcrypt.compareSync(req.body.password, hassPassword)) {
          return user;
        }
        throw new Error('Login Unsuccessful!');
      })
      .then(user => {
        console.log('Login successful.');
        const token = jwt.sign(
          {
            email: user.email
          },
          config.jwtSecret,
          {
            expiresIn: config.jwtExpiresIn
          }
        );
        return res.json({
          token,
          email: user.email
        });
      })
      .catch(err => {
        const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
        return next(error);
      });
  }
};

exports.logout = (req, res) => {
  req.logout();
};
