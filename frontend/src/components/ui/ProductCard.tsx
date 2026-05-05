import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { getImageUrl, formatPrice, getLocalized } from '../../lib/utils';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { i18n } = useTranslation();
  const name = getLocalized(product.name, i18n.language);
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-lime-400 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lime-100/60 group">
      <Link to={`/products/${product._id}`}>
        <div className="relative w-full pt-[100%] bg-gray-50">
          {product.images && product.images.length > 0 ? (
            <img
              src={getImageUrl(product.images[0])}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              📦
            </div>
          )}
          
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white px-2 py-1 rounded-lg font-semibold text-xs">
                Out of Stock
              </span>
            </div>
          )}

          {/* Plus Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart();
            }}
            disabled={!product.isAvailable || product.stock === 0}
            className="absolute bottom-2 right-2 w-10 h-10 bg-lime-400 hover:bg-lime-500 rounded-full flex items-center justify-center shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} className="text-gray-900" strokeWidth={3} />
          </button>
        </div>
      </Link>

      <Link to={`/products/${product._id}`}>
        <div className="p-3">
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
            {name}
          </h3>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {product.stock} left
            </span>
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
