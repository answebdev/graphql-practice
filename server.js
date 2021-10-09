const express = require('express');
const { graphqlHTTP } = require('express-graphql')
const app = express();
const schema = require('./schema/schema');

// Tell the Express app that if any request comes into our app looking for '/graphql',
// then we want the GraphQL library to handle it.
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

app.listen(4000, () => {
    console.log('Now listening for requests on Port 4000...');
});