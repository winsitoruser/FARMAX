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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaChartBar, FaStar, FaExchangeAlt, FaStore } from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

interface BranchPerformanceChartProps {
  data: any;
  isLoading: boolean;
}

const BranchPerformanceChart: React.FC<BranchPerformanceChartProps> = ({ 
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
          <CardTitle>Performa Cabang</CardTitle>
          <CardDescription>Data tidak tersedia</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Tidak ada data performa cabang yang tersedia</p>
        </CardContent>
      </Card>
    );
  }
  
  // Helper untuk menentukan warna badge berdasarkan efisiensi
  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 95) return <Badge className="bg-green-500">Sangat Baik</Badge>;
    if (efficiency >= 85) return <Badge className="bg-orange-500">Baik</Badge>;
    if (efficiency >= 75) return <Badge className="bg-yellow-500">Cukup</Badge>;
    return <Badge className="bg-red-500">Kurang</Badge>;
  };

  // Format data for bar chart
  const formatChartData = () => {
    if (!data || !data.branches) return [];
    
    return data.branches.map((branch: any) => ({
      name: branch.name.replace('Apotek ', ''),
      sales: branch.metrics.sales.value,
      inventory: branch.metrics.inventoryTurnover.value,
      profitMargin: branch.metrics.profitMargin.value * 100,
      efficiency: branch.metrics.operationalEfficiency.value
    }));
  };

  const chartData = formatChartData();
  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

  if (isLoading) {
    return (
      <Card className="w-full border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader>
          <CardTitle>Performa Cabang</CardTitle>
          <CardDescription>Perbandingan kinerja antar cabang</CardDescription>
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
          <CardTitle className="text-xl font-bold">Performa Cabang</CardTitle>
          <CardDescription>
            Perbandingan kinerja antar cabang periode {data?.period}
          </CardDescription>
        </div>
        <FaStore className="h-5 w-5 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {data?.branches?.map((branch: any, idx: number) => (
              <Card key={idx} className="border-orange-100 overflow-hidden relative group hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">{branch.name}</CardTitle>
                    {branch.rank <= 3 && (
                      <Badge variant="outline" className="bg-amber-50 border-amber-200">
                        <FaStar className="h-3 w-3 text-amber-500 mr-1" />
                        Top {branch.rank}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Penjualan:</span>
                    <span className="text-xs font-medium">{formatRupiah(branch.metrics.sales.value)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Profit Margin:</span>
                    <span className="text-xs font-medium">{(branch.metrics.profitMargin.value * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Efisiensi:</span>
                    <div className="flex items-center">
                      {getEfficiencyBadge(branch.metrics.operationalEfficiency.value)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {isMounted && chartData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4">Perbandingan Penjualan dan Inventory Turnover</h3>
              <ClientOnlyRecharts height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#f97316" />
                    <YAxis yAxisId="right" orientation="right" stroke="#fb923c" />
                    <Tooltip 
                      contentStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '4px'
                      }}
                      formatter={(value, name) => {
                        if (name === 'sales') return [formatRupiah(value as number), 'Penjualan'];
                        if (name === 'inventory') return [`${value}`, 'Inventory Turnover'];
                        if (name === 'profitMargin') return [`${value}%`, 'Profit Margin'];
                        return [value, name];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="sales" 
                      name="Penjualan" 
                      fill="#f97316" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="inventory" 
                      name="Inventory Turnover" 
                      fill="#fb923c" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnlyRecharts>
            </div>
          )}

          {isMounted && chartData.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-4">Perbandingan Profit Margin dan Efisiensi Operasional</h3>
              <ClientOnlyRecharts height={350}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#fdba74" />
                    <YAxis yAxisId="right" orientation="right" stroke="#fed7aa" />
                    <Tooltip 
                      contentStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '4px'
                      }}
                      formatter={(value, name) => {
                        if (name === 'profitMargin') return [`${value}%`, 'Profit Margin'];
                        if (name === 'efficiency') return [`${value}%`, 'Efisiensi Operasional'];
                        return [value, name];
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    <Bar 
                      yAxisId="left" 
                      dataKey="profitMargin" 
                      name="Profit Margin" 
                      fill="#fdba74" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="efficiency" 
                      name="Efisiensi Operasional" 
                      fill="#fed7aa" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ClientOnlyRecharts>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-3">Detail Metrik per Cabang</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Penjualan</TableHead>
                  <TableHead>Profit Margin</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Efisiensi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.branches?.map((branch: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{branch.name}</TableCell>
                    <TableCell>{formatRupiah(branch.metrics.sales.value)}</TableCell>
                    <TableCell>{(branch.metrics.profitMargin.value * 100).toFixed(1)}%</TableCell>
                    <TableCell>{branch.metrics.inventoryTurnover.value.toFixed(1)}</TableCell>
                    <TableCell className="flex items-center">
                      {getEfficiencyBadge(branch.metrics.operationalEfficiency.value)}
                      <span className="ml-2 text-xs text-gray-500">
                        ({branch.metrics.operationalEfficiency.value}%)
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-gray-500">
          *Data diperbarui pada {new Date(data?.lastUpdated).toLocaleString('id-ID')}
        </p>
      </CardFooter>
    </Card>
  );
};

export default BranchPerformanceChart;
