import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { profileApi } from '../../api/profileApi';
import { User, Lock } from 'lucide-react';

type TabType = 'details' | 'password';

export function Profile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditing, setIsEditing] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (response) => {
      updateUser(response.data.user);
      toast.success('Profile updated');
      setIsEditing(false);
    },
    onError: () => toast.error('Failed to update profile')
  });

  const fieldClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const labelClass = "block text-sm text-white/50 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero Header */}
      <section className="relative py-14 px-4 bg-gradient-to-br from-gray-900 via-primary-950 to-primary-900 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-primary-400 text-2xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 mb-8">
          {([
            { id: 'details', label: t('profile.details'), icon: User },
            { id: 'password', label: t('profile.password'), icon: Lock },
          ] as { id: TabType; label: string; icon: any }[]).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-900/40'
                  : 'text-white/40 hover:text-white'
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-white">{t('profile.basic_details')}</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)}
                    className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">
                    {t('profile.edit')}
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => { setIsEditing(false); setName(user?.name || ''); setPhone(user?.phone || ''); }}
                      className="text-xs font-medium text-white/40 hover:text-white transition-colors">
                      {t('profile.cancel')}
                    </button>
                    <button
                      onClick={() => updateProfileMutation.mutate({ name, phone })}
                      disabled={updateProfileMutation.isPending}
                      className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50">
                      {updateProfileMutation.isPending ? t('profile.saving') : t('profile.save')}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>{t('profile.name')}</label>
                <input value={name} onChange={e => setName(e.target.value)} disabled={!isEditing}
                  placeholder="Your name" className={fieldClass} />
              </div>

              <div>
                <label className={labelClass}>{t('profile.email')}</label>
                <input value={user?.email || ''} disabled type="email" className={fieldClass} />
                <p className="mt-1 text-xs text-white/20">{t('profile.email_note')}</p>
              </div>

              <div>
                <label className={labelClass}>{t('profile.phone')}</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} disabled={!isEditing}
                  placeholder="Phone number" type="tel" className={fieldClass} />
              </div>
            </div>

            {/* Danger zone — subtle */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-white/20 mb-2">{t('profile.danger_zone')}</p>
              <button className="text-xs text-white/20 hover:text-red-400 transition-colors underline underline-offset-2">
                {t('profile.delete_account')}
              </button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && <PasswordTab />}
      </div>
    </div>
  );
}

function PasswordTab() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const mutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => { toast.success('Password changed'); setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to change password')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (formData.newPassword !== formData.confirmPassword) return toast.error('Passwords do not match');
    mutation.mutate({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
  };

  const fieldClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 text-sm transition-all";
  const labelClass = "block text-sm text-white/50 mb-1.5";

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-base font-bold text-white mb-6">{t('profile.change_password')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>{t('profile.current_password')}</label>
          <input type="password" placeholder="••••••••" value={formData.currentPassword}
            onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
            required className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>{t('profile.new_password')}</label>
          <input type="password" placeholder="••••••••" value={formData.newPassword}
            onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
            required className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>{t('profile.confirm_password')}</label>
          <input type="password" placeholder="••••••••" value={formData.confirmPassword}
            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            required className={fieldClass} />
        </div>
        <button type="submit" disabled={mutation.isPending}
          className="w-full py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 mt-2">
          {mutation.isPending ? t('profile.updating') : t('profile.update_password')}
        </button>
      </form>
    </div>
  );
}
