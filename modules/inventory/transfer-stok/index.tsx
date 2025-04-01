import React, { useState } from 'react';
import { 
  FaExchangeAlt, FaPlus, FaSearch, FaFilter, FaDownload, 
  FaPrint, FaEye, FaEdit, FaTrash, FaPaperPlane, FaCheck, 
  FaTruck, FaWarehouse, FaTimesCircle, FaArrowRight
} from 'react-icons/fa';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRupiah } from '@/lib/utils';
import FormTransfer from './form-transfer';
import TabelTransfer from './tabel-transfer';
import ApprovalTransfer from './approval-transfer';

// Data filter contoh
const statusFilter = [
  { value: 'all', label: 'Semua Status' },
  { value: 'requested', label: 'Diminta' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'shipped', label: 'Dikirim' },
  { value: 'received', label: 'Diterima' },
  { value: 'cancelled', label: 'Dibatalkan' },
  { value: 'rejected', label: 'Ditolak' },
];

const periodFilter = [
  { value: '7days', label: '7 Hari Terakhir' },
  { value: '30days', label: '30 Hari Terakhir' },
  { value: '90days', label: '90 Hari Terakhir' },
  { value: 'custom', label: 'Kustom' },
];

const branchFromFilter = [
  { value: 'all', label: 'Semua Cabang Asal' },
  { value: 'BR001', label: 'Apotek Pusat - Jakarta' },
  { value: 'BR002', label: 'Cabang Bandung' },
  { value: 'BR003', label: 'Cabang Surabaya' },
  { value: 'BR004', label: 'Cabang Medan' },
];

const branchToFilter = [
  { value: 'all', label: 'Semua Cabang Tujuan' },
  { value: 'BR001', label: 'Apotek Pusat - Jakarta' },
  { value: 'BR002', label: 'Cabang Bandung' },
  { value: 'BR003', label: 'Cabang Surabaya' },
  { value: 'BR004', label: 'Cabang Medan' },
];

const ModulTransferStok: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transfer-list');
  const [isFormTransferOpen, setIsFormTransferOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('30days');
  const [filterBranchFrom, setFilterBranchFrom] = useState('all');
  const [filterBranchTo, setFilterBranchTo] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transfer Stok Antar Cabang</h1>
          <p className="text-gray-500">Kelola permintaan, pengiriman, dan penerimaan stok antar cabang</p>
        </div>
        
        {activeTab === 'transfer-list' && (
          <Dialog open={isFormTransferOpen} onOpenChange={setIsFormTransferOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <FaPlus size={14} />
                <span>Ajukan Transfer Baru</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Formulir Transfer Stok Baru</DialogTitle>
                <DialogDescription>
                  Lengkapi detail permintaan transfer stok antar cabang
                </DialogDescription>
              </DialogHeader>
              <FormTransfer onClose={() => setIsFormTransferOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="transfer-list" className="flex items-center gap-2">
            <FaExchangeAlt size={14} />
            <span>Daftar Transfer</span>
          </TabsTrigger>
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <FaCheck size={14} />
            <span>Persetujuan</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FaTruck size={14} />
            <span>Pengiriman/Penerimaan</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transfer-list" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter Transfer Stok</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Input
                    placeholder="Cari No. Transfer..."
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
                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Periode" />
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
                <div>
                  <Select value={filterBranchFrom} onValueChange={setFilterBranchFrom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cabang Asal" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchFromFilter.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filterBranchTo} onValueChange={setFilterBranchTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cabang Tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchToFilter.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FaFilter className="mr-2 h-4 w-4" />
                    <span>Reset Filter</span>
                  </Button>
                </div>
                
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
            </CardContent>
          </Card>
          
          <TabelTransfer 
            filterStatus={filterStatus}
            filterPeriod={filterPeriod}
            filterBranchFrom={filterBranchFrom}
            filterBranchTo={filterBranchTo}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="approvals" className="space-y-4">
          <ApprovalTransfer />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FaWarehouse className="text-blue-500" />
                  <span>Menunggu Pengiriman</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-sm text-gray-500">Transfer yang perlu disiapkan</p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  Lihat Detail
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FaTruck className="text-amber-500" />
                  <span>Dalam Perjalanan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-sm text-gray-500">Transfer sedang dikirim</p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  Lacak Pengiriman
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FaCheck className="text-green-500" />
                  <span>Menunggu Penerimaan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <p className="text-sm text-gray-500">Transfer perlu dikonfirmasi tiba</p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  Proses Penerimaan
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Status Pengiriman dan Penerimaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-4">
                <p className="text-center text-gray-500">Laporan status pengiriman dan penerimaan akan ditampilkan di sini</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModulTransferStok;
