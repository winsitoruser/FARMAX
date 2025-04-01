import React, { useState } from "react";
import { NextPage } from "next";
import InventoryLayout from "@/components/layouts/inventory-layout";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { mockCategories, mockProducts, mockStocks } from "@/modules/inventory/types";
import { formatRupiah } from "@/lib/utils";
import { 
  FaChartBar, 
  FaFileExport, 
  FaFilePdf,
  FaFileExcel,
  FaPrint,
  FaChartPie,
  FaChartLine,
  FaBoxOpen,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaWarehouse,
  FaExclamationTriangle
} from "react-icons/fa";

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Mock stock data for value report
const generateStockValueData = () => {
  const totalStockValue = mockProducts.reduce((total, product) => {
    const stock = mockStocks.find(s => s.productId === product.id);
    return total + (stock?.currentStock || 0) * product.purchasePrice;
  }, 0);
  
  // Group by category
  const categoryValues = mockCategories.map(category => {
    const productsInCategory = mockProducts.filter(p => p.categoryId === category.id);
    const value = productsInCategory.reduce((total, product) => {
      const stock = mockStocks.find(s => s.productId === product.id);
      return total + (stock?.currentStock || 0) * product.purchasePrice;
    }, 0);
    
    const percentage = (value / totalStockValue) * 100;
    
    return {
      id: category.id,
      name: category.name,
      value,
      percentage
    };
  });
  
  return {
    totalStockValue,
    categoryValues
  };
};

// Mock movement data
const generateMovementData = () => {
  const today = new Date();
  
  return [
    {
      id: "1",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      type: "in",
      reference: "GR/2024/03/0001",
      productName: "Paracetamol 500mg",
      quantity: 100,
      fromTo: "PT Pharma Utama",
      notes: "Penerimaan barang reguler"
    },
    {
      id: "2",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      type: "out",
      reference: "SO/2024/03/0045",
      productName: "Paracetamol 500mg",
      quantity: 2,
      fromTo: "Penjualan Kasir",
      notes: ""
    },
    {
      id: "3",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      type: "adjustment",
      reference: "ADJ/2024/03/0002",
      productName: "Amoxicillin 500mg",
      quantity: -5,
      fromTo: "Adjustment",
      notes: "Produk rusak"
    },
    {
      id: "4",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      type: "in",
      reference: "GR/2024/03/0002",
      productName: "Vitamin C 1000mg",
      quantity: 50,
      fromTo: "CV Medika Jaya",
      notes: ""
    },
    {
      id: "5",
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      type: "out",
      reference: "SO/2024/03/0040",
      productName: "Vitamin C 1000mg",
      quantity: 3,
      fromTo: "Penjualan Kasir",
      notes: ""
    }
  ];
};

// Mock low stock data
const generateLowStockData = () => {
  return mockProducts.map(product => {
    const stock = mockStocks.find(s => s.productId === product.id);
    const currentStock = stock?.currentStock || 0;
    const isLow = currentStock <= product.minStock;
    
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      currentStock,
      minStock: product.minStock,
      isLow,
      deficitPercentage: isLow ? ((product.minStock - currentStock) / product.minStock) * 100 : 0
    };
  }).filter(item => item.isLow);
};

const ReportsPage: NextPage = () => {
  const [tab, setTab] = useState("stock-value");
  const [period, setPeriod] = useState("all-time");
  const [exportFormat, setExportFormat] = useState("pdf");
  
  const stockValueData = generateStockValueData();
  const movementData = generateMovementData();
  const lowStockData = generateLowStockData();
  
  return (
    <InventoryLayout>
      <div className="flex flex-col min-h-screen">
        <Breadcrumbs
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Inventori", href: "/inventory" },
            { title: "Laporan", href: "/inventory/reports" },
          ]}
          className="p-6 pb-0"
        />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaChartBar className="mr-3 text-indigo-500" /> Laporan Inventori
              </h1>
              <p className="text-gray-600 mt-1">
                Analisis dan laporan mengenai stok, nilai, dan pergerakan inventori
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Format Export" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <FaFileExport className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          {/* Filter Card */}
          <Card className="border-indigo-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Periode</p>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="yesterday">Kemarin</SelectItem>
                      <SelectItem value="this-week">Minggu Ini</SelectItem>
                      <SelectItem value="this-month">Bulan Ini</SelectItem>
                      <SelectItem value="last-month">Bulan Lalu</SelectItem>
                      <SelectItem value="this-year">Tahun Ini</SelectItem>
                      <SelectItem value="all-time">Semua Waktu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Kategori</p>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      {mockCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Lokasi</p>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Lokasi</SelectItem>
                      <SelectItem value="display">Rak Display</SelectItem>
                      <SelectItem value="warehouse">Gudang Utama</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <FaChartBar className="mr-2 h-4 w-4" /> Terapkan Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Report Tabs */}
          <Tabs defaultValue="stock-value" value={tab} onValueChange={setTab} className="space-y-6">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 h-auto p-0 bg-transparent gap-2">
              <TabsTrigger
                value="stock-value"
                className={`data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 data-[state=active]:border-indigo-200 border rounded-lg py-3 px-4 flex items-center justify-center gap-2 ${
                  tab === "stock-value" ? "" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <FaChartPie className="h-4 w-4" />
                <span>Nilai Stok</span>
              </TabsTrigger>
              <TabsTrigger
                value="stock-movement"
                className={`data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 data-[state=active]:border-indigo-200 border rounded-lg py-3 px-4 flex items-center justify-center gap-2 ${
                  tab === "stock-movement" ? "" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <FaChartLine className="h-4 w-4" />
                <span>Pergerakan Stok</span>
              </TabsTrigger>
              <TabsTrigger
                value="low-stock"
                className={`data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 data-[state=active]:border-indigo-200 border rounded-lg py-3 px-4 flex items-center justify-center gap-2 ${
                  tab === "low-stock" ? "" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <FaExclamationTriangle className="h-4 w-4" />
                <span>Stok Minimum</span>
              </TabsTrigger>
              <TabsTrigger
                value="product-analysis"
                className={`data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-900 data-[state=active]:border-indigo-200 border rounded-lg py-3 px-4 flex items-center justify-center gap-2 ${
                  tab === "product-analysis" ? "" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <FaBoxOpen className="h-4 w-4" />
                <span>Analisis Produk</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Stock Value Tab Content */}
            <TabsContent value="stock-value" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-indigo-200 md:col-span-2">
                  <CardHeader className="border-b">
                    <CardTitle>Ringkasan Nilai Stok</CardTitle>
                    <CardDescription>
                      Total nilai persediaan berdasarkan kategori
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Nilai Stok</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {formatRupiah(stockValueData.totalStockValue)}
                          </p>
                        </div>
                        <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                          <FaPrint className="mr-2 h-4 w-4" /> Cetak
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {stockValueData.categoryValues.map((category, index) => (
                          <div key={category.id} className="space-y-2">
                            <div className="flex justify-between">
                              <p className="text-sm font-medium">{category.name}</p>
                              <p className="text-sm font-medium">{formatRupiah(category.value)}</p>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                                style={{ width: `${category.percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 text-right">{category.percentage.toFixed(1)}% dari total</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-indigo-200">
                  <CardHeader className="border-b">
                    <CardTitle>Detail Inventori</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="bg-blue-200 p-3 rounded-full mr-4">
                            <FaBoxOpen className="h-6 w-6 text-blue-700" />
                          </div>
                          <div>
                            <p className="text-blue-800 text-sm font-medium">Total Produk</p>
                            <p className="text-2xl font-bold text-blue-900 mt-1">{mockProducts.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="bg-green-200 p-3 rounded-full mr-4">
                            <FaWarehouse className="h-6 w-6 text-green-700" />
                          </div>
                          <div>
                            <p className="text-green-800 text-sm font-medium">Total Stok</p>
                            <p className="text-2xl font-bold text-green-900 mt-1">
                              {mockStocks.reduce((total, stock) => total + stock.currentStock, 0)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="bg-red-200 p-3 rounded-full mr-4">
                            <FaExclamationTriangle className="h-6 w-6 text-red-700" />
                          </div>
                          <div>
                            <p className="text-red-800 text-sm font-medium">Stok Minimum</p>
                            <p className="text-2xl font-bold text-red-900 mt-1">
                              {lowStockData.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-indigo-200">
                <CardHeader className="border-b">
                  <CardTitle>Nilai Stok per Produk</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Produk</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead className="text-center">Stok</TableHead>
                          <TableHead className="text-right">Harga Beli</TableHead>
                          <TableHead className="text-right">Nilai Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProducts.slice(0, 5).map((product) => {
                          const stock = mockStocks.find(s => s.productId === product.id);
                          const category = mockCategories.find(c => c.id === product.categoryId);
                          const value = (stock?.currentStock || 0) * product.purchasePrice;
                          
                          return (
                            <TableRow key={product.id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.sku}</div>
                              </TableCell>
                              <TableCell>{category?.name || "-"}</TableCell>
                              <TableCell className="text-center">{stock?.currentStock || 0}</TableCell>
                              <TableCell className="text-right">{formatRupiah(product.purchasePrice)}</TableCell>
                              <TableCell className="text-right font-medium">{formatRupiah(value)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-indigo-600">
                      Lihat Semua Produk
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Stock Movement Tab Content */}
            <TabsContent value="stock-movement" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-indigo-200 md:col-span-3">
                  <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Pergerakan Stok</CardTitle>
                        <CardDescription>
                          Riwayat pergerakan stok masuk dan keluar
                        </CardDescription>
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Jenis Pergerakan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Pergerakan</SelectItem>
                          <SelectItem value="in">Stok Masuk</SelectItem>
                          <SelectItem value="out">Stok Keluar</SelectItem>
                          <SelectItem value="adjustment">Penyesuaian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Referensi</TableHead>
                            <TableHead>Produk</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead className="text-center">Jumlah</TableHead>
                            <TableHead>Sumber/Tujuan</TableHead>
                            <TableHead>Catatan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {movementData.map((movement) => (
                            <TableRow key={movement.id} className="hover:bg-gray-50">
                              <TableCell>{formatDate(movement.date)}</TableCell>
                              <TableCell className="font-medium">{movement.reference}</TableCell>
                              <TableCell>{movement.productName}</TableCell>
                              <TableCell>
                                {movement.type === "in" && (
                                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                    <FaArrowUp className="mr-1 h-3 w-3" /> Masuk
                                  </Badge>
                                )}
                                {movement.type === "out" && (
                                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                    <FaArrowDown className="mr-1 h-3 w-3" /> Keluar
                                  </Badge>
                                )}
                                {movement.type === "adjustment" && (
                                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                    Penyesuaian
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">{movement.quantity}</TableCell>
                              <TableCell>{movement.fromTo}</TableCell>
                              <TableCell>{movement.notes || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Button variant="link" className="text-indigo-600">
                        Lihat Riwayat Lengkap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Low Stock Tab Content */}
            <TabsContent value="low-stock" className="space-y-6 mt-6">
              <Card className="border-indigo-200">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Produk dengan Stok Minimum</CardTitle>
                      <CardDescription>
                        Daftar produk yang memerlukan pengisian ulang
                      </CardDescription>
                    </div>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <FaFileExcel className="mr-2 h-4 w-4" /> Cetak Pesanan Pembelian
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Produk</TableHead>
                          <TableHead className="text-center">Stok Saat Ini</TableHead>
                          <TableHead className="text-center">Stok Minimum</TableHead>
                          <TableHead className="text-center">Defisit</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lowStockData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                              Tidak ada produk yang berada di bawah stok minimum
                            </TableCell>
                          </TableRow>
                        ) : (
                          lowStockData.map((item) => {
                            const deficit = item.minStock - item.currentStock;
                            
                            return (
                              <TableRow key={item.id} className="hover:bg-gray-50">
                                <TableCell>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-sm text-gray-500">{item.sku}</div>
                                </TableCell>
                                <TableCell className="text-center">{item.currentStock}</TableCell>
                                <TableCell className="text-center">{item.minStock}</TableCell>
                                <TableCell className="text-center font-medium text-red-600">{deficit}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div className="w-full h-2 bg-gray-100 rounded-full mr-2">
                                      <div 
                                        className="h-full bg-red-500 rounded-full" 
                                        style={{ width: `${Math.min(100, item.deficitPercentage)}%` }} 
                                      />
                                    </div>
                                    <span className="text-sm text-red-600 whitespace-nowrap">
                                      {Math.round(item.deficitPercentage)}%
                                    </span>
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
            
            {/* Product Analysis Tab Content */}
            <TabsContent value="product-analysis" className="space-y-6 mt-6">
              <Card className="border-indigo-200">
                <CardHeader className="border-b">
                  <CardTitle>Analisis Produk</CardTitle>
                  <CardDescription>
                    Analisis performa dan penjualan produk
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <FaChartPie className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">Analisis Produk Segera Hadir</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                      Fitur analisis produk sedang dalam pengembangan dan akan segera tersedia untuk membantu Anda memahami performa produk lebih baik.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </InventoryLayout>
  );
};

export default ReportsPage;
