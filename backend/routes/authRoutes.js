const express = require('express');
const { registerUser, authenticateUser } = require('../models/userModel');
const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await registerUser(name, email, password);
    res.json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to authenticate user and get JWT token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authenticateUser(email, password);
    res.json({ message: 'Login successful', user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
