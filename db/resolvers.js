const User = require('../models/Users');
const Product = require('../models/Product');
const Client = require('../models/Client');
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
        },
        getProducts: async () => {
            try {
                const products = await Product.find({});
                return products;
            } catch (e) {
                console.log(error)
            }
        },
        getProduct: async (_, {id}) => {
            // revisar si el producto existe o no
            const product = await Product.findById(id);
           
            if(!product) {
                throw new Error('Producto no encontrado')
            }

            return product;
        },
        getClients: async (_, req, ctx) => { 
            
            try {
                const clients = await Client.find({seller: ctx.user.id.toString()});
                return clients;
            } catch (e) {
                console.log(e)
            }
        },
        getClient: async (_, {id}, ctx) => {
            // Revisar si el cliente existe o no
            try {
                
                const client = await Client.findById(id);
                console.log(client);
                if(!client) {
                    throw new Error('client no existe')
                }
                // Quien lo creo puede verlo
                if(client.seller.toString() !== ctx.user.id) {
                    throw new Error('No es tu client')
                }
    
                return client;
            } catch (error) {
                console.log('error en la peticion getClient');
            }
        },
       
        
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
            try {
                const product = new Product(input);

                const result = await product.save();

                return result;

            } catch (e) {
                console.log('Error a la hora de guardar el producto');
                console.log(e)
            }
        },
        updateProduct: async (_, {id, input}) => {

            let product = await Product.findById(id);

            if(!product) {
                throw new Error('Producto no encontrado');
            }

            // guardarlo en la base de datos
            product = await Product.findOneAndUpdate({_id:id}, input, {
                new: true
            });

            return product;
        },
        deleteProduct: async (_, {id}) => {
            let product = await Product.findById(id);

            if(!product) {
                throw new Error('Producto no encontrado');
            }
            await Product.findOneAndDelete({_id:id});

            return "Producto eliminado"
        },
        newClient: async (_, {input}, ctx) => {
            // Verificar si el cliente ya esta registrado
            const { email } = input;

            const client = await Client.findOne({email});

           
            if(client) {
                throw new Error('This client is already registered');
            }
            
            const addNewClient = new Client(input);
            
            addNewClient.seller = ctx.user.id;
            //asignar el vendedor

            try {
                const res = await addNewClient.save();
                return res;
            
            } catch (e) {
                console.log(e)
            }
            // guardarlo en la base de datos
        }, 
        updateClient: async (_, {id, input}, ctx) => {
 
               const client = await Client.findById(id);
               console.log(client.seller)
               console.log(ctx.user.id.toString())
                
                if(!client) {
                    throw new Error('El cliente no existe')   
                }
                if(client.seller.toString() !== ctx.user.id) {
                    throw new Error('No es tu client')
                }

                const updatedClient = await Client.findOneAndUpdate({_id:id}, input, {
                    new: true
                });

                return updatedClient;
        },
        deleteClient:async  (_, {id}, ctx) => {
            
            if(!Client.exists({_id:id})) {
                throw new Error('No existe el cliente')
            }

            if(client.seller.toString() !== ctx.user.id) {
                throw new Error('No es tu client')
            }
            try {
                await Client.findOneAndDelete({_id:id});
                return 'Cliente eliminado'
            } catch (error) {
                
            }
        }
        
    },

    
}


module.exports = resolvers;