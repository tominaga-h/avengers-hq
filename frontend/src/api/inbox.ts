import client from './client';
import { InboxData } from '../types/message';

export async function fetchInbox(agent: string, unreadOnly = false, limit = 20): Promise<InboxData> {
  const res = await client.get<InboxData>(`/inbox/${agent}`, {
    params: { unread_only: unreadOnly, limit },
  });
  return res.data;
}

export async function markMessageRead(agent: string, msgId: string): Promise<void> {
  await client.post(`/inbox/${agent}/read/${msgId}`);
}

export async function markAllRead(agent: string): Promise<void> {
  await client.post(`/inbox/${agent}/read-all`);
}
