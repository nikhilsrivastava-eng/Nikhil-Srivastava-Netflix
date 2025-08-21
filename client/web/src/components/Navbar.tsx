import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { useAuthStore } from '../store/authstore';

const Logo: React.FC = () => (
  <Link to="/" className="flex items-center gap-2 group">
    {/* Netflix-like N mark (simple) */}
    <svg width="28" height="28" viewBox="0 0 24 24" className="text-[#e50914]" aria-hidden>
      <path fill="currentColor" d="M4 3h3.2l6.4 12.2V3H20v18h-3.2L10.4 8.8V21H4V3z" />
    </svg>
    <span className="text-xl font-bold tracking-wide group-hover:opacity-90">Netflix</span>
  </Link>
);

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    // close on route change
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (_) {
      // ignore; store sets error
    }
  };

  const dashboardPath = user?.role === 'admin' ? '/admin/addmovie' : '/';

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <Link to="/" className="text-[#b3b3b3] hover:text-white">Movies</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <div className="flex items-center gap-2">
              <Link to="/auth/login" className="px-3 py-1.5 rounded bg-[#e50914] hover:bg-[#b20710] text-white text-sm">Login</Link>
              <Link to="/auth/signup" className="px-3 py-1.5 rounded border border-white/20 hover:border-white/40 text-white text-sm">Sign up</Link>
            </div>
          )}

          {user && (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2">
                <Avatar size="sm" src={user.profile_picture || "/profile.png"} fallback={user.name} />
                <span className="hidden sm:block text-sm text-[#b3b3b3] hover:text-white">{user.name}</span>
                <svg className={`w-4 h-4 text-[#b3b3b3] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-white/10 bg-[#141414] shadow-lg">
                  <div className="py-1">
                    <button onClick={() => navigate(dashboardPath)} className="w-full text-left px-3 py-2 text-sm text-[#b3b3b3] hover:bg-white/10 hover:text-white">Dashboard</button>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-[#b3b3b3] hover:bg-white/10 hover:text-white">Logout</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
