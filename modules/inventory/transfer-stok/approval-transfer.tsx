import React, { useState } from 'react';
import { 
  FaSearch, FaCheckCircle, FaTimesCircle, FaEye, 
  FaExchangeAlt, FaArrowRight, FaUserCheck, FaFilter
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
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatRupiah } from '@/lib/utils';

// Data sampel transfer yang menunggu persetujuan
const pendingApprovals = [
  {
    id: 'TR3',
    transferNumber: 'TR-202503-003',
    fromBranchId: 'BR002',
    fromBranchName: 'Cabang Bandung',
    toBranchId: 'BR004',
    toBranchName: 'Cabang Medan',
    requestDate: '2025-03-20',
    requestedBy: 'Manager Medan',
    createdAt: '2025-03-20T14:22:00',
    totalItems: 8,
    totalValue: 3450000,
    notes: 'Kebutuhan stok mendesak',
    priority: 'high',
    waitingDays: 10
  },
  {
    id: 'TR7',
    transferNumber: 'TR-202503-007',
    fromBranchId: 'BR001',
    fromBranchName: 'Apotek Pusat - Jakarta',
    toBranchId: 'BR004',
    toBranchName: 'Cabang Medan',
    requestDate: '2025-03-30',
    requestedBy: 'Manager Medan',
    createdAt: '2025-03-30T13:10:00',
    totalItems: 18,
    totalValue: 7950000,
    notes: 'Permintaan transfer bulanan',
    priority: 'medium',
    waitingDays: 0
  },
  {
    id: 'TR8',
    transferNumber: 'TR-202503-008',
    fromBranchId: 'BR001',
    fromBranchName: 'Apotek Pusat - Jakarta',
    toBranchId: 'BR003',
    toBranchName: 'Cabang Surabaya',
    requestDate: '2025-03-27',
    requestedBy: 'Manager Surabaya',
    createdAt: '2025-03-27T10:05:00',
    totalItems: 12,
    totalValue: 5250000,
    notes: 'Stok untuk promosi bulan depan',
    priority: 'low',
    waitingDays: 3
  },
  {
    id: 'TR9',
    transferNumber: 'TR-202503-009',
    fromBranchId: 'BR003',
    fromBranchName: 'Cabang Surabaya',
    toBranchId: 'BR002',
    toBranchName: 'Cabang Bandung',
    requestDate: '2025-03-29',
    requestedBy: 'Manager Bandung',
    createdAt: '2025-03-29T15:30:00',
    totalItems: 5,
    totalValue: 2150000,
    notes: 'Transfer produk kurang laku',
    priority: 'medium',
    waitingDays: 1
  }
];

const ApprovalTransfer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  const itemsPerPage = 10;
  
  // Filter permintaan transfer
  const filteredApprovals = pendingApprovals.filter(transfer => {
    // Filter cabang tujuan
    if (filterBranch !== 'all' && transfer.toBranchId !== filterBranch) {
      return false;
    }
    
    // Filter prioritas
    if (filterPriority !== 'all' && transfer.priority !== filterPriority) {
      return false;
    }
    
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
  
  // Paginasi
  const totalPages = Math.ceil(filteredApprovals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApprovals = filteredApprovals.slice(startIndex, startIndex + itemsPerPage);
  
  const getPriorityBadgeColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };
  
  const handleViewDetail = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsViewDetailOpen(true);
  };
  
  const handleApproveTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsApproveDialogOpen(true);
  };
  
  const handleRejectTransfer = (transfer: any) => {
    setSelectedTransfer(transfer);
    setIsRejectDialogOpen(true);
  };
  
  const confirmApproval = () => {
    console.log('Approving transfer:', selectedTransfer?.transferNumber, 'with note:', approvalNote);
    // Di sini akan memanggil API approval
    setIsApproveDialogOpen(false);
    setApprovalNote('');
  };
  
  const confirmRejection = () => {
    console.log('Rejecting transfer:', selectedTransfer?.transferNumber, 'with reason:', rejectionReason);
    // Di sini akan memanggil API rejection
    setIsRejectDialogOpen(false);
    setRejectionReason('');
  };
  
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FaUserCheck className="text-blue-500" size={18} />
            <span>Persetujuan Transfer Stok</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                placeholder="Cari permintaan transfer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<FaSearch className="text-gray-400" />}
              />
            </div>
            <div>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Cabang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Cabang</SelectItem>
                  <SelectItem value="BR001">Apotek Pusat - Jakarta</SelectItem>
                  <SelectItem value="BR002">Cabang Bandung</SelectItem>
                  <SelectItem value="BR003">Cabang Surabaya</SelectItem>
                  <SelectItem value="BR004">Cabang Medan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prioritas</SelectItem>
                  <SelectItem value="high">Prioritas Tinggi</SelectItem>
                  <SelectItem value="medium">Prioritas Sedang</SelectItem>
                  <SelectItem value="low">Prioritas Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSearchQuery('');
              setFilterBranch('all');
              setFilterPriority('all');
            }}
            className="mb-4"
          >
            <FaFilter className="mr-2 h-4 w-4" />
            <span>Reset Filter</span>
          </Button>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">No. Transfer</TableHead>
                  <TableHead>Rute Transfer</TableHead>
                  <TableHead>Informasi</TableHead>
                  <TableHead className="text-center">Prioritas</TableHead>
                  <TableHead className="text-center">Menunggu</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApprovals.length > 0 ? (
                  paginatedApprovals.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm gap-1">
                          <span>{transfer.fromBranchName}</span>
                          <FaArrowRight className="mx-1 text-blue-500" />
                          <span>{transfer.toBranchName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">Diminta oleh: {transfer.requestedBy}</span>
                          <span className="text-xs text-gray-500">
                            Tanggal: {new Date(transfer.requestDate).toLocaleDateString('id-ID')}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1">
                            Catatan: {transfer.notes}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getPriorityBadgeColor(transfer.priority)}>
                          {getPriorityLabel(transfer.priority)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`font-medium ${
                          transfer.waitingDays > 7 ? 'text-red-600' : 
                          transfer.waitingDays > 3 ? 'text-amber-600' : 'text-gray-600'
                        }`}>
                          {transfer.waitingDays} hari
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div>{formatRupiah(transfer.totalValue)}</div>
                        <div className="text-xs text-gray-500">{transfer.totalItems} item</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleViewDetail(transfer)}
                          >
                            <FaEye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600"
                            onClick={() => handleApproveTransfer(transfer)}
                          >
                            <FaCheckCircle size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleRejectTransfer(transfer)}
                          >
                            <FaTimesCircle size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada permintaan transfer yang menunggu persetujuan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredApprovals.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {Math.min(startIndex + 1, filteredApprovals.length)} - {Math.min(startIndex + itemsPerPage, filteredApprovals.length)} dari {filteredApprovals.length} permintaan
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
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
      
      {/* Dialog detail permintaan transfer */}
      <Dialog open={isViewDetailOpen} onOpenChange={setIsViewDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Permintaan Transfer: {selectedTransfer?.transferNumber}</DialogTitle>
            <DialogDescription>
              Diminta oleh {selectedTransfer?.requestedBy} pada {selectedTransfer ? new Date(selectedTransfer.requestDate).toLocaleDateString('id-ID') : ''}
            </DialogDescription>
          </DialogHeader>
          
          {/* Detail permintaan akan ditampilkan di sini */}
          <div className="py-4">
            <p className="text-center text-gray-500">Detail lengkap permintaan transfer akan ditampilkan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailOpen(false)}>
              Tutup
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setIsViewDetailOpen(false);
                handleRejectTransfer(selectedTransfer);
              }}
            >
              <FaTimesCircle className="mr-2 h-4 w-4" />
              Tolak
            </Button>
            <Button 
              onClick={() => {
                setIsViewDetailOpen(false);
                handleApproveTransfer(selectedTransfer);
              }}
            >
              <FaCheckCircle className="mr-2 h-4 w-4" />
              Setujui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog konfirmasi approval */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Persetujuan Transfer</DialogTitle>
            <DialogDescription>
              Anda akan menyetujui transfer {selectedTransfer?.transferNumber} dari {selectedTransfer?.fromBranchName} ke {selectedTransfer?.toBranchName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <label className="text-sm font-medium">Catatan Persetujuan (opsional):</label>
            <textarea 
              className="w-full mt-1 p-2 border rounded-md"
              rows={3}
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder="Tambahkan catatan atau instruksi untuk pengiriman..."
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={confirmApproval}>
              <FaCheckCircle className="mr-2 h-4 w-4" />
              Setujui Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog konfirmasi rejection */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penolakan Transfer</DialogTitle>
            <DialogDescription>
              Anda akan menolak transfer {selectedTransfer?.transferNumber} dari {selectedTransfer?.fromBranchName} ke {selectedTransfer?.toBranchName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <label className="text-sm font-medium">Alasan Penolakan (wajib):</label>
            <textarea 
              className="w-full mt-1 p-2 border rounded-md"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Berikan alasan penolakan permintaan transfer ini..."
              required
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmRejection}
              disabled={!rejectionReason.trim()}
            >
              <FaTimesCircle className="mr-2 h-4 w-4" />
              Tolak Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalTransfer;
