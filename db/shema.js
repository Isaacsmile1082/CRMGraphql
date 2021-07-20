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
        name: String
        existence: Int
        price: Float
        createdAt: String
    }

    type Client {
        name: String
        lastName: String
        company: String
        email: String
        phone: String
        createdAt: String
        seller: ID
    }
    
    
    type Query {
        #Usuarios
        obtenerUsuario(token: String!): Usuario
        #Productos
        getProducts: [Product]
        getProduct(id: ID!): Product 
        getClients: [Client]
        getClient(id: ID): Client
    }


    type Mutation {
        # Usuarios
        nuevoUsuario(input: UserInput): Usuario 
        authUser(input: AuthInput): Token
        # Productos
        newProduct(input: ProductInput): Product
        updateProduct( id: ID!, input: ProductInput ) : Product
        deleteProduct(id: ID!) : String
        #Clientes
        newClient(input: ClientInput): Client
        updateClient(id: ID, input: ClientInput): Client
        deleteClient(id: ID): String
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

    input ClientInput {
        name: String!
        lastName: String!
        company: String !
        email: String !
        phone: String
    }
`;

module.exports = typeDefs;