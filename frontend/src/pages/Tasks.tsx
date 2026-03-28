import { useState } from 'react';
import { useQuery } from 'react-query';
import client from '../api/client';

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

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
  in_progress: 'bg-blue-900 text-blue-300 border border-blue-700',
  done: 'bg-green-900 text-green-300 border border-green-700',
  completed: 'bg-green-900 text-green-300 border border-green-700',
  failed: 'bg-red-900 text-red-300 border border-red-700',
  assigned: 'bg-blue-900 text-blue-300 border border-blue-700',
  idle: 'bg-gray-800 text-gray-400 border border-gray-700',
};

function statusBadge(status: string | null) {
  const s = status ?? 'idle';
  const style = STATUS_STYLES[s] ?? STATUS_STYLES.idle;
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-mono ${style}`}>
      {s}
    </span>
  );
}

const AGENT_NAMES: Record<string, string> = {
  tony: 'IRON MAN',
  cap: 'CAP',
  marvel: 'MARVEL',
  peter: 'SPIDER-MAN',
  starlord: 'STAR-LORD',
  bruce: 'HULK',
};

export function Tasks() {
  const { data, isLoading, isError } = useQuery(
    'tasks',
    () => client.get('/tasks').then(r => r.data),
    { refetchInterval: 15000 }
  );

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-white">タスク一覧</h1>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-gray-400 text-sm text-center py-8">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-white">タスク一覧</h1>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-red-400 text-sm text-center py-8">データの取得に失敗しました</p>
        </div>
      </div>
    );
  }

  const commands: Command[] = data?.commands ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">タスク一覧</h1>
      {commands.length === 0 ? (
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-gray-500 text-sm text-center py-8">コマンドなし</p>
        </div>
      ) : (
        commands.map(cmd => (
          <div key={cmd.id} className="bg-shield-card border border-shield-border rounded-xl overflow-hidden">
            {/* CMD header */}
            <button
              className="w-full text-left px-5 py-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
              onClick={() => toggle(cmd.id)}
            >
              <span className="text-blue-400 font-mono font-bold text-sm w-20 shrink-0">{cmd.id}</span>
              <span className="text-white text-sm flex-1 truncate">{cmd.purpose ?? '（説明なし）'}</span>
              <div className="flex items-center gap-2 shrink-0">
                {cmd.priority && (
                  <span className="text-xs text-gray-400 font-mono">{cmd.priority}</span>
                )}
                {statusBadge(cmd.status)}
                <span className="text-gray-500 text-xs ml-1">{expanded[cmd.id] ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Subtasks */}
            {expanded[cmd.id] && (
              <div className="border-t border-shield-border px-5 py-3 space-y-2">
                {cmd.subtasks.length === 0 ? (
                  <p className="text-gray-500 text-xs py-2">サブタスクなし</p>
                ) : (
                  cmd.subtasks.map(sub => (
                    <div key={sub.task_id} className="flex items-center gap-3 text-sm py-1">
                      <span className="text-gray-400 font-mono text-xs w-28 shrink-0">
                        {AGENT_NAMES[sub.agent] ?? sub.agent}
                      </span>
                      <span className="text-gray-300 font-mono text-xs flex-1 truncate">{sub.task_id}</span>
                      {statusBadge(sub.status)}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
