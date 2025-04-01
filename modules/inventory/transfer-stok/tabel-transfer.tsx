import React, { useState } from 'react';
import { 
  FaEye, FaEdit, FaTrash, FaFilePdf, FaPrint, FaCheckCircle,
  FaTimesCircle, FaTruck, FaExclamationTriangle, FaExchangeAlt,
  FaArrowRight, FaBoxOpen, FaWarehouse
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
import { formatRupiah } from '@/lib/utils';
import FormTransfer from './form-transfer';

// Data sampel transfer stok
const sampleTransfers = [
  {
    id: 'TR1',
    transferNumber: 'TR-202503-001',
    fromBranchId: 'BR001',
    fromBranchName: 'Apotek Pusat - Jakarta',
    toBranchId: 'BR002',
    toBranchName: 'Cabang Bandung',
    requestDate: '2025-03-15',
    approvalDate: '2025-03-16',
    shipmentDate: '2025-03-17',
    receivedDate: null,
    status: 'shipped',
    totalItems: 15,
    totalValue: 4250000,
    notes: 'Pengiriman rutin bulanan',
    createdBy: 'Admin Pusat',
    createdAt: '2025-03-15T09:30:00'
  },
  {
    id: 'TR2',
    transferNumber: 'TR-202503-002',
    fromBranchId: 'BR001',
    fromBranchName: 'Apotek Pusat - Jakarta',
    toBranchId: 'BR003',
    toBranchName: 'Cabang Surabaya',
    requestDate: '2025-03-18',
    approvalDate: '2025-03-19',
    shipmentDate: '2025-03-20',
    receivedDate: '2025-03-25',
    status: 'received',
    totalItems: 20,
    totalValue: 6750000,
    notes: 'Permintaan obat resep',
    createdBy: 'Manager Surabaya',
    createdAt: '2025-03-18T11:15:00'
  },
  {
    id: 'TR3',
    transferNumber: 'TR-202503-003',
    fromBranchId: 'BR002',
    fromBranchName: 'Cabang Bandung',
    toBranchId: 'BR004',
    toBranchName: 'Cabang Medan',
    requestDate: '2025-03-20',
    approvalDate: null,
    shipmentDate: null,
    receivedDate: null,
    status: 'requested',
    totalItems: 8,
    totalValue: 3450000,
    notes: 'Kebutuhan stok mendesak',
    createdBy: 'Manager Medan',
    createdAt: '2025-03-20T14:22:00'
  },
  {
    id: 'TR4',
    transferNumber: 'TR-202503-004',
    fromBranchId: 'BR001',
    fromBranchName: 'Apotek Pusat - Jakarta',
    toBranchId: 'BR004',
    toBranchName: 'Cabang Medan',
    requestDate: '2025-03-22',
    approvalDate: '2025-03-23',
    shipmentDate: null,
    receivedDate: null,
    status: 'approved',
    totalItems: 12,
    totalValue: 5250000,
    notes: 'Permintaan tambahan stok',
    createdBy: 'Admin Pusat',
    createdAt: '2025-03-22T09:18:00'
  },
  {
    id: 'TR5',
    transferNumber: 'TR-202503-005',
    fromBranchId: 'BR003',
    fromBranchName: 'Cabang Surabaya',
    toBranchId: 'BR001',
    toBranchName: 'Apotek Pusat - Jakarta',
    requestDate: '2025-03-25',
    approvalDate: null,
    shipmentDate: null,
    receivedDate: null,
    status: 'rejected',
    totalItems: 5,
    totalValue: 1850000,
    notes: 'Pengembalian stok berlebih',
    createdBy: 'Manager Surabaya',
    createdAt: '2025-03-25T16:05:00'
  },
  {
    id: 'TR6',
    transferNumber: 'TR-202503-006',
    fromBranchId: 'BR001',
    fromBranchName: 'Apotek Pusat - Jakarta',
    toBranchId: 'BR002',
    toBranchName: 'Cabang Bandung',
    requestDate: '2025-03-28',
    approvalDate: '2025-03-28',
    shipmentDate: null,
    receivedDate: null,
    status: 'cancelled',
    totalItems: 10,
    totalValue: 3850000,
    notes: 'Dibatalkan karena kesalahan permintaan',
    createdBy: 'Manager Bandung',
    createdAt: '2025-03-28T10:45:00'
  },
  {
    id: 'TR7',
    transferNumber: 'TR-202503-007',
    fromBranchId: 'BR001',
    fromBranchName: 'Apotek Pusat - Jakarta',
    toBranchId: 'BR004',
    toBranchName: 'Cabang Medan',
    requestDate: '2025-03-30',
    approvalDate: null,
    shipmentDate: null,
    receivedDate: null,
    status: 'requested',
    totalItems: 18,
    totalValue: 7950000,
    notes: 'Permintaan transfer bulanan',
    createdBy: 'Manager Medan',
    createdAt: '2025-03-30T13:10:00'
  }
];

interface TabelTransferProps {
  filterStatus: string;
  filterPeriod: string;
  filterBranchFrom: string;
  filterBranchTo: string;
  searchQuery: string;
}

const TabelTransfer: React.FC<TabelTransferProps> = ({ 
  filterStatus, 
  filterPeriod, 
  filterBranchFrom, 
  filterBranchTo, 
  searchQuery 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewTransferOpen, setIsViewTransferOpen] = useState(false);
  const [isEditTransferOpen, setIsEditTransferOpen] = useState(false);
  const [isDeleteTransferOpen, setIsDeleteTransferOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  
  const itemsPerPage = 10;
  
  // Filter transfer berdasarkan kriteria
  const filteredTransfers = sampleTransfers.filter(transfer => {
    // Filter status
    if (filterStatus !== 'all' && transfer.status !== filterStatus) {
      return false;
    }
    
    // Filter cabang asal
    if (filterBranchFrom !== 'all' && transfer.fromBranchId !== filterBranchFrom) {
      return false;
    }
    
    // Filter cabang tujuan
    if (filterBranchTo !== 'all' && transfer.toBranchId !== filterBranchTo) {
      return false;
    }
    
    // Filter periode (simplified for demo)
    // Untuk implementasi sebenarnya perlu logika date range
    
    // Filter pencarian
    if (
      searchQuery && 
      !transfer.transferNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transfer.fromBranchName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !transfer.toBranchName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Paginasi data
  const totalPages = Math.ceil(filteredTransfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransfers = filteredTransfers.slice(startIndex, startIndex + itemsPerPage);
  
  // Mendapatkan warna badge status
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'requested': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-amber-100 text-amber-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Mendapatkan label status dalam bahasa Indonesia
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'requested': return 'Diminta';
      case 'approved': return 'Disetujui';
      case 'shipped': return 'Dikirim';
      case 'received': return 'Diterima';
      case 'cancelled': return 'Dibatalkan';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };
  
  const handleViewTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsViewTransferOpen(true);
  };
  
  const handleEditTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsEditTransferOpen(true);
  };
  
  const handleDeleteTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsDeleteTransferOpen(true);
  };
  
  const confirmDeleteTransfer = () => {
    console.log('Deleting Transfer:', selectedTransfer?.transferNumber);
    // Di sini akan memanggil API delete
    setIsDeleteTransferOpen(false);
  };
  
  // Render status icon
  const renderStatusIcon = (status: string) => {
    switch(status) {
      case 'requested':
        return <FaExchangeAlt className="text-blue-500" />;
      case 'approved':
        return <FaCheckCircle className="text-purple-500" />;
      case 'shipped':
        return <FaTruck className="text-amber-500" />;
      case 'received':
        return <FaBoxOpen className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-rose-500" />;
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
              <TableHead className="w-[110px]">No. Transfer</TableHead>
              <TableHead>Dari Cabang</TableHead>
              <TableHead>Ke Cabang</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-center">Item</TableHead>
              <TableHead className="text-right">Nilai Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransfers.length > 0 ? (
              paginatedTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FaWarehouse className="mr-2 text-gray-500" size={14} />
                      <span>{transfer.fromBranchName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FaArrowRight className="mr-2 text-blue-500" size={14} />
                      <span>{transfer.toBranchName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{new Date(transfer.requestDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="text-xs text-gray-500">
                        {transfer.shipmentDate 
                          ? `Dikirim: ${new Date(transfer.shipmentDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` 
                          : transfer.approvalDate 
                            ? `Disetujui: ${new Date(transfer.approvalDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}` 
                            : 'Menunggu persetujuan'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {transfer.totalItems} item
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatRupiah(transfer.totalValue)}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusBadgeColor(transfer.status)}>
                      <span className="flex items-center gap-1">
                        {renderStatusIcon(transfer.status)}
                        <span>{getStatusLabel(transfer.status)}</span>
                      </span>
                    </Badge>
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
                          <DropdownMenuLabel>Aksi Transfer</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewTransfer(transfer)}>
                            <FaEye className="mr-2 h-4 w-4" />
                            <span>Lihat Detail</span>
                          </DropdownMenuItem>
                          {transfer.status === 'requested' && (
                            <DropdownMenuItem onClick={() => handleEditTransfer(transfer)}>
                              <FaEdit className="mr-2 h-4 w-4" />
                              <span>Edit Transfer</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <FaFilePdf className="mr-2 h-4 w-4" />
                            <span>Download PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FaPrint className="mr-2 h-4 w-4" />
                            <span>Cetak Surat Jalan</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {transfer.status === 'requested' && (
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTransfer(transfer)}
                              className="text-red-600"
                            >
                              <FaTrash className="mr-2 h-4 w-4" />
                              <span>Hapus Transfer</span>
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
                <TableCell colSpan={8} className="h-24 text-center">
                  Tidak ada data transfer stok yang sesuai dengan filter
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {filteredTransfers.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-gray-500">
            Menampilkan {Math.min(startIndex + 1, filteredTransfers.length)} - {Math.min(startIndex + itemsPerPage, filteredTransfers.length)} dari {filteredTransfers.length} transfer stok
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
      
      {/* Dialog untuk melihat detail transfer */}
      <Dialog open={isViewTransferOpen} onOpenChange={setIsViewTransferOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Detail Transfer: {selectedTransfer?.transferNumber}</span>
              <Badge className={selectedTransfer?.status ? getStatusBadgeColor(selectedTransfer.status) : ''}>
                {selectedTransfer?.status ? getStatusLabel(selectedTransfer.status) : ''}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Dibuat oleh {selectedTransfer?.createdBy} pada {selectedTransfer ? new Date(selectedTransfer.createdAt).toLocaleString('id-ID') : ''}
            </DialogDescription>
          </DialogHeader>
          
          {/* Detail transfer akan ditampilkan di sini */}
          <div className="py-4">
            <p className="text-center text-gray-500">Preview detail transfer akan ditampilkan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewTransferOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog untuk edit transfer */}
      <Dialog open={isEditTransferOpen} onOpenChange={setIsEditTransferOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Transfer: {selectedTransfer?.transferNumber}</DialogTitle>
            <DialogDescription>
              Lakukan perubahan pada transfer stok
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransfer && (
            <FormTransfer 
              onClose={() => setIsEditTransferOpen(false)} 
              existingTransfer={selectedTransfer}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog konfirmasi hapus transfer */}
      <Dialog open={isDeleteTransferOpen} onOpenChange={setIsDeleteTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Transfer</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus transfer {selectedTransfer?.transferNumber}?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteTransferOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTransfer}>
              Hapus Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TabelTransfer;
