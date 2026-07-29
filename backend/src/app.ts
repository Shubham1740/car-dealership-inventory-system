import express from "express";
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

export default app;