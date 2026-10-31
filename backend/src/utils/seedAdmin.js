require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seed = async () => {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  const defaultAdmins = [
    {
      name: 'GELCO Admin',
      mobileNumber: (process.env.ADMIN_DEFAULT_MOBILE || '9824740023').trim(),
      password: process.env.ADMIN_DEFAULT_PASSWORD || 'Gelco@2024',
      role: 'superadmin',
    },
    {
      name: 'GELCO Admin',
      mobileNumber: '6351316337',
      password: 'Gelco@1010',
      role: 'admin',
    },
  ];

  for (const adminData of defaultAdmins) {
    const existing = await Admin.findOne({ mobileNumber: adminData.mobileNumber });
    if (existing) {
      console.log(`ℹ️  Admin already exists: ${adminData.mobileNumber}`);
    } else {
      await Admin.create(adminData);
      console.log(`✅ Created admin: ${adminData.mobileNumber}`);
    }
  }

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
