import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, FaChartBar, FaChartPie, FaBoxes, 
  FaShoppingCart, FaExchangeAlt, FaDownload, FaCalendarAlt 
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatRupiah } from '@/lib/utils';

import SalesTrendsChart from './sales-trends-chart';
import InventoryImpactChart from './inventory-impact-chart';
import TopProductsChart from './top-products-chart';
import BranchPerformanceChart from './branch-performance-chart';
import StockMovementAnalytics from './stock-movement-analytics';

import { POSIntegrationAPI } from '../services/api-service';
import { errorManager } from '../services/error-service';

// Interfaces untuk struktur data
interface AnalyticsFilters {
  startDate: Date;
  endDate: Date;
  branchId: string;
  interval: 'daily' | 'weekly' | 'monthly';
}

interface AnalyticsData {
  salesTrends: any;
  inventoryImpact: any;
  topProducts: any;
  branchPerformance: any;
  isLoading: boolean;
}

// Filter periode untuk analytics
const filterPeriodOptions = [
  { value: '7-hari', label: '7 Hari Terakhir' },
  { value: '30-hari', label: '30 Hari Terakhir' },
  { value: 'bulan-ini', label: 'Bulan Ini' },
  { value: 'bulan-lalu', label: 'Bulan Lalu' },
  { value: 'kustom', label: 'Kustom' }
];

// Data dummy untuk branch
const branchOptions = [
  { value: 'all', label: 'Semua Cabang' },
  { value: 'BR001', label: 'Apotek Pusat - Jakarta' },
  { value: 'BR002', label: 'Cabang Bandung' },
  { value: 'BR003', label: 'Cabang Surabaya' },
  { value: 'BR004', label: 'Cabang Medan' }
];

const POSAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales-trends');
  const [filterPeriod, setFilterPeriod] = useState('30-hari');
  const [filters, setFilters] = useState<AnalyticsFilters>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    branchId: 'all',
    interval: 'daily'
  });
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    salesTrends: null,
    inventoryImpact: null,
    topProducts: null,
    branchPerformance: null,
    isLoading: true
  });
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);

  // Effect untuk memuat data analytics
  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  // Handler untuk mengubah periode
  const handleFilterPeriodChange = (value: string) => {
    setFilterPeriod(value);
    
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (value) {
      case '7-hari':
        startDate = subDays(today, 7);
        endDate = today;
        setShowCustomDateRange(false);
        break;
      case '30-hari':
        startDate = subDays(today, 30);
        endDate = today;
        setShowCustomDateRange(false);
        break;
      case 'bulan-ini':
        startDate = startOfMonth(today);
        endDate = today;
        setShowCustomDateRange(false);
        break;
      case 'bulan-lalu':
        startDate = startOfMonth(subMonths(today, 1));
        endDate = endOfMonth(subMonths(today, 1));
        setShowCustomDateRange(false);
        break;
      case 'kustom':
        setShowCustomDateRange(true);
        return;
      default:
        break;
    }
    
    setFilters({
      ...filters,
      startDate,
      endDate
    });
  };

  // Handler untuk mengubah cabang
  const handleBranchChange = (value: string) => {
    setFilters({
      ...filters,
      branchId: value
    });
  };

  // Handler untuk mengubah interval
  const handleIntervalChange = (value: 'daily' | 'weekly' | 'monthly') => {
    setFilters({
      ...filters,
      interval: value
    });
  };

  // Handler untuk custom start date
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFilters({
        ...filters,
        startDate: date
      });
    }
  };

  // Handler untuk custom end date
  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFilters({
        ...filters,
        endDate: date
      });
    }
  };

  // Mengambil data analytics dari API
  const fetchAnalyticsData = async () => {
    setAnalyticsData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Menggunakan error manager untuk menangani error
      await errorManager.executeWithRetry(
        async () => {
          // Parameter dasar untuk semua request
          const baseParams = {
            startDate: format(filters.startDate, 'yyyy-MM-dd'),
            endDate: format(filters.endDate, 'yyyy-MM-dd'),
            branchId: filters.branchId === 'all' ? undefined : filters.branchId,
            interval: filters.interval
          };
          
          // Mengambil data tren penjualan
          const salesTrendsResponse = await POSIntegrationAPI.getAnalytics({
            type: 'sales-trends',
            ...baseParams
          });
          
          // Mengambil data dampak inventaris
          const inventoryImpactResponse = await POSIntegrationAPI.getAnalytics({
            type: 'inventory-impact',
            ...baseParams
          });
          
          // Mengambil data produk teratas
          const topProductsResponse = await POSIntegrationAPI.getAnalytics({
            type: 'top-products',
            ...baseParams,
            limit: 10
          });
          
          // Mengambil data performa cabang
          const branchPerformanceResponse = await POSIntegrationAPI.getAnalytics({
            type: 'branch-performance',
            ...baseParams
          });
          
          setAnalyticsData({
            salesTrends: salesTrendsResponse.data,
            inventoryImpact: inventoryImpactResponse.data,
            topProducts: topProductsResponse.data,
            branchPerformance: branchPerformanceResponse.data,
            isLoading: false
          });
        },
        'POS Analytics',
        'fetchAnalyticsData',
        { severity: 'warning' }
      );
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      
      // Set data dummy jika error
      setAnalyticsData({
        salesTrends: generateDummySalesTrends(),
        inventoryImpact: generateDummyInventoryImpact(),
        topProducts: generateDummyTopProducts(),
        branchPerformance: generateDummyBranchPerformance(),
        isLoading: false
      });
    }
  };

  // Mendapatkan label periode aktif
  const getActivePeriodLabel = () => {
    const option = filterPeriodOptions.find(option => option.value === filterPeriod);
    return option ? option.label : 'Periode';
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analitik POS & Inventaris</h1>
          <p className="text-gray-500">Analisis mendalam tentang dampak transaksi penjualan terhadap inventaris</p>
        </div>
      </div>
      
      {/* Filter Analytics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Analitik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Periode</label>
              <Select value={filterPeriod} onValueChange={handleFilterPeriodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  {filterPeriodOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {showCustomDateRange && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dari Tanggal</label>
                  <DatePicker
                    date={filters.startDate}
                    setDate={handleStartDateChange}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sampai Tanggal</label>
                  <DatePicker
                    date={filters.endDate}
                    setDate={handleEndDateChange}
                    className="w-full"
                  />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cabang</label>
              <Select value={filters.branchId} onValueChange={handleBranchChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih cabang" />
                </SelectTrigger>
                <SelectContent>
                  {branchOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Interval</label>
              <Select 
                value={filters.interval} 
                onValueChange={(value: any) => handleIntervalChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Button 
                onClick={fetchAnalyticsData} 
                className="w-full flex items-center gap-2"
              >
                <FaChartLine size={14} />
                <span>Terapkan Filter</span>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t flex justify-between">
          <div className="text-sm text-gray-500">
            Periode: {format(filters.startDate, 'dd MMM yyyy', { locale: id })} - {format(filters.endDate, 'dd MMM yyyy', { locale: id })}
          </div>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <FaDownload size={14} />
            <span>Export Data</span>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Tabs Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="sales-trends" className="flex items-center gap-2">
            <FaChartLine size={14} />
            <span>Tren Penjualan</span>
          </TabsTrigger>
          <TabsTrigger value="inventory-impact" className="flex items-center gap-2">
            <FaExchangeAlt size={14} />
            <span>Dampak Inventaris</span>
          </TabsTrigger>
          <TabsTrigger value="top-products" className="flex items-center gap-2">
            <FaBoxes size={14} />
            <span>Produk Teratas</span>
          </TabsTrigger>
          <TabsTrigger value="branch-performance" className="flex items-center gap-2">
            <FaChartBar size={14} />
            <span>Performa Cabang</span>
          </TabsTrigger>
          <TabsTrigger value="stock-movement" className="flex items-center gap-2">
            <FaChartPie size={14} />
            <span>Analisis Pergerakan</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales-trends" className="space-y-4">
          <SalesTrendsChart 
            data={analyticsData.salesTrends} 
            isLoading={analyticsData.isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="inventory-impact" className="space-y-4">
          <InventoryImpactChart 
            data={analyticsData.inventoryImpact} 
            isLoading={analyticsData.isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="top-products" className="space-y-4">
          <TopProductsChart 
            data={analyticsData.topProducts} 
            isLoading={analyticsData.isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="branch-performance" className="space-y-4">
          <BranchPerformanceChart 
            data={analyticsData.branchPerformance} 
            isLoading={analyticsData.isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="stock-movement" className="space-y-4">
          <StockMovementAnalytics 
            filters={filters}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Data dummy untuk pengujian
const generateDummySalesTrends = () => {
  return {
    labels: ['1 Mar', '2 Mar', '3 Mar', '4 Mar', '5 Mar', '6 Mar', '7 Mar', '8 Mar', '9 Mar', '10 Mar', 
             '11 Mar', '12 Mar', '13 Mar', '14 Mar', '15 Mar', '16 Mar', '17 Mar', '18 Mar', '19 Mar', 
             '20 Mar', '21 Mar', '22 Mar', '23 Mar', '24 Mar', '25 Mar', '26 Mar', '27 Mar', '28 Mar', 
             '29 Mar', '30 Mar'],
    datasets: [
      {
        name: 'Jumlah Transaksi',
        data: [18, 22, 19, 25, 28, 16, 21, 17, 23, 24, 20, 18, 15, 22, 25, 18, 21, 23, 19, 17, 
               20, 22, 25, 28, 30, 27, 23, 21, 18, 19]
      },
      {
        name: 'Nilai Penjualan (juta)',
        data: [5.4, 6.2, 5.8, 7.1, 7.8, 4.8, 6.1, 5.2, 6.8, 7.2, 6.0, 5.5, 4.5, 6.3, 7.2, 5.6, 6.2, 
               6.8, 5.8, 5.2, 6.0, 6.5, 7.2, 8.0, 8.8, 7.9, 6.8, 6.2, 5.5, 5.7]
      }
    ],
    summary: {
      totalTransactions: 638,
      totalSalesValue: 189700000,
      averageTransactionValue: 297335,
      peakDay: '25 Mar 2025',
      growthRate: 0.08
    }
  };
};

const generateDummyInventoryImpact = () => {
  return {
    stockChanges: {
      labels: ['Obat Bebas', 'Obat Keras', 'Vitamin & Suplemen', 'Antibiotik', 'Alat Kesehatan', 'Obat Bebas Terbatas'],
      datasets: [
        {
          name: 'Stok Awal',
          data: [5280, 3750, 4200, 1800, 3600, 2250]
        },
        {
          name: 'Stok Akhir',
          data: [4850, 3320, 3750, 1560, 3450, 2020]
        }
      ]
    },
    turnoverRate: {
      labels: ['Obat Bebas', 'Obat Keras', 'Vitamin & Suplemen', 'Antibiotik', 'Alat Kesehatan', 'Obat Bebas Terbatas'],
      data: [0.082, 0.115, 0.107, 0.133, 0.042, 0.102]
    },
    summary: {
      totalStockReduction: 2100,
      percentageReduction: 0.101,
      highestTurnover: 'Antibiotik',
      lowestTurnover: 'Alat Kesehatan',
      stockValue: {
        before: 835250000,
        after: 765580000,
        difference: 69670000
      }
    }
  };
};

const generateDummyTopProducts = () => {
  return {
    byQuantity: [
      { productName: 'Paracetamol 500mg', category: 'Obat Bebas', quantity: 258, stockImpact: 'Sedang' },
      { productName: 'Vitamin C 1000mg', category: 'Vitamin & Suplemen', quantity: 231, stockImpact: 'Sedang' },
      { productName: 'Amoxicillin 500mg', category: 'Obat Keras', quantity: 187, stockImpact: 'Tinggi' },
      { productName: 'Cetirizine 10mg', category: 'Obat Bebas', quantity: 156, stockImpact: 'Rendah' },
      { productName: 'Vitamin B Complex', category: 'Vitamin & Suplemen', quantity: 143, stockImpact: 'Sedang' },
      { productName: 'Masker Medis', category: 'Alat Kesehatan', quantity: 134, stockImpact: 'Rendah' },
      { productName: 'Antasida Tablet', category: 'Obat Bebas', quantity: 127, stockImpact: 'Rendah' },
      { productName: 'Ciprofloxacin 500mg', category: 'Obat Keras', quantity: 98, stockImpact: 'Tinggi' },
      { productName: 'Dexamethasone 0.5mg', category: 'Obat Keras', quantity: 87, stockImpact: 'Tinggi' },
      { productName: 'Hand Sanitizer 500ml', category: 'Alat Kesehatan', quantity: 75, stockImpact: 'Rendah' }
    ],
    byValue: [
      { productName: 'Amoxicillin 500mg', category: 'Obat Keras', value: 14025000, stockImpact: 'Tinggi' },
      { productName: 'Vitamin B Complex', category: 'Vitamin & Suplemen', value: 12155000, stockImpact: 'Sedang' },
      { productName: 'Ciprofloxacin 500mg', category: 'Obat Keras', value: 9850000, stockImpact: 'Tinggi' },
      { productName: 'Vitamin C 1000mg', category: 'Vitamin & Suplemen', value: 8750000, stockImpact: 'Sedang' },
      { productName: 'Dexamethasone 0.5mg', category: 'Obat Keras', value: 7775000, stockImpact: 'Tinggi' },
      { productName: 'Paracetamol 500mg', category: 'Obat Bebas', value: 6450000, stockImpact: 'Sedang' },
      { productName: 'Masker Medis', category: 'Alat Kesehatan', value: 5650000, stockImpact: 'Rendah' },
      { productName: 'Hand Sanitizer 500ml', category: 'Alat Kesehatan', value: 4125000, stockImpact: 'Rendah' },
      { productName: 'Cetirizine 10mg', category: 'Obat Bebas', value: 3920000, stockImpact: 'Rendah' },
      { productName: 'Antasida Tablet', category: 'Obat Bebas', value: 2850000, stockImpact: 'Rendah' }
    ],
    summary: {
      topCategory: 'Obat Bebas',
      highestValueCategory: 'Obat Keras',
      criticalStockProducts: 2,
      recommendedRestockProducts: 5
    }
  };
};

const generateDummyBranchPerformance = () => {
  return {
    salesPerformance: {
      labels: ['Apotek Pusat - Jakarta', 'Cabang Bandung', 'Cabang Surabaya', 'Cabang Medan'],
      data: [72500000, 48750000, 42800000, 25650000]
    },
    stockEfficiency: {
      labels: ['Apotek Pusat - Jakarta', 'Cabang Bandung', 'Cabang Surabaya', 'Cabang Medan'],
      data: [0.92, 0.88, 0.85, 0.79]
    },
    summary: {
      topPerformingBranch: 'Apotek Pusat - Jakarta',
      mostEfficientBranch: 'Apotek Pusat - Jakarta',
      leastEfficientBranch: 'Cabang Medan',
      averageEfficiency: 0.85
    }
  };
};

export default POSAnalytics;
