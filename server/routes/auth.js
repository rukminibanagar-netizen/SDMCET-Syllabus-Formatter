const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password, department } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hash = await bcrypt.hash(password, 10);
  // Role is always faculty and status always pending for new signups
  await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hash,
    department: department ? department.trim() : '',
    role: 'faculty',
    status: 'pending',
    emailDeliveryStatus: 'not_sent',
  });

  res.status(201).json({
    status: 'pending',
    message: 'Account created successfully. Your account is awaiting administrator approval before you can log in.',
  });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide institutional email and password.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });

  if (user.status === 'pending') {
    return res.status(403).json({
      status: 'pending',
      message: 'Your account is awaiting administrator approval. You will receive an email once approved.',
    });
  }
  if (user.status === 'rejected') {
    return res.status(403).json({
      status: 'rejected',
      message: 'Your account request was rejected by the administrator. Contact rukminibanagar@gmail.com for assistance.',
    });
  }
  if (role && role !== user.role) {
    return res.status(403).json({ message: `This account is not registered as ${role}.` });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      termsAccepted: user.termsAccepted,
    },
  });
});

// POST /api/auth/check-status
router.post('/check-status', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Institutional email is required.' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('-password');
  if (!user) {
    return res.status(404).json({
      exists: false,
      status: 'not_found',
      message: 'No registered account found with this institutional email address.',
    });
  }

  res.json({
    exists: true,
    name: user.name,
    email: user.email,
    department: user.department || '',
    role: user.role,
    status: user.status,
    emailDeliveryStatus: user.emailDeliveryStatus || 'not_sent',
    createdAt: user.createdAt,
    approvedAt: user.approvedAt,
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