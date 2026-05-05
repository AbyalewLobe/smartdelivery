import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { shopApi } from '../../api/shopApi';
import { categoryApi } from '../../api/categoryApi';
import { ShopCard } from '../../components/ui/ShopCard';
import { Search } from 'lucide-react';
import { getLocalized } from '../../lib/utils';

export function Shops() {
  const { t, i18n } = useTranslation();
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

  // Fetch dynamic shop categories from admin
  const { data: categoriesData } = useQuery({
    queryKey: ['shop-categories-public'],
    queryFn: () => categoryApi.getCategories({ type: 'shop', activeOnly: true }),
    staleTime: 60000 // cache for 1 min, auto-refetches when stale
  });
  const dynamicCategories = categoriesData?.data || [];

  const filteredShops = data?.filter((shop: any) => {
    // Handle bilingual search
    const shopName = typeof shop.name === 'object' ? `${shop.name.en || ''} ${shop.name.am || ''}` : shop.name || '';
    const shopDesc = typeof shop.description === 'object' ? `${shop.description.en || ''} ${shop.description.am || ''}` : shop.description || '';
    return shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           shopDesc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero Header */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/5 text-primary-400 text-sm font-medium rounded-full mb-4 border border-white/10">
            {t('shops.discover')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            {t('shops.title').split(' ')[0]} <span className="text-primary-400">{t('shops.title').split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/50 text-lg mb-8">{t('shops.subtitle')}</p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input
              type="text"
              placeholder={t('shops.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="sticky top-16 z-30 bg-gray-950/90 backdrop-blur-sm border-b border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {/* Always show All */}
            <button
              onClick={() => setSearchParams({})}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                category === ''
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-900/40'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('shops.all')}
            </button>
            {/* Dynamic categories from admin */}
            {dynamicCategories.map((cat: any) => {
              const categoryValue = typeof cat.name === 'object' ? (cat.name.en || cat.name.am) : cat.name;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSearchParams({ category: categoryValue })}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    category === categoryValue
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-900/40'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {getLocalized(cat.name, i18n.language)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-white/5"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-white/5 rounded-lg w-2/3"></div>
                  <div className="h-4 bg-white/5 rounded-lg"></div>
                  <div className="h-4 bg-white/5 rounded-lg w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredShops && filteredShops.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop: any) => (
              <ShopCard
                key={shop._id}
                shop={shop}
                categories={dynamicCategories}
                onClick={() => navigate(`/shops/${shop._id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-2xl font-semibold text-white mb-2">{t('shops.no_shops')}</h3>
            <p className="text-white/40">{t('shops.no_shops_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
