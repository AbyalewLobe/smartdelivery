import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminShopApi } from '../../api/adminApi';
import { categoryApi } from '../../api/categoryApi';
import { Store } from 'lucide-react';
import { Select } from '../../components/ui/Select';
import { BilingualInput } from '../../components/ui/BilingualInput';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { getLocalized } from '../../lib/utils';

export function Shops() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const { data: shops, isLoading } = useQuery({
    queryKey: ['admin-shops'],
    queryFn: () => adminShopApi.getShops().then(res => res.data.data || [])
  });

  // Fetch categories for localized display
  const { data: categoriesData } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoryApi.getCategories()
  });
  const categories = categoriesData?.data || [];

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

  const deleteMutation = useMutation({
    mutationFn: adminShopApi.deleteShop,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-shops'] }); toast.success(t('admin.shop_deleted')); setConfirmDelete(null); },
    onError: () => toast.error(t('admin.operation_failed'))
  });

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">{t('admin.shops')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{t('admin.manage_shops')}</p>
        </div>
        <button
          onClick={() => { setEditingShop(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          + {t('admin.add_shop')}
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {[t('admin.shops'), t('admin.category'), t('admin.address'), t('admin.phone'), t('admin.products'), t('common.status'), t('common.actions')].map(h => (
                <th key={h} className={`px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider ${h === t('common.actions') ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(shops) || shops.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">{t('admin.no_shops_found')}</td></tr>
            ) : shops.map((shop: any, i: number) => (
              <tr key={shop._id} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {shop.logoUrl ? (
                      <img src={shop.logoUrl} alt={getLocalized(shop.name, i18n.language)} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Store className="w-4 h-4 text-white/20" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{getLocalized(shop.name, i18n.language)}</p>
                      <p className="text-xs text-white/30 line-clamp-1 max-w-[160px]">{getLocalized(shop.description, i18n.language)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {getCategoryDisplayName(shop.category)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/50 max-w-[140px] truncate">{getLocalized(shop.address, i18n.language)}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{shop.phone}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{shop.productCount || 0}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                    shop.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {shop.isActive ? t('common.active') : t('common.inactive')}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-4">
                  <button onClick={() => { setEditingShop(shop); setIsModalOpen(true); }} className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">{t('common.edit')}</button>
                  <button onClick={() => setConfirmDelete(shop)} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">{t('common.delete')}</button>
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
                <img src={shop.logoUrl} alt={getLocalized(shop.name, i18n.language)} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-white/20" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{getLocalized(shop.name, i18n.language)}</p>
                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 mt-1">
                  {getCategoryDisplayName(shop.category)}
                </span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border flex-shrink-0 ${
                shop.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {shop.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingShop(shop); setIsModalOpen(true); }}
                className="flex-1 py-2 text-xs font-medium text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 rounded-xl transition-colors">{t('common.edit')}</button>
              <button onClick={() => setConfirmDelete(shop)}
                className="flex-1 py-2 text-xs font-medium text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-colors">{t('common.delete')}</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ShopModal shop={editingShop} onClose={() => { setIsModalOpen(false); setEditingShop(null); }} />
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => deleteMutation.mutate(confirmDelete._id)}
        title={t('admin.delete_shop_title')}
        message={t('admin.delete_shop_message', { name: getLocalized(confirmDelete?.name, i18n.language) })}
        type="delete"
        confirmText={t('common.delete')}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function ShopModal({ shop, onClose }: { shop: any; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: typeof shop?.name === 'object' ? shop.name : { en: shop?.name || '', am: '' },
    category: shop?.category || '',
    description: typeof shop?.description === 'object' ? shop.description : { en: shop?.description || '', am: '' },
    address: typeof shop?.address === 'object' ? shop.address : { en: shop?.address || '', am: '' },
    phone: shop?.phone || ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [categoryLang, setCategoryLang] = useState<'en' | 'am'>('en'); // Independent category language
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

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
      toast.success(shop ? t('admin.shop_updated') : t('admin.shop_created'));
      onClose();
    },
    onError: () => toast.error(t('admin.operation_failed'))
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', JSON.stringify(formData.name));
    data.append('category', formData.category);
    data.append('description', JSON.stringify(formData.description));
    data.append('address', JSON.stringify(formData.address));
    data.append('phone', formData.phone);
    if (logoFile) data.append('logo', logoFile);
    mutation.mutate(data);
  };

  const fieldClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all";
  const labelClass = "block text-sm text-white/60 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-5">{shop ? t('admin.edit_shop') : t('admin.add_shop')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <BilingualInput
            label={t('admin.shop_name')}
            value={formData.name}
            onChange={v => setFormData({ ...formData, name: v })}
            placeholder={{ en: 'Shop name in English', am: 'የሱቅ ስም በአማርኛ' }}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass}>{t('admin.category')}</label>
              {/* Category Language Switcher */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                <button 
                  type="button" 
                  onClick={() => setCategoryLang('en')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    categoryLang === 'en' ? 'bg-primary-500 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button 
                  type="button" 
                  onClick={() => setCategoryLang('am')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    categoryLang === 'am' ? 'bg-primary-500 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  አማ
                </button>
              </div>
            </div>
            <Select
              value={formData.category}
              onChange={v => setFormData({ ...formData, category: v })}
              options={shopCategories
                .filter((cat: any) => {
                  // Filter out categories with invalid names
                  if (typeof cat.name === 'object') {
                    return cat.name.en || cat.name.am; // Must have at least one language
                  }
                  return cat.name && cat.name.trim() !== ''; // Must have a valid string name
                })
                .map((cat: any) => {
                  const categoryValue = typeof cat.name === 'object' ? cat.name.en : cat.name;
                  return {
                    value: categoryValue, 
                    label: getLocalized(cat.name, categoryLang) // Use independent category language
                  };
                })}
              placeholder={t('admin.select_category')}
              required
            />
            {shopCategories.length === 0 && (
              <p className="mt-1.5 text-xs text-yellow-400/70">{t('admin.no_categories')}</p>
            )}
          </div>

          <BilingualInput
            label={t('admin.description')}
            value={formData.description}
            onChange={v => setFormData({ ...formData, description: v })}
            placeholder={{ en: 'Description in English', am: 'መግለጫ በአማርኛ' }}
            multiline
            rows={3}
            required
          />

          <BilingualInput
            label={t('admin.address')}
            value={formData.address}
            onChange={v => setFormData({ ...formData, address: v })}
            placeholder={{ en: 'Address in English', am: 'አድራሻ በአማርኛ' }}
            required
          />

          <div>
            <label className={labelClass}>{t('admin.phone')}</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone number" required className={fieldClass} />
          </div>

          <div>
            <label className={labelClass}>{t('admin.logo')}</label>
            <label className="flex flex-col items-center justify-center w-full h-20 bg-white/5 border border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/10 hover:border-primary-500/40 transition-all">
              <div className="flex flex-col items-center gap-1">
                <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-white/30">{logoFile ? logoFile.name : t('admin.upload_logo')}</span>
              </div>
              <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={e => setLogoFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-colors">{t('common.cancel')}</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-400 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
              {mutation.isPending ? t('admin.updating') : shop ? t('admin.update') : t('admin.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
