import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Message } from '../../types/message';
import { AGENT_ICONS } from '../../utils/constants';
import { formatTimestamp } from '../../utils/format';

const TYPE_LABELS: Record<string, string> = {
  task_assigned:    'タスク',
  ping:             '疎通確認',
  report_completed: '完了報告',
  wake_up:          '起動',
};

const TYPE_COLORS: Record<string, string> = {
  task_assigned:    'bg-blue-900/50 text-blue-300 border-blue-700/50',
  ping:             'bg-gray-800 text-gray-300 border-gray-600',
  report_completed: 'bg-green-900/50 text-green-300 border-green-700/50',
  wake_up:          'bg-yellow-900/50 text-yellow-300 border-yellow-700/50',
};

interface Props {
  message: Message;
  onMarkRead?: (id: string) => void;
}

export function MessageCard({ message, onMarkRead }: Props) {
  const [expanded, setExpanded] = useState(false);
  const icon = AGENT_ICONS[message.from] ?? '📨';
  const typeColor = TYPE_COLORS[message.type] ?? TYPE_COLORS['ping'];
  const preview = message.content.slice(0, 50) + (message.content.length > 50 ? '…' : '');

  return (
    <div className={`rounded-lg border transition-colors ${message.read ? 'border-shield-border bg-shield-card/50' : 'border-avengers-gold/30 bg-shield-card'}`}>
      {/* ヘッダー行（常時表示） */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-lg shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{message.from.toUpperCase()}</span>
            <span className={`text-xs px-2 py-0.5 rounded border ${typeColor}`}>
              {TYPE_LABELS[message.type] ?? message.type}
            </span>
            {!message.read && <span className="w-2 h-2 rounded-full bg-avengers-gold shrink-0" title="未読" />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</span>
            {!expanded && (
              <span className="text-xs text-gray-500 truncate">{preview}</span>
            )}
          </div>
        </div>
        <span className="shrink-0 text-gray-500">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {/* 本文（展開時） */}
      <div className={`overflow-hidden transition-all duration-200 ${expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed border-t border-shield-border pt-3">
            {message.content}
          </p>
          {!message.read && onMarkRead && (
            <button
              onClick={e => { e.stopPropagation(); onMarkRead(message.id); }}
              className="mt-3 text-xs text-gray-400 hover:text-avengers-gold border border-shield-border hover:border-avengers-gold/50 px-3 py-1 rounded transition-colors"
            >
              既読にする
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
