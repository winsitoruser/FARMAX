import React, { useState, useEffect } from 'react';
import { 
  FaBoxOpen, FaShoppingCart, FaExchangeAlt, FaChartLine, 
  FaCalendarDay, FaExclamationTriangle, FaWarehouse, FaTruck,
  FaClipboardCheck, FaBars, FaArrowUp, FaArrowDown,
  FaFileMedical, FaSearchDollar, FaBell
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { mockProducts, mockStocks } from './types';
import { formatRupiah } from '@/lib/utils';
import { LineChart, BarChart, DonutChart } from '@tremor/react';

// Simulated data - would come from API in real implementation
const branches = [
  { id: 'all', name: 'Semua Cabang' },
  { id: '1', name: 'Apotek Pusat - Jakarta' },
  { id: '2', name: 'Cabang Bandung' },
  { id: '3', name: 'Cabang Surabaya' },
  { id: '4', name: 'Cabang Medan' },
];

const stockAlerts = [
  { 
    id: '1', 
    type: 'low_stock', 
    severity: 'critical', 
    message: 'Paracetamol 500mg hampir habis di Cabang Bandung (sisa 5 box)', 
    product: 'Paracetamol 500mg', 
    branch: 'Cabang Bandung',
    createdAt: '2025-03-29T14:23:11'
  },
  { 
    id: '2', 
    type: 'expiring_soon', 
    severity: 'warning', 
    message: 'Amoxicillin 500mg kedaluwarsa dalam 30 hari di Apotek Pusat', 
    product: 'Amoxicillin 500mg', 
    branch: 'Apotek Pusat - Jakarta',
    createdAt: '2025-03-30T09:12:43'
  },
  { 
    id: '3', 
    type: 'expired', 
    severity: 'critical', 
    message: 'Vitamin C 1000mg sudah kedaluwarsa di Cabang Surabaya', 
    product: 'Vitamin C 1000mg', 
    branch: 'Cabang Surabaya',
    createdAt: '2025-03-30T11:05:22'
  },
  { 
    id: '4', 
    type: 'overstock', 
    severity: 'info', 
    message: 'Antiseptik Tangan 500ml kelebihan stok di Cabang Medan', 
    product: 'Antiseptik Tangan 500ml', 
    branch: 'Cabang Medan',
    createdAt: '2025-03-28T16:47:55'
  },
];

const recentTransactions = [
  { 
    id: 'tr1', 
    type: 'purchase', 
    date: '2025-03-30T08:32:11', 
    description: 'Penerimaan barang PO-2025-0342', 
    amount: 15250000, 
    items: 24, 
    branch: 'Apotek Pusat - Jakarta',
    status: 'completed'
  },
  { 
    id: 'tr2', 
    type: 'transfer', 
    date: '2025-03-30T10:15:32', 
    description: 'Transfer stok ke Cabang Bandung', 
    amount: 8750000, 
    items: 12, 
    branch: 'Cabang Bandung',
    status: 'in_transit'
  },
  { 
    id: 'tr3', 
    type: 'sale', 
    date: '2025-03-30T11:42:08', 
    description: 'Penjualan dari POS', 
    amount: 1250000, 
    items: 8, 
    branch: 'Cabang Surabaya',
    status: 'completed'
  },
  { 
    id: 'tr4', 
    type: 'adjustment', 
    date: '2025-03-29T16:23:47', 
    description: 'Penyesuaian stok setelah stock opname', 
    amount: -450000, 
    items: 3, 
    branch: 'Cabang Medan',
    status: 'completed'
  },
  { 
    id: 'tr5', 
    type: 'expired', 
    date: '2025-03-29T14:52:36', 
    description: 'Pemusnahan obat kedaluwarsa', 
    amount: -1750000, 
    items: 5, 
    branch: 'Apotek Pusat - Jakarta',
    status: 'completed'
  },
];

// Sales data for charts
const salesData = [
  { 
    date: "Jan 2025", 
    "Apotek Pusat": 5450000, 
    "Cabang Bandung": 3250000, 
    "Cabang Surabaya": 4120000, 
    "Cabang Medan": 2840000,
  },
  { 
    date: "Feb 2025", 
    "Apotek Pusat": 5720000, 
    "Cabang Bandung": 3840000, 
    "Cabang Surabaya": 4350000, 
    "Cabang Medan": 3120000,
  },
  { 
    date: "Mar 2025", 
    "Apotek Pusat": 6250000, 
    "Cabang Bandung": 4120000, 
    "Cabang Surabaya": 4650000, 
    "Cabang Medan": 3580000,
  },
];

// Stock distribution data
const stockDistribution = [
  { branch: "Apotek Pusat", value: 45 },
  { branch: "Cabang Bandung", value: 20 },
  { branch: "Cabang Surabaya", value: 20 },
  { branch: "Cabang Medan", value: 15 },
];

// Stock categories data
const stockCategories = [
  { category: "Obat Bebas", value: 35 },
  { category: "Obat Bebas Terbatas", value: 25 },
  { category: "Obat Keras", value: 20 },
  { category: "Suplemen", value: 15 },
  { category: "Alat Kesehatan", value: 5 },
];

const InventoryDashboard: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  
  // These would be fetched from API based on selected branch and time range
  const [stats, setStats] = useState({
    totalProducts: 1245,
    totalStock: 48562,
    lowStockItems: 15,
    expiringItems: 28,
    stockValue: 1250000000, // in IDR
    salesToday: 24500000,
    salesTrend: 12.5, // percentage increase/decrease
    pendingOrders: 4,
    pendingTransfers: 2,
    completedOpname: 85, // percentage
  });
  
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-50';
      case 'warning': return 'text-amber-500 bg-amber-50';
      case 'info': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <FaShoppingCart className="text-green-500" />;
      case 'transfer': return <FaExchangeAlt className="text-blue-500" />;
      case 'sale': return <FaShoppingCart className="text-purple-500" />;
      case 'adjustment': return <FaClipboardCheck className="text-amber-500" />;
      case 'expired': return <FaCalendarDay className="text-red-500" />;
      default: return <FaBars className="text-gray-500" />;
    }
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Inventori</h1>
          <p className="text-gray-500">Pantau dan kelola stok apotek di semua cabang</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-40">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Cabang" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-1 border rounded-md overflow-hidden">
            <Button 
              variant={timeRange === 'week' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange('week')}
              className="px-3"
            >
              Minggu
            </Button>
            <Button 
              variant={timeRange === 'month' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange('month')}
              className="px-3"
            >
              Bulan
            </Button>
            <Button 
              variant={timeRange === 'year' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setTimeRange('year')}
              className="px-3"
            >
              Tahun
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FaFileMedical className="mr-2 h-4 w-4" />
                <span>Laporan</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Laporan Inventory</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <FaBoxOpen className="mr-2 h-4 w-4" />
                  <span>Stok Saat Ini</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaCalendarDay className="mr-2 h-4 w-4" />
                  <span>Kedaluwarsa</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaSearchDollar className="mr-2 h-4 w-4" />
                  <span>Valuasi Inventory</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaShoppingCart className="mr-2 h-4 w-4" />
                  <span>Pembelian</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaExchangeAlt className="mr-2 h-4 w-4" />
                  <span>Transfer Stok</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Produk</CardTitle>
            <FaBoxOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Di semua cabang</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Nilai Stok</CardTitle>
            <FaSearchDollar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(stats.stockValue)}</div>
            <p className="text-xs text-gray-500 mt-1">Total nilai inventori</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Penjualan Hari Ini</CardTitle>
            <FaShoppingCart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(stats.salesToday)}</div>
            <p className="text-xs flex items-center mt-1">
              {stats.salesTrend >= 0 ? (
                <>
                  <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                  <span className="text-green-500">{stats.salesTrend}%</span>
                </>
              ) : (
                <>
                  <FaArrowDown className="text-red-500 mr-1 h-3 w-3" />
                  <span className="text-red-500">{Math.abs(stats.salesTrend)}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">vs kemarin</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Stok Menipis</CardTitle>
            <FaExclamationTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-gray-500 mt-1">
              Produk di bawah ROP
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Kedaluwarsa</CardTitle>
            <FaCalendarDay className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringItems}</div>
            <p className="text-xs text-gray-500 mt-1">
              Produk kedaluwarsa &lt; 90 hari
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Charts Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Penjualan per Cabang</CardTitle>
            <CardDescription>Analisis penjualan untuk periode {timeRange === 'week' ? 'mingguan' : timeRange === 'month' ? 'bulanan' : 'tahunan'}</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={salesData}
              index="date"
              categories={["Apotek Pusat", "Cabang Bandung", "Cabang Surabaya", "Cabang Medan"]}
              colors={["blue", "green", "orange", "purple"]}
              valueFormatter={(value: number) => `Rp ${(value / 1000000).toFixed(1)} juta`}
              className="h-72"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Stok</CardTitle>
            <CardDescription>Persentase stok di setiap cabang</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={stockDistribution}
              category="value"
              index="branch"
              colors={["blue", "green", "orange", "purple"]}
              valueFormatter={(value: number) => `${value}%`}
              className="h-60"
            />
            <div className="mt-4">
              <div className="text-sm font-medium">Distribusi Kategori Produk</div>
              <div className="space-y-2 mt-2">
                {stockCategories.map((item) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="text-sm flex-1">{item.category}</div>
                    <div className="text-sm font-medium">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alerts and Activity Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Transaksi Terbaru</CardTitle>
              <Button variant="ghost" size="sm">Lihat Semua</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-start gap-3 p-3 rounded-md border border-gray-100 hover:bg-gray-50">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {getTransactionTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Selesai' : 
                         transaction.status === 'in_transit' ? 'Dalam Perjalanan' : 
                         transaction.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        <span className="mx-1">•</span>
                        {transaction.branch}
                        <span className="mx-1">•</span>
                        {transaction.items} item
                      </p>
                      <p className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatRupiah(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FaBell className="h-4 w-4 text-amber-500" />
                <span>Notifikasi Stok</span>
              </CardTitle>
              <Badge variant="outline">{stockAlerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stockAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-md border ${getSeverityColor(alert.severity)} border-l-4 ${
                    alert.severity === 'critical' ? 'border-l-red-500' : 
                    alert.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
                  }`}
                >
                  <p className="text-sm font-medium">{alert.message}</p>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">{alert.branch}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Separator className="my-3" />
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Stok Opname</span>
                    <span className="font-medium">{stats.completedOpname}% Selesai</span>
                  </div>
                  <Progress value={stats.completedOpname} className="h-2" />
                </div>
                
                <div className="flex justify-between gap-3 text-sm">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FaTruck className="mr-2 h-3 w-3" />
                    <span>Order ({stats.pendingOrders})</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <FaExchangeAlt className="mr-2 h-3 w-3" />
                    <span>Transfer ({stats.pendingTransfers})</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
