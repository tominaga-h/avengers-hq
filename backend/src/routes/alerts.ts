import { Router } from 'express';
import { listAlerts, dismissAlert } from '../controllers/alertController';

const router = Router();
router.get('/', listAlerts);
router.post('/:id/dismiss', dismissAlert);
export default router;
