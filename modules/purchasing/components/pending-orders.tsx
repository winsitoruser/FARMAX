import React, { useState } from 'react'
import { format } from 'date-fns'
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card'
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableFooter 
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
  FaSearch, FaCheck, FaTimes, FaEye, FaFileInvoice, FaEdit, 
  FaClock, FaShippingFast, FaExclamationTriangle, FaShoppingCart, FaClipboardList
} from 'react-icons/fa'
import { useToast } from '@/components/ui/use-toast'

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
  const { toast } = useToast();

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
  
  // Handle view invoice
  const handleViewInvoice = (orderId: string) => {
    const order = mockPendingOrders.find(order => order.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setOrderDetailOpen(true);
      setActiveTab("invoice");
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
          className: "border-red-200 text-red-700 bg-red-50"
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
          icon: <FaShippingFast className="mr-1 h-3 w-3" />,
          className: "border-blue-200 text-blue-700 bg-blue-50"
        };
      case "partial_delivery":
        return { 
          label: "Pengiriman Sebagian", 
          variant: "outline" as const,
          icon: <FaShoppingCart className="mr-1 h-3 w-3" />,
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
    <div className="p-4">
      <Card className="border-red-100 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden relative">
        {/* Design elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-500"></div>
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-red-500/10 to-red-300/5 rounded-full blur-xl -z-0"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-red-500/10 to-orange-400/5 rounded-full blur-xl -z-0"></div>
        
        <CardHeader className="pb-2 border-b border-red-100/50 relative z-10">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text flex items-center gap-2">
            <span className="inline-block p-1.5 rounded-full bg-gradient-to-br from-red-600 to-red-500">
              <FaShoppingCart className="h-4 w-4 text-white" />
            </span>
            Pesanan Tertunda
          </CardTitle>
          <CardDescription>
            Daftar pesanan yang belum diproses dan diterima oleh apotek
          </CardDescription>
        </CardHeader>
        
        {/* Search and Filter */}
        <div className="p-4 flex flex-col md:flex-row gap-2 justify-between">
          <div className="relative flex items-center w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Cari nomor PO atau supplier..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-red-100 focus:border-red-300 focus:ring-red-200"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 border-red-100 focus:border-red-300 focus:ring-red-200">
              <SelectValue placeholder="Filter status" />
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
        
        <CardContent className="p-0 relative z-10">
          <Table>
            <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/70">
              <TableRow>
                <TableHead>Nomor PO</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada pesanan ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-red-50/50 transition-colors">
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>{order.supplier.name}</TableCell>
                    <TableCell>Admin Farmasi</TableCell>
                    <TableCell className="text-right">{formatCurrency(order.totalValue)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(order.status).className} variant="outline">
                        {getStatusBadge(order.status).icon}
                        {getStatusBadge(order.status).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 border-red-200 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <FaEye className="h-3.5 w-3.5 mr-1" />
                          List Produk
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 border-red-200 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleViewInvoice(order.id)}
                        >
                          <FaFileInvoice className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter className="bg-gradient-to-r from-red-100/30 to-red-50/50">
              <TableRow>
                <TableCell colSpan={7} className="text-right font-medium text-red-800">
                  Total: {filteredOrders.length} pesanan tertunda
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for viewing order details */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-red-50/20">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-500"></div>
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-red-500/10 to-red-300/5 rounded-full blur-xl -z-0"></div>
          
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text flex items-center gap-2">
                  <span className="inline-block p-1 rounded-full bg-gradient-to-br from-red-600 to-red-500">
                    <FaClipboardList className="h-4 w-4 text-white" />
                  </span>
                  Detail Pesanan {selectedOrder.poNumber}
                </DialogTitle>
                <DialogDescription>
                  Informasi lengkap tentang pesanan ini
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-red-50/80 p-1 gap-1">
                  <TabsTrigger 
                    value="details"
                    className="text-red-800 hover:bg-red-100/70
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-sm data-[state=active]:shadow-red-500/20
                    rounded-md px-4 py-2"
                  >
                    Detail Pesanan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="products"
                    className="text-red-800 hover:bg-red-100/70
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-sm data-[state=active]:shadow-red-500/20
                    rounded-md px-4 py-2"
                  >
                    Daftar Produk
                  </TabsTrigger>
                  <TabsTrigger 
                    value="invoice"
                    className="text-red-800 hover:bg-red-100/70
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-sm data-[state=active]:shadow-red-500/20
                    rounded-md px-4 py-2"
                  >
                    Format Invoice
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50/50 rounded-md">
                    <div>
                      <p className="text-sm text-gray-500">Nomor PO</p>
                      <p className="font-medium">{selectedOrder.poNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal</p>
                      <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Supplier</p>
                      <p className="font-medium">{selectedOrder.supplier.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimasi Pengiriman</p>
                      <p className="font-medium">{new Date(selectedOrder.expectedDelivery).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <Badge className={getStatusBadge(selectedOrder.status).className} variant="outline">
                        {getStatusBadge(selectedOrder.status).icon}
                        {getStatusBadge(selectedOrder.status).label}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Nilai</p>
                      <p className="font-medium">{formatCurrency(selectedOrder.totalValue)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4">
                    {selectedOrder.status === 'awaiting_approval' && (
                      <>
                        <Button 
                          variant="outline" 
                          className="border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => {
                            handleRejectOrder(selectedOrder.id);
                            setOrderDetailOpen(false);
                          }}
                        >
                          <FaTimes className="mr-2 h-4 w-4" /> Tolak
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white"
                          onClick={() => {
                            handleApproveOrder(selectedOrder.id);
                            setOrderDetailOpen(false);
                          }}
                        >
                          <FaCheck className="mr-2 h-4 w-4" /> Setujui
                        </Button>
                      </>
                    )}
                    {/* Hanya tampilkan tombol Edit jika status adalah awaiting_approval */}
                    {selectedOrder.status === 'awaiting_approval' && (
                      <Button 
                        className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white"
                        onClick={() => {
                          handleEditOrder(selectedOrder.id);
                          setOrderDetailOpen(false);
                        }}
                      >
                        <FaEdit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    )}
                    {/* Tampilkan tombol Tutup untuk status selain awaiting_approval */}
                    {selectedOrder.status !== 'awaiting_approval' && (
                      <Button 
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
                        onClick={() => setOrderDetailOpen(false)}
                      >
                        Tutup
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="products" className="pt-4">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/70">
                      <TableRow>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Harga Satuan</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter className="bg-gradient-to-r from-red-100/30 to-red-50/50">
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(selectedOrder.totalValue)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TabsContent>
                
                <TabsContent value="invoice" className="pt-4">
                  <div className="border border-red-100 rounded-md p-6 bg-white relative">
                    {/* Invoice header with logo and PO details */}
                    <div className="flex justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">FARMAX APOTEK</h3>
                        <p className="text-sm text-gray-500">Jl. Farmasi No. 123</p>
                        <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text">
                          PURCHASE ORDER
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">Nomor: {selectedOrder.poNumber}</p>
                        <p className="text-sm text-gray-500">Tanggal: {new Date(selectedOrder.date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    
                    {/* Supplier and delivery info */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Supplier:</h5>
                        <p className="text-sm">{selectedOrder.supplier.name}</p>
                        <p className="text-sm text-gray-500">ID: {selectedOrder.supplier.id}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Informasi Pengiriman:</h5>
                        <p className="text-sm">Estimasi Pengiriman: {new Date(selectedOrder.expectedDelivery).toLocaleDateString('id-ID')}</p>
                        <p className="text-sm text-gray-500">Status: {getStatusBadge(selectedOrder.status).label}</p>
                      </div>
                    </div>
                    
                    {/* Items table */}
                    <h5 className="font-medium text-gray-700 mb-2">Daftar Item:</h5>
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-red-50 to-red-100/70">
                        <TableRow>
                          <TableHead>Nama Produk</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                          <TableHead className="text-right">Harga Satuan</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter className="bg-gradient-to-r from-red-100/30 to-red-50/50">
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(selectedOrder.totalValue)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                    
                    {/* Signatures block */}
                    <div className="grid grid-cols-2 gap-6 mt-8">
                      <div className="text-center">
                        <p className="mb-8">______________________</p>
                        <p className="font-medium">Pemohon</p>
                      </div>
                      <div className="text-center">
                        <p className="mb-8">______________________</p>
                        <p className="font-medium">Menyetujui</p>
                      </div>
                    </div>
                    
                    {/* Print button */}
                    <div className="mt-6 flex justify-end">
                      <Button 
                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white"
                        onClick={() => {
                          toast({
                            title: "Mencetak Invoice",
                            description: `Invoice untuk pesanan ${selectedOrder.poNumber} sedang dicetak`,
                          });
                        }}
                      >
                        <FaFileInvoice className="mr-2 h-4 w-4" /> Cetak Invoice
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
