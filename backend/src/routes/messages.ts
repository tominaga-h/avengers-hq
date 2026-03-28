import { Router } from 'express';
import { postMessage } from '../controllers/messageController';

const router = Router();
router.post('/send', postMessage);
export default router;
