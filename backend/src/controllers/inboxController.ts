import { Request, Response } from 'express';
import path from 'path';
import { readInbox, writeInbox } from '../services/yamlService';

const AVENGERS_ROOT = process.env.AVENGERS_ROOT ?? '/Users/mad-tmng/multi-agent-avengers';
const VALID_AGENTS = ['jarvis', 'tony', 'bruce', 'cap', 'marvel', 'peter', 'starlord'];

function inboxPath(agent: string): string {
  return path.join(AVENGERS_ROOT, 'queue', 'inbox', `${agent}.yaml`);
}

export function getInbox(req: Request, res: Response): void {
  const { agent } = req.params;
  if (!VALID_AGENTS.includes(agent)) {
    res.status(404).json({ success: false, error: `Agent not found: ${agent}`, code: 'NOT_FOUND' });
    return;
  }

  const unreadOnly = req.query['unread_only'] === 'true';
  const limit = parseInt(req.query['limit'] as string ?? '20', 10);

  const inbox = readInbox(inboxPath(agent));
  let messages = inbox.messages;
  if (unreadOnly) messages = messages.filter(m => !m.read);
  messages = messages.slice(-limit).reverse(); // 最新順

  res.json({
    agent,
    unread_count: inbox.messages.filter(m => !m.read).length,
    messages,
  });
}

export function markRead(req: Request, res: Response): void {
  const { agent, msgId } = req.params;
  if (!VALID_AGENTS.includes(agent)) {
    res.status(404).json({ success: false, error: `Agent not found: ${agent}`, code: 'NOT_FOUND' });
    return;
  }

  const inbox = readInbox(inboxPath(agent));
  const msg = inbox.messages.find(m => m.id === msgId);
  if (!msg) {
    res.status(404).json({ success: false, error: `Message not found: ${msgId}`, code: 'NOT_FOUND' });
    return;
  }
  msg.read = true;
  writeInbox(inboxPath(agent), inbox);
  res.json({ success: true });
}

export function markAllRead(req: Request, res: Response): void {
  const { agent } = req.params;
  if (!VALID_AGENTS.includes(agent)) {
    res.status(404).json({ success: false, error: `Agent not found: ${agent}`, code: 'NOT_FOUND' });
    return;
  }

  const inbox = readInbox(inboxPath(agent));
  let count = 0;
  inbox.messages.forEach(m => {
    if (!m.read) { m.read = true; count++; }
  });
  writeInbox(inboxPath(agent), inbox);
  res.json({ success: true, marked_count: count });
}
