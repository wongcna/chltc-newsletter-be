import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';

const versionFile = './version';
const version = fs.readFileSync(versionFile, 'utf-8')


const doc = {
  info: {
    title: 'CHLTC Newsletter API',
    description: 'Mass Newsletter Mailing System Backend API Doc',
    "version": `${version}`
  },
  host: 'localhost:3050', //'chltc-newsletter-api-dev.azurewebsites.net/api',
  "schemes": [
    "http","https"
  ],
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/index.mjs'];
// 'chltc-newsletter-api-dev.azurewebsites.net/api',
/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);