import { Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore, useIsAuthenticated, useIsAdmin } from '../../store/authStore';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

export function AdminLayout() {
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900">
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex pt-14">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-60 min-h-[calc(100vh-3.5rem)] p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
