import { Agent, AgentStatus } from '../../types/agent';
import { AGENT_ICONS, STATUS_LABELS } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS: Record<AgentStatus, string> = {
  online:  'bg-green-500',
  working: 'bg-blue-500',
  idle:    'bg-yellow-500',
  offline: 'bg-red-600',
};

const STATUS_RING: Record<AgentStatus, string> = {
  online:  'ring-green-500/40',
  working: 'ring-blue-500/40',
  idle:    'ring-yellow-500/40',
  offline: 'ring-red-600/40',
};

interface Props {
  agent: Agent;
}

export function AgentStatusCard({ agent }: Props) {
  const navigate = useNavigate();
  const icon = AGENT_ICONS[agent.id] ?? '👤';
  const color = STATUS_COLORS[agent.status];
  const ring = STATUS_RING[agent.status];

  return (
    <button
      onClick={() => navigate(`/agents/${agent.id}`)}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl bg-shield-card border border-shield-border ring-2 ${ring} hover:border-avengers-gold/50 transition-all text-left w-full`}
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-center">
        <p className="text-xs font-semibold text-white">{agent.name}</p>
        <p className="text-xs text-gray-400 truncate max-w-[80px]">{agent.role}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs text-gray-300">{STATUS_LABELS[agent.status]}</span>
      </div>
      {agent.inbox_unread_count !== undefined && agent.inbox_unread_count > 0 && (
        <span className="absolute -top-1 -right-1 bg-avengers-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {agent.inbox_unread_count}
        </span>
      )}
    </button>
  );
}
