import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { shopApi } from '../../api/shopApi';
import { ShopCard } from '../../components/ui/ShopCard';
import { Search } from 'lucide-react';

export function Shops() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const category = searchParams.get('category') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['shops', category],
    queryFn: async () => {
      const response = await shopApi.getAll(category);
      return response.data.data;
    }
  });

  const categories = [
    { value: '', label: 'All' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'other', label: 'Other' },
  ];

  const filteredShops = data?.filter((shop: any) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Shops</h1>
          <p className="text-gray-600">Discover local shops and order your favorites</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex flex-wrap gap-3 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSearchParams(cat.value ? { category: cat.value } : {})}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-sm whitespace-nowrap ${
                  category === cat.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shops Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredShops && filteredShops.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop: any) => (
              <ShopCard
                key={shop._id}
                shop={shop}
                onClick={() => navigate(`/shops/${shop._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
