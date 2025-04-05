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
import { formatRupiah } from '@/lib/utils';
import { FaArrowDown, FaExchangeAlt } from 'react-icons/fa';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  LineChart, Line, CartesianGrid, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

interface InventoryImpactChartProps {
  data: any;
  isLoading: boolean;
}

const InventoryImpactChart: React.FC<InventoryImpactChartProps> = ({ 
  data, 
  isLoading 
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!data && !isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dampak Inventaris</CardTitle>
          <CardDescription>Data tidak tersedia</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Tidak ada data dampak inventaris yang tersedia</p>
        </CardContent>
      </Card>
    );
  }
  
  // Format data for stock changes for Recharts
  const stockChangesData = data?.stockChanges?.labels?.map((label: string, index: number) => ({
    category: label,
    "Stok Awal": data.stockChanges.datasets[0].data[index],
    "Stok Akhir": data.stockChanges.datasets[1].data[index]
  })) || [];

  // Format data for turnover rate for Recharts
  const turnoverRateData = data?.turnoverRate?.labels?.map((label: string, index: number) => ({
    category: label,
    turnover: data.turnoverRate.data[index]
  })) || [];

  // Render komponen
  return (
    <Card className="w-full shadow-md border-orange-100 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
      <CardHeader>
        <CardTitle>Dampak Inventaris</CardTitle>
        <CardDescription>
          Analisis perubahan stok dan tingkat perputaran produk
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Perubahan Stok</h3>
                <div className="h-[300px]">
                  {isMounted && (
                    <ClientOnlyRecharts height={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stockChangesData}
                          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                          <XAxis 
                            dataKey="category" 
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                          />
                          <YAxis 
                            tickFormatter={(value) => value.toFixed(0)} 
                            label={{ value: 'Jumlah Stok', angle: -90, position: 'insideLeft', dy: 50 }}
                          />
                          <Tooltip 
                            formatter={(value: any) => [`${value.toFixed(0)} unit`, '']}
                            contentStyle={{ 
                              fontSize: '12px',
                              fontFamily: 'Inter, sans-serif',
                              borderRadius: '4px'
                            }}
                          />
                          <Legend 
                            wrapperStyle={{ 
                              fontSize: '12px',
                              fontFamily: 'Inter, sans-serif',
                              paddingTop: '20px'
                            }}
                          />
                          <Bar 
                            dataKey="Stok Awal" 
                            fill="#2563eb" 
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                          />
                          <Bar 
                            dataKey="Stok Akhir" 
                            fill="#f97316" 
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ClientOnlyRecharts>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Tingkat Perputaran Stok</h3>
                <div className="h-[200px]">
                  {isMounted && (
                    <ClientOnlyRecharts height={200}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={turnoverRateData}
                          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                        >
                          <defs>
                            <linearGradient id="colorTurnover" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#fdba74" stopOpacity={0.8}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                          <XAxis 
                            dataKey="category" 
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                          />
                          <YAxis 
                            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} 
                            label={{ value: 'Tingkat Perputaran', angle: -90, position: 'insideLeft', dy: 40 }}
                          />
                          <Tooltip 
                            formatter={(value: any) => [`${(value * 100).toFixed(1)}%`, 'Tingkat Perputaran']}
                            contentStyle={{ 
                              fontSize: '12px',
                              fontFamily: 'Inter, sans-serif',
                              borderRadius: '4px'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="turnover" 
                            stroke="url(#colorTurnover)" 
                            strokeWidth={3}
                            dot={{ 
                              r: 5,
                              stroke: '#f97316',
                              strokeWidth: 2,
                              fill: '#fff'
                            }}
                            activeDot={{ 
                              r: 7,
                              stroke: '#f97316',
                              strokeWidth: 2,
                              fill: '#fff'
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ClientOnlyRecharts>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="shadow-md border-orange-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Pengurangan Stok</div>
                  <div className="text-2xl font-bold mt-1 flex items-center gap-2">
                    {data?.summary?.totalStockReduction.toLocaleString()}
                    <span className="text-sm font-normal text-red-600 flex items-center">
                      <FaArrowDown size={10} className="mr-1" />
                      {(data?.summary?.percentageReduction * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-orange-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Nilai Stok Sebelum</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.stockValue?.before)}</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-orange-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Nilai Stok Sesudah</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.stockValue?.after)}</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-orange-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Selisih Nilai Stok</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.stockValue?.difference)}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="shadow-md border-orange-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Perputaran Tertinggi</div>
                      <div className="text-lg font-bold">{data?.summary?.highestTurnover}</div>
                    </div>
                    <Badge className="px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                      {(data?.summary?.highestTurnoverRate * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-orange-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Perputaran Terendah</div>
                      <div className="text-lg font-bold">{data?.summary?.lowestTurnover}</div>
                    </div>
                    <Badge className="px-2 py-1 bg-red-100 text-red-700 rounded-lg">
                      {(data?.summary?.lowestTurnoverRate * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryImpactChart;
