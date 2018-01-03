const Joi = require('joi');

module.exports = {
  createOrder: {
    body: {
      shippingAddress: {
        name: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        postCode: Joi.string()
          .regex(/[\d]{4,5}/)
          .required(),
        district: Joi.string().required(),
        country: Joi.string().required()
      },
      shippingMethod: Joi.string().required(),
      paymentMethod: Joi.string().required(),
      items: [
        {
          productId: Joi.string().required(),
          name: Joi.string().required(),
          qty: Joi.number().required(),
          price: Joi.number().required()
        }
      ]
    }
  },
  // POST /api/products - Create new product
  createProduct: {
    body: {
      name: Joi.string().required(),
      category: Joi.string().required(),
      brand: Joi.string().required(),
      model: Joi.string(),
      price: Joi.number().required(),
      quantity: Joi.number().required()
    }
  },
  // PUT /api/products/:productId - Update product
  updateProduct: {
    body: {
      name: Joi.string(),
      category: Joi.string(),
      brand: Joi.string(),
      model: Joi.string(),
      price: Joi.number(),
      quantity: Joi.number()
    },
    params: {
      productId: Joi.string()
        .hex()
        .required()
    }
  },
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string()
        .regex(/^[1-9][0-9]{9}$/)
        .required()
    }
  },
  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string()
        .regex(/[\w]+?@[\w]+?\.[a-z]{2,4}/)
        .required(),
      fist_name: Joi.string(),
      last_name: Joi.string()
    },
    params: {
      userId: Joi.string()
        .hex()
        .required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
