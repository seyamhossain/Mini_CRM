const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const protect = require("../middleware/authMiddleware"); // Import the protect middleware

// Apply the protect middleware to routes that need authentication
router.get("/", protect, customerController.getCustomers);
router.post("/", protect, customerController.addCustomer);
router.put("/:id", protect, customerController.updateCustomer);
router.delete("/:id", protect, customerController.deleteCustomer);
router.get("/filter/by-tags", protect, customerController.getCustomersByTags);
router.get("/search", protect, customerController.searchAndFilterCustomers);

module.exports = router;
