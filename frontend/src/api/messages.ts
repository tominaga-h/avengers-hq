import client from './client';
import { MessageType } from '../types/message';

interface SendPayload {
  to: string;
  from: string;
  type: MessageType;
  content: string;
}

export async function sendMessage(payload: SendPayload): Promise<{ message_id: string }> {
  const res = await client.post<{ success: boolean; message_id: string }>('/messages/send', payload);
  return res.data;
}
