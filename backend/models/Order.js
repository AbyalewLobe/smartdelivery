import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number,
  subtotal: Number
});

const statusHistorySchema = new mongoose.Schema({
  status: String,
  changedAt: { type: Date, default: Date.now },
  note: String
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    label: String,
    street: String,
    city: String,
    notes: String
  },
  paymentMethod: { type: String, enum: ['cash', 'card'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'collected', 'on_the_way', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [statusHistorySchema],
  cancelReason: String,
  createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ shopId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Order', orderSchema);
