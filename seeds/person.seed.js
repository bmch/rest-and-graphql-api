const faker = require('faker');

const produceData = (amount) => {
  let persons = [];
  for (let i = 0; i < amount; i += 1) {
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
  }
  return persons;
};

module.exports = produceData;
