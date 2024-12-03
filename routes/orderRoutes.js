const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/", async (req, res) => {
  const { user, cart, totalAmount, paymentReference } = req.body;

  if (!user || !cart || !totalAmount || !paymentReference) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newOrder = new Order({
      user,
      cart,
      totalAmount,
      paymentReference,
      status: "Paid",
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully.", order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: "Error creating order.", error: err.message });
  }
});

// Get all orders or filter by user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query; // Optional filter
    const query = userId ? { user: userId } : {};

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("cart.product", "name price");

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders.", error: err.message });
  }
});

// Get a specific order by its ID
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params; // Get orderId from URL parameter

  try {
    // Fetch the order by ID and populate related data (user, product details)
    const order = await Order.findById(orderId)
      .populate("user", "name email")  // Include user details (name, email)
      .populate("cart.product", "name price"); // Include product details (name, price)

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order.", error: err.message });
  }
});


module.exports = router;
