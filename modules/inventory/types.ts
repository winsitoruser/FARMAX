// Definisi tipe data untuk modul inventory

export interface Product {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  categoryId: string;
  unit: string;
  minStock?: number;
  description?: string;
  imageUrl?: string;
  dateAdded: Date;
  dateUpdated?: Date;
  productType?: 'generic' | 'ethical' | 'otc' | 'branded' | 'herbal';
  brand?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  // Properti pembagi kemasan
  packageInfo?: {
    primaryUnit: string; // Mis: Box
    secondaryUnit?: string; // Mis: Strip/Blister
    tertiaryUnit?: string; // Mis: Tablet/Kapsul
    secondaryQty?: number; // Jumlah unit sekunder dalam 1 unit primer (mis: 10 strip dalam 1 box)
    tertiaryQty?: number; // Jumlah unit tersier dalam 1 unit sekunder (mis: 10 tablet dalam 1 strip)
  };
  // Harga tier berdasarkan grup harga
  prices?: {
    [priceGroupId: string]: number;
  };
  manufacturerId?: string;
  supplierId?: string;
}

export interface Stock {
  productId: string;
  initialStock: number;
  inStock: number;
  outStock: number;
  currentStock: number;
  expiryDate?: Date;
  storageLocation?: string;
  lastUpdated: Date;
  batchNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  address?: string;
  contact?: string;
  email?: string;
  paymentTerms?: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  code: string;
  address?: string;
  contact?: string;
  email?: string;
}

export interface StockTransaction {
  id: string;
  date: Date;
  type: 'in' | 'out' | 'adjustment';
  productId: string;
  quantity: number;
  source?: string; // PO number, sales ID, etc.
  notes?: string;
  userId: string;
}

export interface StockOpname {
  id: string;
  date: Date;
  productId: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  notes?: string;
  userId: string;
  status: 'draft' | 'completed' | 'cancelled';
}

export interface ExtendedProduct extends Product {
  stock: number;
  category: string;
  price: number;
  sales: number;
  trend: 'up' | 'down' | 'stable';
  expiryDate?: Date;
  batch?: string;
}

export interface ProductForm {
  id: string;
  name: string;
  description?: string;
}

export interface ProductPackaging {
  id: string;
  name: string;
  description?: string;
}

export interface Packaging {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UnitSize {
  id: string;
  name: string;
  code?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface Location {
  id: string;
  name: string;
  code?: string;
  description?: string;
  type?: 'warehouse' | 'shelf' | 'display' | 'other';
  status?: 'active' | 'inactive';
}

export interface PriceGroup {
  id: string;
  name: string;
  discountPercentage: number;
  description?: string;
  isActive: boolean;
}

export interface ProductUnit {
  id: string;
  name: string;
  code: string;
  description?: string;
  conversionFactor?: number; // Faktor konversi ke unit dasar
  isBaseUnit?: boolean; // Tandai sebagai unit dasar (mis: tablet)
  status?: 'active' | 'inactive';
}

export interface Transaction {
  id: string;
  date: string;
  transactionNumber: string;
  type: string;
  productName: string;
  quantity: number;
  total: number;
  customer: string;
  paymentMethod: string;
  status: string;
  items?: Array<{
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

// Interface untuk menangani statistik konsumsi produk
export interface ProductConsumptionStats {
  productId: string;
  dailyAverage: number;
  weeklyAverage: number;
  monthlyAverage: number;
  lastMonth: number;
  lastUpdate: Date;
}

// Mock data untuk pengembangan
export const mockCategories: Category[] = [
  { id: '1', name: 'Obat Bebas', code: 'OB', description: 'Obat yang dapat dibeli tanpa resep dokter', status: 'active' },
  { id: '2', name: 'Obat Bebas Terbatas', code: 'OBT', description: 'Obat yang dapat dibeli tanpa resep dokter, tapi penggunaannya terbatas', status: 'active' },
  { id: '3', name: 'Obat Keras', code: 'OK', description: 'Obat yang hanya bisa diperoleh dengan resep dokter', status: 'active' },
  { id: '4', name: 'Suplemen', code: 'SUP', description: 'Vitamin dan suplemen kesehatan', status: 'active' },
  { id: '5', name: 'Alat Kesehatan', code: 'ALKES', description: 'Peralatan medis dan kesehatan', status: 'active' },
  { id: '6', name: 'Kosmetik', code: 'KOS', description: 'Produk perawatan dan kecantikan', status: 'active' },
  { id: '7', name: 'Herbal', code: 'HER', description: 'Produk herbal dan jamu', status: 'active' },
  { id: '8', name: 'Bayi & Anak', code: 'BAY', description: 'Produk untuk bayi dan anak', status: 'active' },
  { id: '9', name: 'Alat Bantu', code: 'ALB', description: 'Alat bantu untuk disabilitas', status: 'active' },
  { id: '10', name: 'Perawatan Tubuh', code: 'PER', description: 'Produk perawatan tubuh', status: 'active' },
];

export const mockManufacturers: Manufacturer[] = [
  { id: "mfr1", name: "Kalbe Farma", code: "KLB" },
  { id: "mfr2", name: "Kimia Farma", code: "KMF" },
  { id: "mfr3", name: "Dexa Medica", code: "DXM" },
  { id: "mfr4", name: "Sanbe Farma", code: "SNB" },
  { id: "mfr5", name: "Phapros", code: "PPR" },
  { id: "mfr6", name: "Novartis Indonesia", code: "NVR" },
  { id: "mfr7", name: "Bayer Indonesia", code: "BYR" },
  { id: "mfr8", name: "GSK Indonesia", code: "GSK" },
];

export const mockSuppliers: Supplier[] = [
  { id: "sup1", name: "PT Aneka Sumber Medika", code: "ASM" },
  { id: "sup2", name: "PT Enseval Putera Megatrading", code: "EPM" },
  { id: "sup3", name: "PT Parit Padang Global", code: "PPG" },
  { id: "sup4", name: "PT Kimia Farma Trading & Distribution", code: "KFTD" },
  { id: "sup5", name: "PT Bina San Prima", code: "BSP" },
  { id: "sup6", name: "PT Tempo Scan Pacific", code: "TSP" },
];

export const mockPackagings: Packaging[] = [
  { id: '1', name: 'Blister', code: 'BLT', description: 'Kemasan blister dengan foil aluminium', status: 'active' },
  { id: '2', name: 'Strip', code: 'STR', description: 'Kemasan strip dengan foil aluminium', status: 'active' },
  { id: '3', name: 'Botol', code: 'BTL', description: 'Kemasan botol plastik atau kaca', status: 'active' },
  { id: '4', name: 'Box', code: 'BOX', description: 'Kemasan kotak karton', status: 'active' },
  { id: '5', name: 'Sachet', code: 'SCH', description: 'Kemasan sachet sekali pakai', status: 'active' },
];

export const mockUnitSizes: UnitSize[] = [
  { id: '1', name: 'Tablet', code: 'TAB', description: 'Sediaan padat berbentuk tablet', status: 'active' },
  { id: '2', name: 'Kapsul', code: 'KAP', description: 'Sediaan padat berbentuk kapsul', status: 'active' },
  { id: '3', name: 'Sirup 60ml', code: 'SYR60', description: 'Sediaan cair sirup dalam botol 60ml', status: 'active' },
  { id: '4', name: 'Sirup 120ml', code: 'SYR120', description: 'Sediaan cair sirup dalam botol 120ml', status: 'active' },
  { id: '5', name: 'Injeksi 2ml', code: 'INJ2', description: 'Sediaan injeksi dalam ampul 2ml', status: 'active' },
];

export const mockLocations: Location[] = [
  { id: '1', name: 'Gudang Utama', code: 'GU', description: 'Gudang penyimpanan utama', type: 'warehouse', status: 'active' },
  { id: '2', name: 'Etalase Depan', code: 'ED', description: 'Etalase display di bagian depan apotek', type: 'display', status: 'active' },
  { id: '3', name: 'Rak Obat Keras', code: 'ROK', description: 'Rak khusus untuk penyimpanan obat keras', type: 'shelf', status: 'active' },
  { id: '4', name: 'Kulkas', code: 'KLK', description: 'Kulkas untuk obat yang memerlukan suhu rendah', type: 'other', status: 'active' },
  { id: '5', name: 'Lemari Narkotika', code: 'LN', description: 'Lemari khusus untuk penyimpanan obat golongan narkotika dan psikotropika', type: 'other', status: 'active' },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'MED001',
    categoryId: '1',
    unit: 'Tablet',
    minStock: 20,
    description: 'Obat untuk meredakan demam dan nyeri ringan hingga sedang',
    imageUrl: '/images/products/paracetamol.jpg',
    dateAdded: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    sku: 'MED002',
    categoryId: '3',
    unit: 'Kapsul',
    minStock: 15,
    description: 'Antibiotik untuk mengobati berbagai infeksi bakteri',
    imageUrl: '/images/products/amoxicillin.jpg',
    dateAdded: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    sku: 'VIT001',
    categoryId: '4',
    unit: 'Tablet',
    minStock: 10,
    description: 'Suplemen untuk meningkatkan daya tahan tubuh',
    imageUrl: '/images/products/vitaminc.jpg',
    dateAdded: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'Tensimeter Digital',
    sku: 'DEV001',
    categoryId: '5',
    unit: 'Unit',
    minStock: 5,
    description: 'Alat untuk mengukur tekanan darah',
    imageUrl: '/images/products/tensimeter.jpg',
    dateAdded: new Date('2024-01-30'),
  },
  {
    id: '5',
    name: 'Minyak Kayu Putih 60ml',
    sku: 'OTC001',
    categoryId: '1',
    unit: 'Botol',
    minStock: 15,
    description: 'Minyak gosok untuk meredakan gejala flu dan masuk angin',
    imageUrl: '/images/products/kayuputih.jpg',
    dateAdded: new Date('2024-02-05'),
  },
  {
    id: '6',
    name: 'Cetirizine 10mg',
    sku: 'MED003',
    categoryId: '2',
    unit: 'Tablet',
    minStock: 12,
    description: 'Antihistamin untuk meredakan gejala alergi',
    imageUrl: '/images/products/cetirizine.jpg',
    dateAdded: new Date('2024-02-10'),
  },
  {
    id: '7',
    name: 'Masker Medis (50pcs)',
    sku: 'DEV002',
    categoryId: '5',
    unit: 'Box',
    minStock: 8,
    description: 'Masker 3 lapis untuk perlindungan dari debu dan kuman',
    imageUrl: '/images/products/masker.jpg',
    dateAdded: new Date('2024-02-15'),
  },
  {
    id: '8',
    name: 'Metformin 500mg',
    sku: 'MED004',
    categoryId: '3',
    unit: 'Tablet',
    minStock: 20,
    description: 'Obat untuk mengendalikan kadar gula darah pada penderita diabetes',
    imageUrl: '/images/products/metformin.jpg',
    dateAdded: new Date('2024-02-20'),
  },
  {
    id: '9',
    name: 'Krim Pelembab Wajah',
    sku: 'COS001',
    categoryId: '6',
    unit: 'Tube',
    minStock: 7,
    description: 'Krim pelembab untuk kulit wajah kering',
    imageUrl: '/images/products/nivea.jpg',
    dateAdded: new Date('2024-02-25'),
  },
  {
    id: '10',
    name: 'Termometer Digital',
    sku: 'DEV003',
    categoryId: '5',
    unit: 'Unit',
    minStock: 5,
    description: 'Alat untuk mengukur suhu tubuh',
    imageUrl: '/images/products/termometer.jpg',
    dateAdded: new Date('2024-03-01'),
  },
  {
    id: '11',
    name: 'Jamu Kunyit Asam 250ml',
    sku: 'HRB001',
    categoryId: '7',
    unit: 'Botol',
    minStock: 15,
    description: 'Minuman herbal untuk kesehatan tubuh dan melancarkan haid',
    imageUrl: '/images/products/kunyitasam.jpg',
    dateAdded: new Date('2024-03-05'),
  },
  {
    id: '12',
    name: 'Loratadine 10mg',
    sku: 'MED005',
    categoryId: '2',
    unit: 'Tablet',
    minStock: 10,
    description: 'Antihistamin non-sedatif untuk meredakan gejala alergi',
    imageUrl: '/images/products/loratadine.jpg',
    dateAdded: new Date('2024-03-10'),
  },
  {
    id: '13',
    name: 'Bedak Bayi 100g',
    sku: 'BBY001',
    categoryId: '8',
    unit: 'Kaleng',
    minStock: 10,
    description: 'Bedak untuk perawatan kulit bayi',
    imageUrl: '/images/products/bedakbayi.jpg',
    dateAdded: new Date('2024-03-15'),
  },
  {
    id: '14',
    name: 'Captopril 25mg',
    sku: 'MED006',
    categoryId: '3',
    unit: 'Tablet',
    minStock: 25,
    description: 'Obat untuk mengendalikan tekanan darah tinggi',
    imageUrl: '/images/products/captopril.jpg',
    dateAdded: new Date('2024-03-20'),
  },
  {
    id: '15',
    name: 'Tongkat Bantu Jalan',
    sku: 'AID001',
    categoryId: '9',
    unit: 'Unit',
    minStock: 3,
    description: 'Alat bantu jalan untuk lansia dan pasien rehabilitasi',
    imageUrl: '/images/products/tongkat.jpg',
    dateAdded: new Date('2024-03-25'),
  },
  {
    id: '16',
    name: 'Antasida Doen',
    sku: 'MED007',
    categoryId: '1',
    unit: 'Tablet',
    minStock: 20,
    description: 'Obat untuk meredakan sakit maag dan kembung',
    imageUrl: '/images/products/antasida.jpg',
    dateAdded: new Date('2024-01-10'),
  },
  {
    id: '17',
    name: 'Sunscreen SPF 50',
    sku: 'COS002',
    categoryId: '6',
    unit: 'Botol',
    minStock: 8,
    description: 'Tabir surya untuk melindungi kulit dari sinar UV',
    imageUrl: '/images/products/sunscreen.jpg',
    dateAdded: new Date('2024-01-05'),
  },
  {
    id: '18',
    name: 'Tempat Obat Harian',
    sku: 'AID002',
    categoryId: '9',
    unit: 'Unit',
    minStock: 10,
    description: 'Kotak obat dengan 7 kompartemen untuk menyimpan obat harian',
    imageUrl: '/images/products/tempatobat.jpg',
    dateAdded: new Date('2024-01-12'),
  },
  {
    id: '19',
    name: 'Salep Kulit Gentamicin',
    sku: 'MED008',
    categoryId: '3',
    unit: 'Tube',
    minStock: 10,
    description: 'Salep untuk mengobati infeksi kulit yang disebabkan oleh bakteri',
    imageUrl: '/images/products/gentamicin.jpg',
    dateAdded: new Date('2024-01-18'),
  },
  {
    id: '20',
    name: 'Sabun Bayi 100g',
    sku: 'BBY002',
    categoryId: '8',
    unit: 'Batang',
    minStock: 15,
    description: 'Sabun lembut untuk kulit bayi',
    imageUrl: '/images/products/sabunbayi.jpg',
    dateAdded: new Date('2024-01-22'),
  },
  {
    id: '21',
    name: 'Honey & Lemon Cough Syrup',
    sku: 'MED009',
    categoryId: '2',
    unit: 'Botol',
    minStock: 10,
    description: 'Sirup obat batuk dengan rasa madu dan lemon',
    imageUrl: '/images/products/obhcombi.jpg',
    dateAdded: new Date('2024-02-02'),
  },
  {
    id: '22',
    name: 'Omega 3 Fish Oil',
    sku: 'VIT002',
    categoryId: '4',
    unit: 'Kapsul',
    minStock: 5,
    description: 'Suplemen minyak ikan untuk kesehatan jantung dan otak',
    imageUrl: '/images/products/omega3.jpg',
    dateAdded: new Date('2024-02-08'),
  },
  {
    id: '23',
    name: 'Hand Sanitizer 100ml',
    sku: 'HYG001',
    categoryId: '10',
    unit: 'Botol',
    minStock: 20,
    description: 'Pembersih tangan tanpa air dengan kandungan alkohol 70%',
    imageUrl: '/images/products/handsanitizer.jpg',
    dateAdded: new Date('2024-02-12'),
  },
  {
    id: '24',
    name: 'Ibuprofen 400mg',
    sku: 'MED010',
    categoryId: '2',
    unit: 'Tablet',
    minStock: 15,
    description: 'Obat anti-inflamasi untuk meredakan nyeri dan peradangan',
    imageUrl: '/images/products/ibuprofen.jpg',
    dateAdded: new Date('2024-02-16'),
  },
  {
    id: '25',
    name: 'Plester Luka (20pcs)',
    sku: 'DEV004',
    categoryId: '5',
    unit: 'Box',
    minStock: 15,
    description: 'Plester untuk menutup luka kecil',
    imageUrl: '/images/products/plester.jpg',
    dateAdded: new Date('2024-02-20'),
  },
  {
    id: '26',
    name: 'Jahe Merah Instan',
    sku: 'HRB002',
    categoryId: '7',
    unit: 'Sachet',
    minStock: 50,
    description: 'Minuman herbal instan dari jahe merah untuk menghangatkan tubuh',
    imageUrl: '/images/products/jahemerah.jpg',
    dateAdded: new Date('2024-02-24'),
  },
  {
    id: '27',
    name: 'Popok Bayi (24pcs)',
    sku: 'BBY003',
    categoryId: '8',
    unit: 'Pack',
    minStock: 8,
    description: 'Popok sekali pakai untuk bayi',
    imageUrl: '/images/products/popok.jpg',
    dateAdded: new Date('2024-02-28'),
  },
  {
    id: '28',
    name: 'Calcium & Vitamin D3',
    sku: 'VIT003',
    categoryId: '4',
    unit: 'Tablet',
    minStock: 10,
    description: 'Suplemen kalsium dan vitamin D untuk kesehatan tulang',
    imageUrl: '/images/products/calcium.jpg',
    dateAdded: new Date('2024-03-04'),
  },
  {
    id: '29',
    name: 'Amlodipine 5mg',
    sku: 'MED011',
    categoryId: '3',
    unit: 'Tablet',
    minStock: 20,
    description: 'Obat untuk mengendalikan tekanan darah tinggi',
    imageUrl: '/images/products/amlodipine.jpg',
    dateAdded: new Date('2024-03-08'),
  },
  {
    id: '30',
    name: 'Kursi Roda Standard',
    sku: 'AID003',
    categoryId: '9',
    unit: 'Unit',
    minStock: 2,
    description: 'Kursi roda untuk pasien yang membutuhkan bantuan mobilitas',
    imageUrl: '/images/products/kursiroda.jpg',
    dateAdded: new Date('2024-03-12'),
  },
];

// Generate stock data yang bervariasi untuk produk-produk baru
export const mockStocks: Stock[] = mockProducts.map((product, index) => {
  // Buat data stok yang bervariasi
  const getRandomStock = () => Math.floor(Math.random() * 50) + 10;
  const initialStock = getRandomStock() + 50;
  const inStock = Math.floor(Math.random() * 30);
  const outStock = Math.floor(Math.random() * 20);
  
  // Buat beberapa produk dengan stok rendah untuk pengujian notifikasi stok rendah
  let currentStock = getRandomStock();
  if (index % 7 === 0) { // Sekitar 15% produk akan memiliki stok rendah
    currentStock = Math.floor(Math.random() * (product.minStock || 10));
  }
  
  // Buat beberapa produk dengan tanggal kadaluarsa yang mendekati untuk pengujian modul expiry
  let expiryDate = new Date(Date.now() + (Math.floor(Math.random() * 365) + 30) * 24 * 60 * 60 * 1000);
  if (index % 5 === 0) { // Sekitar 20% produk akan mendekati kadaluarsa
    expiryDate = new Date(Date.now() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000);
  }
  
  // Tentukan lokasi penyimpanan yang berbeda-beda
  const storageLocations = ['Rak A', 'Rak B', 'Rak C', 'Gudang Utama', 'Apotek', 'Lemari Pendingin', 'Gudang Cadangan'];
  const storageLocation = storageLocations[Math.floor(Math.random() * storageLocations.length)];
  
  return {
    productId: product.id,
    initialStock: initialStock,
    inStock: inStock,
    outStock: outStock,
    currentStock: currentStock,
    expiryDate: expiryDate,
    storageLocation: storageLocation,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Update dalam 30 hari terakhir
    batchNumber: `B${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  };
});

export const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    date: '2023-05-07', 
    transactionNumber: 'TR-001', 
    type: 'Penjualan', 
    productName: 'Paracetamol 500mg', 
    quantity: 5, 
    total: 125000,
    customer: 'Budi Santoso',
    paymentMethod: 'Cash',
    status: 'Completed',
    items: [
      { productName: 'Paracetamol 500mg', quantity: 3, price: 15000, subtotal: 45000 },
      { productName: 'Vitamin C 1000mg', quantity: 2, price: 25000, subtotal: 50000 },
      { productName: 'Antasida Doen', quantity: 2, price: 15000, subtotal: 30000 }
    ]
  },
  { 
    id: '2', 
    date: '2023-05-07', 
    transactionNumber: 'TR-002', 
    type: 'Penjualan', 
    productName: 'Vitamin C 1000mg', 
    quantity: 3, 
    total: 85000,
    customer: 'Ani Wijaya',
    paymentMethod: 'Transfer',
    status: 'Completed',
    items: [
      { productName: 'Vitamin C 1000mg', quantity: 3, price: 25000, subtotal: 75000 },
      { productName: 'Plester', quantity: 2, price: 5000, subtotal: 10000 }
    ]
  },
  { 
    id: '3', 
    date: '2023-05-06', 
    transactionNumber: 'TR-003', 
    type: 'Pembelian', 
    productName: 'Amoxicillin 500mg', 
    quantity: 100, 
    total: 1750000,
    customer: 'PT Medika Sejahtera',
    paymentMethod: 'Transfer',
    status: 'Completed',
    items: [
      { productName: 'Amoxicillin 500mg', quantity: 100, price: 17500, subtotal: 1750000 }
    ]
  },
  { 
    id: '4', 
    date: '2023-05-06', 
    transactionNumber: 'TR-004', 
    type: 'Penjualan', 
    productName: 'Antasida Doen', 
    quantity: 3, 
    total: 45000,
    customer: 'Joko Widodo',
    paymentMethod: 'Cash',
    status: 'Completed',
    items: [
      { productName: 'Antasida Doen', quantity: 3, price: 15000, subtotal: 45000 }
    ]
  },
  { 
    id: '5', 
    date: '2023-05-05', 
    transactionNumber: 'TR-005', 
    type: 'Retur', 
    productName: 'Salep Kulit Gentamicin', 
    quantity: 2, 
    total: 60000,
    customer: 'Siti Nurhaliza',
    paymentMethod: 'Store Credit',
    status: 'Completed',
    items: [
      { productName: 'Salep Kulit Gentamicin', quantity: 2, price: 30000, subtotal: 60000 }
    ]
  },
  { 
    id: '6', 
    date: '2023-05-05', 
    transactionNumber: 'TR-006', 
    type: 'Pembelian', 
    productName: 'Vitamin C 1000mg', 
    quantity: 100, 
    total: 2350000,
    customer: 'PT Farmasi Utama',
    paymentMethod: 'Transfer',
    status: 'Pending',
    items: [
      { productName: 'Vitamin C 1000mg', quantity: 100, price: 23500, subtotal: 2350000 }
    ]
  },
  { 
    id: '7', 
    date: '2023-05-04', 
    transactionNumber: 'TR-007', 
    type: 'Penjualan', 
    productName: 'Amoxicillin 500mg', 
    quantity: 6, 
    total: 210000,
    customer: 'Ahmad Dhani',
    paymentMethod: 'Cash',
    status: 'Completed',
    items: [
      { productName: 'Amoxicillin 500mg', quantity: 6, price: 35000, subtotal: 210000 }
    ]
  },
  { 
    id: '8', 
    date: '2023-05-04', 
    transactionNumber: 'TR-008', 
    type: 'Penjualan', 
    productName: 'Salep Kulit Gentamicin', 
    quantity: 5, 
    total: 178000,
    customer: 'Raisa Andriana',
    paymentMethod: 'Card',
    status: 'Completed',
    items: [
      { productName: 'Salep Kulit Gentamicin', quantity: 3, price: 30000, subtotal: 90000 },
      { productName: 'Plester', quantity: 4, price: 5000, subtotal: 20000 },
      { productName: 'Vitamin E', quantity: 2, price: 34000, subtotal: 68000 }
    ]
  }
];

export const mockProductForms: ProductForm[] = [
  { id: '1', name: 'Tablet', description: 'Sediaan padat berbentuk tablet' },
  { id: '2', name: 'Kapsul', description: 'Sediaan padat berbentuk kapsul' },
  { id: '3', name: 'Sirup', description: 'Sediaan cair dalam bentuk sirup' },
  { id: '4', name: 'Salep', description: 'Sediaan semipadat untuk pemakaian luar' },
  { id: '5', name: 'Cream', description: 'Sediaan semipadat berbentuk krim' },
  { id: '6', name: 'Injeksi', description: 'Sediaan steril untuk injeksi' },
];

export const mockProductPackaging: ProductPackaging[] = [
  { id: '1', name: 'Strip', description: 'Kemasan dalam bentuk strip' },
  { id: '2', name: 'Botol', description: 'Kemasan dalam bentuk botol' },
  { id: '3', name: 'Box', description: 'Kemasan dalam bentuk kotak' },
  { id: '4', name: 'Tube', description: 'Kemasan dalam bentuk tube' },
  { id: '5', name: 'Ampul', description: 'Kemasan dalam bentuk ampul' },
  { id: '6', name: 'Vial', description: 'Kemasan dalam bentuk vial' },
];

export const mockPriceGroups: PriceGroup[] = [
  { id: '1', name: 'Reguler', discountPercentage: 0, description: 'Harga normal tanpa diskon', isActive: true },
  { id: '2', name: 'Member', discountPercentage: 5, description: 'Diskon khusus untuk anggota', isActive: true },
  { id: '3', name: 'Grosir', discountPercentage: 10, description: 'Diskon untuk pembelian grosir', isActive: true },
  { id: '4', name: 'Reseller', discountPercentage: 15, description: 'Diskon khusus untuk reseller', isActive: true },
  { id: '5', name: 'VIP', discountPercentage: 20, description: 'Diskon untuk pelanggan VIP', isActive: true },
];

// Mock data for ProductConsumptionStats
export const mockProductConsumptionStats: ProductConsumptionStats[] = mockProducts.map((product) => {
  // Generate realistic consumption data
  const monthlyBase = Math.floor(Math.random() * 100) + 5;
  const weeklyBase = Math.round(monthlyBase / 4);
  const dailyBase = Math.round(weeklyBase / 7);
  const fluctuation = 0.2; // 20% fluctuation

  return {
    productId: product.id,
    dailyAverage: Math.max(1, Math.round(dailyBase * (1 + (Math.random() * 2 - 1) * fluctuation))),
    weeklyAverage: Math.max(3, Math.round(weeklyBase * (1 + (Math.random() * 2 - 1) * fluctuation))),
    monthlyAverage: monthlyBase,
    lastMonth: Math.round(monthlyBase * (1 + (Math.random() * 2 - 1) * fluctuation)),
    lastUpdate: new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000) // Last 5 days
  };
});
