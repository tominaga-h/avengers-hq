import { Request, Response } from 'express';

// Phase 1 MVP: スタブ実装
export function listAlerts(_req: Request, res: Response): void {
  res.json({ alerts: [] });
}

export function dismissAlert(req: Request, res: Response): void {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ success: false, error: 'Alert ID required', code: 'INVALID_PARAMS' });
    return;
  }
  res.json({ success: true });
}
