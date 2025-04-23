const express = require('express');
const multer = require('multer');
const path = require('path');
const csvController = require('../controllers/csvController');
const protect = require('../middleware/authMiddleware'); // Import the protect middleware

// Setup multer to store file in 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

const router = express.Router();

// POST /api/csv/upload to upload CSV (with authentication)
router.post('/upload', protect, upload.single('csvFile'), csvController.uploadCSV);

module.exports = router;
