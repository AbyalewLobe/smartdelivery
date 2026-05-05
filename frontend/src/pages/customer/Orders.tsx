import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { orderApi } from '../../api/orderApi';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { formatPrice, formatDate } from '../../lib/utils';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

export function Orders() {
  const { t } = useTranslation();
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
    { value: '', label: t('orders.all') },
    { value: 'pending', label: t('orders.pending') },
    { value: 'confirmed', label: t('orders.confirmed') },
    { value: 'on_the_way', label: t('orders.on_the_way') },
    { value: 'delivered', label: t('orders.delivered') },
    { value: 'cancelled', label: t('orders.cancelled') },
  ];

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero Header */}
      <section className="relative py-14 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/5 text-primary-400 text-sm font-medium rounded-full mb-4 border border-white/10">
            {t('orders.my_account')}
          </span>
          <h1 className="text-4xl font-bold text-white">{t('orders.title').split(' ')[0]} <span className="text-primary-400">{t('orders.title').split(' ').slice(1).join(' ')}</span></h1>
          <p className="text-white/50 mt-2">{t('orders.subtitle')}</p>
        </div>
      </section>

      {/* Sticky Filters */}
      <div className="sticky top-16 z-30 bg-gray-950/90 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  statusFilter === filter.value
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-900/40'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse space-y-3">
                <div className="h-5 bg-white/5 rounded-lg w-1/3"></div>
                <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
                <div className="h-4 bg-white/5 rounded-lg w-1/4"></div>
              </div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((order: any) => (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer
                  hover:bg-white/10 hover:border-primary-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-900/20
                  transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-white/40 text-sm">{order.shopId?.name || 'Shop'}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-primary-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/40 text-sm">
                    <Package className="w-4 h-4" />
                    <span>{order.items.length} {t('orders.items')}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-400">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="text-white/30 text-xs mt-0.5">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-primary-300 group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-white/20" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('orders.no_orders')}</h3>
            <p className="text-white/40 mb-8">{t('orders.no_orders_desc')}</p>
            <button
              onClick={() => navigate('/shops')}
              className="px-8 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-full transition-colors"
            >
              {t('home.browse_shops')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
