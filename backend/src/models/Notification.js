import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'system', trim: true },
    title: { type: String, default: '', trim: true },
    message: { type: String, required: true, trim: true },
    level: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    readBy: { type: [String], default: [] },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export { Notification };
export default Notification;
