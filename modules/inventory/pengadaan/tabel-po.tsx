import React, { useState } from 'react';
import { 
  FaEye, FaEdit, FaTrash, FaFilePdf, FaPrint, FaCheckCircle,
  FaTimesCircle, FaTruck, FaExclamationTriangle
} from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatRupiah } from '@/lib/utils';
import FormPO from './form-po';

// Data sampel PO
const samplePOs = [
  {
    id: 'PO1',
    poNumber: 'PO-202503-001',
    supplierId: 'S001',
    supplierName: 'PT Kimia Farma',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    orderDate: '2025-03-15',
    expectedDeliveryDate: '2025-03-22',
    totalAmount: 15250000,
    status: 'completed',
    paymentStatus: 'paid',
    totalItems: 24,
    receivedItems: 24,
    createdBy: 'Admin Pusat',
    createdAt: '2025-03-15T09:30:00'
  },
  {
    id: 'PO2',
    poNumber: 'PO-202503-002',
    supplierId: 'S002',
    supplierName: 'PT Kalbe Farma',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    orderDate: '2025-03-18',
    expectedDeliveryDate: '2025-03-28',
    totalAmount: 8750000,
    status: 'confirmed',
    paymentStatus: 'unpaid',
    totalItems: 15,
    receivedItems: 0,
    createdBy: 'Manager Bandung',
    createdAt: '2025-03-18T11:15:00'
  },
  {
    id: 'PO3',
    poNumber: 'PO-202503-003',
    supplierId: 'S003',
    supplierName: 'PT Dexa Medica',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    orderDate: '2025-03-20',
    expectedDeliveryDate: '2025-03-27',
    totalAmount: 12350000,
    status: 'partial',
    paymentStatus: 'partial',
    totalItems: 18,
    receivedItems: 12,
    createdBy: 'Manager Surabaya',
    createdAt: '2025-03-20T14:22:00'
  },
  {
    id: 'PO4',
    poNumber: 'PO-202503-004',
    supplierId: 'S004',
    supplierName: 'PT Tempo Scan Pacific',
    branchId: 'BR004',
    branchName: 'Cabang Medan',
    orderDate: '2025-03-25',
    expectedDeliveryDate: '2025-04-02',
    totalAmount: 6250000,
    status: 'sent',
    paymentStatus: 'unpaid',
    totalItems: 10,
    receivedItems: 0,
    createdBy: 'Manager Medan',
    createdAt: '2025-03-25T09:18:00'
  },
  {
    id: 'PO5',
    poNumber: 'PO-202503-005',
    supplierId: 'S005',
    supplierName: 'PT Phapros',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    orderDate: '2025-03-28',
    expectedDeliveryDate: '2025-04-10',
    totalAmount: 22750000,
    status: 'draft',
    paymentStatus: 'unpaid',
    totalItems: 30,
    receivedItems: 0,
    createdBy: 'Admin Pusat',
    createdAt: '2025-03-28T16:05:00'
  },
  {
    id: 'PO6',
    poNumber: 'PO-202503-006',
    supplierId: 'S001',
    supplierName: 'PT Kimia Farma',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    orderDate: '2025-03-29',
    expectedDeliveryDate: '2025-04-05',
    totalAmount: 9850000,
    status: 'cancelled',
    paymentStatus: 'unpaid',
    totalItems: 16,
    receivedItems: 0,
    createdBy: 'Manager Bandung',
    createdAt: '2025-03-29T10:45:00'
  },
  {
    id: 'PO7',
    poNumber: 'PO-202503-007',
    supplierId: 'S002',
    supplierName: 'PT Kalbe Farma',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    orderDate: '2025-03-30',
    expectedDeliveryDate: '2025-04-10',
    totalAmount: 18950000,
    status: 'draft',
    paymentStatus: 'unpaid',
    totalItems: 26,
    receivedItems: 0,
    createdBy: 'Admin Pusat',
    createdAt: '2025-03-30T13:10:00'
  }
];

interface TabelPOProps {
  filterStatus: string;
  filterPeriod: string;
  filterSupplier: string;
  filterBranch: string;
  searchQuery: string;
}

const TabelPO: React.FC<TabelPOProps> = ({ 
  filterStatus, 
  filterPeriod, 
  filterSupplier, 
  filterBranch, 
  searchQuery 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewPOOpen, setIsViewPOOpen] = useState(false);
  const [isEditPOOpen, setIsEditPOOpen] = useState(false);
  const [isDeletePOOpen, setIsDeletePOOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  
  const itemsPerPage = 10;
  
  // Filter PO berdasarkan kriteria
  const filteredPOs = samplePOs.filter(po => {
    // Filter status
    if (filterStatus !== 'all' && po.status !== filterStatus) {
      return false;
    }
    
    // Filter supplier
    if (filterSupplier !== 'all' && po.supplierId !== filterSupplier) {
      return false;
    }
    
    // Filter cabang
    if (filterBranch !== 'all' && po.branchId !== filterBranch) {
      return false;
    }
    
    // Filter periode (simplified for demo)
    // Untuk implementasi sebenarnya perlu logika date range
    
    // Filter pencarian
    if (
      searchQuery && 
      !po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !po.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Paginasi data
  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPOs = filteredPOs.slice(startIndex, startIndex + itemsPerPage);
  
  // Mendapatkan warna badge status
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'partial': return 'bg-amber-100 text-amber-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Mendapatkan warna badge pembayaran
  const getPaymentStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-amber-100 text-amber-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Mendapatkan label status dalam bahasa Indonesia
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'sent': return 'Terkirim';
      case 'confirmed': return 'Dikonfirmasi';
      case 'partial': return 'Sebagian Diterima';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };
  
  // Mendapatkan label status pembayaran dalam bahasa Indonesia
  const getPaymentStatusLabel = (status: string): string => {
    switch (status) {
      case 'paid': return 'Lunas';
      case 'partial': return 'Sebagian';
      case 'unpaid': return 'Belum Dibayar';
      default: return status;
    }
  };
  
  const handleViewPO = (po: any) => {
    setSelectedPO(po);
    setIsViewPOOpen(true);
  };
  
  const handleEditPO = (po: any) => {
    setSelectedPO(po);
    setIsEditPOOpen(true);
  };
  
  const handleDeletePO = (po: any) => {
    setSelectedPO(po);
    setIsDeletePOOpen(true);
  };
  
  const confirmDeletePO = () => {
    console.log('Deleting PO:', selectedPO?.poNumber);
    // Di sini akan memanggil API delete
    setIsDeletePOOpen(false);
  };
  
  // Render status icon
  const renderStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'confirmed':
        return <FaCheckCircle className="text-purple-500" />;
      case 'partial':
        return <FaTruck className="text-amber-500" />;
      case 'sent':
        return <FaTruck className="text-blue-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'draft':
      default:
        return <FaExclamationTriangle className="text-gray-500" />;
    }
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No. PO</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Cabang</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Pembayaran</TableHead>
              <TableHead className="text-center">Item</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPOs.length > 0 ? (
              paginatedPOs.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.poNumber}</TableCell>
                  <TableCell>{po.supplierName}</TableCell>
                  <TableCell>{po.branchName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{new Date(po.orderDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="text-xs text-gray-500">Estimasi: {new Date(po.expectedDeliveryDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatRupiah(po.totalAmount)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge className={getStatusBadgeColor(po.status)}>
                        <span className="flex items-center gap-1">
                          {renderStatusIcon(po.status)}
                          <span>{getStatusLabel(po.status)}</span>
                        </span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getPaymentStatusBadgeColor(po.paymentStatus)}>
                      {getPaymentStatusLabel(po.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col">
                      <span>{po.receivedItems}/{po.totalItems}</span>
                      <span className="text-xs text-gray-500">
                        {Math.round((po.receivedItems / po.totalItems) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FaEye size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi PO</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewPO(po)}>
                            <FaEye className="mr-2 h-4 w-4" />
                            <span>Lihat Detail</span>
                          </DropdownMenuItem>
                          {po.status === 'draft' && (
                            <DropdownMenuItem onClick={() => handleEditPO(po)}>
                              <FaEdit className="mr-2 h-4 w-4" />
                              <span>Edit PO</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FaFilePdf className="mr-2 h-4 w-4" />
                            <span>Download PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FaPrint className="mr-2 h-4 w-4" />
                            <span>Cetak PO</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {po.status === 'draft' && (
                            <DropdownMenuItem 
                              onClick={() => handleDeletePO(po)}
                              className="text-red-600"
                            >
                              <FaTrash className="mr-2 h-4 w-4" />
                              <span>Hapus PO</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Tidak ada data purchase order yang sesuai dengan filter
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredPOs.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-gray-500">
            Menampilkan {Math.min(startIndex + 1, filteredPOs.length)} - {Math.min(startIndex + itemsPerPage, filteredPOs.length)} dari {filteredPOs.length} purchase order
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
                // Logic untuk halaman yang ditampilkan (simpel)
                // Untuk implementasi yang lebih kompleks bisa gunakan logika window
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
      
      {/* Dialog untuk melihat detail PO */}
      <Dialog open={isViewPOOpen} onOpenChange={setIsViewPOOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Detail Purchase Order: {selectedPO?.poNumber}</span>
              <Badge className={selectedPO?.status ? getStatusBadgeColor(selectedPO.status) : ''}>
                {selectedPO?.status ? getStatusLabel(selectedPO.status) : ''}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Dibuat oleh {selectedPO?.createdBy} pada {selectedPO ? new Date(selectedPO.createdAt).toLocaleString('id-ID') : ''}
            </DialogDescription>
          </DialogHeader>
          
          {/* Detail PO akan ditampilkan di sini */}
          <div className="py-4">
            <p className="text-center text-gray-500">Preview detail PO akan ditampilkan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPOOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog untuk edit PO */}
      <Dialog open={isEditPOOpen} onOpenChange={setIsEditPOOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order: {selectedPO?.poNumber}</DialogTitle>
            <DialogDescription>
              Lakukan perubahan pada purchase order
            </DialogDescription>
          </DialogHeader>
          
          {selectedPO && (
            <FormPO 
              onClose={() => setIsEditPOOpen(false)} 
              existingPO={selectedPO}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog konfirmasi hapus PO */}
      <Dialog open={isDeletePOOpen} onOpenChange={setIsDeletePOOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus PO</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus purchase order {selectedPO?.poNumber}?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletePOOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeletePO}>
              Hapus PO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TabelPO;
