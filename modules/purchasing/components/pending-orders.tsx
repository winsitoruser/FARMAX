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
  FaSearch, FaEye, FaEdit, FaCheck, FaTimes, FaFileInvoice, 
  FaTruck, FaBoxOpen, FaExclamationTriangle, FaClock
} from 'react-icons/fa'
import { toast } from '@/components/ui/use-toast'

// Mock data for pending purchase orders
const mockPendingOrders = [
  {
    id: "po001",
    poNumber: "PO-20250330-001",
    date: "2025-03-30",
    supplier: {
      id: "sup001",
      name: "PT Kimia Farma"
    },
    expectedDelivery: "2025-04-10",
    totalItems: 5,
    totalValue: 12500000,
    status: "awaiting_approval",
    items: [
      { id: "item001", product: "Paracetamol 500mg", quantity: 1000, unitPrice: 1200, subtotal: 1200000 },
      { id: "item002", product: "Amoxicillin 500mg", quantity: 500, unitPrice: 2500, subtotal: 1250000 },
      { id: "item003", product: "Omeprazole 20mg", quantity: 300, unitPrice: 3200, subtotal: 960000 },
      { id: "item004", product: "Cetirizine 10mg", quantity: 800, unitPrice: 1800, subtotal: 1440000 },
      { id: "item005", product: "Vitamin C 500mg", quantity: 2000, unitPrice: 950, subtotal: 1900000 }
    ]
  },
  {
    id: "po002",
    poNumber: "PO-20250328-002",
    date: "2025-03-28",
    supplier: {
      id: "sup002",
      name: "PT Phapros"
    },
    expectedDelivery: "2025-04-15",
    totalItems: 3,
    totalValue: 8750000,
    status: "approved",
    items: [
      { id: "item006", product: "Captopril 25mg", quantity: 1500, unitPrice: 1800, subtotal: 2700000 },
      { id: "item007", product: "Metformin 500mg", quantity: 1200, unitPrice: 2250, subtotal: 2700000 },
      { id: "item008", product: "Simvastatin 20mg", quantity: 1000, unitPrice: 3350, subtotal: 3350000 }
    ]
  },
  {
    id: "po003",
    poNumber: "PO-20250325-003",
    date: "2025-03-25",
    supplier: {
      id: "sup003",
      name: "PT Kalbe Farma"
    },
    expectedDelivery: "2025-04-05",
    totalItems: 4,
    totalValue: 15200000,
    status: "shipped",
    items: [
      { id: "item009", product: "Lansoprazole 30mg", quantity: 800, unitPrice: 4200, subtotal: 3360000 },
      { id: "item010", product: "Amlodipine 10mg", quantity: 1000, unitPrice: 3800, subtotal: 3800000 },
      { id: "item011", product: "Cefalexin 500mg", quantity: 600, unitPrice: 5900, subtotal: 3540000 },
      { id: "item012", product: "Loperamide 2mg", quantity: 1500, unitPrice: 3000, subtotal: 4500000 }
    ]
  },
  {
    id: "po004",
    poNumber: "PO-20250323-004",
    date: "2025-03-23",
    supplier: {
      id: "sup004",
      name: "PT Dexa Medica"
    },
    expectedDelivery: "2025-04-03",
    totalItems: 2,
    totalValue: 9500000,
    status: "partial_delivery",
    items: [
      { id: "item013", product: "Ibuprofen 400mg", quantity: 1200, unitPrice: 3500, subtotal: 4200000 },
      { id: "item014", product: "Ranitidine 150mg", quantity: 1500, unitPrice: 3500, subtotal: 5250000 }
    ]
  }
];

export function PendingOrders() {
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  // Handle viewing order details
  const handleViewOrder = (orderId: string) => {
    const order = mockPendingOrders.find(order => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setOrderDetailOpen(true);
      setActiveTab("details");
    }
  };

  // Handle order approval
  const handleApproveOrder = (orderId: string) => {
    // In a real app, this would call an API to update the order status
    console.log("Approving order:", orderId);
    toast({
      title: "Pesanan Disetujui",
      description: `Pesanan ${mockPendingOrders.find(order => order.id === orderId)?.poNumber} telah disetujui`,
    });
  };

  // Handle order rejection
  const handleRejectOrder = (orderId: string) => {
    // In a real app, this would call an API to update the order status
    console.log("Rejecting order:", orderId);
    toast({
      title: "Pesanan Ditolak",
      description: `Pesanan ${mockPendingOrders.find(order => order.id === orderId)?.poNumber} telah ditolak`,
    });
  };

  // Handle order edit
  const handleEditOrder = (orderId: string) => {
    // In a real app, this would navigate to the edit page
    console.log("Editing order:", orderId);
    toast({
      title: "Edit Pesanan",
      description: `Membuka editor untuk pesanan ${mockPendingOrders.find(order => order.id === orderId)?.poNumber}`,
    });
  };

  // Filter orders based on search query and status
  const filteredOrders = mockPendingOrders.filter(order => {
    const matchesSearch = 
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge details
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "awaiting_approval":
        return { 
          label: "Menunggu Persetujuan", 
          variant: "outline" as const,
          icon: <FaClock className="mr-1 h-3 w-3" />,
          className: "border-orange-200 text-orange-700 bg-orange-50"
        };
      case "approved":
        return { 
          label: "Disetujui", 
          variant: "outline" as const,
          icon: <FaCheck className="mr-1 h-3 w-3" />,
          className: "border-green-200 text-green-700 bg-green-50"
        };
      case "shipped":
        return { 
          label: "Dalam Pengiriman", 
          variant: "outline" as const,
          icon: <FaTruck className="mr-1 h-3 w-3" />,
          className: "border-blue-200 text-blue-700 bg-blue-50"
        };
      case "partial_delivery":
        return { 
          label: "Pengiriman Sebagian", 
          variant: "outline" as const,
          icon: <FaBoxOpen className="mr-1 h-3 w-3" />,
          className: "border-purple-200 text-purple-700 bg-purple-50"
        };
      case "rejected":
        return { 
          label: "Ditolak", 
          variant: "outline" as const,
          icon: <FaTimes className="mr-1 h-3 w-3" />,
          className: "border-red-200 text-red-700 bg-red-50"
        };
      default:
        return { 
          label: "Unknown", 
          variant: "outline" as const,
          icon: <FaExclamationTriangle className="mr-1 h-3 w-3" />,
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
            <FaClock className="mr-2 h-6 w-6 text-orange-500" />
            Pesanan Tertunda
          </CardTitle>
          <CardDescription>
            Kelola pesanan yang sedang menunggu persetujuan atau pengiriman
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Filter and search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input 
                  placeholder="Cari berdasarkan nomor PO atau supplier" 
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
                    <SelectItem value="awaiting_approval">Menunggu Persetujuan</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="shipped">Dalam Pengiriman</SelectItem>
                    <SelectItem value="partial_delivery">Pengiriman Sebagian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* List of pending orders */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. PO</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-center">Jumlah Item</TableHead>
                    <TableHead className="text-right">Nilai Total</TableHead>
                    <TableHead>Est. Pengiriman</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        Tidak ada pesanan yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const statusBadge = getStatusBadge(order.status);
                      
                      return (
                        <TableRow key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <TableCell className="font-medium">{new Date(order.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</TableCell>
                          <TableCell>{order.poNumber}</TableCell>
                          <TableCell>{order.supplier.name}</TableCell>
                          <TableCell className="text-center">{order.totalItems}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.totalValue)}</TableCell>
                          <TableCell>{new Date(order.expectedDelivery).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={statusBadge.variant} className={statusBadge.className}>
                              {statusBadge.icon}
                              {statusBadge.label}
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
                              
                              {order.status === "awaiting_approval" && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-green-500 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                                    onClick={() => handleApproveOrder(order.id)}
                                    title="Setujui"
                                  >
                                    <FaCheck className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                    onClick={() => handleRejectOrder(order.id)}
                                    title="Tolak"
                                  >
                                    <FaTimes className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 h-8 w-8 p-0"
                                onClick={() => handleEditOrder(order.id)}
                                title="Edit"
                              >
                                <FaEdit className="h-4 w-4" />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="text-sm text-gray-500">Supplier</p>
                      <p className="font-medium">{selectedOrder.supplier.name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge variant={getStatusBadge(selectedOrder.status).variant} className={getStatusBadge(selectedOrder.status).className}>
                        {getStatusBadge(selectedOrder.status).icon}
                        {getStatusBadge(selectedOrder.status).label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Estimasi Pengiriman</p>
                      <p className="font-medium">{new Date(selectedOrder.expectedDelivery).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Total Nilai</p>
                      <p className="font-medium text-lg">{formatCurrency(selectedOrder.totalValue)}</p>
                    </div>
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
            {selectedOrder?.status === "awaiting_approval" && (
              <>
                <Button 
                  onClick={() => {
                    handleRejectOrder(selectedOrder.id);
                    setOrderDetailOpen(false);
                  }}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  <FaTimes className="mr-2 h-4 w-4" />
                  Tolak
                </Button>
                <Button 
                  onClick={() => {
                    handleApproveOrder(selectedOrder.id);
                    setOrderDetailOpen(false);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <FaCheck className="mr-2 h-4 w-4" />
                  Setujui
                </Button>
              </>
            )}
            {selectedOrder?.status !== "awaiting_approval" && (
              <Button 
                onClick={() => setOrderDetailOpen(false)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Tutup
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
