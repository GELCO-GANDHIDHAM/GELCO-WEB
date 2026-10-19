const express = require('express');
const router = express.Router();
const {
  getGalleryPhotos,
  getAdminGalleryPhotos,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

router.get('/', getGalleryPhotos);
router.get('/admin', protect, getAdminGalleryPhotos);
router.post('/', protect, createGalleryPhoto);
router.put('/:id', protect, updateGalleryPhoto);
router.delete('/:id', protect, deleteGalleryPhoto);

module.exports = router;
