const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
// const validate = require('express-validation');
// const config = require('../config/index');
// const paramValidation = require('../config/param-validation');

router.get('/', CartController.get);
router.post('/add', CartController.add);
router.post('/subtract', CartController.subtract);
module.exports = router;
