import { Shop } from '../../types';
import { getImageUrl, getLocalized } from '../../lib/utils';
import { MapPin, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ShopCardProps {
  shop: Shop;
  onClick: () => void;
  categories?: any[]; // Optional categories for localized display
}

export function ShopCard({ shop, onClick, categories = [] }: ShopCardProps) {
  const { i18n } = useTranslation();
  const name = getLocalized(shop.name, i18n.language);
  const description = getLocalized(shop.description, i18n.language);
  
  // Helper function to get localized category name
  const getCategoryDisplayName = (categoryValue: string): string => {
    const category = categories.find((cat: any) => {
      const catValue = typeof cat.name === 'object' ? cat.name.en : cat.name;
      return catValue === categoryValue;
    });
    
    if (category) {
      return getLocalized(category.name, i18n.language);
    }
    return categoryValue; // Fallback to original value
  };
  
  const categoryColors: Record<string, string> = {
    grocery: 'bg-green-500/10 text-green-400 border-green-500/20',
    restaurant: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    pharmacy: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    electronics: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    fashion: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    other: 'bg-white/5 text-white/50 border-white/10',
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer
        hover:bg-white/10 hover:border-primary-500/30 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary-900/30
        transition-all duration-300 ease-out"
    >
      {/* Image */}
      <div className="relative h-48 bg-white/5 overflow-hidden">
        {shop.logoUrl ? (
          <img
            src={getImageUrl(shop.logoUrl)}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🏪
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>

        {/* Category badge on image */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[shop.category] || categoryColors.other}`}>
          {getCategoryDisplayName(shop.category)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-300 transition-colors">
          {name}
        </h3>
        <p className="text-white/40 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-xs text-white/30">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[140px]">{getLocalized(shop.address, i18n.language)}</span>
          </div>
          {shop.productCount !== undefined && (
            <div className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              <span>{shop.productCount} items</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-primary-300 group-hover:w-full transition-all duration-500"></div>
    </div>
  );
}
