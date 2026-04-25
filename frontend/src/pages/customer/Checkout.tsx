import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCartStore, useTotalAmount } from '../../store/cartStore';
import { orderApi } from '../../api/orderApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { CreditCard, Wallet } from 'lucide-react';

interface CheckoutForm {
  street: string;
  city: string;
  notes: string;
}

export function Checkout() {
  const navigate = useNavigate();
  const { items, shopId, shopName, clearCart } = useCartStore();
  const totalAmount = useTotalAmount();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    try {
      const orderData = {
        shopId,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        deliveryAddress: {
          label: 'Home',
          street: data.street,
          city: data.city,
          notes: data.notes
        },
        paymentMethod
      };

      const response = await orderApi.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.data._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Street Address"
                  placeholder="123 Main Street"
                  error={errors.street?.message}
                  {...register('street', { required: 'Street address is required' })}
                />

                <Input
                  label="City"
                  placeholder="Algiers"
                  error={errors.city?.message}
                  {...register('city', { required: 'City is required' })}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes (Optional)
                  </label>
                  <textarea
                    placeholder="e.g., Ring the bell, Leave at door"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none"
                    rows={3}
                    {...register('notes')}
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Wallet className={`w-8 h-8 mx-auto mb-2 ${
                    paymentMethod === 'cash' ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <div className="text-center">
                    <div className="font-semibold">Cash</div>
                    <div className="text-sm text-gray-600">Pay on delivery</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`w-8 h-8 mx-auto mb-2 ${
                    paymentMethod === 'card' ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <div className="text-center">
                    <div className="font-semibold">Card</div>
                    <div className="text-sm text-gray-600">Online payment</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">From: {shopName}</p>
                <p className="text-sm text-gray-600">{items.length} items</p>
              </div>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSubmit(onSubmit)}
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Place Order
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
