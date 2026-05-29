const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // 2. Check for existing user
    let user = await db.users.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save user
    const newUser = await db.users.create({
      name,
      email,
      password: hashedPassword
    });

    // 5. Create token
    const payload = {
      user: {
        id: newUser._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'planiq_secret_auth_token_for_user_sessions_2026',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Simple validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // 2. Find user
    const user = await db.users.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 4. Create token
    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'planiq_secret_auth_token_for_user_sessions_2026',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server Error');
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error('Fetch profile error:', err.message);
    res.status(500).send('Server Error');
  }
};
