const CompanySettings = require('../models/CompanySettings');

// GET /api/settings (Public - for Footer, Contact, etc.)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({
        address: 'D7, Nilesh Park, Plot No. 80, Near Ganesh Juice Corner, Sector-8, Gandhidham',
        city: 'Gandhidham, Gujarat',
        locationUrl: 'https://maps.google.com/?q=Sector+8+Gandhidham+Gujarat',
        email: 'gelcopluselectricals@gmail.com',
        phones: [
          {
            number: '9824740023',
            label: 'Primary / Paresh Patel',
            isWhatsApp: true,
          },
        ],
        tagline: 'Reliable Electrical Solutions for Every Requirement',
        contactPerson: 'Paresh Bhai Patel',
      });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings (Admin Protected)
exports.updateSettings = async (req, res, next) => {
  try {
    const { address, city, locationUrl, email, phones, tagline, contactPerson } = req.body;

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings();
    }

    if (address !== undefined) settings.address = address.trim();
    if (city !== undefined) settings.city = city.trim();
    if (locationUrl !== undefined) settings.locationUrl = locationUrl.trim();
    if (email !== undefined) settings.email = email.trim();
    if (tagline !== undefined) settings.tagline = tagline.trim();
    if (contactPerson !== undefined) settings.contactPerson = contactPerson.trim();

    if (Array.isArray(phones)) {
      settings.phones = phones
        .filter((p) => p && p.number && p.number.trim())
        .map((p) => ({
          number: p.number.trim(),
          label: (p.label || 'Mobile').trim(),
          isWhatsApp: Boolean(p.isWhatsApp),
        }));
    }

    await settings.save();
    res.json({
      success: true,
      message: 'Footer and contact settings updated successfully.',
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};
