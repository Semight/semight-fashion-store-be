const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Import Order model

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('cart.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
