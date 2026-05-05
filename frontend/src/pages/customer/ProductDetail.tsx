import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { productApi } from '../../api/productApi';
import { useCartStore } from '../../store/cartStore';
import { formatPrice, getLocalized } from '../../lib/utils';
import { ArrowLeft, MapPin, Minus, Plus, Package, ShoppingCart } from 'lucide-react';

export function ProductDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id!).then(res => res.data.data),
    enabled: !!id
  });

  const handleAddToCart = () => {
    if (!product) return;
    const shopId = typeof product.shopId === 'object' ? product.shopId._id : product.shopId;
    const shopName = getLocalized(typeof product.shopId === 'object' ? product.shopId.name : 'Shop', i18n.language);
    const productName = getLocalized(product.name, i18n.language);
    addItem(shopId, shopName, {
      productId: product._id,
      name: productName,
      price: product.price,
      quantity,
      image: product.images?.[0]
    });
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-white/20" />
          </div>
          <p className="text-white/40 mb-6">{t('product.not_found')}</p>
          <button onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-full transition-colors">
            {t('product.back')}
          </button>
        </div>
      </div>
    );
  }

  const shopId = typeof product.shopId === 'object' ? product.shopId._id : product.shopId;
  const shopAddress = getLocalized(typeof product.shopId === 'object' ? product.shopId.address : '', i18n.language);
  const shopDisplayName = getLocalized(typeof product.shopId === 'object' ? product.shopId.name : 'Shop', i18n.language);
  const productName = getLocalized(product.name, i18n.language);
  const productDesc = getLocalized(product.description, i18n.language);

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero with image */}
      <section className="relative bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-4">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('product.back')}
          </button>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pb-10">
          <div className="relative max-w-sm mx-auto md:mx-0">
            <div className="aspect-square rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl shadow-black/40">
              {product.images && product.images.length > 0 ? (
                <img src={product.images[selectedImage]} alt={productName}
                  className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-white/10" />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {product.images.map((_: string, i: number) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`h-1.5 rounded-full transition-all ${selectedImage === i ? 'w-6 bg-primary-400' : 'w-1.5 bg-white/20'}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product info */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{productName}</h1>
          <Link to={`/shops/${shopId}`}
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-primary-400 transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            {shopAddress || shopDisplayName}
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border ${
            product.isAvailable && product.stock > 0
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {product.isAvailable && product.stock > 0
              ? t('product.in_stock', { count: product.stock })
              : t('product.out_of_stock')}
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-white/60 text-sm leading-relaxed">{productDesc}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-xs text-white/30 mb-1">{t('product.total')}</p>
            <p className="text-3xl font-bold text-white">{formatPrice(product.price * quantity)}</p>
            <p className="text-xs text-white/30 mt-0.5">{formatPrice(product.price)} {t('product.each')}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}
                className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}
                className="w-7 h-7 flex items-center justify-center bg-primary-500 hover:bg-primary-400 rounded-full disabled:opacity-30 transition-colors">
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            <button onClick={handleAddToCart}
              disabled={!product.isAvailable || product.stock === 0}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-900/40">
              <ShoppingCart className="w-4 h-4" />
              {t('product.add_to_cart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
