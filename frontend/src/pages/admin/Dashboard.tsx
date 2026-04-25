import { useQuery } from '@tanstack/react-query';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Orders Today',
      value: stats?.ordersToday || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Package,
      color: 'bg-yellow-500',
      trend: '-5%'
    },
    {
      title: 'Revenue Today',
      value: formatPrice(stats?.revenueToday || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+18%'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-purple-500',
      trend: '+8%'
    },
    {
      title: 'Active Shops',
      value: stats?.activeShops || 0,
      icon: Store,
      color: 'bg-pink-500',
      trend: '+3%'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <TrendingUp size={16} />
                {stat.trend}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'pending' ? 'bg-yellow-500' :
                    status === 'confirmed' ? 'bg-blue-500' :
                    status === 'collected' ? 'bg-purple-500' :
                    status === 'on_the_way' ? 'bg-orange-500' :
                    status === 'delivered' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                </div>
                <span className="font-semibold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {Array.isArray(recentOrders) && recentOrders.slice(0, 5).map((order: any) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
