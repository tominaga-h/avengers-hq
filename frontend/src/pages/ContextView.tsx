import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import client from '../api/client';

export function ContextView() {
  const { '*': filePath } = useParams();

  const { data, isLoading, isError } = useQuery(
    ['context', filePath],
    () => client.get(`/contexts/${filePath}`).then(r => r.data),
    { enabled: !!filePath }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link to="/contexts" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> コンテキスト一覧に戻る
        </Link>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-gray-400 text-sm text-center py-8">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <Link to="/contexts" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> コンテキスト一覧に戻る
        </Link>
        <div className="bg-shield-card border border-shield-border rounded-xl p-5">
          <p className="text-red-400 text-sm text-center py-8">ファイルが見つかりません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/contexts" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft size={14} /> コンテキスト一覧に戻る
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-white">{filePath?.split('/').pop()}</h1>
        <span className="text-xs text-gray-500 font-mono">{filePath}</span>
      </div>

      <div className="bg-shield-card border border-shield-border rounded-xl p-6 prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
