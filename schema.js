const axios = require('axios');

const  {
   GraphQLObjectType,
   GraphQLString,
   GraphQLInt,
   GraphQLBool,
   GraphQLSchema,
   GraphQLList,
   GraphQLNonNull
} = require('graphql');

// // Hardcoded data
// const customers = [
//    {id:'1', name:'something', email:'something@gmail.com', age:11},
//    {id:'2', name:'something 2', email:'something2@gmail.com', age:22},
//    {id:'3', name:'something 3', email:'something3@gmail.com', age:33}
// ]


// Cusomter Type
const CustomerType = new GraphQLObjectType({
   name:'Customer',
   fields:()=>({
      id: {type:GraphQLString},
      name: {type:GraphQLString},
      email: {type:GraphQLString},
      age: {type:GraphQLInt}
   })
});

// Root Query
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
      customer:{
         type: CustomerType,
         args: {
            id:{type: GraphQLString}
         },
         resolve(parentVal, args){
            // for(let i = 0; i<customers.length; i++){
            //    if(customers[i].id == args.id){
            //       return customers[i];
            //    }
            // }
            return axios.get("http://localhost:3000/customers/"+args.id)
               .then(res =>res.data)

         }
      },
      customers:{
         type: new GraphQLList(CustomerType),
         resolve(parentVal, args){
            // return customers;
            return axios.get("http://localhost:3000/customers")
            .then(res =>res.data)
         }
      }
   }
});

// Edit GraphQL Data = mutations
const mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
      addCustomer:{
         type:CustomerType,
         args:{
            name: {type: new GraphQLNonNull(GraphQLString)},
            email: {type: new GraphQLNonNull(GraphQLString)},
            age: {type: new GraphQLNonNull(GraphQLInt)},
         },
         resolve(parentVal, args){
            return axios.post("http://localhost:3000/customers", {
               name: args.name,
               email: args.email,
               age: args.age
            }).then(res => res.data)
         }
      },
      deleteCustomer:{
         type:CustomerType,
         args:{
            id: {type: new GraphQLNonNull(GraphQLString)},
         },
         resolve(parentVal, args){
            return axios.delete("http://localhost:3000/customers/"+args.id).then(res => res.data)
         }
      },
      updateCustomer:{
         type:CustomerType,
         args:{
            id: {type: new GraphQLNonNull(GraphQLString)},
            name: {type: GraphQLString},
            email: {type: GraphQLString},
            age: {type: GraphQLInt},
         },
         resolve(parentVal, args){
            return axios.patch("http://localhost:3000/customers/"+args.id, args).then(res => res.data)
         }
      }
   }
});


module.exports=new GraphQLSchema({
   query: RootQuery,
   mutation
});