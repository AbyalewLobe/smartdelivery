import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminProductApi, adminShopApi } from '../../api/adminApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedShop, setSelectedShop] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminProductApi.getProducts().then(res => res.data.data || [])
  });

  const { data: shops } = useQuery({
    queryKey: ['admin-shops'],
    queryFn: () => adminShopApi.getShops().then(res => res.data.data || [])
  });

  const deleteMutation = useMutation({
    mutationFn: adminProductApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
    },
    onError: () => toast.error('Failed to delete product')
  });

  const filteredProducts = products?.filter((p: any) => {
    // Filter by shop
    const shopMatch = selectedShop === 'all' || 
      (typeof p.shopId === 'object' ? p.shopId._id === selectedShop : p.shopId === selectedShop);
    
    // Filter by search query (name, description, category)
    const searchMatch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return shopMatch && searchMatch;
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage all products across shops</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="w-full sm:w-auto">
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by name, description, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        
        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="input-field sm:max-w-xs"
        >
          <option value="all">All Shops</option>
          {Array.isArray(shops) && shops.map((shop: any) => (
            <option key={shop._id} value={shop._id}>{shop.name}</option>
          ))}
        </select>
      </div>

      {filteredProducts && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No products found</p>
          {(searchQuery || selectedShop !== 'all') && (
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(filteredProducts) && filteredProducts.map((product: any) => (
          <Card key={product._id} className="p-4">
            {product.images?.[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Package className="text-gray-400" size={40} />
              </div>
            )}

            <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-primary-600">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-500">Stock: {product.stock}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1" 
                onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (confirm('Delete this product?')) {
                    deleteMutation.mutate(product._id);
                  }
                }}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          shops={shops || []}
          onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, shops, onClose }: { product: any; shops: any[]; onClose: () => void }) {
  const [formData, setFormData] = useState({
    shopId: product?.shopId || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    stock: product?.stock || '',
    isAvailable: product?.isAvailable ?? true
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (product) {
        return adminProductApi.updateProduct(product._id, data);
      }
      return adminProductApi.createProduct(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(product ? 'Product updated' : 'Product created');
      onClose();
    },
    onError: () => toast.error('Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, String(value)));
    
    if (imageFiles) {
      const filesToUpload = Array.from(imageFiles).slice(0, 5); // Limit to 5 images
      console.log(`Uploading ${filesToUpload.length} images`);
      filesToUpload.forEach((file, index) => {
        console.log(`Image ${index + 1}:`, file.name, file.size, 'bytes');
        data.append('images', file);
      });
    }
    
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop</label>
            <select
              value={formData.shopId}
              onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select a shop</option>
              {shops.map((shop: any) => (
                <option key={shop._id} value={shop._id}>{shop.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />

            <Input
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </div>

          <Input
            label="Category (optional)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
              Available for purchase
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (Max 5 images)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(e.target.files)}
              className="input-field"
            />
            {imageFiles && imageFiles.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {imageFiles.length} file(s) selected
              </p>
            )}
            {imageFiles && imageFiles.length > 5 && (
              <p className="mt-1 text-sm text-red-600">
                Maximum 5 images allowed. Only first 5 will be uploaded.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={mutation.isPending} className="flex-1">
              {product ? 'Update' : 'Create'} Product
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
