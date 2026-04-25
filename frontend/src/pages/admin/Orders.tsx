import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminOrderApi } from '../../api/adminApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { formatPrice } from '../../lib/utils';

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => adminOrderApi.getAllOrders().then(res => res.data.data || [])
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      adminOrderApi.updateOrderStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
      setSelectedOrder(null);
    },
    onError: () => toast.error('Failed to update status')
  });

  const statusFilters = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'collected', label: 'Collected' },
    { value: 'on_the_way', label: 'On the Way' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = Array.isArray(orders) 
    ? orders.filter((order: any) => !statusFilter || order.status === statusFilter)
    : [];

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage all orders</p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex flex-wrap gap-2 pb-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 shadow-sm whitespace-nowrap text-sm ${
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

      {/* Desktop Table View */}
      <Card className="overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order._id.slice(-8)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.customerId && typeof order.customerId === 'object' ? order.customerId.name : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.shopId && typeof order.shopId === 'object' ? order.shopId.name : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.items.length}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No orders found.
          </div>
        )}
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredOrders.map((order: any) => (
          <Card key={order._id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">#{order._id.slice(-8)}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900">
                    {order.customerId && typeof order.customerId === 'object' ? order.customerId.name : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Shop</p>
                  <p className="font-medium text-gray-900">
                    {order.shopId && typeof order.shopId === 'object' ? order.shopId.name : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Items</p>
                  <p className="font-medium text-gray-900">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(order)}
                className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
              >
                Update Status
              </button>
            </div>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card className="p-8 text-center text-gray-500">
            No orders found.
          </Card>
        )}
      </div>

      {selectedOrder && (
        <StatusUpdateModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={(status, note) => {
            updateStatusMutation.mutate({ id: selectedOrder._id, status, note });
          }}
        />
      )}
    </div>
  );
}

function StatusUpdateModal({ order, onClose, onUpdate }: any) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState('');

  const statuses = ['pending', 'confirmed', 'collected', 'on_the_way', 'delivered', 'cancelled'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Add a note about this status change..."
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={() => onUpdate(status, note)} className="flex-1">
              Update Status
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

