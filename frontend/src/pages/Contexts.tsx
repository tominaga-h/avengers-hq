import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { FileText, Folder } from 'lucide-react';
import client from '../api/client';

interface ContextList {
  files: { path: string; name: string }[];
  grouped: Record<string, string[]>;
}

export function Contexts() {
  const { data, isLoading, isError } = useQuery<ContextList>(
    'contexts',
    () => client.get('/contexts').then(r => r.data),
    { refetchInterval: 30000 }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-white">コンテキスト</h1>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-gray-400 text-sm text-center py-8">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-white">コンテキスト</h1>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-red-400 text-sm text-center py-8">データの取得に失敗しました</p>
        </div>
      </div>
    );
  }

  const dirs = Object.keys(data.grouped).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">コンテキスト</h1>

      <div className="space-y-4">
        {dirs.map(dir => (
          <div key={dir} className="bg-shield-card border border-shield-border rounded-xl overflow-hidden">
            {/* フォルダヘッダー */}
            <div className="px-5 py-3 border-b border-shield-border bg-white/[0.02] flex items-center gap-2">
              <Folder size={14} className="text-avengers-gold" />
              <span className="text-sm font-semibold text-avengers-gold">{dir === '.' ? 'root' : dir}</span>
              <span className="text-xs text-gray-500 ml-auto">{data.grouped[dir].length} files</span>
            </div>

            {/* ファイル一覧 */}
            <div className="divide-y divide-shield-border">
              {data.grouped[dir].sort().map(filePath => {
                const fileName = filePath.split('/').pop() ?? filePath;
                return (
                  <Link
                    key={filePath}
                    to={`/contexts/${filePath}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors"
                  >
                    <FileText size={14} className="text-gray-400 shrink-0" />
                    <span className="text-blue-400 text-sm hover:underline">{fileName}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
