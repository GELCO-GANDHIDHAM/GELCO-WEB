const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { cloudinary, upload } = require('../utils/cloudinary');

router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'gelco_products',
      resource_type: 'auto',
    });

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      }
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/', protect, async (req, res, next) => {
  try {
    const publicId = req.query.publicId || req.body?.publicId;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'No public ID provided' });
    }
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image removed from Cloudinary' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;