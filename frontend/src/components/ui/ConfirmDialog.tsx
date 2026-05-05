import { AlertTriangle, Trash2, UserX, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'delete' | 'deactivate' | 'activate' | 'warning';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText,
  cancelText,
  isLoading = false
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 className="w-6 h-6 text-red-400" />;
      case 'deactivate':
        return <UserX className="w-6 h-6 text-red-400" />;
      case 'activate':
        return <UserCheck className="w-6 h-6 text-green-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'delete':
      case 'deactivate':
        return {
          confirmBg: 'bg-red-500 hover:bg-red-400',
          confirmText: 'text-white',
          iconBg: 'bg-red-500/10 border-red-500/20'
        };
      case 'activate':
        return {
          confirmBg: 'bg-green-500 hover:bg-green-400',
          confirmText: 'text-white',
          iconBg: 'bg-green-500/10 border-green-500/20'
        };
      default:
        return {
          confirmBg: 'bg-yellow-500 hover:bg-yellow-400',
          confirmText: 'text-white',
          iconBg: 'bg-yellow-500/10 border-yellow-500/20'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${colors.iconBg} border flex items-center justify-center mx-auto mb-4`}>
          {getIcon()}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            {cancelText || t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 ${colors.confirmBg} ${colors.confirmText} rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t('common.processing')}
              </div>
            ) : (
              confirmText || t('common.confirm')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}