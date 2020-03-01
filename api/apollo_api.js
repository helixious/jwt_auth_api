require('dotenv').config();
const port = process.env.PORT;

const app = require('express')();
const {ApolloServer} = require('apollo-server-express');
const bodyParser = require('body-parser');

const orm = require('./orm');
app.use(bodyParser.json());

orm.ready(() => {
    const {typeDefs, resolvers} = orm;
    const server = new ApolloServer({typeDefs, resolvers});
    
    server.applyMiddleware({ app });
    app.use(bodyParser.json());
    app.listen({port: port}, () => {
        console.log(`🚀 Server ready at localhost:${port}/graphql`);
    });
});