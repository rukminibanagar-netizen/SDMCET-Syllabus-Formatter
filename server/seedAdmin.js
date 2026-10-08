require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');

const [name, email, password] = process.argv.slice(2);
if (!name || !email || !password) {
  console.log('Usage: node seedAdmin.js "Full Name" email password');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name, email: email.toLowerCase(), password: hash, role: 'admin', status: 'approved' },
    { upsert: true }
  );
  console.log('Admin ready:', email);
  process.exit(0);
})();