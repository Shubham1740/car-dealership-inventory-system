import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { create, list, search, update } from '../controllers/vehicle.controller';

const router = Router();

router.post('/', authenticate, create);
router.get('/search', authenticate, search);
router.get('/', authenticate, list);
router.put('/:id', authenticate, update);

export default router;