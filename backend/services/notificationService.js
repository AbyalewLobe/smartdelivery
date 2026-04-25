import { sendEmail } from '../utils/email.js';
import { getStatusMessage } from '../utils/orderValidation.js';

// Send order confirmation email to customer
export const sendOrderConfirmation = async (order, customer) => {
  const subject = `Order Confirmation - #${order._id.toString().slice(-8)}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">Order Confirmed!</h2>
      <p>Hi ${customer.name},</p>
      <p>Thank you for your order. We've received it and will process it shortly.</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
        <p><strong>Shop:</strong> ${order.shopId.name}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)} ETB</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}</p>
      </div>

      <h3>Items:</h3>
      <ul>
        ${order.items.map(item => `
          <li>${item.name} x ${item.quantity} - ${item.subtotal.toFixed(2)} ETB</li>
        `).join('')}
      </ul>

      <h3>Delivery Address:</h3>
      <p>
        ${order.deliveryAddress.street}<br>
        ${order.deliveryAddress.city}<br>
        ${order.deliveryAddress.notes ? `Note: ${order.deliveryAddress.notes}` : ''}
      </p>

      <p style="margin-top: 30px;">You can track your order status in your account.</p>
      <p>Best regards,<br>Smart Deliver Team</p>
    </div>
  `;

  await sendEmail(customer.email, subject, html);
};

// Send status update notification
export const sendStatusUpdate = async (order, customer, newStatus) => {
  const subject = `Order Update - #${order._id.toString().slice(-8)}`;
  
  const statusColors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    collected: '#8b5cf6',
    on_the_way: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444'
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${statusColors[newStatus]};">Order Status Update</h2>
      <p>Hi ${customer.name},</p>
      <p>${getStatusMessage(newStatus)}</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
        <p><strong>Status:</strong> <span style="color: ${statusColors[newStatus]}; font-weight: bold; text-transform: uppercase;">${newStatus.replace('_', ' ')}</span></p>
      </div>

      ${newStatus === 'delivered' ? `
        <p style="color: #10b981; font-weight: bold;">Thank you for choosing Smart Deliver!</p>
      ` : ''}

      ${newStatus === 'cancelled' ? `
        <p>Cancellation reason: ${order.cancelReason}</p>
      ` : ''}

      <p style="margin-top: 30px;">Best regards,<br>Smart Deliver Team</p>
    </div>
  `;

  await sendEmail(customer.email, subject, html);
};

// Send new order notification to admin
export const sendOrderToAdmin = async (order, customer) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.warn('Admin email not configured');
    return;
  }

  const subject = `New Order Received - #${order._id.toString().slice(-8)}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">New Order Alert</h2>
      <p>A new order has been placed and requires your attention.</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Order ID:</strong> #${order._id.toString().slice(-8)}</p>
        <p><strong>Customer:</strong> ${customer.name} (${customer.phone})</p>
        <p><strong>Shop:</strong> ${order.shopId.name}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)} ETB</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}</p>
      </div>

      <h3>Items:</h3>
      <ul>
        ${order.items.map(item => `
          <li>${item.name} x ${item.quantity} - ${item.subtotal.toFixed(2)} ETB</li>
        `).join('')}
      </ul>

      <h3>Delivery Address:</h3>
      <p>
        ${order.deliveryAddress.street}<br>
        ${order.deliveryAddress.city}<br>
        ${order.deliveryAddress.notes ? `Note: ${order.deliveryAddress.notes}` : ''}
      </p>

      <p style="margin-top: 30px;">Please log in to the admin panel to process this order.</p>
    </div>
  `;

  await sendEmail(adminEmail, subject, html);
};

// Send cancellation notification
export const sendCancellationNotification = async (order, customer) => {
  await sendStatusUpdate(order, customer, 'cancelled');
};
