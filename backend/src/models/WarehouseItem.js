import mongoose from 'mongoose';

const warehouseItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'cái', trim: true },
    note: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

export const WarehouseItem = mongoose.model('WarehouseItem', warehouseItemSchema);
