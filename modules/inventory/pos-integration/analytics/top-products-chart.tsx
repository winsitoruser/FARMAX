import React, { useState } from 'react';
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
import dynamic from 'next/dynamic';
import { FaBoxes, FaTag, FaExclamationTriangle } from 'react-icons/fa';

// Import dinamis untuk chart.js
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TopProductsChartProps {
  data: any;
  isLoading: boolean;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ 
  data, 
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState('quantity');
  
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
  
  // Helper untuk menentukan warna badge berdasarkan dampak stok
  const getStockImpactBadge = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'tinggi':
        return <Badge className="bg-red-100 text-red-800">Tinggi</Badge>;
      case 'sedang':
        return <Badge className="bg-amber-100 text-amber-800">Sedang</Badge>;
      case 'rendah':
        return <Badge className="bg-green-100 text-green-800">Rendah</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{impact}</Badge>;
    }
  };
  
  // Options untuk grafik produk teratas berdasarkan kuantitas (Bar horizontal)
  const quantityChartOptions = {
    chart: {
      id: 'top-products-quantity',
      type: 'bar' as const,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#ff6b35'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`,
      textAnchor: 'start',
      style: {
        colors: ['#555']
      },
      offsetX: 30
    },
    grid: {
      yaxis: {
        lines: {
          show: false
        }
      },
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      categories: data?.byQuantity ? data.byQuantity.map((item: any) => item.productName).reverse() : [],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} unit`
      }
    },
    legend: {
      show: false
    }
  };

  // Series untuk grafik produk teratas berdasarkan kuantitas
  const quantityChartSeries = data?.byQuantity ? [
    {
      name: 'Kuantitas',
      data: data.byQuantity.map((item: any) => item.quantity).reverse()
    }
  ] : [];
  
  // Options untuk grafik produk teratas berdasarkan nilai (Bar horizontal)
  const valueChartOptions = {
    chart: {
      id: 'top-products-value',
      type: 'bar' as const,
      toolbar: {
        show: false
      },
      animations: {
        enabled: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#0075A2'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        borderRadius: 4,
        distributed: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${(val / 1000000).toFixed(1)} jt`,
      textAnchor: 'start',
      style: {
        colors: ['#555']
      },
      offsetX: 30
    },
    grid: {
      yaxis: {
        lines: {
          show: false
        }
      },
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      categories: data?.byValue ? data.byValue.map((item: any) => item.productName).reverse() : [],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatRupiah(value)
      }
    },
    legend: {
      show: false
    }
  };

  // Series untuk grafik produk teratas berdasarkan nilai
  const valueChartSeries = data?.byValue ? [
    {
      name: 'Nilai',
      data: data.byValue.map((item: any) => item.value).reverse()
    }
  ] : [];

  // Render komponen
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Produk Teratas</CardTitle>
        <CardDescription>
          Analisis produk dengan penjualan tertinggi dan dampaknya terhadap inventaris
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
                <TabsTrigger value="quantity" className="flex items-center gap-2">
                  <FaBoxes size={14} />
                  <span>Kuantitas</span>
                </TabsTrigger>
                <TabsTrigger value="value" className="flex items-center gap-2">
                  <FaTag size={14} />
                  <span>Nilai</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="quantity" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <div className="h-[350px]">
                      {typeof window !== 'undefined' && (
                        <Chart
                          options={quantityChartOptions}
                          series={quantityChartSeries}
                          type="bar"
                          height={350}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="border rounded-lg p-4 h-[350px] overflow-y-auto">
                      <h3 className="font-medium text-sm mb-3">Detail Produk Teratas (Kuantitas)</h3>
                      <div className="space-y-4">
                        {data?.byQuantity?.slice(0, 5).map((product: any, index: number) => (
                          <div key={index} className="border-b pb-3">
                            <div className="font-medium text-base">{product.productName}</div>
                            <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Kuantitas:</span>
                              <span className="font-medium">{product.quantity} unit</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <span>Dampak Stok:</span>
                              <span>{getStockImpactBadge(product.stockImpact)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="value" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <div className="h-[350px]">
                      {typeof window !== 'undefined' && (
                        <Chart
                          options={valueChartOptions}
                          series={valueChartSeries}
                          type="bar"
                          height={350}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="border rounded-lg p-4 h-[350px] overflow-y-auto">
                      <h3 className="font-medium text-sm mb-3">Detail Produk Teratas (Nilai)</h3>
                      <div className="space-y-4">
                        {data?.byValue?.slice(0, 5).map((product: any, index: number) => (
                          <div key={index} className="border-b pb-3">
                            <div className="font-medium text-base">{product.productName}</div>
                            <div className="text-sm text-gray-500 mb-2">{product.category}</div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Nilai:</span>
                              <span className="font-medium">{formatRupiah(product.value)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-1">
                              <span>Dampak Stok:</span>
                              <span>{getStockImpactBadge(product.stockImpact)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-center">Kuantitas</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                    <TableHead className="text-center">Dampak Stok</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTab === 'quantity' ? 
                    data?.byQuantity?.map((product: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-center">{product.quantity}</TableCell>
                        <TableCell className="text-right">
                          {data?.byValue?.find((p: any) => p.productName === product.productName)?.value
                            ? formatRupiah(data.byValue.find((p: any) => p.productName === product.productName).value)
                            : '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStockImpactBadge(product.stockImpact)}
                        </TableCell>
                      </TableRow>
                    )) :
                    data?.byValue?.map((product: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-center">
                          {data?.byQuantity?.find((p: any) => p.productName === product.productName)?.quantity || '-'}
                        </TableCell>
                        <TableCell className="text-right">{formatRupiah(product.value)}</TableCell>
                        <TableCell className="text-center">
                          {getStockImpactBadge(product.stockImpact)}
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="flex items-center gap-3">
            <FaBoxes className="text-orange-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Kategori Terbanyak</div>
              <div className="font-medium">{data?.summary?.topCategory}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FaTag className="text-blue-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Kategori Nilai Tertinggi</div>
              <div className="font-medium">{data?.summary?.highestValueCategory}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Produk Stok Kritis</div>
              <div className="font-medium">{data?.summary?.criticalStockProducts} produk</div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TopProductsChart;
