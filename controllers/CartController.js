const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Cart = require('../models/Cart');

/**
 * add product to cart.
 * @property {string} req.query.email
 * @property {string} req.query.product_id
 * @property {number} req.query.qty
 * @returns {Cart}
 */
exports.add = function (req, res, next) {
  const { email, product_id } = req.body;
  const qty = Number.parseInt(req.body.qty);
  console.log('qty: ', qty);
  Cart.findOne({ email: email })
    .exec()
    .then(cart => {
      if (!cart && qty <= 0) {
        throw new Error('Invalid request');
      } else if (cart) {
        const indexFound = cart.items.findIndex(item => {
          return item.product_id === product_id;
        });
        if (indexFound !== -1 && qty <= 0) {
          cart.items.splice(indexFound, 1);
        } else if (indexFound !== -1) {
          cart.items[indexFound].qty = cart.items[indexFound].qty + qty;
        } else if (qty > 0) {
          cart.items.push({
            product_id: product_id,
            qty: qty
          });
        } else {
          throw new Error('Invalid request');
        }
        return cart.save();
      } else {
        const cartData = {
          email: email,
          items: [
            {
              product_id: product_id,
              qty: qty
            }
          ]
        };
        cart = new Cart(cartData);
        return cart.save();
      }
    })
    .then(savedCart => res.json(savedCart))
    .catch(err => {
      let error;
      if (err.message === 'Invalid request') {
        error = new APIError(err.message, httpStatus.BAD_REQUEST, true);
      } else {
        error = new APIError(err.message, httpStatus.NOT_FOUND);
      }
      return next(error);
    });
};

/**
 * add product to cart.
 * @property {string} req.query.email
 * @property {string} req.query.product_id
 * @property {number} req.query.qty
 * @returns {Cart}
 */
exports.subtract = function (req, res, next) {
  const { email, product_id } = req.body;
  const qty = Number.parseInt(req.body.qty);
  console.log('qty: ', qty);
  Cart.findOne({ email: email })
    .exec()
    .then(cart => {
      if (!cart || qty <= 0) {
        throw new Error('Invalid request');
      } else {
        const indexFound = cart.items.findIndex(item => {
          return item.product_id === product_id;
        });
        if (indexFound !== -1) {
          console.log('index Found: ', indexFound);
          console.log('before update items: ', cart.items);
          let updatedQty = cart.items[indexFound].qty - qty;
          if (updatedQty <= 0) {
            cart.items.splice(indexFound, 1);
          } else {
            cart.items[indexFound].qty = updatedQty;
          }
          console.log('after update items: ', cart.items);
          return cart.save();
        } else {
          throw new Error('Invalid request');
        }
      }
    })
    .then(updatedCart => res.json(updatedCart))
    .catch(err => {
      let error;
      if (err.message === 'Invalid request') {
        error = new APIError(err.message, httpStatus.BAD_REQUEST, true);
      } else {
        error = new APIError(err.message, httpStatus.NOT_FOUND);
      }
      return next(error);
    });
};

/**
 * Get cart by email.
 * @property {string} req.query.email
 * @returns {Cart}
 */
exports.get = function (req, res, next) {
  const { email } = req.query;
  // console.log(email);
  if (!email) {
    const error = new APIError('Invalid request', httpStatus.BAD_REQUEST, true);
    return next(error);
  }
  Cart.get({ email })
    .then(Cart => res.json(Cart))
    .catch(err => {
      const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(error);
    });
};

/**
 * delete cart by email.
 * @property {string} req.query.email
 * @returns {Cart}
 */
exports.remove = function (req, res, next) {
  const { email } = req.query;
  Cart.get({ email })
    .then(Cart => Cart.remove())
    .then(deletedCart => res.json(deletedCart))
    .catch(err => {
      const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(error);
    });
};
