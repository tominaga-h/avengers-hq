import { Router } from 'express';
import { listContexts, getContext } from '../controllers/contextController';

const router = Router();
router.get('/', listContexts);
router.get('/*', getContext);
export default router;
