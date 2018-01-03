const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
// const validate = require('express-validation');
// const config = require('../config/index');
// const paramValidation = require('../config/param-validation');

router.get('/', OrderController.list);
router.post('/create', OrderController.placeOrder);
router.get('/:orderId', OrderController.get);
router.param('orderId', OrderController.load);
module.exports = router;

// config.jwtMiddleware,
// validate(paramValidation.createOrder),
