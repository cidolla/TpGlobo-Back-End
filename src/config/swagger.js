const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const rotasDir = path.resolve(__dirname, '../routes')
  .replace(/\\/g, '/');

const options = {
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'API TelePrompt Inteligente',
      version: '1.0.0',
      description: 'Documentação da API do sistema TelePrompt Inteligente.'
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desenvolvimento'
      }
    ],

    tags: [
  {
    name: 'Autenticação',
    description: 'Operações de autenticação e gerenciamento de acesso.'
  },
  {
    name: 'Roteiros',
    description: 'Gerenciamento dos roteiros do teleprompter.'
  }
],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },

  apis: [
  `${rotasDir}/*.js`
]
};

const swaggerSpec = swaggerJsdoc(options);

console.log('Versão OpenAPI:', swaggerSpec.openapi);
console.log('Título da documentação:', swaggerSpec.info?.title);

module.exports = swaggerSpec;