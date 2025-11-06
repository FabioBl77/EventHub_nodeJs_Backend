// scripts/generate-swagger.js
const fs = require('fs');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventHub API',
      version: '1.0.0'
    },
    servers: [{ url: process.env.SWAGGER_BASE_URL || 'http://localhost:3000/api' }]
  },
  apis: ['./routes/*.js'] // come nel tuo docs/swagger.js
};

const swaggerSpec = swaggerJsDoc(options);
fs.writeFileSync(path.join(__dirname, '..', 'swagger-output.json'), JSON.stringify(swaggerSpec, null, 2));
console.log('swagger-output.json generato in root.');
