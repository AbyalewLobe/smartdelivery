import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCartStore, useTotalAmount } from '../../store/cartStore';
import { orderApi } from '../../api/orderApi';
import { formatPrice } from '../../lib/utils';
import { Wallet, ArrowRight, MapPin } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface CheckoutForm {
  street: string;
  city: string;
  notes: string;
}

export function Checkout() {
  const navigate = useNavigate();
  const { items, shopId, shopName, clearCart } = useCartStore();
  const totalAmount = useTotalAmount();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

  useEffect(() => {
    if (items.length === 0) navigate('/cart');
  }, [items.length, navigate]);

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    try {
      const response = await orderApi.create({
        shopId,
        items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        deliveryAddress: { label: 'Home', street: data.street, city: data.city, notes: data.notes },
        paymentMethod: 'cash'
      });
      clearCart();
      // Immediately refresh notifications so the bell updates
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all";
  const labelClass = "block text-sm text-white/60 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Header */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/5 text-primary-400 text-sm font-medium rounded-full mb-4 border border-white/10">
            {shopName}
          </span>
          <h1 className="text-4xl font-bold text-white">Checkout</h1>
          <p className="text-white/50 mt-2">{items.length} item{items.length !== 1 ? 's' : ''} · {formatPrice(totalAmount)}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-5">

            {/* Delivery Address */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-primary-500/15 border border-primary-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-400" />
                </div>
                <h2 className="text-base font-bold text-white">Delivery Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Street Address</label>
                  <input placeholder="123 Main Street" className={fieldClass}
                    {...register('street', { required: 'Street address is required' })} />
                  {errors.street && <p className="mt-1 text-xs text-red-400">{errors.street.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input placeholder="Addis Ababa" className={fieldClass}
                    {...register('city', { required: 'City is required' })} />
                  {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Delivery Notes (Optional)</label>
                  <textarea placeholder="e.g., Ring the bell, Leave at door" rows={3}
                    className={`${fieldClass} resize-none`}
                    {...register('notes')} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-primary-500/15 border border-primary-500/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary-400" />
                </div>
                <h2 className="text-base font-bold text-white">Payment Method</h2>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary-500/60 bg-primary-500/10">
                <Wallet className="w-6 h-6 text-primary-400" />
                <div>
                  <p className="font-semibold text-sm text-white">Cash on Delivery</p>
                  <p className="text-xs text-white/30 mt-0.5">Pay when your order arrives</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-5">Order Summary</h2>

              <div className="space-y-2.5 mb-5">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-white/40 truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="text-white/60 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm font-medium">Total</span>
                  <span className="text-2xl font-bold text-primary-400">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-900/40 disabled:opacity-50"
              >
                {isLoading ? 'Placing Order...' : (
                  <>Place Order <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-xs text-white/20 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
