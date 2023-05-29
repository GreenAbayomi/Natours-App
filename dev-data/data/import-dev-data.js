const fs = require('fs');
const { connect } = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./../../models/tourModel');
const { argv, exit } = require('process');

const DB = process.env.DATABASE_URI.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(() => {
  console.log(`Database connected successfully...`);
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log(`Data successfully loaded...`);
  } catch (err) {
    console.log(err);
  }
  exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(`Data successfully deleted`);
  } catch (err) {
    console.log(err);
  }
  exit();
};

if (argv[2] === '--import') {
  importData();
} else if (argv[2] === '--delete') {
  deleteData();
}
