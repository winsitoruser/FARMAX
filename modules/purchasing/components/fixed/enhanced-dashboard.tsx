import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { FaBoxOpen, FaTruckLoading, FaClipboardList, FaDollarSign, FaFileInvoice, FaSearch, FaPlus } from 'react-icons/fa';

// Mock data for defect items
const mockDefectItems = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'MED001',
    priority: 'high',
    quantity: 500,
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    sku: 'MED002',
    priority: 'medium',
    quantity: 200,
  },
  {
    id: '3',
    name: 'Omeprazole 20mg',
    sku: 'MED003',
    priority: 'high',
    quantity: 300,
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    sku: 'MED004',
    priority: 'low',
    quantity: 400,
  },
];

// Mock data for purchase orders
const mockPurchaseOrders = [
  {
    id: 'po1',
    supplier: 'PT Kimia Farma',
    date: '2025-04-02',
    status: 'draft',
    items: 3,
    total: 2500000,
  },
  {
    id: 'po2',
    supplier: 'PT Dexa Medica',
    date: '2025-04-01',
    status: 'pending',
    items: 5,
    total: 4800000,
  },
];

const mockStatsData = {
  pendingOrders: 8,
  inTransit: 3,
  totalValue: 15000000,
  lowStockItems: 12
};

export function EnhancedPurchasingDashboard() {
  const { toast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = searchRef.current?.value;
    toast({
      title: "Pencarian",
      description: `Mencari item dengan kata kunci: ${searchTerm}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Heading and Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
            Dashboard Pembelian
          </h2>
          <p className="text-gray-500 mt-1">
            Kelola pesanan, pembelian, dan stok barang
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              ref={searchRef}
              placeholder="Cari produk..." 
              className="pl-9 pr-4 border-orange-100 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            Cari
          </Button>
        </form>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Pesanan Tertunda</p>
                <p className="text-2xl font-bold">{mockStatsData.pendingOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-sm">
                <FaClipboardList className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Dalam Pengiriman</p>
                <p className="text-2xl font-bold">{mockStatsData.inTransit}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm">
                <FaTruckLoading className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Nilai</p>
                <p className="text-2xl font-bold">Rp{(mockStatsData.totalValue / 1000000).toFixed(1)}jt</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm">
                <FaDollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Stok Menipis</p>
                <p className="text-2xl font-bold">{mockStatsData.lowStockItems}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center shadow-sm">
                <FaBoxOpen className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column - Defecta List */}
        <div className="col-span-12 lg:col-span-5">
          <Card className="border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-xl -z-0"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            
            <CardHeader className="pb-2 border-b border-orange-100/50 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                    Daftar Defekta
                  </CardTitle>
                  <CardDescription>
                    Item yang perlu dipesan dari supplier
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  Tambah Item
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 relative z-10">
              <Table>
                <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Prioritas</TableHead>
                    <TableHead className="text-center">Jumlah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDefectItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-orange-50/30">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          item.priority === 'high' 
                            ? "border-orange-200 text-orange-700 bg-orange-50" 
                            : item.priority === 'medium'
                            ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                            : "border-green-200 text-green-700 bg-green-50"
                        }>
                          {item.priority === 'high' ? 'Tinggi' : item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="hover:bg-orange-100">
                          <FaPlus className="h-3.5 w-3.5 text-orange-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 text-center">
                <Button variant="link" className="text-orange-600 hover:text-orange-700">
                  Lihat Semua Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - PO Creation */}
        <div className="col-span-12 lg:col-span-7">
          <Card className="border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-xl -z-0"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            
            <CardHeader className="pb-2 border-b border-orange-100/50 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                    Purchase Order Terbaru
                  </CardTitle>
                  <CardDescription>
                    Daftar order yang sedang dalam proses
                  </CardDescription>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  Order Baru
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 relative z-10">
              <Table>
                <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-center">Item</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchaseOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-orange-50/30">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-center">{order.items}</TableCell>
                      <TableCell className="text-right">
                        Rp{(order.total).toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={
                          order.status === 'draft' 
                            ? "border-gray-200 text-gray-700 bg-gray-50" 
                            : order.status === 'pending'
                            ? "border-orange-200 text-orange-700 bg-orange-50"
                            : "border-green-200 text-green-700 bg-green-50"
                        }>
                          {order.status === 'draft' ? 'Draft' : order.status === 'pending' ? 'Pending' : 'Selesai'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="p-6 flex items-center justify-center bg-gradient-to-br from-orange-50/80 to-amber-50/50 border-t border-orange-100">
                <div className="text-center max-w-md">
                  <FaFileInvoice className="h-12 w-12 mx-auto mb-3 text-orange-500 opacity-80" />
                  <h3 className="font-medium text-lg mb-2">Buat Purchase Order</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Tambahkan item dari daftar defekta untuk membuat purchase order baru ke supplier
                  </p>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    Buat PO Baru
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
