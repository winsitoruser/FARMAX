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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dynamic from 'next/dynamic';
import { FaChartBar, FaStar, FaExchangeAlt, FaStore } from 'react-icons/fa';

// Import dinamis untuk chart.js
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BranchPerformanceChartProps {
  data: any;
  isLoading: boolean;
}

const BranchPerformanceChart: React.FC<BranchPerformanceChartProps> = ({ 
  data, 
  isLoading 
}) => {
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
    if (efficiency >= 0.9) {
      return <Badge className="bg-green-100 text-green-800">Sangat Baik</Badge>;
    } else if (efficiency >= 0.8) {
      return <Badge className="bg-blue-100 text-blue-800">Baik</Badge>;
    } else if (efficiency >= 0.7) {
      return <Badge className="bg-amber-100 text-amber-800">Sedang</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Kurang</Badge>;
    }
  };
  
  // Options untuk grafik performa penjualan cabang (Bar chart)
  const salesPerformanceOptions = {
    chart: {
      id: 'branch-sales-performance',
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
        borderRadius: 4,
        columnWidth: '60%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => formatRupiah(val, true),
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#555']
      }
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
      categories: data?.salesPerformance?.labels || [],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Nilai Penjualan (Rp)'
      },
      labels: {
        formatter: (value: number) => formatRupiah(value, true)
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

  // Series untuk grafik performa penjualan cabang
  const salesPerformanceSeries = data?.salesPerformance ? [
    {
      name: 'Nilai Penjualan',
      data: data.salesPerformance.data
    }
  ] : [];
  
  // Options untuk grafik efisiensi stok cabang (Bar chart)
  const stockEfficiencyOptions = {
    chart: {
      id: 'branch-stock-efficiency',
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
        borderRadius: 4,
        columnWidth: '60%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${(val * 100).toFixed(0)}%`,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#555']
      }
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
      categories: data?.stockEfficiency?.labels || [],
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Efisiensi Stok'
      },
      labels: {
        formatter: (value: number) => `${(value * 100).toFixed(0)}%`
      },
      min: 0,
      max: 1
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${(value * 100).toFixed(1)}%`
      }
    },
    legend: {
      show: false
    }
  };

  // Series untuk grafik efisiensi stok cabang
  const stockEfficiencySeries = data?.stockEfficiency ? [
    {
      name: 'Efisiensi Stok',
      data: data.stockEfficiency.data
    }
  ] : [];

  // Menggabungkan data penjualan dan efisiensi untuk tabel
  const combinedBranchData = data?.salesPerformance?.labels?.map((branch: string, index: number) => ({
    branch,
    salesValue: data.salesPerformance.data[index],
    efficiency: data.stockEfficiency.data[index]
  })) || [];

  // Render komponen
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performa Cabang</CardTitle>
        <CardDescription>
          Analisis performa penjualan dan efisiensi stok tiap cabang
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[150px] w-full rounded-xl" />
          </div>
        ) : (
          <>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Nilai Penjualan per Cabang</h3>
                <div className="h-[250px]">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={salesPerformanceOptions}
                      series={salesPerformanceSeries}
                      type="bar"
                      height={250}
                    />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Efisiensi Stok per Cabang</h3>
                <div className="h-[250px]">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={stockEfficiencyOptions}
                      series={stockEfficiencySeries}
                      type="bar"
                      height={250}
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cabang</TableHead>
                    <TableHead className="text-right">Nilai Penjualan</TableHead>
                    <TableHead className="text-center">Efisiensi Stok</TableHead>
                    <TableHead className="text-center">Peringkat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinedBranchData
                    .sort((a, b) => b.salesValue - a.salesValue)
                    .map((branchData, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{branchData.branch}</TableCell>
                        <TableCell className="text-right">{formatRupiah(branchData.salesValue)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span>{(branchData.efficiency * 100).toFixed(0)}%</span>
                            {getEfficiencyBadge(branchData.efficiency)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-orange-100 text-orange-800">#{index + 1}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 border-t p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="flex items-center gap-3">
            <FaStar className="text-orange-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Cabang Terbaik</div>
              <div className="font-medium">{data?.summary?.topPerformingBranch}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FaExchangeAlt className="text-blue-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Cabang Paling Efisien</div>
              <div className="font-medium">{data?.summary?.mostEfficientBranch}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <FaStore className="text-purple-500" size={18} />
            <div>
              <div className="text-sm text-gray-500">Efisiensi Rata-rata</div>
              <div className="font-medium">{(data?.summary?.averageEfficiency * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BranchPerformanceChart;
