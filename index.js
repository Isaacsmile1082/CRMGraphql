const { ApolloServer, gql } = require('apollo-server');
const connectDB = require('./config/db');
const resolvers = require('./db/resolvers')
const typeDefs = require('./db/shema');
const jwt = require('jsonwebtoken')
require('dotenv').config({path: '.env'});

connectDB();



const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        
        const token = req.headers['authorization' || ''];
        if(token) {
            try {
                const user = jwt.verify(token, process.env.SECRET);
                
                return {
                    user
                }
            } catch (error) {
                console.log('There was an error');
                console.log(error);
            }
        }
    }
})

//arrancar servidor
server.listen().then(({url}) => {
    console.log(`Servidor en puerto ${url}`)
})