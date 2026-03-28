import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchAgent } from '../api/agents';
import { InboxViewer } from '../components/inbox/InboxViewer';
import { AGENT_ICONS, STATUS_LABELS } from '../utils/constants';
import { AgentStatus } from '../types/agent';
import { ArrowLeft } from 'lucide-react';

const STATUS_COLORS: Record<AgentStatus, string> = {
  online:  'bg-green-500',
  working: 'bg-blue-500',
  idle:    'bg-yellow-500',
  offline: 'bg-red-600',
};

export function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: agent, isLoading } = useQuery(['agent', id], () => fetchAgent(id!), {
    enabled: !!id,
    refetchInterval: 5000,
  });

  if (isLoading) return <p className="text-gray-400">読み込み中...</p>;
  if (!agent) return <p className="text-red-400">エージェントが見つかりません</p>;

  const icon = AGENT_ICONS[agent.id] ?? '👤';
  const statusColor = STATUS_COLORS[agent.status];

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

      {/* 受信ボックス */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">受信ボックス</h2>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <InboxViewer agent={agent.id} />
        </div>
      </section>
    </div>
  );
}
