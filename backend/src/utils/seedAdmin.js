require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seed = async () => {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  const defaultMobile = (process.env.ADMIN_DEFAULT_MOBILE || '9824740023').trim();
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Gelco@2024';

  const existing = await Admin.findOne({ mobileNumber: defaultMobile });
  if (existing) {
    console.log('ℹ️  Admin already exists — no changes made.');
    console.log(`   Mobile  : ${defaultMobile}`);
    process.exit(0);
  }

  await Admin.create({
    name:         'GELCO Admin',
    mobileNumber: defaultMobile,
    password:     defaultPassword,
    role:         'superadmin',
  });

  console.log('');
  console.log('✅ Admin account created!');
  console.log(`   Mobile  : ${defaultMobile}`);
  console.log(`   Password: ${defaultPassword}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change this password after first login!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
