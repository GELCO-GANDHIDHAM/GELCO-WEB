const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const settingsCtrl = require('../controllers/settingsController');

// Public route to fetch settings (for Footer, Contact page, etc.)
router.get('/', settingsCtrl.getSettings);

// Protected admin route to update settings
router.put('/', protect, settingsCtrl.updateSettings);

module.exports = router;
