import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    area: { type: String, enum: ['front', 'back', 'vip', 'other'], default: 'other' },
    status: { type: String, enum: ['empty', 'serving', 'busy', 'paid', 'reserved'], default: 'empty' },
    note: { type: String, default: '', trim: true },
    customerName: { type: String, default: '', trim: true },
    // Mixed để tương thích dữ liệu cũ từng lưu object giả, và dữ liệu mới lưu ObjectId order thật.
    currentOrder: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const Table = mongoose.models.PosTable || mongoose.model('PosTable', tableSchema);

export { Table, Table as PosTable };
export default Table;
