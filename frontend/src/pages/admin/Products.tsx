import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminProductApi, adminShopApi } from '../../api/adminApi';
import { Package, Search } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { Select } from '../../components/ui/Select';

export function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedShop, setSelectedShop] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Product deleted'); },
    onError: () => toast.error('Failed to delete product')
  });

  const filteredProducts = Array.isArray(products) ? products.filter((p: any) => {
    const shopMatch = selectedShop === 'all' || (typeof p.shopId === 'object' ? p.shopId._id === selectedShop : p.shopId === selectedShop);
    const searchMatch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return shopMatch && searchMatch;
  }) : [];

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Products</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage all products across shops</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all"
          />
        </div>
        <Select
          value={selectedShop}
          onChange={setSelectedShop}
          options={[
            { value: 'all', label: 'All Shops' },
            ...(Array.isArray(shops) ? shops.map((s: any) => ({ value: s._id, label: s.name })) : [])
          ]}
          placeholder="All Shops"
          className="sm:w-48"
        />      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Product', 'Shop', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className={`px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <Package className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No products found</p>
                </td>
              </tr>
            ) : filteredProducts.map((p: any, i: number) => (
              <tr key={p._id} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-xs text-white/30 line-clamp-1 max-w-[180px]">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/50">{typeof p.shopId === 'object' ? p.shopId.name : '—'}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-primary-400">{formatPrice(p.price)}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{p.stock}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                    p.isAvailable ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {p.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-4">
                  <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                  <button onClick={() => confirm('Delete this product?') && deleteMutation.mutate(p._id)} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((p: any) => (
          <div key={p._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                <p className="text-xs text-white/30 truncate">{typeof p.shopId === 'object' ? p.shopId.name : '—'}</p>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border flex-shrink-0 ${
                p.isAvailable ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {p.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-white/30 text-xs">Price</p><p className="text-primary-400 font-semibold">{formatPrice(p.price)}</p></div>
              <div><p className="text-white/30 text-xs">Stock</p><p className="text-white/60">{p.stock}</p></div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}
                className="flex-1 py-2 text-xs font-medium text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 rounded-xl transition-colors">Edit</button>
              <button onClick={() => confirm('Delete this product?') && deleteMutation.mutate(p._id)}
                className="flex-1 py-2 text-xs font-medium text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProductModal product={editingProduct} shops={Array.isArray(shops) ? shops : []}
          onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} />
      )}
    </div>
  );
}

function ProductModal({ product, shops, onClose }: { product: any; shops: any[]; onClose: () => void }) {
  const [formData, setFormData] = useState({
    shopId: typeof product?.shopId === 'object' ? product?.shopId._id : product?.shopId || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    isAvailable: product?.isAvailable ?? true
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: FormData) => product ? adminProductApi.updateProduct(product._id, data) : adminProductApi.createProduct(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); toast.success(product ? 'Product updated' : 'Product created'); onClose(); },
    onError: () => toast.error('Operation failed')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)));
    if (imageFiles) Array.from(imageFiles).slice(0, 5).forEach(f => data.append('images', f));
    mutation.mutate(data);
  };

  const fieldClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all";
  const labelClass = "block text-sm text-white/60 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-5">{product ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Shop</label>
            <Select
              value={formData.shopId}
              onChange={v => setFormData({ ...formData, shopId: v })}
              options={[
                { value: '', label: 'Select a shop' },
                ...shops.map((s: any) => ({ value: s._id, label: s.name }))
              ]}
              placeholder="Select a shop"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name</label>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name" required className={fieldClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} required className={`${fieldClass} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (ETB)</label>
              <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required className={fieldClass} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="avail" checked={formData.isAvailable} onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-4 h-4 accent-primary-500 rounded" />
            <label htmlFor="avail" className="text-sm text-white/60">Available for purchase</label>
          </div>

          <div>
            <label className={labelClass}>Images (max 5)</label>
            <label className="flex flex-col items-center justify-center w-full h-24 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 hover:border-primary-500/40 transition-all">
              <div className="flex flex-col items-center justify-center gap-1">
                <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-white/30">
                  {imageFiles && imageFiles.length > 0
                    ? `${Math.min(imageFiles.length, 5)} image(s) selected`
                    : 'Click to upload · JPG, PNG, WebP · max 5MB each'}
                </span>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                multiple
                className="hidden"
                onChange={e => setImageFiles(e.target.files)}
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-400 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              {mutation.isPending ? 'Saving...' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
