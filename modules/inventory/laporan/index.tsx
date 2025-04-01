import React, { useState } from 'react';
import { 
  FaChartBar, FaFileExport, FaCalendarAlt, FaFilter, 
  FaBoxOpen, FaExchangeAlt, FaCalendarTimes, FaCoins, FaSearch
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import LaporanStok from './laporan-stok';
import LaporanTransaksi from './laporan-transaksi';
import LaporanKedaluwarsa from './laporan-kedaluwarsa';
import LaporanNilai from './laporan-nilai';

const ModulLaporan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stok');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [periode, setPeriode] = useState('bulan-ini');
  const [filterCabang, setFilterCabang] = useState('all');
  const [filterKategori, setFilterKategori] = useState('all');
  
  // Handler untuk mengubah periode
  const handlePeriodeChange = (value: string) => {
    setPeriode(value);
    
    const today = new Date();
    let start = new Date();
    
    switch (value) {
      case 'hari-ini':
        start = new Date(today);
        break;
      case 'minggu-ini':
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        break;
      case 'bulan-ini':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'tahun-ini':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'triwulan-ini':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
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
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laporan Inventaris</h1>
          <p className="text-gray-500">Analisis data inventaris dan performa stok</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FaFileExport size={14} />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="stok" className="flex items-center gap-2">
            <FaBoxOpen size={14} />
            <span>Laporan Stok</span>
          </TabsTrigger>
          <TabsTrigger value="transaksi" className="flex items-center gap-2">
            <FaExchangeAlt size={14} />
            <span>Transaksi Stok</span>
          </TabsTrigger>
          <TabsTrigger value="kedaluwarsa" className="flex items-center gap-2">
            <FaCalendarTimes size={14} />
            <span>Kedaluwarsa</span>
          </TabsTrigger>
          <TabsTrigger value="nilai" className="flex items-center gap-2">
            <FaCoins size={14} />
            <span>Nilai Inventaris</span>
          </TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FaFilter size={16} className="text-orange-500" />
              <span>Filter Laporan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Periode</label>
                <Select value={periode} onValueChange={handlePeriodeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hari-ini">Hari Ini</SelectItem>
                    <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
                    <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                    <SelectItem value="triwulan-ini">Triwulan Ini</SelectItem>
                    <SelectItem value="tahun-ini">Tahun Ini</SelectItem>
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
              
              <div>
                <label className="text-sm font-medium mb-1 block">Kategori</label>
                <Select value={filterKategori} onValueChange={setFilterKategori}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="CAT001">Obat Bebas</SelectItem>
                    <SelectItem value="CAT002">Obat Bebas Terbatas</SelectItem>
                    <SelectItem value="CAT003">Obat Keras</SelectItem>
                    <SelectItem value="CAT004">Antibiotik</SelectItem>
                    <SelectItem value="CAT005">Vitamin dan Suplemen</SelectItem>
                    <SelectItem value="CAT006">Alat Kesehatan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setPeriode('bulan-ini');
                  setFilterCabang('all');
                  setFilterKategori('all');
                  
                  const today = new Date();
                  setStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
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
        
        <div className="mt-4">
          <TabsContent value="stok">
            <LaporanStok 
              startDate={startDate} 
              endDate={endDate} 
              filterCabang={filterCabang}
              filterKategori={filterKategori}
            />
          </TabsContent>
          
          <TabsContent value="transaksi">
            <LaporanTransaksi 
              startDate={startDate} 
              endDate={endDate} 
              filterCabang={filterCabang}
              filterKategori={filterKategori}
            />
          </TabsContent>
          
          <TabsContent value="kedaluwarsa">
            <LaporanKedaluwarsa 
              startDate={startDate} 
              endDate={endDate} 
              filterCabang={filterCabang}
              filterKategori={filterKategori}
            />
          </TabsContent>
          
          <TabsContent value="nilai">
            <LaporanNilai 
              startDate={startDate} 
              endDate={endDate} 
              filterCabang={filterCabang}
              filterKategori={filterKategori}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ModulLaporan;
