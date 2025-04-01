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
import { formatRupiah } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Import dinamis untuk chart.js
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SalesTrendsChartProps {
  data: any;
  isLoading: boolean;
}

const SalesTrendsChart: React.FC<SalesTrendsChartProps> = ({ 
  data, 
  isLoading 
}) => {
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
  
  // Options untuk grafik tren penjualan (Line chart)
  const salesTrendsOptions = {
    chart: {
      id: 'sales-trends',
      type: 'line' as const,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#ff6b35', '#0075A2'],
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
      size: 4,
      colors: ['#ff6b35', '#0075A2'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    xaxis: {
      categories: data?.labels || [],
      title: {
        text: 'Tanggal'
      },
      labels: {
        rotateAlways: false,
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      },
      tooltip: {
        enabled: false
      }
    },
    yaxis: [
      {
        title: {
          text: 'Jumlah Transaksi'
        },
        labels: {
          formatter: (value: number) => value.toFixed(0)
        }
      },
      {
        opposite: true,
        title: {
          text: 'Nilai Penjualan (juta)'
        },
        labels: {
          formatter: (value: number) => value.toFixed(1)
        }
      }
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }: { seriesIndex: number }) => {
          if (seriesIndex === 0) {
            return `${value.toFixed(0)} transaksi`;
          } else {
            return `Rp ${value.toFixed(1)} juta`;
          }
        }
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

  // Series untuk grafik tren penjualan
  const salesTrendsSeries = data?.datasets ? [
    {
      name: 'Jumlah Transaksi',
      type: 'line',
      data: data.datasets[0].data
    },
    {
      name: 'Nilai Penjualan (juta)',
      type: 'line',
      data: data.datasets[1].data
    }
  ] : [];

  // Menghitung persentase pertumbuhan atau penurunan
  const renderGrowthIndicator = (value: number) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
        <span>{Math.abs(value * 100).toFixed(1)}%</span>
      </div>
    );
  };

  // Render komponen
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tren Penjualan</CardTitle>
        <CardDescription>
          Analisis tren penjualan dan dampaknya terhadap inventaris
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            <div className="h-[400px]">
              {typeof window !== 'undefined' && (
                <Chart
                  options={salesTrendsOptions}
                  series={salesTrendsSeries}
                  type="line"
                  height={400}
                />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Transaksi</div>
                  <div className="text-2xl font-bold mt-1">{data?.summary?.totalTransactions.toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Total Nilai Penjualan</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.totalSalesValue)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500">Rata-rata Transaksi</div>
                  <div className="text-2xl font-bold mt-1">{formatRupiah(data?.summary?.averageTransactionValue)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-500 flex items-center justify-between">
                    <span>Tingkat Pertumbuhan</span>
                    {renderGrowthIndicator(data?.summary?.growthRate)}
                  </div>
                  <div className="text-lg font-bold mt-1">Puncak: {data?.summary?.peakDay}</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t">
        <div className="text-sm text-gray-500">
          {data?.summary?.growthRate >= 0 ? 'Tren positif' : 'Tren negatif'} pada periode ini dengan nilai penjualan {formatRupiah(data?.summary?.totalSalesValue)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default SalesTrendsChart;
