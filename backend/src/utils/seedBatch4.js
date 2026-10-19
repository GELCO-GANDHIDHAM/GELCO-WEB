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

  // 2. Remove any previously grouped products to cleanly replace with individual models
  const groupedNamesToDelete = [
    'Gelco Three Phase Electronic Motor Starter (GTA Series)',
    'Gelco Three Phase Over Voltage Protector OVP 3',
    'Gelco Guruu Electronic Auto Phase Changer (32A / 50A / 63A)'
  ];
  for (const oldName of groupedNamesToDelete) {
    const deleted = await Product.deleteOne({ name: oldName });
    if (deleted.deletedCount > 0) {
      console.log(`Removed previously grouped product: "${oldName}"`);
    }
  }

  // 3. Define Batch 4 Products (each individual model as its own distinct product)
  const products = [
    // --- GTA SERIES: Model GTA-304 (2 - 5 Amp) ---
    {
      name: 'Gelco Three Phase Electronic Motor Starter GTA-304 (2-5A)',
      model: 'GTA-304',
      category: startersCategory._id,
      shortDescription: '3-phase 415V electronic DOL motor starter (2-5 Amp) for submersible pump sets with high/low voltage, overload, and reverse phasing safety.',
      description: 'The Gelco GTA-304 is a dedicated 415V electronic Direct-On-Line (DOL) motor starter engineered for 3-phase submersible pump sets operating within the 2 to 5 Ampere current range (typically 0.5 HP to 1.5 HP). It provides complete multi-point motor protection against high/low voltage fluctuations, thermal overload, single phasing (phase failure), and reverse phase rotation. Features a built-in 1-minute safety time delay before motor startup, electronic start/stop push buttons, automatic turn-on after power supply resumption, and an engineering-grade ABS flame-retardant enclosure.',
      features: [
        'Model GTA-304: Tuned for 2 - 5 Ampere Submersible Pump Sets',
        'Engineered for 3-Phase D.O.L. Submersible Pump Sets',
        'High / Low Voltage Protection & Thermal Overload Protection',
        'Phase Failure (Single Phasing) & Reverse Phasing Protection',
        'One Minute Safety Time Delay Before Motor Start',
        'Automatically Turns ON After Power Supply Resumption',
        'Electronic Start / Stop Push Button Facility',
        'Engineering Grade Plastic Enclosure (ABS)'
      ],
      specifications: [
        { key: 'Model', value: 'GTA-304' },
        { key: 'Current Range', value: '2 - 5 AMP' },
        { key: 'System Voltage', value: '415 V ± 20% VAC, 50 Hz' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Application', value: 'For D.O.L. Submersible Pump Set (0.5 HP - 1.5 HP)' },
        { key: 'Protection', value: 'High/Low Voltage, Overload, Phase Failure, Reverse Phasing' },
        { key: 'Starting Time Delay', value: 'One Minute Time Delay Before Start' },
        { key: 'Auto Restart', value: 'Automatically Turn On After Power Supply Resumption' },
        { key: 'Operation', value: 'Electronic Start / Stop Push Button Facility' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // --- GTA SERIES: Model GTA-305 (4 - 10 Amp) ---
    {
      name: 'Gelco Three Phase Electronic Motor Starter GTA-305 (4-10A)',
      model: 'GTA-305',
      category: startersCategory._id,
      shortDescription: '3-phase 415V electronic DOL motor starter (4-10 Amp) for submersible pump sets with high/low voltage, overload, and reverse phasing safety.',
      description: 'The Gelco GTA-305 is a heavy-duty 415V electronic Direct-On-Line (DOL) motor starter engineered for 3-phase submersible pump sets operating within the 4 to 10 Ampere current range (typically 2 HP to 3 HP). It delivers robust motor protection against line voltage surges, under-voltage dropouts, thermal overload, single phasing failure, and incorrect phase sequence. Equipped with a 1-minute pre-start delay, electronic push button controls, auto-restart upon power restoration, and a shockproof ABS enclosure.',
      features: [
        'Model GTA-305: Tuned for 4 - 10 Ampere Submersible Pump Sets',
        'Engineered for 3-Phase D.O.L. Submersible Pump Sets',
        'High / Low Voltage Protection & Thermal Overload Protection',
        'Phase Failure (Single Phasing) & Reverse Phasing Protection',
        'One Minute Safety Time Delay Before Motor Start',
        'Automatically Turns ON After Power Supply Resumption',
        'Electronic Start / Stop Push Button Facility',
        'Engineering Grade Plastic Enclosure (ABS)'
      ],
      specifications: [
        { key: 'Model', value: 'GTA-305' },
        { key: 'Current Range', value: '4 - 10 AMP' },
        { key: 'System Voltage', value: '415 V ± 20% VAC, 50 Hz' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Application', value: 'For D.O.L. Submersible Pump Set (2 HP - 3 HP)' },
        { key: 'Protection', value: 'High/Low Voltage, Overload, Phase Failure, Reverse Phasing' },
        { key: 'Starting Time Delay', value: 'One Minute Time Delay Before Start' },
        { key: 'Auto Restart', value: 'Automatically Turn On After Power Supply Resumption' },
        { key: 'Operation', value: 'Electronic Start / Stop Push Button Facility' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // --- GTA SERIES: Model GTA-306 (8 - 20 Amp) ---
    {
      name: 'Gelco Three Phase Electronic Motor Starter GTA-306 (8-20A)',
      model: 'GTA-306',
      category: startersCategory._id,
      shortDescription: '3-phase 415V electronic DOL motor starter (8-20 Amp) for high-capacity submersible pump sets with high/low voltage and overload protection.',
      description: 'The Gelco GTA-306 is an industrial-rated 415V electronic Direct-On-Line (DOL) motor starter engineered for high-capacity 3-phase submersible pump sets operating within the 8 to 20 Ampere current range (typically 3 HP to 7.5 HP). It provides maximum equipment longevity through instant tripping on single phasing, reverse phase sequencing, severe voltage fluctuations, or current overload. Features automatic power-resumption turn-on, 1-minute safety delay, push-button interface, and rugged ABS housing.',
      features: [
        'Model GTA-306: Tuned for 8 - 20 Ampere Submersible Pump Sets',
        'Engineered for 3-Phase D.O.L. Submersible Pump Sets',
        'High / Low Voltage Protection & Thermal Overload Protection',
        'Phase Failure (Single Phasing) & Reverse Phasing Protection',
        'One Minute Safety Time Delay Before Motor Start',
        'Automatically Turns ON After Power Supply Resumption',
        'Electronic Start / Stop Push Button Facility',
        'Engineering Grade Plastic Enclosure (ABS)'
      ],
      specifications: [
        { key: 'Model', value: 'GTA-306' },
        { key: 'Current Range', value: '8 - 20 AMP' },
        { key: 'System Voltage', value: '415 V ± 20% VAC, 50 Hz' },
        { key: 'Phase', value: '3 Phase (Three Phase)' },
        { key: 'Application', value: 'For D.O.L. Submersible Pump Set (3 HP - 7.5 HP)' },
        { key: 'Protection', value: 'High/Low Voltage, Overload, Phase Failure, Reverse Phasing' },
        { key: 'Starting Time Delay', value: 'One Minute Time Delay Before Start' },
        { key: 'Auto Restart', value: 'Automatically Turn On After Power Supply Resumption' },
        { key: 'Operation', value: 'Electronic Start / Stop Push Button Facility' },
        { key: 'Enclosure', value: 'Engineering Grade Plastic Enclosure (ABS)' }
      ],
      images: [],
      displayOrder: 3,
      isActive: true
    },

    // --- DCP 304 ---
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
        { key: 'Model', value: 'DCP 304' },
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
      displayOrder: 4,
      isActive: true
    },

    // --- OVP 3: 30A Model ---
    {
      name: 'Gelco Three Phase Over Voltage Protector OVP 3 (30A)',
      model: 'OVP-3-30A',
      category: ovpCategory._id,
      shortDescription: '3-phase 415V 30A over-voltage and neutral failure guard with per-phase digital V/A metering and auto-start under 270V.',
      description: 'The Gelco OVP 3 (30A) delivers commercial and industrial power protection against destructive high-voltage spikes and floating neutral faults for loads up to 30 Amperes. Instantly isolates connected machinery whenever phase voltage rises above 285V. Features individual digital Volt & Ampere metering for each phase, 3-50mA leakage sensitivity, LED status indicators, automatic reconnection below 270V, and a heavy-gauge powder-coated sheet metal enclosure.',
      features: [
        'Continuous 30A Load Current Capacity',
        'Instant Over Voltage Protection: Above 285V Cut-off',
        'Advanced Neutral Failure Protection',
        'Digital Volt / Amp. Meter for Each Phase',
        'High Sensitivity: 3 - 50 mA',
        'Automatic Start & Reconnection when Voltage is below 270V',
        'Multi-Status LED Indication Array',
        'Heavy-Duty Powder Coated Sheet Metal Enclosure'
      ],
      specifications: [
        { key: 'Model', value: 'OVP 3 (30A)' },
        { key: 'Load Current Rating', value: '30A' },
        { key: 'System Voltage', value: '415V AC, 3 Phase, 50 Hz' },
        { key: 'Over Voltage Protection Cutoff', value: 'Above 285V' },
        { key: 'Auto Start / Reconnect Voltage', value: '< 270V' },
        { key: 'Sensitivity', value: '3 - 50 mA' },
        { key: 'Neutral Protection', value: 'Neutral Failure Protection Included' },
        { key: 'Metering', value: 'Digital Volt / Amp. Meter Each Phase' },
        { key: 'Indicators', value: 'L.E.D Indication' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure' },
        { key: 'Phase', value: '3 Phase (Three Phase)' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // --- OVP 3: 50A Model ---
    {
      name: 'Gelco Three Phase Over Voltage Protector OVP 3 (50A)',
      model: 'OVP-3-50A',
      category: ovpCategory._id,
      shortDescription: '3-phase 415V 50A heavy-duty over-voltage and neutral failure guard with per-phase digital V/A metering and auto-start under 270V.',
      description: 'The Gelco OVP 3 (50A) is engineered for heavy commercial and industrial power mains carrying up to 50 Amperes load current. Provides immediate cut-off above 285V to protect high-value manufacturing equipment, chillers, and commercial panels against phase surges and floating neutral damage. Equipped with per-phase digital voltage and current monitoring, auto-reconnection below 270V, LED diagnostics, and a powder-coated steel cabinet.',
      features: [
        'Heavy-Duty 50A Continuous Load Current Capacity',
        'Instant Over Voltage Protection: Above 285V Cut-off',
        'Advanced Neutral Failure Protection',
        'Digital Volt / Amp. Meter for Each Phase',
        'High Sensitivity: 3 - 50 mA',
        'Automatic Start & Reconnection when Voltage is below 270V',
        'Multi-Status LED Indication Array',
        'Heavy-Duty Powder Coated Sheet Metal Enclosure'
      ],
      specifications: [
        { key: 'Model', value: 'OVP 3 (50A)' },
        { key: 'Load Current Rating', value: '50A' },
        { key: 'System Voltage', value: '415V AC, 3 Phase, 50 Hz' },
        { key: 'Over Voltage Protection Cutoff', value: 'Above 285V' },
        { key: 'Auto Start / Reconnect Voltage', value: '< 270V' },
        { key: 'Sensitivity', value: '3 - 50 mA' },
        { key: 'Neutral Protection', value: 'Neutral Failure Protection Included' },
        { key: 'Metering', value: 'Digital Volt / Amp. Meter Each Phase' },
        { key: 'Indicators', value: 'L.E.D Indication' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure' },
        { key: 'Phase', value: '3 Phase (Three Phase)' }
      ],
      images: [],
      displayOrder: 3,
      isActive: true
    },

    // --- Auto Photo 6A ---
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
        { key: 'Model', value: 'AUTO PHOTO 6A' },
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

    // --- Auto Photo 25A ---
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
        { key: 'Model', value: 'AUTO PHOTO 25A' },
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

    // --- GELCO GURUU: 32A Model ---
    {
      name: 'Gelco Guruu Electronic Auto Phase Changer 32A',
      model: 'GELCO-GURUU-32A',
      category: phaseChangerCategory._id,
      shortDescription: '3-phase automatic phase changer (32A) with MCB overload protection, 10s starting delay, and seamless healthy-phase transfer.',
      description: 'The Gelco Guruu 32A Electronic Auto Phase Changer ensures uninterrupted power for residential homes, small offices, and clinics. When a phase drops or fails on the incoming 415V 3-phase line, it instantly transfers the single-phase load to an available healthy phase. Upon recovery of the faulty phase, the load automatically returns to its original phase. Equipped with dedicated 32A MCB protection, 10-second starting surge delay, R-Y-B phase indicator LEDs, and a powder-coated sheet metal enclosure.',
      features: [
        '32A Load Current Rating for Domestic & Light Commercial Use',
        'Automatic Load Transfer to Healthy Phase on Phase Failure',
        'Automatic Return to Original Phase on Power Resumption',
        'Front-Facing MCB Overload & Short Circuit Protection',
        '10-Second Starting Time Delay preventing line startup surges',
        'R, Y, B Status Indicator Lamps',
        'Powder Coated Sheet Metal Enclosure'
      ],
      specifications: [
        { key: 'Model', value: 'GELCO GURUU 32A' },
        { key: 'Load Current Rating', value: '32A' },
        { key: 'System Voltage', value: '415VAC, 3 PHASE, 50HZ' },
        { key: 'Phase', value: '3 Phase Input, Single Phase Output' },
        { key: 'Starting Delay', value: '10 Second Starting Delay' },
        { key: 'Overload Protection', value: 'Overload Protection Through MCB' },
        { key: 'Indicators', value: 'R, Y, B Phase Status LEDs' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure' },
        { key: 'Application', value: 'For Domestic & Commercial Use' }
      ],
      images: [],
      displayOrder: 1,
      isActive: true
    },

    // --- GELCO GURUU: 50A Model ---
    {
      name: 'Gelco Guruu Electronic Auto Phase Changer 50A',
      model: 'GELCO-GURUU-50A',
      category: phaseChangerCategory._id,
      shortDescription: 'Heavy-duty 50A 3-phase automatic phase changer with front MCBs, 10s starting delay, and automatic healthy-phase transfer.',
      description: 'The Gelco Guruu 50A Electronic Auto Phase Changer provides dependable 50A continuous capacity for large residences, commercial complexes, and institutions. In case of any phase failure on the grid, it immediately switches connected loads to an active healthy phase, returning smoothly when the normal phase is restored. Includes triple front MCB protection, 10-second pre-start delay, R-Y-B status lamps, and an industrial powder-coated metal housing.',
      features: [
        'High-Capacity 50A Load Current Rating',
        'Automatic Load Transfer to Healthy Phase on Phase Failure',
        'Automatic Return to Original Phase on Power Resumption',
        'Front-Facing MCB Overload & Short Circuit Protection',
        '10-Second Starting Time Delay preventing line startup surges',
        'R, Y, B Status Indicator Lamps',
        'Powder Coated Sheet Metal Enclosure'
      ],
      specifications: [
        { key: 'Model', value: 'GELCO GURUU 50A' },
        { key: 'Load Current Rating', value: '50A' },
        { key: 'System Voltage', value: '415VAC, 3 PHASE, 50HZ' },
        { key: 'Phase', value: '3 Phase Input, Single Phase Output' },
        { key: 'Starting Delay', value: '10 Second Starting Delay' },
        { key: 'Overload Protection', value: 'Overload Protection Through MCB' },
        { key: 'Indicators', value: 'R, Y, B Phase Status LEDs' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure' },
        { key: 'Application', value: 'For Domestic & Commercial Use' }
      ],
      images: [],
      displayOrder: 2,
      isActive: true
    },

    // --- GELCO GURUU: 63A Model ---
    {
      name: 'Gelco Guruu Electronic Auto Phase Changer 63A',
      model: 'GELCO-GURUU-63A',
      category: phaseChangerCategory._id,
      shortDescription: 'Industrial 63A 3-phase automatic phase changer with triple MCBs, 10s starting delay, and uninterrupted healthy-phase transfer.',
      description: 'The Gelco Guruu 63A is the highest capacity automatic phase changer in the lineup, engineered to maintain uninterrupted single-phase power for 63A loads across entire commercial floors, diagnostic labs, hospitals, and luxury apartments. Guarantees zero downtime by instantly transferring load to healthy phases during single-phase line drops. Equipped with robust 63A MCB overload breakers, 10s surge delay, R-Y-B indicators, and heavy-duty steel cabinet.',
      features: [
        'Maximum 63A Continuous Load Current Capacity',
        'Automatic Load Transfer to Healthy Phase on Phase Failure',
        'Automatic Return to Original Phase on Power Resumption',
        'Front-Facing MCB Overload & Short Circuit Protection',
        '10-Second Starting Time Delay preventing line startup surges',
        'R, Y, B Status Indicator Lamps',
        'Powder Coated Sheet Metal Enclosure'
      ],
      specifications: [
        { key: 'Model', value: 'GELCO GURUU 63A' },
        { key: 'Load Current Rating', value: '63A' },
        { key: 'System Voltage', value: '415VAC, 3 PHASE, 50HZ' },
        { key: 'Phase', value: '3 Phase Input, Single Phase Output' },
        { key: 'Starting Delay', value: '10 Second Starting Delay' },
        { key: 'Overload Protection', value: 'Overload Protection Through MCB' },
        { key: 'Indicators', value: 'R, Y, B Phase Status LEDs' },
        { key: 'Enclosure', value: 'Powder Coated Sheet Metal Enclosure' },
        { key: 'Application', value: 'For Domestic & Commercial Use' }
      ],
      images: [],
      displayOrder: 3,
      isActive: true
    }
  ];

  for (const item of products) {
    const existing = await Product.findOne({ model: item.model });
    if (existing) {
      await Product.findByIdAndUpdate(existing._id, item, { runValidators: true });
      console.log('Updated:', item.name);
    } else {
      await Product.create(item);
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
