require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('./slugify');

async function insertBatch2() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // 1. Create or Find Categories
  let stabCategory = await Category.findOne({ name: 'Voltage Stabilizers' });
  if (!stabCategory) {
    stabCategory = await Category.create({
      name: 'Voltage Stabilizers',
      slug: slugify('Voltage Stabilizers'),
      description: 'High-speed electronic and mainline automatic voltage stabilizers with digital metering, spike suppression, and high/low voltage protection.',
      displayOrder: 2,
      isActive: true
    });
    console.log('Created Category: Voltage Stabilizers');
  } else {
    console.log('Found Category: Voltage Stabilizers');
  }

  let wlcCategory = await Category.findOne({ name: 'Water Level Controllers' });
  if (!wlcCategory) {
    wlcCategory = await Category.create({
      name: 'Water Level Controllers',
      slug: slugify('Water Level Controllers'),
      description: 'Microprocessor dual-tank automatic water level controllers for openwell, borewell, and three-phase industrial pump motor starters.',
      displayOrder: 3,
      isActive: true
    });
    console.log('Created Category: Water Level Controllers');
  } else {
    console.log('Found Category: Water Level Controllers');
  }

  // 2. Define Batch 2 Products
  const products = [
    // Image 1: GLMB 600 Home Mainline Voltage Stabilizer
    {
      name: 'Gelco Mainline Automatic Voltage Stabilizer GLMB 600',
      model: 'GLMB-600',
      category: stabCategory._id,
      shortDescription: 'High-speed 24A mainline automatic voltage stabilizer with digital V/A display, spike protection, high/low cutoff, and wide 125V-290V input range.',
      description: 'The Gelco GLMB 600 Electronic Voltage Stabilizer provides complete mainline voltage correction and surge protection for entire homes and offices. Built to handle heavy 24A continuous load capacity across an expansive 125V–290V working window with 60V boost/buck capability. Features a bright digital display showing live input/output voltage and load amperes, intelligent time delay for appliance compressor safety, electronic overload tripping, and automatic reset.',
      features: [
        'Spike Protection & Surge Suppression',
        'High / Low Voltage Automatic Cut-Off',
        'Stabilized Clean Output Voltage (220V ± 10%)',
        'Totally Automatic Operation with Auto Reset Facility',
        'Digital Input, Output Voltage & Ampere Display',
        'Smart Time Delay Facility for compressor and refrigeration safety',
        'Electronic Overload Tripping',
        '60V Boost & 60V Buck voltage correction'
      ],
      specifications: [
        { key: 'Model', value: 'GLMB 600' },
        { key: 'Capacity', value: '24 A' },
        { key: 'Working Range', value: '125V - 290V' },
        { key: 'Input Voltage Window', value: '140V - 270V' },
        { key: 'Output Voltage', value: '220V ± 10%' },
        { key: 'Boost Voltage', value: '60V' },
        { key: 'Buck Voltage', value: '60V' },
        { key: 'Display', value: 'Digital Input, Output, and Ampere Display' },
        { key: 'Protection', value: 'Spike, Surge, High/Low Voltage Cutoff, Overload' },
        { key: 'Reset Mode', value: 'Auto Reset Facility' },
        { key: 'Time Delay', value: 'Built-in Safety Time Delay' },
        { key: 'Compatible Series Models', value: 'GLM 500 (20A), GLMB 500 (20A), GLM 600 (24A), GLMB 600 (24A)' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // Image 2: LLC - 2
    {
      name: 'Gelco Automatic Water Level Controller LLC-2',
      model: 'LLC-2',
      category: wlcCategory._id,
      shortDescription: 'Single-phase dual-tank automatic water level controller for openwell submersible and self-priming pump motors with ABS enclosure.',
      description: 'Designed specifically for single-phase openwell submersible and self-priming pump motors, the Gelco LLC-2 provides fully automatic dual-tank water management. It monitors both underground sump and overhead tanks, turning the motor starter ON when the overhead tank is depleted and OFF when full. Features clear LED status indications, Auto/Manual operation toggle, and robust engineering-grade ABS plastic enclosure.',
      features: [
        'Two Tank Automatic Controller (Overhead Tank & Underground Sump)',
        'Automatic Control of Starter According to Set Water Level in Tanks',
        'Clear LED Indications for Water Level in Tank (OH, OL, UH, UL, ON)',
        'Compatible with Stainless Steel (S.S.) Sensors, Magnetic Sensors, or Float Switches',
        'Engineering Grade Flame-Retardant ABS Plastic Enclosure',
        'Auto / Manual Operation Facility with Start/Stop push buttons',
        'Specifically designed for Openwell Submersible and Self-Priming Motors',
        'Dry Run Protection prevents pump burnout if sump runs out of water'
      ],
      specifications: [
        { key: 'System Voltage', value: '230V AC ± 20%, 50 Hz' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Tank Support', value: 'Two Tank Controller (Overhead & Underground Sump)' },
        { key: 'Enclosure Material', value: 'Engineering Grade Plastic Enclosure (ABS)' },
        { key: 'Operation Modes', value: 'Auto / Manual Facility' },
        { key: 'Sensor Compatibility', value: 'Stainless Steel (S.S.) Sensors / Magnetic Sensors / Float Switch' },
        { key: 'Motor Compatibility', value: 'Openwell Submersible & Self Priming Motors' },
        { key: 'Indicators', value: 'LED Indications for Tank Water Level & Motor Status' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // Image 3: LLC - 2S
    {
      name: 'Gelco Automatic Water Level Controller LLC-2S',
      model: 'LLC-2S',
      category: wlcCategory._id,
      shortDescription: 'Single-phase two-tank automation controller for borewell motors, compatible with MK 1 contactor red/green push button panel starters.',
      description: 'The Gelco LLC-2S is an advanced single-phase automation controller engineered specifically for deep borewell submersible pump motors. Designed for direct integration with standard MK 1 type contactors and red/green pushbutton starter panels. Continuously samples water levels in both underground water sources and overhead tanks to prevent dry running while automating tank filling.',
      features: [
        'Two Tank Automatic Controller',
        'Engineered Specifically for Deep Borewell Motors',
        'Direct Compatibility with MK 1 Type Contactor & Red/Green Push Button Panel Starters',
        'Automatic Control of Starter According to Set Water Level in Tanks',
        'Comprehensive LED Indications for Water Level in Tank',
        'Compatible with S.S. Sensors, Magnetic Sensors, and Float Switches',
        'High-Strength ABS Engineering Grade Housing',
        'Auto / Bypass Selection Facility with Front Reset Button'
      ],
      specifications: [
        { key: 'System Voltage', value: '230V AC ± 20%, 50 Hz' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Motor Compatibility', value: 'Borewell Motors' },
        { key: 'Starter Compatibility', value: 'MK 1 Type Contactor with Red/Green Push Button Panel Starter' },
        { key: 'Tank Support', value: 'Two Tank Controller' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' },
        { key: 'Operation Modes', value: 'Auto / Manual / Bypass Facility' },
        { key: 'Sensor Compatibility', value: 'S.S. Sensors / Magnetic Sensors* / Float Switch*' },
        { key: 'Display / LEDs', value: 'LED Indications for Water Level & Starter Action' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // Image 4: LLC - 101
    {
      name: 'Gelco Three Phase Water Level Controller LLC-101',
      model: 'LLC-101',
      category: wlcCategory._id,
      shortDescription: 'Industrial 3-phase 415V dual-tank water level controller with DIN-rail mountable ABS housing for commercial & agricultural starters.',
      description: 'The Gelco LLC-101 is a rugged three-phase (415V AC) water level automation controller designed for commercial, industrial, and agricultural motor starters. Compact DIN-rail and panel-mountable engineering-grade ABS enclosure fits cleanly into electrical control panels. Automatically governs three-phase starters based on real-time liquid levels in dual tanks with full dry-run and overflow prevention.',
      features: [
        'Heavy Industrial Three-Phase (415V AC) Operation',
        'Two Tank Simultaneous Level Monitoring',
        'Automatic Control of Motor Starter According to Preset Levels',
        'Multi-LED Status Indicators for Tank Water Levels & Starter Trigger',
        'Supports S.S. Conductivity Sensors, Magnetic Float Sensors, and Mechanical Float Switches',
        'Compact DIN-Rail and Base Mountable ABS Enclosure',
        'Front-Facing Auto / Manual / Bypass Selector Switch',
        'Eliminates Water Wastage and Protects 3-Phase Motors from Dry Running'
      ],
      specifications: [
        { key: 'System Voltage', value: '415V AC ± 20%, 50 Hz' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Tank Support', value: 'Two Tank Controller' },
        { key: 'Mounting Type', value: 'DIN Rail / Base Panel Mounting' },
        { key: 'Enclosure Material', value: 'Engineering Grade Plastic Enclosure (ABS)' },
        { key: 'Operation Modes', value: 'Auto / Manual / Bypass Facility' },
        { key: 'Sensor Compatibility', value: 'S.S. Sensors / Magnetic Sensors* / Float Switch*' },
        { key: 'Indicators', value: 'LED Indications for Water Level in Tank & Relay Status' },
        { key: 'Protection', value: 'Dry Run & Tank Overflow Prevention' }
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

insertBatch2().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
