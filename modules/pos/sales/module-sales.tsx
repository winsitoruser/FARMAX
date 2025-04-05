import React, { useState, useEffect } from 'react';
import { FaSearch, FaCalendarAlt, FaFileExport, FaFilter, FaChartBar, FaChartPie, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah } from '@/lib/formatter';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, Area, LineChart, Line, PieChart, Pie, 
  Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

// Fallback component for chart when client-side rendering is not available
const ChartFallback = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="h-64 w-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-medium text-gray-700">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">Chart will appear here</p>
  </div>
);

// Mock data for sales
const mockTransactions = [
  {
    id: 'TRX-001',
    date: '2025-03-22 09:15',
    customer: 'Budi Santoso',
    items: 3,
    total: 85000,
    payment: 'Cash',
    status: 'Completed'
  },
  {
    id: 'TRX-002',
    date: '2025-03-22 10:30',
    customer: 'Siti Rahayu',
    items: 2,
    total: 103000,
    payment: 'Debit Card',
    status: 'Completed'
  },
  {
    id: 'TRX-003',
    date: '2025-03-22 11:45',
    customer: 'Ahmad Hidayat',
    items: 5,
    total: 280000,
    payment: 'Credit Card',
    status: 'Completed'
  },
  {
    id: 'TRX-004',
    date: '2025-03-22 13:20',
    customer: 'Dewi Lestari',
    items: 1,
    total: 95000,
    payment: 'E-Wallet',
    status: 'Completed'
  },
  {
    id: 'TRX-005',
    date: '2025-03-22 14:10',
    customer: 'Rudi Hartono',
    items: 4,
    total: 425000,
    payment: 'BPJS',
    status: 'Completed'
  }
];

// Sales statistics
const salesStats = {
  today: {
    total: 988000,
    count: 5,
    customers: 5
  },
  yesterday: {
    total: 1250000,
    count: 7,
    customers: 6
  }
};

// Top products data
const topProducts = {
  series: [25, 18, 15, 12, 10, 8, 5, 3, 2, 2],
  labels: [
    'Paracetamol',
    'Vitamin C',
    'Amoxicillin',
    'Antasida',
    'Vitamin B Complex',
    'Insulin',
    'Vitamin E',
    'Antibiotik',
    'Suplemen',
    'Lainnya'
  ]
};

// Sales trend data
const salesTrend = {
  series: [{
    name: 'Penjualan',
    data: [150000, 220000, 180000, 250000, 300000, 280000, 320000]
  }],
  categories: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
};

// Format sales trend data for Recharts
const formattedSalesTrend = salesTrend.categories.map((category, index) => ({
  name: category,
  penjualan: salesTrend.series[0].data[index]
}));

// Format top products data for Recharts
const formattedTopProducts = topProducts.labels.map((label, index) => ({
  name: label,
  value: topProducts.series[index]
}));

const SalesModule = () => {
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle transaction click
  const handleTransactionClick = (transaction: any) => {
    console.log('Transaction clicked:', transaction);
  };
  
  // Colors for the orange theme
  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'];
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
          <p className="text-gray-500 mt-1">Lihat dan analisis data penjualan toko Anda</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              type="date" 
              className="pl-10 pr-4 py-2 w-full sm:w-auto" 
              defaultValue="2025-03-22"
            />
          </div>
          
          <Button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white">
            <FaFileExport />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Sales statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's sales */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4">
            <h2 className="text-lg font-semibold text-white">Penjualan Hari Ini</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Penjualan</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(salesStats.today.total)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <FaChartBar className="text-orange-500 text-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Jumlah Transaksi</p>
                <p className="text-lg font-semibold text-gray-900">{salesStats.today.count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jumlah Pembeli</p>
                <p className="text-lg font-semibold text-gray-900">{salesStats.today.customers}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Yesterday's sales */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-4">
            <h2 className="text-lg font-semibold text-white">Penjualan Kemarin</h2>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Penjualan</p>
                <p className="text-2xl font-bold text-gray-900">{formatRupiah(salesStats.yesterday.total)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FaChartBar className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Jumlah Transaksi</p>
                <p className="text-lg font-semibold text-gray-900">{salesStats.yesterday.count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jumlah Pembeli</p>
                <p className="text-lg font-semibold text-gray-900">{salesStats.yesterday.customers}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4">
            <h2 className="text-lg font-semibold text-white">Filter Data</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Tanggal</label>
                <div className="flex gap-2">
                  <Input type="date" className="flex-1" defaultValue="2025-03-01" />
                  <Input type="date" className="flex-1" defaultValue="2025-03-22" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Semua Metode</option>
                  <option value="cash">Cash</option>
                  <option value="debit">Debit Card</option>
                  <option value="credit">Credit Card</option>
                  <option value="ewallet">E-Wallet</option>
                  <option value="bpjs">BPJS</option>
                </select>
              </div>
              <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center gap-2">
                <FaFilter size={14} />
                <span>Terapkan Filter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales trend chart */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-100 border-b border-orange-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Tren Penjualan</h2>
                <p className="text-sm text-gray-500">Minggu Ini</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center">
                <FaChartBar className="text-orange-500 text-xl" />
              </div>
            </div>
          </div>
          <div className="p-4">
            {!isClient ? (
              <ChartFallback title="Sales Trend" icon={<FaChartBar className="text-orange-500" size={24} />} />
            ) : (
              <ClientOnlyRecharts height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formattedSalesTrend}
                    margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#666' }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${formatRupiah(value)}`}
                      tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#666' }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${formatRupiah(value)}`, 'Penjualan']}
                      contentStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '4px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="penjualan" 
                      name="Penjualan"
                      stroke="#f97316" 
                      fillOpacity={1} 
                      fill="url(#colorSales)" 
                      activeDot={{ r: 6 }}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ClientOnlyRecharts>
            )}
          </div>
        </div>
        
        {/* Top 10 Products Pie Chart */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-orange-100 border-b border-orange-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Top 10 Produk</h2>
                <p className="text-sm text-gray-500">Berdasarkan Penjualan</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center">
                <FaChartPie className="text-orange-500 text-xl" />
              </div>
            </div>
          </div>
          <div className="p-4">
            {!isClient ? (
              <ChartFallback title="Top 10 Products" icon={<FaChartPie className="text-orange-500" size={24} />} />
            ) : (
              <ClientOnlyRecharts height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formattedTopProducts}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {formattedTopProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{
                        fontSize: '12px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}`, 'Jumlah']}
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
        </div>
      </div>
      
      {/* Recent transactions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-4">
          <h2 className="text-lg font-semibold text-white">Transaksi Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Transaksi
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal & Waktu
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pembayaran
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockTransactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatRupiah(transaction.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.payment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleTransactionClick(transaction)} 
                          className="text-orange-600 hover:text-orange-900 mr-3"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* View all transactions link */}
      <div className="flex justify-center">
        <Link href="/pos/penjualan/semua">
          <Button className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all rounded-lg">
            <span className="text-white font-medium">Lihat Semua Transaksi</span>
            <FaArrowRight className="text-white" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SalesModule;
