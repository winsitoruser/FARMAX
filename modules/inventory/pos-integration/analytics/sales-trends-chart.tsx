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
import { formatRupiah } from '@/lib/utils';
import { FaArrowUp, FaArrowDown, FaChartLine } from 'react-icons/fa';
import { 
  LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

interface SalesTrendsChartProps {
  data: any;
  isLoading: boolean;
}

const SalesTrendsChart: React.FC<SalesTrendsChartProps> = ({ 
  data, 
  isLoading 
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [activePeriod, setActivePeriod] = useState<string>('all');
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!data && !isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tren Penjualan</CardTitle>
          <CardDescription>Data tidak tersedia</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Tidak ada data tren penjualan yang tersedia</p>
        </CardContent>
      </Card>
    );
  }
  
  // Process the chart data
  const formatChartData = () => {
    if (!data || !data.dailyTrends) return [];
    
    return data.dailyTrends.map((item: any) => ({
      date: item.date,
      sales: item.value,
      target: item.target
    }));
  };
  
  // Get growth percentage and direction
  const getGrowthStats = () => {
    if (!data || !data.growthStats) return { percentage: 0, isPositive: true };
    
    return {
      percentage: Math.abs(data.growthStats.percentage),
      isPositive: data.growthStats.percentage >= 0
    };
  };
  
  const chartData = formatChartData();
  const { percentage, isPositive } = getGrowthStats();
  
  // Period filter options
  const periodOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'week', label: '7 Hari' },
    { value: 'month', label: '30 Hari' },
    { value: 'quarter', label: '90 Hari' }
  ];
  
  // Color constants
  const salesLineColor = '#f97316';
  const targetLineColor = '#64748b';

  if (isLoading) {
    return (
      <Card className="w-full border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader>
          <CardTitle>Tren Penjualan</CardTitle>
          <CardDescription>Analisis perkembangan penjualan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="w-full h-[400px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-orange-200 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Tren Penjualan</CardTitle>
          <CardDescription>
            Analisis perkembangan penjualan periode {data?.period}
          </CardDescription>
        </div>
        <FaChartLine className="h-5 w-5 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Summary Cards */}
            <Card className="border-orange-100 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Penjualan</div>
                <div className="text-2xl font-bold">{formatRupiah(data?.summary?.totalSales)}</div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-100 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Rata-rata Harian</div>
                <div className="text-2xl font-bold">{formatRupiah(data?.summary?.dailyAverage)}</div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-100 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Pencapaian Target</div>
                <div className="text-2xl font-bold">{data?.summary?.targetAchievement}%</div>
              </CardContent>
            </Card>
            
            <Card className="border-orange-100 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Pertumbuhan</div>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{percentage}%</div>
                  {isPositive ? (
                    <FaArrowUp className="text-green-500 ml-1" />
                  ) : (
                    <FaArrowDown className="text-red-500 ml-1" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chart Controls */}
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Tren Penjualan vs Target</div>
            <div className="flex space-x-2">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    activePeriod === option.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setActivePeriod(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart */}
          {isMounted && (
            <ClientOnlyRecharts height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRevenueBlend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="50%" stopColor="#f97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tickFormatter={(value: any) => 
                      value >= 1000000 
                        ? `${Math.floor(value / 1000000)}jt` 
                        : value.toString()
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'sales') return [formatRupiah(Number(value)), 'Penjualan'];
                      if (name === 'target') return [formatRupiah(Number(value)), 'Target'];
                      return [value, name];
                    }}
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
                    dataKey="sales" 
                    name="Penjualan"
                    stroke={salesLineColor} 
                    fill="url(#colorRevenueBlend)" 
                    activeDot={{ r: 6, fill: salesLineColor }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    name="Target"
                    stroke={targetLineColor} 
                    strokeDasharray="5 5"
                    dot={false}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ClientOnlyRecharts>
          )}
          
          {/* Insights */}
          <div className="mt-4 text-sm text-gray-600">
            <h3 className="font-medium mb-2">Insights:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Penjualan bulan ini mencapai {data?.summary?.targetAchievement}% dari target</li>
              <li>
                {isPositive
                  ? `Terjadi kenaikan ${percentage}% dibanding periode sebelumnya`
                  : `Terjadi penurunan ${percentage}% dibanding periode sebelumnya`}
              </li>
              <li>Performa terbaik pada {data?.insights?.bestDay?.date} dengan penjualan {formatRupiah(data?.insights?.bestDay?.value)}</li>
              <li>Tren penjualan menunjukkan pola {data?.insights?.trend}</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-xs text-gray-500">
          * Data diperbarui pada {new Date(data?.lastUpdated).toLocaleString('id-ID')}
        </p>
      </CardFooter>
    </Card>
  );
};

export default SalesTrendsChart;
