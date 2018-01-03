const expressJwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

var jwtCheck = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://custom-shopping-cart.auth0.com/.well-known/jwks.json'
  }),
  audience: 'shopping-cart-node-express-api',
  issuer: 'https://custom-shopping-cart.auth0.com/',
  algorithms: ['RS256']
});

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 80,
  jwtExpiresIn: 86400,
  jwtMiddleware: jwtCheck
};

if (process.env.NODE_ENV === 'production') {
  config.mongoUri = 'mongodb://localhost/shopping-cart-api';
} else {
  console.log('DEV');
  config.mongoUri = 'mongodb://localhost/shopping-cart-api';
}
module.exports = config;
