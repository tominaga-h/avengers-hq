import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import client from '../api/client';

type SubTask = {
  task_id: string;
  agent: string;
  description: string | null;
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

type Tab = 'tasks' | 'subtasks';

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

const TABS: { id: Tab; label: string }[] = [
  { id: 'tasks', label: 'タスク' },
  { id: 'subtasks', label: 'サブタスク' },
];

export function Tasks() {
  const { data, isLoading, isError } = useQuery(
    'tasks',
    () => client.get('/tasks').then(r => r.data),
    { refetchInterval: 15000 }
  );

  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-white">タスク一覧</h1>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-gray-400 text-sm text-center py-8">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-white">タスク一覧</h1>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-red-400 text-sm text-center py-8">データの取得に失敗しました</p>
        </div>
      </div>
    );
  }

  const commands: Command[] = [...(data?.commands ?? [])].sort((a, b) => b.id.localeCompare(a.id));

  const allSubtasks = commands.flatMap(cmd =>
    cmd.subtasks.map(sub => ({ ...sub, parentCmd: cmd.id }))
  ).sort((a, b) => b.task_id.localeCompare(a.task_id));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">タスク一覧</h1>

      {/* タブ */}
      <div className="flex gap-2">
        {TABS.map(tab => (
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

      {/* タスクビュー */}
      {activeTab === 'tasks' && (
        commands.length === 0 ? (
          <div className="bg-shield-card border border-shield-border rounded-xl p-5">
            <p className="text-gray-500 text-sm text-center py-8">コマンドなし</p>
          </div>
        ) : (
          <div className="space-y-3">
            {commands.map(cmd => (
              <div key={cmd.id} className="bg-shield-card border border-shield-border rounded-xl overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                  onClick={() => toggle(cmd.id)}
                >
                  <Link
                    to={`/tasks/${cmd.id}`}
                    className="text-blue-400 font-mono font-bold text-sm w-20 shrink-0 hover:underline"
                    onClick={e => e.stopPropagation()}
                  >{cmd.id}</Link>
                  <span className="text-white text-sm flex-1 truncate">{cmd.purpose ?? '（説明なし）'}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    {cmd.priority && (
                      <span className="text-xs text-gray-400 font-mono">{cmd.priority}</span>
                    )}
                    {statusBadge(cmd.status)}
                    <span className="text-gray-500 text-xs">{expanded[cmd.id] ? '▲' : '▼'}</span>
                  </div>
                </button>

                {expanded[cmd.id] && (
                  <div className="border-t border-shield-border px-5 py-4 space-y-2.5">
                    {cmd.subtasks.length === 0 ? (
                      <p className="text-gray-500 text-xs py-2">サブタスクなし</p>
                    ) : (
                      cmd.subtasks.map(sub => (
                        <Link
                          key={sub.task_id}
                          to={`/tasks/${sub.task_id}`}
                          className="w-full flex items-center gap-4 text-sm py-1.5 rounded-lg px-2 -mx-2 hover:bg-white/5 transition-colors"
                        >
                          <span className="text-gray-400 font-mono text-xs w-28 shrink-0">
                            {AGENT_NAMES[sub.agent] ?? sub.agent}
                          </span>
                          <span className="text-blue-400 font-mono text-xs shrink-0 hover:underline">{sub.task_id}</span>
                          <span className="text-gray-500 text-xs flex-1 truncate text-left">{sub.description ?? ''}</span>
                          {statusBadge(sub.status)}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* サブタスクビュー */}
      {activeTab === 'subtasks' && (
        allSubtasks.length === 0 ? (
          <div className="bg-shield-card border border-shield-border rounded-xl p-5">
            <p className="text-gray-500 text-sm text-center py-8">サブタスクなし</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allSubtasks.map(sub => {
              const summary = (sub.description ?? '').split('\n').find(l => l.trim()) ?? '';
              return (
                <div key={sub.task_id} className="bg-shield-card border border-shield-border rounded-xl overflow-hidden">
                  <div
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => toggle(sub.task_id)}
                  >
                    <Link
                      to={`/tasks/${sub.parentCmd}`}
                      className="text-blue-400 font-mono font-bold text-xs shrink-0 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >{sub.parentCmd}</Link>
                    <Link
                      to={`/tasks/${sub.task_id}`}
                      className="text-gray-300 font-mono text-xs shrink-0 hover:text-blue-400 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >{sub.task_id}</Link>
                    <span className="text-gray-400 font-mono text-xs w-24 shrink-0">
                      {AGENT_NAMES[sub.agent] ?? sub.agent}
                    </span>
                    <span className="text-white text-sm flex-1 truncate">{summary}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      {statusBadge(sub.status)}
                      <span className="text-gray-500 text-xs">{expanded[sub.task_id] ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expanded[sub.task_id] && (
                    <div className="border-t border-shield-border">
                      <div className="px-6 py-5 prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {sub.description ?? '（詳細なし）'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
