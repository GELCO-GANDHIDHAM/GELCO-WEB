const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    label: {
      type: String,
      default: 'Mobile',
      trim: true,
    },
    isWhatsApp: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const companySettingsSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      trim: true,
      default: 'D7, Nilesh Park, Plot No. 80, Near Ganesh Juice Corner, Sector-8, Gandhidham',
    },
    city: {
      type: String,
      trim: true,
      default: 'Gandhidham, Gujarat',
    },
    locationUrl: {
      type: String,
      trim: true,
      default: 'https://maps.google.com/?q=Sector+8+Gandhidham+Gujarat',
    },
    email: {
      type: String,
      trim: true,
      default: 'gelcopluselectricals@gmail.com',
    },
    phones: {
      type: [phoneSchema],
      default: [
        {
          number: '9824740023',
          label: 'Primary / Paresh Patel',
          isWhatsApp: true,
        },
      ],
    },
    tagline: {
      type: String,
      trim: true,
      default: 'Reliable Electrical Solutions for Every Requirement',
    },
    contactPerson: {
      type: String,
      trim: true,
      default: 'Paresh Bhai Patel',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CompanySettings', companySettingsSchema);
