import { Router } from 'express';
import { listAgents, getAgent } from '../controllers/agentController';

const router = Router();
router.get('/', listAgents);
router.get('/:id', getAgent);
export default router;
