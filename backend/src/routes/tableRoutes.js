import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: '',
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const currentOrderSchema = new mongoose.Schema(
  {
    items: {
      type: [orderItemSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // front | back | vip | other
    area: {
      type: String,
      default: 'other',
      enum: ['front', 'back', 'vip', 'other'],
    },

    // empty | serving | paid | reserved
    status: {
      type: String,
      default: 'empty',
      enum: ['empty', 'serving', 'paid', 'reserved'],
    },

    note: {
      type: String,
      default: '',
      trim: true,
    },

    customerName: {
      type: String,
      default: '',
      trim: true,
    },

    currentOrder: {
      type: currentOrderSchema,
      default: () => ({
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        updatedAt: new Date(),
      }),
    },
  },
  {
    timestamps: true,
  }
);

// Giữ updatedAt trong currentOrder luôn mới khi save nếu có currentOrder
tableSchema.pre('save', function (next) {
  if (this.currentOrder) {
    this.currentOrder.updatedAt = new Date();

    const items = Array.isArray(this.currentOrder.items) ? this.currentOrder.items : [];

    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.qty || 0);
      return sum + price * qty;
    }, 0);

    const discount = Number(this.currentOrder.discount || 0);
    const total = Math.max(0, subtotal - discount);

    this.currentOrder.subtotal = subtotal;
    this.currentOrder.total = total;
  }

  next();
});

const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);

export default Table;
