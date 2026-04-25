import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productApi } from '../../api/productApi';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  MapPin,
  Minus, 
  Plus,
  Package,
  Clock,
  Database
} from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCartStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id!).then(res => res.data.data),
    enabled: !!id
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    const shopId = typeof product.shopId === 'object' ? product.shopId._id : product.shopId;
    const shopName = typeof product.shopId === 'object' ? product.shopId.name : 'Shop';
    
    addItem(shopId, shopName, {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0]
    });
    
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-lime-50 to-lime-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-lime-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const shopName = typeof product.shopId === 'object' ? product.shopId.name : 'Shop';
  const shopId = typeof product.shopId === 'object' ? product.shopId._id : product.shopId;
  const shopAddress = typeof product.shopId === 'object' ? product.shopId.address : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Details</h1>
          <button
            onClick={toggleFavorite}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition"
          >
            <Heart 
              size={20} 
              className={isFavorite ? 'text-red-500 fill-red-500' : 'text-red-500'}
            />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-8">
        {/* Product Image */}
        <div className="mb-6">
          <div className="relative rounded-2xl aspect-square max-w-md mx-auto overflow-hidden bg-white">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={80} className="text-gray-300" />
              </div>
            )}
          </div>

          {/* Image Dots */}
          {product.images && product.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {product.images.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-2 rounded-full transition-all ${
                    selectedImage === index
                      ? 'w-8 bg-lime-400'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Title and Quantity */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h2>
              
              {/* Location */}
              <Link
                to={`/shops/${shopId}`}
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 transition"
              >
                <MapPin size={16} />
                <span className="text-sm">{shopAddress || shopName}</span>
              </Link>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-white rounded-full px-2 py-2 shadow-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition"
                disabled={quantity <= 1}
              >
                <Minus size={18} strokeWidth={3} />
              </button>
              <span className="text-lg font-bold text-gray-900 w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center bg-lime-400 rounded-full hover:bg-lime-500 transition"
                disabled={quantity >= product.stock}
              >
                <Plus size={18} strokeWidth={3} className="text-gray-900" />
              </button>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <Database size={18} className="text-green-500" />
              <span className="text-gray-700 font-medium">10 left</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={18} className="text-blue-500" />
              <span className="text-gray-700">Time 10 min</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="text-gray-900 font-semibold">4.5 Ratting</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
              {product.description && product.description.length > 150 && (
                <button className="text-primary-600 font-medium ml-1">
                  See More...
                </button>
              )}
            </p>
          </div>

          {/* Add to Cart Section */}
          <div className="mt-6 flex items-center justify-between  gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price * quantity)}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.stock === 0}
              className="px-4 py-2 bg-gray-900 text-white rounded-full font-semibold items-center text-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}