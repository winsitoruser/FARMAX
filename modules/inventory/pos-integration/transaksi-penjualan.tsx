import React, { useState } from 'react';
import { 
  FaShoppingCart, FaSearch, FaSort, FaSortUp, FaSortDown, 
  FaEye, FaFileExport, FaUser, FaListAlt, FaCaretRight
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Data sampel transaksi penjualan
const sampleSalesTransactions = [
  {
    id: 'TX001',
    invoiceNumber: 'INV/2025/03/001',
    transactionDate: '2025-03-30T10:15:00',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    cashierId: 'C001',
    cashierName: 'Andi Wijaya',
    customerName: 'Umum',
    paymentMethod: 'Cash',
    totalItems: 3,
    totalQuantity: 5,
    subtotal: 175000,
    discount: 0,
    tax: 0,
    total: 175000,
    status: 'completed',
    items: [
      {
        productId: 'P001',
        productName: 'Paracetamol 500mg',
        category: 'Obat Bebas',
        quantity: 2,
        unitPrice: 25000,
        discount: 0,
        total: 50000,
        stockBefore: 852,
        stockAfter: 850
      },
      {
        productId: 'P006',
        productName: 'Amoxicillin 500mg',
        category: 'Obat Keras',
        quantity: 1,
        unitPrice: 75000,
        discount: 0,
        total: 75000,
        stockBefore: 481,
        stockAfter: 480
      },
      {
        productId: 'P010',
        productName: 'Vitamin C 1000mg',
        category: 'Vitamin dan Suplemen',
        quantity: 2,
        unitPrice: 25000,
        discount: 0,
        total: 50000,
        stockBefore: 1202,
        stockAfter: 1200
      }
    ]
  },
  {
    id: 'TX002',
    invoiceNumber: 'INV/2025/03/002',
    transactionDate: '2025-03-30T11:20:00',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    cashierId: 'C002',
    cashierName: 'Sinta Dewi',
    customerName: 'Budi Santoso',
    paymentMethod: 'Debit Card',
    totalItems: 2,
    totalQuantity: 4,
    subtotal: 320000,
    discount: 0,
    tax: 0,
    total: 320000,
    status: 'completed',
    items: [
      {
        productId: 'P006',
        productName: 'Amoxicillin 500mg',
        category: 'Obat Keras',
        quantity: 2,
        unitPrice: 75000,
        discount: 0,
        total: 150000,
        stockBefore: 480,
        stockAfter: 478
      },
      {
        productId: 'P011',
        productName: 'Vitamin B Complex',
        category: 'Vitamin dan Suplemen',
        quantity: 2,
        unitPrice: 85000,
        discount: 0,
        total: 170000,
        stockBefore: 852,
        stockAfter: 850
      }
    ]
  },
  {
    id: 'TX003',
    invoiceNumber: 'INV/2025/03/003',
    transactionDate: '2025-03-30T13:45:00',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    cashierId: 'C005',
    cashierName: 'Rudi Setiawan',
    customerName: 'Umum',
    paymentMethod: 'Cash',
    totalItems: 1,
    totalQuantity: 1,
    subtotal: 40000,
    discount: 0,
    tax: 0,
    total: 40000,
    status: 'completed',
    items: [
      {
        productId: 'P007',
        productName: 'Ciprofloxacin 500mg',
        category: 'Obat Keras',
        quantity: 1,
        unitPrice: 40000,
        discount: 0,
        total: 40000,
        stockBefore: 151,
        stockAfter: 150
      }
    ]
  },
  {
    id: 'TX004',
    invoiceNumber: 'INV/2025/03/004',
    transactionDate: '2025-03-30T14:30:00',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    cashierId: 'C008',
    cashierName: 'Diana Putri',
    customerName: 'Hendra Kusuma',
    paymentMethod: 'Credit Card',
    totalItems: 4,
    totalQuantity: 8,
    subtotal: 480000,
    discount: 25000,
    tax: 0,
    total: 455000,
    status: 'completed',
    items: [
      {
        productId: 'P003',
        productName: 'Antasida Tablet',
        category: 'Obat Bebas',
        quantity: 2,
        unitPrice: 10000,
        discount: 0,
        total: 20000,
        stockBefore: 322,
        stockAfter: 320
      },
      {
        productId: 'P008',
        productName: 'Cefixime 100mg',
        category: 'Antibiotik',
        quantity: 1,
        unitPrice: 45000,
        discount: 0,
        total: 45000,
        stockBefore: 26,
        stockAfter: 25
      },
      {
        productId: 'P011',
        productName: 'Vitamin B Complex',
        category: 'Vitamin dan Suplemen',
        quantity: 3,
        unitPrice: 85000,
        discount: 25000,
        total: 230000,
        stockBefore: 850,
        stockAfter: 847
      },
      {
        productId: 'P012',
        productName: 'Masker Medis',
        category: 'Alat Kesehatan',
        quantity: 2,
        unitPrice: 80000,
        discount: 0,
        total: 160000,
        stockBefore: 2502,
        stockAfter: 2500
      }
    ]
  },
  {
    id: 'TX005',
    invoiceNumber: 'INV/2025/03/005',
    transactionDate: '2025-03-30T15:10:00',
    branchId: 'BR004',
    branchName: 'Cabang Medan',
    cashierId: 'C012',
    cashierName: 'Maya Susanti',
    customerName: 'Umum',
    paymentMethod: 'Cash',
    totalItems: 3,
    totalQuantity: 3,
    subtotal: 180000,
    discount: 0,
    tax: 0,
    total: 180000,
    status: 'completed',
    items: [
      {
        productId: 'P005',
        productName: 'Pseudoephedrine 30mg',
        category: 'Obat Bebas Terbatas',
        quantity: 1,
        unitPrice: 25000,
        discount: 0,
        total: 25000,
        stockBefore: 181,
        stockAfter: 180
      },
      {
        productId: 'P009',
        productName: 'Ceftriaxone 1g Inj',
        category: 'Antibiotik',
        quantity: 1,
        unitPrice: 120000,
        discount: 0,
        total: 120000,
        stockBefore: 61,
        stockAfter: 60
      },
      {
        productId: 'P013',
        productName: 'Hand Sanitizer 500ml',
        category: 'Alat Kesehatan',
        quantity: 1,
        unitPrice: 35000,
        discount: 0,
        total: 35000,
        stockBefore: 16,
        stockAfter: 15
      }
    ]
  }
];

interface TransaksiPenjualanProps {
  startDate?: Date;
  endDate?: Date;
  filterCabang: string;
}

const TransaksiPenjualan: React.FC<TransaksiPenjualanProps> = ({
  startDate,
  endDate,
  filterCabang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  const itemsPerPage = 10;
  
  // Filter transaksi
  const filteredTransactions = sampleSalesTransactions.filter(transaction => {
    // Filter berdasarkan cabang
    if (filterCabang !== 'all' && transaction.branchId !== filterCabang) {
      return false;
    }
    
    // Filter berdasarkan rentang tanggal
    if (startDate && endDate) {
      const transactionDate = new Date(transaction.transactionDate);
      if (transactionDate < startDate || transactionDate > endDate) {
        return false;
      }
    }
    
    // Filter berdasarkan pencarian
    if (
      searchQuery && 
      !transaction.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transaction.cashierName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Sorting
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime()
        : new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime();
    } else if (sortBy === 'invoice') {
      return sortOrder === 'asc'
        ? a.invoiceNumber.localeCompare(b.invoiceNumber)
        : b.invoiceNumber.localeCompare(a.invoiceNumber);
    } else if (sortBy === 'total') {
      return sortOrder === 'asc'
        ? a.total - b.total
        : b.total - a.total;
    } else if (sortBy === 'items') {
      return sortOrder === 'asc'
        ? a.totalItems - b.totalItems
        : b.totalItems - a.totalItems;
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handler Sort
  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // Helper untuk mendapatkan ikon sort
  const getSortIcon = (column: string) => {
    if (column !== sortBy) return <FaSort size={14} className="text-gray-300" />;
    return sortOrder === 'asc' ? <FaSortUp size={14} /> : <FaSortDown size={14} />;
  };
  
  // Handler lihat detail transaksi
  const handleViewDetail = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaShoppingCart className="text-orange-500" />
              <span>Transaksi Penjualan</span>
            </div>
            <Button variant="outline" size="sm">
              <FaFileExport className="mr-2 h-4 w-4" />
              <span>Export</span>
            </Button>
          </CardTitle>
          <CardDescription>
            {startDate && endDate && (
              <>Periode: {format(startDate, 'dd MMM yyyy', { locale: id })} - {format(endDate, 'dd MMM yyyy', { locale: id })}</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <Input
              placeholder="Cari transaksi berdasarkan invoice, pelanggan, atau kasir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm"
              icon={<FaSearch className="text-gray-400" />}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('invoice')}
                  >
                    <div className="flex items-center gap-1">
                      No. Invoice
                      {getSortIcon('invoice')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Tanggal & Waktu
                      {getSortIcon('date')}
                    </div>
                  </TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Pelanggan & Kasir</TableHead>
                  <TableHead 
                    className="cursor-pointer text-center"
                    onClick={() => handleSort('items')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Items
                      {getSortIcon('items')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Total
                      {getSortIcon('total')}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.invoiceNumber}</TableCell>
                      <TableCell>
                        {format(new Date(transaction.transactionDate), 'dd MMM yyyy', { locale: id })}
                        <div className="text-xs text-gray-500">
                          {format(new Date(transaction.transactionDate), 'HH:mm', { locale: id })}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.branchName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{transaction.customerName}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaUser size={10} />
                            {transaction.cashierName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div>{transaction.totalItems} produk</div>
                        <div className="text-xs text-gray-500">{transaction.totalQuantity} unit</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(transaction.total)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleViewDetail(transaction)}
                          >
                            <FaEye size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada transaksi yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4 px-4">
              <div className="text-sm text-gray-500">
                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTransactions.length)} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog detail transaksi */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Transaksi: {selectedTransaction?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              {selectedTransaction && (
                <>
                  Tanggal: {format(new Date(selectedTransaction.transactionDate), 'dd MMMM yyyy, HH:mm', { locale: id })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informasi Transaksi</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Cabang</span>
                      <span className="text-sm font-medium">{selectedTransaction.branchName}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Kasir</span>
                      <span className="text-sm font-medium">{selectedTransaction.cashierName}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Pelanggan</span>
                      <span className="text-sm font-medium">{selectedTransaction.customerName}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Metode Pembayaran</span>
                      <span className="text-sm font-medium">{selectedTransaction.paymentMethod}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Ringkasan Produk</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Jumlah Produk</span>
                      <span className="text-sm font-medium">{selectedTransaction.totalItems} produk</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Total Kuantitas</span>
                      <span className="text-sm font-medium">{selectedTransaction.totalQuantity} unit</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="text-sm">
                        <Badge className="bg-green-100 text-green-800">
                          {selectedTransaction.status === 'completed' ? 'Selesai' : selectedTransaction.status}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Informasi Pembayaran</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <span className="text-sm font-medium">{formatRupiah(selectedTransaction.subtotal)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Diskon</span>
                      <span className="text-sm font-medium">{formatRupiah(selectedTransaction.discount)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Pajak</span>
                      <span className="text-sm font-medium">{formatRupiah(selectedTransaction.tax)}</span>
                    </div>
                    <div className="grid grid-cols-2 pt-1 border-t">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-bold">{formatRupiah(selectedTransaction.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Daftar Produk</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-center">Kuantitas</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="text-right">Diskon</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Perubahan Stok</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTransaction.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatRupiah(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatRupiah(item.discount)}</TableCell>
                          <TableCell className="text-right font-medium">{formatRupiah(item.total)}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-700">
                              <span>{item.stockBefore}</span>
                              <FaCaretRight className="text-orange-500" />
                              <span>{item.stockAfter}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Tutup
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <FaListAlt className="h-4 w-4" />
              <span>Cetak Invoice</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransaksiPenjualan;
