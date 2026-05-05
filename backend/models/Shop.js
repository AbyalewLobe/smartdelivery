import mongoose from 'mongoose';

const localizedString = {
  en: { type: String, trim: true },
  am: { type: String, trim: true }
};

const shopSchema = new mongoose.Schema({
  name: {
    type: localizedString,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: localizedString,
    required: true
  },
  logoUrl: String,
  logoPublicId: String,
  address: {
    type: localizedString,
    required: true
  },
  phone: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

shopSchema.index({ category: 1, isActive: 1 });

export default mongoose.model('Shop', shopSchema);
