const express = require('express');
const graphqlHTTP = require('express-graphql');
const { postgraphile } = require("postgraphile");

const app = express();

// app.use('/graphql', graphqlHTTP({
//   schema: MyGraphQLSchema,
//   graphiql: true
// }));

app.use(postgraphile(process.env.DATABASE_URL || "postgres:///"));

app.listen(3000);
