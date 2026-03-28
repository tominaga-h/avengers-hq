import { useInbox, useMarkRead, useMarkAllRead } from '../../hooks/useInbox';
import { MessageCard } from './MessageCard';

interface Props {
  agent: string;
}

export function InboxViewer({ agent }: Props) {
  const { data, isLoading } = useInbox(agent);
  const markRead = useMarkRead(agent);
  const markAll = useMarkAllRead(agent);

  if (isLoading) return <p className="text-gray-400 text-sm">読み込み中...</p>;
  if (!data) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {data.unread_count > 0 ? (
            <span className="text-avengers-gold font-semibold">{data.unread_count}件未読</span>
          ) : (
            '未読なし'
          )}
          　/ 全{data.messages.length}件
        </p>
        {data.unread_count > 0 && (
          <button
            onClick={() => markAll.mutate()}
            className="text-xs text-gray-400 hover:text-white border border-shield-border hover:border-gray-500 px-3 py-1 rounded transition-colors"
          >
            すべて既読
          </button>
        )}
      </div>
      {data.messages.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">メッセージなし</p>
      ) : (
        data.messages.map(msg => (
          <MessageCard
            key={msg.id}
            message={msg}
            onMarkRead={id => markRead.mutate(id)}
          />
        ))
      )}
    </div>
  );
}
