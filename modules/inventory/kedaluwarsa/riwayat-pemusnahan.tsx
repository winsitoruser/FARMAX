import React, { useState } from 'react';
import { 
  FaClipboardCheck, FaSearch, FaEye, FaDownload, 
  FaFilePdf, FaCalendarAlt, FaFilter
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

// Data sampel riwayat pemusnahan
const sampleDisposalHistory = [
  {
    id: 'DH001',
    disposalNumber: 'DSP-2024-12-001',
    planNumber: 'PLN-2024-11-003',
    disposalDate: '2024-12-15',
    completionDate: '2024-12-15',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    status: 'completed', // completed, partial, canceled
    totalItems: 45,
    totalValue: 8750000,
    method: 'incinerator',
    supervisor: 'Dr. Budi Santoso',
    witnesses: ['Bambang Wijaya', 'Sinta Permata', 'Petugas BPOM Jakarta'],
    documentId: 'DOC-2024-12-001',
    notes: 'Pemusnahan dilakukan di fasilitas incinerator RSUD Jakarta',
    hasBpomReport: true
  },
  {
    id: 'DH002',
    disposalNumber: 'DSP-2025-01-001',
    planNumber: 'PLN-2024-12-002',
    disposalDate: '2025-01-10',
    completionDate: '2025-01-10',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    status: 'completed',
    totalItems: 32,
    totalValue: 6250000,
    method: 'chemical',
    supervisor: 'Dr. Ratna Dewi',
    witnesses: ['Agus Darmawan', 'Maya Putri', 'Petugas BPOM Bandung'],
    documentId: 'DOC-2025-01-001',
    notes: 'Pemusnahan dilakukan sesuai prosedur BPOM dengan metode kimiawi',
    hasBpomReport: true
  },
  {
    id: 'DH003',
    disposalNumber: 'DSP-2025-02-001',
    planNumber: 'PLN-2025-01-001',
    disposalDate: '2025-02-05',
    completionDate: '2025-02-05',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    status: 'partial',
    totalItems: 28,
    totalValue: 5150000,
    method: 'incinerator',
    supervisor: 'Dr. Anwar Setiawan',
    witnesses: ['Diana Putri', 'Rudi Hermawan', 'Petugas BPOM Surabaya'],
    documentId: 'DOC-2025-02-001',
    notes: 'Beberapa item ditunda pemusnahannya karena kendala teknis',
    hasBpomReport: true
  },
  {
    id: 'DH004',
    disposalNumber: 'DSP-2025-03-001',
    planNumber: 'PLN-2025-02-002',
    disposalDate: '2025-03-12',
    completionDate: '2025-03-12',
    branchId: 'BR004',
    branchName: 'Cabang Medan',
    status: 'completed',
    totalItems: 18,
    totalValue: 3250000,
    method: 'crushing',
    supervisor: 'Dr. Sarah Nabila',
    witnesses: ['Hadi Kusuma', 'Rina Wijaya', 'Petugas BPOM Medan'],
    documentId: 'DOC-2025-03-001',
    notes: 'Pemusnahan dilakukan dengan metode penghancuran fisik',
    hasBpomReport: true
  },
  {
    id: 'DH005',
    disposalNumber: 'DSP-2025-03-002',
    planNumber: 'PLN-2025-02-003',
    disposalDate: '2025-03-20',
    completionDate: null,
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    status: 'canceled',
    totalItems: 12,
    totalValue: 2150000,
    method: 'incinerator',
    supervisor: 'Dr. Budi Santoso',
    witnesses: [],
    documentId: 'DOC-2025-03-002',
    notes: 'Dibatalkan karena perubahan regulasi BPOM terkait metode pemusnahan',
    hasBpomReport: false
  }
];

// Data filter periode
const periodFilter = [
  { value: 'all', label: 'Semua Periode' },
  { value: '30days', label: '30 Hari Terakhir' },
  { value: '90days', label: '90 Hari Terakhir' },
  { value: 'thisYear', label: 'Tahun Ini' },
  { value: 'lastYear', label: 'Tahun Lalu' },
];

const RiwayatPemusnahan: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDisposal, setSelectedDisposal] = useState<any>(null);
  const [isViewDetailOpen, setIsViewDetailOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Filter riwayat pemusnahan
  const filteredHistory = sampleDisposalHistory.filter(disposal => {
    // Filter cabang
    if (filterBranch !== 'all' && disposal.branchId !== filterBranch) {
      return false;
    }
    
    // Filter periode
    if (filterPeriod !== 'all') {
      const disposalDate = new Date(disposal.disposalDate);
      const now = new Date();
      
      switch (filterPeriod) {
        case '30days': 
          // 30 hari terakhir
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          if (disposalDate < thirtyDaysAgo) return false;
          break;
        case '90days':
          // 90 hari terakhir
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(now.getDate() - 90);
          if (disposalDate < ninetyDaysAgo) return false;
          break;
        case 'thisYear':
          // Tahun ini
          if (disposalDate.getFullYear() !== now.getFullYear()) return false;
          break;
        case 'lastYear':
          // Tahun lalu
          if (disposalDate.getFullYear() !== now.getFullYear() - 1) return false;
          break;
      }
    }
    
    // Filter pencarian
    if (
      searchQuery && 
      !disposal.disposalNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !disposal.planNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !disposal.branchName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !disposal.supervisor.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Helper untuk warna status
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-amber-100 text-amber-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper untuk label status
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'partial': return 'Sebagian';
      case 'canceled': return 'Dibatalkan';
      default: return status;
    }
  };
  
  // Handler lihat detail
  const handleViewDetail = (disposal: any) => {
    setSelectedDisposal(disposal);
    setIsViewDetailOpen(true);
  };
  
  // Helper format method pemusnahan
  const getMethodLabel = (method: string): string => {
    switch (method) {
      case 'incinerator': return 'Insinerator (Pembakaran)';
      case 'chemical': return 'Dekomposisi Kimiawi';
      case 'crushing': return 'Penghancuran Fisik';
      default: return method;
    }
  };
  
  return (
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FaClipboardCheck className="text-purple-500" size={18} />
            <span>Riwayat Pemusnahan Obat</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                placeholder="Cari riwayat pemusnahan..."
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
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  {periodFilter.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSearchQuery('');
                setFilterBranch('all');
                setFilterPeriod('all');
              }}
            >
              <FaFilter className="mr-2 h-4 w-4" />
              <span>Reset Filter</span>
            </Button>
            
            <Button variant="outline" size="sm">
              <FaDownload className="mr-2 h-4 w-4" />
              <span>Export Laporan</span>
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">No. Pemusnahan</TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Informasi</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Metode</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedHistory.length > 0 ? (
                  paginatedHistory.map((disposal) => (
                    <TableRow key={disposal.id}>
                      <TableCell className="font-medium">
                        <div>{disposal.disposalNumber}</div>
                        <div className="text-xs text-gray-500">Ref: {disposal.planNumber}</div>
                      </TableCell>
                      <TableCell>{disposal.branchName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">PJ: {disposal.supervisor}</span>
                          <span className="text-xs text-gray-500">
                            Tanggal: {format(new Date(disposal.disposalDate), 'dd MMM yyyy', { locale: id })}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1">
                            {disposal.notes}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusBadgeColor(disposal.status)}>
                          {getStatusLabel(disposal.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{getMethodLabel(disposal.method)}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div>{formatRupiah(disposal.totalValue)}</div>
                        <div className="text-xs text-gray-500">{disposal.totalItems} item</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600"
                            onClick={() => handleViewDetail(disposal)}
                          >
                            <FaEye size={16} />
                          </Button>
                          
                          {disposal.hasBpomReport && (
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
                      Tidak ada riwayat pemusnahan yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredHistory.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredHistory.length)} - {Math.min(currentPage * itemsPerPage, filteredHistory.length)} dari {filteredHistory.length} riwayat
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
      
      {/* Dialog detail riwayat pemusnahan */}
      <Dialog open={isViewDetailOpen} onOpenChange={setIsViewDetailOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detail Pemusnahan: {selectedDisposal?.disposalNumber}</DialogTitle>
            <DialogDescription>
              Dilaksanakan pada {selectedDisposal ? format(new Date(selectedDisposal.disposalDate), 'dd MMMM yyyy', { locale: id }) : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDisposal && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informasi Umum</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Cabang</span>
                      <span className="text-sm font-medium">{selectedDisposal.branchName}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">No. Referensi</span>
                      <span className="text-sm font-medium">{selectedDisposal.planNumber}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="text-sm">
                        <Badge className={getStatusBadgeColor(selectedDisposal.status)}>
                          {getStatusLabel(selectedDisposal.status)}
                        </Badge>
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Metode</span>
                      <span className="text-sm font-medium">{getMethodLabel(selectedDisposal.method)}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Dokumen ID</span>
                      <span className="text-sm font-medium">{selectedDisposal.documentId}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Pelaksanaan</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Penanggung Jawab</span>
                      <span className="text-sm font-medium">{selectedDisposal.supervisor}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Saksi</span>
                      <span className="text-sm font-medium line-clamp-2">
                        {selectedDisposal.witnesses.join(', ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Laporan BPOM</span>
                      <span className="text-sm font-medium">
                        {selectedDisposal.hasBpomReport ? (
                          <Badge className="bg-green-100 text-green-800">
                            Tersedia
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            Tidak Ada
                          </Badge>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Jumlah Item</span>
                      <span className="text-sm font-medium">{selectedDisposal.totalItems} produk</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Total Nilai</span>
                      <span className="text-sm font-medium">{formatRupiah(selectedDisposal.totalValue)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Catatan</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">{selectedDisposal.notes}</p>
                </div>
              </div>
              
              {/* Placeholder untuk daftar item yang dimusnahkan */}
              <div>
                <h3 className="text-sm font-medium mb-2">Daftar Item Dimusnahkan</h3>
                <div className="bg-gray-50 p-3 rounded-md text-center text-sm text-gray-500">
                  Daftar item yang dimusnahkan akan ditampilkan di sini
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedDisposal?.hasBpomReport && (
              <Button variant="outline" className="mr-auto">
                <FaFilePdf className="mr-2 h-4 w-4" />
                Unduh Laporan BPOM
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsViewDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RiwayatPemusnahan;
