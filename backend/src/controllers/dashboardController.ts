import { Request, Response } from 'express';
import { getDashboard } from '../services/dashboardService';

export function getDashboardContent(_req: Request, res: Response): void {
  const data = getDashboard();
  res.json(data);
}
