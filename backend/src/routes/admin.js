const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const adminCtrl    = require('../controllers/adminController');
const categoryCtrl = require('../controllers/categoryController');
const productCtrl  = require('../controllers/productController');
const queryCtrl    = require('../controllers/queryController');

router.post('/login', adminCtrl.login);
router.post('/reset-password', adminCtrl.resetPassword);
router.use(protect);

router.get('/dashboard', adminCtrl.getDashboard);

router.get('/categories',     categoryCtrl.adminGetCategories);
router.post('/categories',    categoryCtrl.createCategory);
router.put('/categories/:id', categoryCtrl.updateCategory);
router.delete('/categories/:id', categoryCtrl.deleteCategory);

router.get('/products',      productCtrl.adminGetProducts);
router.post('/products',     productCtrl.createProduct);
router.put('/products/:id',  productCtrl.updateProduct);
router.delete('/products/:id', productCtrl.deleteProduct);

router.get('/queries',      queryCtrl.adminGetQueries);
router.get('/queries/:id',  queryCtrl.adminGetQuery);
router.put('/queries/:id',  queryCtrl.adminUpdateQuery);

module.exports = router;