import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'system', trim: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, default: '', trim: true },
    level: { type: String, enum: ['info', 'success', 'warning', 'danger'], default: 'info' },
    createdByName: { type: String, default: '', trim: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
