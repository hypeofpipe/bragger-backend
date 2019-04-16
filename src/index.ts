import { schema } from './MyGraphQLSchema';
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { postgraphile } = require('postgraphile');
require('dotenv').config();

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.use(
  postgraphile(process.env.DATABASE_URL || 'postgres:///', 'public', {
    watchPg: true,
  }),
);

console.log('listening on 3000');
app.listen(3000);
