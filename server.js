const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require("./cors");
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors(corsOptions));

// Set the body size limit to 10MB or any size you find appropriate
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));

// MongoDB Connection
mongoose.connect(
  process.env.MONGODBURL || `mongodb://127.0.0.1:27017/semight-store`
).catch(error => console.error("Error connecting to MongoDB:", error));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Sample Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
