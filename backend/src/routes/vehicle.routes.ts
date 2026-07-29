import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { create, list } from '../controllers/vehicle.controller';

const router = Router();

router.post('/', authenticate, create);
router.get('/', authenticate, list);

export default router;