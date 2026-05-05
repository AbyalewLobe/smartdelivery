import mongoose from 'mongoose';

const localizedString = {
  en: { type: String, trim: true },
  am: { type: String, trim: true }
};

const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: {
    type: localizedString,
    required: true
  },
  description: {
    type: localizedString,
    required: true
  },
  price: { type: Number, required: true, min: 0 },
  images: [String],
  imagePublicIds: [String],
  stock: { type: Number, default: 0, min: 0 },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ shopId: 1, isAvailable: 1 });

export default mongoose.model('Product', productSchema);
