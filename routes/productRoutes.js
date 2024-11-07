// Import the required packages
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

// Get a single product by ID
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category });
        if (!products.length) {
            return res.status(404).json({ message: "No products found in this category" });
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    try {
        const { name, price, category, description, sizes, images } = req.body;
        const newProduct = new Product({
            name,
            price,
            category,
            description,
            sizes,    // Accept multiple sizes
            images,   // Accept multiple image URLs
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product created", product: savedProduct });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a product by ID
router.delete('/:productId', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully", product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
