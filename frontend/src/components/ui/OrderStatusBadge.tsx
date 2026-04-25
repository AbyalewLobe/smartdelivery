interface OrderStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'collected' | 'on_the_way' | 'delivered' | 'cancelled';
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    confirmed: {
      label: 'Confirmed',
      className: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    collected: {
      label: 'Collected',
      className: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    on_the_way: {
      label: 'On the Way',
      className: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    },
    delivered: {
      label: 'Delivered',
      className: 'bg-green-100 text-green-700 border-green-200'
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-700 border-red-200'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}
