import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminShopApi } from '../../api/adminApi';
import { categoryApi } from '../../api/categoryApi';
import { Store } from 'lucide-react';
import { Select } from '../../components/ui/Select';

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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-shops'] }); toast.success('Shop deleted'); },
    onError: () => toast.error('Failed to delete shop')
  });

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Shops</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage all shops in the platform</p>
        </div>
        <button
          onClick={() => { setEditingShop(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          + Add Shop
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Shop', 'Category', 'Address', 'Phone', 'Products', 'Status', 'Actions'].map(h => (
                <th key={h} className={`px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(shops) || shops.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">No shops found.</td></tr>
            ) : shops.map((shop: any, i: number) => (
              <tr key={shop._id} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {shop.logoUrl ? (
                      <img src={shop.logoUrl} alt={shop.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Store className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{shop.name}</p>
                      <p className="text-xs text-white/30 line-clamp-1 max-w-[160px]">{shop.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {shop.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/50 max-w-[140px] truncate">{shop.address}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{shop.phone}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{shop.productCount || 0}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                    shop.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {shop.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-4">
                  <button onClick={() => { setEditingShop(shop); setIsModalOpen(true); }} className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                  <button onClick={() => confirm('Delete this shop?') && deleteMutation.mutate(shop._id)} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {Array.isArray(shops) && shops.map((shop: any) => (
          <div key={shop._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt={shop.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{shop.name}</p>
                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 mt-1">
                  {shop.category}
                </span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border flex-shrink-0 ${
                shop.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {shop.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingShop(shop); setIsModalOpen(true); }}
                className="flex-1 py-2 text-xs font-medium text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 rounded-xl transition-colors">Edit</button>
              <button onClick={() => confirm('Delete this shop?') && deleteMutation.mutate(shop._id)}
                className="flex-1 py-2 text-xs font-medium text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ShopModal shop={editingShop} onClose={() => { setIsModalOpen(false); setEditingShop(null); }} />
      )}
    </div>
  );
}

function ShopModal({ shop, onClose }: { shop: any; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    category: shop?.category || '',
    description: shop?.description || '',
    address: shop?.address || '',
    phone: shop?.phone || ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Fetch dynamic shop categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-shop'],
    queryFn: () => categoryApi.getCategories({ type: 'shop', activeOnly: true })
  });
  const shopCategories = categoriesData?.data || [];

  const mutation = useMutation({
    mutationFn: (data: FormData) => shop ? adminShopApi.updateShop(shop._id, data) : adminShopApi.createShop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shops'] });
      toast.success(shop ? 'Shop updated' : 'Shop created');
      onClose();
    },
    onError: () => toast.error('Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (logoFile) data.append('logo', logoFile);
    mutation.mutate(data);
  };

  const fieldClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all";
  const labelClass = "block text-sm text-white/60 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-5">{shop ? 'Edit Shop' : 'Add Shop'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Shop Name</label>
            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Shop name" required className={fieldClass} />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <Select
              value={formData.category}
              onChange={v => setFormData({ ...formData, category: v })}
              options={shopCategories.map((cat: any) => ({ value: cat.name, label: cat.name }))}
              placeholder="Select a category"
              required
            />
            {shopCategories.length === 0 && (
              <p className="mt-1.5 text-xs text-yellow-400/70">No shop categories found. Add some in the Categories page first.</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} required className={`${fieldClass} resize-none`} />
          </div>

          <div>
            <label className={labelClass}>Address</label>
            <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Shop address" required className={fieldClass} />
          </div>

          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone number" required className={fieldClass} />
          </div>

          <div>
            <label className={labelClass}>Logo</label>
            <label className="flex flex-col items-center justify-center w-full h-20 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 hover:border-primary-500/40 transition-all">
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-white/30">{logoFile ? logoFile.name : 'Click to upload · JPG, PNG, WebP · max 5MB'}</span>
              </div>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-400 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              {mutation.isPending ? 'Saving...' : shop ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
