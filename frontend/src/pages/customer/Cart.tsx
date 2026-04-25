import { useNavigate } from 'react-router-dom';
import { useCartStore, useTotalAmount } from '../../store/cartStore';
import { getImageUrl, formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export function Cart() {
  const navigate = useNavigate();
  const { items, shopName, updateQuantity, removeItem, clearCart } = useCartStore();
  const totalAmount = useTotalAmount();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <Button onClick={() => navigate('/shops')} size="lg">
            Browse Shops
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">From {shopName}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.productId} className="card">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      📦
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-xl font-bold text-primary-600 mb-3">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100">
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(totalAmount)}
            </span>
          </div>

          <Button
            onClick={() => navigate('/checkout')}
            className="w-full"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
