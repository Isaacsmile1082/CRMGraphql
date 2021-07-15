const User = require('../models/Users');
const Product = require('../models/Product');
const bcryptjs = require('bcryptjs');
require('dotenv').config({path: '.env'});
const jwt = require('jsonwebtoken');
const createToken = (user, secret, expiresIn) => {
    
    const { id, email, name, lastName } = user;
    
    return jwt.sign({ id, email, name, lastName }, secret, { 
        expiresIn
    })
}


const resolvers = {
    Query: {
        obtenerUsuario: async (_, { token }) => {
            const userId = await jwt.verify(token, process.env.SECRET);
            
            return userId;
        } 
    },
    Mutation: {
        nuevoUsuario: async (_, {input}) => {
          //Revisar si el usuario ya esta registrado
            const { email, password } = input;

            const userExist = await User.findOne({email});
            if( userExist ) {
                throw new Error('El usuario ya esta registrado');
            }
          // Hashear su password
          const salt = await bcryptjs.genSalt(10);
          input.password = await bcryptjs.hash(password, salt);


          try {
              // Guardarlo en la base de datos
            const usuario = new User(input);
            usuario.save();
            return usuario;
          } catch (e) {
            console.log(e)
          }
            return 'a'
        },
        authUser: async (_, {input}) => {
            const { email, password } = input;
            //Si el usuario existe
            const existeUsuario = await User.findOne({email});
            console.log(existeUsuario)
            if(!existeUsuario) {
                throw new Error('El usuario no existe');
            }
            // revisar si el password es correcto
            const correctPassword = await bcryptjs.compare(password, existeUsuario.password);   
            if(!correctPassword) {
                throw new Error('El password es incorrecto');
            }

            //  Crear token 
            return {
                token : createToken(existeUsuario, process.env.SECRET, '24h')
            }
        },
        newProduct: async (_, {input}) => {
            
        }
        
    },

    
}

module.exports = resolvers;