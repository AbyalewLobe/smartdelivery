import { Shop } from '../../types';
import { getImageUrl } from '../../lib/utils';
import { MapPin, Package } from 'lucide-react';

interface ShopCardProps {
  shop: Shop;
  onClick: () => void;
}

export function ShopCard({ shop, onClick }: ShopCardProps) {
  const categoryColors: Record<string, string> = {
    grocery: 'bg-green-100 text-green-700',
    restaurant: 'bg-orange-100 text-orange-700',
    pharmacy: 'bg-blue-100 text-blue-700',
    electronics: 'bg-purple-100 text-purple-700',
    fashion: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700',
  };

  return (
    <div
      className="card cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
        {shop.logoUrl ? (
          <img
            src={getImageUrl(shop.logoUrl)}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🏪
          </div>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">{shop.name}</h3>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shop.description}</p>

      <div className="flex items-center justify-between">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[shop.category]}`}>
          {shop.category}
        </span>
        
        {shop.productCount !== undefined && (
          <div className="flex items-center text-gray-500 text-sm">
            <Package className="w-4 h-4 mr-1" />
            <span>{shop.productCount} items</span>
          </div>
        )}
      </div>

      <div className="flex items-center text-gray-500 text-sm mt-2">
        <MapPin className="w-4 h-4 mr-1" />
        <span className="truncate">{shop.address}</span>
      </div>
    </div>
  );
}
