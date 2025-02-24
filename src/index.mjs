import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index.mjs';
import { globalErrorHandler } from './middleware/globalErrorHandler.mjs';
import { connectToDatabase } from './config/db.mjs';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

dotenv.config();

const app = express();

// Connect to SQL Server on app startup
connectToDatabase();

// middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

let customSHost = process.env.SWAGGER_HOST || "localhost:3030";

//read Swagger json file
const swaggerFilePath = './swagger-output.json';
const swaggerFile = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'))

if (customSHost) {
  swaggerFile.host = customSHost + "/api"
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', routes);

// Error handlers middleware
app.use(globalErrorHandler);

// 404 error
app.use("*", (request, response) => {
  response.status(404).json({ message: "Not found!" })
});

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});