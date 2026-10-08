const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hash = await bcrypt.hash(password, 10);
  // Role is always faculty and status always pending, whatever the client sends
  await User.create({ name, email, password: hash, role: 'faculty', status: 'pending' });

  res.status(201).json({ message: 'Account created. Please wait for admin approval before logging in.' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide institutional email and password.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });

  if (user.status === 'pending') {
    return res.status(403).json({ message: 'Your account is awaiting admin approval.' });
  }
  if (user.status === 'rejected') {
    return res.status(403).json({ message: 'Your account request was rejected. Contact the administrator.' });
  }
  if (role && role !== user.role) {
    return res.status(403).json({ message: `This account is not registered as ${role}.` });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({
    token,
   user: { id: user._id, name: user.name, email: user.email, role: user.role, termsAccepted: user.termsAccepted }, 
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
const { _id, name, email, role, termsAccepted } = req.user;
res.json({ user: { id: _id, name, email, role, termsAccepted } });
});
// POST /api/auth/accept-terms
router.post('/accept-terms', requireAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { termsAccepted: true });
  res.json({ termsAccepted: true });
});
module.exports = router;