// dashboardRouter.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const protect = require("../middleware/authMiddleware"); // Import the protect middleware

// Apply the protect middleware to routes that need authentication
router.get("/customer-count", protect, dashboardController.getCustomerCount); // Get the total number of customers
router.get("/new-customers", protect, dashboardController.getNewCustomers); // Get new customers (daily/weekly/monthly)
router.get("/customers-by-tags", protect, dashboardController.getTagwiseCustomerCount); // Get customer count by tag
// router.get("/recent-activity", protect, dashboardController.getRecentActivity); // Get recent customer activity
// router.get("/dashboard-stats", protect, dashboardController.getDashboardStats); // Get overall dashboard stats

module.exports = router;
