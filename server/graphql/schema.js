const { gql } = require('apollo-server-koa');
const PersonModel = require('../models/person');

const typeDefs = gql`
  type Person {
    _id: ID!
    name: String!
    age: Int!
    gender: Gender!
  }
  type Query {
    getPersons: [Person!]!
    getPerson(id: ID!): Person!
  }
  enum Gender {
    male
    female
    other
  }
  type Mutation {
    updatePerson(id: ID!, name: String, age: Int, gender: Gender): Person!
    deletePerson(id: ID!): Person!
    createPerson(data: CreatePersonInput!): Person!
  }
  input CreatePersonInput {
    name: String!
    age: Int!
    gender: Gender!
  }
`;

const resolvers = {
  Query: {
    getPersons: async (parent, args, context, info) => {
      return await PersonModel.find();
    },
    getPerson: async (parent, args, context, info) => {
      return await PersonModel.findById(args.id);
    },
  },
  Mutation: {
    createPerson: async (parent, args, context, info) => {
      return await PersonModel.create(args.data);
    },
    deletePerson: async (parent, args, context, info) => {
      return await PersonModel.findByIdAndDelete(args.id);
    },
    updatePerson: async (parent, args, context, info) => {
      const updateFields = {};
      if (args.name) updateFields.name = args.name;
      if (args.gender) updateFields.gender = args.gender;
      if (args.age) updateFields.age = args.age;

      const person = await PersonModel.findByIdAndUpdate(
        args.id,
        { $set: updateFields },
        {
          new: true,
        }
      );
      return person;
    },
  },
};

module.exports = { typeDefs, resolvers };
