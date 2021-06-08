const mongoose = require('mongoose');
const { ENV, MONGODB_URI } = require('../config');
const produceData = require('../../seeds/person.seed');
const Person = require('../models/person');

const connectDB = () => {
  if (ENV === 'development') {
    mongoose.set('debug', true);
  }
  console.log('MONG0 uri is ', MONGODB_URI);

  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', async () => {
    console.info('✅ 🚀 mongoose mongodb open and running');
    console.info('running seeds...');
    await Person.create(produceData(10));
    console.info('seed run finished...');
  });
};

module.exports = connectDB;
