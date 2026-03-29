import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
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
  north_star: string | null;
  command: string | null;
  acceptance_criteria: string[];
  project: string | null;
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

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery(
    'tasks',
    () => client.get('/tasks').then(r => r.data),
    { refetchInterval: 15000 }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> タスク一覧に戻る
        </Link>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-gray-400 text-sm text-center py-8">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> タスク一覧に戻る
        </Link>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-red-400 text-sm text-center py-8">データの取得に失敗しました</p>
        </div>
      </div>
    );
  }

  const commands: Command[] = data?.commands ?? [];

  // タスク(cmd)として検索
  const command = commands.find(cmd => cmd.id === id);
  if (command) {
    return <CommandDetail command={command} />;
  }

  // サブタスクとして検索
  for (const cmd of commands) {
    const sub = cmd.subtasks.find(s => s.task_id === id);
    if (sub) {
      return <SubtaskDetail subtask={sub} parentCmd={cmd} />;
    }
  }

  // 見つからない
  return (
    <div className="space-y-6">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft size={14} /> タスク一覧に戻る
      </Link>
      <div className="bg-shield-card border border-shield-border rounded-xl p-5">
        <p className="text-gray-500 text-sm text-center py-8">「{id}」に該当するタスクが見つかりません</p>
      </div>
    </div>
  );
}

function CommandDetail({ command }: { command: Command }) {
  return (
    <div className="space-y-6">
      <Link to="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft size={14} /> タスク一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="bg-shield-card border border-shield-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-blue-400 font-mono font-bold text-lg">{command.id}</span>
          {statusBadge(command.status)}
          {command.priority && (
            <span className="text-xs text-gray-400 font-mono">{command.priority}</span>
          )}
          {command.project && (
            <span className="text-xs text-gray-500 font-mono">{command.project}</span>
          )}
        </div>
        <p className="text-white">{command.purpose ?? '（説明なし）'}</p>
        {command.north_star && (
          <div className="flex gap-3 text-sm">
            <span className="text-gray-500 shrink-0">North Star:</span>
            <span className="text-avengers-gold text-sm">{command.north_star}</span>
          </div>
        )}
        {command.timestamp && (
          <p className="text-gray-500 text-xs font-mono">{command.timestamp}</p>
        )}
      </div>

      {/* 指令内容 */}
      {command.command && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            指令内容
          </h2>
          <div className="bg-shield-card border border-shield-border rounded-xl p-6 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {command.command}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* 受け入れ基準 */}
      {command.acceptance_criteria.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            受け入れ基準
          </h2>
          <div className="bg-shield-card border border-shield-border rounded-xl p-5">
            <ul className="space-y-2">
              {command.acceptance_criteria.map((ac, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-green-500 shrink-0">&#x2713;</span>
                  <span className="text-gray-300">{ac}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* サブタスク一覧 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          サブタスク
        </h2>
        {command.subtasks.length === 0 ? (
          <div className="bg-shield-card border border-shield-border rounded-xl p-5">
            <p className="text-gray-500 text-xs text-center py-2">サブタスクなし</p>
          </div>
        ) : (
          <div className="space-y-2">
            {command.subtasks.map(sub => (
              <Link
                key={sub.task_id}
                to={`/tasks/${sub.task_id}`}
                className="flex items-center gap-4 text-sm py-3 px-5 bg-shield-card border border-shield-border rounded-xl hover:bg-white/5 transition-colors"
              >
                <span className="text-gray-400 font-mono text-xs w-28 shrink-0">
                  {AGENT_NAMES[sub.agent] ?? sub.agent}
                </span>
                <span className="text-blue-400 font-mono text-xs shrink-0 hover:underline">{sub.task_id}</span>
                <span className="text-gray-500 text-xs flex-1 truncate">{sub.description ?? ''}</span>
                {statusBadge(sub.status)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SubtaskDetail({ subtask, parentCmd }: { subtask: SubTask; parentCmd: Command }) {
  return (
    <div className="space-y-6">
      <Link to={`/tasks/${parentCmd.id}`} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft size={14} /> {parentCmd.id} に戻る
      </Link>

      {/* ヘッダー */}
      <div className="bg-shield-card border border-shield-border rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-4">
          <span className="text-gray-300 font-mono font-bold text-lg">{subtask.task_id}</span>
          {statusBadge(subtask.status)}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">親タスク:</span>
          <Link to={`/tasks/${parentCmd.id}`} className="text-blue-400 font-mono text-sm hover:underline">
            {parentCmd.id}
          </Link>
          <span className="text-gray-500 text-xs truncate">{parentCmd.purpose}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">実行者:</span>
          <span className="text-gray-300 font-mono">{AGENT_NAMES[subtask.agent] ?? subtask.agent}</span>
        </div>
      </div>

      {/* 内容 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          内容
        </h2>
        <div className="bg-shield-card border border-shield-border rounded-xl p-6 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {subtask.description ?? '（詳細なし）'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
