// yamlService.ts — Bruce (Hulk) が実装する
// YAMLファイルの読み込みサービス
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Message } from '../types/message';
import { AgentStatus } from '../types/agent';

export interface InboxYaml {
  messages: Message[];
}

export function readInbox(inboxPath: string): InboxYaml {
  if (!fs.existsSync(inboxPath)) {
    return { messages: [] };
  }
  const raw = fs.readFileSync(inboxPath, 'utf-8');
  const parsed = yaml.load(raw) as InboxYaml;
  return parsed ?? { messages: [] };
}

export interface AgentStatusResult {
  status: AgentStatus;
  last_updated: string;
  unread_count: number;
}

/**
 * inbox の最終メッセージ timestamp からエージェントのステータスを動的判定する。
 * - 5分以内  → 'working'
 * - 1時間以内 → 'online'
 * - 1時間超  → 'idle'
 * - inbox なし / メッセージなし → 'offline'
 */
export function getAgentStatus(inboxPath: string): AgentStatusResult {
  const inbox = readInbox(inboxPath);
  const messages = inbox.messages;

  if (messages.length === 0) {
    return { status: 'offline', last_updated: new Date().toISOString(), unread_count: 0 };
  }

  const unread_count = messages.filter(m => !m.read).length;

  // 全メッセージ中の最新 timestamp を取得
  const latestTs = messages.reduce((max, m) => {
    const t = new Date(m.timestamp).getTime();
    return t > max ? t : max;
  }, 0);

  const diffMs = Date.now() - latestTs;
  const diffMin = diffMs / 60000;

  let status: AgentStatus;
  if (diffMin <= 5)    status = 'working';
  else if (diffMin <= 60) status = 'online';
  else                 status = 'idle';

  return { status, last_updated: new Date(latestTs).toISOString(), unread_count };
}

// inbox_write.sh と同じ mkdir ベースのロック機構を使って排他書き込み
export function writeInbox(inboxPath: string, data: InboxYaml): void {
  const lockDir = `${inboxPath}.lock.d`;
  const MAX_ATTEMPTS = 30;
  const RETRY_MS = 100;

  const sleepSync = (ms: number) => {
    const end = Date.now() + ms;
    while (Date.now() < end) { /* busy-wait — lock window is <100ms */ }
  };

  let acquired = false;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      fs.mkdirSync(lockDir);
      acquired = true;
      break;
    } catch {
      sleepSync(RETRY_MS);
    }
  }
  if (!acquired) {
    throw Object.assign(new Error('Failed to acquire inbox lock'), { statusCode: 409, code: 'LOCK_CONFLICT' });
  }

  try {
    const tmpPath = `${inboxPath}.${process.pid}.tmp`;
    fs.writeFileSync(tmpPath, yaml.dump(data, { indent: 2 }), 'utf-8');
    fs.renameSync(tmpPath, inboxPath);
  } finally {
    try { fs.rmdirSync(lockDir); } catch { /* ignore */ }
  }
}
