import { useAgents } from '../hooks/useAgents';
import { AgentStatusGrid } from '../components/agents/AgentStatusGrid';

export function Agents() {
  const { data: agents, isLoading } = useAgents();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">エージェント一覧</h1>
      {isLoading ? (
        <p className="text-gray-400">読み込み中...</p>
      ) : (
        <AgentStatusGrid agents={agents ?? []} />
      )}
    </div>
  );
}
