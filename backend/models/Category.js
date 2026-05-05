import mongoose from 'mongoose';

const localizedString = {
  en: { type: String, trim: true },
  am: { type: String, trim: true }
};

const categorySchema = new mongoose.Schema({
  name: {
    type: localizedString,
    required: true
  },
  type: {
    type: String,
    enum: ['shop', 'product'],
    required: true
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

categorySchema.index({ type: 1, isActive: 1 });

export default mongoose.model('Category', categorySchema);
