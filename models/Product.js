// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  size: { type: String },
  image: { type: String }, // URL or path to the image
  // Add other fields if necessary
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
