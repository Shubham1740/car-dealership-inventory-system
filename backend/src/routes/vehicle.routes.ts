import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { create, list, search, update, remove } from '../controllers/vehicle.controller';

const router = Router();

router.post('/', authenticate, create);
router.get('/search', authenticate, search);
router.get('/', authenticate, list);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, requireAdmin, remove);

export default router;  