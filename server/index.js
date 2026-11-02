require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
// Websites allowed to call this API. Local development is always allowed;
// add your deployed site (for example your Vercel URL) in the CLIENT_URL environment
// variable. Several addresses can be separated with commas.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
];
app.use(
  cors({
    origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)),
  })
);
// A full syllabus can be a few hundred KB, so allow bigger request bodies than the 100 KB default
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.send('SDMCET Syllabus Formatter API is running.'));
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/syllabi', require('./routes/syllabi'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error.' });
});

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing environment variables: MONGO_URI and JWT_SECRET must both be set.');
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function ensureDefaultAdmin() {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'rukminibanagar@gmail.com').toLowerCase();
    const adminPass = process.env.ADMIN_EMAIL_PASS || 'sdmcetAdmin2014';
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      const hash = await bcrypt.hash(adminPass, 10);
      await User.create({
        name: 'SDMCET Administrator',
        email: adminEmail,
        password: hash,
        role: 'admin',
        status: 'approved',
      });
      console.log('Admin user initialized:', adminEmail);
    }
  } catch (e) {
    console.error('Error checking admin user:', e.message);
  }
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await ensureDefaultAdmin();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });