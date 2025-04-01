import React, { useState, useEffect } from 'react'
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card'
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FaSearch, FaChartLine, FaExchangeAlt, FaBoxes, FaTruck, 
  FaCalendarAlt, FaArrowUp, FaArrowDown, FaMinus
} from 'react-icons/fa'

// Mock data for suppliers
const mockSuppliers = [
  { id: "sup001", name: "PT Kimia Farma", address: "Jakarta", contact: "021-5555-1234", terms: "Net 30" },
  { id: "sup002", name: "PT Phapros", address: "Semarang", contact: "024-7777-5678", terms: "Net 14" },
  { id: "sup003", name: "PT Kalbe Farma", address: "Jakarta", contact: "021-4444-9012", terms: "COD" },
  { id: "sup004", name: "PT Dexa Medica", address: "Palembang", contact: "0711-333-3456", terms: "Net 45" },
  { id: "sup005", name: "PT Sanbe Farma", address: "Bandung", contact: "022-6666-7890", terms: "Net 30" },
];

// Mock data for price analysis
const mockPriceAnalysis = {
  "sup001": {
    name: "PT Kimia Farma",
    productAnalysis: [
      { 
        productId: "prod001", 
        productName: "Paracetamol 500mg",
        currentPrice: 1180,
        previousPrice: 1200,
        priceChange: -1.67,
        averagePrice: 1193,
        lowestPrice: 1180,
        highestPrice: 1200,
        lastUpdated: "2025-03-05",
        priceHistory: [
          { date: "2025-01-10", price: 1200 },
          { date: "2025-02-15", price: 1200 },
          { date: "2025-03-05", price: 1180 }
        ]
      },
      { 
        productId: "prod003", 
        productName: "Omeprazole 20mg",
        currentPrice: 3250,
        previousPrice: 3200,
        priceChange: 1.56,
        averagePrice: 3225,
        lowestPrice: 3200,
        highestPrice: 3250,
        lastUpdated: "2025-03-20",
        priceHistory: [
          { date: "2025-01-20", price: 3200 },
          { date: "2025-03-20", price: 3250 }
        ]
      }
    ],
    performanceMetrics: {
      onTimeDelivery: 92,
      orderFulfillment: 98,
      qualityRating: 4.7,
      returnRate: 1.2,
      avgResponseTime: 1.5 // days
    },
    orderHistory: [
      { date: "2025-03-15", orderNumber: "PO-20250315-101", amount: 18750000, status: "completed" },
      { date: "2025-02-20", orderNumber: "PO-20250220-105", amount: 16800000, status: "returned" },
      { date: "2025-01-10", orderNumber: "PO-20250110-108", amount: 12500000, status: "completed" }
    ]
  },
  "sup002": {
    name: "PT Phapros",
    productAnalysis: [
      { 
        productId: "prod001", 
        productName: "Paracetamol 500mg",
        currentPrice: 1250,
        previousPrice: 1250,
        priceChange: 0,
        averagePrice: 1250,
        lowestPrice: 1250,
        highestPrice: 1250,
        lastUpdated: "2025-02-15",
        priceHistory: [
          { date: "2025-02-15", price: 1250 }
        ]
      },
      { 
        productId: "prod002", 
        productName: "Amoxicillin 500mg",
        currentPrice: 2450,
        previousPrice: 2450,
        priceChange: 0,
        averagePrice: 2450,
        lowestPrice: 2450,
        highestPrice: 2450,
        lastUpdated: "2025-02-10",
        priceHistory: [
          { date: "2025-02-10", price: 2450 }
        ]
      }
    ],
    performanceMetrics: {
      onTimeDelivery: 89,
      orderFulfillment: 95,
      qualityRating: 4.5,
      returnRate: 1.8,
      avgResponseTime: 2.0 // days
    },
    orderHistory: [
      { date: "2025-03-10", orderNumber: "PO-20250310-102", amount: 15620000, status: "completed" },
      { date: "2025-01-25", orderNumber: "PO-20250125-109", amount: 9750000, status: "completed" }
    ]
  },
  "sup003": {
    name: "PT Kalbe Farma",
    productAnalysis: [
      { 
        productId: "prod002", 
        productName: "Amoxicillin 500mg",
        currentPrice: 2550,
        previousPrice: 2500,
        priceChange: 2.0,
        averagePrice: 2525,
        lowestPrice: 2500,
        highestPrice: 2550,
        lastUpdated: "2025-03-15",
        priceHistory: [
          { date: "2025-01-05", price: 2500 },
          { date: "2025-03-15", price: 2550 }
        ]
      }
    ],
    performanceMetrics: {
      onTimeDelivery: 95,
      orderFulfillment: 97,
      qualityRating: 4.8,
      returnRate: 0.9,
      avgResponseTime: 1.0 // days
    },
    orderHistory: [
      { date: "2025-03-05", orderNumber: "PO-20250305-103", amount: 23750000, status: "completed" },
      { date: "2025-01-15", orderNumber: "PO-20250115-110", amount: 14350000, status: "completed" }
    ]
  },
  // Additional suppliers would be here
};

// Mock data for product comparison across suppliers
const mockProductComparison = [
  {
    productId: "prod001",
    productName: "Paracetamol 500mg",
    suppliers: [
      { supplierId: "sup001", name: "PT Kimia Farma", price: 1180, lastUpdated: "2025-03-05" },
      { supplierId: "sup002", name: "PT Phapros", price: 1250, lastUpdated: "2025-02-15" },
      { supplierId: "sup004", name: "PT Dexa Medica", price: 1220, lastUpdated: "2025-02-22" }
    ]
  },
  {
    productId: "prod002",
    productName: "Amoxicillin 500mg",
    suppliers: [
      { supplierId: "sup002", name: "PT Phapros", price: 2450, lastUpdated: "2025-02-10" },
      { supplierId: "sup003", name: "PT Kalbe Farma", price: 2550, lastUpdated: "2025-03-15" },
      { supplierId: "sup005", name: "PT Sanbe Farma", price: 2400, lastUpdated: "2025-03-01" }
    ]
  },
  {
    productId: "prod003",
    productName: "Omeprazole 20mg",
    suppliers: [
      { supplierId: "sup001", name: "PT Kimia Farma", price: 3250, lastUpdated: "2025-03-20" },
      { supplierId: "sup004", name: "PT Dexa Medica", price: 3150, lastUpdated: "2025-02-25" },
      { supplierId: "sup005", name: "PT Sanbe Farma", price: 3300, lastUpdated: "2025-02-18" }
    ]
  }
];

export function SupplierAnalysis() {
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("supplierAnalysis");
  const [productComparisonSearch, setProductComparisonSearch] = useState<string>("");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  // Filter suppliers based on search query
  const filteredSuppliers = mockSuppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter products for comparison based on search query
  const filteredProductComparison = mockProductComparison.filter(product => 
    product.productName.toLowerCase().includes(productComparisonSearch.toLowerCase())
  );

  // Get trend icon
  const getTrendIcon = (priceChange: number) => {
    if (priceChange > 0) {
      return <FaArrowUp className="text-red-500" />;
    } else if (priceChange < 0) {
      return <FaArrowDown className="text-green-500" />;
    } else {
      return <FaMinus className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        {/* Decorative header element */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-400"></div>
        
        {/* Decorative blurred circles */}
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-orange-500/20 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-500/20 blur-xl"></div>
        
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FaChartLine className="mr-2 h-6 w-6 text-orange-500" />
            Analisis Supplier
          </CardTitle>
          <CardDescription>
            Bandingkan harga dan performa supplier untuk pemesanan yang optimal
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="supplierAnalysis" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="supplierAnalysis" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
              >
                Analisis Supplier
              </TabsTrigger>
              <TabsTrigger 
                value="productComparison" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
              >
                Perbandingan Produk
              </TabsTrigger>
            </TabsList>
            
            {/* Supplier Analysis Tab */}
            <TabsContent value="supplierAnalysis" className="mt-6">
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Input 
                      placeholder="Cari supplier" 
                      className="pl-10" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                  <div className="md:w-[250px]">
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSuppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {selectedSupplier ? (
                  <div className="space-y-6">
                    {/* Supplier Performance Summary */}
                    <Card className="border border-orange-100">
                      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 pb-4">
                        <CardTitle className="text-xl">
                          {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].name}
                        </CardTitle>
                        <CardDescription>
                          Ringkasan performa supplier
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Pengiriman Tepat Waktu</p>
                            <p className="text-2xl font-semibold text-green-600">
                              {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].performanceMetrics.onTimeDelivery}%
                            </p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Pemenuhan Pesanan</p>
                            <p className="text-2xl font-semibold text-blue-600">
                              {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].performanceMetrics.orderFulfillment}%
                            </p>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Rating Kualitas</p>
                            <p className="text-2xl font-semibold text-amber-600">
                              {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].performanceMetrics.qualityRating}/5
                            </p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Tingkat Retur</p>
                            <p className="text-2xl font-semibold text-red-600">
                              {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].performanceMetrics.returnRate}%
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-500">Waktu Respons</p>
                            <p className="text-2xl font-semibold text-purple-600">
                              {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].performanceMetrics.avgResponseTime} hari
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Product Price Analysis */}
                    <Card className="border border-orange-100">
                      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 pb-4">
                        <CardTitle className="text-lg">
                          Analisis Harga Produk
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Produk</TableHead>
                              <TableHead className="text-right">Harga Saat Ini</TableHead>
                              <TableHead className="text-right">Harga Sebelumnya</TableHead>
                              <TableHead className="text-center">Perubahan</TableHead>
                              <TableHead className="text-right">Rata-rata</TableHead>
                              <TableHead className="text-right">Terendah</TableHead>
                              <TableHead className="text-right">Tertinggi</TableHead>
                              <TableHead>Update Terakhir</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].productAnalysis.map((product) => (
                              <TableRow key={product.productId}>
                                <TableCell className="font-medium">{product.productName}</TableCell>
                                <TableCell className="text-right">{formatCurrency(product.currentPrice)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(product.previousPrice)}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center">
                                    {getTrendIcon(product.priceChange)}
                                    <span className={`ml-1 ${
                                      product.priceChange > 0 ? 'text-red-600' : 
                                      product.priceChange < 0 ? 'text-green-600' : 'text-gray-600'
                                    }`}>
                                      {Math.abs(product.priceChange)}%
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(product.averagePrice)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(product.lowestPrice)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(product.highestPrice)}</TableCell>
                                <TableCell>{product.lastUpdated}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    
                    {/* Order History */}
                    <Card className="border border-orange-100">
                      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 pb-4">
                        <CardTitle className="text-lg">
                          Riwayat Pesanan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>No. Pesanan</TableHead>
                              <TableHead className="text-right">Nilai</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockPriceAnalysis[selectedSupplier as keyof typeof mockPriceAnalysis].orderHistory.map((order, index) => (
                              <TableRow key={index}>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell className="text-right">{formatCurrency(order.amount)}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className={
                                    order.status === "completed" 
                                      ? "border-green-200 text-green-700 bg-green-50"
                                      : "border-red-200 text-red-700 bg-red-50"
                                  }>
                                    {order.status === "completed" ? "Selesai" : "Dikembalikan"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <FaBoxes className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Pilih Supplier</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Pilih supplier dari dropdown di atas untuk melihat analisis detail
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Product Comparison Tab */}
            <TabsContent value="productComparison" className="mt-6">
              <div className="space-y-6">
                {/* Search */}
                <div className="flex">
                  <div className="relative flex-1">
                    <Input 
                      placeholder="Cari produk" 
                      className="pl-10" 
                      value={productComparisonSearch}
                      onChange={(e) => setProductComparisonSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                
                {/* Product Comparison Table */}
                <Card className="border border-orange-100">
                  <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 pb-4">
                    <CardTitle className="text-xl">
                      Perbandingan Harga Produk Antar Supplier
                    </CardTitle>
                    <CardDescription>
                      Bandingkan harga produk dari berbagai supplier untuk mendapatkan penawaran terbaik
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {filteredProductComparison.length > 0 ? (
                      <div className="space-y-8">
                        {filteredProductComparison.map((product) => (
                          <div key={product.productId} className="space-y-4">
                            <h3 className="text-lg font-medium">{product.productName}</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Supplier</TableHead>
                                  <TableHead className="text-right">Harga</TableHead>
                                  <TableHead>Update Terakhir</TableHead>
                                  <TableHead className="text-center">Perbandingan</TableHead>
                                  <TableHead></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {product.suppliers.sort((a, b) => a.price - b.price).map((supplier, index) => {
                                  const isLowest = index === 0;
                                  const priceDiff = isLowest ? 0 : ((supplier.price - product.suppliers[0].price) / product.suppliers[0].price) * 100;
                                  
                                  return (
                                    <TableRow key={supplier.supplierId}>
                                      <TableCell className="font-medium">{supplier.name}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(supplier.price)}</TableCell>
                                      <TableCell>{supplier.lastUpdated}</TableCell>
                                      <TableCell className="text-center">
                                        {isLowest ? (
                                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                                            Harga Terendah
                                          </Badge>
                                        ) : (
                                          <span className="text-red-600">+{priceDiff.toFixed(1)}%</span>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Button 
                                          variant="outline" 
                                          className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                        >
                                          <FaExchangeAlt className="mr-2 h-3 w-3" />
                                          Buat Pesanan
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Tidak ada produk yang ditemukan</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
