process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server/app');

const { MONGODB_URI } = require('../server/config');
const produceData = require('../seeds/person.seed');

const mongoose = require('mongoose');
const Person = require('../server/models/person');

const temp = {};
let DB_URI = MONGODB_URI + 'graphqlpersons';

beforeAll(async () => {
  await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
  });
});

beforeEach(async () => {
  await Person.create(produceData(3));
});

afterEach(async () => {
  await Person.deleteMany();
});

afterAll(async () => {
  await Person.deleteMany();
  await mongoose.connection.close();
});

describe(`/graphql getPersons query`, () => {
  it('Should return all persons', async () => {
    const res = await request(app.callback())
      .post('/graphql')
      .send({
        query: '{ getPersons{ _id, name, age, gender} }',
      })
      .set('Accept', 'application/json');
    expect(res.type).toEqual('application/json');
    expect(res.body.data.getPersons[0]).toHaveProperty('name');
    expect(res.body.data.getPersons[0]).toHaveProperty('age');
    expect(res.body.data.getPersons[0]).toHaveProperty('gender');
    expect(res.statusCode).toBe(200);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.data.getPersons.length).toEqual(3);
    expect(Object.keys(res.body.data.getPersons[1])).toEqual(
      expect.arrayContaining(['name', 'gender', 'age'])
    );
  });
});

describe(`/graphql - getPerson (with id)`, () => {
  it('Should get a person by the given id', async () => {
    const result = await Person.create({
      name: 'John Smith',
      age: 22,
      gender: 'male',
    });
    temp.id = decodeURI(encodeURI(result._id));
    const response = await request(app.callback())
      .post('/graphql')
      .send({
        query: `{ getPerson(id:"${temp.id}"){ name, age, gender, _id} }`,
      })
      .set('Accept', 'application/json');
    expect(response.type).toEqual('application/json');
    expect(response.body.data.getPerson).toHaveProperty('name');
    expect(response.body.data.getPerson).toHaveProperty('age');
    expect(response.body.data.getPerson).toHaveProperty('gender');
    expect(response.statusCode).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body.data.getPerson._id).toBe(temp.id);
  });

  it('Should return no data and an error if the person does not exist', async () => {
    const response = await request(app.callback())
      .post('/graphql')
      .send({
        query:
          '{ getPerson(id:"60bse19956738a7b0165cf00"){ _id, name, age, gender} }',
      })
      .set('Accept', 'application/json');
    expect(response.type).toEqual('application/json');
    expect(response.body.errors).toBeTruthy();
    expect(response.body.data).toBeFalsy();
    expect(response.statusCode).toBe(200);
    expect(response.status).toBe(200);
  });
});

describe(`/graphql - createPerson mutation`, () => {
  it('Should return the person that was added', async () => {
    const query = `
    mutation {
        createPerson(data: { name: "bob mcbob", age: 22, gender: male }) {
          name
          age
          gender
          _id
        }
      }
    `;
    const response = await request(app.callback())
      .post('/graphql')
      .send({ query })
      .set('Accept', 'application/json');
    expect(response.type).toEqual('application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.createPerson).toHaveProperty('name');
    expect(response.body.data.createPerson).toHaveProperty('age');
    expect(response.body.data.createPerson).toHaveProperty('gender');
    expect(response.body.data.createPerson.name).toBe('bob mcbob');
    expect(response.body.data.createPerson.gender).toBe('male');
    expect(response.body.data.createPerson.age).toBe(22);
  });

  it('Should return error when creating a person without gender field', async () => {
    const query = `
    mutation {
        createPerson(data: { name: "bob mcbob", age: 22 }) {
          name
          age
          gender
          _id
        }
      }
    `;
    const response = await request(app.callback())
      .post('/graphql')
      .send({ query })
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(400);
    expect(response.type).toEqual('application/json');
    expect(response.body).toHaveProperty('errors');
    expect(response.body.createPerson).toBeFalsy();
  });
});

describe(`/graphql - deletePerson mutation`, () => {
  it('Should return the person that was deleted', async () => {
    const result = await Person.create({
      name: 'John Smith',
      age: 22,
      gender: 'male',
    });
    temp.id = decodeURI(encodeURI(result._id));
    const query = `
    mutation {
        deletePerson(id:"${temp.id}") {
          name
          age
          gender
          _id
        }
      }
    `;
    const res = await request(app.callback())
      .post('/graphql')
      .send({ query })
      .set('Accept', 'application/json');
    expect(res.type).toEqual('application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.deletePerson).toHaveProperty('name');
    expect(res.body.data.deletePerson).toHaveProperty('age');
    expect(res.body.data.deletePerson).toHaveProperty('gender');
    expect(res.body.data.deletePerson.name).toBe('John Smith');
    expect(res.body.data.deletePerson.gender).toBe('male');
    expect(res.body.data.deletePerson.age).toBe(22);
    expect(res.body.data.deletePerson._id).toBe(temp.id);
  });

  it('Should return an error if the person does not exist', async () => {
    const randomStr = '60bc08142gf5cb8518261629';
    const query = `
    mutation {
        deletePerson(id:"${randomStr}") {
          name
          age
          gender
          _id
        }
      }
    `;
    const response = await request(app.callback())
      .post('/graphql')
      .send({ query })
      .set('Accept', 'application/json');
    expect(response.type).toEqual('application/json');
    expect(response.body).toHaveProperty('errors');
    expect(response.body.data).toBeFalsy();
  });
});

describe('/graphql - updatePerson mutation ', () => {
  it('Should update a person given the id and return the updated details', async () => {
    const result = await Person.create({
      name: 'Johnny drop table persons',
      age: 2,
      gender: 'male',
    });
    temp.id = decodeURI(encodeURI(result._id));

    const query = `
    mutation {
        updatePerson(id:"${temp.id}", age: 123, name:"McUpdate") {
          name
          age
          gender
          _id
        }
      }
    `;
    const res = await request(app.callback())
      .post('/graphql')
      .send({ query })
      .set('Accept', 'application/json');
    expect(res.type).toEqual('application/json');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.updatePerson).toHaveProperty('name');
    expect(res.body.data.updatePerson).toHaveProperty('age');
    expect(res.body.data.updatePerson).toHaveProperty('gender');
    expect(res.body.data.updatePerson.name).toBe('McUpdate');
    expect(res.body.data.updatePerson.gender).toBe('male');
    expect(res.body.data.updatePerson.age).toBe(123);
  });
});
