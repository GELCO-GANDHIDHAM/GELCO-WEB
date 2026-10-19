const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('⚠️  MONGODB_URI is not defined in environment variables.');
    return;
  }

  const tryConnect = async (attempt = 1) => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
      console.error(`⚠️  MongoDB connection attempt ${attempt} failed: ${err.message}`);
      if (mongoose.connection.readyState !== 1) {
        const delay = Math.min(attempt * 5000, 30000);
        console.log(`   Retrying connection in ${delay / 1000}s...`);
        setTimeout(() => tryConnect(attempt + 1), delay);
      }
    }
  };

  await tryConnect();
};

module.exports = connectDB;

