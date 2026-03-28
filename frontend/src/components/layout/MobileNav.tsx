import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Send, Inbox, AlertTriangle } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/',       icon: LayoutDashboard, label: 'HQ' },
  { path: '/agents', icon: Users,           label: 'エージェント' },
  { path: '/send',   icon: Send,            label: '送信' },
  { path: '/inbox',  icon: Inbox,           label: '受信' },
  { path: '/alerts', icon: AlertTriangle,   label: 'アラート' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-shield-panel border-t border-shield-border flex lg:hidden z-30">
      {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive ? 'text-avengers-gold' : 'text-gray-500 hover:text-gray-300'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
