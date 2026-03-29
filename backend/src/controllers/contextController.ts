import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const AVENGERS_ROOT = process.env.AVENGERS_ROOT ?? '/Users/mad-tmng/multi-agent-avengers';
const CONTEXT_DIR = path.join(AVENGERS_ROOT, 'context');

function walkMd(dir: string, base: string): { path: string; name: string }[] {
  if (!fs.existsSync(dir)) return [];
  const results: { path: string; name: string }[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.md')) {
      results.push({ path: rel, name: entry.name });
    }
  }
  return results;
}

export function listContexts(_req: Request, res: Response): void {
  const files = walkMd(CONTEXT_DIR, '');
  // フォルダごとにグルーピング
  const grouped: Record<string, string[]> = {};
  for (const f of files) {
    const dir = path.dirname(f.path) || '.';
    if (!grouped[dir]) grouped[dir] = [];
    grouped[dir].push(f.path);
  }
  res.json({ files, grouped });
}

export function getContext(req: Request, res: Response): void {
  // req.params[0] にワイルドカード部分が入る
  const filePath = req.params[0];
  if (!filePath) {
    res.status(400).json({ error: 'path required' });
    return;
  }

  // パストラバーサル防止
  const resolved = path.resolve(CONTEXT_DIR, filePath);
  if (!resolved.startsWith(CONTEXT_DIR)) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  if (!fs.existsSync(resolved)) {
    res.status(404).json({ error: 'not found' });
    return;
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  res.json({ path: filePath, content });
}
