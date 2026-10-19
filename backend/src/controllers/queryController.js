const Query = require('../models/Query');

exports.submitQuery = async (req, res, next) => {
  try {
    const { name, mobile, email, question } = req.body;
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
    if (!mobile) {
      errors.push('Mobile number is required.');
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      errors.push('Please enter a valid 10-digit Indian mobile number.');
    }
    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }
    if (!question || question.trim().length < 10) errors.push('Question must be at least 10 characters.');

    if (errors.length > 0) return res.status(400).json({ success: false, message: errors.join(' '), errors });

    const query = await Query.create({
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim().toLowerCase() : '',
      question: question.trim(),
    });
    res.status(201).json({ success: true, message: 'Your query has been submitted successfully.', data: { id: query._id } });
  } catch (err) {
    next(err);
  }
};

exports.adminGetQueries = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: 0, total: 0, data: [] });
    }
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && ['new', 'in-progress', 'resolved'].includes(status)) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Query.countDocuments(filter);
    const queries = await Query.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).select('-__v');
    res.json({ success: true, count: queries.length, total, data: queries });
  } catch (err) {
    next(err);
  }
};

exports.adminGetQuery = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id).select('-__v');
    if (!query) return res.status(404).json({ success: false, message: 'Query not found.' });
    res.json({ success: true, data: query });
  } catch (err) {
    next(err);
  }
};

exports.adminUpdateQuery = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;
    const validStatuses = ['new', 'in-progress', 'resolved'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status value.' });
    
    const updateData = {};
    if (status) updateData.status = status;
    if (adminResponse !== undefined) updateData.adminResponse = adminResponse;
    if (status === 'resolved' && adminResponse) updateData.respondedAt = new Date();
    
    const query = await Query.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-__v');
    if (!query) return res.status(404).json({ success: false, message: 'Query not found.' });
    res.json({ success: true, data: query });
  } catch (err) {
    next(err);
  }
};