import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminShopApi } from '../../api/adminApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Plus, Edit, Trash2, Store } from 'lucide-react';

export function Shops() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: shops, isLoading } = useQuery({
    queryKey: ['admin-shops'],
    queryFn: () => adminShopApi.getShops().then(res => res.data.data || [])
  });

  const deleteMutation = useMutation({
    mutationFn: adminShopApi.deleteShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      toast.success('Shop deleted successfully');
    },
    onError: () => toast.error('Failed to delete shop')
  });

  const handleEdit = (shop: any) => {
    setEditingShop(shop);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this shop?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shops Management</h1>
          <p className="text-gray-600 mt-1">Manage all shops in the platform</p>
        </div>
        <Button onClick={() => { setEditingShop(null); setIsModalOpen(true); }} className="w-full sm:w-auto">
          <Plus size={20} className="mr-2" />
          Add Shop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(shops) && shops.map((shop: any) => (
          <Card key={shop._id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {shop.logoUrl ? (
                  <img src={shop.logoUrl} alt={shop.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Store className="text-primary-600" size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{shop.name}</h3>
                  <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                    {shop.category}
                  </span>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${shop.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{shop.productCount || 0} products</span>
              <span>{shop.orderCount || 0} orders</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(shop)}>
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDelete(shop._id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <ShopModal
          shop={editingShop}
          onClose={() => { setIsModalOpen(false); setEditingShop(null); }}
        />
      )}
    </div>
  );
}

function ShopModal({ shop, onClose }: { shop: any; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    category: shop?.category || 'grocery',
    description: shop?.description || '',
    address: shop?.address || '',
    phone: shop?.phone || ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (shop) {
        return adminShopApi.updateShop(shop._id, data);
      }
      return adminShopApi.createShop(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      toast.success(shop ? 'Shop updated successfully' : 'Shop created successfully');
      onClose();
    },
    onError: () => toast.error('Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (logoFile) data.append('logo', logoFile);
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {shop ? 'Edit Shop' : 'Add New Shop'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Shop Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="grocery">Grocery</option>
              <option value="restaurant">Restaurant</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="other">Other</option>
            </select>
          </div>

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

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" isLoading={mutation.isPending} className="flex-1">
              {shop ? 'Update' : 'Create'} Shop
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
