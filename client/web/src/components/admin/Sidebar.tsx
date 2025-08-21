import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../ui';

const navItems = [
  { key: 'movies_all', label: 'All Movies', to: '/admin/dashboard/movies' },
  { key: 'movie_add', label: 'Add Movie', to: '/admin/dashboard/addmovie' },
  { key: 'plan_add', label: 'Add Plan', to: '/admin/dashboard/addplan' },
  { key: 'plans_all', label: 'All Plans', to: '/admin/dashboard/plans' },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <aside
      className={`transition-all duration-200 h-full backdrop-blur-sm shadow-lg border-r ${
        collapsed ? 'w-16' : 'w-64'
      } bg-gradient-to-b from-black/80 to-black/60 border-white/20`}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/15">
        <span className={`text-sm font-semibold tracking-wide ${collapsed ? 'opacity-0 pointer-events-none' : ''}`}>Admin Panel</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed((s) => !s)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hover:bg-white/5"
        >
          {collapsed ? '›' : '‹'}
        </Button>
      </div>

      <nav className="p-2 space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <div key={item.key} className="relative">
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded bg-[#e50914]" aria-hidden />
              )}
              <Button
                variant={active ? 'primary' : 'ghost'}
                className={`w-full justify-start ${collapsed ? 'px-2' : 'pl-4 pr-3'} rounded-md hover:bg-white/5 border border-transparent ${active ? 'ring-1 ring-white/20' : ''}`}
                onClick={() => navigate(item.to)}
                aria-label={item.label}
                title={collapsed ? item.label : ''}
              >
                {collapsed ? item.label.charAt(0) : item.label}
              </Button>
            </div>
          );
        })}
        <div className="mt-2 border-t border-white/10" />
      </nav>
    </aside>
  );
};

export default Sidebar;
