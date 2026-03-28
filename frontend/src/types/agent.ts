export type AgentStatus = 'online' | 'working' | 'idle' | 'offline';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  role: string;
  last_updated: string;
  inbox_unread_count?: number;
}
