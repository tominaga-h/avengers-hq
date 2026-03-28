// dashboardService.ts — Bruce (Hulk) が実装する
// dashboard.md の読み込みサービス
import fs from 'fs';
import path from 'path';

const AVENGERS_ROOT = process.env.AVENGERS_ROOT ?? '/Users/mad-tmng/multi-agent-avengers';
const DASHBOARD_PATH = path.join(AVENGERS_ROOT, 'dashboard.md');

export function getDashboard(): { content: string; last_modified: string } {
  if (!fs.existsSync(DASHBOARD_PATH)) {
    return { content: '', last_modified: new Date().toISOString() };
  }
  const content = fs.readFileSync(DASHBOARD_PATH, 'utf-8');
  const stat = fs.statSync(DASHBOARD_PATH);
  return {
    content,
    last_modified: stat.mtime.toISOString(),
  };
}
