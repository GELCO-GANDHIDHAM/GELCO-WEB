require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('./slugify');

async function insertBatch4() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  // 1. Create or Find Categories
  let startersCategory = await Category.findOne({ name: 'Starters' });
  if (!startersCategory) {
    startersCategory = await Category.create({
      name: 'Starters',
      slug: slugify('Starters'),
      description: 'Electronic Direct-On-Line (DOL) and digital microprocessor motor starters for submersible, monoblock, and industrial pumps with overload and single-phase protection.',
      displayOrder: 6,
      isActive: true
    });
    console.log('Created Category: Starters');
  } else {
    console.log('Found Category: Starters');
  }

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

  let autoPhotoCategory = await Category.findOne({ name: 'Auto Photo' });
  if (!autoPhotoCategory) {
    autoPhotoCategory = await Category.create({
      name: 'Auto Photo',
      slug: slugify('Auto Photo'),
      description: 'Automatic dusk-to-dawn optical photocell light control switches for residential, commercial, and municipal outdoor illumination.',
      displayOrder: 7,
      isActive: true
    });
    console.log('Created Category: Auto Photo');
  } else {
    console.log('Found Category: Auto Photo');
  }

  let phaseChangerCategory = await Category.findOne({ name: 'Phase Changer' });
  if (!phaseChangerCategory) {
    phaseChangerCategory = await Category.create({
      name: 'Phase Changer',
      slug: slugify('Phase Changer'),
      description: 'Electronic automatic phase changers and sequence correctors providing uninterrupted single-phase power from available healthy phases.',
      displayOrder: 8,
      isActive: true
    });
    console.log('Created Category: Phase Changer');
  } else {
    console.log('Found Category: Phase Changer');
  }

  // 2. Define Batch 4 Products
  const products = [
    // 1. GTA Series
    {
      name: 'Gelco Three Phase Electronic Motor Starter (GTA Series)',
      model: 'GTA-305',
      category: startersCategory._id,
      shortDescription: '3-phase 415V electronic DOL motor starter for submersible pump sets with high/low voltage, overload, and reverse phasing protection.',
      description: 'The Gelco GTA series is a heavy-duty 415V electronic Direct-On-Line (DOL) motor starter engineered for agricultural and commercial 3-phase submersible pump sets. Provides comprehensive multi-point motor protection against high/low voltage fluctuations, thermal overload, single phasing (phase failure), and reverse phase rotation. Includes a 1-minute pre-start safety time delay, electronic start/stop push buttons, and automatic turn-on after power supply restoration.',
      features: [
        'Engineered for 3-Phase D.O.L. Submersible Pump Sets',
        'High / Low Voltage Protection & Thermal Overload Protection',
        'Phase Failure (Single Phasing) & Reverse Phasing Protection',
        'One Minute Safety Time Delay Before Motor Start',
        'Automatically Turns ON After Power Supply Resumption',
        'Electronic Start / Stop Push Button Facility',
        'Engineering Grade Flame-Retardant ABS Enclosure',
        'Available Current Range Models: GTA-304 (2-5A), GTA-305 (4-10A), GTA-306 (8-20A)'
      ],
      specifications: [
        { key: 'System Voltage', value: '415V ± 20% VAC, 50 Hz' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Motor Type', value: 'D.O.L. Submersible Pump Set' },
        { key: 'Current Range Options', value: 'GTA-304: 2-5A | GTA-305: 4-10A | GTA-306: 8-20A' },
        { key: 'Protection Type', value: 'High/Low Voltage, Overload, Phase Failure, Reverse Phasing' },
        { key: 'Starting Time Delay', value: '1 Minute Before Motor Start' },
        { key: 'Auto Restart', value: 'Automatic Turn-ON After Power Resumption' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // 2. DCP 304
    {
      name: 'Gelco Digital Microcontroller Motor Starter DCP 304',
      model: 'DCP-304',
      category: startersCategory._id,
      shortDescription: '3-phase 415V digital DOL motor starter with dual volt/amp meter, dry run protection, and water level controller adaptor interface.',
      description: 'The Gelco DCP 304 represents the next generation of smart motor starters, powered by advanced microcontroller technology. Suitable for 3-phase submersible and monoblock pump sets up to 20A. Features a bright digital display showing live Voltage and Current simultaneously, built-in dry run protection, phase failure/reverse phasing safety, programmable electrical parameters, and a dedicated connection port for the Gelco LLC-001D water level controller adaptor for complete tank automation.',
      features: [
        'Integrated Dual Digital Volt and Ampere Meter (Real-time readout)',
        'Built-in Dry Run Protection preventing pump burnout without water',
        'High / Low Voltage & Electronic Overload Protection',
        'Phase Failure and Reverse Phasing Prevention',
        'Facility to connect GELCO Water Level Controller Adaptor (LLC-001D)',
        'Micro Controller Based Intelligence with User-Programmable Parameters',
        'Automatically Turns ON After Power Supply Resumption',
        'Electronic Start / Stop Push Button Facility with SET key'
      ],
      specifications: [
        { key: 'System Voltage', value: '415V ± 20% VAC, 50 Hz' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Current Range', value: 'Up to 20 Amperes' },
        { key: 'Application', value: 'D.O.L. Submersible & Monoblock Pump Sets' },
        { key: 'Display', value: 'Digital Dual Display (Voltage & Amperes)' },
        { key: 'Dry Run Protection', value: 'Yes (Integrated)' },
        { key: 'WLC Interface', value: 'Compatible with GELCO Water Level Controller Adaptor (LLC-001D)' },
        { key: 'Programmability', value: 'Parameters Can Be Programmed' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // 3. OVP 3
    {
      name: 'Gelco Three Phase Over Voltage Protector OVP 3',
      model: 'OVP-3',
      category: ovpCategory._id,
      shortDescription: '3-phase 415V over-voltage and neutral failure guard (30A/50A) with per-phase digital V/A metering and auto-start under 270V.',
      description: 'The Gelco OVP 3 delivers commercial and industrial-grade power protection against destructive grid over-voltages and dangerous floating neutral faults. Available in 30A and 50A continuous ratings, it instantly isolates connected equipment whenever voltage exceeds 285V. Features individual digital Volt & Ampere metering for each phase, 3-50mA leakage sensitivity, LED status indicators, auto-reconnection below 270V, and a heavy-gauge powder-coated sheet metal enclosure with touch-safe terminal blocks.',
      features: [
        'Instant Over Voltage Protection: Above 285V Cut-off',
        'Advanced Neutral Failure Protection',
        'Digital Volt / Amp. Meter for Each Phase',
        'High Sensitivity: 3 - 50 mA',
        'Automatic Start & Reconnection when Voltage is below 270V',
        'Multi-Status LED Indication Array',
        'Heavy-Duty Powder Coated Sheet Metal Enclosure',
        'Continuous Load Current Options: 30A / 50A'
      ],
      specifications: [
        { key: 'System Voltage', value: '415V AC, 3 Phase, 50 Hz' },
        { key: 'Load Current Rating', value: '30A / 50A' },
        { key: 'Over Voltage Protection Cutoff', value: 'Above 285V' },
        { key: 'Auto Reconnection Voltage', value: '< 270V' },
        { key: 'Sensitivity', value: '3 - 50 mA' },
        { key: 'Neutral Protection', value: 'Neutral Failure Protection Included' },
        { key: 'Metering', value: 'Digital Volt / Amp. Meter (Per Phase)' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure' },
        { key: 'Phase', value: '3 Phase (Three Phase)' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // 4. Auto Photo 6A
    {
      name: 'Gelco Auto Photo 6A Automatic Light Control Switch',
      model: 'AUTO-PHOTO-6A',
      category: autoPhotoCategory._id,
      shortDescription: 'Compact 6A single-phase dusk-to-dawn optical light controller with external weather-sealed sensor probe and ABS enclosure.',
      description: 'The Gelco Auto Photo 6A provides hands-free dusk-to-dawn switching for residential compounds, outdoor porch lights, garden illumination, and signage. Features a high-accuracy external optical sensor probe that detects ambient twilight, automatically switching lights ON at dusk and OFF at dawn. Housed in a durable engineering-grade ABS enclosure with terminal screw blocks and operational status LED.',
      features: [
        'Automatic Dusk-to-Dawn Ambient Light Sensing',
        'Heavy-Duty 6A Load Current Capacity (Up to 1200W lighting load)',
        'External Sealed Optical Photocell Sensor Probe Included',
        'LED Operational Indicator',
        'Auto / Manual / OFF Selector Switch',
        'Engineering Grade Plastic Enclosure (ABS)',
        'Eliminates Energy Wastage from daytime light operation'
      ],
      specifications: [
        { key: 'Load Current Rating', value: '6A' },
        { key: 'System Voltage', value: '230V AC, 1 Phase, 50 Hz' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Sensor Type', value: 'External Photocell Optical Sensor Probe' },
        { key: 'Operation Modes', value: 'Auto / Manual / OFF' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' },
        { key: 'Indicator', value: 'L.E.D. Indication' },
        { key: 'Application', value: 'Indoor / Outdoor Lighting Automation' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // 5. Auto Photo 25A
    {
      name: 'Gelco Auto Photo 25A Heavy Duty Light Control Switch',
      model: 'AUTO-PHOTO-25A',
      category: autoPhotoCategory._id,
      shortDescription: 'Industrial 25A single-phase twilight optical control switch with bypass facility and powder-coated sheet metal enclosure for municipal and commercial lighting.',
      description: 'Built for high-load commercial, municipal, and township street lighting circuits, the Gelco Auto Photo 25A delivers a robust 25A continuous capacity capable of switching large banks of LED floodlights and sodium-vapor lamps. Equipped with an external optical twilight sensor probe, manual bypass switch for maintenance testing, visual status LEDs, and a weather-resistant powder-coated sheet metal enclosure.',
      features: [
        'High Capacity 25A Continuous Load Rating (Up to 5000W)',
        'Built-in Manual Bypass Facility for line testing and maintenance',
        'Automatic Dusk-to-Dawn Twilight Switching',
        'External High-Sensitivity Optical Sensor Probe',
        'Multi-LED Status Indicators for Supply and Output',
        'Heavy-Duty Industrial Powder Coated Sheet Metal Enclosure',
        'Suitable for Indoor and Outdoor Installations as Per Requirement'
      ],
      specifications: [
        { key: 'Load Current Rating', value: '25A' },
        { key: 'System Voltage', value: '230V AC, 1 Phase, 50 Hz' },
        { key: 'Phase', value: '1 Phase (Single Phase)' },
        { key: 'Bypass Facility', value: 'Yes (Integrated Manual Bypass)' },
        { key: 'Sensor Type', value: 'External Weatherproof Optical Sensor Probe' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure' },
        { key: 'Indicators', value: 'L.E.D. Status Indications' },
        { key: 'Application', value: 'Commercial Campus, Street Lights, Warehouses, Parking Lots' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // 6. Gelco Guruu Phase Changer
    {
      name: 'Gelco Guruu Electronic Auto Phase Changer (32A / 50A / 63A)',
      model: 'GELCO-GURUU-3PH',
      category: phaseChangerCategory._id,
      shortDescription: 'Heavy-duty 3-phase automatic phase selector (32A/50A/63A) with 3 integrated MCBs, 10s starting delay, and automatic healthy phase transfer.',
      description: 'The Gelco Guruu Electronic Auto Phase Changer delivers completely uninterrupted power for residences, offices, elevators, and clinics located in areas with frequent single or two-phase grid dropouts. In case of a phase failure on the incoming 415V supply, it seamlessly transfers the load to another available healthy phase without manual intervention. As soon as the faulty phase recovers, the load returns to the original phase automatically. Features three front-mounted MCBs for individual phase overload protection, a 10-second starting time delay, R-Y-B status LEDs, and a sturdy powder-coated sheet metal enclosure.',
      features: [
        'Fully Automatic Load Transfer to Healthy Phase on Phase Failure',
        'Automatic Return to Original Phase on Power Resumption',
        'Uninterrupted 24/7 Power for Single-Phase Loads, Lifts, Lighting & IT',
        'Triple Front MCBs for Overload & Short Circuit Protection',
        '10-Second Starting Time Delay preventing line startup surges',
        'R, Y, B Status Indicator Lamps',
        'Heavy-Duty Powder Coated Sheet Metal Cabinet',
        'Available Current Ratings: 32A / 50A / 63A'
      ],
      specifications: [
        { key: 'System Voltage', value: '415V AC, 3 Phase, 50 Hz' },
        { key: 'Load Current Ratings', value: '32A / 50A / 63A Selectable' },
        { key: 'Phase', value: '3 Phase Input (415V), Single Phase Regulated Output (230V)' },
        { key: 'Starting Delay', value: '10 Seconds Time Delay' },
        { key: 'Overload Protection', value: 'Through 3 Front-Facing Miniature Circuit Breakers (MCB)' },
        { key: 'Indicators', value: 'R, Y, B Healthy Phase LED Indicators' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure with Lock' },
        { key: 'Application', value: 'Domestic & Commercial Uninterrupted Power Solutions' }
      ],
      images: [],
      displayOrder: 1,
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

insertBatch4().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
