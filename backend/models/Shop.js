import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true 
  },
  description: { type: String, required: true },
  logoUrl: String,
  logoPublicId: String, // Cloudinary public ID for deletion
  address: { type: String, required: true },
  phone: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
shopSchema.index({ category: 1, isActive: 1 });

export default mongoose.model('Shop', shopSchema);
