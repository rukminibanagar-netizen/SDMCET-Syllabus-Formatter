const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    department: { type: String, trim: true, default: '' },
    role: { type: String, enum: ['faculty', 'admin'], default: 'faculty' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    termsAccepted: { type: Boolean, default: false },
    emailDeliveryStatus: {
      type: String,
      enum: ['not_sent', 'sent', 'failed'],
      default: 'not_sent',
    },
    emailDeliveryError: { type: String, default: '' },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);