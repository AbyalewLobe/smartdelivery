import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuthStore, useIsAuthenticated } from '../../store/authStore';
import { useTotalItems } from '../../store/cartStore';
import { useState, useEffect, useRef } from 'react';
import { NotificationBell } from '../ui/NotificationBell';

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useIsAuthenticated();
  const totalItems = useTotalItems();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/login');
  };

  const handleMenuClick = () => setShowMenu(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 flex justify-center">
      <div ref={navRef} className="w-full max-w-3xl">

        {/* Floating Pill Navbar */}
        <div className="bg-gradient-to-r from-gray-900 via-primary-950 to-primary-900 rounded-full shadow-xl shadow-black/20 border border-white/10 px-4 h-14 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">B+</span>
            </div>
            <span className="font-bold text-white text-lg tracking-tight">Bazaar+</span>
          </Link>

          {/* Desktop center links */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <Link
              to="/shops"
              className={`text-sm font-medium transition-colors ${isActive('/shops') ? 'text-primary-300' : 'text-white/70 hover:text-white'}`}
            >
              Shops
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className={`text-sm font-medium transition-colors ${isActive('/orders') ? 'text-primary-300' : 'text-white/70 hover:text-white'}`}
              >
                Orders
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {isAuthenticated ? (
              <>
                {/* Notification */}
                <NotificationBell />

                {/* Cart pill button */}
                <Link to="/cart" className="relative flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold pl-3 pr-4 py-2 rounded-full transition-colors">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden sm:inline">Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative group">
                  <button className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/20">
                    <User className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* CTA pill button */}
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold pl-2 pr-4 py-2 rounded-full transition-colors"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <span>Get Started</span>
                </Link>

                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </>
            )}

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/20"
            >
              {showMenu ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown — attached below pill */}
        <div
          className={`md:hidden mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            showMenu ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-3 space-y-1">
            <Link to="/shops" onClick={handleMenuClick}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
              Shops
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={handleMenuClick}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  Orders
                </Link>
                <Link to="/profile" onClick={handleMenuClick}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  Profile
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleMenuClick}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  Login
                </Link>
                <Link to="/register" onClick={handleMenuClick}
                  className="flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
