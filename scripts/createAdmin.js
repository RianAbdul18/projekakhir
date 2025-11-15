require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin sudah ada: admin / admin123');
      process.exit(0);
    }
    const admin = new User({ username: 'admin', password: 'admin123' });
    await admin.save();
    console.log('Admin dibuat!');
    console.log('Username: admin');
    console.log('Password: admin123 (GANTI SEGERA!)');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
