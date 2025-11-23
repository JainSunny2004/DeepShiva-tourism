const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { User, Notebook } = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../config/env');

/**
 * Google OAuth login
 */
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Google token required' });
    }

    // Verify Google token
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
    );

    const { email, name, picture, sub: googleId } = googleResponse.data;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
      });

      // Create default notebook
      const defaultNotebook = await Notebook.create({
        userId: user._id,
        title: 'My First Travel Chat',
      });

      user.notebooks.push(defaultNotebook._id);
      await user.save();
    } else {
      // Update existing user
      user.googleId = googleId;
      user.profilePicture = picture;
      user.lastActive = new Date();
      await user.save();
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        preferredLanguage: user.preferredLanguage,
        preferredPersona: user.preferredPersona,
      },
    });

  } catch (error) {
    console.error('❌ Google Auth Error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * Email/password registration
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Create default notebook
    const defaultNotebook = await Notebook.create({
      userId: user._id,
      title: 'My First Travel Chat',
    });

    user.notebooks.push(defaultNotebook._id);
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        preferredPersona: user.preferredPersona,
      },
    });

  } catch (error) {
    console.error('❌ Register Error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Email/password login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        preferredLanguage: user.preferredLanguage,
        preferredPersona: user.preferredPersona,
      },
    });

  } catch (error) {
    console.error('❌ Login Error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Get current user profile
 */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password').lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('❌ Get Profile Error:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
