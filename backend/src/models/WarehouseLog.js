import mongoose from 'mongoose';

const warehouseLogSchema = new mongoose.Schema(
  {
    warehouseItem: { type: mongoose.Schema.Types.ObjectId, ref: 'WarehouseItem', default: null },
    itemName: { type: String, required: true, trim: true },
    action: { type: String, enum: ['create', 'edit', 'update', 'delete'], required: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: 'cái', trim: true },
    note: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const WarehouseLog = mongoose.models.WarehouseLog || mongoose.model('WarehouseLog', warehouseLogSchema);

export { WarehouseLog };
export default WarehouseLog;
