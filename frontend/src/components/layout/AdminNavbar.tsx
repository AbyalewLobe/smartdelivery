import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, LogOut } from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';

export function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-primary-950 to-primary-900 border-b border-white/5 px-4 md:px-6 py-3 fixed top-0 left-0 right-0 z-40">
      <div className="flex justify-between items-center">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-colors"
          >
            <Menu size={18} className="text-white/70" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B+</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-none">Bazaar+</p>
              <p className="text-xs text-white/30 mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Right: notifications + user + logout */}
        <div className="flex items-center gap-2 md:gap-3">
          <NotificationBell />

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
            <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
              <span className="text-primary-400 text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-white/80 leading-none">{user?.name}</p>
              <p className="text-xs text-white/30 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/50 hover:text-red-400 rounded-lg text-xs font-medium transition-all"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
