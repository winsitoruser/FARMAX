import React, { useState } from "react";
import { NextPage } from "next";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { mockProducts, mockStocks, mockCategories } from "@/modules/inventory/types";
import { formatRupiah } from "@/lib/utils";
import InventoryNavbar from "@/modules/inventory/components/InventoryNavbar";
import { 
  FaBoxes, 
  FaSearch, 
  FaExchangeAlt, 
  FaListAlt, 
  FaBoxOpen,
  FaWarehouse,
  FaExclamationTriangle,
  FaArrowDown,
  FaArrowUp,
  FaHistory,
  FaEdit,
  FaBarcode,
  FaPrint
} from "react-icons/fa";

// Function to get stock status
const getStockStatus = (currentStock: number, minStock: number) => {
  if (currentStock === 0) return "out-of-stock";
  if (currentStock <= minStock) return "low";
  return "good";
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "out-of-stock":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Habis</Badge>;
    case "low":
      return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Minimum</Badge>;
    case "good":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Tersedia</Badge>;
    default:
      return null;
  }
};

const StockPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("current");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [transferQuantity, setTransferQuantity] = useState(1);
  const [fromLocation, setFromLocation] = useState<string>("display");
  const [toLocation, setToLocation] = useState<string>("warehouse");
  
  // Mock locations
  const locations = [
    { id: "display", name: "Rak Display" },
    { id: "warehouse", name: "Gudang Utama" }
  ];
  
  // Mock stock movement history
  const stockMovementHistory = [
    { 
      id: "1", 
      date: new Date(2024, 2, 25), 
      productName: "Paracetamol 500mg", 
      type: "in", 
      quantity: 100, 
      from: "Supplier", 
      to: "Gudang Utama", 
      reference: "GR-2024-0325" 
    },
    { 
      id: "2", 
      date: new Date(2024, 2, 25), 
      productName: "Paracetamol 500mg", 
      type: "transfer", 
      quantity: 50, 
      from: "Gudang Utama", 
      to: "Rak Display", 
      reference: "TR-2024-0325-1" 
    },
    { 
      id: "3", 
      date: new Date(2024, 2, 25), 
      productName: "Amoxicillin 500mg", 
      type: "in", 
      quantity: 80, 
      from: "Supplier", 
      to: "Gudang Utama", 
      reference: "GR-2024-0325" 
    },
    { 
      id: "4", 
      date: new Date(2024, 2, 26), 
      productName: "Vitamin C 1000mg", 
      type: "out", 
      quantity: 5, 
      from: "Rak Display", 
      to: "Penjualan", 
      reference: "SO-2024-0326-1" 
    },
    { 
      id: "5", 
      date: new Date(2024, 2, 26), 
      productName: "Vitamin C 1000mg", 
      type: "transfer", 
      quantity: 20, 
      from: "Gudang Utama", 
      to: "Rak Display", 
      reference: "TR-2024-0326-1" 
    },
  ];
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get combined stock data with product details
  const getStockData = () => {
    return mockProducts.map(product => {
      const stockInfo = mockStocks.find(s => s.productId === product.id) || { 
        productId: product.id, 
        currentStock: 0, 
        locations: [] 
      };
      
      const category = mockCategories.find(c => c.id === product.categoryId);
      const status = getStockStatus(stockInfo.currentStock, product.minStock);
      
      return {
        ...product,
        ...stockInfo,
        categoryName: category?.name || 'Tidak ada kategori',
        status
      };
    });
  };
  
  const allStockData = getStockData();
  
  // Filter stock data
  const filteredStockData = allStockData.filter(item => {
    // Search filter
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode?.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Category filter
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
    
    // Location filter - simplification, in real app would filter by location stock
    const matchesLocation = selectedLocation === "all";
    
    // Status filter
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesStatus;
  });
  
  // Summary statistics
  const getSummaryStats = () => {
    const total = allStockData.length;
    const outOfStock = allStockData.filter(item => item.status === "out-of-stock").length;
    const lowStock = allStockData.filter(item => item.status === "low").length;
    
    const totalValue = allStockData.reduce((sum, item) => {
      return sum + (item.currentStock * item.purchasePrice);
    }, 0);
    
    return { total, outOfStock, lowStock, totalValue };
  };
  
  const stats = getSummaryStats();
  
  // Handle stock transfer
  const handleTransfer = () => {
    // In a real app, this would update the database
    console.log(`Transferring ${transferQuantity} of ${selectedProduct?.name} from ${fromLocation} to ${toLocation}`);
    setIsTransferModalOpen(false);
    setSelectedProduct(null);
    setTransferQuantity(1);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen">
        <Breadcrumbs
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Inventori", href: "/inventory" },
            { title: "Stok", href: "/inventory/stock" },
          ]}
          className="p-6 pb-0"
        />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaBoxes className="mr-3 text-indigo-500" /> Manajemen Stok
              </h1>
              <p className="text-gray-600 mt-1">
                Pantau dan kelola stok produk di berbagai lokasi
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50" onClick={() => setIsTransferModalOpen(true)}>
                <FaExchangeAlt className="mr-2 h-4 w-4" /> Transfer Stok
              </Button>
              <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <FaPrint className="mr-2 h-4 w-4" /> Cetak Laporan
              </Button>
            </div>
          </div>
          
          {/* Inventory Navbar */}
          <InventoryNavbar />
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-800 text-sm font-medium">Total Produk</p>
                    <p className="text-3xl font-bold text-indigo-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="bg-indigo-200 p-3 rounded-full">
                    <FaBoxOpen className="h-6 w-6 text-indigo-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-800 text-sm font-medium">Nilai Stok</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {formatRupiah(stats.totalValue)}
                    </p>
                  </div>
                  <div className="bg-purple-200 p-3 rounded-full">
                    <FaWarehouse className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-orange-800 text-sm font-medium">Stok Minimum</p>
                    <p className="text-3xl font-bold text-orange-900 mt-1">{stats.lowStock}</p>
                  </div>
                  <div className="bg-orange-200 p-3 rounded-full">
                    <FaExclamationTriangle className="h-6 w-6 text-orange-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-red-800 text-sm font-medium">Stok Habis</p>
                    <p className="text-3xl font-bold text-red-900 mt-1">{stats.outOfStock}</p>
                  </div>
                  <div className="bg-red-200 p-3 rounded-full">
                    <FaBoxes className="h-6 w-6 text-red-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Filter Section */}
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Cari Produk</p>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nama, SKU, atau barcode"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Kategori</p>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {mockCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Lokasi</p>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Lokasi</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="out-of-stock">Stok Habis</SelectItem>
                      <SelectItem value="low">Stok Minimum</SelectItem>
                      <SelectItem value="good">Stok Tersedia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs for Stock View */}
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-100 p-1 border">
              <TabsTrigger value="current" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <FaBoxes className="mr-2 h-4 w-4" /> Stok Saat Ini
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                <FaHistory className="mr-2 h-4 w-4" /> Riwayat Pergerakan
              </TabsTrigger>
            </TabsList>
            
            {/* Current Stock */}
            <TabsContent value="current" className="mt-6">
              <Card className="border-gray-200">
                <CardHeader className="pb-4 border-b">
                  <CardTitle>Stok Produk</CardTitle>
                  <CardDescription>
                    Menampilkan {filteredStockData.length} dari {allStockData.length} produk
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Produk</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead className="text-center">Stok</TableHead>
                          <TableHead className="text-center">Min. Stok</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Nilai</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStockData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                              Tidak ada data yang sesuai dengan filter
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredStockData.map((item) => {
                            const stockValue = item.currentStock * item.purchasePrice;
                            
                            return (
                              <TableRow key={item.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                                </TableCell>
                                <TableCell>{item.categoryName}</TableCell>
                                <TableCell className="text-center font-medium">{item.currentStock}</TableCell>
                                <TableCell className="text-center">{item.minStock}</TableCell>
                                <TableCell>
                                  <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell className="text-right">{formatRupiah(stockValue)}</TableCell>
                                <TableCell>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                      onClick={() => {
                                        setSelectedProduct(item);
                                        setIsTransferModalOpen(true);
                                      }}
                                    >
                                      <FaExchangeAlt className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                    >
                                      <FaEdit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
                                    >
                                      <FaBarcode className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Movement History */}
            <TabsContent value="history" className="mt-6">
              <Card className="border-gray-200">
                <CardHeader className="pb-4 border-b">
                  <CardTitle>Riwayat Pergerakan Stok</CardTitle>
                  <CardDescription>
                    Mencatat semua pergerakan stok seperti penerimaan, penjualan, dan transfer
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Referensi</TableHead>
                          <TableHead>Produk</TableHead>
                          <TableHead>Jenis</TableHead>
                          <TableHead className="text-center">Jumlah</TableHead>
                          <TableHead>Dari</TableHead>
                          <TableHead>Ke</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockMovementHistory.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell className="font-medium">{item.reference}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>
                              {item.type === "in" && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <FaArrowDown className="mr-1 h-3 w-3" /> Masuk
                                </Badge>
                              )}
                              {item.type === "out" && (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  <FaArrowUp className="mr-1 h-3 w-3" /> Keluar
                                </Badge>
                              )}
                              {item.type === "transfer" && (
                                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                  <FaExchangeAlt className="mr-1 h-3 w-3" /> Transfer
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell>{item.from}</TableCell>
                            <TableCell>{item.to}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Stock Transfer Modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Stok</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {selectedProduct ? selectedProduct.name : 'Pilih Produk'}
              </h3>
              {selectedProduct && (
                <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Dari Lokasi</p>
                <Select value={fromLocation} onValueChange={setFromLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi asal" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Ke Lokasi</p>
                <Select value={toLocation} onValueChange={setToLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Jumlah</p>
              <Input
                type="number"
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
                min={1}
                max={selectedProduct?.currentStock || 1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>Batal</Button>
            <Button onClick={handleTransfer} disabled={!selectedProduct || fromLocation === toLocation}>
              Transfer Stok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StockPage;
