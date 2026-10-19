require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');

const CATEGORIES = [
  { name: 'Earth Leakage Circuit Breakers', description: 'ELCB protection devices for residential and commercial installations.', displayOrder: 1 },
  { name: 'Regulators', description: 'Fan and appliance speed regulators.', displayOrder: 2 },
  { name: 'Indoor Lights', description: 'Energy-efficient LED and CFL indoor lighting solutions.', displayOrder: 3 },
  { name: 'Voltage Stabilizers', description: 'Voltage stabilizers for home and industrial appliances.', displayOrder: 4 },
  { name: 'Water Level Controllers', description: 'Automatic water level controllers for tanks and pumps.', displayOrder: 5 },
  { name: 'Starters', description: 'Motor starters for single and three phase motors.', displayOrder: 6 },
  { name: 'Timers', description: 'Digital and analog timers for automation and control.', displayOrder: 7 },
  { name: 'Panels', description: 'Distribution and control panel boards.', displayOrder: 8 },
  { name: 'Phase Failure Relays', description: 'Protection relays for three-phase motors against phase failure.', displayOrder: 9 },
  { name: 'Over Voltage Protectors', description: 'Devices that protect appliances from over-voltage conditions.', displayOrder: 10 },
  { name: 'Auto Switch', description: 'Automatic changeover switches for power backup systems.', displayOrder: 11 },
  { name: 'Auto Photo', description: 'Automatic photocell switches for street and outdoor lighting.', displayOrder: 12 },
  { name: 'Volt / Amp Meter', description: 'Digital and analog panel meters for voltage and current measurement.', displayOrder: 13 },
  { name: 'Phase Changer', description: 'Automatic phase sequence correctors and changers.', displayOrder: 14 },
];

const seed = async () => {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');

  let created = 0, skipped = 0;
  for (const cat of CATEGORIES) {
    const exists = await Category.findOne({ name: cat.name });
    if (exists) { skipped++; continue; }
    await Category.create(cat);
    created++;
    console.log(`   ✔ ${cat.name}`);
  }

  console.log(`
Done! Created: ${created}, Skipped: ${skipped}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
