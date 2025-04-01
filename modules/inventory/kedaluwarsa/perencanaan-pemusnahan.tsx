import React, { useState } from 'react';
import { 
  FaTrashAlt, FaSearch, FaEye, FaEdit, 
  FaFilePdf, FaFileExport, FaCheck, FaTimes 
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
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Data sampel rencana pemusnahan
const sampleDisposalPlans = [
  {
    id: 'DP001',
    planNumber: 'DSP-2025-03-001',
    planDate: '2025-03-15',
    scheduledDate: '2025-04-20',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    status: 'scheduled', // scheduled, approved, completed, canceled
    totalItems: 24,
    totalValue: 4850000,
    method: 'incinerator',
    supervisor: 'Dr. Budi Santoso',
    witnesses: ['Bambang Wijaya', 'Sinta Permata'],
    notes: 'Pemusnahan batch obat kedaluwarsa triwulan I',
    documentReady: true
  },
  {
    id: 'DP002',
    planNumber: 'DSP-2025-03-002',
    planDate: '2025-03-20',
    scheduledDate: '2025-04-25',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    status: 'pending', // scheduled, approved, completed, canceled
    totalItems: 18,
    totalValue: 3250000,
    method: 'chemical',
    supervisor: 'Dr. Ratna Dewi',
    witnesses: ['Agus Darmawan', 'Maya Putri'],
    notes: 'Menunggu persetujuan dari Kepala Cabang',
    documentReady: false
  },
  {
    id: 'DP003',
    planNumber: 'DSP-2025-02-001',
    planDate: '2025-02-10',
    scheduledDate: '2025-03-05',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    status: 'completed',
    totalItems: 32,
    totalValue: 7250000,
    method: 'incinerator',
    supervisor: 'Dr. Anwar Setiawan',
    witnesses: ['Diana Putri', 'Rudi Hermawan', 'Petugas BPOM'],
    notes: 'Pemusnahan telah dilakukan sesuai prosedur BPOM',
    documentReady: true
  },
  {
    id: 'DP004',
    planNumber: 'DSP-2025-03-003',
    planDate: '2025-03-25',
    scheduledDate: '2025-04-10',
    branchId: 'BR004',
    branchName: 'Cabang Medan',
    status: 'approved',
    totalItems: 14,
    totalValue: 2150000,
    method: 'crushing',
    supervisor: 'Dr. Sarah Nabila',
    witnesses: ['Hadi Kusuma', 'Rina Wijaya'],
    notes: 'Dokumen sudah disetujui, menunggu jadwal pelaksanaan',
    documentReady: true
  }
];

const PerencanaanPemusnahan: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Filter rencana pemusnahan
  const filteredPlans = sampleDisposalPlans.filter(plan => {
    // Filter cabang
    if (filterBranch !== 'all' && plan.branchId !== filterBranch) {
      return false;
    }
    
    // Filter status
    if (filterStatus !== 'all' && plan.status !== filterStatus) {
      return false;
    }
    
    // Filter pencarian
    if (
      searchQuery && 
      !plan.planNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !plan.branchName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !plan.supervisor.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Helper untuk warna status
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper untuk label status
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'scheduled': return 'Terjadwal';
      case 'pending': return 'Menunggu Persetujuan';
      case 'approved': return 'Disetujui';
      case 'completed': return 'Selesai';
      case 'canceled': return 'Dibatalkan';
      default: return status;
    }
  };
  
  // Handler lihat detail
  const handleViewDetail = (plan: any) => {
    setSelectedPlan(plan);
    setIsViewDetailOpen(true);
  };
  
  // Handler approval
  const handleApproval = (plan: any) => {
    setSelectedPlan(plan);
    setIsApproveDialogOpen(true);
  };
  
  // Konfirmasi approval
  const confirmApproval = () => {
    console.log('Approving disposal plan:', selectedPlan?.planNumber);
    setIsApproveDialogOpen(false);
  };
  
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FaTrashAlt className="text-orange-500" size={18} />
            <span>Rencana Pemusnahan Obat Kedaluwarsa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                placeholder="Cari rencana pemusnahan..."
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="scheduled">Terjadwal</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="canceled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">No. Pemusnahan</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Informasi</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Dokumen</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPlans.length > 0 ? (
                  paginatedPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.planNumber}</TableCell>
                      <TableCell>{plan.branchName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">Supervisor: {plan.supervisor}</span>
                          <span className="text-xs text-gray-500">
                            Tanggal Perencanaan: {format(new Date(plan.planDate), 'dd MMM yyyy', { locale: id })}
                          </span>
                          <span className="text-xs text-gray-500">
                            Jadwal: {format(new Date(plan.scheduledDate), 'dd MMM yyyy', { locale: id })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusBadgeColor(plan.status)}>
                          {getStatusLabel(plan.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {plan.documentReady ? (
                          <Badge className="bg-green-100 text-green-800">Siap</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Belum Lengkap</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div>{formatRupiah(plan.totalValue)}</div>
                        <div className="text-xs text-gray-500">{plan.totalItems} item</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleViewDetail(plan)}
                          >
                            <FaEye size={16} />
                          </Button>
                          
                          {plan.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => handleApproval(plan)}
                            >
                              <FaCheck size={16} />
                            </Button>
                          )}
                          
                          {plan.documentReady && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-orange-600"
                            >
                              <FaFilePdf size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Tidak ada rencana pemusnahan yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredPlans.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPlans.length)} - {Math.min(currentPage * itemsPerPage, filteredPlans.length)} dari {filteredPlans.length} rencana
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
      
      {/* Dialog detail rencana pemusnahan */}
      <Dialog open={isViewDetailOpen} onOpenChange={setIsViewDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Rencana Pemusnahan: {selectedPlan?.planNumber}</DialogTitle>
            <DialogDescription>
              Direncanakan pada {selectedPlan ? format(new Date(selectedPlan.planDate), 'dd MMMM yyyy', { locale: id }) : ''}
            </DialogDescription>
          </DialogHeader>
          
          {/* Isi detail rencana akan diimplementasikan disini */}
          <div className="py-4">
            <p className="text-center text-gray-500">Detail lengkap rencana pemusnahan akan ditampilkan di sini</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailOpen(false)}>
              Tutup
            </Button>
            {selectedPlan?.status === 'pending' && (
              <Button 
                onClick={() => {
                  setIsViewDetailOpen(false);
                  handleApproval(selectedPlan);
                }}
              >
                <FaCheck className="mr-2 h-4 w-4" />
                Setujui Rencana
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog konfirmasi approval */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Persetujuan</DialogTitle>
            <DialogDescription>
              Anda akan menyetujui rencana pemusnahan {selectedPlan?.planNumber} di {selectedPlan?.branchName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p>Dengan menyetujui rencana ini, Anda mengonfirmasi bahwa:</p>
            <ul className="list-disc pl-5 pt-2 space-y-1">
              <li>Semua item yang tercantum telah diverifikasi dan benar-benar kedaluwarsa</li>
              <li>Metode pemusnahan yang dipilih sesuai dengan regulasi BPOM</li>
              <li>Pelaksanaan pemusnahan akan didokumentasikan dan diarsipkan</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={confirmApproval}>
              <FaCheck className="mr-2 h-4 w-4" />
              Setujui Rencana
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PerencanaanPemusnahan;
