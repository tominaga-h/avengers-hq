import { useState } from 'react';
import { AGENTS, AGENT_ICONS } from '../utils/constants';
import { InboxViewer } from '../components/inbox/InboxViewer';

export function Inbox() {
  const [selectedAgent, setSelectedAgent] = useState('jarvis');

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-white">受信ボックス</h1>

      {/* エージェント切り替えタブ */}
      <div className="flex flex-wrap gap-2">
        {AGENTS.map(a => (
          <button
            key={a.id}
            onClick={() => setSelectedAgent(a.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              selectedAgent === a.id
                ? 'bg-avengers-red/20 border-avengers-red/50 text-avengers-gold'
                : 'bg-shield-card border-shield-border text-gray-400 hover:text-white'
            }`}
          >
            {AGENT_ICONS[a.id]} {a.name}
          </button>
        ))}
      </div>

      <div className="bg-shield-card border border-shield-border rounded-xl p-5">
        <InboxViewer agent={selectedAgent} />
      </div>
    </div>
  );
}
