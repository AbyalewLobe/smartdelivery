import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['shop', 'product'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: '📦'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ name: 1 });

export default mongoose.model('Category', categorySchema);
