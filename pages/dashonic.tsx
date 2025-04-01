import React, { useState } from "react";
import type { NextPage } from "next";
import { 
  FaMoneyBillWave, FaShoppingCart, FaExclamationTriangle, FaUserFriends, 
  FaBoxOpen, FaChartLine, FaChartPie, FaUsers, FaCalendarAlt, 
  FaClipboardList, FaArrowUp, FaArrowDown, FaStore, FaWallet,
  FaTag, FaCreditCard, FaTachometerAlt, FaFileInvoiceDollar, FaChartBar
} from "react-icons/fa";
import DashonicLayout from "@/components/layouts/dashonic-layout";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import AnalyticsWidget from "@/components/dashboard/analytics-widget";
import DataTableWidget from "@/components/dashboard/data-table-widget";
import ProgressChart from "@/components/dashboard/progress-chart";

// Define the daily and monthly sales data interfaces
interface DailySalesData {
  today: number;
  yesterday: number;
  percentage: number;
  count: number;
  productsSold: number;
  lowStock: number;
  activeSuppliers: number;
  topSellingProducts: Array<{
    id: string;
    name: string;
    qty: number;
    total: number;
  }>;
}

interface MonthlySalesData {
  thisMonth: number;
  lastMonth: number;
  percentage: number;
  count: number;
  productsSold: number;
  lowStock: number;
  activeSuppliers: number;
}

// Mock sales data
const dailySales: DailySalesData = {
  today: 5200000,
  yesterday: 4800000,
  percentage: 8.33,
  count: 42,
  productsSold: 156,
  lowStock: 8,
  activeSuppliers: 12,
  topSellingProducts: [
    { id: '1', name: 'Paracetamol 500mg', qty: 45, total: 900000 },
    { id: '2', name: 'Amoxicillin 500mg', qty: 32, total: 1280000 },
    { id: '3', name: 'Vitamin C 1000mg', qty: 28, total: 840000 },
    { id: '4', name: 'Antasida Doen', qty: 22, total: 550000 },
    { id: '5', name: 'Salep Kulit Gentamicin', qty: 18, total: 630000 },
  ]
};

const monthlySales: MonthlySalesData = {
  thisMonth: 142500000,
  lastMonth: 136000000,
  percentage: 4.78,
  count: 1248,
  productsSold: 4350,
  lowStock: 8,
  activeSuppliers: 15,
};

// Chart data
const salesChartData: Array<{date: string; sales: number; percentage: number; label: string}> = [
  { date: "2023-05-01", sales: 3200000, percentage: 65, label: "Sen" },
  { date: "2023-05-02", sales: 4100000, percentage: 82, label: "Sel" },
  { date: "2023-05-03", sales: 3800000, percentage: 76, label: "Rab" },
  { date: "2023-05-04", sales: 4300000, percentage: 86, label: "Kam" },
  { date: "2023-05-05", sales: 5100000, percentage: 100, label: "Jum" },
  { date: "2023-05-06", sales: 4200000, percentage: 84, label: "Sab" },
  { date: "2023-05-07", sales: 3500000, percentage: 70, label: "Min" },
];

// Low stock products
const lowStockProducts = [
  { id: '1', name: 'Paracetamol 500mg', stock: 8, minStock: 10, category: 'Analgesik' },
  { id: '2', name: 'Amoxicillin 500mg', stock: 5, minStock: 15, category: 'Antibiotik' },
  { id: '3', name: 'Vitamin C 1000mg', stock: 7, minStock: 20, category: 'Vitamin' },
  { id: '4', name: 'Antasida Doen', stock: 9, minStock: 15, category: 'Obat Lambung' },
];

// Recent transactions
const recentTransactions = [
  { id: 'TR-001', customer: 'Budi Santoso', date: '2023-05-07', total: 125000, status: 'Completed' },
  { id: 'TR-002', customer: 'Ani Wijaya', date: '2023-05-07', total: 85000, status: 'Completed' },
  { id: 'TR-003', customer: 'Dewi Sartika', date: '2023-05-06', total: 210000, status: 'Completed' },
  { id: 'TR-004', customer: 'Joko Widodo', date: '2023-05-06', total: 45000, status: 'Completed' },
  { id: 'TR-005', customer: 'Siti Nurhaliza', date: '2023-05-05', total: 320000, status: 'Completed' },
];

// Yearly Performance data
const yearlyPerformanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasetLabel: 'Pendapatan 2023',
  values: [42500000, 38900000, 55300000, 48700000, 58900000, 63100000, 55800000, 64200000, 72500000, 68900000, 74200000, 82500000]
};

// Monthly target data
const monthlyTargetData = {
  labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
  datasetLabel: 'Progress Target',
  values: [25, 40, 65, 85]
};

// Category breakdown
const categoryBreakdownData = {
  labels: ['Antibiotik', 'Analgesik', 'Vitamin', 'Suplemen', 'Obat Batuk', 'Lain-lain'],
  datasets: [
    {
      data: [35, 25, 22, 10, 5, 3],
      backgroundColor: ['#FF9800', '#4CAF50', '#2196F3', '#9C27B0', '#F44336', '#a1a1a1'],
      borderWidth: 0
    }
  ]
};

// Stats cards data
const statsCards = [
  {
    title: 'Penjualan Harian',
    value: 'Rp 5,200,000',
    icon: <FaMoneyBillWave />,
    bgColor: 'bg-gradient-to-r from-orange-500 to-amber-500',
    textColor: 'text-white',
    trend: '+8.33%',
    trendIcon: <FaArrowUp className="mr-1" />,
    trendColor: 'text-emerald-300'
  },
  {
    title: 'Produk Terjual',
    value: '156',
    icon: <FaShoppingCart />,
    bgColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    textColor: 'text-white',
    trend: '+4.5%',
    trendIcon: <FaArrowUp className="mr-1" />,
    trendColor: 'text-emerald-300'
  },
  {
    title: 'Stok Menipis',
    value: '8',
    icon: <FaExclamationTriangle />,
    bgColor: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    textColor: 'text-white',
    trend: '-2.3%',
    trendIcon: <FaArrowDown className="mr-1" />,
    trendColor: 'text-amber-300'
  },
  {
    title: 'Total Transaksi',
    value: '42',
    icon: <FaFileInvoiceDollar />,
    bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    textColor: 'text-white',
    trend: '+6.2%',
    trendIcon: <FaArrowUp className="mr-1" />,
    trendColor: 'text-blue-300'
  }
];

const DashonicDashboard: NextPage = () => {
  const [salesPeriod, setSalesPeriod] = useState<"daily" | "monthly">("daily");
  
  // Get active sales data based on selected period
  const activeSalesData = salesPeriod === "daily" 
    ? dailySales 
    : monthlySales;
  
  // Calculate the sales comparison with proper type checking
  const salesValue = salesPeriod === "daily" 
    ? (activeSalesData as DailySalesData).today 
    : (activeSalesData as MonthlySalesData).thisMonth;

  return (
    <DashonicLayout>
      {/* Welcome Section with Stats Cards */}
      <div className="mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-500">Dashboard Apotek</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <Card key={index} className={`border-0 shadow-md ${card.bgColor}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className={`text-sm font-medium ${card.textColor} opacity-90`}>{card.title}</p>
                    <h3 className={`text-2xl font-bold mt-2 ${card.textColor}`}>{card.value}</h3>
                    <div className={`flex items-center mt-2 text-xs font-medium ${card.trendColor}`}>
                      {card.trendIcon}
                      <span>{card.trend}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-white bg-opacity-20`}>
                    {React.cloneElement(card.icon as React.ReactElement, { 
                      className: "h-6 w-6 text-white"
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Sales Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="border shadow-sm h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-800">Revenue Overview</CardTitle>
                  <CardDescription className="text-sm text-gray-500">Pendapatan Tahunan</CardDescription>
                </div>
                <Tabs 
                  value={salesPeriod} 
                  onValueChange={(value) => setSalesPeriod(value as "daily" | "monthly")}
                >
                  <TabsList className="h-9">
                    <TabsTrigger value="daily" className="text-xs data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                      Harian
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                      Bulanan
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <AnalyticsChart 
                title=""
                subtitle=""
                chartType="bar"
                chartHeight={335}
                data={yearlyPerformanceData}
                colorScheme="warning"
                hideHeader={true}
                gradient={true}
                barThickness={20}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Category Sales</CardTitle>
              <CardDescription className="text-sm text-gray-500">Distribusi Penjualan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <AnalyticsChart 
                  title=""
                  subtitle=""
                  chartType="doughnut"
                  chartHeight={240}
                  data={categoryBreakdownData}
                  colorScheme="warning"
                  hideHeader={true}
                />
              </div>
              
              <div className="mt-4 space-y-3">
                {categoryBreakdownData.labels.map((label, index) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: categoryBreakdownData.datasets[0].backgroundColor[index] }}
                      ></div>
                      <span className="text-sm text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {categoryBreakdownData.datasets[0].data[index]}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Target Progress, Stat Widgets and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div>
          <Card className="border shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">Target Bulanan</CardTitle>
              <CardDescription className="text-sm text-gray-500">Progress Pencapaian</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="mb-4 flex flex-col items-center">
                <ProgressChart 
                  percentage={78} 
                  size="lg" 
                  color="orange"
                  animated={true}
                />
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold text-gray-800">Rp 156.000.000</h3>
                  <p className="text-sm text-gray-500">dari target Rp 200.000.000</p>
                </div>
              </div>
              
              <div className="w-full mt-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Minggu 1</span>
                      <span className="text-sm font-medium text-gray-700">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Minggu 2</span>
                      <span className="text-sm font-medium text-gray-700">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Minggu 3</span>
                      <span className="text-sm font-medium text-gray-700">65%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Minggu 4</span>
                      <span className="text-sm font-medium text-gray-700">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            <AnalyticsWidget 
              title="Rata-rata Transaksi"
              value={formatRupiah(salesValue / activeSalesData.count)}
              subtitle="Per transaksi"
              icon={<FaWallet />}
              color="warning"
              trend={{
                value: 3.8,
                label: "peningkatan",
                icon: <FaArrowUp size={10} className="mr-1" />
              }}
            />
            
            <AnalyticsWidget 
              title="Nilai Diskon"
              value={formatRupiah(salesValue * 0.08)}
              subtitle="Total diskon"
              icon={<FaTag />}
              color="danger"
              trend={{
                value: -1.5,
                label: "penurunan",
                icon: <FaArrowDown size={10} className="mr-1" />
              }}
            />
            
            <DataTableWidget 
              title="Produk Terlaris"
              description=""
              data={salesPeriod === "daily" ? dailySales.topSellingProducts.slice(0, 3) : []}
              columns={[
                { header: 'Produk', accessorKey: 'name' },
                { 
                  header: 'Total', 
                  accessorKey: 'total', 
                  cell: (row) => formatRupiah(row.total),
                  className: 'text-right'
                }
              ]}
              colorScheme="warning"
            />
            
            <DataTableWidget 
              title="Stok Menipis"
              description=""
              data={lowStockProducts.slice(0, 3)}
              columns={[
                { header: 'Produk', accessorKey: 'name' },
                { 
                  header: 'Stok', 
                  accessorKey: 'stock',
                  cell: (row) => (
                    <Badge className="bg-red-100 text-red-600">
                      {row.stock}
                    </Badge>
                  ),
                  className: 'text-center'
                }
              ]}
              colorScheme="danger"
            />
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="mb-6">
        <DataTableWidget 
          title="Transaksi Terbaru"
          description="Daftar transaksi terbaru"
          data={recentTransactions}
          columns={[
            { header: 'ID', accessorKey: 'id' },
            { header: 'Pelanggan', accessorKey: 'customer' },
            { header: 'Tanggal', accessorKey: 'date' },
            { 
              header: 'Total', 
              accessorKey: 'total', 
              cell: (row) => formatRupiah(row.total),
              className: 'text-right'
            },
            { 
              header: 'Status', 
              accessorKey: 'status', 
              cell: (row) => (
                <Badge className="bg-emerald-100 text-emerald-700">
                  {row.status}
                </Badge>
              ),
              className: 'text-center'
            }
          ]}
          colorScheme="warning"
          pagination={true}
        />
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { title: 'POS', icon: <FaShoppingCart size={20} />, path: '/pos' },
          { title: 'Inventory', icon: <FaBoxOpen size={20} />, path: '/inventory' },
          { title: 'Finance', icon: <FaFileInvoiceDollar size={20} />, path: '/finance' },
          { title: 'Reports', icon: <FaChartBar size={20} />, path: '/reports' },
          { title: 'Customers', icon: <FaUsers size={20} />, path: '/customers' },
          { title: 'Products', icon: <FaStore size={20} />, path: '/products' },
        ].map((item, index) => (
          <Link 
            key={index}
            href={item.path} 
            className="group flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all h-24"
          >
            <div className="bg-orange-50 p-3 rounded-full group-hover:bg-orange-100 transition-colors mb-2">
              {React.cloneElement(item.icon as React.ReactElement, { 
                className: "text-orange-500"
              })}
            </div>
            <span className="text-sm font-medium text-gray-800">{item.title}</span>
          </Link>
        ))}
      </div>
    </DashonicLayout>
  );
};

export default DashonicDashboard;
