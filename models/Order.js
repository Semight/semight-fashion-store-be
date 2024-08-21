// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: String, required: true }, // Shop or store name
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Other statuses: Processing, Shipped, Delivered, etc.
  orderDate: { type: Date, default: Date.now }
  // Add other fields if necessary
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
