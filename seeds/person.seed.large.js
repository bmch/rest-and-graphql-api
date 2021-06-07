const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

process.env.NODE_ENV = 'test';
const { MONGODB_URI, dbName } = require('../server/config');

// const dbName = 'my_dev_database';

// Use connect method to connect to the server
MongoClient.connect(MONGODB_URI, (err, client) => {
  // throw an exception if err is not null:
  assert.equal(null, err);

  const db = client.db(dbName);

  // get access to the relevant collections
  const personsCollection = db.collection('persons');

  let persons = [];
  for (let i = 0; i < 3; i += 1) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const name = firstName + ' ' + lastName;
    const genderSelection = ['male', 'female', 'other'];
    const gender = genderSelection[Math.floor(Math.random() * 3)];
    const age = Math.floor(Math.random() * 100);
    let newPerson = {
      name,
      gender,
      age,
    };
    persons.push(newPerson);
    console.log(newPerson.name);
  }
  personsCollection.insertMany(persons);

  console.log('Database seeded! :)');
  client.close();
});
