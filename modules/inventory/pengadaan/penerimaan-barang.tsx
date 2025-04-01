import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaPlus, FaDownload, FaPrint, FaEye, 
  FaCheckCircle, FaTimesCircle, FaBoxOpen
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatRupiah } from '@/lib/utils';

// Data sampel penerimaan barang
const sampleReceipts = [
  {
    id: 'GR1',
    receiptNumber: 'GR-202503-001',
    poNumber: 'PO-202503-001',
    supplierId: 'S001',
    supplierName: 'PT Kimia Farma',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    receiveDate: '2025-03-20',
    invoiceNumber: 'INV-KF-25032501',
    invoiceDate: '2025-03-20',
    totalAmount: 15250000,
    status: 'completed',
    totalItems: 24,
    receivedBy: 'Admin Gudang',
    createdAt: '2025-03-20T10:15:00'
  },
  {
    id: 'GR2',
    receiptNumber: 'GR-202503-002',
    poNumber: 'PO-202503-003',
    supplierId: 'S003',
    supplierName: 'PT Dexa Medica',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    receiveDate: '2025-03-25',
    invoiceNumber: 'INV-DM-25032502',
    invoiceDate: '2025-03-25',
    totalAmount: 8250000,
    status: 'partial',
    totalItems: 12,
    receivedBy: 'Manager Surabaya',
    createdAt: '2025-03-25T14:30:00'
  },
  {
    id: 'GR3',
    receiptNumber: 'GR-202503-003',
    poNumber: null,
    supplierId: 'S002',
    supplierName: 'PT Kalbe Farma',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    receiveDate: '2025-03-28',
    invoiceNumber: 'INV-KL-25032801',
    invoiceDate: '2025-03-28',
    totalAmount: 3450000,
    status: 'completed',
    totalItems: 5,
    receivedBy: 'Admin Gudang',
    createdAt: '2025-03-28T11:45:00'
  },
  {
    id: 'GR4',
    receiptNumber: 'GR-202503-004',
    poNumber: null,
    supplierId: 'S005',
    supplierName: 'PT Phapros',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    receiveDate: '2025-03-29',
    invoiceNumber: 'INV-PP-25032901',
    invoiceDate: '2025-03-29',
    totalAmount: 5750000,
    status: 'draft',
    totalItems: 8,
    receivedBy: 'Manager Bandung',
    createdAt: '2025-03-29T09:20:00'
  }
];

// Filter options
const statusFilter = [
  { value: 'all', label: 'Semua Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'partial', label: 'Sebagian Diterima' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const supplierFilter = [
  { value: 'all', label: 'Semua Supplier' },
  { value: 'S001', label: 'PT Kimia Farma' },
  { value: 'S002', label: 'PT Kalbe Farma' },
  { value: 'S003', label: 'PT Dexa Medica' },
  { value: 'S004', label: 'PT Tempo Scan Pacific' },
  { value: 'S005', label: 'PT Phapros' },
];

const branchFilter = [
  { value: 'all', label: 'Semua Cabang' },
  { value: 'BR001', label: 'Apotek Pusat - Jakarta' },
  { value: 'BR002', label: 'Cabang Bandung' },
  { value: 'BR003', label: 'Cabang Surabaya' },
  { value: 'BR004', label: 'Cabang Medan' },
];

const PenerimaanBarang: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormReceiptOpen, setIsFormReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isViewReceiptOpen, setIsViewReceiptOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Filter data penerimaan barang
  const filteredReceipts = sampleReceipts.filter(receipt => {
    // Filter status
    if (filterStatus !== 'all' && receipt.status !== filterStatus) {
      return false;
    }
    
    // Filter supplier
    if (filterSupplier !== 'all' && receipt.supplierId !== filterSupplier) {
      return false;
    }
    
    // Filter cabang
    if (filterBranch !== 'all' && receipt.branchId !== filterBranch) {
      return false;
    }
    
    // Filter pencarian
    if (
      searchQuery && 
      !receipt.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !receipt.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(receipt.poNumber && receipt.poNumber.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    
    return true;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReceipts = filteredReceipts.slice(startIndex, startIndex + itemsPerPage);
  
  // Mendapatkan warna badge status
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'partial': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Mendapatkan label status dalam bahasa Indonesia
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'partial': return 'Sebagian';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };
  
  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsViewReceiptOpen(true);
  };
  
  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Penerimaan Barang</CardTitle>
            <Button onClick={() => setIsFormReceiptOpen(true)}>
              <FaPlus className="mr-2 h-4 w-4" />
              <span>Terima Barang Baru</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="Cari No. Penerimaan, PO, Supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<FaSearch className="text-gray-400" />}
              />
            </div>
            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilter.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterSupplier} onValueChange={setFilterSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {supplierFilter.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Cabang" />
                </SelectTrigger>
                <SelectContent>
                  {branchFilter.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => {
              setFilterStatus('all');
              setFilterSupplier('all');
              setFilterBranch('all');
              setSearchQuery('');
            }}>
              <FaFilter className="mr-2 h-4 w-4" />
              <span>Reset Filter</span>
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FaDownload className="mr-2 h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button variant="outline" size="sm">
                <FaPrint className="mr-2 h-4 w-4" />
                <span>Print</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">No. Penerimaan</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Referensi PO</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReceipts.length > 0 ? (
                  paginatedReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.receiptNumber}</TableCell>
                      <TableCell>{receipt.supplierName}</TableCell>
                      <TableCell>{receipt.branchName}</TableCell>
                      <TableCell>
                        {receipt.poNumber ? (
                          receipt.poNumber
                        ) : (
                          <span className="text-gray-500 text-sm">Tanpa PO</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{new Date(receipt.receiveDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="text-xs text-gray-500">Faktur: {receipt.invoiceNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatRupiah(receipt.totalAmount)}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusBadgeColor(receipt.status)}>
                          {getStatusLabel(receipt.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewReceipt(receipt)}
                          >
                            <FaEye size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Tidak ada data penerimaan barang yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredReceipts.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {Math.min(startIndex + 1, filteredReceipts.length)} - {Math.min(startIndex + itemsPerPage, filteredReceipts.length)} dari {filteredReceipts.length} penerimaan barang
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageToShow = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageToShow = currentPage - 3 + i;
                      if (pageToShow > totalPages) {
                        pageToShow = totalPages - (4 - i);
                      }
                    }
                    
                    if (pageToShow > 0 && pageToShow <= totalPages) {
                      return (
                        <PaginationItem key={pageToShow}>
                          <PaginationLink
                            isActive={currentPage === pageToShow}
                            onClick={() => setCurrentPage(pageToShow)}
                          >
                            {pageToShow}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {totalPages > 5 && currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog untuk melihat detail penerimaan */}
      <Dialog open={isViewReceiptOpen} onOpenChange={setIsViewReceiptOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Detail Penerimaan: {selectedReceipt?.receiptNumber}</span>
              <Badge className={selectedReceipt?.status ? getStatusBadgeColor(selectedReceipt.status) : ''}>
                {selectedReceipt?.status ? getStatusLabel(selectedReceipt.status) : ''}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Diterima oleh {selectedReceipt?.receivedBy} pada {selectedReceipt ? new Date(selectedReceipt.receiveDate).toLocaleDateString('id-ID') : ''}
            </DialogDescription>
          </DialogHeader>
          
          {/* Detail penerimaan barang akan ditampilkan di sini */}
          <div className="py-4">
            <p className="text-center text-gray-500">Preview detail penerimaan barang akan ditampilkan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewReceiptOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog form penerimaan barang baru */}
      <Dialog open={isFormReceiptOpen} onOpenChange={setIsFormReceiptOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Formulir Penerimaan Barang Baru</DialogTitle>
            <DialogDescription>
              Pilih PO atau lakukan penerimaan barang tanpa PO
            </DialogDescription>
          </DialogHeader>
          
          {/* Form penerimaan barang akan diimplementasikan */}
          <div className="py-4">
            <p className="text-center text-gray-500">Formulir penerimaan barang akan diimplementasikan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormReceiptOpen(false)}>
              Batal
            </Button>
            <Button>
              <FaCheckCircle className="mr-2 h-4 w-4" />
              Simpan Penerimaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PenerimaanBarang;
