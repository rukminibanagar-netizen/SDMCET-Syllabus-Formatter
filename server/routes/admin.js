const express = require('express');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { sendApprovalEmail } = require('../utils/mailer');

const router = express.Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/pending - List all pending registration requests
router.get('/pending', async (req, res) => {
  const users = await User.find({ status: 'pending' }).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// GET /api/admin/approved - List all approved faculty accounts
router.get('/approved', async (req, res) => {
  const users = await User.find({ role: 'faculty', status: 'approved' })
    .select('-password')
    .sort({ approvedAt: -1, updatedAt: -1 });
  res.json(users);
});

// PATCH /api/admin/users/:id/approve  or  /reject
router.patch('/users/:id/:action', async (req, res) => {
  const { id, action } = req.params;
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action.' });
  }

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (action === 'reject') {
    user.status = 'rejected';
    await user.save();
    return res.json({
      user: user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }),
      message: 'User request rejected.',
    });
  }

  // Action is approve:
  // 1. Mark account as approved first (guaranteeing approval succeeds)
  user.status = 'approved';
  user.approvedAt = new Date();
  await user.save();

  // 2. Attempt email notification
  let emailSent = false;
  let emailErrorMsg = '';
  try {
    await sendApprovalEmail(user);
    user.emailDeliveryStatus = 'sent';
    user.emailDeliveryError = '';
    emailSent = true;
  } catch (err) {
    console.error(`Approval email delivery failed for ${user.email}:`, err.message);
    user.emailDeliveryStatus = 'failed';
    user.emailDeliveryError = err.message || 'Email delivery failed.';
    emailErrorMsg = user.emailDeliveryError;
  }

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    user: userObj,
    emailDelivered: emailSent,
    emailError: emailErrorMsg,
    message: emailSent
      ? 'Account approved and notification email delivered successfully.'
      : 'Account approved successfully. Email delivery failed (user can still log in).',
  });
});

// POST /api/admin/users/:id/resend-email - Resend approval email
router.post('/users/:id/resend-email', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (user.status !== 'approved') {
    return res.status(400).json({ message: 'Cannot send approval email for non-approved account.' });
  }

  let emailSent = false;
  let errorMsg = '';
  try {
    await sendApprovalEmail(user);
    user.emailDeliveryStatus = 'sent';
    user.emailDeliveryError = '';
    emailSent = true;
  } catch (err) {
    console.error(`Resend approval email failed for ${user.email}:`, err.message);
    user.emailDeliveryStatus = 'failed';
    user.emailDeliveryError = err.message || 'Failed to deliver email.';
    errorMsg = user.emailDeliveryError;
  }

  await user.save();

  const userObj = user.toObject();
  delete userObj.password;

  res.json({
    success: emailSent,
    user: userObj,
    message: emailSent
      ? `Approval notification email sent successfully to ${user.email}.`
      : `Email delivery failed: ${errorMsg}`,
  });
});

module.exports = router;