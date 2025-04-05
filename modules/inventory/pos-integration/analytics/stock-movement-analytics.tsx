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
import { 
  FaChartPie, FaBoxes, FaArrowUp, FaArrowDown,
  FaExchangeAlt, FaFilter, FaDownload 
} from 'react-icons/fa';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  LineChart, Line, CartesianGrid, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

import { POSIntegrationAPI } from '../services/api-service';
import { POSErrorManager } from '../services/error-service';

// Import dinamis untuk chart.js
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Utility function to retry operations with error handling
const executeWithRetry = async (operation: () => Promise<any>, maxRetries = 3): Promise<any> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        console.error('Maximum retries exceeded:', error);
        const errorManager = POSErrorManager.getInstance();
        await errorManager.logError(
          'stock-movement',
          'fetch-data',
          'error',
          error instanceof Error ? error.message : 'Unknown error',
          { error },
          error instanceof Error ? error.stack : undefined
        );
        throw error;
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
};

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
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect untuk memuat data analytics
  useEffect(() => {
    fetchStockMovementData();
  }, [filters]);

  // Fungsi untuk memuat data analytics
  const fetchStockMovementData = async () => {
    setIsLoading(true);
    
    try {
      // Menggunakan error manager untuk menangani error
      await executeWithRetry(
        async () => {
          // Parameter dasar untuk request
          const params = {
            startDate: filters.startDate.toISOString(),
            endDate: filters.endDate.toISOString(),
            interval: filters.interval,
            branchId: filters.branchId
          };
          
          // Mengambil data dari API
          const response = await POSIntegrationAPI.getStockMovements(params);
          setAnalyticsData(response.data);
        }
      );
    } catch (error) {
      console.error('Failed to fetch stock movement analytics:', error);
      // Untuk demo, gunakan data dummy jika API belum tersedia
      setAnalyticsData(generateDummyData());
    } finally {
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
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!data) return <div>Tidak ada data kategori</div>;

  // Custom colors for pie chart
  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fde68a', '#fcd34d'];
  
  // Format data for Recharts
  const formattedPieData = data.labels.map((label: string, index: number) => ({
    name: label,
    value: data.values[index]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-md border-orange-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
            <CardHeader>
              <CardTitle className="text-lg">Distribusi Pergerakan Stok per Kategori</CardTitle>
              <CardDescription>Perbandingan unit yang terjual berdasarkan kategori produk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {isMounted && (
                  <ClientOnlyRecharts height={350}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formattedPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: { name: string; percent: number }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {formattedPieData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`${value.toLocaleString()} unit`, 'Jumlah']}
                          contentStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '4px'
                          }}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
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
            {isMounted && (
              <ClientOnlyRecharts height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.byCategory}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="category" />
                    <YAxis 
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toLocaleString()} unit`, 'Jumlah']}
                      contentStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    <Bar 
                      dataKey="in" 
                      name="Stok Masuk" 
                      fill="#f97316" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="out" 
                      name="Stok Keluar" 
                      fill="#64748b" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnlyRecharts>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Komponen untuk analisis timeline
const TimelineAnalysis: React.FC<{ data: any }> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!data) return <div>Tidak ada data timeline</div>;
  
  // Format data for Recharts
  const formattedTimelineData = data.labels.map((label: string, index: number) => ({
    date: label,
    in: data.series[0].data[index],
    out: data.series[1].data[index]
  }));

  // Format data for stacked bar chart
  const formattedBarData = data.byDay.map((item: any) => ({
    day: item.day,
    stockIn: item.in,
    stockOut: item.out,
    net: item.net
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-orange-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader>
            <CardTitle className="text-lg">Tren Pergerakan Stok</CardTitle>
            <CardDescription>Pola pergerakan stok masuk dan keluar dari waktu ke waktu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {isMounted && (
                <ClientOnlyRecharts height={350}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={formattedTimelineData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorStockIn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorStockOut" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#64748b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#64748b" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        label={{ value: 'Unit', angle: -90, position: 'insideLeft' }}
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toLocaleString()} unit`, 'Jumlah']}
                        contentStyle={{
                          fontSize: '12px',
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '4px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{
                          fontSize: '12px',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="in" 
                        name="Stok Masuk"
                        stroke="#f97316" 
                        fillOpacity={1}
                        fill="url(#colorStockIn)" 
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="out" 
                        name="Stok Keluar"
                        stroke="#64748b" 
                        fillOpacity={1}
                        fill="url(#colorStockOut)" 
                        activeDot={{ r: 6 }}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ClientOnlyRecharts>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-orange-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader>
            <CardTitle className="text-lg">Perbandingan Harian</CardTitle>
            <CardDescription>Perbandingan stok masuk vs keluar per hari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              {isMounted && (
                <ClientOnlyRecharts height={350}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formattedBarData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                      <XAxis dataKey="day" />
                      <YAxis 
                        tickFormatter={(value) => `${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${value.toLocaleString()} unit`, 'Jumlah']}
                        contentStyle={{
                          fontSize: '12px',
                          fontFamily: 'Inter, sans-serif',
                          borderRadius: '4px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{
                          fontSize: '12px',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      />
                      <Bar 
                        dataKey="stockIn" 
                        name="Stok Masuk" 
                        fill="#f97316" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="stockOut" 
                        name="Stok Keluar" 
                        fill="#64748b" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ClientOnlyRecharts>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md border-orange-100">
        <CardHeader>
          <CardTitle className="text-lg">Penjualan vs Stok Tersisa</CardTitle>
          <CardDescription>Dampak penjualan pada level stok produk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isMounted && (
              <ClientOnlyRecharts height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.byDay}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="day" />
                    <YAxis 
                      label={{ value: 'Unit', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(value) => `${value.toLocaleString()}`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      tickFormatter={(value) => `${value.toFixed(1)}%`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value.toLocaleString()} unit`, 'Jumlah']}
                      contentStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '4px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sold" 
                      name="Unit Terjual"
                      stroke="#f97316" 
                      strokeWidth={2}
                      yAxisId="left"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stockLevel" 
                      name="Stok Tersisa (%)"
                      stroke="#64748b" 
                      strokeWidth={2}
                      yAxisId="right"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ClientOnlyRecharts>
            )}
          </div>
        </CardContent>
      </Card>
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
      series: [
        {
          name: 'Stok Masuk',
          data: [110, 95, 80, 120, 85, 60, 75, 0, 145, 0, 0, 185, 0, 0, 95, 0, 200, 0, 0, 120, 0, 0, 
                 185, 0, 0, 95, 0, 145, 0, 130]
        },
        {
          name: 'Stok Keluar',
          data: [72, 68, 75, 82, 79, 45, 68, 73, 89, 91, 87, 65, 71, 63, 82, 76, 80, 72, 68, 75, 73, 
                 79, 85, 92, 95, 89, 85, 82, 78, 82]
        }
      ],
      byDay: [
        { day: '01 Mar', sold: 72, stockLevel: 95 },
        { day: '02 Mar', sold: 68, stockLevel: 90 },
        { day: '03 Mar', sold: 75, stockLevel: 88 },
        { day: '04 Mar', sold: 82, stockLevel: 85 },
        { day: '05 Mar', sold: 79, stockLevel: 82 },
        { day: '06 Mar', sold: 45, stockLevel: 80 },
        { day: '07 Mar', sold: 68, stockLevel: 78 },
        { day: '08 Mar', sold: 73, stockLevel: 76 },
        { day: '09 Mar', sold: 89, stockLevel: 74 },
        { day: '10 Mar', sold: 91, stockLevel: 72 },
        { day: '11 Mar', sold: 87, stockLevel: 70 },
        { day: '12 Mar', sold: 65, stockLevel: 68 },
        { day: '13 Mar', sold: 71, stockLevel: 66 },
        { day: '14 Mar', sold: 63, stockLevel: 64 },
        { day: '15 Mar', sold: 82, stockLevel: 62 },
        { day: '16 Mar', sold: 76, stockLevel: 60 },
        { day: '17 Mar', sold: 80, stockLevel: 58 },
        { day: '18 Mar', sold: 72, stockLevel: 56 },
        { day: '19 Mar', sold: 68, stockLevel: 54 },
        { day: '20 Mar', sold: 75, stockLevel: 52 },
        { day: '21 Mar', sold: 73, stockLevel: 50 },
        { day: '22 Mar', sold: 79, stockLevel: 48 },
        { day: '23 Mar', sold: 85, stockLevel: 46 },
        { day: '24 Mar', sold: 92, stockLevel: 44 },
        { day: '25 Mar', sold: 95, stockLevel: 42 },
        { day: '26 Mar', sold: 89, stockLevel: 40 },
        { day: '27 Mar', sold: 85, stockLevel: 38 },
        { day: '28 Mar', sold: 82, stockLevel: 36 },
        { day: '29 Mar', sold: 78, stockLevel: 34 },
        { day: '30 Mar', sold: 82, stockLevel: 32 }
      ]
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
