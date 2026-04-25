import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { formatPrice, formatDate } from '../../lib/utils';
import { Package, ChevronRight } from 'lucide-react';

export function Orders() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: async () => {
      const response = await orderApi.getMyOrders(statusFilter);
      return response.data.data;
    }
  });

  const statusFilters = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'on_the_way', label: 'On the Way' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Status Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex flex-wrap gap-3 pb-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-sm whitespace-nowrap ${
                  statusFilter === filter.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((order: any) => (
              <div
                key={order._id}
                className="card cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-gray-600 text-sm">
                      {order.shopId?.name || 'Shop'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    {order.items.length} items
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary-600">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to place your first order</p>
            <button
              onClick={() => navigate('/shops')}
              className="btn-primary"
            >
              Browse Shops
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
