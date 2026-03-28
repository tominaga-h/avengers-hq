import { Agent } from '../../types/agent';
import { AgentStatusCard } from './AgentStatusCard';

interface Props {
  agents: Agent[];
}

export function AgentStatusGrid({ agents }: Props) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {agents.map(agent => (
        <div key={agent.id} className="relative">
          <AgentStatusCard agent={agent} />
        </div>
      ))}
    </div>
  );
}
