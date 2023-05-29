const { connect } = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION; Server shutting down...`);
  process.exit(1);
});

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const app = require('./app');

connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log(`Database connected successfully...`);
});

PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION ; Server shutting down...`);
  server.close(() => {
    process.exit(1);
  });
});
