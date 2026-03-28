import { useState } from 'react';
import { useMutation } from 'react-query';
import { sendMessage } from '../api/messages';
import { AGENTS, MESSAGE_TYPES, AGENT_ICONS } from '../utils/constants';
import { MessageType } from '../types/message';
import { Send, CheckCircle } from 'lucide-react';

export function SendMessage() {
  const [to, setTo] = useState('');
  const [type, setType] = useState<MessageType>('task_assigned');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useMutation(sendMessage, {
    onSuccess: () => {
      setSuccess(true);
      setContent('');
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!to || !content.trim()) return;
    mutation.mutate({ to, from: 'fury', type, content: content.trim() });
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-white mb-6">指示送信</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-shield-card border border-shield-border rounded-xl p-6">
        {/* 送信先 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">送信先エージェント</label>
          <select
            value={to}
            onChange={e => setTo(e.target.value)}
            required
            className="w-full bg-shield-panel border border-shield-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-avengers-gold/50"
          >
            <option value="">選択してください</option>
            {AGENTS.map(a => (
              <option key={a.id} value={a.id}>
                {AGENT_ICONS[a.id]} {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* メッセージ種別 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">メッセージ種別</label>
          <div className="flex flex-wrap gap-2">
            {MESSAGE_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value as MessageType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  type === t.value
                    ? 'bg-avengers-red/20 border-avengers-red/50 text-avengers-gold'
                    : 'bg-shield-panel border-shield-border text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 本文 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            本文
            <span className="ml-2 text-xs text-gray-500">{content.length}/2000</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            maxLength={2000}
            rows={6}
            placeholder="指示内容を入力..."
            className="w-full bg-shield-panel border border-shield-border rounded-lg px-3 py-2 text-white text-sm font-mono resize-y focus:outline-none focus:border-avengers-gold/50 placeholder-gray-600"
          />
        </div>

        {/* エラー */}
        {mutation.isError && (
          <p className="text-red-400 text-sm">{String(mutation.error)}</p>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={mutation.isLoading || !to || !content.trim()}
          className="w-full flex items-center justify-center gap-2 bg-avengers-red hover:bg-avengers-red/80 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {mutation.isLoading ? (
            <span className="animate-spin">⟳</span>
          ) : success ? (
            <><CheckCircle size={16} /> 送信完了</>
          ) : (
            <><Send size={16} /> 送信</>
          )}
        </button>
      </form>
    </div>
  );
}
