const { ApolloServer, gql } = require('apollo-server');
const connectDB = require('./config/db');
const resolvers = require('./db/resolvers')
const typeDefs = require('./db/shema');



connectDB();

const cursos = [
    {
        titulo: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
    },
    {
        titulo: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
        tecnologia: 'React',
    },
    {
        titulo: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
        tecnologia: 'Node.js'
    }, 
    {
        titulo: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
        tecnologia: 'React'
    }
];


const server = new ApolloServer({
    typeDefs,
    resolvers
})

//arrancar servidor
server.listen().then(({url}) => {
    console.log(`Servidor en puerto ${url}`)
})