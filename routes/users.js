const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const userController = require('../controllers/UserController');

/* GET users listing. */
router.get('/', function (req, res) {
  res.redirect('/login');
});
router.route('/login').post(authController.login);
router.route('/register').post(userController.register);

router.post('/logout', authController.logout);

module.exports = router;
