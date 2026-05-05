import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { adminOrderApi } from '../../api/adminApi';
import { formatPrice } from '../../lib/utils';
import { Select } from '../../components/ui/Select';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  collected: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  on_the_way: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminOrderApi.getAllOrders().then(res => res.data.data || [])
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      adminOrderApi.updateOrderStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(t('admin.order_status_updated'));
      setSelectedOrder(null);
    },
    onError: () => toast.error(t('admin.operation_failed'))
  });

  const statusFilters = [
    { value: '', label: t('common.all') },
    { value: 'pending', label: t('admin.status_pending') },
    { value: 'confirmed', label: t('admin.status_confirmed') },
    { value: 'collected', label: t('admin.status_collected') },
    { value: 'on_the_way', label: t('admin.status_on_the_way') },
    { value: 'delivered', label: t('admin.status_delivered') },
    { value: 'cancelled', label: t('admin.status_cancelled') },
  ];

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((o: any) => !statusFilter || o.status === statusFilter)
    : [];

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">{t('admin.orders')}</h1>
        <p className="text-white/40 text-sm mt-0.5">{t('admin.manage_orders')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map(f => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              statusFilter === f.value ? 'bg-primary-500 text-white' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {[t('admin.order_id'), t('admin.customer'), t('admin.phone'), t('admin.delivery_address'), t('admin.shop'), t('admin.items'), t('admin.total'), t('common.status'), t('common.actions')].map(h => (
                <th key={h} className={`px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider ${h === t('common.actions') ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={9} className="px-5 py-12 text-center text-white/30 text-sm">{t('admin.no_orders_found')}</td></tr>
            ) : filteredOrders.map((order: any, i: number) => (
              <tr key={order._id} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-white">#{order._id.slice(-8)}</p>
                  <p className="text-xs text-white/30">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/70">{order.customerId?.name || 'N/A'}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{order.customerId?.phone || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-white/50 max-w-[160px]">
                  <p className="truncate">{order.deliveryAddress?.street || '—'}</p>
                  <p className="text-xs text-white/30 truncate">{order.deliveryAddress?.city}</p>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/70">{order.shopId?.name || 'N/A'}</td>
                <td className="px-5 py-3.5 text-sm text-white/70">{order.items.length}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-primary-400">{formatPrice(order.totalAmount)}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[order.status] || statusColors.pending}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {t(`admin.status_${order.status}`)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">{t('admin.update')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile rows */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((order: any) => (
          <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-white">#{order._id.slice(-8)}</p>
                <p className="text-xs text-white/30">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[order.status] || statusColors.pending}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {t(`admin.status_${order.status}`)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-white/30 text-xs">{t('admin.customer')}</p><p className="text-white/70">{order.customerId?.name || 'N/A'}</p></div>
              <div><p className="text-white/30 text-xs">{t('admin.phone')}</p><p className="text-white/70">{order.customerId?.phone || '—'}</p></div>
              <div><p className="text-white/30 text-xs">{t('admin.shop')}</p><p className="text-white/70">{order.shopId?.name || 'N/A'}</p></div>
              <div><p className="text-white/30 text-xs">{t('admin.items')}</p><p className="text-white/70">{order.items.length}</p></div>
              <div className="col-span-2"><p className="text-white/30 text-xs">{t('admin.address')}</p><p className="text-white/70">{order.deliveryAddress?.street}{order.deliveryAddress?.city ? `, ${order.deliveryAddress.city}` : ''}</p></div>
              <div><p className="text-white/30 text-xs">{t('admin.total')}</p><p className="text-primary-400 font-semibold">{formatPrice(order.totalAmount)}</p></div>
            </div>
            <button onClick={() => setSelectedOrder(order)} className="w-full py-2 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 rounded-xl transition-colors">
              {t('admin.update_status')}
            </button>
          </div>
        ))}
      </div>

      {/* Status Modal */}
      {selectedOrder && (
        <StatusModal order={selectedOrder} onClose={() => setSelectedOrder(null)}
          onUpdate={(status, note) => updateStatusMutation.mutate({ id: selectedOrder._id, status, note })} />
      )}
    </div>
  );
}

function StatusModal({ order, onClose, onUpdate }: { order: any; onClose: () => void; onUpdate: (s: string, n: string) => void }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState('');
  const { t } = useTranslation();
  const statuses = ['pending', 'confirmed', 'collected', 'on_the_way', 'delivered', 'cancelled'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-5">{t('admin.update_order_status')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">{t('common.status')}</label>
            <Select
              value={status}
              onChange={setStatus}
              options={statuses.map(s => ({ value: s, label: t(`admin.status_${s}`) }))}
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">{t('admin.note_optional')}</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder={t('admin.add_note')}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => onUpdate(status, note)} className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-400 text-white rounded-xl text-sm font-semibold transition-colors">{t('admin.update')}</button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-colors">{t('common.cancel')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
