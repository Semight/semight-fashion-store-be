const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller'); // Adjust the path if needed
const authMiddleware = require('../middlewares/auth.middleware'); // Adjust the path if needed

// Define the route for fetching dashboard statistics
router.get('/', authMiddleware, DashboardController.getDashboardStats);

module.exports = router;
