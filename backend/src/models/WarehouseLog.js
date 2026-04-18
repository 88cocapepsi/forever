import mongoose from 'mongoose';

const warehouseLogSchema = new mongoose.Schema(
  {
    warehouseItem: { type: mongoose.Schema.Types.ObjectId, ref: 'WarehouseItem', default: null },
    itemName: { type: String, required: true, trim: true },
    action: { type: String, enum: ['create', 'edit', 'delete'], required: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: 'cái', trim: true },
    note: { type: String, default: '', trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const WarehouseLog = mongoose.model('WarehouseLog', warehouseLogSchema);
