const config = require('./config/index');
const mongoose = require('mongoose');
const Product = require('./Product');
const products = require('./products');

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri, {
    useMongoClient: true
  })
  .then(() => {
    console.log('Mongodb is connected!!');
  })
  .catch(err => {
    console.warn(err);
  });

const productPromises = products.map(prod => {
  const productData = {
    name: prod.name,
    category: prod.category,
    brand: prod.brand,
    price: prod.price,
    quantity: prod.quantity
  };
  if (prod.model) {
    productData.model = prod.model;
  }
  const product = new Product(productData);
  return product.save();
});

Promise.all(productPromises)
  .then(savedProducts => {
    console.log(savedProducts.length + ' products have been saved!');
  })
  .catch(console.log);
