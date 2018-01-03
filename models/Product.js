const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const Schema = mongoose.Schema;

const ProductScema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  specification: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
/**
 * Statics
 */
ProductScema.statics = {
  /**
   * Get product
   * @param {ObjectId} id - The objectId of product.
   * @returns {Promise<Product, APIError>}
   */
  get (id) {
    return this.findById(id)
      .exec()
      .then(product => {
        if (product) {
          return product;
        }
        const err = new APIError('No such product exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List products in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of products to be skipped.
   * @param {number} limit - Limit number of products to be returned.
   * @returns {Promise<User[]>}
   */
  list ({
    category = '',
    brand = '',
    sort = 'quantity',
    sorder = 'desc',
    skip = 0,
    limit = 50
  } = {}) {
    let condition = {};
    if (brand) {
      condition.brand = brand;
    }
    if (category) {
      condition.category = category;
    }
    const soringOrder = sorder === 'desc' ? -1 : 1;
    return this.find(condition)
      .sort({ [sort]: soringOrder })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};
module.exports = mongoose.model('product', ProductScema);
