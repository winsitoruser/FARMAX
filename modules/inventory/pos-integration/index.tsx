import React, { useState } from 'react';
import { 
  FaExchangeAlt, FaShoppingCart, FaFilter, FaSearch, 
  FaSyncAlt, FaChartLine, FaDatabase, FaBoxes
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatRupiah } from '@/lib/utils';

import TransaksiPenjualan from './transaksi-penjualan';
import StokProduct from './stok-product';
import SinkronisasiData from './sinkronisasi-data';

// Data ringkasan pergerakan inventaris dari transaksi POS
const stockMovementSummary = {
  totalTransactions: 548,
  totalProductSold: 2156,
  totalSalesValue: 142500000,
  averageTransactionValue: 260000,
  topSellingCategory: 'Obat Bebas',
  lowestStockCategory: 'Antibiotik',
  stockSyncStatus: 'synced', // synced, partial, error
  lastSyncTime: '2025-03-30T14:30:00'
};

// Data ringkasan transaksi per cabang
const branchSummary = [
  { branch: 'Apotek Pusat - Jakarta', branchId: 'BR001', transactions: 182, salesValue: 54800000, avgTicket: 301099, productSold: 724 },
  { branch: 'Cabang Bandung', branchId: 'BR002', transactions: 156, salesValue: 42300000, avgTicket: 271154, productSold: 632 },
  { branch: 'Cabang Surabaya', branchId: 'BR003', transactions: 135, salesValue: 32500000, avgTicket: 240741, productSold: 486 },
  { branch: 'Cabang Medan', branchId: 'BR004', transactions: 75, salesValue: 12900000, avgTicket: 172000, productSold: 314 }
];

const PoSIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('transaksi');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [periode, setPeriode] = useState('hari-ini');
  const [filterCabang, setFilterCabang] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handler untuk mengubah periode
  const handlePeriodeChange = (value: string) => {
    setPeriode(value);
    
    const today = new Date();
    let start = new Date();
    
    switch (value) {
      case 'hari-ini':
        start = new Date(today);
        break;
      case 'kemarin':
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        break;
      case '7-hari':
        start = new Date(today);
        start.setDate(today.getDate() - 7);
        break;
      case '30-hari':
        start = new Date(today);
        start.setDate(today.getDate() - 30);
        break;
      case 'bulan-ini':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'kustom':
        // Biarkan tanggal seperti apa adanya
        return;
      default:
        break;
    }
    
    setStartDate(start);
    setEndDate(today);
  };
  
  // Helper untuk status sinkronisasi
  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'synced':
        return <Badge className="bg-green-100 text-green-800">Tersinkronisasi</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800">Sebagian</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  // Handler untuk sinkronisasi manual
  const handleManualSync = () => {
    console.log('Melakukan sinkronisasi data manual');
    // Implementasi API sinkronisasi
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Integrasi POS & Inventaris</h1>
          <p className="text-gray-500">Pelacakan pergerakan stok dari transaksi penjualan</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleManualSync} className="flex items-center gap-2">
            <FaSyncAlt size={14} />
            <span>Sinkronisasi Manual</span>
          </Button>
        </div>
      </div>
      
      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaShoppingCart className="text-orange-500" size={16} />
              <span>Total Transaksi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMovementSummary.totalTransactions.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">
              Rata-rata: {formatRupiah(stockMovementSummary.averageTransactionValue)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaBoxes className="text-orange-500" size={16} />
              <span>Produk Terjual</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockMovementSummary.totalProductSold.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-1">
              Terbanyak: {stockMovementSummary.topSellingCategory}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaChartLine className="text-orange-500" size={16} />
              <span>Nilai Penjualan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(stockMovementSummary.totalSalesValue)}</div>
            <p className="text-sm text-gray-500 mt-1">
              Dari {stockMovementSummary.totalTransactions} transaksi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaDatabase className="text-orange-500" size={16} />
              <span>Status Sinkronisasi</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getSyncStatusBadge(stockMovementSummary.stockSyncStatus)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Terakhir: {format(new Date(stockMovementSummary.lastSyncTime), 'dd MMM yyyy, HH:mm', { locale: id })}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter dan periode */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Filter Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Periode</label>
              <Select value={periode} onValueChange={handlePeriodeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hari-ini">Hari Ini</SelectItem>
                  <SelectItem value="kemarin">Kemarin</SelectItem>
                  <SelectItem value="7-hari">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30-hari">30 Hari Terakhir</SelectItem>
                  <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                  <SelectItem value="kustom">Kustom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Tanggal Mulai</label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                disabled={periode !== 'kustom'}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Tanggal Akhir</label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                disabled={periode !== 'kustom'}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Cabang</label>
              <Select value={filterCabang} onValueChange={setFilterCabang}>
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
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setPeriode('hari-ini');
                setFilterCabang('all');
                
                const today = new Date();
                setStartDate(today);
                setEndDate(today);
              }}
            >
              <FaFilter className="mr-2 h-4 w-4" />
              <span>Reset Filter</span>
            </Button>
            
            <Button>
              <FaSearch className="mr-2 h-4 w-4" />
              <span>Terapkan Filter</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Ringkasan transaksi per cabang */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {branchSummary
          .filter(branch => filterCabang === 'all' || branch.branchId === filterCabang)
          .map((branch, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{branch.branch}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-orange-50 p-2 rounded-md">
                    <div className="text-sm font-medium">{branch.transactions}</div>
                    <div className="text-xs text-gray-500">Transaksi</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-md">
                    <div className="text-sm font-medium">{branch.productSold}</div>
                    <div className="text-xs text-gray-500">Produk</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Nilai Penjualan:</span>
                  <span className="font-semibold">{formatRupiah(branch.salesValue)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Rata-rata:</span>
                  <span className="font-semibold">{formatRupiah(branch.avgTicket)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="transaksi" className="flex items-center gap-2">
            <FaShoppingCart size={14} />
            <span>Transaksi Penjualan</span>
          </TabsTrigger>
          <TabsTrigger value="stok" className="flex items-center gap-2">
            <FaBoxes size={14} />
            <span>Pergerakan Stok</span>
          </TabsTrigger>
          <TabsTrigger value="sinkronisasi" className="flex items-center gap-2">
            <FaSyncAlt size={14} />
            <span>Sinkronisasi Data</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transaksi" className="mt-4">
          <TransaksiPenjualan 
            startDate={startDate} 
            endDate={endDate}
            filterCabang={filterCabang}
          />
        </TabsContent>
        
        <TabsContent value="stok" className="mt-4">
          <StokProduct 
            startDate={startDate} 
            endDate={endDate}
            filterCabang={filterCabang}
          />
        </TabsContent>
        
        <TabsContent value="sinkronisasi" className="mt-4">
          <SinkronisasiData />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PoSIntegration;
