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
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  FaExclamationTriangle,
  FaInfoCircle,
  FaSearch,
  FaMapMarkerAlt,
  FaCubes
} from "react-icons/fa";
import StockMovementHistoryModal from "@/modules/inventory/components/StockMovementHistoryModal";
import StockValueSummaryCard from "@/modules/inventory/components/StockValueSummaryCard";
import { 
  generateStockValueData, 
  generateProductStockValueData,
  getProductGroupValueData,
  getLocationStockValueData 
} from "@/modules/inventory/utils/stockReportUtils";

import {
  exportStockValueSummaryToPDF,
  exportStockValueSummaryToExcel,
  exportProductsToExcel,
  printStockValueSummary
} from "@/modules/inventory/utils/exportUtils";

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

// Generate movement data (tetap mempertahankan fungsi yang ada)
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

// Generate low stock data (tetap mempertahankan fungsi yang ada)
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
  const [valueView, setValueView] = useState<'category' | 'product' | 'group' | 'location'>('category');
  
  // State for Stock Movement History Modal
  const [showMovementHistory, setShowMovementHistory] = useState(false);
  
  // Get data from utilities
  const { totalStockValue, previousTotalValue, categoryValues } = generateStockValueData();
  const productValues = generateProductStockValueData();
  const { totalValue: groupTotalValue, groupValues } = getProductGroupValueData();
  const locationValues = getLocationStockValueData();
  
  // Legacy data for compatibility
  const movementData = generateMovementData();
  const lowStockData = generateLowStockData();
  
  // Handle data export
  const handleExportData = () => {
    if (!categoryValues.length) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    switch (exportFormat) {
      case 'pdf':
        exportStockValueSummaryToPDF(
          categoryValues, 
          locationValues, 
          `laporan-nilai-stok-${new Date().toISOString().split('T')[0]}.pdf`
        );
        break;
      case 'excel':
        exportStockValueSummaryToExcel(
          categoryValues, 
          locationValues, 
          `laporan-nilai-stok-${new Date().toISOString().split('T')[0]}.xlsx`
        );
        break;
      case 'csv':
        exportStockValueSummaryToExcel(
          categoryValues, 
          locationValues, 
          `laporan-nilai-stok-${new Date().toISOString().split('T')[0]}.csv`
        );
        break;
      default:
        alert('Format export tidak didukung');
    }
  };
  
  // Handle print report
  const handlePrintReport = () => {
    if (!categoryValues.length) {
      alert('Tidak ada data untuk dicetak');
      return;
    }
    
    printStockValueSummary(categoryValues, locationValues);
  };
  
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
                <FaChartBar className="mr-3 text-orange-500" /> Laporan Inventori
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
              
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={handleExportData}
              >
                <FaFileExport className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="stock-value" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                <FaChartPie className="h-4 w-4 mr-2" />
                <span>Nilai Stok</span>
              </TabsTrigger>
              <TabsTrigger value="stock-movement" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                <FaChartLine className="h-4 w-4 mr-2" />
                <span>Pergerakan Stok</span>
              </TabsTrigger>
              <TabsTrigger value="low-stock" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                <FaArrowDown className="h-4 w-4 mr-2" />
                <span>Stok Minimum</span>
              </TabsTrigger>
              <TabsTrigger value="product-analysis" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
                <FaBoxOpen className="h-4 w-4 mr-2" />
                <span>Analisis Produk</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Stock Value Tab Content */}
            <TabsContent value="stock-value" className="space-y-6 mt-6">
              {/* Stock Value View Options */}
              <div className="flex flex-wrap gap-2 justify-end">
                <Button 
                  variant={valueView === 'category' ? 'default' : 'outline'}
                  className={valueView === 'category' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}
                  onClick={() => setValueView('category')}
                  size="sm"
                >
                  <FaBoxOpen className="mr-2 h-3 w-3" /> Kategori
                </Button>
                <Button 
                  variant={valueView === 'product' ? 'default' : 'outline'}
                  className={valueView === 'product' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}
                  onClick={() => setValueView('product')}
                  size="sm"
                >
                  <FaCubes className="mr-2 h-3 w-3" /> Produk
                </Button>
                <Button 
                  variant={valueView === 'group' ? 'default' : 'outline'}
                  className={valueView === 'group' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}
                  onClick={() => setValueView('group')}
                  size="sm"
                >
                  <FaChartPie className="mr-2 h-3 w-3" /> Kelompok
                </Button>
                <Button 
                  variant={valueView === 'location' ? 'default' : 'outline'}
                  className={valueView === 'location' ? 'bg-orange-600 hover:bg-orange-700' : 'border-orange-200 text-orange-700 hover:bg-orange-50'}
                  onClick={() => setValueView('location')}
                  size="sm"
                >
                  <FaMapMarkerAlt className="mr-2 h-3 w-3" /> Lokasi
                </Button>
              </div>
              
              {/* Category View */}
              {valueView === 'category' && (
                <div className="grid grid-cols-1 gap-6">
                  <StockValueSummaryCard
                    totalValue={totalStockValue}
                    previousTotalValue={previousTotalValue}
                    categoryValues={categoryValues}
                    onPrint={handlePrintReport}
                    onExport={handleExportData}
                  />
                  
                  <Card className="border-orange-200 mt-6">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Produk dengan Nilai Stok Tertinggi</CardTitle>
                          <CardDescription>
                            Produk-produk yang memberi kontribusi terbesar terhadap total nilai stok
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-orange-50">
                              <TableHead>Produk</TableHead>
                              <TableHead>Kategori</TableHead>
                              <TableHead className="text-center">Stok</TableHead>
                              <TableHead className="text-right">Harga Beli</TableHead>
                              <TableHead className="text-right">Nilai Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productValues.slice(0, 10).map((product) => (
                              <TableRow key={product.id} className="hover:bg-orange-50">
                                <TableCell>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.sku}</div>
                                </TableCell>
                                <TableCell>{product.categoryName}</TableCell>
                                <TableCell className="text-center">{product.currentStock}</TableCell>
                                <TableCell className="text-right">{formatRupiah(product.price)}</TableCell>
                                <TableCell className="text-right font-medium">{formatRupiah(product.value)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter className="bg-orange-50">
                            <TableRow>
                              <TableCell colSpan={4} className="text-right font-bold">
                                Total Nilai ({productValues.length} produk)
                              </TableCell>
                              <TableCell className="text-right font-bold">
                                {formatRupiah(totalStockValue)}
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Product View */}
              {valueView === 'product' && (
                <div className="space-y-6">
                  <Card className="border-orange-200 shadow-md">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Nilai Stok per Produk</CardTitle>
                          <CardDescription>
                            Detail nilai stok untuk setiap produk dalam inventori
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Input placeholder="Cari produk..." className="pl-9 w-[250px]" />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                          </div>
                          <Button 
                            variant="outline" 
                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                            onClick={() => exportProductsToExcel(
                              productValues.map(p => ({
                                id: p.id,
                                code: p.sku,
                                name: p.name,
                                category: p.categoryName,
                                stockQty: p.currentStock,
                                buyPrice: p.price,
                                stockValue: p.value,
                                unit: p.unit || 'Pcs'
                              })), 
                              `produk-nilai-stok-${new Date().toISOString().split('T')[0]}.xlsx`
                            )}
                          >
                            <FaFileExcel className="mr-2 h-4 w-4" /> Ekspor Excel
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                            onClick={() => window.print()}
                          >
                            <FaPrint className="mr-2 h-4 w-4" /> Cetak
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="border-t">
                        <div className="p-4 bg-orange-50 flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge className="bg-orange-100 text-orange-800 mr-2">Total: {productValues.length} produk</Badge>
                            <span className="text-sm text-gray-600">
                              Nilai Total: <span className="font-bold">{formatRupiah(totalStockValue)}</span>
                            </span>
                          </div>
                          <Select defaultValue="value-desc">
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Urutkan berdasarkan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="value-desc">Nilai (Tertinggi)</SelectItem>
                              <SelectItem value="value-asc">Nilai (Terendah)</SelectItem>
                              <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
                              <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
                              <SelectItem value="stock-desc">Stok (Tertinggi)</SelectItem>
                              <SelectItem value="stock-asc">Stok (Terendah)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="max-h-[600px] overflow-y-auto">
                        <Table>
                          <TableHeader className="sticky top-0 z-10">
                            <TableRow className="bg-white">
                              <TableHead>Produk</TableHead>
                              <TableHead>Kategori</TableHead>
                              <TableHead className="text-center">Stok</TableHead>
                              <TableHead className="text-right">Harga Beli</TableHead>
                              <TableHead className="text-right">Nilai Total</TableHead>
                              <TableHead className="text-center">Kadaluarsa</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {productValues.slice(0, 30).map((product) => (
                              <TableRow key={product.id} className="hover:bg-orange-50">
                                <TableCell>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.sku}</div>
                                </TableCell>
                                <TableCell>{product.categoryName}</TableCell>
                                <TableCell className="text-center">{product.currentStock}</TableCell>
                                <TableCell className="text-right">{formatRupiah(product.price)}</TableCell>
                                <TableCell className="text-right font-medium">{formatRupiah(product.value)}</TableCell>
                                <TableCell className="text-center">
                                  {product.expiryDate ? formatDate(product.expiryDate) : '-'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="p-4 text-center border-t">
                        <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                          Lihat Semua Produk
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Group View */}
              {valueView === 'group' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-orange-200 md:col-span-2 shadow-md">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardTitle>Nilai Stok Berdasarkan Kelompok Produk</CardTitle>
                      <CardDescription>
                        Distribusi nilai inventori berdasarkan kategori farmasi
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">Total Nilai Stok</p>
                            <p className="text-3xl font-bold text-gray-900">
                              {formatRupiah(groupTotalValue)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {groupValues.map((group) => (
                            <div key={group.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2" 
                                    style={{ backgroundColor: group.color }}
                                  ></div>
                                  <p className="text-sm font-medium">{group.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium">{formatRupiah(group.value)}</p>
                                  {group.trend !== 'stable' && (
                                    <Badge className={group.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                      {group.trend === 'up' ? <FaArrowUp className="mr-1 h-3 w-3" /> : <FaArrowDown className="mr-1 h-3 w-3" />}
                                      {group.trendPercentage.toFixed(1)}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ 
                                    width: `${group.percentage}%`,
                                    backgroundColor: group.color 
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>{group.itemCount} produk</span>
                                <span>{group.percentage.toFixed(1)}% dari total</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-orange-200 shadow-md">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardTitle>Detail Kelompok</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {groupValues.map((group) => (
                          <div key={group.id} className={`p-4 rounded-lg bg-opacity-10 border`} style={{ backgroundColor: `${group.color}20`, borderColor: `${group.color}40` }}>
                            <div className="flex items-start">
                              <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${group.color}30` }}>
                                <div className="h-6 w-6" style={{ color: group.color }}>
                                  <FaBoxOpen />
                                </div>
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: group.color }}>{group.name}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{formatRupiah(group.value)}</p>
                                <p className="text-sm text-gray-500 mt-1">{group.itemCount} produk</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Location View */}
              {valueView === 'location' && (
                <div className="grid grid-cols-1 gap-6">
                  <Card className="border-orange-200 shadow-md">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardTitle>Nilai Stok Berdasarkan Lokasi</CardTitle>
                      <CardDescription>
                        Distribusi nilai inventori berdasarkan lokasi penyimpanan
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {locationValues.map((location) => (
                          <div key={location.id} className="border border-orange-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center gap-3">
                              <div className="bg-white p-2 rounded-full border border-orange-200">
                                <FaMapMarkerAlt className="h-5 w-5 text-orange-500" />
                              </div>
                              <h3 className="font-medium text-gray-800">{location.name}</h3>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-500">Nilai Stok:</span>
                                <span className="font-bold text-gray-900">{formatRupiah(location.value)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Jumlah Produk:</span>
                                <span className="font-medium text-gray-700">{location.itemCount}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Stock Movement Tab Content */}
            <TabsContent value="stock-movement" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-orange-200 md:col-span-3">
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
                      <Button 
                        variant="link" 
                        className="text-indigo-600"
                        onClick={() => setShowMovementHistory(true)}
                      >
                        Lihat Riwayat Lengkap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Low Stock Tab Content */}
            <TabsContent value="low-stock" className="space-y-6 mt-6">
              <Card className="border-orange-200">
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
              <Card className="border-orange-200">
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
      
      {/* Stock Movement History Modal */}
      <StockMovementHistoryModal
        open={showMovementHistory}
        onClose={() => setShowMovementHistory(false)}
        movements={movementData}
      />
    </InventoryLayout>
  );
};

export default ReportsPage;
