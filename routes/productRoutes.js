const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import Product model

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        let product = await Product.create(body)
        res.status(201).json({ message: "product created"})
    } catch (err) {
        res.status(500).json({ message: err.message });
      }
})

module.exports = router;
