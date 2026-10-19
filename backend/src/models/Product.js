const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const specificationSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url:      { type: String, required: true },
    publicId: { type: String, default: '' },
    alt:      { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    model: {
      type: String,
      trim: true,
      default: '',
      maxlength: [100, 'Model number cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: [specificationSchema],
    images: [imageSchema],
    displayOrder: {
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

const buildSlug = (name, model) => {
  const base = model ? `${name}-${model}` : name;
  return slugify(base);
};

productSchema.pre('save', function () {
  if (this.isModified('name') || this.isModified('model') || !this.slug) {
    this.slug = buildSlug(this.name, this.model);
  }
});

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isActive: 1, displayOrder: 1 });
productSchema.index({ name: 'text', model: 'text', shortDescription: 'text' });

module.exports = mongoose.model('Product', productSchema);