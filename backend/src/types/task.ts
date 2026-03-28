export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  agent: string;
  description: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}
