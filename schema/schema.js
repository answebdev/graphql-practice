const graphql = require('graphql');
const axios = require('axios');
// Lodash used only to get our hard coded data, which we only did in the beginning:
// const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;

// Users (Hard Coded)
// const users = [
//     { id: '23', firstName: 'Bill', age: 20 },
//     { id: '47', firstName: 'Samantha', age: 21 }
// ];

// Note that this 'CompanyType' is going to be used below as a 'UserType' field,
// since a user can be associated with a company.
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      // There are many users associated with a company (not just 1 like how each user is asoociated with only 1 company,
      // as in 'UserType' below).
      // We need to tell GraphQL to expect to get a LIST/COLLECTION of users (not just 1) who are going to be associated with a single company.
      // To do this, we need to wrap 'UserType' in 'GraphQLList' - this tells GraphQL that when we go from a company over to a user,
      // we're going to have multiple users associated with that one company:
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        // The 'id' is the id of the company we are currently considering:
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      // Use 'resolve' to find the company that is associated with a given user.
      // To see how to get the following lines, see video at 2:50 + mark: https://www.udemy.com/course/graphql-with-react-course/learn/lecture/6523070#overview
      resolve(parentValue, args) {
        // console.log(parentValue, args);
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
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
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((res) => res.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
