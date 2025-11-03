// src/components/Product/productsData.js
export const categoryHierarchy = {
  Topwear: {
    'T-Shirts': {
      'Plain / Basic T-Shirts': {},
      'Graphic / Printed T-Shirts': {},
      'Polo T-Shirts': {},
      'Oversized / Relaxed Fit T-Shirts': {},
      'Tank / Sleeveless Tops': {},
      'Long-Sleeve Tees': {},
    },
    Shirts: {
      'Formal / Office Shirts': {},
      'Casual Shirts': {},
      'Designer / Premium Shirts': {},
      'Linen / Breathable Fabric Shirts': {},
      'Half‐Sleeve Shirts': {},
      'Check / Printed / Patterned Shirts': {},
    },
    'Sweatshirts / Hoodies / Pullovers': {
      'Hooded Sweatshirts': {},
      'Crew-Neck Sweatshirts': {},
      'Zip & Half-Zip Sweatshirts': {},
    },
    'Jackets & Outerwear': {
      'Light Jackets (Bomber, Windbreaker, etc)': {},
      'Denim Jackets': {},
      'Leather / Faux-Leather Jackets': {},
      'Parkas / Winter Coats': {},
      'Blazers & Sport Coats (if applicable)': {},
    },
    'Ethnic / Traditional Tops (if you carry)': {
      'Kurta / Ethnic Shirts': {},
      'Nehru / Mandarins / Band-Collar Shirts': {},
    }
  },
  Bottomwear: {
    Jeans: {
      'Slim Fit Jeans': {},
      'Straight Fit Jeans': {},
      'Relaxed / Loose Fit Jeans': {},
      'Distressed / Washed Jeans': {},
      'Ankle Fit / Tapered': {},
    },
    'Trousers & Chinos': {
      'Chino Pants': {},
      'Linen Trousers': {},
      'Corduroy Pants': {},
      'Formal Trousers': {},
      'Gurkha / Pleated styles': {},
    },
    Shorts: {
      'Casual Shorts': {},
      'Cargo Shorts': {},
      'Linen Shorts': {},
      'Knee-length / above-knee': {},
    },
    'Joggers / Sweatpants': {
      'Regular Joggers': {},
      'Cargo Joggers': {},
      'Lounge / Athleisure Pants': {},
    }
  },
  'Underwear, Loungewear & Nightwear': {
    Underwear: {
      'Briefs / Boxers / Boxer-Briefs': {},
      'Trunks': {},
    },
    'Loungewear / Homewear': {
      'Lounge Pants': {},
      'Shorts': {},
      'Lounge Shirts / Tees': {},
    },
    Nightwear: {
      'Pyjamas': {},
      'Night Tees': {},
    }
  },
  'Activewear / Sportswear': {
    'Active T-Shirts / Tees': {},
    'Track Pants / Sweat Pants': {},
    'Gym Shorts': {},
    'Hoodie / Sweatshirt (sports)': {},
    'Jacket / Windbreaker (sports)': {},
  },
  Accessories: {
    'Belts': {},
    Sunglasses: {},
    'Scarves / Mufflers': {},
    Socks: {},
    Towels: {},
  },
  'Seasonal / Special Collections': {
    'Winter Wear (e.g., Sweaters, Coats, Thermal Layers)': {},
    'Summer Essentials (e.g., Linen, Shorts)': {},
    'Festive / Designer Drop': {},
    'Co-ords / Matching Sets': {},
  },
  'New Arrivals': {},
  'Best Sellers': {},
  'Sale / Clearance': {},
  'Trending Now': {},
};

export const defaultTopwearSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
export const defaultBottomwearSizes = ['28', '30', '32', '34', '36', '38', '40'];

export const materials = [
  '100% Cotton',
  '240 GSM Cotton',
  'Cotton Blend',
  'Cotton-Elastane',
  'Polyester',
  'Polyester-Spandex',
  'Leather',
  'Suede',
  'PU + Rubber',
  'Fleece',
  'Linen',
  'Wool',
  'Silk',
  'Denim',
  'Jersey'
];

export const fitTypes = [
  'Slim',
  'Regular',
  'Oversized',
  'Relaxed',
  'Athletic',
  'Tapered',
  'Straight'
];

export const occasions = [
  'Casual',
  'Formal',
  'Sports / Gym',
  'Work / Casual',
  'Athleisure',
  'Streetwear',
  'Everyday',
  'Semi-Casual',
  'Outdoor'
];

export const colors = [
  'White',
  'Black',
  'Grey',
  'Graphite Grey',
  'Navy',
  'Blue',
  'Indigo Blue',
  'Sand Beige',
  'Brown',
  'Tan',
  'Red',
  'Green',
  'Yellow',
  'Pink',
  'Purple',
  'Orange',
  'Multi-color'
];

export const products = [
  {
    id: 1,
    title: 'Classic Crew-Neck Cotton T-Shirt',
    category: 'Topwear',
    subCategory: 'T-Shirts',
    childCategory: 'Plain / Basic T-Shirts',
    description: 'Soft 180 GSM cotton tee with clean finish; perfect daily essential.',
    material: '100% Cotton',
    fitType: 'Regular',
    occasion: 'Casual',
    color: 'White',
    sizes: 'S,M,L,XL,XXL',
    mrp: '₹899',
    sellingPrice: '₹699',
    stockQty: 22,
    images: 'tshirt_white_001.jpg',
    careInstructions: 'Machine wash cold',
    metaKeywords: 'men t-shirt, cotton tee',
    metaDescription: 'Men\'s basic crew neck cotton T-shirt, daily wear essential.',
    variations: [
      { color: 'White', size: 'S', stock: 5 },
      { color: 'White', size: 'M', stock: 6 },
      { color: 'White', size: 'L', stock: 5 },
      { color: 'White', size: 'XL', stock: 3 },
      { color: 'White', size: 'XXL', stock: 3 }
    ]
  },
  {
    id: 2,
    title: 'Oversized Drop Shoulder T-Shirt – Graphite Grey',
    category: 'Topwear',
    subCategory: 'T-Shirts',
    childCategory: 'Oversized / Relaxed Fit T-Shirts',
    description: 'Trendy relaxed fit with heavy GSM cotton and streetwear silhouette.',
    material: '240 GSM Cotton',
    fitType: 'Oversized',
    occasion: 'Casual / Streetwear',
    color: 'Graphite Grey',
    sizes: 'M,L,XL,XXL',
    mrp: '₹1299',
    sellingPrice: '₹999',
    stockQty: 15,
    images: 'oversized_tshirt_grey.jpg',
    careInstructions: 'Machine wash warm',
    metaKeywords: 'oversized t-shirt, men streetwear',
    metaDescription: 'Drop shoulder oversized t-shirt in grey for urban street look.',
    variations: [
      { color: 'Graphite Grey', size: 'M', stock: 4 },
      { color: 'Graphite Grey', size: 'L', stock: 4 },
      { color: 'Graphite Grey', size: 'XL', stock: 4 },
      { color: 'Graphite Grey', size: 'XXL', stock: 3 }
    ]
  },
  {
    id: 3,
    title: 'Premium Twill Formal Shirt',
    category: 'Topwear',
    subCategory: 'Shirts',
    childCategory: 'Formal / Office Shirts',
    description: 'Wrinkle-resistant formal shirt with stretch comfort fabric.',
    material: 'Cotton Blend',
    fitType: 'Slim',
    occasion: 'Formal',
    color: 'White',
    sizes: 'S,M,L,XL',
    mrp: '₹2199',
    sellingPrice: '₹1799',
    stockQty: 30,
    images: 'formal_shirt_white.jpg',
    careInstructions: 'Dry clean preferred',
    metaKeywords: 'men formal shirt',
    metaDescription: 'White premium twill shirt ideal for business formals.',
    variations: [
      { color: 'White', size: 'S', stock: 7 },
      { color: 'White', size: 'M', stock: 8 },
      { color: 'White', size: 'L', stock: 8 },
      { color: 'White', size: 'XL', stock: 7 }
    ]
  },
  {
    id: 4,
    title: 'Slim Fit Stretch Denim Jeans',
    category: 'Bottomwear',
    subCategory: 'Jeans',
    childCategory: 'Slim Fit Jeans',
    description: 'Soft stretch denim with faded wash for a modern look.',
    material: 'Cotton-Elastane',
    fitType: 'Slim',
    occasion: 'Casual',
    color: 'Indigo Blue',
    sizes: '28,30,32,34,36,38',
    mrp: '₹2499',
    sellingPrice: '₹1999',
    stockQty: 25,
    images: 'jeans_indigo.jpg',
    careInstructions: 'Machine wash cold',
    metaKeywords: 'men jeans, slim fit',
    metaDescription: 'Slim fit stretch denim jeans with modern fade.',
    variations: [
      { color: 'Indigo Blue', size: '28', stock: 4 },
      { color: 'Indigo Blue', size: '30', stock: 4 },
      { color: 'Indigo Blue', size: '32', stock: 5 },
      { color: 'Indigo Blue', size: '34', stock: 4 },
      { color: 'Indigo Blue', size: '36', stock: 4 },
      { color: 'Indigo Blue', size: '38', stock: 4 }
    ]
  },
  {
    id: 5,
    title: 'Flat-Front Cotton Chinos',
    category: 'Bottomwear',
    subCategory: 'Trousers & Chinos',
    childCategory: 'Chino Pants',
    description: 'Lightweight twill chinos ideal for office & casual wear.',
    material: '100% Cotton',
    fitType: 'Regular',
    occasion: 'Work / Casual',
    color: 'Sand Beige',
    sizes: '30,32,34,36,38',
    mrp: '₹2299',
    sellingPrice: '₹1799',
    stockQty: 20,
    images: 'chinos_beige.jpg',
    careInstructions: 'Machine wash warm',
    metaKeywords: 'men chinos, cotton pants',
    metaDescription: 'Classic beige chinos for all-day comfort and style.',
    variations: [
      { color: 'Sand Beige', size: '30', stock: 4 },
      { color: 'Sand Beige', size: '32', stock: 4 },
      { color: 'Sand Beige', size: '34', stock: 4 },
      { color: 'Sand Beige', size: '36', stock: 4 },
      { color: 'Sand Beige', size: '38', stock: 4 }
    ]
  },
  {
    id: 6,
    title: 'Genuine Leather Belt',
    category: 'Accessories',
    subCategory: 'Belts',
    childCategory: '',
    description: 'Full-grain leather belt with brushed metal buckle.',
    material: 'Leather',
    fitType: 'Regular',
    occasion: 'Formal / Casual',
    color: 'Brown',
    sizes: 'Free Size',
    mrp: '₹1299',
    sellingPrice: '₹999',
    stockQty: 40,
    images: 'belt_brown.jpg',
    careInstructions: 'Wipe clean only',
    metaKeywords: 'men leather belt',
    metaDescription: 'Classic leather belt with durable metal buckle.',
    variations: [
      { color: 'Brown', size: 'Free Size', stock: 40 }
    ]
  }
];