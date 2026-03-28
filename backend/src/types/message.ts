export type MessageType = 'task_assigned' | 'ping' | 'report_completed' | 'wake_up';

export interface Message {
  id: string;
  from: string;
  timestamp: string;
  type: MessageType;
  content: string;
  read: boolean;
}

export interface InboxResponse {
  agent: string;
  unread_count: number;
  messages: Message[];
}

export interface SendMessageRequest {
  to: string;
  from: string;
  type: MessageType;
  content: string;
}
