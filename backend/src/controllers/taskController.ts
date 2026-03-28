import { Request, Response } from 'express';

// タスクはinbox yamlから集約するか将来的なtask.yamlから読む
// Phase 1 MVP: 空リストを返すスタブ
export function listTasks(_req: Request, res: Response): void {
  res.json({ tasks: [] });
}
