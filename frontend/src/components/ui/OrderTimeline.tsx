import { StatusHistory } from '../../types';
import { formatDate } from '../../lib/utils';
import { Check, Circle } from 'lucide-react';

interface OrderTimelineProps {
  statusHistory: StatusHistory[];
  currentStatus: string;
}

export function OrderTimeline({ statusHistory, currentStatus }: OrderTimelineProps) {
  const allStatuses = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'collected', label: 'Collected' },
    { key: 'on_the_way', label: 'On the Way' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStatusIndex = (status: string) => {
    return allStatuses.findIndex(s => s.key === status);
  };

  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="space-y-4">
      {allStatuses.map((status, index) => {
        const historyItem = statusHistory.find(h => h.status === status.key);
        const isCompleted = index <= currentIndex && !isCancelled;
        const isCurrent = index === currentIndex && !isCancelled;

        return (
          <div key={status.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              {index < allStatuses.length - 1 && (
                <div className={`w-0.5 h-12 ${
                  isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>

            <div className="flex-1 pb-8">
              <h4 className={`font-semibold ${
                isCompleted ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {status.label}
              </h4>
              {historyItem && (
                <div className="mt-1">
                  <p className="text-sm text-gray-600">
                    {formatDate(historyItem.changedAt)}
                  </p>
                  {historyItem.note && (
                    <p className="text-sm text-gray-500 mt-1">{historyItem.note}</p>
                  )}
                </div>
              )}
              {isCurrent && !historyItem && (
                <p className="text-sm text-primary-600 mt-1">In progress...</p>
              )}
            </div>
          </div>
        );
      })}

      {isCancelled && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-600 text-white">
              <span className="text-xl">✕</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-red-600">Order Cancelled</h4>
            {statusHistory.find(h => h.status === 'cancelled') && (
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(statusHistory.find(h => h.status === 'cancelled')!.changedAt)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
