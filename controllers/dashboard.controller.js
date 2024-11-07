const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

class DashboardController {
  getDashboardStats = async (req, res) => {
    try {
      // Fetch total sales from orders
      const totalSales = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]);

      // Count new users
      const newUsersCount = await User.countDocuments();

      // Count pending orders
      const pendingOrdersCount = await Order.countDocuments({ status: "Pending" });

      // Count products
      const productCount = await Product.countDocuments();

      res.status(200).json({
        totalSales: totalSales[0]?.total || 0,
        newUsers: newUsersCount,
        pendingOrders: pendingOrdersCount,
        products: productCount,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = new DashboardController();
