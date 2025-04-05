import { Category, Product, Stock, mockProducts, mockCategories, mockStocks } from "@/modules/inventory/types";

// Interface for category value data in stock reports
export interface CategoryValueData {
  id: string;
  name: string;
  value: number;
  percentage: number;
  itemCount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

// Generate more comprehensive dummy data for pharmacy categories
export const generateExtendedCategoryData = (): CategoryValueData[] => {
  return [
    {
      id: 'cat1',
      name: 'Obat Resep (Ethical)',
      value: 356789000,
      percentage: 28.5,
      itemCount: 148,
      trend: 'up',
      trendPercentage: 4.7
    },
    {
      id: 'cat2',
      name: 'Obat Bebas (OTC)',
      value: 287450000,
      percentage: 23.0,
      itemCount: 185,
      trend: 'up',
      trendPercentage: 2.3
    },
    {
      id: 'cat3',
      name: 'Obat Bebas Terbatas',
      value: 198320000,
      percentage: 15.8,
      itemCount: 67,
      trend: 'down',
      trendPercentage: 1.8
    },
    {
      id: 'cat4',
      name: 'Suplemen & Vitamin',
      value: 156780000,
      percentage: 12.5,
      itemCount: 93,
      trend: 'up',
      trendPercentage: 8.2
    },
    {
      id: 'cat5',
      name: 'Herbal & Tradisional',
      value: 87230000,
      percentage: 7.0,
      itemCount: 54,
      trend: 'stable',
      trendPercentage: 0.5
    },
    {
      id: 'cat6',
      name: 'Alat Kesehatan',
      value: 75650000,
      percentage: 6.0,
      itemCount: 42,
      trend: 'up',
      trendPercentage: 12.8
    },
    {
      id: 'cat7',
      name: 'Kosmetik Medis',
      value: 45890000,
      percentage: 3.7,
      itemCount: 38,
      trend: 'down',
      trendPercentage: 5.3
    },
    {
      id: 'cat8',
      name: 'Produk Bayi & Anak',
      value: 32450000,
      percentage: 2.6,
      itemCount: 25,
      trend: 'up',
      trendPercentage: 3.1
    },
    {
      id: 'cat9',
      name: 'Nutrisi Khusus',
      value: 12340000,
      percentage: 0.9,
      itemCount: 12,
      trend: 'down',
      trendPercentage: 2.4
    }
  ];
};

// Generate extended product stock value data
export const generateExtendedProductData = () => {
  return [
    {
      id: 'prod001',
      name: 'Amoxicillin 500mg',
      sku: 'AMX500',
      categoryId: 'cat1',
      categoryName: 'Obat Resep (Ethical)',
      currentStock: 2500,
      price: 42000,
      value: 105000000,
      expiryDate: new Date('2025-07-15')
    },
    {
      id: 'prod002',
      name: 'Paracetamol 500mg',
      sku: 'PCT500',
      categoryId: 'cat2',
      categoryName: 'Obat Bebas (OTC)',
      currentStock: 4200,
      price: 15000,
      value: 63000000,
      expiryDate: new Date('2026-03-22')
    },
    {
      id: 'prod003',
      name: 'Lansoprazole 30mg',
      sku: 'LNS030',
      categoryId: 'cat1',
      categoryName: 'Obat Resep (Ethical)',
      currentStock: 950,
      price: 65000,
      value: 61750000,
      expiryDate: new Date('2025-11-08')
    },
    {
      id: 'prod004',
      name: 'Vitamin C 1000mg',
      sku: 'VTC1000',
      categoryId: 'cat4',
      categoryName: 'Suplemen & Vitamin',
      currentStock: 1800,
      price: 32000,
      value: 57600000,
      expiryDate: new Date('2026-02-14')
    },
    {
      id: 'prod005',
      name: 'Metformin 500mg',
      sku: 'MTF500',
      categoryId: 'cat1',
      categoryName: 'Obat Resep (Ethical)',
      currentStock: 1200,
      price: 45000,
      value: 54000000,
      expiryDate: new Date('2025-09-30')
    },
    {
      id: 'prod006',
      name: 'Omeprazole 20mg',
      sku: 'OMP020',
      categoryId: 'cat1',
      categoryName: 'Obat Resep (Ethical)',
      currentStock: 850,
      price: 58000,
      value: 49300000,
      expiryDate: new Date('2025-08-18')
    },
    {
      id: 'prod007',
      name: 'Temulawak Kapsul',
      sku: 'TML100',
      categoryId: 'cat5',
      categoryName: 'Herbal & Tradisional',
      currentStock: 1500,
      price: 28000,
      value: 42000000,
      expiryDate: new Date('2025-12-05')
    },
    {
      id: 'prod008',
      name: 'Tensimeter Digital',
      sku: 'MED-TN01',
      categoryId: 'cat6',
      categoryName: 'Alat Kesehatan',
      currentStock: 75,
      price: 485000,
      value: 36375000,
      expiryDate: null
    },
    {
      id: 'prod009',
      name: 'Simvastatin 20mg',
      sku: 'SMV020',
      categoryId: 'cat1',
      categoryName: 'Obat Resep (Ethical)',
      currentStock: 780,
      price: 42500,
      value: 33150000,
      expiryDate: new Date('2025-10-22')
    },
    {
      id: 'prod010',
      name: 'Vitamin B Complex',
      sku: 'VTBC100',
      categoryId: 'cat4',
      categoryName: 'Suplemen & Vitamin',
      currentStock: 950,
      price: 32500,
      value: 30875000,
      expiryDate: new Date('2026-01-15')
    },
    {
      id: 'prod011',
      name: 'Aspirin 80mg',
      sku: 'ASP080',
      categoryId: 'cat2',
      categoryName: 'Obat Bebas (OTC)',
      currentStock: 1800,
      price: 15500,
      value: 27900000,
      expiryDate: new Date('2025-11-28')
    },
    {
      id: 'prod012',
      name: 'Minyak Telon Plus',
      sku: 'MTL100',
      categoryId: 'cat8',
      categoryName: 'Produk Bayi & Anak',
      currentStock: 420,
      price: 65000,
      value: 27300000,
      expiryDate: new Date('2026-04-10')
    },
    {
      id: 'prod013',
      name: 'Acne Treatment Gel',
      sku: 'KSM-ACN50',
      categoryId: 'cat7',
      categoryName: 'Kosmetik Medis',
      currentStock: 350,
      price: 75000,
      value: 26250000,
      expiryDate: new Date('2025-07-28')
    },
    {
      id: 'prod014',
      name: 'Glukometer Kit',
      sku: 'MED-GL01',
      categoryId: 'cat6',
      categoryName: 'Alat Kesehatan',
      currentStock: 65,
      price: 385000,
      value: 25025000,
      expiryDate: null
    },
    {
      id: 'prod015',
      name: 'CTM 4mg',
      sku: 'CTM004',
      categoryId: 'cat3',
      categoryName: 'Obat Bebas Terbatas',
      currentStock: 1250,
      price: 18500,
      value: 23125000,
      expiryDate: new Date('2025-09-15')
    }
  ];
};

// Generate realistic stock value data by categories using extended dummy data
export const generateStockValueData = () => {
  // Use extended category and product data
  const extendedCategories = generateExtendedCategoryData();
  const extendedProducts = generateExtendedProductData();
  
  // Calculate total stock value
  const totalStockValue = extendedCategories.reduce((total, category) => total + category.value, 0);
  
  // Previous month value (for trend calculation) - simulate 3.8% less on average
  const previousTotalValue = totalStockValue * 0.962;
  
  return {
    totalStockValue,
    previousTotalValue,
    categoryValues: extendedCategories
  };
};

// Generate detailed stock value data by products
export const generateProductStockValueData = () => {
  return generateExtendedProductData();
};

// Pharmacy-specific product groups
export const getProductGroupValueData = () => {
  const groups = [
    { id: 'generic', name: 'Obat Generik', color: '#60a5fa' },
    { id: 'ethical', name: 'Obat Ethical', color: '#34d399' },
    { id: 'otc', name: 'Obat Bebas (OTC)', color: '#fcd34d' },
    { id: 'vitamin', name: 'Vitamin & Suplemen', color: '#f97316' },
    { id: 'herbal', name: 'Herbal & Tradisional', color: '#a3e635' },
    { id: 'device', name: 'Alat Kesehatan', color: '#a78bfa' },
    { id: 'beauty', name: 'Produk Kecantikan', color: '#fb7185' },
    { id: 'baby', name: 'Produk Bayi', color: '#67e8f9' }
  ];
  
  // Assign products to groups based on category and type
  const groupValues = groups.map(group => {
    let productsInGroup: Product[] = [];
    
    switch(group.id) {
      case 'generic':
        productsInGroup = mockProducts.filter(p => 
          p.productType === 'generic' || 
          (p.categoryId === '1' && !p.brand) || 
          p.name.toLowerCase().includes('generik')
        );
        break;
      case 'ethical':
        productsInGroup = mockProducts.filter(p => 
          p.productType === 'ethical' || 
          p.categoryId === '3' || 
          p.name.toLowerCase().includes('resep')
        );
        break;
      case 'otc':
        productsInGroup = mockProducts.filter(p => 
          p.productType === 'otc' || 
          (p.categoryId === '1' && p.brand) || 
          p.categoryId === '2'
        );
        break;
      case 'vitamin':
        productsInGroup = mockProducts.filter(p => 
          p.categoryId === '4' || 
          p.name.toLowerCase().includes('vitamin') || 
          p.name.toLowerCase().includes('suplemen')
        );
        break;
      case 'herbal':
        productsInGroup = mockProducts.filter(p => 
          p.productType === 'herbal' || 
          p.name.toLowerCase().includes('herbal') || 
          p.name.toLowerCase().includes('tradisional')
        );
        break;
      case 'device':
        productsInGroup = mockProducts.filter(p => 
          p.categoryId === '9' || 
          p.name.toLowerCase().includes('alat')
        );
        break;
      case 'beauty':
        productsInGroup = mockProducts.filter(p => 
          p.categoryId === '7' || 
          p.name.toLowerCase().includes('skin') || 
          p.name.toLowerCase().includes('beauty')
        );
        break;
      case 'baby':
        productsInGroup = mockProducts.filter(p => 
          p.categoryId === '8' || 
          p.name.toLowerCase().includes('baby') || 
          p.name.toLowerCase().includes('bayi')
        );
        break;
    }
    
    // Calculate value
    const value = productsInGroup.reduce((total, product) => {
      const stock = mockStocks.find(s => s.productId === product.id);
      return total + (stock?.currentStock || 0) * (product.purchasePrice || 0);
    }, 0);
    
    // Random previous value for trend
    const randomFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
    const previousValue = value * randomFactor;
    
    // Calculate trend
    const trendPercentage = previousValue > 0 
      ? ((value - previousValue) / previousValue) * 100 
      : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (trendPercentage > 2) trend = 'up';
    else if (trendPercentage < -2) trend = 'down';
    
    return {
      id: group.id,
      name: group.name,
      value,
      itemCount: productsInGroup.length,
      trend,
      trendPercentage: Math.abs(trendPercentage),
      color: group.color
    };
  }).filter(group => group.value > 0);
  
  // Calculate total value and percentages
  const totalValue = groupValues.reduce((sum, group) => sum + group.value, 0);
  
  return {
    totalValue,
    groupValues: groupValues.map(group => ({
      ...group,
      percentage: (group.value / totalValue) * 100
    }))
  };
};

// Generate location-based stock value data
export const getLocationStockValueData = () => {
  // Pharmacy-specific locations
  const locations = [
    { id: 'main', name: 'Gudang Utama' },
    { id: 'pharmacy', name: 'Area Farmasi' },
    { id: 'display', name: 'Rak Display' },
    { id: 'refrigerator', name: 'Lemari Pendingin' },
    { id: 'secure', name: 'Lemari Obat Keras' },
    { id: 'warehouse2', name: 'Gudang Cadangan' }
  ];
  
  // Assign products to locations based on type
  return locations.map(location => {
    let productsInLocation: Product[] = [];
    let locationStock = 0;
    
    // Simulate location distribution based on product properties
    switch(location.id) {
      case 'main':
        // Generic large stock items in main warehouse
        productsInLocation = mockProducts.filter(p => 
          p.productType === 'generic' || 
          p.categoryId === '5' || 
          p.categoryId === '6'
        );
        locationStock = 0.5; // 50% of stock
        break;
      case 'pharmacy':
        // Prescription and controlled items in pharmacy area
        productsInLocation = mockProducts.filter(p => 
          p.productType === 'ethical' || 
          p.categoryId === '3'
        );
        locationStock = 0.7; // 70% of stock
        break;
      case 'display':
        // OTC products on display
        productsInLocation = mockProducts.filter(p => 
          p.productType === 'otc' || 
          p.categoryId === '1' || 
          p.categoryId === '2' ||
          p.categoryId === '7' || 
          p.categoryId === '8'
        );
        locationStock = 0.8; // 80% of stock
        break;
      case 'refrigerator':
        // Items requiring refrigeration
        productsInLocation = mockProducts.filter(p => 
          p.name.toLowerCase().includes('insulin') || 
          p.name.toLowerCase().includes('vaksin') ||
          p.name.toLowerCase().includes('sirup')
        );
        locationStock = 0.9; // 90% of stock
        break;
      case 'secure':
        // Controlled substances
        productsInLocation = mockProducts.filter(p => 
          p.name.toLowerCase().includes('kodein') || 
          p.name.toLowerCase().includes('sedatif')
        );
        locationStock = 0.95; // 95% of stock
        break;
      case 'warehouse2':
        // Backup storage for all products
        productsInLocation = mockProducts;
        locationStock = 0.2; // 20% of stock
        break;
    }
    
    // Calculate value with location percentage factor
    const value = productsInLocation.reduce((total, product) => {
      const stock = mockStocks.find(s => s.productId === product.id);
      return total + ((stock?.currentStock || 0) * locationStock) * (product.purchasePrice || 0);
    }, 0);
    
    return {
      id: location.id,
      name: location.name,
      value: Math.round(value),
      itemCount: productsInLocation.length
    };
  }).filter(location => location.value > 0);
};

// Dummy warehouse and location data
export interface WarehouseData {
  id: string;
  name: string;
  code: string;
  value: number;
  itemCount: number;
  percentage?: number;
  address?: string;
  type: 'main' | 'secondary' | 'transit' | 'consignment';
  status: 'active' | 'inactive';
}

export interface LocationData {
  id: string;
  name: string;
  address: string;
  value: number;
  itemCount: number;
  percentage?: number;
  warehouses: WarehouseData[];
}

// Generate dummy locations with warehouses
export const generateLocationData = (): LocationData[] => {
  const locations: LocationData[] = [
    {
      id: 'loc-1',
      name: 'Apotek Pusat Jaksel',
      address: 'Jl. Gatot Subroto No. 42, Jakarta Selatan',
      value: 725680000,
      itemCount: 1256,
      warehouses: []
    },
    {
      id: 'loc-2',
      name: 'Cabang Kemang',
      address: 'Jl. Kemang Raya No. 15, Jakarta Selatan',
      value: 368450000,
      itemCount: 876,
      warehouses: []
    },
    {
      id: 'loc-3',
      name: 'Cabang Serpong',
      address: 'BSD City, Tangerang Selatan',
      value: 156900000,
      itemCount: 560,
      warehouses: []
    }
  ];

  // Generate warehouses for each location
  const warehouses: WarehouseData[] = [
    {
      id: 'wh-1',
      name: 'Gudang Utama',
      code: 'GU-001',
      value: 455780000,
      itemCount: 850,
      type: 'main',
      status: 'active',
      address: 'Lantai 1, Gedung Utama'
    },
    {
      id: 'wh-2',
      name: 'Gudang Sekunder',
      code: 'GS-001',
      value: 215450000,
      itemCount: 320,
      type: 'secondary',
      status: 'active',
      address: 'Lantai Basement'
    },
    {
      id: 'wh-3',
      name: 'Area Penyimpanan Dingin',
      code: 'APD-001',
      value: 54450000,
      itemCount: 86,
      type: 'secondary',
      status: 'active',
      address: 'Lantai 1, Area Belakang'
    },
    {
      id: 'wh-4',
      name: 'Gudang Transit',
      code: 'GT-001',
      value: 214000000,
      itemCount: 425,
      type: 'transit',
      status: 'active',
      address: 'Area Loading Dock'
    },
    {
      id: 'wh-5',
      name: 'Area Display',
      code: 'AD-001',
      value: 154450000,
      itemCount: 451,
      type: 'main',
      status: 'active',
      address: 'Lantai 1, Area Depan'
    },
    {
      id: 'wh-6',
      name: 'Gudang Utama',
      code: 'GU-002',
      value: 118260000,
      itemCount: 320,
      type: 'main',
      status: 'active',
      address: 'Lantai 1'
    },
    {
      id: 'wh-7',
      name: 'Area Penyimpanan Dingin',
      code: 'APD-002',
      value: 38690000,
      itemCount: 56,
      type: 'secondary',
      status: 'active',
      address: 'Area Belakang'
    },
    {
      id: 'wh-8',
      name: 'Gudang Utama',
      code: 'GU-003',
      value: 98760000,
      itemCount: 320,
      type: 'main',
      status: 'active',
      address: 'Area Tengah'
    },
    {
      id: 'wh-9',
      name: 'Area Penyimpanan Dingin',
      code: 'APD-003',
      value: 25830000,
      itemCount: 105,
      type: 'secondary',
      status: 'active',
      address: 'Area Khusus'
    },
    {
      id: 'wh-10',
      name: 'Gudang Konsinyasi',
      code: 'GK-001',
      value: 32310000,
      itemCount: 135,
      type: 'consignment',
      status: 'active',
      address: 'Lantai 2'
    },
  ];

  // Assign warehouses to locations
  locations[0].warehouses = [warehouses[0], warehouses[1], warehouses[2], warehouses[3]];
  locations[1].warehouses = [warehouses[4], warehouses[5], warehouses[6], warehouses[9]];
  locations[2].warehouses = [warehouses[7], warehouses[8]];

  // Calculate percentages
  const totalValue = locations.reduce((sum, loc) => sum + loc.value, 0);
  locations.forEach(loc => {
    loc.percentage = (loc.value / totalValue) * 100;
    
    // Calculate warehouse percentages within location
    const locTotalValue = loc.warehouses.reduce((sum, wh) => sum + wh.value, 0);
    loc.warehouses.forEach(wh => {
      wh.percentage = (wh.value / locTotalValue) * 100;
    });
  });

  return locations;
};

// Function to get total stock value
export const getTotalStockValue = () => {
  const locations = generateLocationData();
  return locations.reduce((sum, loc) => sum + loc.value, 0);
};

// Function to get warehouse occupancy rate
export const getWarehouseStats = () => {
  const locations = generateLocationData();
  const allWarehouses = locations.flatMap(loc => loc.warehouses);
  
  const totalWarehouses = allWarehouses.length;
  const activeWarehouses = allWarehouses.filter(wh => wh.status === 'active').length;
  const mainWarehouses = allWarehouses.filter(wh => wh.type === 'main').length;
  const secondaryWarehouses = allWarehouses.filter(wh => wh.type === 'secondary').length;
  const transitWarehouses = allWarehouses.filter(wh => wh.type === 'transit').length;
  const consignmentWarehouses = allWarehouses.filter(wh => wh.type === 'consignment').length;
  
  const totalCapacity = 1500; // Imaginary total capacity in m²
  const usedCapacity = 1275; // Imaginary used capacity in m²
  
  return {
    totalWarehouses,
    activeWarehouses,
    mainWarehouses,
    secondaryWarehouses,
    transitWarehouses,
    consignmentWarehouses,
    occupancyRate: (usedCapacity / totalCapacity) * 100,
    totalCapacity,
    usedCapacity
  };
};

export const getProductsWithHighValueByLocation = () => {
  const locations = generateLocationData();
  const productsByLocation: Record<string, {productId: string, productName: string, value: number, quantity: number}[]> = {};
  
  locations.forEach(location => {
    productsByLocation[location.id] = [
      {
        productId: 'product-1',
        productName: 'Paracetamol 500mg',
        value: location.id === 'loc-1' ? 12450000 : (location.id === 'loc-2' ? 8250000 : 4120000),
        quantity: location.id === 'loc-1' ? 2500 : (location.id === 'loc-2' ? 1650 : 824)
      },
      {
        productId: 'product-2',
        productName: 'Amoxicillin 500mg',
        value: location.id === 'loc-1' ? 18760000 : (location.id === 'loc-2' ? 12350000 : 6180000),
        quantity: location.id === 'loc-1' ? 1250 : (location.id === 'loc-2' ? 823 : 412)
      },
      {
        productId: 'product-3',
        productName: 'Simvastatin 20mg',
        value: location.id === 'loc-1' ? 24350000 : (location.id === 'loc-2' ? 14980000 : 7490000),
        quantity: location.id === 'loc-1' ? 1620 : (location.id === 'loc-2' ? 998 : 499)
      },
      {
        productId: 'product-4',
        productName: 'Amlodipine 10mg',
        value: location.id === 'loc-1' ? 16850000 : (location.id === 'loc-2' ? 10250000 : 5120000),
        quantity: location.id === 'loc-1' ? 3370 : (location.id === 'loc-2' ? 2050 : 1024)
      },
      {
        productId: 'product-5',
        productName: 'Vitamin C 1000mg',
        value: location.id === 'loc-1' ? 9850000 : (location.id === 'loc-2' ? 5760000 : 2880000),
        quantity: location.id === 'loc-1' ? 4925 : (location.id === 'loc-2' ? 2880 : 1440)
      }
    ];
  });
  
  return productsByLocation;
};

// Function to get high value products
export const getHighValueProducts = () => {
  const products = [
    {
      id: 'product-1',
      name: 'Paracetamol 500mg',
      category: 'Obat Bebas (OTC)',
      value: 78450000,
      quantity: 156900,
      averagePrice: 500
    },
    {
      id: 'product-2',
      name: 'Amoxicillin 500mg',
      category: 'Obat Resep (Ethical)',
      value: 65890000,
      quantity: 32945,
      averagePrice: 2000
    },
    {
      id: 'product-3',
      name: 'Simvastatin 20mg',
      category: 'Obat Resep (Ethical)',
      value: 54350000,
      quantity: 27175,
      averagePrice: 2000
    },
    {
      id: 'product-4',
      name: 'Vitamin C 1000mg',
      category: 'Suplemen & Vitamin',
      value: 42880000,
      quantity: 42880,
      averagePrice: 1000
    },
    {
      id: 'product-5',
      name: 'Amlodipine 10mg',
      category: 'Obat Resep (Ethical)',
      value: 39560000,
      quantity: 19780,
      averagePrice: 2000
    },
    {
      id: 'product-6',
      name: 'Cetirizine 10mg',
      category: 'Obat Bebas Terbatas',
      value: 36740000,
      quantity: 36740,
      averagePrice: 1000
    },
    {
      id: 'product-7',
      name: 'Calcium Supplement',
      category: 'Suplemen & Vitamin',
      value: 32450000,
      quantity: 12980,
      averagePrice: 2500
    },
    {
      id: 'product-8',
      name: 'Alat Cek Gula Darah',
      category: 'Alat Kesehatan',
      value: 28950000,
      quantity: 579,
      averagePrice: 50000
    },
    {
      id: 'product-9',
      name: 'Insulin Syringe',
      category: 'Alat Kesehatan',
      value: 25680000,
      quantity: 25680,
      averagePrice: 1000
    },
    {
      id: 'product-10',
      name: 'Masker Medis (box)',
      category: 'Alat Kesehatan',
      value: 23450000,
      quantity: 23450,
      averagePrice: 1000
    }
  ];
  
  return products.sort((a, b) => b.value - a.value);
};

// Function to get products by trend (increased or decreased in value)
export const getProductsByTrend = () => {
  return {
    increased: [
      {
        id: 'product-1',
        name: 'Alat Cek Gula Darah',
        category: 'Alat Kesehatan',
        previousValue: 21550000,
        currentValue: 28950000,
        percentageChange: 34.3,
        reason: 'Peningkatan kesadaran kesehatan'
      },
      {
        id: 'product-2',
        name: 'Vitamin C 1000mg',
        category: 'Suplemen & Vitamin',
        previousValue: 35650000,
        currentValue: 42880000,
        percentageChange: 20.3,
        reason: 'Musim flu dan Covid-19'
      },
      {
        id: 'product-3',
        name: 'Calcium Supplement',
        category: 'Suplemen & Vitamin',
        previousValue: 27850000,
        currentValue: 32450000,
        percentageChange: 16.5,
        reason: 'Kampanye kesehatan tulang'
      },
      {
        id: 'product-4',
        name: 'Insulin Syringe',
        category: 'Alat Kesehatan',
        previousValue: 22450000,
        currentValue: 25680000,
        percentageChange: 14.4,
        reason: 'Peningkatan pasien diabetes'
      },
      {
        id: 'product-5',
        name: 'Vitamin D3',
        category: 'Suplemen & Vitamin',
        previousValue: 18650000,
        currentValue: 21340000,
        percentageChange: 14.4,
        reason: 'Peningkatan kesadaran kesehatan'
      }
    ],
    decreased: [
      {
        id: 'product-1',
        name: 'Masker N95',
        category: 'Alat Kesehatan',
        previousValue: 18450000,
        currentValue: 12350000,
        percentageChange: -33.1,
        reason: 'Penurunan kasus Covid-19'
      },
      {
        id: 'product-2',
        name: 'Hand Sanitizer',
        category: 'Kosmetik Medis',
        previousValue: 15650000,
        currentValue: 10850000,
        percentageChange: -30.7,
        reason: 'Penurunan protokol kesehatan'
      },
      {
        id: 'product-3',
        name: 'Thermometer Infrared',
        category: 'Alat Kesehatan',
        previousValue: 12450000,
        currentValue: 8650000,
        percentageChange: -30.5,
        reason: 'Penurunan skrining Covid-19'
      },
      {
        id: 'product-4',
        name: 'Antiseptic Spray',
        category: 'Kosmetik Medis',
        previousValue: 9850000,
        currentValue: 7450000,
        percentageChange: -24.4,
        reason: 'Penurunan protokol kesehatan'
      },
      {
        id: 'product-5',
        name: 'Antibacterial Soap',
        category: 'Kosmetik Medis',
        previousValue: 7650000,
        currentValue: 5950000,
        percentageChange: -22.2,
        reason: 'Penurunan protokol kesehatan'
      }
    ]
  };
};
