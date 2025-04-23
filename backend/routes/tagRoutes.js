const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const protect = require("../middleware/authMiddleware"); 

router.get("/", protect, tagController.getTags);
router.post("/assign", protect, tagController.assignTags);
router.get("/customer/:customerId", protect, tagController.getTagsForCustomer);

module.exports = router;
