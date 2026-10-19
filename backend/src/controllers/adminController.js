const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Query = require('../models/Query');
const Gallery = require('../models/Gallery');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// In-memory dev fallback when MongoDB is not connected
let devAdminPassword = null;

exports.login = async (req, res, next) => {
  try {
    const { mobileNumber, mobile, password } = req.body;
    const targetMobile = (mobileNumber || mobile || '').toString().trim();

    if (!targetMobile || !password) {
      return res.status(400).json({ success: false, message: 'Mobile number and password are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const admin = await Admin.findOne({ mobileNumber: targetMobile }).select('+password');
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid mobile number or password.' });
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid mobile number or password.' });
      }

      const token = signToken(admin._id);
      return res.json({
        success: true,
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          mobileNumber: admin.mobileNumber,
          role: admin.role,
        },
      });
    }

    // Dev mode fallback when MongoDB is disconnected
    const defaultMobile = (process.env.ADMIN_DEFAULT_MOBILE || '9824740023').trim();
    const currentPassword = devAdminPassword || process.env.ADMIN_DEFAULT_PASSWORD || 'Gelco@2024';

    if (targetMobile !== defaultMobile || password !== currentPassword) {
      return res.status(401).json({ success: false, message: 'Invalid mobile number or password.' });
    }

    const token = signToken('dev_admin_id');
    return res.json({
      success: true,
      token,
      admin: {
        id: 'dev_admin_id',
        name: 'GELCO Admin',
        mobileNumber: defaultMobile,
        role: 'superadmin',
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { mobileNumber, mobile, secretCode, newPassword } = req.body;
    const targetMobile = (mobileNumber || mobile || '').toString().trim();
    const code = (secretCode || '').toString().trim();

    if (!targetMobile || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number, 6-digit secret code, and new password are required.',
      });
    }

    const validSecretCode = (process.env.ADMIN_RESET_CODE || '101005').trim();
    if (code !== validSecretCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid secret code. Please enter the correct 6-digit secret code.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const admin = await Admin.findOne({ mobileNumber: targetMobile });
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'No admin account found with this mobile number.',
        });
      }

      admin.password = newPassword;
      await admin.save();

      return res.json({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
      });
    }

    // Dev mode fallback when MongoDB is disconnected
    const defaultMobile = (process.env.ADMIN_DEFAULT_MOBILE || '9824740023').trim();
    if (targetMobile !== defaultMobile) {
      return res.status(404).json({
        success: false,
        message: 'No admin account found with this mobile number.',
      });
    }

    devAdminPassword = newPassword;
    return res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) {
    next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          metrics: {
            totalProducts: 0,
            activeProducts: 0,
            hiddenProducts: 0,
            totalCategories: 0,
            activeCategories: 0,
            hiddenCategories: 0,
            totalQueries: 0,
            newQueries: 0,
            pendingQueries: 0,
            totalGallery: 0,
          },
          recentProducts: [],
          recentQueries: [],
          categoriesOverview: [],
        },
      });
    }

    const [
      totalProducts,
      activeProducts,
      totalCategories,
      activeCategories,
      totalQueries,
      newQueries,
      pendingQueries,
      totalGallery,
      recentProducts,
      recentQueries,
      categories,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Category.countDocuments({ isActive: true }),
      Query.countDocuments(),
      Query.countDocuments({ status: 'new' }),
      Query.countDocuments({ status: { $in: ['new', 'in-progress'] } }),
      Gallery.countDocuments(),
      Product.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name model category images isActive createdAt'),
      Query.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name mobileNumber productInterest status createdAt message'),
      Category.find().sort({ displayOrder: 1, name: 1 }).select('name slug isActive').lean(),
    ]);

    const categoriesOverview = await Promise.all(
      categories.slice(0, 6).map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return { ...cat, productCount: count };
      })
    );

    res.json({
      success: true,
      data: {
        metrics: {
          totalProducts,
          activeProducts,
          hiddenProducts: totalProducts - activeProducts,
          totalCategories,
          activeCategories,
          hiddenCategories: totalCategories - activeCategories,
          totalQueries,
          newQueries,
          pendingQueries,
          totalGallery,
        },
        recentProducts,
        recentQueries,
        categoriesOverview,
      },
    });
  } catch (err) {
    next(err);
  }
};