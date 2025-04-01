import React, { useState } from 'react'
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card'
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { 
  FaSearch, FaEye, FaFileInvoice, FaFileDownload,
  FaCheckDouble, FaTimesCircle, FaPrint, FaBoxOpen, FaHistory
} from 'react-icons/fa'
import { toast } from '@/components/ui/use-toast'
import { format, addDays, subDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DateRangePicker } from '@/components/ui/date-range-picker'

// Mock data for completed purchase orders
const mockCompletedOrders = [
  {
    id: "po101",
    poNumber: "PO-20250315-101",
    date: "2025-03-15",
    deliveryDate: "2025-03-25",
    supplier: {
      id: "sup001",
      name: "PT Kimia Farma"
    },
    totalItems: 6,
    totalValue: 18750000,
    status: "completed",
    paymentStatus: "paid",
    paymentDate: "2025-04-01",
    invoiceNumber: "INV-KF-25032501",
    items: [
      { id: "item101", product: "Paracetamol 500mg", quantity: 2000, unitPrice: 1200, subtotal: 2400000 },
      { id: "item102", product: "Amoxicillin 500mg", quantity: 1500, unitPrice: 2500, subtotal: 3750000 },
      { id: "item103", product: "Omeprazole 20mg", quantity: 1000, unitPrice: 3200, subtotal: 3200000 },
      { id: "item104", product: "Cetirizine 10mg", quantity: 1200, unitPrice: 1800, subtotal: 2160000 },
      { id: "item105", product: "Vitamin C 500mg", quantity: 3000, unitPrice: 950, subtotal: 2850000 },
      { id: "item106", product: "Ranitidine 150mg", quantity: 1200, unitPrice: 3250, subtotal: 3900000 }
    ]
  },
  {
    id: "po102",
    poNumber: "PO-20250310-102",
    date: "2025-03-10",
    deliveryDate: "2025-03-20",
    supplier: {
      id: "sup002",
      name: "PT Phapros"
    },
    totalItems: 4,
    totalValue: 15620000,
    status: "completed",
    paymentStatus: "paid",
    paymentDate: "2025-03-25",
    invoiceNumber: "INV-PHP-25032001",
    items: [
      { id: "item107", product: "Captopril 25mg", quantity: 1800, unitPrice: 1800, subtotal: 3240000 },
      { id: "item108", product: "Metformin 500mg", quantity: 1600, unitPrice: 2250, subtotal: 3600000 },
      { id: "item109", product: "Simvastatin 20mg", quantity: 1400, unitPrice: 3350, subtotal: 4690000 },
      { id: "item110", product: "Diclofenac Sodium 50mg", quantity: 1200, unitPrice: 3400, subtotal: 4080000 },
    ]
  },
  {
    id: "po103",
    poNumber: "PO-20250305-103",
    date: "2025-03-05",
    deliveryDate: "2025-03-15",
    supplier: {
      id: "sup003",
      name: "PT Kalbe Farma"
    },
    totalItems: 5,
    totalValue: 23750000,
    status: "completed",
    paymentStatus: "paid",
    paymentDate: "2025-03-20",
    invoiceNumber: "INV-KLB-25031501",
    items: [
      { id: "item111", product: "Lansoprazole 30mg", quantity: 1200, unitPrice: 4200, subtotal: 5040000 },
      { id: "item112", product: "Amlodipine 10mg", quantity: 1500, unitPrice: 3800, subtotal: 5700000 },
      { id: "item113", product: "Cefalexin 500mg", quantity: 900, unitPrice: 5900, subtotal: 5310000 },
      { id: "item114", product: "Loperamide 2mg", quantity: 2000, unitPrice: 3000, subtotal: 6000000 },
      { id: "item115", product: "Loratadine 10mg", quantity: 1000, unitPrice: 1700, subtotal: 1700000 }
    ]
  },
  {
    id: "po104",
    poNumber: "PO-20250225-104",
    date: "2025-02-25",
    deliveryDate: "2025-03-07",
    supplier: {
      id: "sup005",
      name: "PT Sanbe Farma"
    },
    totalItems: 3,
    totalValue: 14250000,
    status: "completed",
    paymentStatus: "paid",
    paymentDate: "2025-03-15",
    invoiceNumber: "INV-SBF-25030701",
    items: [
      { id: "item116", product: "Ciprofloxacin 500mg", quantity: 1000, unitPrice: 4500, subtotal: 4500000 },
      { id: "item117", product: "Mefenamic Acid 500mg", quantity: 1500, unitPrice: 2500, subtotal: 3750000 },
      { id: "item118", product: "Fluoxetine 20mg", quantity: 1200, unitPrice: 5000, subtotal: 6000000 }
    ]
  },
  {
    id: "po105",
    poNumber: "PO-20250220-105",
    date: "2025-02-20",
    deliveryDate: "2025-03-02",
    supplier: {
      id: "sup001",
      name: "PT Kimia Farma"
    },
    totalItems: 4,
    totalValue: 16800000,
    status: "returned",
    paymentStatus: "refunded",
    paymentDate: "2025-03-10",
    returnReason: "Produk diterima dalam kondisi rusak",
    invoiceNumber: "INV-KF-25030201",
    items: [
      { id: "item119", product: "Paracetamol 500mg", quantity: 3000, unitPrice: 1200, subtotal: 3600000 },
      { id: "item120", product: "Amoxicillin 500mg", quantity: 2000, unitPrice: 2500, subtotal: 5000000 },
      { id: "item121", product: "Omeprazole 20mg", quantity: 1500, unitPrice: 3200, subtotal: 4800000 },
      { id: "item122", product: "Cetirizine 10mg", quantity: 1900, unitPrice: 1800, subtotal: 3420000 }
    ]
  }
];

export function OrderHistory() {
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  // Handle viewing order details
  const handleViewOrder = (orderId: string) => {
    const order = mockCompletedOrders.find(order => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setOrderDetailOpen(true);
      setActiveTab("details");
    }
  };

  // Handle printing invoice
  const handlePrintInvoice = (orderId: string) => {
    // In a real app, this would generate and print a PDF invoice
    console.log("Printing invoice for order:", orderId);
    toast({
      title: "Mencetak Faktur",
      description: `Faktur untuk pesanan ${mockCompletedOrders.find(order => order.id === orderId)?.poNumber} sedang dicetak`,
    });
  };

  // Handle downloading invoice
  const handleDownloadInvoice = (orderId: string) => {
    // In a real app, this would generate and download a PDF invoice
    console.log("Downloading invoice for order:", orderId);
    toast({
      title: "Mengunduh Faktur",
      description: `Faktur untuk pesanan ${mockCompletedOrders.find(order => order.id === orderId)?.poNumber} sedang diunduh`,
    });
  };

  // Filter orders based on search query, status, and date range
  const filteredOrders = mockCompletedOrders.filter(order => {
    const matchesSearch = 
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    const orderDate = new Date(order.date);
    const matchesDateRange = 
      (!dateRange?.from || orderDate >= dateRange.from) &&
      (!dateRange?.to || orderDate <= dateRange.to);
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Get status badge details
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return { 
          label: "Selesai", 
          variant: "outline" as const,
          icon: <FaCheckDouble className="mr-1 h-3 w-3" />,
          className: "border-green-200 text-green-700 bg-green-50"
        };
      case "returned":
        return { 
          label: "Dikembalikan", 
          variant: "outline" as const,
          icon: <FaTimesCircle className="mr-1 h-3 w-3" />,
          className: "border-red-200 text-red-700 bg-red-50"
        };
      case "partial":
        return { 
          label: "Sebagian", 
          variant: "outline" as const,
          icon: <FaBoxOpen className="mr-1 h-3 w-3" />,
          className: "border-orange-200 text-orange-700 bg-orange-50"
        };
      default:
        return { 
          label: "Unknown", 
          variant: "outline" as const,
          icon: <FaHistory className="mr-1 h-3 w-3" />,
          className: "border-gray-200 text-gray-700 bg-gray-50"
        };
    }
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return { 
          label: "Lunas", 
          variant: "outline" as const,
          className: "border-green-200 text-green-700 bg-green-50"
        };
      case "partial":
        return { 
          label: "Sebagian", 
          variant: "outline" as const,
          className: "border-orange-200 text-orange-700 bg-orange-50"
        };
      case "unpaid":
        return { 
          label: "Belum Bayar", 
          variant: "outline" as const,
          className: "border-red-200 text-red-700 bg-red-50"
        };
      case "refunded":
        return { 
          label: "Dikembalikan", 
          variant: "outline" as const,
          className: "border-purple-200 text-purple-700 bg-purple-50"
        };
      default:
        return { 
          label: "Unknown", 
          variant: "outline" as const,
          className: "border-gray-200 text-gray-700 bg-gray-50"
        };
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
            <FaHistory className="mr-2 h-6 w-6 text-orange-500" />
            Riwayat Pesanan
          </CardTitle>
          <CardDescription>
            Lihat riwayat pesanan yang telah selesai atau dikembalikan
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Filter and search */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Input 
                    placeholder="Cari berdasarkan nomor PO, supplier, atau nomor faktur" 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all" onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="returned">Dikembalikan</SelectItem>
                      <SelectItem value="partial">Sebagian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-start">
                <DateRangePicker 
                  date={dateRange} 
                  onDateChange={setDateRange}
                  locale="id"
                />
              </div>
            </div>
            
            {/* List of completed orders */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. PO</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>No. Faktur</TableHead>
                    <TableHead className="text-center">Jumlah Item</TableHead>
                    <TableHead className="text-right">Nilai Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Pembayaran</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                        Tidak ada pesanan yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusBadge = getStatusBadge(order.status);
                      const paymentStatusBadge = getPaymentStatusBadge(order.paymentStatus);
                      
                      return (
                        <TableRow key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <TableCell className="font-medium">{new Date(order.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</TableCell>
                          <TableCell>{order.poNumber}</TableCell>
                          <TableCell>{order.supplier.name}</TableCell>
                          <TableCell>{order.invoiceNumber}</TableCell>
                          <TableCell className="text-center">{order.totalItems}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.totalValue)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusBadge.variant} className={statusBadge.className}>
                              {statusBadge.icon}
                              {statusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={paymentStatusBadge.variant} className={paymentStatusBadge.className}>
                              {paymentStatusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                onClick={() => handleViewOrder(order.id)}
                                title="Lihat Detail"
                              >
                                <FaEye className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 h-8 w-8 p-0"
                                onClick={() => handlePrintInvoice(order.id)}
                                title="Cetak Faktur"
                              >
                                <FaPrint className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-green-500 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                                onClick={() => handleDownloadInvoice(order.id)}
                                title="Unduh Faktur"
                              >
                                <FaFileDownload className="h-4 w-4" />
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
          </div>
        </CardContent>
      </Card>
      
      {/* Order Detail Dialog */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-4xl overflow-hidden">
          {/* Decorative header element */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-400"></div>
          
          {/* Decorative blurred circles */}
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-orange-500/20 blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-500/20 blur-xl"></div>
          
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <FaFileInvoice className="mr-2 h-6 w-6 text-orange-500" />
              Detail Pesanan: {selectedOrder?.poNumber}
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang pesanan
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
                    Detail Pesanan
                  </TabsTrigger>
                  <TabsTrigger value="items" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
                    Daftar Produk
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Nomor PO</p>
                      <p className="font-medium">{selectedOrder.poNumber}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                      <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Tanggal Pengiriman</p>
                      <p className="font-medium">{new Date(selectedOrder.deliveryDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Supplier</p>
                      <p className="font-medium">{selectedOrder.supplier.name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Nomor Faktur</p>
                      <p className="font-medium">{selectedOrder.invoiceNumber}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={getStatusBadge(selectedOrder.status).variant} className={getStatusBadge(selectedOrder.status).className}>
                        {getStatusBadge(selectedOrder.status).icon}
                        {getStatusBadge(selectedOrder.status).label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Status Pembayaran</p>
                      <Badge variant={getPaymentStatusBadge(selectedOrder.paymentStatus).variant} className={getPaymentStatusBadge(selectedOrder.paymentStatus).className}>
                        {getPaymentStatusBadge(selectedOrder.paymentStatus).label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                      <p className="font-medium">{new Date(selectedOrder.paymentDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Total Nilai</p>
                      <p className="font-medium text-lg">{formatCurrency(selectedOrder.totalValue)}</p>
                    </div>
                    
                    {selectedOrder.returnReason && (
                      <div className="col-span-3 space-y-2 mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
                        <p className="text-sm text-red-700 font-medium">Alasan Pengembalian</p>
                        <p className="text-red-600">{selectedOrder.returnReason}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="items" className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-center">Kuantitas</TableHead>
                        <TableHead className="text-right">Harga Satuan</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-t-2 border-gray-300">
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(selectedOrder.totalValue)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => handleDownloadInvoice(selectedOrder?.id)}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              <FaFileDownload className="mr-2 h-4 w-4" />
              Unduh Faktur
            </Button>
            <Button 
              onClick={() => handlePrintInvoice(selectedOrder?.id)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <FaPrint className="mr-2 h-4 w-4" />
              Cetak Faktur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
