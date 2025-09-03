const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    pizza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizza',
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentDetails: {
        paymentId: String,
        status: String
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
