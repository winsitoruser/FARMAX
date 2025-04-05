import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from 'next/head';
import InventoryLayout from "@/components/layouts/inventory-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger, 
} from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { 
  FaCalendarTimes, 
  FaSearch, 
  FaFileExport, 
  FaFilter,
  FaBell,
  FaFileAlt,
  FaTag,
  FaPrint,
  FaEye,
  FaArrowRight,
  FaTrash,
  FaExclamationTriangle,
  FaDownload,
  FaCheckCircle,
  FaTimesCircle,
  FaUserAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaWarehouse,
  FaHistory,
  FaThList,
  FaInfoCircle,
  FaClipboardList
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast"; 
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster"; 

// Helper function to format currency
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper function to calculate days between dates
const getDaysBetween = (date1: Date, date2: Date) => {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Interface for expiry item
interface ExpiryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expiryDate: Date;
  daysRemaining: number;
  currentStock: number;
  value: number;
  status: "expired" | "critical" | "warning" | "good";
}

// Expiry status thresholds in days
const EXPIRED = 0;
const CRITICAL = 30;  // Less than 30 days
const WARNING = 90;   // Less than 90 days

// Generate mock expiry data
const generateMockExpiryData = (): ExpiryItem[] => {
  const today = new Date();
  
  return [
    {
      id: "1",
      productId: "1",
      productName: "Paracetamol 500mg",
      sku: "MED001",
      batchNumber: "B12345",
      expiryDate: new Date(today.getFullYear(), today.getMonth() + 1, 15),
      daysRemaining: getDaysBetween(today, new Date(today.getFullYear(), today.getMonth() + 1, 15)),
      currentStock: 150,
      value: 1125000, // 150 * 7500
      status: "warning"
    },
    {
      id: "2",
      productId: "2",
      productName: "Amoxicillin 500mg",
      sku: "MED002",
      batchNumber: "B22456",
      expiryDate: new Date(today.getFullYear(), today.getMonth() - 1, 5),
      daysRemaining: -getDaysBetween(today, new Date(today.getFullYear(), today.getMonth() - 1, 5)),
      currentStock: 50,
      value: 600000, // 50 * 12000
      status: "expired"
    },
    {
      id: "3",
      productId: "3",
      productName: "Vitamin C 1000mg",
      sku: "VIT001",
      batchNumber: "B38765",
      expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20),
      daysRemaining: 20,
      currentStock: 75,
      value: 525000, // 75 * 7000
      status: "critical"
    },
    {
      id: "4",
      productId: "4",
      productName: "Omeprazole 20mg",
      sku: "MED025",
      batchNumber: "B45678",
      expiryDate: new Date(today.getFullYear(), today.getMonth() + 8, 1),
      daysRemaining: getDaysBetween(today, new Date(today.getFullYear(), today.getMonth() + 8, 1)),
      currentStock: 100,
      value: 1300000, // 100 * 13000
      status: "good"
    },
    {
      id: "5",
      productId: "5",
      productName: "Cefixime 100mg",
      sku: "MED106",
      batchNumber: "B56789",
      expiryDate: new Date(today.getFullYear(), today.getMonth() + 2, 25),
      daysRemaining: getDaysBetween(today, new Date(today.getFullYear(), today.getMonth() + 2, 25)),
      currentStock: 60,
      value: 840000, // 60 * 14000
      status: "warning"
    },
  ];
};

const mockExpiryData = generateMockExpiryData();

// Interface for order history
interface OrderHistory {
  id: string;
  orderDate: Date;
  orderNumber: string;
  quantity: number;
  staff: {
    id: string;
    name: string;
    avatar: string;
    position: string;
  };
}

// Generate mock order history
const generateOrderHistory = (productId: string): OrderHistory[] => {
  const staffMembers = [
    { id: "staff1", name: "Budi Santoso", avatar: "", position: "Senior Apoteker" },
    { id: "staff2", name: "Ani Wijaya", avatar: "", position: "Apoteker" },
    { id: "staff3", name: "Dedi Kurniawan", avatar: "", position: "Asisten Apoteker" },
    { id: "staff4", name: "Siti Rahayu", avatar: "", position: "Staff Gudang" },
  ];

  const numberOfOrders = Math.floor(Math.random() * 5) + 1;
  const orders: OrderHistory[] = [];

  for (let i = 0; i < numberOfOrders; i++) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 60) - 5);
    
    const randomStaff = staffMembers[Math.floor(Math.random() * staffMembers.length)];
    
    orders.push({
      id: `order-${productId}-${i}`,
      orderDate,
      orderNumber: `PO-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      quantity: Math.floor(Math.random() * 50) + 5,
      staff: randomStaff
    });
  }

  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
};

const ExpiryPage: NextPage = () => {
  // Filter states
  const [filter, setFilter] = useState<string>("all"); // all, expired, critical, warning, good
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("expiry-asc"); // expiry-asc, expiry-desc, name, value-desc
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<ExpiryItem | null>(null);
  const [productDetailOpen, setProductDetailOpen] = useState(false);
  const [defectaDialogOpen, setDefectaDialogOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  
  // Toast hooks
  const { toast } = useToast();

  // Function to handle showing product detail
  const handleShowProductDetail = (product: ExpiryItem) => {
    setSelectedProduct(product);
    // Generate order history for this product
    setOrderHistory(generateOrderHistory(product.id));
    setProductDetailOpen(true);
  };

  // Function to handle defecta confirmation
  const handleDefectaConfirm = (product: ExpiryItem) => {
    setSelectedProduct(product);
    setDefectaDialogOpen(true);
  };

  // Function to handle defecta submission
  const handleDefectaSubmit = () => {
    if (selectedProduct) {
      setDefectaDialogOpen(false);
      
      // Show success toast notification
      toast({
        title: "Permintaan Berhasil!",
        description: "Produk telah ditambahkan ke daftar defecta.",
        variant: "default",
      });
    }
  };
  
  // Function to filter data based on status
  const getFilteredData = () => {
    let filtered = [...mockExpiryData];
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(item => item.status === filter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.productName.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.batchNumber.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "expiry-asc":
        filtered.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
        break;
      case "expiry-desc":
        filtered.sort((a, b) => b.expiryDate.getTime() - a.expiryDate.getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "value-desc":
        filtered.sort((a, b) => b.value - a.value);
        break;
      default:
        break;
    }
    
    return filtered;
  };
  
  const filteredData = getFilteredData();
  
  // Calculate summary statistics
  const getSummaryStats = () => {
    const total = mockExpiryData.length;
    const expired = mockExpiryData.filter(item => item.status === "expired").length;
    const critical = mockExpiryData.filter(item => item.status === "critical").length;
    const warning = mockExpiryData.filter(item => item.status === "warning").length;
    
    const totalValue = mockExpiryData.reduce((sum, item) => sum + item.value, 0);
    const expiredValue = mockExpiryData
      .filter(item => item.status === "expired")
      .reduce((sum, item) => sum + item.value, 0);
    
    return { total, expired, critical, warning, totalValue, expiredValue };
  };
  
  const stats = getSummaryStats();
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Get badge for status
  const getStatusBadge = (status: string, daysRemaining: number) => {
    switch (status) {
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Kadaluarsa
          </Badge>
        );
      case "critical":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            Kritis ({daysRemaining} hari)
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Perhatian ({daysRemaining} hari)
          </Badge>
        );
      case "good":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Aman ({daysRemaining} hari)
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <InventoryLayout>
      <Head>
        <title>Pelacakan Kadaluarsa</title>
      </Head>
      <div className="flex flex-col min-h-screen">
        <div className="flex justify-between items-center p-6 pb-0">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaCalendarTimes className="mr-3 text-red-500" /> Pelacakan Kadaluarsa
          </h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <FaBell className="mr-2 h-4 w-4" /> Atur Notifikasi
            </Button>
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <FaFileExport className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-red-800 text-sm font-medium">Produk Kadaluarsa</p>
                  <p className="text-3xl font-bold text-red-900 mt-1">{stats.expired}</p>
                </div>
                <div className="bg-red-200 p-3 rounded-full">
                  <FaCalendarTimes className="h-6 w-6 text-red-700" />
                </div>
              </div>
              <p className="text-red-700 text-sm mt-4">
                Nilai: {formatRupiah(stats.expiredValue)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-orange-800 text-sm font-medium">Kritis (&lt;30 hari)</p>
                  <p className="text-3xl font-bold text-orange-900 mt-1">{stats.critical}</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-full">
                  <FaCalendarTimes className="h-6 w-6 text-orange-700" />
                </div>
              </div>
              <p className="text-orange-700 text-sm mt-4">
                Perlu tindakan segera
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-yellow-800 text-sm font-medium">Perhatian (&lt;90 hari)</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-1">{stats.warning}</p>
                </div>
                <div className="bg-yellow-200 p-3 rounded-full">
                  <FaCalendarTimes className="h-6 w-6 text-yellow-700" />
                </div>
              </div>
              <p className="text-yellow-700 text-sm mt-4">
                Pantau secara berkala
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-800 text-sm font-medium">Total Produk</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <FaFileAlt className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <p className="text-blue-700 text-sm mt-4">
                Nilai: {formatRupiah(stats.totalValue)}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filter Section */}
        <Card className="border-gray-200 p-6">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-lg flex items-center">
              <FaFilter className="mr-2 text-gray-600" /> Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Status Kadaluarsa</p>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="expired">Kadaluarsa</SelectItem>
                    <SelectItem value="critical">Kritis (&lt;30 hari)</SelectItem>
                    <SelectItem value="warning">Perhatian (&lt;90 hari)</SelectItem>
                    <SelectItem value="good">Aman (&gt;90 hari)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Urutkan Berdasarkan</p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urutan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expiry-asc">Tanggal Kadaluarsa (Terdekat)</SelectItem>
                    <SelectItem value="expiry-desc">Tanggal Kadaluarsa (Terjauh)</SelectItem>
                    <SelectItem value="name">Nama Produk</SelectItem>
                    <SelectItem value="value-desc">Nilai Tertinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Cari Produk</p>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nama, SKU, atau batch"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Data Table */}
        <Card className="border-gray-200 p-6">
          <CardHeader className="pb-4 border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Produk</CardTitle>
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Kadaluarsa
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Kritis
                </Badge>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Perhatian
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Aman
                </Badge>
              </div>
            </div>
            <CardDescription>
              Menampilkan {filteredData.length} dari {mockExpiryData.length} produk
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Produk</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Tanggal Kadaluarsa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Stok</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                        Tidak ada data yang sesuai dengan filter
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow 
                        key={item.id} 
                        className={
                          item.status === "expired" 
                            ? "bg-red-50 hover:bg-red-100" 
                            : item.status === "critical"
                            ? "bg-orange-50 hover:bg-orange-100"
                            : item.status === "warning"
                            ? "bg-yellow-50 hover:bg-yellow-100"
                            : "hover:bg-gray-50"
                        }
                      >
                        <TableCell>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">{item.sku}</div>
                        </TableCell>
                        <TableCell>{item.batchNumber}</TableCell>
                        <TableCell>{formatDate(item.expiryDate)}</TableCell>
                        <TableCell>
                          {getStatusBadge(item.status, item.daysRemaining)}
                        </TableCell>
                        <TableCell className="text-center">{item.currentStock}</TableCell>
                        <TableCell className="text-right">{formatRupiah(item.value)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                              onClick={() => handleShowProductDetail(item)}
                            >
                              <FaEye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => handleDefectaConfirm(item)}
                            >
                              <FaTag className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                            >
                              <FaPrint className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              <p>Keterangan Status:</p>
              <ul className="ml-6 mt-1 list-disc space-y-1">
                <li><span className="text-red-600 font-medium">Kadaluarsa</span>: Produk yang telah melewati tanggal kadaluarsa</li>
                <li><span className="text-orange-600 font-medium">Kritis</span>: Produk yang akan kadaluarsa dalam 30 hari atau kurang</li>
                <li><span className="text-yellow-600 font-medium">Perhatian</span>: Produk yang akan kadaluarsa dalam 31-90 hari</li>
                <li><span className="text-green-600 font-medium">Aman</span>: Produk yang akan kadaluarsa dalam lebih dari 90 hari</li>
              </ul>
              
              <p className="mt-4">Tindakan yang disarankan:</p>
              <ul className="ml-6 mt-1 list-disc space-y-1">
                <li><span className="text-red-600 font-medium">Kadaluarsa</span>: Segera pisahkan dan ajukan penghapusan stok</li>
                <li><span className="text-orange-600 font-medium">Kritis</span>: Berikan label diskon khusus untuk mempercepat penjualan</li>
                <li><span className="text-yellow-600 font-medium">Perhatian</span>: Prioritaskan produk ini dalam penjualan, pertimbangkan promo</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        {/* Product Detail Dialog */}
        <Dialog open={productDetailOpen} onOpenChange={setProductDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <FaBoxOpen className="mr-2 text-orange-500" /> Detail Produk
              </DialogTitle>
              <DialogDescription>
                Informasi lengkap produk dan riwayat pemesanan
              </DialogDescription>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="space-y-6">
                {/* Product Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-orange-200">
                    <CardHeader className="bg-orange-50 border-b border-orange-100">
                      <CardTitle className="text-lg text-orange-800 flex items-center">
                        <FaInfoCircle className="mr-2" /> Informasi Produk
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedProduct.productName}</h3>
                        <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Batch</p>
                          <p className="font-medium">{selectedProduct.batchNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Stok</p>
                          <p className="font-medium">{selectedProduct.currentStock} unit</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Kadaluarsa</p>
                          <p className="font-medium">{formatDate(selectedProduct.expiryDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <div>{getStatusBadge(selectedProduct.status, selectedProduct.daysRemaining)}</div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Nilai</p>
                        <p className="font-medium">{formatRupiah(selectedProduct.value)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Lokasi Penyimpanan</p>
                        <p className="font-medium">Rak B23, Gudang Utama</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200">
                    <CardHeader className="bg-blue-50 border-b border-blue-100">
                      <CardTitle className="text-lg text-blue-800 flex items-center">
                        <FaClipboardList className="mr-2" /> Data Tambahan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500">Kategori</p>
                        <p className="font-medium">Obat Keras</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Supplier</p>
                        <p className="font-medium">PT Kimia Farma</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Harga Beli</p>
                        <p className="font-medium">{formatRupiah(selectedProduct.value / selectedProduct.currentStock)}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Harga Jual</p>
                        <p className="font-medium">{formatRupiah((selectedProduct.value / selectedProduct.currentStock) * 1.2)}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Minimum Stok</p>
                        <p className="font-medium">10 unit</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Order History */}
                <Card className="border-green-200">
                  <CardHeader className="bg-green-50 border-b border-green-100">
                    <CardTitle className="text-lg text-green-800 flex items-center">
                      <FaHistory className="mr-2" /> Riwayat Pemesanan
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-[200px]">
                    <CardContent className="p-4">
                      {orderHistory.length === 0 ? (
                        <div className="text-center text-gray-500 py-6">
                          Tidak ada riwayat pemesanan
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orderHistory.map((order, index) => (
                            <div key={order.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{order.orderNumber}</p>
                                  <p className="text-sm text-gray-500">
                                    <FaCalendarAlt className="inline-block mr-1" /> 
                                    {formatDate(order.orderDate)}
                                  </p>
                                  <p className="text-sm">Jumlah: {order.quantity} unit</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="text-right">
                                    <div className="flex items-center justify-end">
                                      <FaUserAlt className="mr-1 text-gray-400" />
                                      <p className="font-medium">{order.staff.name}</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{order.staff.position}</p>
                                  </div>
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={order.staff.avatar} alt={order.staff.name} />
                                    <AvatarFallback className="bg-orange-100 text-orange-800">
                                      {order.staff.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </ScrollArea>
                </Card>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setProductDetailOpen(false)}
                  >
                    Tutup
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => {
                      setProductDetailOpen(false);
                      handleDefectaConfirm(selectedProduct);
                    }}
                  >
                    <FaTag className="mr-2" />
                    Tambahkan ke Defecta
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Defecta Confirmation Dialog */}
        <Dialog open={defectaDialogOpen} onOpenChange={setDefectaDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center">
                <FaExclamationTriangle className="mr-2 text-amber-500" /> Konfirmasi Defecta
              </DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menambahkan produk ini ke daftar defecta?
              </DialogDescription>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="py-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="shrink-0">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <FaBoxOpen className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedProduct.productName}</h3>
                      <div className="text-sm text-gray-500 space-y-1 mt-1">
                        <p>SKU: {selectedProduct.sku}</p>
                        <p>Batch: {selectedProduct.batchNumber}</p>
                        <p>Kadaluarsa: {formatDate(selectedProduct.expiryDate)}</p>
                        <p>Stok: {selectedProduct.currentStock} unit</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Setelah ditambahkan ke daftar defecta, produk ini akan diberi tanda untuk penggantian atau pengembalian ke supplier.
                </p>
              </div>
            )}
            
            <DialogFooter className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDefectaDialogOpen(false)}
              >
                <FaTimesCircle className="mr-2" />
                Batal
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleDefectaSubmit}
              >
                <FaCheckCircle className="mr-2" />
                Ya, Tambahkan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Toast Provider for notifications */}
        <Toaster />
      </div>
    </InventoryLayout>
  );
};

// Wrap the page component with ToastProvider
const ExpiryPageWithToast: NextPage = () => {
  return (
    <ToastProvider>
      <ExpiryPage />
    </ToastProvider>
  );
};

export default ExpiryPageWithToast;
