import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { FaFilePdf, FaFileInvoice, FaDownload, FaEye, FaSearch, FaCreditCard, FaHistory, FaCalendarAlt, FaFilter, FaPrint } from 'react-icons/fa';
import { AlertCircle, ArrowDown, ArrowUp, Calendar, Check, CreditCard, ExternalLink, Eye, FileText, Filter, Printer, Receipt, X } from 'lucide-react';

// Menambahkan interface untuk item details
interface InvoiceItem {
  description: string;
  amount: number;
}

interface InvoiceDetails {
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface Invoice {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  type: string;
  description: string;
  paidDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  details: InvoiceDetails;
}

// Sample invoice data
const invoices: Invoice[] = [
  {
    id: 'INV-20251004-001',
    date: '04 Apr 2025',
    dueDate: '14 Apr 2025',
    amount: 499000,
    status: 'unpaid',
    type: 'Subscription',
    description: 'Premium Plan - May 2025',
    details: {
      items: [
        { description: 'Premium Plan - Monthly Subscription', amount: 450000 },
        { description: 'PPN 11%', amount: 49000 }
      ],
      subtotal: 450000,
      tax: 49000,
      total: 499000,
    }
  },
  {
    id: 'INV-20250304-001',
    date: '04 Mar 2025',
    dueDate: '14 Mar 2025',
    amount: 499000,
    status: 'paid',
    paidDate: '05 Mar 2025',
    type: 'Subscription',
    description: 'Premium Plan - April 2025',
    paymentMethod: 'Visa **** 4242',
    transactionId: 'TRX12345678',
    details: {
      items: [
        { description: 'Premium Plan - Monthly Subscription', amount: 450000 },
        { description: 'PPN 11%', amount: 49000 }
      ],
      subtotal: 450000,
      tax: 49000,
      total: 499000,
    }
  },
  {
    id: 'INV-20250204-001',
    date: '04 Feb 2025',
    dueDate: '14 Feb 2025',
    amount: 499000,
    status: 'paid',
    paidDate: '10 Feb 2025',
    type: 'Subscription',
    description: 'Premium Plan - March 2025',
    paymentMethod: 'Visa **** 4242',
    transactionId: 'TRX23456789',
    details: {
      items: [
        { description: 'Premium Plan - Monthly Subscription', amount: 450000 },
        { description: 'PPN 11%', amount: 49000 }
      ],
      subtotal: 450000,
      tax: 49000,
      total: 499000,
    }
  },
  {
    id: 'INV-20250104-001',
    date: '04 Jan 2025',
    dueDate: '14 Jan 2025',
    amount: 499000,
    status: 'paid',
    paidDate: '05 Jan 2025',
    type: 'Subscription',
    description: 'Premium Plan - February 2025',
    paymentMethod: 'Visa **** 4242',
    transactionId: 'TRX34567890',
    details: {
      items: [
        { description: 'Premium Plan - Monthly Subscription', amount: 450000 },
        { description: 'PPN 11%', amount: 49000 }
      ],
      subtotal: 450000,
      tax: 49000,
      total: 499000,
    }
  }
];

export function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1"><Check className="h-3 w-3" /> Lunas</Badge>;
      case 'unpaid':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Belum Lunas</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1"><X className="h-3 w-3" /> Terlambat</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  // Handle invoice selection for detail view
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  // Handle payment initiation
  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  // Apply filters to invoices
  const applyFilters = () => {
    return invoices.filter(invoice => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = 
        statusFilter === 'all' || 
        invoice.status === statusFilter;
        
      // Simple date filtering - actual implementation would be more nuanced
      const matchesDate = dateFilter === 'all' || (
        dateFilter === 'thisMonth' && invoice.date.includes('Apr') ||
        dateFilter === 'lastMonth' && invoice.date.includes('Mar') ||
        dateFilter === 'last3Months' && (
          invoice.date.includes('Apr') || 
          invoice.date.includes('Mar') || 
          invoice.date.includes('Feb')
        )
      );
        
      return matchesSearch && matchesStatus && matchesDate;
    });
  };
  
  const filteredInvoices = applyFilters();
  const outstandingInvoices = filteredInvoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue');
  const paidInvoices = filteredInvoices.filter(inv => inv.status === 'paid');

  return (
    <div className="space-y-6">
      {/* Outstanding Invoices */}
      <Card className="border-orange-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 text-orange-500 mr-2" /> 
            Invoice Yang Belum Dibayar
          </CardTitle>
          <CardDescription>
            Invoice yang belum dibayar dan perlu segera dilunasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {outstandingInvoices.length > 0 ? (
            <div className="space-y-4">
              {outstandingInvoices.map(invoice => (
                <Card key={invoice.id} className="border-yellow-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <Receipt className="text-orange-500 h-5 w-5 mr-2" />
                          <h3 className="font-semibold text-gray-800">{invoice.id}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{invoice.description}</p>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Jumlah</p>
                          <p className="font-semibold">{formatPrice(invoice.amount)}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Jatuh Tempo</p>
                          <p className="font-semibold text-orange-700">{invoice.dueDate}</p>
                        </div>
                        
                        <div className="text-right md:ml-2">
                          {getStatusBadge(invoice.status)}
                        </div>
                        
                        <div className="flex gap-2 mt-2 md:mt-0 md:ml-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-gray-700"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Detail
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            onClick={() => handlePayInvoice(invoice)}
                          >
                            <CreditCard className="h-4 w-4 mr-1" /> Bayar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-700">Tidak ada invoice yang belum dibayar</p>
              <p className="text-sm text-gray-500 mt-1">Semua invoice telah dibayar. Terima kasih!</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* All Invoices */}
      <Card className="border-orange-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 text-orange-500 mr-2" /> 
                Riwayat Invoice
              </CardTitle>
              <CardDescription>Daftar lengkap invoice dari transaksi Anda</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center">
                <div className="relative w-full md:w-64">
                  <FaSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Cari invoice..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="unpaid">Belum Lunas</SelectItem>
                  <SelectItem value="overdue">Terlambat</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[160px]">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Periode" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="thisMonth">Bulan Ini</SelectItem>
                  <SelectItem value="lastMonth">Bulan Lalu</SelectItem>
                  <SelectItem value="last3Months">3 Bulan Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center text-gray-700 border-gray-200">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="flex items-center text-gray-700 border-gray-200">
                <FaDownload className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Tab navigation for invoices */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all" className="flex items-center justify-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Semua Invoice</span>
              </TabsTrigger>
              <TabsTrigger value="paid" className="flex items-center justify-center gap-1">
                <Check className="h-4 w-4" />
                <span>Lunas</span>
              </TabsTrigger>
              <TabsTrigger value="unpaid" className="flex items-center justify-center gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>Belum Lunas</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-orange-50">
                    <TableRow>
                      <TableHead className="font-medium">Invoice ID</TableHead>
                      <TableHead className="font-medium">Tanggal Terbit</TableHead>
                      <TableHead className="font-medium">Jatuh Tempo</TableHead>
                      <TableHead className="font-medium">Jumlah</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Deskripsi</TableHead>
                      <TableHead className="font-medium text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell>{formatPrice(invoice.amount)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>{invoice.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewInvoice(invoice)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {invoice.status === 'unpaid' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handlePayInvoice(invoice)}
                                  className="h-8 w-8 text-orange-600"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FaDownload className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Tidak ada invoice yang cocok dengan filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="paid" className="mt-0">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-orange-50">
                    <TableRow>
                      <TableHead className="font-medium">Invoice ID</TableHead>
                      <TableHead className="font-medium">Tanggal Terbit</TableHead>
                      <TableHead className="font-medium">Tanggal Bayar</TableHead>
                      <TableHead className="font-medium">Jumlah</TableHead>
                      <TableHead className="font-medium">Metode Pembayaran</TableHead>
                      <TableHead className="font-medium">Deskripsi</TableHead>
                      <TableHead className="font-medium text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paidInvoices.length > 0 ? (
                      paidInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell className="text-green-700">{invoice.paidDate}</TableCell>
                          <TableCell>{formatPrice(invoice.amount)}</TableCell>
                          <TableCell>{invoice.paymentMethod || '-'}</TableCell>
                          <TableCell>{invoice.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewInvoice(invoice)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FaDownload className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Tidak ada invoice yang sudah dibayar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="unpaid" className="mt-0">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-orange-50">
                    <TableRow>
                      <TableHead className="font-medium">Invoice ID</TableHead>
                      <TableHead className="font-medium">Tanggal Terbit</TableHead>
                      <TableHead className="font-medium">Jatuh Tempo</TableHead>
                      <TableHead className="font-medium">Jumlah</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Deskripsi</TableHead>
                      <TableHead className="font-medium text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outstandingInvoices.length > 0 ? (
                      outstandingInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell className="text-orange-700">{invoice.dueDate}</TableCell>
                          <TableCell>{formatPrice(invoice.amount)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>{invoice.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewInvoice(invoice)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handlePayInvoice(invoice)}
                                className="h-8 w-8 text-orange-600"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <FaDownload className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Tidak ada invoice yang belum dibayar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Invoice Detail Dialog */}
      <Dialog open={showInvoiceDetail} onOpenChange={setShowInvoiceDetail}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-orange-500" />
              Detail Invoice {selectedInvoice?.id}
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap invoice dan rincian pembayaran
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="py-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">FARMANESIA POS</h3>
                  <p className="text-sm text-gray-600">Jl. Teknologi Digital No. 21</p>
                  <p className="text-sm text-gray-600">Jakarta Selatan, 12950</p>
                  <p className="text-sm text-gray-600">support@farmanesia.com</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {selectedInvoice.status === 'paid' ? (
                      <>
                        <Check className="h-4 w-4" /> LUNAS
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" /> BELUM LUNAS
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Invoice #{selectedInvoice.id}</p>
                  <p className="text-sm text-gray-600">Tanggal Terbit: {selectedInvoice.date}</p>
                  <p className="text-sm text-gray-600">Jatuh Tempo: {selectedInvoice.dueDate}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="my-6">
                <h3 className="font-medium text-gray-800 mb-2">Invoice Untuk:</h3>
                <p className="text-sm">Apotek Sehat Farma</p>
                <p className="text-sm text-gray-600">Jl. Kesehatan No. 45</p>
                <p className="text-sm text-gray-600">Jakarta Barat, 11540</p>
                <p className="text-sm text-gray-600">owner@apoteksehatfarma.com</p>
              </div>
              
              <div className="rounded-md border overflow-hidden mt-6">
                <Table>
                  <TableHeader className="bg-orange-50">
                    <TableRow>
                      <TableHead className="w-[60%]">Deskripsi</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.details.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-medium">Subtotal</TableCell>
                      <TableCell className="text-right">{formatPrice(selectedInvoice.details.subtotal)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Pajak (PPN 11%)</TableCell>
                      <TableCell className="text-right">{formatPrice(selectedInvoice.details.tax)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-orange-50">
                      <TableCell className="font-bold text-lg">Total</TableCell>
                      <TableCell className="text-right font-bold text-lg">{formatPrice(selectedInvoice.details.total)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {selectedInvoice.status === 'paid' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-md">
                  <h3 className="font-medium text-green-800 flex items-center gap-1 mb-2">
                    <Check className="h-4 w-4" /> Informasi Pembayaran
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Pembayaran</p>
                      <p className="font-medium">{selectedInvoice.paidDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Metode Pembayaran</p>
                      <p className="font-medium">{selectedInvoice.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ID Transaksi</p>
                      <p className="font-medium">{selectedInvoice.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className="bg-green-500 hover:bg-green-600">Lunas</Badge>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 bg-gray-50 p-4 rounded-md text-center">
                <p className="text-sm text-gray-600 mb-1">Terima kasih atas kepercayaan Anda menggunakan FARMAX POS</p>
                <p className="text-xs text-gray-500">Jika ada pertanyaan, silakan hubungi support@farmanesia.com</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" /> Cetak Invoice
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FaDownload className="h-4 w-4" /> Download PDF
            </Button>
            {selectedInvoice?.status === 'unpaid' && (
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex items-center gap-2"
                onClick={() => {
                  setShowInvoiceDetail(false);
                  setShowPaymentModal(true);
                }}
              >
                <CreditCard className="h-4 w-4" /> Bayar Sekarang
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Bayar Invoice
            </DialogTitle>
            <DialogDescription>
              Pilih metode pembayaran untuk menyelesaikan transaksi
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="py-4">
              <div className="mb-6 p-4 rounded-md bg-orange-50 border border-orange-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Invoice ID:</span>
                  <span className="font-medium">{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Deskripsi:</span>
                  <span className="font-medium">{selectedInvoice.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-bold text-orange-700">{formatPrice(selectedInvoice.amount)}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-700 mb-2">Pilih Metode Pembayaran</h3>
              
              <div className="space-y-2">
                <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input type="radio" id="cc" name="payment-method" className="mr-3" defaultChecked />
                  <label htmlFor="cc" className="flex items-center cursor-pointer">
                    <div className="h-8 w-12 bg-gradient-to-r from-blue-800 to-blue-600 rounded mr-3"></div>
                    <div>
                      <p className="font-medium">Kartu Kredit / Debit</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, JCB</p>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input type="radio" id="va" name="payment-method" className="mr-3" />
                  <label htmlFor="va" className="flex items-center cursor-pointer">
                    <div className="h-8 w-12 bg-gradient-to-r from-green-600 to-green-400 rounded mr-3"></div>
                    <div>
                      <p className="font-medium">Virtual Account</p>
                      <p className="text-xs text-gray-500">BCA, Mandiri, BNI, BRI</p>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                  <input type="radio" id="qris" name="payment-method" className="mr-3" />
                  <label htmlFor="qris" className="flex items-center cursor-pointer">
                    <div className="h-8 w-12 bg-gradient-to-r from-red-600 to-red-400 rounded mr-3 flex items-center justify-center text-white font-bold text-xs">QRIS</div>
                    <div>
                      <p className="font-medium">QRIS</p>
                      <p className="text-xs text-gray-500">Gopay, OVO, Dana, LinkAja, ShopeePay</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Lanjutkan Pembayaran
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
