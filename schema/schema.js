const graphql = require('graphql');
const axios = require('axios');
const { response } = require('express');
// const { response } = require('express');

const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLNonNull } = graphql;

const Usertype = new GraphQLObjectType ({
    name: "User",
    fields: () => ({
        id: { type: GraphQLString },
        firstname: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: Comtype,
            resolve(parentvalue, args) {
                return axios.get(`http://localhost:3000/companies/${parentvalue.companyId}`)
                    .then(response => response.data);
            }
        }
    }),
});

const Comtype = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        user: {
            type: new GraphQLList(Usertype),
            resolve(parentvalue, args) {
                return axios.get(`http://localhost:3000/companies/${parentvalue.id}/users`)
                    .then(response => response.data);
            }
        }
    })
});

const rootquery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: Usertype,
            args: { id: { type: GraphQLString } },
            resolve(parentvalue, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                    .then(response => response.data);
            }
        },
        company: {
            type: Comtype,
            args: { id: { type: GraphQLString } },
            resolve(parentvalue, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                    .then(response => response.data);
            }
        },
        alluser: {
            type: new GraphQLList(Usertype),
            resolve(parentvalue,args) {
                return axios.get("http://localhost:3000/users")
                    .then(response => response.data);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: Usertype,
            args: {
                firstname: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentvalue, { firstname, age, companyId }) {
                return axios.post('http://localhost:3000/users', { firstname, age, companyId })
                    .then(response => response.data);
            }
        },
        deleteUser:{
            type:Usertype,
            args:{
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parentvalue,{id}){
            return axios.delete(`http://localhost:3000/users/${id}`)
            .then(response => response.data)
            }
        },
     editUser: {
            type: Usertype,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstname: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            resolve(parentvalue, args) {
                return axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(response => response.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootquery,
    mutation:mutation
});
