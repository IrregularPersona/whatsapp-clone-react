const express = require('express');
const router = express.Router();
const db = require('../../database/service');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered'
      });
    }

    // Create new user
    const uuid = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    await db.createUser(uuid, displayName, email, passwordHash);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uuid,
        displayName,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await db.getUserByEmail(identifier);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await db.updateLastLogin(user.uuid);

    res.json({
      message: 'Login successful',
      user: {
        uuid: user.uuid,
        displayName: user.display_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router; 