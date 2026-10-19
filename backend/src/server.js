require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Auto Keep-Alive service to prevent Render 15-minute inactivity spin-down (same as Mitra-Mandal)
const startKeepAlive = () => {
  const rawUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL || process.env.SERVER_URL;
  if (!rawUrl) {
    return;
  }

  const cleanUrl = rawUrl.replace(/\/+$/, '');
  const targetUrl = cleanUrl.endsWith('/api') ? `${cleanUrl}/health` : `${cleanUrl}/api/health`;
  const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

  const pingServer = async () => {
    try {
      if (typeof fetch === 'function') {
        const res = await fetch(targetUrl);
        if (res.ok) {
          console.log(`[KEEP-ALIVE] Pinged ${targetUrl} (Status: ${res.status}) at ${new Date().toLocaleTimeString()}`);
        } else {
          console.warn(`[KEEP-ALIVE] Ping status: ${res.status}`);
        }
      }
    } catch (err) {
      console.warn('[KEEP-ALIVE] Ping notice:', err.message);
    }
  };

  // Ping shortly after startup (1 minute), then every 10 minutes
  setTimeout(pingServer, 60 * 1000);
  setInterval(pingServer, INTERVAL_MS);
  console.log(`[KEEP-ALIVE] Active: pinging ${targetUrl} every 10 minutes`);
};

// Start HTTP server immediately so health endpoint is always reachable
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  startKeepAlive();
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
