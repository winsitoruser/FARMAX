import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SalesChartDataItem {
  date: string;
  sales: number;
  percentage: number;
  label: string;
}

interface SalesChartProps {
  data: SalesChartDataItem[];
  title: string;
  description: string;
  maxSales: number;
  totalSales: number;
  salesGrowth: number;
}

const SalesChart: React.FC<SalesChartProps> = ({
  data,
  title,
  description,
  maxSales,
  totalSales,
  salesGrowth
}) => {
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* Top colored strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-400"></div>
      
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
            <CardDescription className="text-gray-600">{description}</CardDescription>
          </div>
          <Tabs defaultValue="revenue" className="w-auto">
            <TabsList className="bg-white border border-orange-100 p-1">
              <TabsTrigger 
                value="revenue" 
                className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-400 data-[state=active]:text-white"
              >
                Revenue
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-400 data-[state=active]:text-white"
              >
                Transaksi
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px] relative">
          {/* Modern Animated Chart */}
          <div className="h-full w-full">
            {/* Vertical grid lines */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={`grid-${i}`}
                className="absolute top-0 bottom-0 w-px bg-gray-100" 
                style={{ left: `${(i / 6) * 100}%` }}
              ></div>
            ))}
            
            {/* Horizontal grid lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`h-grid-${i}`}
                className="absolute left-0 right-0 h-px bg-gray-100" 
                style={{ bottom: `${(i / 4) * 80}%` }}
              >
                <span className="absolute -left-7 -top-2 text-xs text-gray-400">
                  {Math.round((maxSales / 4) * i).toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
            ))}
            
            {/* Bar chart */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end h-[80%]">
              {data.map((item, index) => (
                <div key={item.date} className="flex flex-col items-center w-full">
                  <div 
                    className="w-12 rounded-t-md bg-gradient-to-t from-orange-500 to-amber-400 relative group"
                    style={{ 
                      height: `${(item.sales / maxSales) * 100}%`,
                      opacity: 0.8,
                      animation: `growFromBottom 1s ease-out ${index * 0.1}s both`
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.sales.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* Summary overlay */}
            <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-orange-100 shadow-sm">
              <div className="text-xs text-gray-500">Total Penjualan</div>
              <div className="text-lg font-bold text-gray-800">
                {totalSales.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </div>
              <div className="text-xs text-green-600 flex items-center mt-1">
                <span className="mr-1">↑</span>
                {salesGrowth}% dari minggu lalu
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
