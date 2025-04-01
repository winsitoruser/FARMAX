import React, { useState } from 'react';
import { 
  FaBoxOpen, FaChartBar, FaExchangeAlt, FaCalendarTimes, 
  FaWarehouse, FaShoppingCart, FaClock, FaLayerGroup,
  FaArrowUp, FaArrowDown, FaFilter
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { formatRupiah } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Impor dinamis untuk Chart.js untuk menghindari error SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Data sampel untuk visualisasi
const stockSummary = {
  totalValue: 2842000000,
  totalProducts: 3568,
  stockIncreasePercent: 3.2,
  stockDecreasePercent: 1.5,
  activeBatches: 425,
  nearExpiryValue: 175000000,
  lowStockCount: 42,
  inventoryTurnover: 3.8
};

// Data stok per kategori
const stockByCategory = [
  { category: 'Obat Bebas', value: 950000000, percentage: 33.4, growth: 2.5 },
  { category: 'Obat Bebas Terbatas', value: 645000000, percentage: 22.7, growth: 1.8 },
  { category: 'Obat Keras', value: 720000000, percentage: 25.3, growth: -1.2 },
  { category: 'Antibiotik', value: 235000000, percentage: 8.3, growth: 3.6 },
  { category: 'Vitamin dan Suplemen', value: 185000000, percentage: 6.5, growth: 8.4 },
  { category: 'Alat Kesehatan', value: 107000000, percentage: 3.8, growth: 4.9 }
];

// Data stok per cabang
const stockByBranch = [
  { branch: 'Apotek Pusat - Jakarta', value: 1250000000, count: 1520, stockHealth: 95 },
  { branch: 'Cabang Bandung', value: 620000000, count: 840, stockHealth: 82 },
  { branch: 'Cabang Surabaya', value: 580000000, count: 750, stockHealth: 88 },
  { branch: 'Cabang Medan', value: 392000000, count: 458, stockHealth: 76 }
];

// Data pergerakan stok
const stockMovement = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  series: [
    { name: 'Masuk', data: [28, 32, 36, 40, 38, 44, 42, 46, 48, 45, 52, 53] },
    { name: 'Keluar', data: [25, 30, 32, 37, 35, 39, 40, 41, 43, 40, 45, 48] },
  ]
};

// Data kedaluwarsa per kategori
const expiryByCategory = {
  labels: ['Obat Bebas', 'Obat Bebas Terbatas', 'Obat Keras', 'Antibiotik', 'Vitamin dan Suplemen', 'Alat Kesehatan'],
  series: [15, 8, 12, 25, 5, 2]
};

// Data transfer stok
const stockTransferSummary = {
  pending: 8,
  approved: 12,
  inTransit: 5,
  completed: 35,
  canceled: 2,
  totalValueTransferred: 560000000
};

// Data produk stok menipis
const lowStockProducts = [
  { id: 'P001', name: 'Paracetamol 500mg', category: 'Obat Bebas', stock: 15, minStock: 50, value: 15 * 12500 },
  { id: 'P002', name: 'Amoxicillin 500mg', category: 'Antibiotik', stock: 8, minStock: 30, value: 8 * 35000 },
  { id: 'P003', name: 'Vitamin C 1000mg', category: 'Vitamin dan Suplemen', stock: 12, minStock: 40, value: 12 * 15000 },
  { id: 'P004', name: 'Masker Medis', category: 'Alat Kesehatan', stock: 25, minStock: 100, value: 25 * 8000 },
  { id: 'P005', name: 'Omeprazole 20mg', category: 'Obat Keras', stock: 10, minStock: 30, value: 10 * 18000 }
];

const DashboardInventaris: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedBranch, setSelectedBranch] = useState('all');
  
  // Opsi chart untuk pergerakan stok
  const stockMovementOptions = {
    chart: {
      type: 'area' as const,
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#ff7b00', '#ff4500'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    xaxis: {
      categories: stockMovement.labels
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value} jt`
      }
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      floating: false
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} juta rupiah`
      }
    }
  };
  
  // Opsi chart untuk kedaluwarsa per kategori
  const expiryByCategoryOptions = {
    chart: {
      type: 'donut' as const,
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#FF5722', '#FF9800', '#FFC107', '#FFD54F', '#FFE082', '#FFECB3'],
    labels: expiryByCategory.labels,
    legend: {
      position: 'bottom' as const
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        },
        legend: {
          position: 'bottom' as const
        }
      }
    }]
  };
  
  // Opsi chart untuk stok per kategori
  const stockByCategoryOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#ff7b00'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        barHeight: '60%',
        distributed: false
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: stockByCategory.map(item => item.category),
      labels: {
        formatter: (value: number) => `${Math.round(value/1000000)} jt`
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatRupiah(value)
      }
    }
  };
  
  // Data stok per kategori
  const stockByCategorySeries = [{
    name: 'Nilai Stok',
    data: stockByCategory.map(item => item.value)
  }];
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Inventaris</h1>
          <p className="text-gray-500">Monitoring stok, pergerakan, dan kedaluwarsa</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-[180px]">
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
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Triwulan Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Kartu ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaBoxOpen className="text-orange-500" size={16} />
              <span>Total Stok</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(stockSummary.totalValue)}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {stockSummary.totalProducts.toLocaleString()} produk
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <FaArrowUp size={10} /> {stockSummary.stockIncreasePercent}%
                </Badge>
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                  <FaArrowDown size={10} /> {stockSummary.stockDecreasePercent}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaCalendarTimes className="text-red-500" size={16} />
              <span>Stok Mendekati Kedaluwarsa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(stockSummary.nearExpiryValue)}</div>
            <div className="flex items-center mt-2">
              <Progress value={Math.round((stockSummary.nearExpiryValue / stockSummary.totalValue) * 100)} className="h-2" />
              <span className="ml-2 text-xs text-gray-500">
                {Math.round((stockSummary.nearExpiryValue / stockSummary.totalValue) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaShoppingCart className="text-purple-500" size={16} />
              <span>Inventaris Turnover</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockSummary.inventoryTurnover}x</div>
            <div className="flex items-center mt-2">
              <p className="text-xs text-gray-500">
                Perputaran stok per {selectedPeriod === 'month' ? 'bulan' : 
                  selectedPeriod === 'quarter' ? 'triwulan' : 
                  selectedPeriod === 'year' ? 'tahun' : 'minggu'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaWarehouse className="text-amber-500" size={16} />
              <span>Stok Menipis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockSummary.lowStockCount} produk</div>
            <div className="flex items-center mt-2">
              <Progress 
                value={Math.round((stockSummary.lowStockCount / stockSummary.totalProducts) * 100)} 
                className="h-2"
              />
              <span className="ml-2 text-xs text-gray-500">
                {Math.round((stockSummary.lowStockCount / stockSummary.totalProducts) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Grafik dan detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Grafik pergerakan stok */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FaChartBar className="text-orange-500" />
              <span>Pergerakan Stok</span>
            </CardTitle>
            <CardDescription>
              Tren penerimaan dan pengeluaran stok
            </CardDescription>
          </CardHeader>
          <CardContent>
            {typeof window !== 'undefined' && (
              <Chart
                options={stockMovementOptions}
                series={stockMovement.series}
                type="area"
                height={320}
              />
            )}
          </CardContent>
        </Card>
        
        {/* Distribusi stok per kategori */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FaLayerGroup className="text-orange-500" />
              <span>Stok per Kategori</span>
            </CardTitle>
            <CardDescription>
              Distribusi nilai stok berdasarkan kategori produk
            </CardDescription>
          </CardHeader>
          <CardContent>
            {typeof window !== 'undefined' && (
              <Chart
                options={stockByCategoryOptions}
                series={stockByCategorySeries}
                type="bar"
                height={320}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stok per cabang */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FaWarehouse className="text-orange-500" />
              <span>Stok per Cabang</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockByBranch.map((branch, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{branch.branch}</span>
                    <span className="text-sm font-medium">{formatRupiah(branch.value)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={branch.stockHealth} className="h-2" />
                    <span className="text-xs text-gray-500">{branch.stockHealth}%</span>
                  </div>
                  <p className="text-xs text-gray-500">{branch.count.toLocaleString()} produk</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Kedaluwarsa per kategori */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FaCalendarTimes className="text-orange-500" />
              <span>Kedaluwarsa per Kategori</span>
            </CardTitle>
            <CardDescription>
              Distribusi produk kedaluwarsa dan mendekati kedaluwarsa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {typeof window !== 'undefined' && (
              <Chart
                options={expiryByCategoryOptions}
                series={expiryByCategory.series}
                type="donut"
                height={250}
              />
            )}
            <div className="mt-2 text-xs text-center text-gray-500">
              Total: {expiryByCategory.series.reduce((a, b) => a + b, 0)} produk
            </div>
          </CardContent>
        </Card>
        
        {/* Transfer stok */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FaExchangeAlt className="text-orange-500" />
              <span>Transfer Stok</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-md text-center">
                <div className="text-lg font-bold text-orange-700">{stockTransferSummary.pending}</div>
                <div className="text-xs text-gray-600">Menunggu</div>
              </div>
              <div className="bg-green-50 p-3 rounded-md text-center">
                <div className="text-lg font-bold text-green-700">{stockTransferSummary.approved}</div>
                <div className="text-xs text-gray-600">Disetujui</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md text-center">
                <div className="text-lg font-bold text-blue-700">{stockTransferSummary.inTransit}</div>
                <div className="text-xs text-gray-600">Dalam Pengiriman</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-md text-center">
                <div className="text-lg font-bold text-purple-700">{stockTransferSummary.completed}</div>
                <div className="text-xs text-gray-600">Selesai</div>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Total Nilai Transfer:</span>
              </div>
              <div className="text-lg font-bold">
                {formatRupiah(stockTransferSummary.totalValueTransferred)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stok menipis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaWarehouse className="text-orange-500" />
              <span>Stok Menipis</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Lihat Semua
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="border rounded-md p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{product.name}</span>
                  <Badge className="bg-red-100 text-red-800">Menipis</Badge>
                </div>
                <div>
                  <span className="text-xs text-gray-500">{product.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={Math.round((product.stock / product.minStock) * 100)} 
                    className="h-2"
                  />
                  <span className="text-xs font-medium">{product.stock}/{product.minStock}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Nilai stok:</span>
                  <span className="text-xs font-medium">{formatRupiah(product.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardInventaris;
