const graphql = require('graphql');
const axios = require('axios');
// Lodash used only to get our hard coded data, which we only did in the beginning:
// const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

// Users (Hard Coded)
// const users = [
//     { id: '23', firstName: 'Bill', age: 20 },
//     { id: '47', firstName: 'Samantha', age: 21 }
// ];

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

// Root Query - the entry point into our data.
// Add 'resolve' function to find data - the 'resolve' function is responsible for grabbing the data.
// The 'resolve' function goes into the database (or data store) and finds the actual data that we're looking for.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                // Return a user with a given ID
                // From hard coded data (see above):
                //return _.find(users, { id: args.id });

                // Make HTTP request to find data from our separate JSON Server server:
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(res => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});