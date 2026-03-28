import { Router } from 'express';
import { getDashboardContent } from '../controllers/dashboardController';

const router = Router();
router.get('/', getDashboardContent);
export default router;
