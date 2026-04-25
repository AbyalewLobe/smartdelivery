import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { orderApi } from '../../api/orderApi';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { OrderTimeline } from '../../components/ui/OrderTimeline';
import { Button } from '../../components/ui/Button';
import { formatPrice, formatDate, getImageUrl } from '../../lib/utils';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await orderApi.getById(id!);
      return response.data.data;
    },
    enabled: !!id
  });

  const cancelMutation = useMutation({
    mutationFn: () => orderApi.cancel(id!, cancelReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Order cancelled successfully');
      setShowCancelDialog(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="card">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <Button onClick={() => navigate('/orders')}>View Orders</Button>
        </div>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Orders
        </button>

        {/* Order Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{order._id.slice(-8)}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Shop</p>
              <p className="font-semibold">{order.shopId?.name || 'Shop'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="font-semibold text-primary-600 text-xl">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment</p>
              <p className="font-semibold capitalize">{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Delivery Address
              </h2>
              <div className="text-gray-700">
                <p>{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.city}</p>
                {order.deliveryAddress.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    Note: {order.deliveryAddress.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Cancel Order */}
            {canCancel && !showCancelDialog && (
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Cancel Order
              </Button>
            )}

            {showCancelDialog && (
              <div className="card border-2 border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-3">Cancel Order</h3>
                <textarea
                  placeholder="Please provide a reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none resize-none mb-4"
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCancelDialog(false)}
                    className="flex-1"
                  >
                    Keep Order
                  </Button>
                  <Button
                    onClick={() => cancelMutation.mutate()}
                    isLoading={cancelMutation.isPending}
                    disabled={!cancelReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Confirm Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Timeline */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Status</h2>
              <OrderTimeline
                statusHistory={order.statusHistory}
                currentStatus={order.status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
