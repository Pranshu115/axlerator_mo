// Script to seed Supabase database with ALL 30 trucks (Truck 2-31)
// Arranged by location: Maharashtra → Delhi → Chandigarh
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// All 30 trucks arranged by location: Maharashtra → Delhi → Chandigarh
const trucks = [
  // ========== MAHARASHTRA (Trucks 2-16) ==========
  // Truck 2: Eicher PRO 2110 - Maharashtra
  {
    name: 'Eicher PRO 2110',
    manufacturer: 'Eicher Motors',
    model: 'PRO 2110',
    year: 2023,
    kilometers: 12000,
    horsepower: 110,
    price: 1650000,
    image_url: '/trucks/eicher-truck-1.webp',
    subtitle: 'Compact and efficient for city deliveries.',
    certified: true,
    location: 'Mumbai (MH-01)',
    city: 'Mumbai',
    state: 'Maharashtra'
  },
  // Truck 3: Eicher 1059 Xp - Maharashtra
  {
    name: 'Eicher 1059 Xp',
    manufacturer: 'Eicher Motors',
    model: '1059 Xp',
    year: 2022,
    kilometers: 25000,
    horsepower: 100,
    price: 1450000,
    image_url: '/trucks/truck3-image-2.png',
    subtitle: 'Reliable and fuel-efficient.',
    certified: true,
    location: 'Pune (MH-12)',
    city: 'Pune',
    state: 'Maharashtra'
  },
  // Truck 4: Tata 1512 LPT - Maharashtra
  {
    name: 'Tata 1512 LPT',
    manufacturer: 'Tata Motors',
    model: '1512 LPT',
    year: 2022,
    kilometers: 30000,
    horsepower: 150,
    price: 2250000,
    image_url: '/trucks/truck4-image-1.png',
    subtitle: 'Versatile medium duty truck.',
    certified: true,
    location: 'Mumbai (MH-02)',
    city: 'Mumbai',
    state: 'Maharashtra'
  },
  // Truck 5: Eicher Pro 3015 - Maharashtra
  {
    name: 'Eicher Pro 3015',
    manufacturer: 'Eicher Motors',
    model: 'Pro 3015',
    year: 2023,
    kilometers: 10000,
    horsepower: 150,
    price: 1890000,
    image_url: '/trucks/truck5-image-2.png',
    subtitle: 'Modern design with excellent fuel economy.',
    certified: true,
    location: 'Nagpur (MH-31)',
    city: 'Nagpur',
    state: 'Maharashtra'
  },
  // Truck 6: Eicher Pro 3019 - Maharashtra
  {
    name: 'Eicher Pro 3019',
    manufacturer: 'Eicher Motors',
    model: 'Pro 3019',
    year: 2022,
    kilometers: 28000,
    horsepower: 190,
    price: 2100000,
    image_url: '/trucks/truck6-image-2.jpg',
    subtitle: 'Powerful and efficient.',
    certified: true,
    location: 'Nashik (MH-15)',
    city: 'Nashik',
    state: 'Maharashtra'
  },
  // Truck 7: Tata 3518 - Maharashtra
  {
    name: 'Tata 3518',
    manufacturer: 'Tata Motors',
    model: '3518',
    year: 2021,
    kilometers: 45000,
    horsepower: 180,
    price: 3200000,
    image_url: '/trucks/truck7-image-2.png',
    subtitle: 'Heavy-duty truck for long hauls.',
    certified: true,
    location: 'Thane (MH-04)',
    city: 'Thane',
    state: 'Maharashtra'
  },
  // Truck 8: Eicher PRO 2110 (second one) - Maharashtra
  {
    name: 'Eicher PRO 2110',
    manufacturer: 'Eicher Motors',
    model: 'PRO 2110',
    year: 2022,
    kilometers: 22000,
    horsepower: 110,
    price: 1580000,
    image_url: '/trucks/truck8-image-1.png',
    subtitle: 'Compact and efficient for city deliveries.',
    certified: true,
    location: 'Aurangabad (MH-20)',
    city: 'Aurangabad',
    state: 'Maharashtra'
  },
  // Truck 9: Tata Truck - Maharashtra
  {
    name: 'Tata LPT Truck',
    manufacturer: 'Tata Motors',
    model: 'LPT',
    year: 2021,
    kilometers: 35000,
    horsepower: 130,
    price: 1950000,
    image_url: '/trucks/truck9-image-1.png',
    subtitle: 'Versatile commercial vehicle.',
    certified: true,
    location: 'Solapur (MH-13)',
    city: 'Solapur',
    state: 'Maharashtra'
  },
  // Truck 10: Tata LPT-1109-HEX2 - Maharashtra
  {
    name: 'Tata LPT-1109-HEX2',
    manufacturer: 'Tata Motors',
    model: 'LPT-1109-HEX2',
    year: 2022,
    kilometers: 20000,
    horsepower: 109,
    price: 1750000,
    image_url: '/trucks/truck10-image-1.jpg',
    subtitle: 'Efficient and reliable.',
    certified: true,
    location: 'Kolhapur (MH-09)',
    city: 'Kolhapur',
    state: 'Maharashtra'
  },
  // Truck 11: Eicher Truck - Maharashtra
  {
    name: 'Eicher Pro Truck',
    manufacturer: 'Eicher Motors',
    model: 'Pro',
    year: 2023,
    kilometers: 15000,
    horsepower: 120,
    price: 1720000,
    image_url: '/trucks/truck11-image-1.png',
    subtitle: 'Modern and efficient.',
    certified: true,
    location: 'Sangli (MH-10)',
    city: 'Sangli',
    state: 'Maharashtra'
  },
  // Truck 12: Tata LPT-3118 - Maharashtra
  {
    name: 'Tata LPT-3118',
    manufacturer: 'Tata Motors',
    model: 'LPT-3118',
    year: 2021,
    kilometers: 40000,
    horsepower: 118,
    price: 2450000,
    image_url: '/trucks/truck12-image-1.png',
    subtitle: 'Powerful medium-duty truck.',
    certified: true,
    location: 'Satara (MH-11)',
    city: 'Satara',
    state: 'Maharashtra'
  },
  // Truck 13: Eicher Truck - Maharashtra
  {
    name: 'Eicher Pro 2059',
    manufacturer: 'Eicher Motors',
    model: 'Pro 2059',
    year: 2022,
    kilometers: 30000,
    horsepower: 59,
    price: 1250000,
    image_url: '/trucks/truck13-image-1.png',
    subtitle: 'Compact and efficient.',
    certified: true,
    location: 'Jalgaon (MH-19)',
    city: 'Jalgaon',
    state: 'Maharashtra'
  },
  // Truck 14: Ashok Leyland Partner 1114 - Maharashtra
  {
    name: 'Ashok Leyland Partner 1114',
    manufacturer: 'Ashok Leyland',
    model: 'Partner 1114',
    year: 2021,
    kilometers: 38000,
    horsepower: 114,
    price: 2150000,
    image_url: '/trucks/truck14-image-1.png',
    subtitle: 'Reliable partner for your business.',
    certified: true,
    location: 'Akola (MH-30)',
    city: 'Akola',
    state: 'Maharashtra'
  },
  // Truck 15: Ashok Leyland 1615 - Maharashtra
  {
    name: 'Ashok Leyland 1615',
    manufacturer: 'Ashok Leyland',
    model: '1615',
    year: 2022,
    kilometers: 32000,
    horsepower: 115,
    price: 2350000,
    image_url: '/trucks/truck15-image-1.png',
    subtitle: 'Powerful and durable.',
    certified: true,
    location: 'Amravati (MH-27)',
    city: 'Amravati',
    state: 'Maharashtra'
  },
  // Truck 16: Eicher PRO 2114 XP - Maharashtra
  {
    name: 'Eicher PRO 2114 XP',
    manufacturer: 'Eicher Motors',
    model: 'PRO 2114 XP',
    year: 2023,
    kilometers: 18000,
    horsepower: 114,
    price: 1780000,
    image_url: '/trucks/truck16-image-1.png',
    subtitle: 'Extended power for heavy loads.',
    certified: true,
    location: 'Latur (MH-24)',
    city: 'Latur',
    state: 'Maharashtra'
  },

  // ========== DELHI (Trucks 17-25) ==========
  // Truck 17: Ashok Leyland Ecomet 1214 - Delhi
  {
    name: 'Ashok Leyland Ecomet 1214',
    manufacturer: 'Ashok Leyland',
    model: 'Ecomet 1214',
    year: 2022,
    kilometers: 28000,
    horsepower: 114,
    price: 2280000,
    image_url: '/trucks/truck17-image-1.png',
    subtitle: 'Eco-friendly and efficient.',
    certified: true,
    location: 'Delhi (DL-01)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 18: Eicher Pro 2059VD - Delhi
  {
    name: 'Eicher Pro 2059VD',
    manufacturer: 'Eicher Motors',
    model: 'Pro 2059VD',
    year: 2021,
    kilometers: 42000,
    horsepower: 59,
    price: 1180000,
    image_url: '/trucks/truck18-image-1.png',
    subtitle: 'Versatile and durable.',
    certified: true,
    location: 'Delhi (DL-02)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 19: Eicher Pro 2118 - Delhi
  {
    name: 'Eicher Pro 2118',
    manufacturer: 'Eicher Motors',
    model: 'Pro 2118',
    year: 2022,
    kilometers: 35000,
    horsepower: 118,
    price: 1850000,
    image_url: '/trucks/truck19-image-1.png',
    subtitle: 'Powerful and reliable.',
    certified: true,
    location: 'Delhi (DL-03)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 20: Tata 1613 CRi6 - Delhi
  {
    name: 'Tata 1613 CRi6',
    manufacturer: 'Tata Motors',
    model: '1613 CRi6',
    year: 2023,
    kilometers: 12000,
    horsepower: 113,
    price: 2050000,
    image_url: '/trucks/truck20-image-1.png',
    subtitle: 'Advanced technology and efficiency.',
    certified: true,
    location: 'Delhi (DL-04)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 21: Eicher Pro 2059XP - Delhi
  {
    name: 'Eicher Pro 2059XP',
    manufacturer: 'Eicher Motors',
    model: 'Pro 2059XP',
    year: 2022,
    kilometers: 30000,
    horsepower: 59,
    price: 1280000,
    image_url: '/trucks/truck21-image-1.png',
    subtitle: 'Extended power variant.',
    certified: true,
    location: 'Delhi (DL-05)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 22: Tata Truck - Delhi
  {
    name: 'Tata Commercial Truck',
    manufacturer: 'Tata Motors',
    model: 'Commercial',
    year: 2021,
    kilometers: 40000,
    horsepower: 100,
    price: 1650000,
    image_url: '/trucks/truck22-image-1.png',
    subtitle: 'Versatile commercial vehicle.',
    certified: true,
    location: 'Delhi (DL-06)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 23: Ashok Leyland Pick-up - Delhi
  {
    name: 'Ashok Leyland Pick-up',
    manufacturer: 'Ashok Leyland',
    model: 'Pick-up',
    year: 2022,
    kilometers: 25000,
    horsepower: 75,
    price: 950000,
    image_url: '/trucks/truck23-image-1.png',
    subtitle: 'Perfect for last-mile delivery.',
    certified: true,
    location: 'Delhi (DL-07)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 24: Eicher Truck - Delhi
  {
    name: 'Eicher Pro 3012',
    manufacturer: 'Eicher Motors',
    model: 'Pro 3012',
    year: 2021,
    kilometers: 45000,
    horsepower: 112,
    price: 1680000,
    image_url: '/trucks/truck24-image-1.png',
    subtitle: 'Reliable workhorse.',
    certified: true,
    location: 'Delhi (DL-08)',
    city: 'Delhi',
    state: 'Delhi'
  },
  // Truck 25: SML Isuzu Truck - Delhi
  {
    name: 'SML Isuzu Truck',
    manufacturer: 'SML Isuzu',
    model: 'Truck',
    year: 2022,
    kilometers: 30000,
    horsepower: 92,
    price: 1950000,
    image_url: '/trucks/truck25-image-1.png',
    subtitle: 'Japanese quality and reliability.',
    certified: true,
    location: 'Delhi (DL-09)',
    city: 'Delhi',
    state: 'Delhi'
  },

  // ========== CHANDIGARH (Trucks 26-31) ==========
  // Truck 26: Eicher 2059 - Chandigarh
  {
    name: 'Eicher 2059',
    manufacturer: 'Eicher Motors',
    model: '2059',
    year: 2021,
    kilometers: 52000,
    horsepower: 59,
    price: 1100000,
    image_url: '/trucks/truck26-image-1.png',
    subtitle: 'Compact and efficient.',
    certified: true,
    location: 'Chandigarh (CH-01)',
    city: 'Chandigarh',
    state: 'Chandigarh'
  },
  // Truck 27: Eicher 2059 xp - Chandigarh
  {
    name: 'Eicher 2059 xp',
    manufacturer: 'Eicher Motors',
    model: '2059 xp',
    year: 2022,
    kilometers: 72000,
    horsepower: 59,
    price: 1050000,
    image_url: '/trucks/truck27-image-1.png',
    subtitle: 'Extended power variant.',
    certified: true,
    location: 'Chandigarh (CH-01)',
    city: 'Chandigarh',
    state: 'Chandigarh'
  },
  // Truck 28: Tata 709 LPT - Chandigarh
  {
    name: 'Tata 709 LPT',
    manufacturer: 'Tata Motors',
    model: '709 LPT',
    year: 2021,
    kilometers: 87000,
    horsepower: 70,
    price: 850000,
    image_url: '/trucks/truck28-image-1.png',
    subtitle: 'Light commercial vehicle.',
    certified: true,
    location: 'Chandigarh (CH-01)',
    city: 'Chandigarh',
    state: 'Chandigarh'
  },
  // Truck 29: Tata 709 G LPT - Chandigarh
  {
    name: 'Tata 709 G LPT',
    manufacturer: 'Tata Motors',
    model: '709 G LPT',
    year: 2022,
    kilometers: 83900,
    horsepower: 70,
    price: 920000,
    image_url: '/trucks/truck29-image-1.png',
    subtitle: 'Upgraded light commercial vehicle.',
    certified: true,
    location: 'Chandigarh (CH-01)',
    city: 'Chandigarh',
    state: 'Chandigarh'
  },
  // Truck 30: Tata 1109 G LPT - Chandigarh
  {
    name: 'Tata 1109 G LPT',
    manufacturer: 'Tata Motors',
    model: '1109 G LPT',
    year: 2020,
    kilometers: 87000,
    horsepower: 109,
    price: 1450000,
    image_url: '/trucks/truck30-image-1.png',
    subtitle: 'Reliable medium-duty truck.',
    certified: true,
    location: 'Chandigarh (CH-01)',
    city: 'Chandigarh',
    state: 'Chandigarh'
  },
  // Truck 31: Tata 1512 LPT - Chandigarh
  {
    name: 'Tata 1512 LPT',
    manufacturer: 'Tata Motors',
    model: '1512 LPT',
    year: 2022,
    kilometers: 73000,
    horsepower: 150,
    price: 2100000,
    image_url: '/trucks/truck31-image-1.png',
    subtitle: 'Versatile medium duty truck.',
    certified: true,
    location: 'Chandigarh (CH-01)',
    city: 'Chandigarh',
    state: 'Chandigarh'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting to seed Supabase database with ALL 30 trucks...');
  console.log(`📊 Found ${trucks.length} trucks to insert\n`);
  console.log('📍 Arranged by location: Maharashtra → Delhi → Chandigarh\n');

  // Clear existing trucks
  console.log('🗑️  Clearing existing trucks...');
  const { error: deleteError } = await supabase
    .from('trucks')
    .delete()
    .neq('id', 0);

  if (deleteError) {
    console.warn('⚠️  Warning: Could not clear existing trucks:', deleteError.message);
  } else {
    console.log('✅ Cleared existing trucks\n');
  }

  // Insert trucks
  console.log('📥 Inserting trucks into database...');
  let successCount = 0;
  let errorCount = 0;

  for (const truck of trucks) {
    const { data, error } = await supabase
      .from('trucks')
      .insert(truck)
      .select();

    if (error) {
      console.error(`❌ Error inserting ${truck.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Inserted: ${truck.name} (${truck.state})`);
      successCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Seeding Summary:');
  console.log(`✅ Successfully inserted: ${successCount} trucks`);
  if (errorCount > 0) {
    console.log(`❌ Failed to insert: ${errorCount} trucks`);
  }
  console.log('='.repeat(50));

  if (successCount === trucks.length) {
    console.log('\n🎉 All 30 trucks seeded successfully!');
    console.log('📍 Order: Maharashtra → Delhi → Chandigarh');
    console.log('👉 Your trucks should now appear in the browse section.');
  } else {
    console.log('\n⚠️  Some trucks failed to insert. Check the errors above.');
  }
}

seedDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
