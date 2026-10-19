require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately so health endpoint is always reachable
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
});

// Attempt MongoDB connection (non-blocking server start)
connectDB().catch((err) => {
  console.error(`⚠️  Running without MongoDB: ${err.message}`);
  console.error('   Update MONGODB_URI in server/.env to connect to your database.');
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
