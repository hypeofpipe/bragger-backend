import { GraphQLServer } from 'graphql-yoga';
import { rule, shield, and, or, not } from 'graphql-shield';
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
    hello(world: String!): String!
  }
  type Mutation {
    addUser(name: String!, email: String!): User,
    register(name: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
  }
`;

const resolvers = {
  Query: {
    user: (_, { id }) => {
      return getRepository(User).findOne(id);
    },
    hello: (_, { world }) => {
      return `hello ${world}`;
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
      user.hashPassword = await bcrypt.hash(password, 12);
      const { id } = await getRepository(User).save(user);
      return jwt.sign({ id }, 'secret');
    },
    login: async (_, { email, password }) => {
      const user = await getRepository(User).findOne({ email });
      if (!user) return 'No user found';
      const result = bcrypt.compare(password, user.hashPassword);
      return result ? jwt.sign({ id: user.id }, 'secret') : 'Bad credentials!';
    },
  },
};

async function authorize(req) {
  try {
    const {id} = jwt.verify(req.request.get('Authorization'), 'secret');
    if (!id) {
      return undefined
    }
    const user = await getRepository(User).findOne({ id })
    console.log('useeeer', user)
    return user
  } catch (e) {
    console.error(e)
    return undefined;
  }
}

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return ctx.authorized != undefined
});

const permissions = shield({
  Query: {
    hello: and(isAuthenticated),
  },
});

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [permissions],
  context: req => ({ ...req, authorized: authorize(req) }),
});

createConnection()
  .then(() => {
    server.start(() => console.log('Server is running on localhost:4000'));
  })
  .catch(error => {
    console.info(`Couldn't connect to the database.`);
    console.error(error);
  });
