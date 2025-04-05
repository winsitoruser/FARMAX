import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FaFileInvoice, FaDownload, FaCreditCard, FaSearch, FaEllipsisV } from 'react-icons/fa';

// Sample payment history data
const paymentHistory = [
  {
    id: 'INV-20251004-001',
    date: '04 Apr 2025',
    amount: 499000,
    status: 'paid',
    method: 'Credit Card',
    type: 'Subscription',
    description: 'Premium Plan - April 2025',
  },
  {
    id: 'INV-20250304-001',
    date: '04 Mar 2025',
    amount: 499000,
    status: 'paid',
    method: 'Credit Card',
    type: 'Subscription',
    description: 'Premium Plan - March 2025',
  },
  {
    id: 'INV-20250204-001',
    date: '04 Feb 2025',
    amount: 499000,
    status: 'paid',
    method: 'Credit Card',
    type: 'Subscription',
    description: 'Premium Plan - February 2025',
  },
  {
    id: 'INV-20250104-001',
    date: '04 Jan 2025',
    amount: 499000,
    status: 'paid',
    method: 'Bank Transfer',
    type: 'Subscription',
    description: 'Premium Plan - January 2025',
  },
  {
    id: 'INV-20241204-001',
    date: '04 Dec 2024',
    amount: 499000,
    status: 'paid',
    method: 'Bank Transfer',
    type: 'Subscription',
    description: 'Premium Plan - December 2024',
  },
  {
    id: 'INV-20241104-001',
    date: '04 Nov 2024',
    amount: 250000,
    status: 'paid',
    method: 'Bank Transfer',
    type: 'Subscription',
    description: 'Basic Plan - November 2024',
  },
  {
    id: 'INV-20241025-001',
    date: '25 Oct 2024',
    amount: 249000,
    status: 'paid',
    method: 'Credit Card',
    type: 'Upgrade',
    description: 'Plan Upgrade: Basic to Premium',
  },
  {
    id: 'INV-20241004-001',
    date: '04 Oct 2024',
    amount: 250000,
    status: 'paid',
    method: 'Credit Card',
    type: 'Subscription',
    description: 'Basic Plan - October 2024',
  },
];

export function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  
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
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  // Filter the payment history based on search term and filters
  const filteredHistory = paymentHistory.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesType = filterType === 'all' || payment.type.toLowerCase() === filterType.toLowerCase();
    
    // We would add date range filtering logic here
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
        <p className="text-gray-600 mt-1">
          Riwayat semua transaksi pembayaran subscription dan layanan tambahan
        </p>
      </div>
      
      {/* Filters */}
      <Card className="overflow-hidden border-orange-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Transaksi</CardTitle>
          <CardDescription>Cari dan filter riwayat pembayaran berdasarkan kriteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Invoice ID or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="addon">Add-on</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="last180">Last 6 Months</SelectItem>
                  <SelectItem value="lastyear">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment History Table */}
      <Card className="overflow-hidden border-orange-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Riwayat Pembayaran</CardTitle>
            <Button size="sm" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
              <FaDownload className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-orange-50">
                <TableRow>
                  <TableHead className="font-medium">Invoice ID</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Amount</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Payment Method</TableHead>
                  <TableHead className="font-medium">Description</TableHead>
                  <TableHead className="font-medium w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-orange-50/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FaFileInvoice className="mr-2 h-4 w-4 text-orange-500" />
                        {payment.id}
                      </div>
                    </TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{formatPrice(payment.amount)}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FaCreditCard className="mr-2 h-4 w-4 text-gray-500" />
                        {payment.method}
                      </div>
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <FaEllipsisV className="h-3.5 w-3.5" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Invoice</DropdownMenuItem>
                          <DropdownMenuItem>Download PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredHistory.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p>No payment records found matching your filters.</p>
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>Showing {filteredHistory.length} of {paymentHistory.length} records</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
