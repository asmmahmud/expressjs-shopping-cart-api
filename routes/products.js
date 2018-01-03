const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const config = require('../config/index');
const paramValidation = require('../config/param-validation');
const ProductController = require('../controllers/ProductController');
router
  .route('/')
  /** GET /api/products - Get list of products */
  .get(ProductController.list)

  /** POST /api/products - Create new product */
  .post(
    config.jwtMiddleware,
    validate(paramValidation.createProduct),
    ProductController.create
  );

router
  .route('/:productId')
  /** GET /api/products/:productId - Get product */
  .get(ProductController.get)

  /** PUT /api/products/:productId - Update product */
  .put(
    config.jwtMiddleware,
    validate(paramValidation.updateProduct),
    ProductController.update
  )
  // const checkScopes = jwtAuthz([ 'delete:products' ]);
  /** DELETE /api/products/:productId - Delete product */
  .delete(config.jwtMiddleware, ProductController.remove);

/** Load user when API with productId route parameter is hit */
router.param('productId', ProductController.load);
module.exports = router;
