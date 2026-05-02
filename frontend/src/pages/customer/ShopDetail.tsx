import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { shopApi } from '../../api/shopApi';
import { ProductCard } from '../../components/ui/ProductCard';
import { useCartStore } from '../../store/cartStore';
import { getImageUrl } from '../../lib/utils';
import { ArrowLeft, MapPin, Phone, Search, Store } from 'lucide-react';

export function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ['shop', id],
    queryFn: async () => {
      const response = await shopApi.getById(id!);
      return response.data.data;
    },
    enabled: !!id
  });

  const handleAddToCart = (product: any) => {
    addItem(data._id, data.name, {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || ''
    });
    toast.success('Added to cart!');
  };

  const filteredProducts = data?.products?.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        {/* Hero skeleton */}
        <div className="h-56 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-white/5"></div>
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Shop not found</h2>
          <button onClick={() => navigate('/shops')}
            className="mt-4 px-6 py-2.5 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-full transition-colors">
            Browse Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero Header */}
      <section className="relative py-14 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          {/* Back */}
          <button onClick={() => navigate('/shops')}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Shops
          </button>

          {/* Shop info */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
              {data.logoUrl ? (
                <img src={getImageUrl(data.logoUrl)} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🏪</div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-white">{data.name}</h1>
                <span className="px-3 py-1 bg-primary-500/15 border border-primary-500/20 text-primary-400 text-xs font-medium rounded-full">
                  {data.category}
                </span>
              </div>
              <p className="text-white/50 text-sm mb-4 max-w-xl">{data.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-white/40">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {data.address}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {data.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all"
          />
        </div>

        {/* Products */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-white/40 text-sm">
              {searchQuery ? 'Try a different search term' : 'This shop has no products yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
