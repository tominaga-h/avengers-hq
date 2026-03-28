import { Request, Response } from 'express';
import path from 'path';
import { getAgentStatus } from '../services/yamlService';
import { Agent, AgentDetail } from '../types/agent';

const AVENGERS_ROOT = process.env.AVENGERS_ROOT ?? '/Users/mad-tmng/multi-agent-avengers';

const AGENT_META: Pick<Agent, 'id' | 'name' | 'role'>[] = [
  { id: 'jarvis',   name: 'JARVIS',          role: '司令塔・窓口' },
  { id: 'tony',     name: 'IRON MAN',        role: '開発班リーダー' },
  { id: 'bruce',    name: 'HULK',            role: 'デバッグ・分析' },
  { id: 'cap',      name: 'CAPTAIN AMERICA', role: 'コードレビュー・テスト' },
  { id: 'marvel',   name: 'CAPTAIN MARVEL',  role: 'パフォーマンス・セキュリティ' },
  { id: 'peter',    name: 'SPIDER-MAN',      role: 'YouTube監視' },
  { id: 'starlord', name: 'STAR-LORD',       role: 'Spotifyプレイリスト' },
];

const VALID_IDS = new Set(AGENT_META.map(a => a.id));

function inboxPath(agentId: string): string {
  return path.join(AVENGERS_ROOT, 'queue', 'inbox', `${agentId}.yaml`);
}

function buildAgent(meta: typeof AGENT_META[number]): Agent {
  const { status, last_updated, unread_count } = getAgentStatus(inboxPath(meta.id));
  return { ...meta, status, last_updated, inbox_unread_count: unread_count };
}

export function listAgents(_req: Request, res: Response): void {
  const agents = AGENT_META.map(buildAgent);
  res.json({ agents });
}

export function getAgent(req: Request, res: Response): void {
  const { id } = req.params;
  if (!VALID_IDS.has(id)) {
    res.status(404).json({ success: false, error: `Agent not found: ${id}`, code: 'NOT_FOUND' });
    return;
  }
  const meta = AGENT_META.find(a => a.id === id)!;
  const { status, last_updated, unread_count } = getAgentStatus(inboxPath(id));
  const detail: AgentDetail = {
    ...meta,
    status,
    last_updated,
    inbox_unread_count: unread_count,
  };
  res.json(detail);
}
