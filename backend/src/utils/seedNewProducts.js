require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('./slugify');

async function insertProducts() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // 1. Create or Find Category
  let category = await Category.findOne({ name: 'Earth Leakage Circuit Breakers' });
  if (!category) {
    category = await Category.create({
      name: 'Earth Leakage Circuit Breakers',
      slug: slugify('Earth Leakage Circuit Breakers'),
      description: 'High-sensitivity digital and heavy-duty Earth Leakage Circuit Breakers (ELCB) with MCB and MCCB integration for single and three-phase shock, fire, and neutral failure protection.',
      displayOrder: 1,
      isActive: true
    });
    console.log('Created Category:', category.name);
  } else {
    console.log('Found Category:', category.name);
  }

  // 2. Define Products
  const products = [
    {
      name: 'Gelco Digital ELCB Suraksha Plus 32A',
      model: 'GL-ELCB-DIGI-32A',
      category: category._id,
      shortDescription: 'Single-phase 32A digital earth leakage circuit breaker with integrated MCB, surge protection, digital volt/amp meter, and trip diagnosis display.',
      description: 'The Gelco Digital ELCB Suraksha Plus combines high-speed residual current protection with micro-controller intelligence. Operating on 230V AC single phase power, it isolates earth leakage faults in under 30 milliseconds with user-adjustable 3-50mA sensitivity. Integrated with high-breaking MCB overload protection, built-in surge protection, and a real-time digital Volt/Ampere display that indicates the precise reason for any electrical trip.',
      features: [
        'Tripping Time: <30 MS instantaneous response',
        'User Adjustable Leakage Sensitivity: 3 - 50 mA',
        'Integrated Digital Volt & Ampere Meter with live readout',
        'Reason for The Trip Will be Shown in the Display',
        'Built-in Surge Protection module',
        'By Pass Facility With Blinking LED Notification',
        'Overload Short Circuit Protection as Per MCB Capacity',
        'High Sensitivity Shock Protection'
      ],
      specifications: [
        { key: 'Load Current Rating', value: '32A' },
        { key: 'System Voltage', value: '230V AC, 1 Phase, 50 Hz' },
        { key: 'Tripping Time', value: '< 30 ms' },
        { key: 'Sensitivity', value: '3 - 50 mA' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Display Type', value: 'Digital Volt / Amp. Meter' },
        { key: 'Diagnostic Feature', value: 'Reason for The Trip Will be Shown in the Display' },
        { key: 'Bypass Facility', value: 'With Blinking LED Notification' },
        { key: 'Short Circuit Protection', value: 'As Per MCB Capacity' },
        { key: 'Surge Protection', value: 'Yes (With Built-in Surge Protection)' },
        { key: 'Protection Type', value: 'Earth Leakage, Overload, Short Circuit, Shock & Surge' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },
    {
      name: 'Gelco ELCB Suraksha 63A',
      model: 'GL-ELCB-SURAKSHA-63A',
      category: category._id,
      shortDescription: 'Heavy-duty single-phase 63A earth leakage circuit breaker with shunt-base MCB tripping, adjustable 3-50mA sensitivity, and bypass notification.',
      description: 'Engineered for residential complexes, commercial workshops, and heavy single-phase electrical installations, the Gelco ELCB Suraksha provides 63A continuous load capacity. Featuring an advanced shunt-base MCB tripping mechanism, it disconnects dangerous leakage currents in less than 30 milliseconds. Includes selectable 3-50mA trip sensitivity, overload and short-circuit protection, and a secure bypass switch with a blinking LED warning indicator.',
      features: [
        'High Capacity 63A continuous current rating',
        'Tripping Time: <30 MS instantaneous response',
        'Sensitivity Range: 3 - 50 mA',
        'Shunt Base MCB Tripping Mechanism',
        'By Pass Facility With Blinking LED Notification',
        'Overload Short Circuit Protection as Per MCB Capacity',
        'High Sensitivity Shock Protection'
      ],
      specifications: [
        { key: 'Load Current Rating', value: '63A' },
        { key: 'System Voltage', value: '230V AC, 1 Phase, 50 Hz' },
        { key: 'Tripping Time', value: '< 30 ms' },
        { key: 'Sensitivity', value: '3 - 50 mA' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Tripping Mechanism', value: 'Shunt Base MCB Tripping' },
        { key: 'Bypass Facility', value: 'With Blinking LED Notification' },
        { key: 'Short Circuit Protection', value: 'As Per MCB Capacity' },
        { key: 'Protection Type', value: 'Earth Leakage, Overload, Short Circuit & Shock' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },
    {
      name: 'Gelco ELCB Suraksha 2.0 Three Phase',
      model: 'GL-ELCB-SURAKSHA-3PH-63A',
      category: category._id,
      shortDescription: 'Industrial three-phase 415V earth leakage circuit breaker (32A/63A) with advanced neutral failure protection and shunt-base MCB tripping.',
      description: 'The Gelco ELCB Suraksha 2.0 Three Phase is built specifically for 3-phase commercial and industrial facilities operating on 415V AC. It safeguards both expensive machinery and personnel with high-speed earth leakage sensing at 100mA. Features an Advanced Neutral Failure Protection facility that prevents severe over-voltage appliance burnouts caused by loose or broken incoming neutral lines. Equipped with positive shunt-base MCB trip and a secure bypass mode with blinking LED warning.',
      features: [
        'Advanced Neutral Failure Protection Facility',
        'Load Current Rating: 32A / 63A 3-Phase',
        'Tripping Sensitivity: 100 mA',
        'Shunt Base MCB Tripping Mechanism',
        'Overload Shock Protection',
        'By Pass Facility With Blinking LED Notification',
        'Full 3-Phase + Neutral Protection'
      ],
      specifications: [
        { key: 'Load Current Rating', value: '32A / 63A' },
        { key: 'System Voltage', value: '415V AC, 3 Phase, 50 Hz' },
        { key: 'Sensitivity', value: '100 mA' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Neutral Protection', value: 'Advanced Neutral Failure Protection Facility' },
        { key: 'Tripping Mechanism', value: 'Shunt Base MCB Tripping' },
        { key: 'Bypass Facility', value: 'With Blinking LED Notification' },
        { key: 'Overload Protection', value: 'Overload Shock Protection' },
        { key: 'Protection Type', value: 'Earth Leakage, Neutral Failure, Overload, Short Circuit & Shock' }
      ],
      images: [],
      displayOrder: 3,
      isActive: true
    },
    {
      name: 'Gelco EL+MCCB Suraksha Plus Three Phase',
      model: 'GL-EL-MCCB-SURAKSHA-PLUS',
      category: category._id,
      shortDescription: 'Heavy industrial 3-phase EL+MCCB panel (100A-200A) with digital volt/amp meter, settable leakage current (30mA-5A), and trip reason display.',
      description: 'Engineered for large factories, commercial buildings, multi-story complexes, and heavy machinery, the Gelco EL+MCCB Suraksha Plus incorporates an industrial Molded Case Circuit Breaker (MCCB) with micro-controlled earth leakage sensing. Offers high current handling up to 200A, user-settable leakage current thresholds from 30mA up to 5A, integrated digital Volt & Ampere metering, and clear fault diagnostic display showing the exact cause of any electrical trip.',
      features: [
        'Heavy Industrial Load Current Ratings: 100A / 125AMP / 160AMP / 200AMP',
        'Leakage Current Settable: 30 to 999mA / 100mA-2A / 150mA-3A / 300mA-3A / 500mA-5A',
        'Integrated Digital Volt / Amp Meter',
        'Reason for The Trip Will be Shown in the Display',
        'Advanced Neutral Failure Protection Facility',
        'Overload Short Circuit Protection as Per MCB Capacity',
        'By Pass Facility',
        'Comprehensive Shock Protection'
      ],
      specifications: [
        { key: 'Load Current Rating', value: '100A / 125A / 160A / 200A' },
        { key: 'System Voltage', value: '415V AC, 3 Phase, 50 Hz' },
        { key: 'Sensitivity (Base)', value: '100 mA' },
        { key: 'Leakage Current Settable', value: '30 to 999mA / 100mA-2A / 150mA-3A / 300mA-3A / 500mA-5A' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Display Type', value: 'Digital Volt / Amp Meter' },
        { key: 'Trip Reason Diagnosis', value: 'Reason for The Trip Will be Shown in the Display' },
        { key: 'Neutral Protection', value: 'Advanced Neutral Failure Protection Facility' },
        { key: 'Bypass Facility', value: 'Yes' },
        { key: 'Overload Protection', value: 'Overload Short Circuit Protection as Per MCB Capacity' },
        { key: 'Breaker Type', value: 'Heavy-Duty Molded Case Circuit Breaker (MCCB)' }
      ],
      images: [],
      displayOrder: 4,
      isActive: true
    }
  ];

  for (const item of products) {
    const slug = slugify(item.name);
    const existing = await Product.findOne({ slug });
    if (existing) {
      await Product.findByIdAndUpdate(existing._id, { ...item, slug });
      console.log('Updated:', item.name);
    } else {
      await Product.create({ ...item, slug });
      console.log('Created:', item.name);
    }
  }

  const catCount = await Category.countDocuments();
  const prodCount = await Product.countDocuments();
  console.log('Database now has:', catCount, 'categories,', prodCount, 'products.');
  process.exit(0);
}

insertProducts().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
