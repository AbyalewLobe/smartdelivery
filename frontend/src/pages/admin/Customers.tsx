import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminCustomerApi } from '../../api/adminApi';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export function Customers() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [confirmStatus, setConfirmStatus] = useState<any>(null);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => adminCustomerApi.getCustomers().then(res => res.data.data || [])
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminCustomerApi.updateCustomerStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      toast.success(t('admin.customer_status_updated'));
      setConfirmStatus(null);
    },
    onError: () => toast.error(t('admin.operation_failed'))
  });

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">{t('admin.customers')}</h1>
        <p className="text-white/40 text-sm mt-0.5">{t('admin.manage_customers')}</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {[t('admin.customer'), t('admin.email'), t('admin.phone'), t('admin.addresses'), t('admin.joined'), t('common.status'), t('common.actions')].map(h => (
                <th key={h} className={`px-5 py-3 text-xs font-medium text-white/30 uppercase tracking-wider ${h === t('common.actions') ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!Array.isArray(customers) || customers.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-white/30 text-sm">{t('admin.no_customers_found')}</td></tr>
            ) : customers.map((c: any, i: number) => (
              <tr key={c._id} className={`border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? 'bg-white/[0.02]' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-400 text-xs font-bold">{c.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/50">{c.email}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{c.phone}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{c.addresses?.length || 0}</td>
                <td className="px-5 py-3.5 text-sm text-white/50">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                    c.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {c.isActive ? t('common.active') : t('common.inactive')}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => setConfirmStatus(c)}
                    className={`text-xs font-medium transition-colors ${c.isActive ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                    {c.isActive ? t('common.deactivate') : t('common.activate')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile rows */}
      <div className="md:hidden space-y-3">
        {Array.isArray(customers) && customers.map((c: any) => (
          <div key={c._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-400 text-sm font-bold">{c.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <p className="text-xs text-white/30">{c.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
                c.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {c.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-white/30 text-xs">{t('admin.phone')}</p><p className="text-white/60">{c.phone}</p></div>
              <div><p className="text-white/30 text-xs">{t('admin.joined')}</p><p className="text-white/60">{new Date(c.createdAt).toLocaleDateString()}</p></div>
            </div>
            <button
              onClick={() => setConfirmStatus(c)}
              className={`w-full py-2 text-xs font-medium rounded-xl border transition-colors ${
                c.isActive ? 'text-red-400 bg-red-500/5 border-red-500/10 hover:bg-red-500/10' : 'text-green-400 bg-green-500/5 border-green-500/10 hover:bg-green-500/10'
              }`}>
              {c.isActive ? t('common.deactivate') : t('common.activate')}
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!confirmStatus}
        onClose={() => setConfirmStatus(null)}
        onConfirm={() => toggleStatusMutation.mutate({ id: confirmStatus._id, isActive: !confirmStatus.isActive })}
        title={confirmStatus?.isActive ? t('admin.deactivate_customer_title') : t('admin.activate_customer_title')}
        message={confirmStatus?.isActive
          ? t('admin.deactivate_customer_message', { name: confirmStatus?.name })
          : t('admin.activate_customer_message', { name: confirmStatus?.name })}
        type={confirmStatus?.isActive ? 'deactivate' : 'activate'}
        confirmText={confirmStatus?.isActive ? t('common.deactivate') : t('common.activate')}
        isLoading={toggleStatusMutation.isPending}
      />
    </div>
  );
}
