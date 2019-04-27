import { GraphQLServer } from 'graphql-yoga';
import { createConnection, getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';
import { User } from './entities/User';

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }
  type Query {
    user(id: ID!): User!
  }
  type Mutation {
    addUser(name: String!, email: String!): User,
    register(name: String!, email: String!, password: String!): String!
  }
`;

const resolvers = {
  Query: {
    user: (_, { id }) => {
      return getRepository(User).findOne(id);
    },
  },
  Mutation: {
    addUser: (_, { name, email }) => {
      const user = new User();
      user.email = email;
      user.name = name;
      return getRepository(User).save(user);
    },
    register: async (_, { name, email, password }) => {
      const user = new User();
      user.email = email;
      user.name = name;
      user.hashPassword = bcrypt.hashSync(password, 12);
      const { id } = await getRepository(User).save(user);
      return jwt.sign({ id }, 'secret');
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({ ...req }),
});

createConnection()
  .then(() => {
    server.start(() => console.log('Server is running on localhost:4000'));
  })
  .catch(error => {
    console.info(`Couldn't connect to the database.`);
    console.error(error);
  });
