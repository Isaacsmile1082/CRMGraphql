const { gql } = require('apollo-server');

const typeDefs = gql`
    type Usuario {
        id: ID
        name: String
        lastName: String
        email: String
        createdAt: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        nombre: String
        existence: Int
        price: Float
        createdAt: String
    }
    
    type Query {
        obtenerUsuario(token: String!): Usuario
    }

    type Mutation {
        # Usuarios
        nuevoUsuario(input: UserInput): Usuario 
        authUser(input: AuthInput): Token
        # Productos
        newProduct(input: ProductInput): Product
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }
    
    input ProductInput {
        name: String!
        existence: Int!
        price: Float!
    }

`;

module.exports = typeDefs;