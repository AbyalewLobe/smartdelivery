import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { notificationApi, Notification } from '../../api/notificationApi';
import { useNotificationStore } from '../../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, X } from 'lucide-react';

const iconConfig: Record<string, { bg: string; emoji: string }> = {
  order_placed:    { bg: 'bg-blue-500',   emoji: '🛍️' },
  order_status:    { bg: 'bg-orange-500', emoji: '📦' },
  order_cancelled: { bg: 'bg-red-500',    emoji: '❌' },
  review_added:    { bg: 'bg-yellow-500', emoji: '⭐' },
  shop_approved:   { bg: 'bg-green-500',  emoji: '✅' },
  shop_rejected:   { bg: 'bg-red-500',    emoji: '🚫' },
  default:         { bg: 'bg-primary-500',emoji: '🔔' },
};

function groupByDate(notifications: Notification[]) {
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: Notification[] }[] = [];
  const todayItems = notifications.filter(n => new Date(n.createdAt) >= today);
  const yesterdayItems = notifications.filter(n => {
    const d = new Date(n.createdAt);
    return d >= yesterday && d < today;
  });
  const olderItems = notifications.filter(n => new Date(n.createdAt) < yesterday);

  if (todayItems.length) groups.push({ label: 'Today', items: todayItems });
  if (yesterdayItems.length) groups.push({ label: 'Yesterday', items: yesterdayItems });
  if (olderItems.length) groups.push({ label: 'Earlier', items: olderItems });
  return groups;
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ' • ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export const NotificationBell = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { notifications, unreadCount, setNotifications, setUnreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications({ limit: 30 }),
    refetchInterval: 10000
  });

  const { data: countData } = useQuery({
    queryKey: ['notificationCount'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 10000
  });

  useEffect(() => { if (data?.data) setNotifications(data.data); }, [data, setNotifications]);
  useEffect(() => { if (countData?.count !== undefined) setUnreadCount(countData.count); }, [countData, setUnreadCount]);

  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: (_, id) => { markAsRead(id); queryClient.invalidateQueries({ queryKey: ['notificationCount'] }); }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => { markAllAsRead(); queryClient.invalidateQueries({ queryKey: ['notificationCount'] }); }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: (_, id) => {
      removeNotification(id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
    }
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) markAsReadMutation.mutate(notification._id);
    if (notification.relatedModel === 'Order' && notification.relatedId) {
      navigate(`/orders/${notification.relatedId}`);
      setIsOpen(false);
    }
  };

  const groups = groupByDate(notifications);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/50 hover:text-white transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed md:absolute right-0 md:right-0 left-0 md:left-auto top-14 md:top-auto md:mt-2 w-full md:w-96 bg-gray-900 border border-white/10 md:rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col max-h-[calc(100vh-3.5rem)] md:max-h-[560px]">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{t('notifications.title')}</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-400 rounded-full border border-red-500/20">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                className="flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                {t('notifications.mark_read')}
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4">
                  <Bell className="w-7 h-7 text-white/20" />
                </div>
                <p className="text-white/40 text-sm">{t('notifications.empty')}</p>
              </div>
            ) : (
              groups.map(group => (
                <div key={group.label}>
                  {/* Date group label */}
                  <div className="px-5 pt-4 pb-2">
                    <span className="text-xs font-medium text-white/30 uppercase tracking-wider">
                      {group.label === 'Today'
                        ? t('notifications.today')
                        : group.label === 'Yesterday'
                        ? t('notifications.yesterday')
                        : t('notifications.earlier')}
                    </span>
                  </div>

                  {group.items.map((notification) => {
                    const icon = iconConfig[notification.type] || iconConfig.default;
                    return (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`group relative flex items-start gap-3.5 px-5 py-3.5 cursor-pointer transition-colors hover:bg-white/5 ${
                          !notification.isRead ? 'bg-primary-500/5' : ''
                        }`}
                      >
                        {/* Unread dot */}
                        {!notification.isRead && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                        )}

                        {/* Icon */}
                        <div className={`w-10 h-10 ${icon.bg} rounded-xl flex items-center justify-center flex-shrink-0 text-lg`}>
                          {icon.emoji}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/80 leading-snug">
                            <span className="font-semibold text-white">{notification.title}</span>{' '}
                            {notification.message}
                          </p>
                          <p className="text-xs text-white/30 mt-1.5">{formatTime(notification.createdAt)}</p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={e => { e.stopPropagation(); deleteNotificationMutation.mutate(notification._id); }}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-white/30 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
