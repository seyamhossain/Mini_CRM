const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to register a user
const registerUser = async (name, email, password) => {
  try {
    // Check if email already exists
    const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    return result.rows[0];
  } catch (err) {
    console.error(err);
    throw new Error('Error registering user');
  }
};

// Function to authenticate user and generate JWT
const authenticateUser = async (email, password) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    // Check if user exists
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Check if password matches
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    return { user, token };
  } catch (err) {
    console.error(err);
    throw new Error('Authentication failed');
  }
};

module.exports = { registerUser, authenticateUser };
