import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';
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
  const [showMenu, setShowMenu] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/login');
  };

  const handleMenuClick = () => {
    setShowMenu(false);
  };

  // Close menu when clicking outside navbar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav ref={navRef} className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">SD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Smart Deliver</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/shops" className="text-gray-700 hover:text-primary-600 transition">
              Shops
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition">
                  Orders
                </Link>
                
                <NotificationBell />
                
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                    <User className="w-6 h-6" />
                    <span>{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right: Bell + Menu Button */}
          <div className="md:hidden flex items-center space-x-1">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setShowMenu(!showMenu)}
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/shops" className="block py-2 text-gray-700" onClick={handleMenuClick}>
              Shops
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="block py-2 text-gray-700" onClick={handleMenuClick}>
                  Orders
                </Link>
                <Link to="/cart" className="block py-2 text-gray-700" onClick={handleMenuClick}>
                  Cart ({totalItems})
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700" onClick={handleMenuClick}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700" onClick={handleMenuClick}>
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-gray-700" onClick={handleMenuClick}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
