import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCalendarAlt, FaDownload, FaFilter, FaPrint, FaSearch, FaSort, FaSortDown, FaSortUp, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import ClientOnly from '@/components/common/client-only';
import { formatRupiah } from '@/lib/formatter';
import BackButton from '@/components/common/back-button';
import SimpleHeader from '@/components/shared/simple-header';

// Dynamic import for Chart component
const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full flex items-center justify-center">Loading chart...</div>
});

// Interface for transaction data
interface Transaction {
  id: string;
  date: string;
  customer: string;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
  items: number;
}

const PenjualanPage = () => {
  const [period, setPeriod] = useState('week');
  const [sortField, setSortField] = useState<string | null>("date");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sample data for the chart
  const chartData = {
    week: {
      series: [{
        name: 'Penjualan',
        data: [3100000, 4200000, 3800000, 5000000, 4700000, 6200000, 5800000]
      }],
      categories: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    },
    month: {
      series: [{
        name: 'Penjualan',
        data: [12000000, 15000000, 18000000, 16000000]
      }],
      categories: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4']
    },
    year: {
      series: [{
        name: 'Penjualan',
        data: [45000000, 52000000, 48000000, 60000000, 56000000, 70000000, 
               68000000, 72000000, 65000000, 80000000, 75000000, 85000000]
      }],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    }
  };

  // Sample transaction data
  const transactions: Transaction[] = [
    { id: 'TRX-001', date: '2025-03-23', customer: 'Budi Santoso', total: 450000, paymentMethod: 'Cash', status: 'completed', items: 5 },
    { id: 'TRX-002', date: '2025-03-23', customer: 'Siti Nurhayati', total: 780000, paymentMethod: 'Credit Card', status: 'completed', items: 3 },
    { id: 'TRX-003', date: '2025-03-22', customer: 'Joko Widodo', total: 320000, paymentMethod: 'QRIS', status: 'completed', items: 2 },
    { id: 'TRX-004', date: '2025-03-22', customer: 'Dewi Lestari', total: 560000, paymentMethod: 'Cash', status: 'completed', items: 4 },
    { id: 'TRX-005', date: '2025-03-21', customer: 'Agus Setiawan', total: 890000, paymentMethod: 'Debit Card', status: 'completed', items: 7 },
    { id: 'TRX-006', date: '2025-03-21', customer: 'Rina Marlina', total: 230000, paymentMethod: 'Cash', status: 'completed', items: 2 },
    { id: 'TRX-007', date: '2025-03-20', customer: 'Hendra Wijaya', total: 670000, paymentMethod: 'Credit Card', status: 'completed', items: 5 },
    { id: 'TRX-008', date: '2025-03-20', customer: 'Maya Sari', total: 420000, paymentMethod: 'QRIS', status: 'completed', items: 3 },
    { id: 'TRX-009', date: '2025-03-19', customer: 'Doni Kusuma', total: 950000, paymentMethod: 'Cash', status: 'completed', items: 8 },
    { id: 'TRX-010', date: '2025-03-19', customer: 'Lina Anggraini', total: 380000, paymentMethod: 'Debit Card', status: 'completed', items: 4 },
    { id: 'TRX-011', date: '2025-03-18', customer: 'Rudi Hartono', total: 720000, paymentMethod: 'Cash', status: 'completed', items: 6 },
    { id: 'TRX-012', date: '2025-03-18', customer: 'Nina Safitri', total: 290000, paymentMethod: 'Credit Card', status: 'completed', items: 2 },
  ];

  // Sample data for comparison tables
  const comparisonData = {
    ytd: {
      currentYear: 850000000,
      previousYear: 720000000,
      percentageChange: 18.05
    },
    mtd: {
      currentMonth: 85000000,
      previousMonth: 78000000,
      percentageChange: 8.97
    }
  };

  // Sample data for top products
  const topProducts = [
    { id: 1, name: 'Paracetamol 500mg', quantity: 1250, revenue: 18750000, percentageOfTotal: 12.5 },
    { id: 2, name: 'Amoxicillin 500mg', quantity: 980, revenue: 14700000, percentageOfTotal: 9.8 },
    { id: 3, name: 'Vitamin C 1000mg', quantity: 850, revenue: 12750000, percentageOfTotal: 8.5 },
    { id: 4, name: 'Antasida Tablet', quantity: 760, revenue: 11400000, percentageOfTotal: 7.6 },
    { id: 5, name: 'Cetirizine 10mg', quantity: 720, revenue: 10800000, percentageOfTotal: 7.2 },
    { id: 6, name: 'Dexamethasone 0.5mg', quantity: 680, revenue: 10200000, percentageOfTotal: 6.8 },
    { id: 7, name: 'Omeprazole 20mg', quantity: 650, revenue: 9750000, percentageOfTotal: 6.5 },
    { id: 8, name: 'Simvastatin 20mg', quantity: 620, revenue: 9300000, percentageOfTotal: 6.2 },
    { id: 9, name: 'Metformin 500mg', quantity: 580, revenue: 8700000, percentageOfTotal: 5.8 },
    { id: 10, name: 'Amlodipine 10mg', quantity: 540, revenue: 8100000, percentageOfTotal: 5.4 },
  ];

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      switch(sortField) {
        case 'date':
          return direction * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case 'total':
          return direction * (a.total - b.total);
        case 'customer':
          return direction * a.customer.localeCompare(b.customer);
        case 'items':
          return direction * (a.items - b.items);
        default:
          return 0;
      }
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === null) {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className="ml-1 text-gray-400" size={14} />;
    if (sortDirection === 'asc') return <FaSortUp className="ml-1 text-blue-500" size={14} />;
    if (sortDirection === 'desc') return <FaSortDown className="ml-1 text-blue-500" size={14} />;
    return <FaSort className="ml-1 text-gray-400" size={14} />;
  };

  // Chart options
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData[period as keyof typeof chartData].categories,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: function(value: number) {
          return formatRupiah(value);
        },
        style: {
          colors: '#64748b',
          fontSize: '12px',
        }
      }
    },
    colors: ['#f97316'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#f97316',
            opacity: 0.6
          },
          {
            offset: 100,
            color: '#fdba74',
            opacity: 0.1
          }
        ]
      }
    },
    tooltip: {
      y: {
        formatter: function(value: number) {
          return formatRupiah(value);
        }
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    markers: {
      size: 4,
      colors: ['#f97316'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    }
  };

  // Filter states for product table
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [productSortField, setProductSortField] = useState<string | null>("revenue");
  const [productSortDirection, setProductSortDirection] = useState<'asc' | 'desc'>('desc');

  // Product categories for filter
  const productCategories = [
    { id: 'all', name: 'Semua Kategori' },
    { id: 'analgesik', name: 'Analgesik' },
    { id: 'antibiotik', name: 'Antibiotik' },
    { id: 'vitamin', name: 'Vitamin & Suplemen' },
    { id: 'antasida', name: 'Antasida' },
    { id: 'antihistamin', name: 'Antihistamin' },
    { id: 'kortikosteroid', name: 'Kortikosteroid' },
    { id: 'antasid', name: 'Antasid' },
  ];

  // Customer segments for filter
  const customerSegments = [
    { id: 'all', name: 'Semua Pelanggan' },
    { id: 'regular', name: 'Pelanggan Tetap' },
    { id: 'vip', name: 'Pelanggan VIP' },
    { id: 'corporate', name: 'Pelanggan Korporat' },
    { id: 'walkin', name: 'Walk-in (Non Pelanggan)' },
  ];

  // Handle sort for product table
  const handleProductSort = (field: string) => {
    if (productSortField === field) {
      setProductSortDirection(productSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setProductSortField(field);
      setProductSortDirection('desc');
    }
  };

  // Get sort icon for product table
  const getProductSortIcon = (field: string) => {
    if (productSortField !== field) return <FaSort className="ml-1 text-gray-100" size={14} />;
    if (productSortDirection === 'asc') return <FaSortUp className="ml-1 text-white" size={14} />;
    return <FaSortDown className="ml-1 text-white" size={14} />;
  };

  // Filter and sort products
  const filteredProducts = topProducts
    .sort((a, b) => {
      if (!productSortField) return 0;
      
      const direction = productSortDirection === 'asc' ? 1 : -1;
      
      switch(productSortField) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'quantity':
          return direction * (a.quantity - b.quantity);
        case 'revenue':
          return direction * (a.revenue - b.revenue);
        case 'percentageOfTotal':
          return direction * (a.percentageOfTotal - b.percentageOfTotal);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-8 pb-16">
      {/* Web Header */}
      <SimpleHeader 
        title="Laporan Penjualan" 
        subtitle="Kelola dan analisis data penjualan Anda"
        showBackButton={true}
        backUrl="/pos"
      >
        <Button variant="outline" size="sm" className="mr-2">
          <FaCalendarAlt className="mr-2 h-3 w-3" />
          Filter Tanggal
        </Button>
        <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white">
          <FaDownload className="mr-2 h-3 w-3" />
          Export
        </Button>
      </SimpleHeader>
      
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: 'POS', href: '/pos' },
            { label: 'Laporan Penjualan', href: '/pos/penjualan' },
          ]}
        />
      </div>

      {/* Sales Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* YTD Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Year to Date (YTD)</CardTitle>
            <CardDescription>Perbandingan penjualan tahun ini dengan tahun lalu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tahun Ini</p>
                <p className="text-2xl font-bold">{formatRupiah(comparisonData.ytd.currentYear)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tahun Lalu</p>
                <p className="text-2xl font-bold">{formatRupiah(comparisonData.ytd.previousYear)}</p>
              </div>
              <div className={`flex items-center px-3 py-2 rounded-lg ${comparisonData.ytd.percentageChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {comparisonData.ytd.percentageChange >= 0 ? (
                  <FaArrowUp className="mr-1 text-green-600" />
                ) : (
                  <FaArrowDown className="mr-1 text-red-600" />
                )}
                <span className={`font-medium ${comparisonData.ytd.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(comparisonData.ytd.percentageChange).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MTD Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Month to Date (MTD)</CardTitle>
            <CardDescription>Perbandingan penjualan bulan ini dengan bulan lalu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bulan Ini</p>
                <p className="text-2xl font-bold">{formatRupiah(comparisonData.mtd.currentMonth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bulan Lalu</p>
                <p className="text-2xl font-bold">{formatRupiah(comparisonData.mtd.previousMonth)}</p>
              </div>
              <div className={`flex items-center px-3 py-2 rounded-lg ${comparisonData.mtd.percentageChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {comparisonData.mtd.percentageChange >= 0 ? (
                  <FaArrowUp className="mr-1 text-green-600" />
                ) : (
                  <FaArrowDown className="mr-1 text-red-600" />
                )}
                <span className={`font-medium ${comparisonData.mtd.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(comparisonData.mtd.percentageChange).toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Period selector and chart */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Tren Penjualan</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={period === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPeriod('week')}
              >
                Minggu Ini
              </Button>
              <Button 
                variant={period === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPeriod('month')}
              >
                Bulan Ini
              </Button>
              <Button 
                variant={period === 'year' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setPeriod('year')}
              >
                Tahun Ini
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <ClientOnly>
            <Chart 
              options={chartOptions as any}
              series={chartData[period as keyof typeof chartData].series}
              type="area"
              height={350}
            />
          </ClientOnly>
        </CardContent>
      </Card>

      {/* Top Products Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold">Penjualan per Produk</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Category Filter */}
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Kategori Produk" />
                </SelectTrigger>
                <SelectContent>
                  {productCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Customer Segment Filter */}
              <Select
                value={customerFilter}
                onValueChange={setCustomerFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Segmen Pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  {customerSegments.map(segment => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <FaFilter />
                </Button>
                <Button variant="outline" size="icon">
                  <FaDownload />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-4 py-3 text-left text-sm font-medium">No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    <button 
                      className="flex items-center focus:outline-none text-white"
                      onClick={() => handleProductSort('name')}
                    >
                      Nama Produk
                      {getProductSortIcon('name')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    <button 
                      className="flex items-center justify-end focus:outline-none text-white ml-auto"
                      onClick={() => handleProductSort('quantity')}
                    >
                      Kuantitas
                      {getProductSortIcon('quantity')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    <button 
                      className="flex items-center justify-end focus:outline-none text-white ml-auto"
                      onClick={() => handleProductSort('revenue')}
                    >
                      Pendapatan
                      {getProductSortIcon('revenue')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    <button 
                      className="flex items-center justify-end focus:outline-none text-white ml-auto"
                      onClick={() => handleProductSort('percentageOfTotal')}
                    >
                      % dari Total
                      {getProductSortIcon('percentageOfTotal')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{product.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatRupiah(product.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">{product.percentageOfTotal.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Transactions table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold">Riwayat Transaksi</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Cari transaksi..." 
                  className="pl-9 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <FaFilter />
                </Button>
                <Button variant="outline" size="icon">
                  <FaPrint />
                </Button>
                <Button variant="outline" size="icon">
                  <FaDownload />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('id')}
                    >
                      ID Transaksi
                      {getSortIcon('id')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('date')}
                    >
                      Tanggal
                      {getSortIcon('date')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('customer')}
                    >
                      Pelanggan
                      {getSortIcon('customer')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('items')}
                    >
                      Item
                      {getSortIcon('items')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('total')}
                    >
                      Total
                      {getSortIcon('total')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Metode Pembayaran
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{transaction.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(transaction.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{transaction.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{transaction.items}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatRupiah(transaction.total)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{transaction.paymentMethod}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {transaction.status === 'completed' ? 'Selesai' : 
                         transaction.status === 'pending' ? 'Pending' : 'Dibatalkan'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination and Items Per Page */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Tampilkan</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">per halaman</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTransactions.length)} dari {filteredTransactions.length} transaksi
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = currentPage > 3 ? 
                    (currentPage - 3 + i + 1 > totalPages ? totalPages - 5 + i + 1 : currentPage - 3 + i + 1) : 
                    i + 1;
                  
                  if (pageNumber <= 0 || pageNumber > totalPages) return null;
                  
                  return (
                    <Button 
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PenjualanPage;
