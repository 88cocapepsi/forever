import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    zone: { type: String, default: 'Sảnh trước', trim: true },
    type: { type: String, enum: ['table', 'takeaway', 'delivery'], default: 'table' },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
  },
  { timestamps: true }
);

export const PosTable = mongoose.model('PosTable', tableSchema);
