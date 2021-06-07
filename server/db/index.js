const mongoose = require('mongoose');
const { ENV, MONGODB_URI } = require('../config');

const connectDB = () => {
  if (ENV === 'development') {
    mongoose.set('debug', true);
  }
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () =>
    console.info('✅ 🚀 mongoose mongodb open and running')
  );
};

module.exports = connectDB;
