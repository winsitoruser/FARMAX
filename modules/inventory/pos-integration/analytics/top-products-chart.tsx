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
import { formatRupiah } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaBoxes, FaTag, FaExclamationTriangle, FaArrowUp } from 'react-icons/fa';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Sector 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

interface TopProductsChartProps {
  data: any;
  isLoading: boolean;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ 
  data, 
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState('quantity');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!data && !isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Produk Teratas</CardTitle>
          <CardDescription>Data tidak tersedia</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-gray-500">Tidak ada data produk teratas yang tersedia</p>
        </CardContent>
      </Card>
    );
  }

  // Format the data for Recharts
  const formatChartData = (type: 'quantity' | 'value') => {
    if (!data || !data.topProducts) return [];
    
    const dataArray = type === 'quantity' ? data.topProducts.byQuantity : data.topProducts.byValue;
    if (!dataArray) return [];
    
    return dataArray.map((item: any) => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      fullName: item.name,
      value: type === 'quantity' ? item.quantity : item.value,
      category: item.category,
      stockLevel: item.stockLevel,
      margin: item.margin
    })).slice(0, 10); // Get top 10
  };

  // Custom colors for charts
  const COLORS = [
    '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', 
    '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706'
  ];
  
  // For active shape of pie chart
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14} fontWeight="bold">
          {payload.fullName.length > 20 ? payload.fullName.substring(0, 20) + '...' : payload.fullName}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fontSize={12} fill="#333">
          {activeTab === 'quantity' ? `${value} unit` : formatRupiah(value)}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={10}>
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  // Prepare chart data
  const quantityData = formatChartData('quantity');
  const valueData = formatChartData('value');

  if (isLoading) {
    return (
      <Card className="w-full border-orange-200 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader>
          <CardTitle>Produk Teratas</CardTitle>
          <CardDescription>Produk dengan penjualan tertinggi</CardDescription>
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
          <CardTitle className="text-xl font-bold">Produk Teratas</CardTitle>
          <CardDescription>
            Analisis produk dengan penjualan tertinggi periode {data?.period}
          </CardDescription>
        </div>
        <FaBoxes className="h-5 w-5 text-orange-500" />
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="quantity" 
          value={activeTab} 
          onValueChange={(val) => {
            setActiveTab(val);
            setActiveIndex(0);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-[250px] mb-4">
            <TabsTrigger value="quantity">Berdasarkan Jumlah</TabsTrigger>
            <TabsTrigger value="value">Berdasarkan Nilai</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quantity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {isMounted && (
                  <ClientOnlyRecharts height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={quantityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                        >
                          {quantityData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [`${value} unit`, 'Jumlah']}
                          contentStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '4px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                )}
              </div>
              
              <div>
                {isMounted && (
                  <ClientOnlyRecharts height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={quantityData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={80}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: any) => [`${value} unit`, 'Jumlah']}
                          contentStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '4px'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Jumlah" 
                          radius={[0, 4, 4, 0]}
                        >
                          {quantityData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Terjual</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.topProducts?.byQuantity?.slice(0, 5).map((product: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right">
                        {product.stockLevel < 10 ? (
                          <div className="flex items-center justify-end gap-1 text-amber-600">
                            <FaExclamationTriangle size={12} />
                            <span>{product.stockLevel}</span>
                          </div>
                        ) : (
                          product.stockLevel
                        )}
                      </TableCell>
                      <TableCell className="text-right">{product.margin}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="value" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                {isMounted && (
                  <ClientOnlyRecharts height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={valueData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                        >
                          {valueData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any) => [formatRupiah(value), 'Nilai']}
                          contentStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '4px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                )}
              </div>
              
              <div>
                {isMounted && (
                  <ClientOnlyRecharts height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={valueData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={80}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: any) => [formatRupiah(value), 'Nilai']}
                          contentStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '4px'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Nilai" 
                          radius={[0, 4, 4, 0]}
                        >
                          {valueData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                    <TableHead className="text-right">Stok</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.topProducts?.byValue?.slice(0, 5).map((product: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{formatRupiah(product.value)}</TableCell>
                      <TableCell className="text-right">
                        {product.stockLevel < 10 ? (
                          <div className="flex items-center justify-end gap-1 text-amber-600">
                            <FaExclamationTriangle size={12} />
                            <span>{product.stockLevel}</span>
                          </div>
                        ) : (
                          product.stockLevel
                        )}
                      </TableCell>
                      <TableCell className="text-right">{product.margin}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <FaTag className="text-orange-500 mt-1" size={14} />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Rekomendasi:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Produk {data?.insights?.topProduct} adalah produk terlaris dan perlu dijaga ketersediaannya</li>
                <li>Produk dengan margin tinggi seperti {data?.insights?.highMarginProduct} berpotensi untuk promo bundling</li>
                <li>Beberapa produk dengan stok rendah perlu segera dipesan kembali</li>
              </ul>
            </div>
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

export default TopProductsChart;
