// Validate status transitions
export const canTransitionStatus = (currentStatus, newStatus) => {
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['collected', 'cancelled'],
    collected: ['on_the_way', 'cancelled'],
    on_the_way: ['delivered'],
    delivered: [],
    cancelled: []
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

// Get status message for customer notification
export const getStatusMessage = (status) => {
  const messages = {
    pending: 'Your order has been received and is awaiting confirmation.',
    confirmed: 'Your order has been confirmed! We are preparing it for delivery.',
    collected: 'Items have been collected. Preparing your delivery.',
    on_the_way: 'Your order is on the way! It will arrive soon.',
    delivered: 'Your order has been delivered. Enjoy!',
    cancelled: 'Your order has been cancelled.'
  };
  
  return messages[status] || 'Order status updated';
};
