import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCartStore, useTotalAmount } from '../../store/cartStore';
import { getImageUrl, formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export function Cart() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, shopName, updateQuantity, removeItem, clearCart } = useCartStore();
  const totalAmount = useTotalAmount();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-white/20" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{t('cart.empty')}</h2>
          <p className="text-white/40 mb-8">{t('cart.empty_desc')}</p>
          <button
            onClick={() => navigate('/shops')}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-full transition-colors"
          >
            {t('cart.browse_shops')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Header */}
      <section className="relative py-14 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-4xl mx-auto flex items-start justify-between">
          <div>
            <span className="inline-block px-4 py-1.5 bg-white/5 text-primary-400 text-sm font-medium rounded-full mb-4 border border-white/10">
              {shopName}
            </span>
            <h1 className="text-4xl font-bold text-white">
              {t('cart.title').split(' ')[0]} <span className="text-primary-400">{t('cart.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-white/50 mt-2">{items.length} {t('cart.items')}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors mt-2"
          >
            {t('cart.clear_all')}
          </button>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                    {item.image ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 truncate">{item.name}</h3>
                    <p className="text-primary-400 font-bold mb-3">{formatPrice(item.price)}</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 text-white/60" />
                        </button>
                        <span className="text-white font-semibold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-white/60" />
                        </button>
                      </div>

                      {/* Subtotal + delete */}
                      <div className="flex items-center gap-3">
                        <span className="text-white/40 text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">{t('cart.order_summary')}</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-white/40 truncate mr-2">{item.name} ×{item.quantity}</span>
                    <span className="text-white/60 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 font-medium">{t('cart.total')}</span>
                  <span className="text-2xl font-bold text-primary-400">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-900/40"
              >
                {t('cart.checkout')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
