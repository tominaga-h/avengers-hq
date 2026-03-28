import { Request, Response } from 'express';
import { sendMessage } from '../services/inboxWriteService';
import { SendMessageRequest } from '../types/message';

const VALID_AGENTS = ['jarvis', 'tony', 'bruce', 'cap', 'marvel', 'peter', 'starlord'];
const VALID_SENDERS = [...VALID_AGENTS, 'fury', 'dashboard'];
const VALID_TYPES = ['task_assigned', 'ping', 'report_completed', 'wake_up'];

export async function postMessage(req: Request, res: Response): Promise<void> {
  const body = req.body as SendMessageRequest;
  const { to, from, type, content } = body;

  if (!to || !from || !type || !content) {
    res.status(400).json({ success: false, error: 'Missing required fields', code: 'INVALID_PARAMS' });
    return;
  }
  if (!VALID_AGENTS.includes(to)) {
    res.status(400).json({ success: false, error: `Invalid agent ID: ${to}`, code: 'INVALID_PARAMS' });
    return;
  }
  if (!VALID_SENDERS.includes(from)) {
    res.status(400).json({ success: false, error: `Invalid sender: ${from}`, code: 'INVALID_PARAMS' });
    return;
  }
  if (!VALID_TYPES.includes(type)) {
    res.status(400).json({ success: false, error: `Invalid message type: ${type}`, code: 'INVALID_PARAMS' });
    return;
  }
  if (content.length > 2000) {
    res.status(400).json({ success: false, error: 'Content too long (max 2000 chars)', code: 'INVALID_PARAMS' });
    return;
  }

  try {
    await sendMessage(to, content, type, from);
    res.json({ success: true, message_id: `msg_${Date.now()}` });
  } catch (err) {
    res.status(503).json({ success: false, error: String(err), code: 'SCRIPT_ERROR' });
  }
}
