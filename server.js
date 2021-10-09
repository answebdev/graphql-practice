const express = require('express');
// const expressGraphQL = require('express-graphql');
const { graphqlHTTP } = require('express-graphql')
const app = express();

// Tell the Express app that if any request comes into our app looking for '/graphql',
// then we want the GraphQL library to handle it.
// app.use('/graphql', expressGraphQL ({
//     graphiql: true
// }));
app.use('/graphql', graphqlHTTP({
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Listening...');
});