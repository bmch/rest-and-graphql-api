process.env.NODE_ENV = 'test';
const { MONGODB_URI } = require('../server/config');
const produceData = require('../seeds/person.seed');
const personData = produceData(3);
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server/app');

const Person = require('../server/models/person');
const BASE_URL = `/api/v1/person`;

const temp = {};
let DB_URI = MONGODB_URI + 'rest-persons';

beforeAll(async () => {
  await mongoose.connect(DB_URI, {
    useNewUrlParser: true,
  });
});

beforeEach(async () => {
  await Person.create(personData);
});

afterEach(async () => {
  await Person.deleteMany();
});

afterAll(async () => {
  // mongoose.connection.db.dropCollection('persons', function(err, result) {});
  await Person.deleteMany();
  await mongoose.connection.close();
});

describe(`GET ${BASE_URL}`, () => {
  it('Should return all persons', async () => {
    const response = await request(app.callback()).get(BASE_URL);
    expect(response.type).toEqual('application/json');
    expect(response.body.status).toEqual('success');
    expect(response.body.data[0]).toHaveProperty('name');
    expect(response.body.data[0]).toHaveProperty('age');
    expect(response.body.data[0]).toHaveProperty('gender');
    expect(response.statusCode).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toEqual(3);
    expect(Object.keys(response.body.data[1])).toEqual(
      expect.arrayContaining(['name', 'gender', 'age'])
    );
  });
});

describe(`GET ${BASE_URL}/id`, () => {
  it('Should get a person by the given id', async () => {
    const result = await Person.create({
      name: 'John Smith',
      age: 22,
      gender: 'male',
    });
    temp.id = decodeURI(encodeURI(result._id));
    const response = await request(app.callback()).get(
      `${BASE_URL}/${temp.id}`
    );
    expect(response.type).toEqual('application/json');
    expect(response.body.status).toEqual('success');
    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data).toHaveProperty('age');
    expect(response.body.data).toHaveProperty('gender');
    expect(response.statusCode).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(temp.id);
  });

  it('Should thow an error if the person does not exist', async () => {
    const response = await request(app.callback()).get(
      `${BASE_URL}/123456abcdefg`
    );
    expect(response.type).toEqual('application/json');
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toBe('That person does not exist');
    expect(response.statusCode).toBe(400);
    expect(response.status).toBe(400);
  });
});

describe(`POST ${BASE_URL}`, () => {
  it('Should return the person that was added', async () => {
    const res = await request(app.callback()).post(BASE_URL).send({
      name: 'null',
      age: 25,
      gender: 'female',
    });
    expect(res.type).toEqual('application/json');
    expect(res.body.status).toEqual('success');
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('age');
    expect(res.body.data).toHaveProperty('gender');
    expect(res.body.data.name).toBe('null');
    expect(res.body.data.gender).toBe('female');
    expect(res.body.data.age).toBe(25);
  });

  it('Should not post a person without gender field', async () => {
    const res = await request(app.callback()).post(BASE_URL).send({
      name: 'Person 2',
      age: 25,
    });
    expect(res.statusCode).toBe(400);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toBeTruthy();
  });
});

describe(`DELETE ${BASE_URL}/id`, () => {
  it('Should return the person that was deleted', async () => {
    const result = await Person.create({
      name: 'Johnny drop table persons',
      age: 2,
      gender: 'male',
    });
    temp.id = decodeURI(encodeURI(result._id));
    const res = await request(app.callback()).delete(`${BASE_URL}/${temp.id}`);

    console.log(res.body);
    expect(res.type).toEqual('application/json');
    expect(res.body.status).toEqual('success');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('age');
    expect(res.body.data).toHaveProperty('gender');
    expect(res.body.data.name).toBe('Johnny drop table persons');
    expect(res.body.data.gender).toBe('male');
    expect(res.body.data.age).toBe(2);
    expect(res.body.data._id).toBe(temp.id);
  });

  it('Should thow an error if the person does not exist', async () => {
    const response = await request(app.callback()).delete(
      `${BASE_URL}/60b96dcbe74b22d0342354e4`
    );
    expect(response.type).toEqual('application/json');
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toBe('That person does not exist');
    expect(response.statusCode).toBe(400);
    expect(response.status).toBe(400);
  });
});

describe(`PUT ${BASE_URL}/id`, () => {
  it('Should update a person given the id and return the updated details', async () => {
    const result = await Person.create({
      name: 'Johnny drop table persons',
      age: 2,
      gender: 'male',
    });
    temp.id = decodeURI(encodeURI(result._id));
    temp.str = `db.collection.find({$where:()=>(this.name=='a';sleep(5000))}})`;
    const res = await request(app.callback())
      .put(`${BASE_URL}/${temp.id}`)
      .send({
        name: temp.str,
        age: 25,
        gender: 'other',
      });
    expect(res.type).toEqual('application/json');
    expect(res.body.status).toEqual('success');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('name');
    expect(res.body.data).toHaveProperty('age');
    expect(res.body.data).toHaveProperty('gender');
    expect(res.body.data.name).toBe(temp.str);
    expect(res.body.data.gender).toBe('other');
    expect(res.body.data.age).toBe(25);
  });

  it('Should not update a person without gender field', async () => {
    const res = await request(app.callback())
      .put(`${BASE_URL}/${temp.id}`)
      .send({
        name: 'Person 2',
        age: 25,
      });
    expect(res.statusCode).toBe(400);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toBeTruthy();
  });

  it('Should not update a person with a malformed id', async () => {
    const res = await request(app.callback())
      .put(`${BASE_URL}/40b96dkbe75b22d0352394v2`)
      .send({
        name: 'Person 2',
        age: 25,
      });
    expect(res.statusCode).toBe(400);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toEqual('error');
    expect(res.body.message).toBeTruthy();
  });
});
