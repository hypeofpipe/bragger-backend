import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';
import { User } from './User.typeorm';
import { MixedEntity } from '../Entity.type';

export const entity: MixedEntity = {
  typeDef: {
    type: `type User {
            id: ID!
            name: String!
            email: String!
            password: String!
          }`,
    query: `user(id: ID!): User!`,
    mutation: `
        addUser(name: String!, email: String!): User,
        register(name: String!, email: String!, password: String!): String!
        login(email: String!, password: String!): String!
        `,
  },
  resolvers: {
    query: {
      user: (_, { id }) => {
        return getRepository(User).findOne(id);
      },
    },
    mutation: {
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
        return result
          ? jwt.sign({ id: user.id }, 'secret')
          : 'Bad credentials!';
      },
    },
  },
};