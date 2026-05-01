import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true, default: 'Khác' },
    price: { type: Number, required: true, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'ly', trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export { Product };
export default Product;
