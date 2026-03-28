import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { useAgents } from '../hooks/useAgents';
import { useDashboard } from '../hooks/useDashboard';
import { AgentStatusGrid } from '../components/agents/AgentStatusGrid';
import { RefreshCw } from 'lucide-react';
import { timeAgo } from '../utils/format';

const mdComponents: Components = {
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-shield-border text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-shield-panel">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-shield-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-shield-panel/60 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-avengers-gold border border-shield-border">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-gray-300 border border-shield-border">{children}</td>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold text-white mt-8 mb-3 border-b border-shield-border pb-1">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-avengers-gold mt-6 mb-2">{children}</h3>
  ),
};

export function Dashboard() {
  const { data: agents, isLoading: agentsLoading, refetch, dataUpdatedAt } = useAgents();
  const { data: dashboard } = useDashboard();

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">作戦本部</h1>
        <div className="flex items-center gap-3">
          {dataUpdatedAt > 0 && (
            <span className="text-xs text-gray-500">{timeAgo(new Date(dataUpdatedAt).toISOString())}更新</span>
          )}
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded hover:bg-shield-card text-gray-400 hover:text-white transition-colors"
            aria-label="更新"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* エージェントグリッド */}
      <section>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          エージェントステータス
        </h2>
        {agentsLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-shield-card animate-pulse" />
            ))}
          </div>
        ) : (
          <AgentStatusGrid agents={agents ?? []} />
        )}
      </section>

      {/* ダッシュボードMD */}
      {dashboard && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            作戦ログ
          </h2>
          <div className="bg-shield-card border border-shield-border rounded-xl p-5 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {dashboard.content}
            </ReactMarkdown>
          </div>
        </section>
      )}
    </div>
  );
}
