const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/queryController');

router.post('/', ctrl.submitQuery);

module.exports = router;