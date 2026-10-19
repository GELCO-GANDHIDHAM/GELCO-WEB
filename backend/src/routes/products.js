const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');

router.get('/', ctrl.getProducts);
router.get('/category/:categorySlug', ctrl.getProductsByCategory);
router.get('/:slug', ctrl.getProductBySlug);

module.exports = router;