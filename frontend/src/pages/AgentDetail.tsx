import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchAgent } from '../api/agents';
import { InboxViewer } from '../components/inbox/InboxViewer';
import { AGENT_ICONS, STATUS_LABELS } from '../utils/constants';
import { AgentStatus } from '../types/agent';
import { ArrowLeft } from 'lucide-react';
import client from '../api/client';

const STATUS_COLORS: Record<AgentStatus, string> = {
  online:  'bg-green-500',
  working: 'bg-blue-500',
  idle:    'bg-yellow-500',
  offline: 'bg-red-600',
};

const SUBTASK_STATUS_STYLES: Record<string, string> = {
  pending:     'bg-yellow-900 text-yellow-300 border border-yellow-700',
  in_progress: 'bg-blue-900 text-blue-300 border border-blue-700',
  done:        'bg-green-900 text-green-300 border border-green-700',
  completed:   'bg-green-900 text-green-300 border border-green-700',
  failed:      'bg-red-900 text-red-300 border border-red-700',
  assigned:    'bg-blue-900 text-blue-300 border border-blue-700',
  idle:        'bg-gray-800 text-gray-400 border border-gray-700',
};

type SubTask = {
  task_id: string;
  agent: string;
  status: string | null;
  working_dir: string | null;
};

type Command = {
  id: string;
  purpose: string | null;
  status: string | null;
  priority: string | null;
  timestamp: string | null;
  subtasks: SubTask[];
};

function statusBadge(status: string | null) {
  const s = status ?? 'idle';
  const style = SUBTASK_STATUS_STYLES[s] ?? SUBTASK_STATUS_STYLES.idle;
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-mono ${style}`}>{s}</span>
  );
}

type Tab = 'inbox' | 'tasks';

export function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('inbox');

  const { data: agent, isLoading } = useQuery(['agent', id], () => fetchAgent(id!), {
    enabled: !!id,
    refetchInterval: 5000,
  });

  const { data: tasksData } = useQuery(
    'tasks',
    () => client.get('/tasks').then(r => r.data),
    { refetchInterval: 15000, enabled: activeTab === 'tasks' }
  );

  if (isLoading) return <p className="text-gray-400">読み込み中...</p>;
  if (!agent) return <p className="text-red-400">エージェントが見つかりません</p>;

  const icon = AGENT_ICONS[agent.id] ?? '👤';
  const statusColor = STATUS_COLORS[agent.status];

  const commands: Command[] = tasksData?.commands ?? [];
  const agentCommands = commands
    .map(cmd => ({
      ...cmd,
      subtasks: cmd.subtasks.filter(sub => sub.agent === id),
    }))
    .filter(cmd => cmd.subtasks.length > 0);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'inbox', label: '受信ボックス' },
    { id: 'tasks', label: 'タスク' },
  ];

  return (
    <div className="space-y-6">
      <Link to="/agents" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft size={14} /> エージェント一覧
      </Link>

      {/* ヘッダー */}
      <div className="flex items-center gap-4 bg-shield-card border border-shield-border rounded-xl p-5">
        <span className="text-5xl">{icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
          <p className="text-gray-400 text-sm">{agent.role}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
            <span className="text-sm text-gray-300">{STATUS_LABELS[agent.status]}</span>
            {(agent.inbox_unread_count ?? 0) > 0 && (
              <span className="bg-avengers-red/20 text-avengers-gold text-xs px-2 py-0.5 rounded-full border border-avengers-red/30">
                未読 {agent.inbox_unread_count}件
              </span>
            )}
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeTab === tab.id
                ? 'bg-avengers-red/20 border-avengers-red/50 text-avengers-gold'
                : 'bg-shield-card border-shield-border text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div className="bg-shield-card border border-shield-border rounded-xl p-5">
        {activeTab === 'inbox' && <InboxViewer agent={agent.id} />}

        {activeTab === 'tasks' && (
          agentCommands.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">タスクなし</p>
          ) : (
            <div className="space-y-3">
              {agentCommands.map(cmd => (
                <div key={cmd.id} className="border border-shield-border rounded-lg overflow-hidden">
                  <div className="px-4 py-3 flex items-center gap-3 bg-white/5">
                    <span className="text-blue-400 font-mono font-bold text-sm w-20 shrink-0">{cmd.id}</span>
                    <span className="text-white text-sm flex-1 truncate">{cmd.purpose ?? '（説明なし）'}</span>
                    {cmd.priority && (
                      <span className="text-xs text-gray-400 font-mono shrink-0">{cmd.priority}</span>
                    )}
                    {statusBadge(cmd.status)}
                  </div>
                  <div className="px-4 py-2 space-y-1.5">
                    {cmd.subtasks.map(sub => (
                      <div key={sub.task_id} className="flex items-center gap-3 text-sm py-1">
                        <span className="text-gray-300 font-mono text-xs flex-1 truncate">{sub.task_id}</span>
                        {statusBadge(sub.status)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
