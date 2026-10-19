const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const healthRouter     = require('./routes/health');
const categoriesRouter = require('./routes/categories');
const productsRouter   = require('./routes/products');
const queriesRouter    = require('./routes/queries');
const adminRouter      = require('./routes/admin');
const uploadRouter     = require('./routes/upload');
const galleryRouter    = require('./routes/gallery');
const settingsRouter   = require('./routes/settings');

const app = express();

app.use(helmet());

const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
const queryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
app.use('/api/', generalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/health',      healthRouter);
app.use('/api/categories',  categoriesRouter);
app.use('/api/products',    productsRouter);
app.use('/api/queries',     queryLimiter, queriesRouter);
app.use('/api/admin',       adminRouter);
app.use('/api/upload',      uploadRouter);
app.use('/api/gallery',     galleryRouter);
app.use('/api/settings',    settingsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;