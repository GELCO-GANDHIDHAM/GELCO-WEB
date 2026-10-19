const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('../utils/slugify');

const buildUniqueSlug = async (name, model, excludeId = null) => {
  const base = model ? `${name}-${model}` : name;
  let slug = slugify(base);
  let existing = await Product.findOne({ slug, _id: { $ne: excludeId } });
  let counter = 1;
  while (existing) {
    slug = `${slugify(base)}-${counter}`;
    existing = await Product.findOne({ slug, _id: { $ne: excludeId } });
    counter++;
  }
  return slug;
};

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    // Get all active categories to ensure products in hidden categories are never shown publicly
    const activeCats = await Category.find({ isActive: true }).select('_id');
    const activeCatIds = activeCats.map(c => c._id);

    if (category) {
      const cat = await Category.findOne({ slug: category, isActive: true });
      if (!cat) {
        return res.json({ success: true, count: 0, total: 0, page: Number(page), pages: 0, data: [] });
      }
      filter.category = cat._id;
    } else {
      filter.category = { $in: activeCatIds };
    }

    if (search && search.trim()) {
      const trimmed = search.trim();
      const sanitized = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const words = trimmed.split(/\s+/).filter(Boolean);
      const multiWordPattern = words.length > 1 ? words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') : sanitized;

      // Find active categories matching the search query
      const matchedCats = await Category.find({
        name: { $regex: sanitized, $options: 'i' },
        isActive: true
      }).select('_id');
      const matchedCatIds = matchedCats.map(c => c._id);

      filter.$or = [
        { name: { $regex: multiWordPattern, $options: 'i' } },
        { model: { $regex: sanitized, $options: 'i' } },
        { shortDescription: { $regex: sanitized, $options: 'i' } },
        { category: { $in: matchedCatIds } },
        { 'specifications.value': { $regex: sanitized, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug isActive')
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    res.json({ success: true, count: products.length, total, page: Number(page), pages: Math.ceil(total / Number(limit)), data: products });
  } catch (err) {
    next(err);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug isActive')
      .select('-__v');
    if (!product || (product.category && product.category.isActive === false)) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.categorySlug, isActive: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    const products = await Product.find({ category: category._id, isActive: true }).populate('category', 'name slug').sort({ displayOrder: 1, createdAt: -1 }).select('-__v');
    res.json({ success: true, count: products.length, category, data: products });
  } catch (err) {
    next(err);
  }
};

exports.adminGetProducts = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: 0, total: 0, data: [] });
    }
    const { search, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search && search.trim()) {
      const trimmed = search.trim();
      const sanitized = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const words = trimmed.split(/\s+/).filter(Boolean);
      const multiWordPattern = words.length > 1 ? words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') : sanitized;

      filter.$or = [
        { name: { $regex: multiWordPattern, $options: 'i' } },
        { model: { $regex: sanitized, $options: 'i' } },
        { shortDescription: { $regex: sanitized, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).populate('category', 'name slug').sort({ displayOrder: 1, createdAt: -1 }).skip(skip).limit(Number(limit)).select('-__v');
    res.json({ success: true, count: products.length, total, data: products });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      model,
      category,
      shortDescription,
      description,
      features,
      specifications,
      images,
      displayOrder,
      isActive,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Product name and category are required.' });
    }

    const slug = await buildUniqueSlug(name, model);
    const product = await Product.create({
      name,
      model: model || '',
      slug,
      category,
      shortDescription: shortDescription || '',
      description: description || '',
      features: Array.isArray(features) ? features.filter(f => f && f.trim()) : [],
      specifications: Array.isArray(specifications) ? specifications.filter(s => s && s.key && s.value) : [],
      images: Array.isArray(images) ? images : [],
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });
    const populated = await product.populate('category', 'name slug');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      model,
      category,
      shortDescription,
      description,
      features,
      specifications,
      images,
      displayOrder,
      isActive,
    } = req.body;

    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (description !== undefined) updateData.description = description;
    if (features !== undefined) updateData.features = Array.isArray(features) ? features.filter(f => f && f.trim()) : [];
    if (specifications !== undefined) updateData.specifications = Array.isArray(specifications) ? specifications.filter(s => s && s.key && s.value) : [];
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];
    if (displayOrder !== undefined) updateData.displayOrder = Number(displayOrder);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (name !== undefined) updateData.name = name;
    if (model !== undefined) updateData.model = model;

    if (name !== undefined || model !== undefined) {
      const product = await Product.findById(req.params.id);
      if (product) {
        const newName  = name  !== undefined ? name  : product.name;
        const newModel = model !== undefined ? model : product.model;
        updateData.slug = await buildUniqueSlug(newName, newModel, req.params.id);
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Clean up images from Cloudinary in background
    if (product.images && product.images.length > 0) {
      const { cloudinary } = require('../utils/cloudinary');
      for (const img of product.images) {
        if (img.publicId) {
          cloudinary.uploader.destroy(img.publicId).catch(() => {});
        }
      }
    }

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    next(err);
  }
};