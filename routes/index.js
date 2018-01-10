const express = require('express');
const router = express.Router();
const config = require('../config/index');

// const usersRoutes = require('./users');
const productsRoutes = require('./products');
const ordersRoutes = require('./orders');
const cartRoutes = require('./cart');

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.json({ message: 'welcome to homepage' });
});

/* GET about page. */
router.get('/about', function (req, res, next) {
  return res.json({ message: 'welcome to about us page' });
});

// router.use('/user', usersRoutes);
router.use('/products', productsRoutes);
router.use('/cart', config.jwtMiddleware, cartRoutes);
router.use('/orders', config.jwtMiddleware, ordersRoutes);

module.exports = router;
