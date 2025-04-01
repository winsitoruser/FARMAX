import { NextPage } from "next";
import { useState } from "react";
import FinanceLayout from "@/components/layouts/finance-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FaChartBar, FaCalendarAlt, FaDownload, FaFileAlt, 
  FaMoneyBillWave, FaWallet, FaChartPie, FaChartLine,
  FaFileInvoiceDollar, FaFilter
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Performance data for bar chart
const profitLossData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  datasets: [
    {
      label: 'Pendapatan',
      data: [32500000, 36700000, 40200000, 38500000, 42100000, 45600000],
      backgroundColor: 'rgba(249, 115, 22, 0.7)',
      borderColor: 'rgba(249, 115, 22, 1)',
      borderWidth: 1,
    },
    {
      label: 'Pengeluaran',
      data: [22300000, 25100000, 24500000, 27800000, 26200000, 28300000],
      backgroundColor: 'rgba(245, 158, 11, 0.7)',
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 1,
    },
    {
      label: 'Keuntungan',
      data: [10200000, 11600000, 15700000, 10700000, 15900000, 17300000],
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 1,
    }
  ],
};

// Sales trend data
const salesTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
  datasets: [
    {
      label: 'Penjualan 2025',
      data: [32500000, 36700000, 40200000, 38500000, 42100000, 45600000],
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Penjualan 2024',
      data: [30500000, 33700000, 36200000, 35200000, 38900000, 41500000],
      borderColor: '#fb923c',
      backgroundColor: 'rgba(251, 146, 60, 0.05)',
      tension: 0.3,
      fill: true,
      borderDash: [5, 5],
    }
  ],
};

// Category pie chart data
const categoryData = {
  labels: ['Obat Resep', 'OTC', 'Vitamin & Suplemen', 'Perawatan Pribadi', 'Alat Kesehatan'],
  datasets: [
    {
      data: [40, 25, 20, 10, 5],
      backgroundColor: [
        'rgba(249, 115, 22, 0.8)',  // orange-500
        'rgba(251, 146, 60, 0.8)',  // orange-400
        'rgba(245, 158, 11, 0.8)',  // amber-500
        'rgba(252, 211, 77, 0.8)',  // amber-300
        'rgba(254, 240, 138, 0.8)', // yellow-200
      ],
      borderColor: [
        'rgba(249, 115, 22, 1)',
        'rgba(251, 146, 60, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(252, 211, 77, 1)',
        'rgba(254, 240, 138, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// Mock financial data
const summaryData = [
  { period: 'Jan 2025', income: 32500000, expense: 22300000, profit: 10200000, growth: 3.5 },
  { period: 'Feb 2025', income: 36700000, expense: 25100000, profit: 11600000, growth: 13.7 },
  { period: 'Mar 2025', income: 40200000, expense: 24500000, profit: 15700000, growth: 35.3 },
  { period: 'Apr 2025', income: 38500000, expense: 27800000, profit: 10700000, growth: -31.8 },
  { period: 'Mei 2025', income: 42100000, expense: 26200000, profit: 15900000, growth: 48.6 },
  { period: 'Jun 2025', income: 45600000, expense: 28300000, profit: 17300000, growth: 8.8 },
];

const FinanceReportsPage: NextPage = () => {
  const [dateRange, setDateRange] = useState<string>('month');

  return (
    <FinanceLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="h-8 w-1.5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full mr-3"></div>
          <h2 className="text-xl font-bold text-gray-800">Laporan Keuangan</h2>
        </div>
        
        {/* Filters and Date Range */}
        <Card className="border-orange-100 overflow-hidden neo-shadow relative">
          {/* Top decorative bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
          
          <CardContent className="p-4 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100">
                  <FaCalendarAlt className="mr-2 h-4 w-4" />
                  Pilih Rentang Tanggal
                </Button>
                
                <select 
                  className="p-2 text-sm border border-orange-200 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Minggu Ini</option>
                  <option value="month">Bulan Ini</option>
                  <option value="quarter">Kuartal Ini</option>
                  <option value="year">Tahun Ini</option>
                  <option value="custom">Kustom</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                  <FaFilter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <FaDownload className="mr-2 h-4 w-4" />
                  Ekspor Laporan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Report Tabs */}
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="bg-orange-50 border border-orange-100 p-1 rounded-lg mb-6">
            <TabsTrigger 
              value="summary" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <FaFileAlt className="mr-2 h-4 w-4" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger 
              value="profit-loss" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <FaChartBar className="mr-2 h-4 w-4" />
              Laba Rugi
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <FaMoneyBillWave className="mr-2 h-4 w-4" />
              Penjualan
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <FaWallet className="mr-2 h-4 w-4" />
              Pengeluaran
            </TabsTrigger>
            <TabsTrigger 
              value="invoices" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <FaFileInvoiceDollar className="mr-2 h-4 w-4" />
              Faktur
            </TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Performance Stats */}
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              {/* Top decorative bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full opacity-20 transform translate-x-20 -translate-y-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-100 rounded-full opacity-30"></div>
              
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-2">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                    <FaChartBar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-orange-800">Performa Keuangan</CardTitle>
                    <CardDescription className="text-orange-600/70">Ikhtisar kinerja keuangan 6 bulan terakhir</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="h-[350px]">
                  <Bar 
                    data={profitLossData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: (value) => {
                              return `Rp${(+value / 1000000).toFixed(0)}jt`;
                            }
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += `Rp${context.parsed.y.toLocaleString('id-ID')}`;
                              }
                              return label;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Summary Table */}
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              {/* Top decorative bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-100 rounded-full opacity-30"></div>
              
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-2">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                    <FaFileAlt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-orange-800">Ringkasan Keuangan</CardTitle>
                    <CardDescription className="text-orange-600/70">Data keuangan bulanan</CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-orange-50">
                      <TableRow>
                        <TableHead className="text-orange-900 font-medium">Periode</TableHead>
                        <TableHead className="text-orange-900 font-medium">Pendapatan</TableHead>
                        <TableHead className="text-orange-900 font-medium">Pengeluaran</TableHead>
                        <TableHead className="text-orange-900 font-medium">Keuntungan</TableHead>
                        <TableHead className="text-orange-900 font-medium">Pertumbuhan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {summaryData.map((item, index) => (
                        <TableRow key={index} className="hover:bg-orange-50/60">
                          <TableCell className="font-medium">{item.period}</TableCell>
                          <TableCell className="text-orange-600 font-medium">
                            Rp{item.income.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell className="text-amber-600 font-medium">
                            Rp{item.expense.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell className="text-emerald-600 font-medium">
                            Rp{item.profit.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <span className={`flex items-center ${item.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {item.growth >= 0 ? 
                                <FaChartLine className="mr-1.5 h-3.5 w-3.5" /> : 
                                <FaChartLine className="mr-1.5 h-3.5 w-3.5 transform rotate-180" />
                              }
                              {Math.abs(item.growth)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Trend Chart */}
              <Card className="col-span-2 border-orange-100 overflow-hidden neo-shadow relative">
                {/* Top decorative bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full opacity-20 transform translate-x-20 -translate-y-20"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-100 rounded-full opacity-30"></div>
                
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-2">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                      <FaChartLine className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-orange-800">Tren Penjualan</CardTitle>
                      <CardDescription className="text-orange-600/70">Perbandingan penjualan 2024 vs 2025</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <Line 
                      data={salesTrendData} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: (value) => {
                                return `Rp${(+value / 1000000).toFixed(0)}jt`;
                              }
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                  label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                  label += `Rp${context.parsed.y.toLocaleString('id-ID')}`;
                                }
                                return label;
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sales Category Chart */}
              <Card className="border-orange-100 overflow-hidden neo-shadow relative">
                {/* Top decorative bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-100 rounded-full opacity-30"></div>
                
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-2">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                      <FaChartPie className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-orange-800">Kategori Penjualan</CardTitle>
                      <CardDescription className="text-orange-600/70">Proporsi penjualan per kategori</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="h-[300px] relative">
                    <Doughnut 
                      data={categoryData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '65%',
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: {
                              padding: 20,
                              usePointStyle: true,
                              pointStyle: 'circle',
                            }
                          }
                        }
                      }}
                    />
                    
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-gray-800">Rp45,6jt</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Other tabs would go here but are omitted for brevity */}
          <TabsContent value="profit-loss">
            <div className="rounded-lg border border-orange-100 p-8 text-center">
              <FaFileAlt className="mx-auto h-12 w-12 text-orange-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Laporan Laba Rugi</h3>
              <p className="text-gray-500 mb-4">Detail laporan laba rugi akan ditampilkan di sini.</p>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                Lihat Laporan Lengkap
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="expenses">
            <div className="rounded-lg border border-orange-100 p-8 text-center">
              <FaWallet className="mx-auto h-12 w-12 text-orange-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Laporan Pengeluaran</h3>
              <p className="text-gray-500 mb-4">Detail laporan pengeluaran akan ditampilkan di sini.</p>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                Lihat Laporan Lengkap
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="invoices">
            <div className="rounded-lg border border-orange-100 p-8 text-center">
              <FaFileInvoiceDollar className="mx-auto h-12 w-12 text-orange-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Laporan Faktur</h3>
              <p className="text-gray-500 mb-4">Detail laporan faktur akan ditampilkan di sini.</p>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                Lihat Laporan Lengkap
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceLayout>
  );
};

export default FinanceReportsPage;
