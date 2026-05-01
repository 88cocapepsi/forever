import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'PosTable', required: true },
    tableName: { type: String, default: '' },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, default: 0, min: 0 },
    total: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['open', 'paid', 'cancelled'], default: 'open' },
    openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    note: { type: String, default: '', trim: true },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  const subtotal = (this.items || []).reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  this.subtotal = subtotal;
  this.total = Math.max(0, subtotal - Number(this.discount || 0));
  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export { Order };
export default Order;
