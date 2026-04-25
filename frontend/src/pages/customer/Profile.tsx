import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { profileApi } from '../../api/profileApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Camera } from 'lucide-react';

type TabType = 'details' | 'password';

export function Profile() {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const { user, updateUser } = useAuthStore();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const tabs = [
    { id: 'details' as TabType, label: 'My Details' },
    { id: 'password' as TabType, label: 'Password' }
  ];

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (response) => {
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
      setIsEditingName(false);
      setIsEditingPhone(false);
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  const handleSaveName = () => {
    updateProfileMutation.mutate({ name, phone: user?.phone || '' });
  };

  const handleSavePhone = () => {
    updateProfileMutation.mutate({ name: user?.name || '', phone });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account & Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleString('en-US', { 
              hour: 'numeric', 
              minute: 'numeric', 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour12: true
            })}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-lime-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* My Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* Basic Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Details</h2>
              
              {/* Profile Picture */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <button className="text-lime-600 font-medium hover:text-lime-700 transition">
                  Change
                </button>
              </div>

              {/* Name Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    disabled={!isEditingName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      isEditingName 
                        ? 'border-lime-500 bg-white' 
                        : 'border-gray-200 bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-lime-100 transition`}
                  />
                  {isEditingName ? (
                    <Button
                      onClick={handleSaveName}
                      size="sm"
                      isLoading={updateProfileMutation.isPending}
                    >
                      Save
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-lime-600 font-medium hover:text-lime-700 transition px-4"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none transition cursor-not-allowed"
                  />
                  <span className="text-gray-400 text-sm px-4">Cannot edit</span>
                </div>
              </div>

              {/* Phone Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="tel"
                    disabled={!isEditingPhone}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      isEditingPhone 
                        ? 'border-lime-500 bg-white' 
                        : 'border-gray-200 bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-lime-100 transition`}
                  />
                  {isEditingPhone ? (
                    <Button
                      onClick={handleSavePhone}
                      size="sm"
                      isLoading={updateProfileMutation.isPending}
                    >
                      Save
                    </Button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="text-lime-600 font-medium hover:text-lime-700 transition px-4"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Delete Account */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Delete Profile</h2>
              <p className="text-gray-600 text-sm mb-6">
                Delete your account and all of your source data. This is irreversible.
              </p>
              <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition shadow-md">
                Delete Account
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

// Password Tab Component
function PasswordTab() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const changePasswordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          required
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          required
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={changePasswordMutation.isPending}
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}
