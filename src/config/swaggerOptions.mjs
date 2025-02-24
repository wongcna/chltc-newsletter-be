import swaggerJSDoc from "swagger-jsdoc";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CHLTC Newsletter System',
    version: '1.0.0',
    description: 'CHLTC Newsletter System for Mass Mailing',
  },
  servers: [
    {
      url: 'http://localhost:3030',
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, '../docs/auth.mjs'),
    path.join(__dirname, './routes/*.mjs')
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;