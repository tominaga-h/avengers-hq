import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Users, Send, Inbox, AlertTriangle, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/',          icon: LayoutDashboard, label: 'ダッシュボード' },
  { path: '/tasks',     icon: ListTodo,        label: 'タスク一覧' },
  { path: '/agents',    icon: Users,           label: 'エージェント' },
  { path: '/send',      icon: Send,            label: '指示送信' },
  { path: '/inbox',     icon: Inbox,           label: '受信ボックス' },
  { path: '/contexts',  icon: BookOpen,        label: 'コンテキスト' },
  { path: '/alerts',    icon: AlertTriangle,   label: 'アラート' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      {/* モバイルオーバーレイ */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-56 bg-shield-panel border-r border-shield-border z-20
        transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-auto lg:block
      `}>
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-avengers-red/20 text-avengers-gold border border-avengers-red/30'
                    : 'text-gray-400 hover:text-white hover:bg-shield-card'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
