require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('./slugify');

async function insertBatch3() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // 1. Create or Find Categories
  let ovpCategory = await Category.findOne({ name: 'Over Voltage Protectors' });
  if (!ovpCategory) {
    ovpCategory = await Category.create({
      name: 'Over Voltage Protectors',
      slug: slugify('Over Voltage Protectors'),
      description: 'Programmable microprocessor over and under voltage protectors with digital metering, overload protection, and cyclic automation.',
      displayOrder: 4,
      isActive: true
    });
    console.log('Created Category: Over Voltage Protectors');
  } else {
    console.log('Found Category: Over Voltage Protectors');
  }

  let timerCategory = await Category.findOne({ name: 'Timers' });
  if (!timerCategory) {
    timerCategory = await Category.create({
      name: 'Timers',
      slug: slugify('Timers'),
      description: 'Microcontroller programmable digital time switches, astronomical street light timers, and dual air conditioner cyclic control panels.',
      displayOrder: 5,
      isActive: true
    });
    console.log('Created Category: Timers');
  } else {
    console.log('Found Category: Timers');
  }

  // 2. Define Batch 3 Products
  const products = [
    // Image 1: AaCcSvch
    {
      name: 'Gelco Programmable Over Voltage & Overload Protector (AaCcSvch)',
      model: 'AaCcSvch',
      category: ovpCategory._id,
      shortDescription: 'Single-phase programmable voltage and load protector with digital V/A meter, settable high/low cut-off, and cyclic timer.',
      description: 'The Gelco AaCcSvch is a smart, modern electronic appliance protector designed for residential and light-commercial electrical installations. Operating over an ultra-wide voltage window from 85V to 300V AC with programmable current from 2A to 16A. Features customizable high-voltage (260V–280V) and low-voltage (160V–180V) cut-off points, programmable overload protection, real-time digital Volt & Ampere metering, auto ON/OFF scheduling, and built-in cyclic timer facility (minutes/seconds).',
      features: [
        'Ultra-Wide System Voltage: 85V AC - 300V AC',
        'Programmable Overload Protection: 2A to 16A',
        'High Voltage Settable Cut-off: 260V - 280V',
        'Low Voltage Settable Cut-off: 160V - 180V',
        'Integrated Digital Volt and Ampere Meter',
        'Auto ON / OFF Programmable Mode',
        'Built-in Cyclic Facility (minutes / seconds)',
        'Engineering Grade Plastic Enclosure (ABS)'
      ],
      specifications: [
        { key: 'System Voltage', value: '85V AC - 300V AC, 50 Hz' },
        { key: 'Current Capacity', value: '2A to 16A (Programmable)' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'High Voltage Cutoff Range', value: '260V - 280V (User Settable)' },
        { key: 'Low Voltage Cutoff Range', value: '160V - 180V (User Settable)' },
        { key: 'Overload Protection', value: 'Programmable from 2A to 16A' },
        { key: 'Display', value: 'Digital Volt & Ampere Meter' },
        { key: 'Timer Feature', value: 'Cyclic Facility (Minutes / Seconds) + Auto ON/OFF' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // Image 2: DTS - 502
    {
      name: 'Gelco Digital Time Switch & Clock DTS-502',
      model: 'DTS-502',
      category: timerCategory._id,
      shortDescription: '20A single-phase microcontroller digital time switch with real-time clock, 500-hour battery backup, and programmable ON/OFF schedules.',
      description: 'The Gelco DTS-502 Digital Time Switch offers precision 24-hour automation for lighting, water heaters, pumps, signboards, and industrial equipment. Powered by microcontroller intelligence with a bright 4-digit 7-segment digital clock display. Features an extensive 500-hour internal battery backup that maintains real-time clock synchronization during blackouts, automatic restart upon power restoration, and flexible programming options with up to 10 ON/OFF programs (with seconds precision on E model).',
      features: [
        '20A Heavy Switching Relay Capacity',
        'Internal Battery Backup for up to 500 Hours',
        'High-Accuracy Microcontroller Real-Time Digital Clock',
        'Auto Restart After Resumption of Power Supply',
        'Multiple Programming Profiles (DTS-502 up to 2 programs, DTS-502(S) up to 10 programs, DTS-502(E) with seconds precision)',
        'Sturdy Engineering Grade ABS Plastic Housing',
        'Simple 4-Button Front Interface (SET, UP, DN, ENT)'
      ],
      specifications: [
        { key: 'System Voltage', value: '230V AC, 50 Hz' },
        { key: 'Current Rating', value: '20 Amps' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Clock Type', value: 'Real Time Digital Clock' },
        { key: 'Battery Backup', value: '500 Hours Reserve' },
        { key: 'Auto Restart', value: 'Yes (After Power Supply Resumption)' },
        { key: 'Available Models', value: 'DTS-502 (2 ON/OFF), DTS-502(S) (10 ON/OFF), DTS-502(E) (10 ON/OFF with seconds)' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // Image 3: GEOSTRO
    {
      name: 'Gelco GEOSTRO Astronomical Latitude/Longitude Street Light Timer',
      model: 'GEOSTRO-20A',
      category: timerCategory._id,
      shortDescription: '20A astronomical digital timer automatically calculating sunrise & sunset times based on geographic coordinates for dusk-to-dawn street lighting.',
      description: 'The Gelco GEOSTRO is a smart astronomical timer designed for street lighting, campus lights, and outdoor illumination where dusk-to-dawn operation is needed all night. Rather than relying on easily-soiled optical sensors, GEOSTRO utilizes latitude and longitude coordinates to automatically compute exact daily sunset and sunrise times throughout the year. Adapts dynamically to changing seasons and weather conditions. Features a 500-hour battery backup, 20A switching capacity, and automatic recovery after power outages.',
      features: [
        'Latitude & Longitude Coordinate-Based Astronomical Calculation',
        'Ideal for Street Lights, Highway Illumination & Campus Lighting',
        'Automatically Adjusts Switching Times for Different Seasons & Weather',
        '500-Hour Internal Battery Backup retains clock and location settings',
        'Real-Time Digital Clock with Microcontroller Technology',
        'Auto Restart immediately upon power resumption',
        'Heavy-duty 20A Switching Rating',
        'Engineering Grade ABS Enclosure'
      ],
      specifications: [
        { key: 'System Voltage', value: '230V AC, 50 Hz' },
        { key: 'Current Capacity', value: '20 Amps' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Timing Logic', value: 'Astronomical Latitude / Longitude Calculation' },
        { key: 'Seasonal Adjustment', value: 'Automatic Sunset/Sunrise Time Adaptation' },
        { key: 'Battery Backup', value: '500 Hours' },
        { key: 'Clock', value: 'Real-Time Digital Clock (4-Digit LED)' },
        { key: 'Application', value: 'Street Lighting, Township Illumination, Highway & Yard Lights' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // Image 4: DT - 48
    {
      name: 'Gelco Dual Air Conditioner Cyclic Control Panel DT-48',
      model: 'DT-48',
      category: timerCategory._id,
      shortDescription: '25A microcontroller panel automatically alternating 2 air conditioners cyclically for ATM centers, server rooms, and telecom hubs.',
      description: 'Engineered specifically for 24/7 critical installations like ATM centers, telecom shelters, and server rooms, the Gelco DT-48 cyclic control panel automatically alternates between two independent air conditioners (AC-1 and AC-2). By cycling cooling duty at user-configured intervals, it prevents compressor overheating, doubles equipment lifespan, and maintains consistent room cooling. Features a 25A load capacity, front digital display, AC-1/AC-2 status indicator lamps, and automatic restart on power recovery.',
      features: [
        'Designed Specifically for ATM Centers, Server Rooms & Telecom Shelters',
        'Alternates Duty between 2 Air Conditioners Cyclically',
        '25A Heavy-Duty Continuous Load Rating',
        'Micro Controller Based Precision Cycling',
        'Front Digital Display showing operating cycle and timing',
        'Auto Restart upon power supply resumption',
        'Dedicated Indicator Lamps: AC-1, AC-2, and Power Supply',
        'Heavy-Duty Wall-Mounting Metal Enclosure with secure latch'
      ],
      specifications: [
        { key: 'System Voltage', value: '230V AC, 50 Hz' },
        { key: 'Current Rating', value: '25 Amps' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'AC Capacity', value: 'Operates up to 2 Air Conditioners Alternatively' },
        { key: 'Display', value: 'Digital Display (7-Segment LED)' },
        { key: 'Auto Restart', value: 'Automatic after power resumption' },
        { key: 'Indicators', value: 'AC-1 Active (Red), AC-2 Active (Red), Supply (Red)' },
        { key: 'Recommended Application', value: 'ATM Centers, Server Rooms, Telecom Shelters, Data Rooms' },
        { key: 'Enclosure Type', value: 'Industrial Sheet Metal Enclosure with Double Lock' }
      ],
      images: [],
      displayOrder: 3,
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

insertBatch3().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
