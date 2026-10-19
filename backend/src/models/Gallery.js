const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: '',
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: String,
      trim: true,
      default: 'Showcase',
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    image: {
      url: {
        type: String,
        required: [true, 'Image URL is required'],
      },
      publicId: {
        type: String,
        default: '',
      },
      alt: {
        type: String,
        default: 'Gelco Gallery Photo',
      },
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gallery', gallerySchema);
