import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { shopApi } from '../../api/shopApi';
import { ProductCard } from '../../components/ui/ProductCard';
import { useCartStore } from '../../store/cartStore';
import { getImageUrl } from '../../lib/utils';
import { ArrowLeft, MapPin, Phone, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';

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
    addItem(
      data._id,
      data.name,
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0] || ''
      }
    );
    toast.success('Added to cart!');
  };

  const filteredProducts = data?.products?.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop not found</h2>
          <Button onClick={() => navigate('/shops')}>Browse Shops</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/shops')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Shops
        </button>

        {/* Shop Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              {data.logoUrl ? (
                <img
                  src={getImageUrl(data.logoUrl)}
                  alt={data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  🏪
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name}</h1>
              <p className="text-gray-600 mb-4">{data.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {data.address}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {data.phone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Products */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
        </div>

        {/* Products Grid */}
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
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">This shop doesn't have any products yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
