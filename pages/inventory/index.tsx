import React, { useState, useEffect } from 'react';
import InventoryPageLayout from '@/modules/inventory/components/InventoryPageLayout';
import InventoryPageHeader from '@/modules/inventory/components/InventoryPageHeader';
import InventoryStatCard from '@/modules/inventory/components/InventoryStatCard';
import { 
  FaPlus, FaBoxOpen, FaClipboardList, FaFileExport, FaSearch, FaPrint, 
  FaExclamationTriangle, FaCalendarAlt, FaCubes, FaDollarSign, FaLayerGroup, 
  FaTag, FaExchangeAlt, FaChartBar, FaTimes, FaArrowRight, FaSortUp, FaSortDown,
  FaFilter, FaEye, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaCog, FaTruck,
  FaCheckCircle, FaBox, FaList, FaDownload, FaCheck, FaTimesCircle, FaInfoCircle,
  FaBuilding, FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart
} from 'react-icons/fa';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
// Import untuk pie chart
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatRupiah } from '@/lib/utils';

// Definisi tipe untuk data produk
type ExtendedProduct = {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  sellingPrice: number;
  purchasePrice: number;
  minStock: number;
  stock: number;
  price: number;
  sku: string;
  unit: string;
  expiryDate?: Date;
  sales: number;
  trend: 'up' | 'down' | 'stable';
  dateAdded: Date;
};

// Note: This component would use real data in a production environment
// Mock data and simulated functionality for demonstration
const mockProducts = [
  { 
    id: "1", 
    name: "Paracetamol", 
    categoryId: "1", 
    category: "Analgesik",
    sellingPrice: 1000,
    purchasePrice: 800,
    price: 1000,
    minStock: 10,
    stock: 50,
    sku: "PARA001",
    unit: "tablet",
    expiryDate: new Date('2024-06-15'),
    sales: 120,
    trend: 'up' as const,
    dateAdded: new Date('2023-01-15')
  },
  { 
    id: "2", 
    name: "Amoxicillin", 
    categoryId: "2", 
    category: "Antibiotik",
    sellingPrice: 1500,
    purchasePrice: 1200,
    price: 1500,
    minStock: 15,
    stock: 8,
    sku: "AMOX001",
    unit: "kapsul",
    expiryDate: new Date('2024-04-10'),
    sales: 80,
    trend: 'down' as const,
    dateAdded: new Date('2023-02-20')
  },
  { 
    id: "3", 
    name: "Vitamin C", 
    categoryId: "3", 
    category: "Vitamin",
    sellingPrice: 800,
    purchasePrice: 600,
    price: 800,
    minStock: 20,
    stock: 100,
    sku: "VITC001",
    unit: "tablet",
    expiryDate: new Date('2025-01-15'),
    sales: 200,
    trend: 'stable' as const,
    dateAdded: new Date('2023-03-10')
  },
  { 
    id: "4", 
    name: "Ibuprofen", 
    categoryId: "1", 
    category: "Analgesik",
    sellingPrice: 1200,
    purchasePrice: 900,
    price: 1200,
    minStock: 12,
    stock: 9,
    sku: "IBUP001",
    unit: "tablet",
    expiryDate: new Date('2024-05-20'),
    sales: 90,
    trend: 'down' as const,
    dateAdded: new Date('2023-01-25')
  },
  { 
    id: "5", 
    name: "Loratadine", 
    categoryId: "4", 
    category: "Antihistamin",
    sellingPrice: 900,
    purchasePrice: 700,
    price: 900,
    minStock: 8,
    stock: 30,
    sku: "LORA001",
    unit: "tablet",
    expiryDate: new Date('2024-07-30'),
    sales: 60,
    trend: 'up' as const,
    dateAdded: new Date('2023-02-05')
  }
];

const mockStocks = [
  { productId: '1', currentStock: 50, expiryDate: new Date('2024-03-16T00:00:00.000Z') },
  { productId: '2', currentStock: 75, expiryDate: new Date('2024-04-16T00:00:00.000Z') },
  { productId: '3', currentStock: 100, expiryDate: new Date('2024-05-16T00:00:00.000Z') },
];

const mockCategories = [
  { id: '1', name: 'Category 1' },
  { id: '2', name: 'Category 2' },
  { id: '3', name: 'Category 3' },
];

const mockTransactions = [
  { id: '1', transactionNumber: 'TRX001', date: new Date('2024-03-01T00:00:00.000Z'), type: 'Penjualan', productName: 'Product 1', quantity: 10, total: 150000 },
  { id: '2', transactionNumber: 'TRX002', date: new Date('2024-03-02T00:00:00.000Z'), type: 'Pembelian', productName: 'Product 2', quantity: 20, total: 400000 },
  { id: '3', transactionNumber: 'TRX003', date: new Date('2024-03-03T00:00:00.000Z'), type: 'Penjualan', productName: 'Product 3', quantity: 30, total: 1050000 },
];

const mockReceptions = [
  { id: '1', date: new Date('2024-03-01T00:00:00.000Z'), supplier: 'Supplier 1', total: 1000000 },
  { id: '2', date: new Date('2024-03-02T00:00:00.000Z'), supplier: 'Supplier 2', total: 2000000 },
  { id: '3', date: new Date('2024-03-03T00:00:00.000Z'), supplier: 'Supplier 3', total: 3000000 },
];

// Mock data untuk pesanan dari distributor
const mockOrders = [
  { 
    id: 'ORD001', 
    date: new Date('2024-03-28T00:00:00.000Z'), 
    supplier: 'PT Kimia Farma', 
    status: 'pending', 
    items: [
      { id: '1', name: 'Paracetamol 500mg', quantity: 100, received: 0, unit: 'Box' },
      { id: '2', name: 'Amoxicillin 500mg', quantity: 50, received: 0, unit: 'Box' },
      { id: '3', name: 'Cetirizine 10mg', quantity: 30, received: 0, unit: 'Box' }
    ],
    total: 5800000
  },
  { 
    id: 'ORD002', 
    date: new Date('2024-03-29T00:00:00.000Z'), 
    supplier: 'PT Kalbe Farma', 
    status: 'partial', 
    items: [
      { id: '4', name: 'Vitamin C 1000mg', quantity: 60, received: 40, unit: 'Box' },
      { id: '5', name: 'Simvastatin 20mg', quantity: 40, received: 40, unit: 'Box' },
      { id: '6', name: 'Lansoprazole 30mg', quantity: 25, received: 0, unit: 'Box' }
    ],
    total: 3750000
  },
  { 
    id: 'ORD003', 
    date: new Date('2024-03-30T00:00:00.000Z'), 
    supplier: 'PT Sanbe Farma', 
    status: 'complete', 
    items: [
      { id: '7', name: 'Metformin 500mg', quantity: 80, received: 80, unit: 'Box' },
      { id: '8', name: 'Ibuprofen 400mg', quantity: 45, received: 45, unit: 'Box' },
      { id: '9', name: 'Amlodipine 5mg', quantity: 35, received: 35, unit: 'Box' }
    ],
    total: 4250000
  }
];

// Mock data supplier dengan transaksi terbanyak
const mockTopSuppliers = [
  { 
    id: '1', 
    name: 'PT Kimia Farma', 
    logo: '/placeholder-logo.png',
    totalTransactions: 28,
    lastOrder: new Date('2024-03-25'),
    totalSpend: 48500000,
  },
  { 
    id: '2', 
    name: 'PT Kalbe Farma', 
    logo: '/placeholder-logo.png',
    totalTransactions: 23,
    lastOrder: new Date('2024-03-28'),
    totalSpend: 37250000,
  },
  { 
    id: '3', 
    name: 'PT Sanbe Farma', 
    logo: '/placeholder-logo.png',
    totalTransactions: 19,
    lastOrder: new Date('2024-03-22'),
    totalSpend: 29800000,
  },
  { 
    id: '4', 
    name: 'PT Pharos Indonesia', 
    logo: '/placeholder-logo.png',
    totalTransactions: 15,
    lastOrder: new Date('2024-03-18'),
    totalSpend: 18450000,
  },
  { 
    id: '5', 
    name: 'PT Tempo Scan Pacific', 
    logo: '/placeholder-logo.png',
    totalTransactions: 12,
    lastOrder: new Date('2024-03-15'),
    totalSpend: 15200000,
  }
];

// Mock data riwayat transaksi supplier
const mockSupplierTransactions = {
  '1': [
    { id: 'INV001', date: new Date('2024-03-25'), amount: 8500000, items: 12, status: 'completed' },
    { id: 'INV002', date: new Date('2024-03-10'), amount: 7250000, items: 9, status: 'completed' },
    { id: 'INV003', date: new Date('2024-02-28'), amount: 9800000, items: 15, status: 'completed' },
    { id: 'INV004', date: new Date('2024-02-15'), amount: 6500000, items: 8, status: 'completed' },
    { id: 'INV005', date: new Date('2024-01-30'), amount: 12800000, items: 18, status: 'completed' },
  ],
  '2': [
    { id: 'INV006', date: new Date('2024-03-28'), amount: 7800000, items: 10, status: 'completed' },
    { id: 'INV007', date: new Date('2024-03-15'), amount: 6350000, items: 8, status: 'completed' },
    { id: 'INV008', date: new Date('2024-02-25'), amount: 8100000, items: 11, status: 'completed' },
    { id: 'INV009', date: new Date('2024-02-10'), amount: 5700000, items: 7, status: 'completed' },
    { id: 'INV010', date: new Date('2024-01-25'), amount: 9300000, items: 13, status: 'completed' },
  ],
  '3': [
    { id: 'INV011', date: new Date('2024-03-22'), amount: 6800000, items: 9, status: 'completed' },
    { id: 'INV012', date: new Date('2024-03-10'), amount: 5250000, items: 7, status: 'completed' },
    { id: 'INV013', date: new Date('2024-02-22'), amount: 7900000, items: 11, status: 'completed' },
    { id: 'INV014', date: new Date('2024-02-08'), amount: 4800000, items: 6, status: 'completed' },
    { id: 'INV015', date: new Date('2024-01-20'), amount: 5050000, items: 8, status: 'completed' },
  ],
  '4': [
    { id: 'INV016', date: new Date('2024-03-18'), amount: 4500000, items: 6, status: 'completed' },
    { id: 'INV017', date: new Date('2024-03-05'), amount: 3850000, items: 5, status: 'completed' },
    { id: 'INV018', date: new Date('2024-02-20'), amount: 4100000, items: 6, status: 'completed' },
    { id: 'INV019', date: new Date('2024-02-02'), amount: 3250000, items: 4, status: 'completed' },
    { id: 'INV020', date: new Date('2024-01-15'), amount: 2750000, items: 3, status: 'completed' },
  ],
  '5': [
    { id: 'INV021', date: new Date('2024-03-15'), amount: 3500000, items: 5, status: 'completed' },
    { id: 'INV022', date: new Date('2024-03-02'), amount: 2850000, items: 4, status: 'completed' },
    { id: 'INV023', date: new Date('2024-02-15'), amount: 3100000, items: 5, status: 'completed' },
    { id: 'INV024', date: new Date('2024-01-28'), amount: 2950000, items: 4, status: 'completed' },
    { id: 'INV025', date: new Date('2024-01-10'), amount: 2800000, items: 4, status: 'completed' },
  ],
};

// Data untuk pie chart kategori produk
const recentActivities = [
  {
    id: 'act001',
    date: new Date('2024-04-04T14:30:00'),
    type: 'order',
    productName: 'Paracetamol 500mg',
    quantity: 100,
    unit: 'Box',
    supplier: 'PT Kimia Farma',
    status: 'pending',
    poNumber: 'PO-2024-042'
  },
  {
    id: 'act002',
    date: new Date('2024-04-03T10:15:00'),
    type: 'received',
    productName: 'Vitamin C 1000mg',
    quantity: 50,
    unit: 'Box',
    supplier: 'PT Dexa Medica',
    status: 'complete',
    poNumber: 'PO-2024-038'
  },
  {
    id: 'act003',
    date: new Date('2024-04-02T16:45:00'),
    type: 'returned',
    productName: 'Amoxicillin 500mg',
    quantity: 10,
    unit: 'Box',
    supplier: 'PT Kalbe Farma',
    reason: 'Kemasan rusak',
    status: 'complete',
    returnNumber: 'RET-2024-012'
  },
  {
    id: 'act004',
    date: new Date('2024-04-02T09:30:00'),
    type: 'received',
    productName: 'Cetirizine 10mg',
    quantity: 30,
    unit: 'Box',
    supplier: 'PT Sanbe Farma',
    status: 'complete',
    poNumber: 'PO-2024-037'
  },
  {
    id: 'act005',
    date: new Date('2024-04-01T13:20:00'),
    type: 'order',
    productName: 'Ibuprofen 400mg',
    quantity: 40,
    unit: 'Box',
    supplier: 'PT Phapros',
    status: 'pending',
    poNumber: 'PO-2024-041'
  }
];

// Format tanggal lengkap dengan waktu
const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const InventoryPage: React.FC = () => {
  const { toast } = useToast();
  
  // Prepare extended products with more data
  const prepareProducts = () => {
    return mockProducts.map(prod => {
      const category = mockCategories.find(c => c.id === prod.categoryId)?.name || 'Uncategorized';
      
      // Calculate mock sales data for presentation purposes
      const mockSales = Math.floor(Math.random() * 50) + 1;
      const mockTrend = Math.random() > 0.5 ? 'up' : 'down';
      
      return {
        ...prod,
        category,
        stock: mockStocks.find(s => s.productId === prod.id)?.currentStock || 0,
        price: prod.sellingPrice,
        expiryDate: mockStocks.find(s => s.productId === prod.id)?.expiryDate,
        sales: mockSales,
        trend: mockTrend,
        purchasePrice: prod.purchasePrice,
        dateAdded: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
      };
    });
  };
  
  // Calculate statistics
  const [products, setProducts] = useState<ExtendedProduct[]>(prepareProducts());
  const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<'name' | 'stock' | 'price'>('name');
  const [sortDirection, setDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [expiringSoonDays, setExpiringSoonDays] = useState(30);
  const [showAlerts, setShowAlerts] = useState(true);
  const [selectedLowStockItem, setSelectedLowStockItem] = useState<ExtendedProduct | null>(null);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [orderOption, setOrderOption] = useState<'defecta' | 'relocation' | null>(null);
  
  // State untuk fitur penerimaan produk
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [receivedItems, setReceivedItems] = useState<Record<string, number>>({});

  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showSupplierDetailDialog, setShowSupplierDetailDialog] = useState(false);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  
  // Identifikasi produk dengan stok rendah
  const lowStockItems = products.filter((product) => {
    if (product.minStock === undefined) return false;
    return product.stock <= product.minStock;
  });
  
  // Identifikasi produk yang mendekati kadaluwarsa
  const expiringSoonItems = products.filter((product) => {
    if (!product.expiryDate) return false;
    const expiryDate = new Date(product.expiryDate);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= expiringSoonDays && daysUntilExpiry > 0;
  });
  
  const categories = [...new Set(products.map(p => p.category))];
  const categoryCounts = categories.map(cat => {
    return {
      name: cat,
      count: products.filter(p => p.category === cat).length
    };
  }).sort((a, b) => b.count - a.count);

  const categoryChartData = categoryCounts.map((cat: { name: string; count: number }, index: number) => {
    // Generate warna yang berbeda untuk setiap kategori
    const colors = [
      '#F97316', // orange-500
      '#F59E0B', // amber-500
      '#D97706', // amber-600
      '#EA580C', // orange-600
      '#FB923C', // orange-400
      '#FDBA74', // orange-300
      '#FCD34D', // amber-300
      '#FBBF24', // amber-400
    ];
    
    return {
      name: cat.name,
      value: cat.count,
      color: colors[index % colors.length]
    };
  });

  // Helper function to calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to format currency
  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field as 'name' | 'stock' | 'price');
      setDirection("asc");
    }
  };

  // Get sorted products
  const getSortedProducts = () => {
    return [...filteredProducts].sort((a, b) => {
      const aValue = a[sortField as keyof ExtendedProduct];
      const bValue = b[sortField as keyof ExtendedProduct];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  };

  const featureCards = [
    { 
      title: 'Produk',
      description: 'Kelola daftar produk dan detailnya',
      icon: <FaBoxOpen className="w-5 h-5 text-white" />,
      path: '/inventory/products',
      color: 'blue'
    },
    { 
      title: 'Stock Opname',
      description: 'Periksa dan sesuaikan stok produk',
      icon: <FaClipboardList className="w-5 h-5 text-white" />,
      path: '/inventory/stocktake',
      color: 'amber'
    },
    { 
      title: 'Kadaluarsa',
      description: 'Pantau produk yang mendekati tanggal kadaluwarsa',
      icon: <FaCalendarAlt className="w-5 h-5 text-white" />,
      path: '/inventory/expiry',
      color: 'red'
    },
    { 
      title: 'Master Produk',
      description: 'Pengaturan kategori, kemasan, ukuran dan lokasi',
      icon: <FaCog className="w-5 h-5 text-white" />,
      path: '/inventory/master',
      color: 'green'
    },
    { 
      title: 'Laporan',
      description: 'Lihat laporan dan analisis data inventori',
      icon: <FaChartBar className="w-5 h-5 text-white" />,
      path: '/inventory/reports',
      color: 'yellow'
    },
    { 
      title: 'Penyesuaian',
      description: 'Sesuaikan stok berdasarkan penerimaan atau penyesuaian',
      icon: <FaExchangeAlt className="w-5 h-5 text-white" />,
      path: '/inventory/adjustment',
      color: 'orange'
    },
    { 
      title: 'Penerimaan',
      description: 'Kelola penerimaan produk dari supplier',
      icon: <FaTruck className="w-5 h-5 text-white" />,
      path: '/inventory/receptions',
      color: 'blue'
    },
    { 
      title: 'Retur Barang',
      description: 'Kelola pengembalian produk ke supplier',
      icon: <FaBoxOpen className="w-5 h-5 text-white" />,
      path: '/inventory/returns',
      color: 'purple'
    }
  ];

  // Fungsi untuk menampilkan dialog tambah stok
  const handleShowStockDialog = (product: ExtendedProduct) => {
    setSelectedLowStockItem(product);
    setShowStockDialog(true);
    setOrderOption(null);
  };

  // Fungsi untuk membuat pesanan baru
  const handleCreateOrder = () => {
    if (!selectedLowStockItem || !orderOption) return;
    
    // Implement order creation logic
    toast({
      title: orderOption === 'defecta' ? 'Defecta Created' : 'Relocation Request Sent',
      description: `${orderOption === 'defecta' ? 'Order' : 'Request'} for ${selectedLowStockItem.name} has been ${orderOption === 'defecta' ? 'created' : 'sent'}.`,
    });
    
    setShowStockDialog(false);
    setSelectedLowStockItem(null);
    setOrderOption(null);
  };

  // Fungsi untuk menganalisis kebutuhan order berdasarkan histori dan stok saat ini
  const getOrderAnalysis = (product: ExtendedProduct) => {
    if (!product) return null;
    // Simulasi data analisis (dalam implementasi nyata akan menggunakan data histori penjualan)
    const avgMonthlyConsumption = Math.round(Math.random() * 50) + 30; // Rata-rata konsumsi bulanan
    const leadTime = 7; // Waktu tunggu pesanan dalam hari
    const safetyStock = Math.round(avgMonthlyConsumption * 0.3); // 30% dari rata-rata konsumsi bulanan
    const dailyConsumption = Math.round(avgMonthlyConsumption / 30);
    const reorderPoint = Math.round(dailyConsumption * leadTime) + safetyStock;
    
    // Economic Order Quantity berdasarkan formula Wilson
    const annualDemand = avgMonthlyConsumption * 12;
    const orderCost = 50000; // Biaya pemesanan (fixed)
    const holdingCost = (product.purchasePrice || 0) * 0.2; // Biaya penyimpanan (20% dari harga)
    const economicOrderQuantity = Math.max(
      10,
      Math.round(Math.sqrt((2 * annualDemand * orderCost) / holdingCost))
    );
    
    // Rekomendasi jumlah pemesanan berdasarkan stok saat ini
    const recommendedOrder = Math.max(
      0,
      Math.round(economicOrderQuantity + reorderPoint - product.stock)
    );
    
    return {
      avgMonthlyConsumption,
      safetyStock,
      reorderPoint,
      economicOrderQuantity,
      recommendedOrder: recommendedOrder < 1 ? economicOrderQuantity : recommendedOrder
    };
  };

  // Fungsi untuk dismiss alert
  const dismissAlert = (type: 'lowStock' | 'expiry') => {
    setShowAlerts(false);
  };

  // Fungsi untuk membuka dialog penerimaan
  const handleReceiveOrder = (order: any) => {
    setSelectedOrder(order);
    
    // Initialize received items state based on current order
    const initialReceived: Record<string, number> = {};
    order.items.forEach((item: any) => {
      initialReceived[item.id] = item.received;
    });
    setReceivedItems(initialReceived);
    
    setShowReceiveDialog(true);
  };

  // Fungsi untuk memproses penerimaan produk
  const handleProcessReceiving = () => {
    if (!selectedOrder) return;
    
    // Update orders with received items
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        // Update items with received quantities
        const updatedItems = order.items.map(item => ({
          ...item,
          received: receivedItems[item.id] || 0
        }));
        
        // Determine the status based on received quantities
        let status = 'pending';
        const allReceived = updatedItems.every(item => item.received === item.quantity);
        const anyReceived = updatedItems.some(item => item.received > 0);
        
        if (allReceived) {
          status = 'complete';
        } else if (anyReceived) {
          status = 'partial';
        }
        
        return {
          ...order,
          items: updatedItems,
          status
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setShowReceiveDialog(false);
    
    toast({
      title: 'Penerimaan Berhasil',
      description: `Barang untuk order ${selectedOrder.id} telah diperbarui.`,
    });
  };

  // Klasifikasi produk berdasarkan tanggal kadaluwarsa
  const today = new Date();
  const oneMonthFromNow = new Date(today);
  oneMonthFromNow.setMonth(today.getMonth() + 1);
  const threeMonthsFromNow = new Date(today);
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  const expiringSoon = products.filter(p => 
    p.expiryDate && p.expiryDate > today && p.expiryDate <= oneMonthFromNow
  ).length;
  
  const expiringLater = products.filter(p => 
    p.expiryDate && p.expiryDate > oneMonthFromNow && p.expiryDate <= threeMonthsFromNow
  ).length;
  
  const notExpiringSoon = products.filter(p => 
    !p.expiryDate || p.expiryDate > threeMonthsFromNow
  ).length;
  
  const expired = products.filter(p => 
    p.expiryDate && p.expiryDate <= today
  ).length;

  // Data untuk pie chart kadaluarsa
  const expiryChartData = [
    { name: 'Kadaluarsa', value: expired, color: '#EF4444' }, // Merah
    { name: 'Segera Kadaluarsa (< 1 bulan)', value: expiringSoon, color: '#F59E0B' }, // Amber
    { name: 'Akan Kadaluarsa (1-3 bulan)', value: expiringLater, color: '#10B981' }, // Hijau
    { name: 'Aman (> 3 bulan)', value: notExpiringSoon, color: '#3B82F6' }, // Biru
  ];

  // Produk dengan stok rendah
  const lowStockProducts = products
    .filter(product => product.stock <= (product.minStock || 10))
    .sort((a, b) => (a.stock / (a.minStock || 10)) - (b.stock / (b.minStock || 10)))
    .slice(0, 5);

  // Fungsi untuk membuka dialog supplier detail
  const handleShowSupplierDetail = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowSupplierDetailDialog(true);
  };

  // Fungsi untuk menutup dialog supplier detail
  const handleCloseSupplierDetail = () => {
    setShowSupplierDetailDialog(false);
  };

  // Data untuk pie chart supplier
  const supplierChartData = mockTopSuppliers.map(supplier => ({
    name: supplier.name,
    value: supplier.totalSpend,
    color: supplier.id === '1' ? '#F97316' : // orange-500
           supplier.id === '2' ? '#F59E0B' : // amber-500
           supplier.id === '3' ? '#EA580C' : // orange-600
           supplier.id === '4' ? '#D97706' : // amber-600
                                '#FB923C'   // orange-400
  }));

  return (
    <InventoryPageLayout 
      title="Manajemen Inventaris" 
      description="Monitor stok produk, penerimaan, dan kategori untuk apotek Anda"
    >
      {/* Header dengan gradient dan info statistik */}
      <InventoryPageHeader 
        title="Manajemen Inventaris" 
        subtitle="Monitor produk stok, sesuaikan kategori dan supplier, dan kelola transaksi inventori"
        gradient={true}
        actionButtons={
          <>
            <Link href="/inventory/stocktake">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm font-medium">
                <FaClipboardList className="mr-1.5 h-4 w-4" />
                Stock Opname
              </Button>
            </Link>
            <Button className="bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 border-orange-100 text-sm font-medium">
              <FaPlus className="mr-1.5 h-4 w-4" />
              Tambah Produk
            </Button>
          </>
        }
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Feature cards section with enhanced red-orange styling and professional ornaments */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {featureCards.map((card, index) => (
            <Link key={index} href={card.path}>
              <Card className="cursor-pointer bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] overflow-hidden h-full group">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <div className="relative overflow-hidden pb-2">
                  {/* Ornamental circles */}
                  <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 opacity-10 transform translate-x-8 -translate-y-8 group-hover:opacity-20 transition-opacity"></div>
                  <div className="absolute left-0 bottom-0 w-16 h-16 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 opacity-10 transform -translate-x-8 translate-y-8 group-hover:opacity-20 transition-opacity"></div>
                  
                  <CardContent className="p-4 relative z-10">
                    <div className="flex items-start mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg shadow-sm flex-shrink-0 transform group-hover:scale-110 transition-transform">
                        {card.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-800">{card.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{card.description}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-2 mt-auto">
                      <div className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center group-hover:translate-x-1 transition-transform">
                        <span>Buka {card.title}</span>
                        <FaArrowRight className="ml-1.5 h-3 w-3" />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Card untuk Pie Chart dan Produk Stok Rendah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Card untuk Pie Chart Kategori Produk */}
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FaLayerGroup className="h-4 w-4 text-orange-600" />
                </div>
                Kategori Produk
              </CardTitle>
              <CardDescription>
                Distribusi produk berdasarkan kategori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} produk`, 'Jumlah']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Total {products.length} produk dalam {categories.length} kategori
              </div>
            </CardContent>
          </Card>

          {/* Card untuk Produk dengan Stok Rendah */}
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FaExclamationTriangle className="h-4 w-4 text-orange-600" />
                </div>
                Produk Stok Rendah
              </CardTitle>
              <CardDescription>
                Produk dengan stok di bawah batas minimum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-orange-50 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                          <FaBoxOpen className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">
                            SKU: {product.sku} | Min: {product.minStock} {product.unit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-red-600">{product.stock}</div>
                        <div className="text-xs text-gray-500">{product.unit}</div>
                        <Progress 
                          value={(product.stock / (product.minStock || 10)) * 100} 
                          className="w-24 h-1.5 mt-1"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    Semua produk memiliki stok yang cukup
                  </div>
                )}
              </div>
              {lowStockProducts.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  Lihat Semua Produk Stok Rendah
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Supplier dengan Transaksi Terbanyak */}
        <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow mb-8">
          <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <FaTruck className="h-4 w-4 text-orange-600" />
              </div>
              Supplier dengan Transaksi Terbanyak
            </CardTitle>
            <CardDescription>
              Daftar supplier berdasarkan jumlah dan nilai transaksi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tabel Supplier - 1/2 width */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-700">Daftar Top Supplier</h4>
                <div className="overflow-hidden border rounded-lg">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead className="text-center">Transaksi</TableHead>
                        <TableHead className="text-center">Tgl. Terakhir</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTopSuppliers.map((supplier) => (
                        <TableRow key={supplier.id} className="hover:bg-orange-50">
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-md bg-orange-100 flex items-center justify-center mr-2">
                                <FaBuilding className="h-4 w-4 text-orange-600" />
                              </div>
                              <div className="font-medium">{supplier.name}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {supplier.totalTransactions}
                          </TableCell>
                          <TableCell className="text-center">
                            {new Date(supplier.lastOrder).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatRupiah(supplier.totalSpend)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => handleShowSupplierDetail(supplier)}
                              >
                                <FaEye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                              >
                                <FaShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Pie Chart Supplier - 1/2 width */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-700">Porsi Pembelanjaan Supplier</h4>
                <div className="bg-gray-50 rounded-lg p-4 border h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={supplierChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {supplierChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [formatRupiah(value as number), 'Total Belanja']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Total Pembelanjaan: {formatRupiah(mockTopSuppliers.reduce((sum, supplier) => sum + supplier.totalSpend, 0))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                Lihat Semua Supplier
                <FaArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistik Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-b from-white to-orange-50">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <div className="rounded-full p-1.5 bg-orange-100 text-orange-600">
                  <FaCubes className="h-4 w-4" />
                </div>
                Total Stok Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{totalStock.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Unit dari {products.length} jenis produk</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-b from-white to-orange-50">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <div className="rounded-full p-1.5 bg-orange-100 text-orange-600">
                  <FaDollarSign className="h-4 w-4" />
                </div>
                Nilai Inventori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{formatRupiah(totalValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">Total nilai semua stok produk</p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-b from-white to-orange-50">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <div className="rounded-full p-1.5 bg-orange-100 text-orange-600">
                  <FaLayerGroup className="h-4 w-4" />
                </div>
                Kategori Produk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{categoryCounts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Jumlah kategori produk aktif</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tab dengan gaya kustom */}
        <Card className="overflow-hidden border-0 shadow-md mb-6">
          <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-0">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
                <TabsList className="bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="overview" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaChartBar className="mr-1.5 h-4 w-4" />
                    Ringkasan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="products" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaBoxOpen className="mr-1.5 h-4 w-4" />
                    Produk
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transactions" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaExchangeAlt className="mr-1.5 h-4 w-4" />
                    Transaksi
                  </TabsTrigger>
                  <TabsTrigger 
                    value="receptions" 
                    className="rounded-md px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    <FaTruck className="mr-1.5 h-4 w-4" />
                    Penerimaan
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grafik Kategori Teratas */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <FaTag className="mr-2 h-4 w-4 text-orange-500" />
                        Kategori Produk
                      </CardTitle>
                      <CardDescription>
                        Distribusi produk berdasarkan kategori
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categoryCounts.slice(0, 5).map((category, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-32 text-sm font-medium truncate">{category.name}</div>
                            <div className="flex-1">
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full`}
                                  style={{ width: `${(category.count / products.length) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="w-10 text-right text-sm font-medium text-gray-700">{category.count}</div>
                          </div>
                        ))}
                      </div>
                      {categoryCounts.length > 5 && (
                        <div className="mt-3 text-center">
                          <Button variant="link" className="text-orange-600 hover:text-orange-700 text-sm">
                            Lihat semua kategori
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Aktivitas Produk Terbaru */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <FaExchangeAlt className="mr-2 h-4 w-4 text-orange-500" />
                        Aktivitas Produk Terbaru
                      </CardTitle>
                      <CardDescription>
                        5 aktivitas produk terbaru
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivities.slice(0, 5).map((activity) => (
                          <div key={activity.id} className="flex items-center py-1 border-b border-gray-100 last:border-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity.type === 'order' 
                                ? 'bg-blue-100 text-blue-600' 
                                : activity.type === 'received' 
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-amber-100 text-amber-600'
                            }`}>
                              {activity.type === 'order' 
                                ? <FaShoppingCart className="h-3 w-3" /> 
                                : activity.type === 'received' 
                                  ? <FaCheckCircle className="h-3 w-3" />
                                  : <FaExchangeAlt className="h-3 w-3" />
                              }
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="text-sm font-medium text-gray-900">{activity.productName}</div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <span className="capitalize">{activity.type}</span>
                                <span className="inline-block h-1 w-1 rounded-full bg-gray-400 mx-1.5"></span>
                                <span>{formatDateTime(activity.date)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="mr-4">
                                <div className="text-orange-700 font-medium">{activity.quantity}</div>
                                <div className="text-xs text-gray-500">{activity.unit}</div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                <FaEye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <Button variant="link" className="text-orange-600 hover:text-orange-700 text-sm">
                          Lihat semua aktivitas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Tombol Aksi Cepat */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm">
                    <FaPlus className="mr-1.5 h-4 w-4" />
                    Tambah Produk Baru
                  </Button>
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <FaClipboardList className="mr-1.5 h-4 w-4" />
                    Mulai Stock Opname
                  </Button>
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <FaFileExport className="mr-1.5 h-4 w-4" />
                    Ekspor Data Inventori
                  </Button>
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <FaPrint className="mr-1.5 h-4 w-4" />
                    Cetak Laporan
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaSearch className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        placeholder="Cari produk..."
                        className="pl-10 pr-4 py-2 border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-md"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                    <Button variant="outline" className="border-gray-300 text-gray-700">
                      <FaFilter className="mr-1.5 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                    <FaPlus className="mr-1.5 h-4 w-4" />
                    Tambah Produk
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center">
                            Nama Produk
                            {sortField === "name" && (
                              sortDirection === "asc" ? 
                                <FaSortUp className="ml-1 h-3 w-3" /> : 
                                <FaSortDown className="ml-1 h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead 
                          className="cursor-pointer text-right"
                          onClick={() => handleSort("stock")}
                        >
                          <div className="flex items-center justify-end">
                            Stok
                            {sortField === "stock" && (
                              sortDirection === "asc" ? 
                                <FaSortUp className="ml-1 h-3 w-3" /> : 
                                <FaSortDown className="ml-1 h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer text-right"
                          onClick={() => handleSort("price")}
                        >
                          <div className="flex items-center justify-end">
                            Harga
                            {sortField === "price" && (
                              sortDirection === "asc" ? 
                                <FaSortUp className="ml-1 h-3 w-3" /> : 
                                <FaSortDown className="ml-1 h-3 w-3" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getSortedProducts().slice(0, 10).map((product) => (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <span className={`text-xl font-bold ${product.stock <= (product.minStock || 0) ? 'text-red-600' : 'text-gray-700'}`}>
                                {product.stock}
                              </span>
                              <span className="text-gray-500 text-sm ml-1">{product.unit}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatRupiah(product.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                <FaEye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                                <FaEdit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700">
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Menampilkan 1-10 dari {filteredProducts.length} produk
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Sebelumnya
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 bg-orange-50 text-orange-700 border-orange-200">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      3
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Berikutnya
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Riwayat Transaksi Inventori</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                      <FaFileExport className="mr-1.5 h-4 w-4" />
                      Ekspor Data
                    </Button>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <FaPlus className="mr-1.5 h-4 w-4" />
                      Tambah Transaksi
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>No. Transaksi</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.slice(0, 10).map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{transaction.transactionNumber}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                transaction.type === 'Penjualan' 
                                  ? 'bg-red-50 text-red-700 border-red-200' 
                                  : transaction.type === 'Pembelian' 
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                              }
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{transaction.productName}</TableCell>
                          <TableCell className="text-right">{transaction.quantity}</TableCell>
                          <TableCell className="text-right font-medium">{formatRupiah(transaction.total)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                <FaEye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700">
                                <FaPrint className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Menampilkan 1-10 dari {mockTransactions.length} transaksi
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Sebelumnya
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 bg-orange-50 text-orange-700 border-orange-200">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      3
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Berikutnya
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="receptions" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Penerimaan Produk dari Distributor</h3>
                  <div className="flex items-center space-x-2">
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <FaPlus className="mr-1.5 h-4 w-4" />
                      Pesanan Baru
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow bg-white">
                      <div className={`h-1.5 ${
                        order.status === 'complete' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        order.status === 'partial' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
                        'bg-gradient-to-r from-orange-500 to-amber-500'
                      }`}></div>
                      
                      <CardContent className="pt-5 pb-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${
                              order.status === 'complete' ? 'bg-green-100' :
                              order.status === 'partial' ? 'bg-amber-100' :
                              'bg-orange-100'
                            }`}>
                              <FaBox className={`h-6 w-6 ${
                                order.status === 'complete' ? 'text-green-600' :
                                order.status === 'partial' ? 'text-amber-600' :
                                'text-orange-600'
                              }`} />
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-medium">Order #{order.id}</h4>
                                <Badge className={
                                  order.status === 'complete' ? 'bg-green-100 text-green-800 border-green-200' :
                                  order.status === 'partial' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                  'bg-orange-100 text-orange-800 border-orange-200'
                                }>
                                  {order.status === 'complete' ? 'Selesai' :
                                  order.status === 'partial' ? 'Sebagian' :
                                  'Menunggu'}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">Distributor: {order.supplier}</div>
                              <div className="text-sm text-gray-500">
                                Tanggal: {new Date(order.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                              
                              <div className="mt-3 flex flex-wrap gap-2">
                                {order.items.map((item: any) => (
                                  <div key={item.id} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    {item.received === item.quantity ? (
                                      <FaCheckCircle className="h-3 w-3 text-green-500" />
                                    ) : item.received > 0 ? (
                                      <FaCheck className="h-3 w-3 text-amber-500" />
                                    ) : (
                                      <FaTimesCircle className="h-3 w-3 text-gray-400" />
                                    )}
                                    <span>{item.name} ({item.received}/{item.quantity})</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 ml-auto">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-orange-200 text-orange-700 hover:bg-orange-50"
                            >
                              <FaEye className="mr-1.5 h-3.5 w-3.5" />
                              Detail
                            </Button>
                            <Button 
                              size="sm" 
                              className={`${
                                order.status === 'complete' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' :
                                'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                              }`}
                              onClick={() => handleReceiveOrder(order)}
                              disabled={order.status === 'complete'}
                            >
                              <FaDownload className="mr-1.5 h-3.5 w-3.5" />
                              {order.status === 'complete' ? 'Sudah Diterima' : 'Terima Produk'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {showStockDialog && selectedLowStockItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header gradient dan ornamen */}
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
              <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-20 transform translate-x-16 -translate-y-16"></div>
              <div className="absolute left-0 bottom-0 w-32 h-32 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 opacity-15 transform -translate-x-16 translate-y-16"></div>
              
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2.5 rounded-full mr-4">
                    <FaBoxOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedLowStockItem?.name}</h3>
                    <p className="text-orange-100 text-sm">
                      {selectedLowStockItem?.category} | SKU: {selectedLowStockItem?.sku || 'N/A'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={() => setShowStockDialog(false)}
                >
                  <FaTimes className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Konten section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Info Produk */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b border-orange-100 pb-2">
                  Informasi Produk
                </h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <FaBoxOpen className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-gray-600">Stok Saat Ini</span>
                    </div>
                    <div>
                      <span className={`text-xl font-bold ${selectedLowStockItem?.stock <= (selectedLowStockItem?.minStock || 0) ? 'text-red-600' : 'text-gray-700'}`}>
                        {selectedLowStockItem?.stock}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">{selectedLowStockItem?.unit}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <FaExclamationTriangle className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-gray-600">Stok Minimum</span>
                    </div>
                    <div>
                      <span className="text-xl font-bold text-gray-700">{selectedLowStockItem?.minStock}</span>
                      <span className="text-gray-500 text-sm ml-1">{selectedLowStockItem?.unit}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <FaDollarSign className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-gray-600">Harga Beli</span>
                    </div>
                    <span className="text-xl font-bold text-gray-700">
                      {formatRupiah(selectedLowStockItem?.purchasePrice || 0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <FaDollarSign className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="text-gray-600">Harga Jual</span>
                    </div>
                    <span className="text-xl font-bold text-gray-700">
                      {formatRupiah(selectedLowStockItem?.sellingPrice || 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Analisis Order */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b border-orange-100 pb-2">
                  Analisis Order
                </h4>
                
                {/* Data analisis order */}
                {(() => {
                  const analysis = selectedLowStockItem ? getOrderAnalysis(selectedLowStockItem) : null;
                  return (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Konsumsi Bulanan Rata-Rata</span>
                        <span className="font-semibold">{analysis?.avgMonthlyConsumption} {selectedLowStockItem?.unit}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stok Pengaman</span>
                        <span className="font-semibold">{analysis?.safetyStock} {selectedLowStockItem?.unit}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Titik Pemesanan Kembali</span>
                        <span className="font-semibold">{analysis?.reorderPoint} {selectedLowStockItem?.unit}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kuantitas Pemesanan Ekonomis</span>
                        <span className="font-semibold">{analysis?.economicOrderQuantity} {selectedLowStockItem?.unit}</span>
                      </div>
                      
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg mt-4">
                        <div className="flex items-center mb-2">
                          <FaExclamationTriangle className="h-5 w-5 text-orange-500 mr-2" />
                          <span className="font-semibold text-orange-800">Jumlah Pemesanan yang Direkomendasikan</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-700 text-center py-2">
                          {analysis?.recommendedOrder} {selectedLowStockItem?.unit}
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          Berdasarkan histori penjualan dan stok minimum
                        </p>
                      </div>
                    </div>
                  );
                })()}
                
                {/* Bagian aksi order */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-3">Pilih Aksi</h5>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Button 
                      variant={orderOption === 'defecta' ? 'default' : 'outline'} 
                      className={orderOption === 'defecta' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                      }
                      onClick={() => setOrderOption('defecta')}
                    >
                      <FaFileExport className="mr-2 h-4 w-4" />
                      Buat Defecta
                    </Button>
                    
                    <Button 
                      variant={orderOption === 'relocation' ? 'default' : 'outline'} 
                      className={orderOption === 'relocation' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                      }
                      onClick={() => setOrderOption('relocation')}
                    >
                      <FaExchangeAlt className="mr-2 h-4 w-4" />
                      Relokasi
                    </Button>
                  </div>
                  
                  {orderOption && (
                    <Button 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      onClick={handleCreateOrder}
                    >
                      {orderOption === 'defecta' ? 'Buat Pesanan' : 'Kirim Permintaan Relokasi'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showReceiveDialog && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header gradient dan ornamen */}
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
              <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-20 transform translate-x-16 -translate-y-16"></div>
              <div className="absolute left-0 bottom-0 w-32 h-32 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 opacity-15 transform -translate-x-16 translate-y-16"></div>
              
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2.5 rounded-full mr-4">
                    <FaTruck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedOrder.supplier}</h3>
                    <p className="text-orange-100 text-sm">
                      No. Penerimaan: {selectedOrder.id}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={() => setShowReceiveDialog(false)}
                >
                  <FaTimes className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Konten section */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <FaCalendarAlt className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-gray-600">Tanggal Penerimaan</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">{new Date(selectedOrder.date).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <FaDollarSign className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-gray-600">Total Nilai</span>
                  </div>
                  <span className="font-medium text-gray-700">{formatRupiah(selectedOrder.total)}</span>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b border-orange-100 pb-2 flex items-center">
                <FaClipboardList className="mr-2 text-orange-500" />
                Daftar Barang
              </h4>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableRow>
                      <TableHead>Produk</TableHead>
                      <TableHead className="text-center">Jumlah</TableHead>
                      <TableHead className="text-center">Diterima</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item: any) => (
                      <TableRow key={item.id} className="hover:bg-orange-50">
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.unit}</div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            max={item.quantity}
                            className="w-20 mx-auto text-center"
                            value={receivedItems[item.id] || 0}
                            onChange={(e) => {
                              const val = Math.min(Math.max(0, parseInt(e.target.value) || 0), item.quantity);
                              setReceivedItems({
                                ...receivedItems,
                                [item.id]: val
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {receivedItems[item.id] === item.quantity ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">Lengkap</Badge>
                          ) : receivedItems[item.id] > 0 ? (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Sebagian</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">Belum</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start gap-3 mt-4">
                <FaInfoCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Petunjuk Penerimaan:</p>
                  <ol className="space-y-1 list-decimal ml-4">
                    <li>Periksa jumlah barang fisik yang diterima</li>
                    <li>Periksa kualitas dan pastikan tidak ada kerusakan</li>
                    <li>Verifikasi tanggal kadaluarsa</li>
                    <li>Input jumlah yang benar-benar diterima</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* Bagian aksi */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowReceiveDialog(false)}
              >
                Batal
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                onClick={handleProcessReceiving}
              >
                <FaCheck className="mr-1.5 h-4 w-4" />
                Simpan Penerimaan
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showSupplierDetailDialog && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header dengan ornamen merah-orange */}
            <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 opacity-20 transform translate-x-24 -translate-y-24"></div>
              <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 opacity-15 transform -translate-x-16 translate-y-16"></div>
              
              <div className="absolute right-1/3 bottom-0 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-300 opacity-15 transform translate-y-12"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-start">
                  <div className="bg-white/20 p-3 rounded-xl mr-5">
                    <FaBuilding className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{selectedSupplier.name}</h3>
                    <div className="text-orange-100 text-sm">ID: {selectedSupplier.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{formatRupiah(selectedSupplier.totalSpend)}</div>
                  <div className="text-orange-100 text-sm">Total Pembelanjaan</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={handleCloseSupplierDetail}
                >
                  <FaTimes className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Statistik transaksi */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-lg">
                    <FaFileExport className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{selectedSupplier.totalTransactions}</div>
                    <div className="text-sm text-gray-500">Total Transaksi</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-lg">
                    <FaCalendarAlt className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {new Date(selectedSupplier.lastOrder).toLocaleDateString('id-ID')}
                    </div>
                    <div className="text-sm text-gray-500">Transaksi Terakhir</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg">
                    <FaDollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatRupiah(
                        mockSupplierTransactions[selectedSupplier.id]?.[0]?.amount || 0
                      )}
                    </div>
                    <div className="text-sm text-gray-500">Pembelian Terakhir</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Riwayat transaksi */}
            <div className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <FaClipboardList className="mr-2 text-orange-500" />
                Riwayat Transaksi
              </h4>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableRow>
                      <TableHead className="w-40">No. Invoice</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-center">Jumlah Item</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center w-32">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSupplierTransactions[selectedSupplier.id]?.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-orange-50">
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="text-center">{transaction.items} item</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatRupiah(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Selesai
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                              <FaEye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                              <FaPrint className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {/* Footer action */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={handleCloseSupplierDetail}
              >
                Tutup
              </Button>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              >
                <FaShoppingCart className="mr-1.5 h-4 w-4" />
                Buat Pesanan Baru
              </Button>
            </div>
          </div>
        </div>
      )}
    </InventoryPageLayout>
  );
};

export default InventoryPage;
