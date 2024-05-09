const graphql = require('graphql');
const { GraphQLObjectType,GraphQLSchema,GraphQLInt,GraphQLString } = require('graphql')
// const _ = require('lodash')
const axios = require('axios');
const { response } = require('express');

//its a query writting and modifiction;

const Usertype = new GraphQLObjectType ({
    name:"user",
    fields : ()=>({
        id: {type:GraphQLString},
        firstname:{type:GraphQLString},
        age:{type:GraphQLInt},
            company:{
                type : Comtype,
                resolve(parentvalue,args){
                    // console.log(parentvalue.args)
                    return axios.get(`http://localhost:3000/companies/${parentvalue.companyId}`)
                    .then(response => response.data)
                }
            }
    }),
});

const Comtype = new GraphQLObjectType({
    name:"companies",
    fields :()=>( {
        id : {type : GraphQLString},
        name : {type : GraphQLString},
        description : {type : GraphQLString},
    })
})

//its a alter and showing data and get the client data
const rootquery = new  GraphQLObjectType({
    name:"rootquerytype",
    fields:{
        user:{
            type:Usertype,
            args:{id:{type:GraphQLString}},
            resolve(parentvalue,args){
            // return _.find(Users,{id:args.id});
            return axios.get(`http://localhost:3000/users/${args.id}`)
            .then(response => response.data)
            .then(data => data)
            }
        },
        company:{
            type:Comtype,
            args:{id:{type:GraphQLString}},
            resolve(parentvalue,args){
                return axios.get(`http://localhost:3000/companies${args.id}`)
                .then(response =>response.data)
                .then(data => data)
            }
        }
    }
})

module.exports= new GraphQLSchema({
    query:rootquery
})