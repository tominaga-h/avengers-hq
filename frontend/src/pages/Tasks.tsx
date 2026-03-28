import { useQuery } from 'react-query';
import client from '../api/client';

export function Tasks() {
  const { data } = useQuery('tasks', () => client.get('/tasks').then(r => r.data));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">タスク一覧</h1>
      <div className="bg-shield-card border border-shield-border rounded-xl p-5">
        {data?.tasks?.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">タスクなし（Phase 3で実装予定）</p>
        ) : (
          <p className="text-gray-400 text-sm">読み込み中...</p>
        )}
      </div>
    </div>
  );
}
