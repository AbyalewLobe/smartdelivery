import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useTotalItems } from '../../store/cartStore';

export function FloatingCartButton() {
  const navigate = useNavigate();
  const totalItems = useTotalItems();

  // Don't show if cart is empty
  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gray-900 text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all hover:scale-110 flex items-center justify-center group"
      aria-label="View cart"
    >
      <ShoppingCart size={24} className="text-white" />
      
      {/* Item count badge */}
      <span className="absolute -top-2 -right-2 w-8 h-8 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
        {totalItems}
      </span>
    </button>
  );
}
