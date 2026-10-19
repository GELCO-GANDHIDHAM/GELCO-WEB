const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('../utils/slugify');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 })
      .select('-__v');
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true }).select('-__v');
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.adminGetCategories = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: 0, data: [] });
    }
    const categories = await Category.find().sort({ displayOrder: 1, name: 1 }).select('-__v').lean();
    
    // Add product counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return { ...cat, productCount };
      })
    );

    res.json({ success: true, count: categoriesWithCount.length, data: categoriesWithCount });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, displayOrder, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    
    const cleanName = name.trim();
    const slug = slugify(cleanName);
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists.' });
    }
    
    const category = await Category.create({ 
      name: cleanName, 
      description: description || '', 
      displayOrder: displayOrder || 0, 
      isActive: isActive !== undefined ? Boolean(isActive) : true 
    });
    
    res.status(201).json({ success: true, data: category, message: 'Category created successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, displayOrder, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (name && name.trim()) {
      category.name = name.trim();
      category.slug = slugify(name.trim());
    }
    if (description !== undefined) category.description = description;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    const previousStatus = category.isActive;
    if (isActive !== undefined) {
      category.isActive = Boolean(isActive);
    }

    await category.save();

    // When hide the category, also hide all products in this category
    if (isActive !== undefined && Boolean(isActive) !== previousStatus) {
      const newStatus = Boolean(isActive);
      await Product.updateMany({ category: category._id }, { isActive: newStatus });
    }

    res.json({ 
      success: true, 
      data: category,
      message: isActive === false 
        ? 'Category and all associated products are now hidden.' 
        : 'Category updated successfully.' 
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

    // Optional: Also hide or unassign products in this category
    await Product.updateMany({ category: category._id }, { isActive: false });
    await Category.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    next(err);
  }
};