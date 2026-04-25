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

  // Wait for hydration to complete before checking auth
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // After hydration, check authentication
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 md:p-8 md:ml-64 mt-16">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
