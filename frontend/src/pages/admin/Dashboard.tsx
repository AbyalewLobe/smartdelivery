import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { dashboardApi } from '../../api/adminApi';
import { Card } from '../../components/ui/Card';
import { 
  ShoppingCart, 
  Store, 
  Package, 
  Users, 
  DollarSign,
  TrendingUp 
} from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export function Dashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then(res => res.data.data)
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => dashboardApi.getRecentOrders().then(res => res.data.data || [])
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: t('admin.orders_today'),
      value: stats?.ordersToday || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: t('admin.pending_orders'),
      value: stats?.pendingOrders || 0,
      icon: Package,
      color: 'bg-yellow-500',
      trend: '-5%'
    },
    {
      title: t('admin.revenue_today'),
      value: formatPrice(stats?.revenueToday || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+18%'
    },
    {
      title: t('admin.total_customers'),
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-purple-500',
      trend: '+8%'
    },
    {
      title: t('admin.active_shops'),
      value: stats?.activeShops || 0,
      icon: Store,
      color: 'bg-pink-500',
      trend: '+3%'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">{t('admin.dashboard')}</h1>
        <p className="text-white/40 text-sm">{t('admin.dashboard_welcome')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-primary-500/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center opacity-90`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
                <TrendingUp size={12} />
                {stat.trend}
              </div>
            </div>
            <p className="text-white/40 text-xs mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders by Status + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-5">{t('admin.orders_by_status')}</h2>
          <div className="space-y-3">
            {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    status === 'pending' ? 'bg-yellow-500' :
                    status === 'confirmed' ? 'bg-blue-500' :
                    status === 'collected' ? 'bg-purple-500' :
                    status === 'on_the_way' ? 'bg-orange-500' :
                    status === 'delivered' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-white/60 text-sm">{t(`admin.status_${status}`)}</span>
                </div>
                <span className="font-semibold text-white text-sm">{count as number}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-5">{t('admin.recent_orders')}</h2>
          <div className="space-y-3">
            {Array.isArray(recentOrders) && recentOrders.slice(0, 5).map((order: any) => (
              <div key={order._id} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">#{order._id.slice(-6)}</p>
                  <p className="text-xs text-white/30">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-400">{formatPrice(order.totalAmount)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {t(`admin.status_${order.status}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
