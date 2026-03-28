import { Router } from 'express';
import { getInbox, markRead, markAllRead } from '../controllers/inboxController';

const router = Router();
router.get('/:agent', getInbox);
router.post('/:agent/read/:msgId', markRead);
router.post('/:agent/read-all', markAllRead);
export default router;
