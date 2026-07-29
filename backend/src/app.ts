import express from "express";
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicle.routes';
import { errorHandler } from './middleware/error.middleware';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

const app = express();

app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use(errorHandler);

export default app;