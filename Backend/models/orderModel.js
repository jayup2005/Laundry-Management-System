import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: {
    shirts: { type: Number, required: true, default: 0 },
    pants: { type: Number, required: true, default: 0 },
    dresses: { type: Number, required: true, default: 0 },
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
