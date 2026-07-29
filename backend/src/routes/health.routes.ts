// backend/src/routes/health.routes.ts
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

export default router;