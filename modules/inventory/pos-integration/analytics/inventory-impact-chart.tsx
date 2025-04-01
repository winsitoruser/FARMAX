import React from 'react';
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
import dynamic from 'next/dynamic';
import { FaArrowDown, FaExchangeAlt } from 'react-icons/fa';

// Import dinamis untuk chart.js
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface InventoryImpactChartProps {
  data: any;
  isLoading: boolean;
}

const InventoryImpactChart: React.FC<InventoryImpactChartProps> = ({ 
  data, 
  isLoading 
}) => {
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
  
  // Options untuk grafik perubahan stok (Bar chart)
  const stockChangesOptions = {
    chart: {
      id: 'stock-changes',
      type: 'bar' as const,
      stacked: false,
      toolbar: {
        show: true
      },
      animations: {
        enabled: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#2563eb', '#f97316'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        endingShape: 'rounded',
        borderRadius: 4
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
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: data?.stockChanges?.labels || [],
      title: {
        text: 'Kategori Produk'
      },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Jumlah Stok'
      },
      labels: {
        formatter: (value: number) => value.toFixed(0)
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toFixed(0)} unit`
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      floating: false,
      offsetY: -25,
      offsetX: -5
    }
  };

  // Series untuk grafik perubahan stok
  const stockChangesSeries = data?.stockChanges?.datasets ? [
    {
      name: 'Stok Awal',
      data: data.stockChanges.datasets[0].data
    },
    {
      name: 'Stok Akhir',
      data: data.stockChanges.datasets[1].data
    }
  ] : [];
  
  // Options untuk grafik tingkat perputaran (Line chart)
  const turnoverRateOptions = {
    chart: {
      id: 'turnover-rate',
      type: 'line' as const,
      toolbar: {
        show: true
      },
      animations: {
        enabled: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#f97316'],
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    markers: {
      size: 5,
      colors: ['#f97316'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: data?.turnoverRate?.labels || [],
      title: {
        text: 'Kategori Produk'
      },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Tingkat Perputaran'
      },
      labels: {
        formatter: (value: number) => (value * 100).toFixed(1) + '%'
      }
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${(value * 100).toFixed(1)}%`
      }
    },
    legend: {
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      floating: false,
      offsetY: -25,
      offsetX: -5
    }
  };

  // Series untuk grafik tingkat perputaran
  const turnoverRateSeries = data?.turnoverRate ? [
    {
      name: 'Tingkat Perputaran',
      data: data.turnoverRate.data
    }
  ] : [];

  // Render komponen
  return (
    <Card className="w-full">
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
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={stockChangesOptions}
                      series={stockChangesSeries}
                      type="bar"
                      height={300}
                    />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Tingkat Perputaran Stok</h3>
                <div className="h-[200px]">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={turnoverRateOptions}
                      series={turnoverRateSeries}
                      type="line"
                      height={200}
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card>
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
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Nilai Stok Sebelum</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.stockValue?.before)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Nilai Stok Sesudah</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.stockValue?.after)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Selisih Nilai Stok</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.stockValue?.difference)}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Perputaran Tertinggi</div>
                      <div className="text-lg font-bold">{data?.summary?.highestTurnover}</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <FaExchangeAlt size={10} />
                      <span>Cepat</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Perputaran Terendah</div>
                      <div className="text-lg font-bold">{data?.summary?.lowestTurnover}</div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                      <FaExchangeAlt size={10} />
                      <span>Lambat</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <div className="text-sm text-gray-500">
          Pengurangan stok sebesar {data?.summary?.totalStockReduction.toLocaleString()} unit ({(data?.summary?.percentageReduction * 100).toFixed(1)}%) selama periode ini dengan perputaran tertinggi di kategori {data?.summary?.highestTurnover}
        </div>
      </CardFooter>
    </Card>
  );
};

export default InventoryImpactChart;
