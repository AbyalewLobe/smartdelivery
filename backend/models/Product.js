import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: [String],
  imagePublicIds: [String], // Cloudinary public IDs for deletion
  category: String,
  stock: { type: Number, default: 0, min: 0 },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
productSchema.index({ shopId: 1, isAvailable: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
