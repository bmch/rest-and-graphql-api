const { MONGODB_URI } = require('../server/config');
const produceData = require('../seeds/person.seed');
const mongoose = require('mongoose');
const Person = require('../server/models/person');

const addPersons = async () => {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
  await Person.create(produceData(10));
  console.log('seed finished');
};

addPersons();
