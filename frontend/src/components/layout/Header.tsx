import { Bell, Menu } from 'lucide-react';
import { useAgents } from '../../hooks/useAgents';
import { Link } from 'react-router-dom';

interface Props {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: Props) {
  const { data: agents } = useAgents();
  const totalUnread = agents?.reduce((sum, a) => sum + (a.inbox_unread_count ?? 0), 0) ?? 0;

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-shield-border bg-shield-panel sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded hover:bg-shield-card text-gray-400"
          aria-label="メニュー"
        >
          <Menu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-avengers-gold font-bold text-lg tracking-widest">AVENGERS HQ</span>
        </Link>
      </div>
      <Link to="/inbox" className="relative p-2 rounded hover:bg-shield-card text-gray-300 hover:text-avengers-gold transition-colors">
        <Bell size={20} />
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-avengers-red text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </Link>
    </header>
  );
}
