import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Menu, LogOut } from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';
import { useTranslation } from 'react-i18next';

export function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'am' ? 'en' : 'am');

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
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <img src="/sarah_andJoseph2-removebg-preview.png" alt="Sarah and Joseph" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-none">{t('nav.brand')}</p>
              <p className="text-xs text-white/30 mt-0.5">{t('admin.admin_panel')}</p>
            </div>
          </div>
        </div>

        {/* Right: language + notifications + user + logout */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language toggle */}
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white/70 hover:text-white transition-colors"
            title={`Switch to ${i18n.language === 'am' ? 'English' : 'Amharic'}`}
          >
            {i18n.language === 'am' ? 'EN' : 'አማ'}
          </button>

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
            <span className="hidden sm:inline">{t('nav.logout')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
