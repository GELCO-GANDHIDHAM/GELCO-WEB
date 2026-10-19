const Gallery = require('../models/Gallery');
const { cloudinary } = require('../utils/cloudinary');

const DEFAULT_GALLERY = [
  {
    title: 'Smart Industrial Switchgear & Controllers',
    category: 'Engineering Showcase',
    image: {
      url: '/images/showcase-pc.png',
      publicId: '',
      alt: 'Smart Industrial Switchgear & Controllers',
    },
    order: 1,
  },
  {
    title: 'Complete Industrial & Agricultural Range',
    category: 'Product Lineup',
    image: {
      url: '/images/showcase-mobile.png',
      publicId: '',
      alt: 'Complete Industrial & Agricultural Range',
    },
    order: 2,
  },
  {
    title: 'Motor Starters & Control Panels',
    category: 'Heavy-Duty Starters',
    image: {
      url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409890/gelco_products/zxhfvl9tbnxnn2x76xqh.jpg',
      publicId: 'gelco_products/zxhfvl9tbnxnn2x76xqh',
      alt: 'Motor Starters & Control Panels',
    },
    order: 3,
  },
  {
    title: 'High-Sensitivity Earth Leakage Circuit Breakers',
    category: 'ELCB Protection',
    image: {
      url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409887/gelco_products/yvja98elpsgvfjisapvj.png',
      publicId: 'gelco_products/yvja98elpsgvfjisapvj',
      alt: 'High-Sensitivity Earth Leakage Circuit Breakers',
    },
    order: 4,
  },
  {
    title: 'Electronic Speed Regulators & Automation',
    category: 'Controllers & Timers',
    image: {
      url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409889/gelco_products/lttfvrgnw0lphnaudmau.png',
      publicId: 'gelco_products/lttfvrgnw0lphnaudmau',
      alt: 'Electronic Speed Regulators & Automation',
    },
    order: 5,
  },
  {
    title: 'Automatic Voltage Stabilizers & Relays',
    category: 'Power Protection',
    image: {
      url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409888/gelco_products/ixpxvzuodelxj3xd8aue.png',
      publicId: 'gelco_products/ixpxvzuodelxj3xd8aue',
      alt: 'Automatic Voltage Stabilizers & Relays',
    },
    order: 6,
  },
];

// @desc    Get all active gallery photos (public)
// @route   GET /api/gallery
exports.getGalleryPhotos = async (req, res, next) => {
  try {
    let photos = await Gallery.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    // Auto-seed if empty
    if (!photos || photos.length === 0) {
      await Gallery.insertMany(DEFAULT_GALLERY);
      photos = await Gallery.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    }

    res.json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gallery photos (admin)
// @route   GET /api/gallery/admin
exports.getAdminGalleryPhotos = async (req, res, next) => {
  try {
    let photos = await Gallery.find().sort({ order: 1, createdAt: -1 });

    if (!photos || photos.length === 0) {
      await Gallery.insertMany(DEFAULT_GALLERY);
      photos = await Gallery.find().sort({ order: 1, createdAt: -1 });
    }

    res.json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new gallery photo
// @route   POST /api/gallery
exports.createGalleryPhoto = async (req, res, next) => {
  try {
    const { title, category, image, order, isActive } = req.body;

    if (!image || !image.url) {
      return res.status(400).json({
        success: false,
        message: 'Photo image URL is required',
      });
    }

    const photo = await Gallery.create({
      title: title || '',
      category: category || 'Showcase',
      image: {
        url: image.url,
        publicId: image.publicId || '',
        alt: image.alt || title || 'Gelco Gallery Photo',
      },
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      data: photo,
      message: 'Photo added to gallery successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery photo
// @route   PUT /api/gallery/:id
exports.updateGalleryPhoto = async (req, res, next) => {
  try {
    const { title, category, order, isActive, image } = req.body;
    const photo = await Gallery.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Gallery photo not found',
      });
    }

    if (title !== undefined) photo.title = title;
    if (category !== undefined) photo.category = category;
    if (order !== undefined) photo.order = Number(order);
    if (isActive !== undefined) photo.isActive = Boolean(isActive);
    if (image && image.url) {
      photo.image = {
        url: image.url,
        publicId: image.publicId || photo.image?.publicId || '',
        alt: image.alt || photo.image?.alt || 'Gelco Gallery Photo',
      };
    }

    await photo.save();

    res.json({
      success: true,
      data: photo,
      message: 'Photo updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery photo
// @route   DELETE /api/gallery/:id
exports.deleteGalleryPhoto = async (req, res, next) => {
  try {
    const photo = await Gallery.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Gallery photo not found',
      });
    }

    // If image has publicId on Cloudinary, delete it from Cloudinary
    if (photo.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(photo.image.publicId);
      } catch (cloudErr) {
        console.error('Failed to remove image from Cloudinary:', cloudErr);
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Photo deleted from gallery successfully',
    });
  } catch (error) {
    next(error);
  }
};
