import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { formatRupiah } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { 
  FaChartPie, FaBoxes, FaArrowUp, FaArrowDown,
  FaExchangeAlt, FaFilter, FaDownload 
} from 'react-icons/fa';

import { POSIntegrationAPI } from '../services/api-service';
import { errorManager } from '../services/error-service';

// Import dinamis untuk chart.js
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockMovementAnalyticsProps {
  filters: {
    startDate: Date;
    endDate: Date;
    branchId: string;
    interval: 'daily' | 'weekly' | 'monthly';
  };
}

// Kategori produk untuk filter
const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'obat-bebas', label: 'Obat Bebas' },
  { value: 'obat-keras', label: 'Obat Keras' },
  { value: 'vitamin', label: 'Vitamin & Suplemen' },
  { value: 'antibiotik', label: 'Antibiotik' },
  { value: 'alkes', label: 'Alat Kesehatan' },
  { value: 'obat-bebas-terbatas', label: 'Obat Bebas Terbatas' }
];

const StockMovementAnalytics: React.FC<StockMovementAnalyticsProps> = ({ 
  filters 
}) => {
  const [activeTab, setActiveTab] = useState('category');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Effect untuk memuat data analytics
  useEffect(() => {
    fetchStockMovementData();
  }, [filters]);

  // Mengambil data pergerakan stok dari API
  const fetchStockMovementData = async () => {
    setIsLoading(true);
    
    try {
      // Menggunakan error manager untuk menangani error
      await errorManager.executeWithRetry(
        async () => {
          // Parameter dasar untuk request
          const params = {
            startDate: filters.startDate.toISOString().split('T')[0],
            endDate: filters.endDate.toISOString().split('T')[0],
            branchId: filters.branchId === 'all' ? undefined : filters.branchId,
            groupBy: 'category'
          };
          
          // Dalam kasus nyata, ini akan memanggil API
          // const response = await POSIntegrationAPI.getStockMovementSummary(params);
          // setAnalyticsData(response.data);
          
          // Untuk demo, gunakan data dummy
          setAnalyticsData(generateDummyData());
          setIsLoading(false);
        },
        'POS Analytics',
        'fetchStockMovementData',
        { severity: 'warning' }
      );
    } catch (error) {
      console.error('Failed to fetch stock movement data:', error);
      
      // Set data dummy jika error
      setAnalyticsData(generateDummyData());
      setIsLoading(false);
    }
  };

  // Render komponen
  return (
    <div className="space-y-4">
      {/* Header dan Filter */}
      <Card className="overflow-hidden">
        <CardHeader className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          {/* Elemen dekoratif berbentuk lingkaran dengan blur */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 blur-xl transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white opacity-10 blur-xl transform -translate-x-10 translate-y-10"></div>
          
          <CardTitle className="text-xl font-bold z-10">Analisis Pergerakan Stok</CardTitle>
          <CardDescription className="text-white/80 z-10">
            Analisis mendalam tentang bagaimana transaksi POS mempengaruhi tingkat stok produk
          </CardDescription>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-2 z-10">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white w-full sm:w-48">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
              onClick={fetchStockMovementData}
            >
              <FaFilter size={14} />
              <span>Terapkan Filter</span>
            </Button>
            
            <Button
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 ml-auto hidden sm:flex items-center gap-2"
            >
              <FaDownload size={14} />
              <span>Export</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full p-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
              <TabsTrigger 
                value="category" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Analisis Kategori
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Analisis Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="category" className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-[400px] w-full rounded-xl" />
              ) : (
                <CategoryAnalysis data={analyticsData?.categoryData} />
              )}
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-[400px] w-full rounded-xl" />
              ) : (
                <TimelineAnalysis data={analyticsData?.timelineData} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Ringkasan Statistik */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Transaksi POS</p>
                  <h3 className="text-2xl font-bold mt-1">{analyticsData?.summary?.totalTransactions}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaBoxes className="text-orange-500" size={20} />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Dari {analyticsData?.summary?.totalProducts} produk berbeda
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Stok Masuk</p>
                  <h3 className="text-2xl font-bold mt-1">{analyticsData?.summary?.totalIn.toLocaleString()}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-teal-100 flex items-center justify-center">
                  <FaArrowUp className="text-green-500" size={20} />
                </div>
              </div>
              <div className="mt-4 text-sm text-green-500 font-medium">
                {formatRupiah(analyticsData?.summary?.valueIn)} nilai inventaris
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Stok Keluar</p>
                  <h3 className="text-2xl font-bold mt-1">{analyticsData?.summary?.totalOut.toLocaleString()}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center">
                  <FaArrowDown className="text-red-500" size={20} />
                </div>
              </div>
              <div className="mt-4 text-sm text-red-500 font-medium">
                {formatRupiah(analyticsData?.summary?.valueOut)} nilai jual
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Efisiensi Pergerakan</p>
                  <h3 className="text-2xl font-bold mt-1">{(analyticsData?.summary?.efficiency * 100).toFixed(1)}%</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  <FaExchangeAlt className="text-blue-500" size={20} />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Perputaran rata-rata: {analyticsData?.summary?.avgTurnover.toFixed(1)} hari
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Komponen untuk analisis kategori
const CategoryAnalysis: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>Tidak ada data kategori</div>;

  // Options untuk grafik perbandingan kategori (Pie chart)
  const categoryOptions = {
    chart: {
      type: 'pie' as const,
      toolbar: {
        show: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#ff6b35', '#f7c59f', '#ffdc5e', '#8d99ae', '#5aa9e6', '#9a348e', '#2a9d8f'],
    labels: data.labels,
    legend: {
      position: 'bottom' as const
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${Math.round(val)}%`
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toLocaleString()} unit`
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom' as const
        }
      }
    }]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-md border-orange-100">
            <CardHeader>
              <CardTitle className="text-lg">Distribusi Pergerakan Stok per Kategori</CardTitle>
              <CardDescription>Perbandingan unit yang terjual berdasarkan kategori produk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {typeof window !== 'undefined' && (
                  <Chart
                    options={categoryOptions}
                    series={data.values}
                    type="pie"
                    height={350}
                    width="100%"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full shadow-md border-orange-100">
            <CardHeader>
              <CardTitle className="text-lg">Detail Kategori</CardTitle>
              <CardDescription>Ringkasan pergerakan per kategori</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-4 space-y-4 h-[350px] overflow-auto">
                {data.details.map((item: any, index: number) => (
                  <div key={index} className="border-b pb-4">
                    <h4 className="font-medium text-base">{item.category}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <p className="text-gray-500">Unit Keluar:</p>
                        <p className="font-medium">{item.out.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Nilai:</p>
                        <p className="font-medium">{formatRupiah(item.value)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">% dari Total:</p>
                        <p className="font-medium">{item.percentage.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Produk:</p>
                        <p className="font-medium">{item.products} item</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="shadow-md border-orange-100">
        <CardHeader>
          <CardTitle className="text-lg">Perbandingan Masuk/Keluar per Kategori</CardTitle>
          <CardDescription>Jumlah unit yang masuk vs keluar berdasarkan kategori</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {typeof window !== 'undefined' && (
              <Chart
                options={{
                  chart: {
                    type: 'bar' as const,
                    stacked: false,
                    toolbar: {
                      show: true
                    },
                    fontFamily: 'Inter, sans-serif'
                  },
                  colors: ['#2a9d8f', '#e76f51'],
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      columnWidth: '55%',
                      borderRadius: 5
                    }
                  },
                  dataLabels: {
                    enabled: false
                  },
                  stroke: {
                    show: true,
                    width: 2,
                    colors: ['transparent']
                  },
                  xaxis: {
                    categories: data.labels
                  },
                  yaxis: {
                    title: {
                      text: 'Unit'
                    }
                  },
                  tooltip: {
                    y: {
                      formatter: (val: number) => `${val.toLocaleString()} unit`
                    }
                  },
                  fill: {
                    opacity: 1
                  },
                  legend: {
                    position: 'top' as const,
                    horizontalAlign: 'right' as const
                  }
                }}
                series={[
                  {
                    name: 'Masuk',
                    data: data.inValues
                  },
                  {
                    name: 'Keluar',
                    data: data.outValues
                  }
                ]}
                type="bar"
                height={300}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Komponen untuk analisis timeline
const TimelineAnalysis: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>Tidak ada data timeline</div>;
  
  const timelineOptions = {
    chart: {
      type: 'area' as const,
      height: 350,
      toolbar: {
        show: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#ff6b35', '#718096'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#ff6b35',
            opacity: 0.8
          },
          {
            offset: 100,
            color: '#ffdc5e',
            opacity: 0.2
          }
        ]
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    markers: {
      size: 3,
      colors: ['#ff6b35'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    xaxis: {
      categories: data.labels,
      title: {
        text: 'Tanggal'
      }
    },
    yaxis: {
      title: {
        text: 'Unit'
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
      y: {
        formatter: (val: number) => `${val.toLocaleString()} unit`
      }
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-md border-orange-100">
        <CardHeader>
          <CardTitle className="text-lg">Tren Pergerakan Stok Harian</CardTitle>
          <CardDescription>Pola pergerakan stok dari waktu ke waktu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            {typeof window !== 'undefined' && (
              <Chart
                options={timelineOptions}
                series={[
                  {
                    name: 'Keluar (POS)',
                    data: data.outValues
                  }
                ]}
                type="area"
                height={350}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md border-orange-100">
          <CardHeader>
            <CardTitle className="text-lg">Perbandingan Masuk/Keluar</CardTitle>
            <CardDescription>Tren masuk dan keluar dalam periode yang sama</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {typeof window !== 'undefined' && (
                <Chart
                  options={{
                    chart: {
                      type: 'line' as const,
                      height: 300,
                      toolbar: {
                        show: false
                      },
                      fontFamily: 'Inter, sans-serif'
                    },
                    colors: ['#2a9d8f', '#e76f51'],
                    stroke: {
                      curve: 'smooth' as const,
                      width: 3
                    },
                    xaxis: {
                      categories: data.labels.slice(-7) // Hanya tampilkan 7 hari terakhir
                    },
                    yaxis: {
                      title: {
                        text: 'Unit'
                      }
                    },
                    markers: {
                      size: 4
                    },
                    tooltip: {
                      y: {
                        formatter: (val: number) => `${val.toLocaleString()} unit`
                      }
                    },
                    legend: {
                      position: 'top' as const,
                      horizontalAlign: 'right' as const
                    }
                  }}
                  series={[
                    {
                      name: 'Masuk',
                      data: data.inValues.slice(-7)
                    },
                    {
                      name: 'Keluar',
                      data: data.outValues.slice(-7)
                    }
                  ]}
                  type="line"
                  height={300}
                />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-orange-100">
          <CardHeader>
            <CardTitle className="text-lg">Penjualan vs Stok Tersisa</CardTitle>
            <CardDescription>Dampak penjualan pada level stok produk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {typeof window !== 'undefined' && (
                <Chart
                  options={{
                    chart: {
                      type: 'line' as const,
                      height: 300,
                      toolbar: {
                        show: false
                      },
                      fontFamily: 'Inter, sans-serif'
                    },
                    colors: ['#e76f51', '#2a9d8f'],
                    stroke: {
                      curve: 'smooth' as const,
                      width: [3, 2],
                      dashArray: [0, 5]
                    },
                    xaxis: {
                      categories: data.labels.slice(-7)
                    },
                    yaxis: [
                      {
                        title: {
                          text: 'Unit Terjual'
                        }
                      },
                      {
                        opposite: true,
                        title: {
                          text: 'Stok Tersisa (%)'
                        },
                        min: 0,
                        max: 100
                      }
                    ],
                    markers: {
                      size: 4
                    },
                    tooltip: {
                      y: {
                        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
                          if (seriesIndex === 0) {
                            return `${val.toLocaleString()} unit`;
                          }
                          return `${val.toFixed(1)}%`;
                        }
                      }
                    },
                    legend: {
                      position: 'top' as const,
                      horizontalAlign: 'right' as const
                    }
                  }}
                  series={[
                    {
                      name: 'Unit Terjual',
                      data: data.outValues.slice(-7)
                    },
                    {
                      name: 'Stok Tersisa (%)',
                      data: data.stockLevels.slice(-7)
                    }
                  ]}
                  type="line"
                  height={300}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Data dummy untuk pengujian
const generateDummyData = () => {
  return {
    categoryData: {
      labels: ['Obat Bebas', 'Obat Keras', 'Vitamin & Suplemen', 'Antibiotik', 'Alat Kesehatan', 'Obat Bebas Terbatas'],
      values: [24, 20, 18, 16, 12, 10],
      inValues: [750, 520, 430, 340, 280, 180],
      outValues: [635, 485, 395, 310, 245, 145],
      details: [
        { category: 'Obat Bebas', out: 635, value: 15875000, percentage: 24, products: 42 },
        { category: 'Obat Keras', out: 485, value: 36375000, percentage: 20, products: 38 },
        { category: 'Vitamin & Suplemen', out: 395, value: 29625000, percentage: 18, products: 25 },
        { category: 'Antibiotik', out: 310, value: 24800000, percentage: 16, products: 15 },
        { category: 'Alat Kesehatan', out: 245, value: 12250000, percentage: 12, products: 30 },
        { category: 'Obat Bebas Terbatas', out: 145, value: 7250000, percentage: 10, products: 12 }
      ]
    },
    timelineData: {
      labels: ['01 Mar', '02 Mar', '03 Mar', '04 Mar', '05 Mar', '06 Mar', '07 Mar', '08 Mar', '09 Mar', '10 Mar', 
               '11 Mar', '12 Mar', '13 Mar', '14 Mar', '15 Mar', '16 Mar', '17 Mar', '18 Mar', '19 Mar', 
               '20 Mar', '21 Mar', '22 Mar', '23 Mar', '24 Mar', '25 Mar', '26 Mar', '27 Mar', '28 Mar', 
               '29 Mar', '30 Mar'],
      inValues: [110, 95, 80, 120, 85, 60, 75, 0, 145, 0, 0, 185, 0, 0, 95, 0, 200, 0, 0, 120, 0, 0, 
                 185, 0, 0, 95, 0, 145, 0, 130],
      outValues: [72, 68, 75, 82, 79, 45, 68, 73, 89, 91, 87, 65, 71, 63, 82, 76, 80, 72, 68, 75, 73, 
                 79, 85, 92, 95, 89, 85, 82, 78, 82],
      stockLevels: [95, 93, 91, 90, 88, 87, 85, 83, 82, 80, 78, 80, 79, 77, 75, 74, 78, 77, 75, 
                    74, 73, 71, 70, 68, 66, 65, 63, 62, 61, 60]
    },
    summary: {
      totalTransactions: 548,
      totalProducts: 162,
      totalIn: 2500,
      totalOut: 2215,
      valueIn: 125000000,
      valueOut: 126175000,
      efficiency: 0.87,
      avgTurnover: 5.2
    }
  };
};

export default StockMovementAnalytics;
