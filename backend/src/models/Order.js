import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'PosTable', required: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    status: { type: String, enum: ['open', 'paid', 'cancelled'], default: 'open' },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    note: { type: String, default: '' },
    paidAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
