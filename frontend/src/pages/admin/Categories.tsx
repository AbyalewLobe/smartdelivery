import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../../api/categoryApi';
import { Category, LocalizedString } from '../../types';
import { BilingualInput } from '../../components/ui/BilingualInput';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useTranslation } from 'react-i18next';
import { getLocalized } from '../../lib/utils';

// Reusable dark table wrapper
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <table className="w-full">{children}</table>
    </div>
  );
}

export default function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'shop' | 'product'>('all');
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<{ name: LocalizedString; type: 'shop' | 'product' }>({ 
    name: { en: '', am: '' }, 
    type: 'shop' 
  });
  const { data, isLoading } = useQuery({
    queryKey: ['categories', filterType],
    queryFn: () => categoryApi.getCategories(filterType === 'all' ? { activeOnly: false } : { type: filterType, activeOnly: false })
  });
  const categories = data?.data || [];

  const createMutation = useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setShowModal(false); resetForm(); }
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoryApi.updateCategory(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setShowModal(false); setEditingCategory(null); resetForm(); }
  });
  const deleteMutation = useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); setConfirmDelete(null); }
  });

  const resetForm = () => setFormData({ name: { en: '', am: '' }, type: 'shop' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data: { name: formData.name } });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    const existingName: LocalizedString = typeof category.name === 'object' 
      ? category.name 
      : { en: category.name, am: '' };
    setFormData({ name: existingName, type: category.type });
    setShowModal(true);
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">{t('admin.categories')}</h1>
          <p className="text-white/40 text-sm mt-0.5">{t('admin.manage_categories')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditingCategory(null); resetForm(); setShowModal(true); }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + {t('admin.add_category')}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <button onClick={() => setFilterType('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filterType === 'all' ? 'bg-primary-500 text-white' : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
          }`}>
          {t('common.all')}
        </button>
      </div>

      {/* Table */}
      <Table>
        <thead>
          <tr className="border-b border-white/5">
            <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">{t('common.name')}</th>
            <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">{t('common.status')}</th>
            <th className="px-5 py-3 text-right text-xs font-medium text-white/30 uppercase tracking-wider">{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr><td colSpan={3} className="px-5 py-12 text-center text-white/30 text-sm">{t('admin.no_categories_found')}</td></tr>
          ) : categories.map((cat: Category, i: number) => (
            <tr key={cat._id} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
              <td className="px-5 py-3.5 text-sm font-medium text-white">
                {getLocalized(cat.name, i18n.language) || 'Unnamed'}
              </td>
              <td className="px-5 py-3.5">
                <button onClick={() => updateMutation.mutate({ id: cat._id, data: { isActive: !cat.isActive } })}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-colors ${
                    cat.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-green-400' : 'bg-white/30'}`}></span>
                  {cat.isActive ? t('common.active') : t('common.inactive')}
                </button>
              </td>
              <td className="px-5 py-3.5 text-right">
                <button onClick={() => handleEdit(cat)} className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors mr-4">{t('common.edit')}</button>
                <button onClick={() => setConfirmDelete(cat)} disabled={deleteMutation.isPending}
                  className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors">{t('common.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      {showModal && (        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-5">{editingCategory ? t('admin.edit_category') : t('admin.add_category')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <BilingualInput
                label={t('admin.category_name')}
                value={formData.name}
                onChange={v => setFormData({ ...formData, name: v })}
                placeholder={{ en: 'Enter name in English', am: 'ስም በአማርኛ ያስገቡ' }}
                required
              />
              
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingCategory(null); resetForm(); }}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-colors">{t('common.cancel')}</button>
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-400 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? t('admin.updating') : editingCategory ? t('admin.update') : t('admin.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => deleteMutation.mutate(confirmDelete!._id)}
        title={t('admin.delete_category_title')}
        message={t('admin.delete_category_message', { name: getLocalized(confirmDelete?.name, i18n.language) })}
        type="delete"
        confirmText={t('common.delete')}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
