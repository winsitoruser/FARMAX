import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { FaFilePdf, FaFileInvoice, FaDownload, FaEye, FaSearch } from 'react-icons/fa';

// Sample invoice data
const invoices = [
  {
    id: 'INV-20251004-001',
    date: '04 Apr 2025',
    dueDate: '14 Apr 2025',
    amount: 499000,
    status: 'unpaid',
    type: 'Subscription',
    description: 'Premium Plan - May 2025',
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
  }
];

export function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
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
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      case 'unpaid':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Unpaid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Invoice Management</h2>
        <p className="text-gray-600 mt-1">
          Kelola semua invoice dan lakukan pembayaran untuk invoice yang belum dibayar
        </p>
      </div>
      
      {/* Outstanding Invoices */}
      <Card className="border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader>
          <CardTitle>Outstanding Invoice</CardTitle>
          <CardDescription>Invoice yang belum dibayar dan perlu segera dilunasi</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue').length > 0 ? (
            <div className="space-y-4">
              {invoices
                .filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
                .map(invoice => (
                  <Card key={invoice.id} className="border-yellow-200 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <FaFileInvoice className="text-orange-500 mr-2" />
                            <h3 className="font-semibold text-gray-800">{invoice.id}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{invoice.description}</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Jumlah</p>
                            <p className="font-semibold">{formatPrice(invoice.amount)}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Jatuh Tempo</p>
                            <p className="font-semibold">{invoice.dueDate}</p>
                          </div>
                          
                          <div className="text-right md:ml-2">
                            {getStatusBadge(invoice.status)}
                          </div>
                          
                          <Button className="mt-2 md:mt-0 md:ml-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600">
                            Bayar Sekarang
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              <p>Tidak ada outstanding invoice. Semua invoice telah dibayar.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* All Invoices */}
      <Card className="border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Semua Invoice</CardTitle>
              <CardDescription>Daftar lengkap invoice dari transaksi Anda</CardDescription>
            </div>
            
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
              
              <Button variant="outline" size="sm" className="ml-2 text-orange-600 border-orange-200 hover:bg-orange-50">
                <FaDownload className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-orange-50">
                <TableRow>
                  <TableHead className="font-medium">Invoice ID</TableHead>
                  <TableHead className="font-medium">Issue Date</TableHead>
                  <TableHead className="font-medium">Due Date</TableHead>
                  <TableHead className="font-medium">Amount</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-orange-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FaFileInvoice className="mr-2 h-4 w-4 text-orange-500" />
                        {invoice.id}
                      </div>
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{formatPrice(invoice.amount)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FaEye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FaFilePdf className="h-4 w-4 text-gray-500" />
                        </Button>
                        {invoice.status === 'unpaid' && (
                          <Button size="sm" className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600">
                            Bayar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p>No invoices found matching your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
