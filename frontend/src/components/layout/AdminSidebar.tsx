import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingCart, Users, Tag, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'admin.dashboard' },
  { path: '/admin/shops', icon: Store, label: 'admin.shops' },
  { path: '/admin/products', icon: Package, label: 'admin.products' },
  { path: '/admin/categories', icon: Tag, label: 'admin.categories' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'admin.orders' },
  { path: '/admin/customers', icon: Users, label: 'admin.customers' },
];

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  
  return (
    <aside className={`
      fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 bg-gradient-to-b from-gray-900 via-primary-950 to-gray-900 border-r border-white/5 z-40
      transition-transform duration-300 ease-in-out
      lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Mobile close */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b border-white/5">
        <span className="text-sm font-medium text-white/50">{t('common.menu')}</span>
        <button onClick={onClose} className="w-7 h-7 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
          <X size={14} className="text-white/50" />
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={17} className={isActive ? 'text-primary-400' : 'text-white/30 group-hover:text-white/60'} />
                <span>{t(item.label)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
