const config = require('./config/index');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const path = require('path');
const methodOverride = require('method-override');
const logger = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compress = require('compression');
const expressValidation = require('express-validation');
const httpStatus = require('http-status');

const indexRoutes = require('./routes/index');
const APIError = require('./helpers/APIError');

const app = express();
if (config.env === 'development') {
  app.use(logger('dev'));
}

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

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', indexRoutes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {}
  })
);

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
});

module.exports = app;
