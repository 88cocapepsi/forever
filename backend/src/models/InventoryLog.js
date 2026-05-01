import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    type: { type: String, enum: ['import', 'sale', 'adjustment'], required: true },
    quantity: { type: Number, required: true },
    note: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const InventoryLog = mongoose.models.InventoryLog || mongoose.model('InventoryLog', inventoryLogSchema);

export { InventoryLog };
export default InventoryLog;
