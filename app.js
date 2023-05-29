const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const errorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

//SET SECURITY HTTP HEADERS
app.use(helmet());

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//LIMIT REQUESTS PER IP ADDRESS
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

//BODY PARSER - READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({ limit: '10kb' }));

//DATA SANITIZATION AGAINST NO-SQL QUERY INJECTION
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS
app.use(xss());

//PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
    ],
  })
);

//SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find '${req.originalUrl}' on this server`, 404));
});
// ERROR HANDLER
app.use(errorHandler);

module.exports = app;
