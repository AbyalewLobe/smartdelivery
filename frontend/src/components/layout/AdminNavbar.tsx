import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Menu } from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';

export function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 fixed top-0 left-0 right-0 z-40">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">SD</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gray-900">Smart Deliver</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <NotificationBell />
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
