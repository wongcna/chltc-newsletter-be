import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes/index.mjs';
import { globalErrorHandler } from './middleware/globalErrorHandler.mjs';
import { connectToDatabase } from './config/db.mjs';

dotenv.config();

const app = express();

// Connect to SQL Server on app startup
connectToDatabase();

// middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

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