export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919824740023';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const COMPANY = {
  name:       'GELCO PLUS ELECTRICALS',
  tagline:    'Reliable Electrical Solutions for Every Requirement',
  contact:    'Paresh Bhai Patel',
  phone:      '9824740023',
  phoneDisplay: '+91 98247 40023',
  email:      'gelcopluselectricals@gmail.com',
  address:    'D7, Nilesh Park, Plot No. 80, Near Ganesh Juice Corner, Sector-8, Gandhidham',
  city:       'Gandhidham, Gujarat',
  whatsapp:   WHATSAPP_NUMBER,
};

export const NAV_LINKS = [
  { label: 'Home',       path: '/' },
  { label: 'Products',   path: '/products' },
  { label: 'Categories', path: '/categories' },
  { label: 'Query',      path: '/query' },
  { label: 'Contact',    path: '/contact' },
];

export const PRODUCT_CATEGORIES = [
  'Earth Leakage Circuit Breakers',
  'Regulators',
  'Indoor Lights',
  'Voltage Stabilizers',
  'Water Level Controllers',
  'Starters',
  'Timers',
  'Panels',
  'Phase Failure Relays',
  'Over Voltage Protectors',
  'Auto Switch',
  'Auto Photo',
  'Volt / Amp Meter',
  'Phase Changer',
];