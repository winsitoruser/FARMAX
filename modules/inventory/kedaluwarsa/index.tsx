import React, { useState } from 'react';
import { 
  FaCalendarTimes, FaExclamationTriangle, FaSearch, FaFilter, 
  FaDownload, FaPlus, FaClipboardCheck, FaTrashAlt,
  FaFileAlt, FaSort, FaSortUp, FaSortDown, FaCalendarAlt
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
import { Progress } from '@/components/ui/progress';
import { formatRupiah } from '@/lib/utils';

import DaftarKedaluwarsa from './daftar-kedaluwarsa';
import PerencanaanPemusnahan from './perencanaan-pemusnahan';
import RiwayatPemusnahan from './riwayat-pemusnahan';

// Data summary untuk tampilan awal
const expirySummary = {
  expiredCount: 12,
  expiredValue: 4500000,
  nearExpiryCount: 45,
  nearExpiryValue: 12750000,
  pendingDisposalCount: 8,
  disposedThisMonth: 15,
  disposalCompliancePercent: 85,
  mostExpiredCategory: 'Antibiotik'
};

// Data filter cabang
const branchFilter = [
  { value: 'all', label: 'Semua Cabang' },
  { value: 'BR001', label: 'Apotek Pusat - Jakarta' },
  { value: 'BR002', label: 'Cabang Bandung' },
  { value: 'BR003', label: 'Cabang Surabaya' },
  { value: 'BR004', label: 'Cabang Medan' },
];

// Data filter kategori
const categoryFilter = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'CAT001', label: 'Obat Bebas' },
  { value: 'CAT002', label: 'Obat Bebas Terbatas' },
  { value: 'CAT003', label: 'Obat Keras' },
  { value: 'CAT004', label: 'Antibiotik' },
  { value: 'CAT005', label: 'Vitamin dan Suplemen' },
  { value: 'CAT006', label: 'Alat Kesehatan' },
];

// Data filter periode kedaluwarsa
const expiryPeriodFilter = [
  { value: 'expired', label: 'Sudah Kedaluwarsa' },
  { value: '30days', label: '< 30 Hari' },
  { value: '60days', label: '30 - 60 Hari' },
  { value: '90days', label: '60 - 90 Hari' },
  { value: '180days', label: '90 - 180 Hari' },
  { value: 'all', label: 'Semua Periode' },
];

const ModulKedaluwarsa: React.FC = () => {
  const [activeTab, setActiveTab] = useState('daftar-kedaluwarsa');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterExpiryPeriod, setFilterExpiryPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Kedaluwarsa</h1>
          <p className="text-gray-500">Kelola produk kedaluwarsa dan proses pemusnahan sesuai regulasi</p>
        </div>
        
        {activeTab === 'perencanaan-pemusnahan' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <FaPlus size={14} />
                <span>Rencana Pemusnahan Baru</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Formulir Perencanaan Pemusnahan</DialogTitle>
                <DialogDescription>
                  Buat rencana pemusnahan obat kedaluwarsa baru
                </DialogDescription>
              </DialogHeader>
              
              {/* Formulir perencanaan pemusnahan akan diimplementasikan */}
              <div className="py-8">
                <p className="text-center text-gray-500">Form perencanaan pemusnahan akan diimplementasikan di sini</p>
              </div>
              
              <DialogFooter>
                <Button variant="outline">Batal</Button>
                <Button>Simpan Rencana</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaCalendarTimes className="text-red-500" />
              <span>Total Produk Kedaluwarsa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expirySummary.expiredCount} produk</div>
            <p className="text-sm text-gray-500">
              Nilai: {formatRupiah(expirySummary.expiredValue)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaExclamationTriangle className="text-amber-500" />
              <span>Mendekati Kedaluwarsa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expirySummary.nearExpiryCount} produk</div>
            <p className="text-sm text-gray-500">
              Nilai: {formatRupiah(expirySummary.nearExpiryValue)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaClipboardCheck className="text-purple-500" />
              <span>Menunggu Pemusnahan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expirySummary.pendingDisposalCount} batch</div>
            <p className="text-sm text-gray-500">
              Bulan ini: {expirySummary.disposedThisMonth} batch dimusnahkan
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaFileAlt className="text-blue-500" />
              <span>Kepatuhan BPOM</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{expirySummary.disposalCompliancePercent}%</div>
              <div className="flex-1">
                <Progress value={expirySummary.disposalCompliancePercent} className="h-2" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Kategori terbanyak: {expirySummary.mostExpiredCategory}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="daftar-kedaluwarsa" className="flex items-center gap-2">
            <FaCalendarTimes size={14} />
            <span>Daftar Kedaluwarsa</span>
          </TabsTrigger>
          <TabsTrigger value="perencanaan-pemusnahan" className="flex items-center gap-2">
            <FaTrashAlt size={14} />
            <span>Perencanaan Pemusnahan</span>
          </TabsTrigger>
          <TabsTrigger value="riwayat-pemusnahan" className="flex items-center gap-2">
            <FaClipboardCheck size={14} />
            <span>Riwayat Pemusnahan</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="daftar-kedaluwarsa" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter Produk Kedaluwarsa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Cari nama produk, batch..."
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
                      {branchFilter.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryFilter.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={filterExpiryPeriod} onValueChange={setFilterExpiryPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Periode Kedaluwarsa" />
                    </SelectTrigger>
                    <SelectContent>
                      {expiryPeriodFilter.map((option) => (
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
                  <Button variant="outline" size="sm" onClick={() => {
                    setSearchQuery('');
                    setFilterBranch('all');
                    setFilterCategory('all');
                    setFilterExpiryPeriod('all');
                  }}>
                    <FaFilter className="mr-2 h-4 w-4" />
                    <span>Reset Filter</span>
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FaDownload className="mr-2 h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <DaftarKedaluwarsa 
            searchQuery={searchQuery}
            filterBranch={filterBranch}
            filterCategory={filterCategory}
            filterExpiryPeriod={filterExpiryPeriod}
          />
        </TabsContent>
        
        <TabsContent value="perencanaan-pemusnahan" className="space-y-4">
          <PerencanaanPemusnahan />
        </TabsContent>
        
        <TabsContent value="riwayat-pemusnahan" className="space-y-4">
          <RiwayatPemusnahan />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModulKedaluwarsa;
