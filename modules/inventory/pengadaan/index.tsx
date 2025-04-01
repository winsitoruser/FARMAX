import React, { useState } from 'react';
import { 
  FaShoppingCart, FaPlus, FaEdit, FaTrash, FaFilter, 
  FaDownload, FaPrint, FaFileInvoice, FaTruck, FaCheckCircle,
  FaTimesCircle, FaSearch, FaExclamationCircle, FaCalendarAlt
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
import FormPO from './form-po';
import TabelPO from './tabel-po';
import PenerimaanBarang from './penerimaan-barang';
import DataSupplier from './data-supplier';

// Data contoh
const statusFilter = [
  { value: 'all', label: 'Semua Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Terkirim' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
  { value: 'partial', label: 'Sebagian Diterima' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const periodFilter = [
  { value: '7days', label: '7 Hari Terakhir' },
  { value: '30days', label: '30 Hari Terakhir' },
  { value: '90days', label: '90 Hari Terakhir' },
  { value: 'custom', label: 'Kustom' },
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

const ModulPengadaan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('purchase-orders');
  const [isFormPOOpen, setIsFormPOOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('30days');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pengadaan Barang</h1>
          <p className="text-gray-500">Kelola pesanan pembelian, penerimaan barang, dan supplier</p>
        </div>
        
        {activeTab === 'purchase-orders' && (
          <Dialog open={isFormPOOpen} onOpenChange={setIsFormPOOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <FaPlus size={14} />
                <span>Buat PO Baru</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Formulir Purchase Order (PO) Baru</DialogTitle>
                <DialogDescription>
                  Lengkapi detail pemesanan barang ke supplier
                </DialogDescription>
              </DialogHeader>
              <FormPO onClose={() => setIsFormPOOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
        
        {activeTab === 'suppliers' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <FaPlus size={14} />
                <span>Tambah Supplier</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Supplier Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan data supplier untuk pengadaan barang
                </DialogDescription>
              </DialogHeader>
              {/* Form Supplier akan diimplementasikan */}
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="purchase-orders" className="flex items-center gap-2">
            <FaShoppingCart size={14} />
            <span>Purchase Order</span>
          </TabsTrigger>
          <TabsTrigger value="goods-receipt" className="flex items-center gap-2">
            <FaTruck size={14} />
            <span>Penerimaan Barang</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-2">
            <FaFileInvoice size={14} />
            <span>Data Supplier</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchase-orders" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filter Purchase Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Input
                    placeholder="Cari No. PO, Supplier..."
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
          
          <TabelPO 
            filterStatus={filterStatus}
            filterPeriod={filterPeriod}
            filterSupplier={filterSupplier}
            filterBranch={filterBranch}
            searchQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="goods-receipt" className="space-y-4">
          <PenerimaanBarang />
        </TabsContent>
        
        <TabsContent value="suppliers" className="space-y-4">
          <DataSupplier />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModulPengadaan;
