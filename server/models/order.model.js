const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const orderModel = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'cash',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderModel);