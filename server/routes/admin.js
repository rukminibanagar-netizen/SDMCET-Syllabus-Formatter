const express = require('express');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/pending
router.get('/pending', async (req, res) => {
  const users = await User.find({ status: 'pending' }).select('-password').sort({ createdAt: 1 });
  res.json(users);
});

// PATCH /api/admin/users/:id/approve  or  /reject
router.patch('/users/:id/:action', async (req, res) => {
  const { id, action } = req.params;
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action.' });
  }
  const user = await User.findByIdAndUpdate(
    id,
    { status: action === 'approve' ? 'approved' : 'rejected' },
    { returnDocument: 'after' }
  ).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(user);
});

module.exports = router;