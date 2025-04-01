import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { formatRupiah } from '@/lib/utils';
import useOrderData from '@/hooks/use-order';
import useOpname from '@/hooks/use-opname';
import useInvoiceData from '@/hooks/use-invoice'; 
import useProductData from '@/hooks/use-product'; 
import useEmployeeData from '@/hooks/use-employee'; 
import useFinanceData from '@/hooks/use-finance'; 

import { 
  Card, 
  CardContent, 
  CardHeader 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { 
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaStoreAlt,
  FaUser,
  FaExclamationTriangle,
  FaClipboardList,
  FaArrowRight,
  FaBoxes,
  FaUsers,
  FaMoneyBillWave,
  FaTags,
  FaShoppingCart,
  FaSearch,
  FaCalendarAlt,
  FaServer,
  FaChevronDown,
  FaChevronRight,
  FaCashRegister,
  FaDownload
} from 'react-icons/fa';

// Dynamically import ReactApexChart with SSR disabled and ONLY in browser environment
const ReactApexChart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[230px]">
      <div className="text-sm text-gray-500">Memuat chart...</div>
    </div>
  )
});

// Type and interface definitions
interface ChartData {
  data: number[]
}

interface ChartSetting {
  options: any;
  series: any;
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: number
  changeText: string
  changeType?: 'positive' | 'negative'
  bgFrom: string
  bgTo: string
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeText, 
  changeType = 'positive',
  bgFrom,
  bgTo
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-500">Dari bulan lalu</p>
        </div>
        <div className="text-gray-500 text-xs">{value}</div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center bg-gradient-to-r ${bgFrom} ${bgTo} text-white mr-3`}>
            {icon}
          </div>
          <div>
            <p className={`text-sm font-medium flex items-center ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? <FaArrowUp className="h-3 w-3 mr-1" /> : <FaArrowDown className="h-3 w-3 mr-1" />}
              {change}% {changeText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function DashboardPage() {
  const router = useRouter();
  const [isLoadingChart] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [mounted, setMounted] = useState(false);
  const { order, isLoading: isLoadingOrder } = useOrderData();
  const { opnames, isLoading: loadingOpname } = useOpname();
  const { invoices, isLoading: loadingInvoices } = useInvoiceData();
  const { products, lowStockProducts, isLoading: loadingProducts } = useProductData();
  const { employees, isLoading: loadingEmployees } = useEmployeeData();
  const { financialData, isLoading: loadingFinance } = useFinanceData();

  // Data pendapatan per cabang - Connected to financial data
  const branchRevenueData = financialData?.branchRevenue || [
    { name: "Cabang Menteng", revenue: 82500000, growth: 15, invoiceCount: 42, staffCount: 14 },
    { name: "Cabang Kemang", revenue: 76300000, growth: 8, invoiceCount: 38, staffCount: 12 },
    { name: "Cabang BSD", revenue: 65100000, growth: 12, invoiceCount: 31, staffCount: 11 },
    { name: "Cabang Kelapa Gading", revenue: 48700000, growth: -3, invoiceCount: 25, staffCount: 9 },
    { name: "Cabang Bekasi", revenue: 38200000, growth: 5, invoiceCount: 22, staffCount: 8 }
  ];

  // Data faktur yang perlu dibayar - Connected to invoice data
  const unpaidInvoicesData = invoices ? invoices.filter(inv => inv.status !== "paid").map(inv => ({
    id: inv.id,
    supplier: inv.supplier,
    amount: inv.amount,
    dueDate: inv.dueDate,
    status: inv.status,
    daysToDue: inv.daysToDue,
    paidAmount: inv.paidAmount || 0, 
    paymentPercentage: Math.round((inv.paidAmount || 0) / inv.amount * 100) 
  })) : [
    { id: "INV-2025032", supplier: "PT Kimia Farma", amount: 14500000, dueDate: "2025-04-05", status: "partial", daysToDue: 7, paidAmount: 5800000, paymentPercentage: 40 },
    { id: "INV-2025041", supplier: "PT Kalbe Farma", amount: 12800000, dueDate: "2025-04-10", status: "pending", daysToDue: 12, paidAmount: 0, paymentPercentage: 0 },
    { id: "INV-2025038", supplier: "PT Dexa Medica", amount: 8700000, dueDate: "2025-04-03", status: "partial", daysToDue: 5, paidAmount: 6525000, paymentPercentage: 75 },
    { id: "INV-2025045", supplier: "PT Bintang Toedjoe", amount: 6300000, dueDate: "2025-04-12", status: "pending", daysToDue: 14, paidAmount: 0, paymentPercentage: 0 },
    { id: "INV-2025029", supplier: "PT Sanbe Farma", amount: 5200000, dueDate: "2025-04-02", status: "partial", daysToDue: 4, paidAmount: 1560000, paymentPercentage: 30 }
  ];

  // Data nilai inventory - Connected to product data
  const inventoryValueData = products ? [
    { category: "Obat Resep", value: products.filter(p => p.category === "Obat Resep").reduce((sum, p) => sum + (p.stock * p.buyPrice), 0), itemCount: products.filter(p => p.category === "Obat Resep").length, lowStock: lowStockProducts?.filter(p => p.category === "Obat Resep")?.length || 0 },
    { category: "OTC", value: products.filter(p => p.category === "OTC").reduce((sum, p) => sum + (p.stock * p.buyPrice), 0), itemCount: products.filter(p => p.category === "OTC").length, lowStock: lowStockProducts?.filter(p => p.category === "OTC")?.length || 0 },
    { category: "Alat Kesehatan", value: products.filter(p => p.category === "Alat Kesehatan").reduce((sum, p) => sum + (p.stock * p.buyPrice), 0), itemCount: products.filter(p => p.category === "Alat Kesehatan").length, lowStock: lowStockProducts?.filter(p => p.category === "Alat Kesehatan")?.length || 0 },
    { category: "Susu & Nutrisi", value: products.filter(p => p.category === "Susu & Nutrisi").reduce((sum, p) => sum + (p.stock * p.buyPrice), 0), itemCount: products.filter(p => p.category === "Susu & Nutrisi").length, lowStock: lowStockProducts?.filter(p => p.category === "Susu & Nutrisi")?.length || 0 },
    { category: "Perawatan Pribadi", value: products.filter(p => p.category === "Perawatan Pribadi").reduce((sum, p) => sum + (p.stock * p.buyPrice), 0), itemCount: products.filter(p => p.category === "Perawatan Pribadi").length, lowStock: lowStockProducts?.filter(p => p.category === "Perawatan Pribadi")?.length || 0 }
  ] : [
    { category: "Obat Resep", value: 126000000, itemCount: 427, lowStock: 18 },
    { category: "OTC", value: 89300000, itemCount: 315, lowStock: 12 },
    { category: "Alat Kesehatan", value: 53700000, itemCount: 186, lowStock: 8 },
    { category: "Susu & Nutrisi", value: 42300000, itemCount: 142, lowStock: 5 },
    { category: "Perawatan Pribadi", value: 31500000, itemCount: 108, lowStock: 3 }
  ];

  // Data pegawai per cabang - Connected to employee data
  const employeeData = employees ? 
    Object.entries(employees.reduce((acc, emp) => {
      acc[emp.branch] = (acc[emp.branch] || 0) + 1;
      return acc;
    }, {})).map(([name, count]) => ({ name, employeeCount: count }))
    : [
    { name: "Cabang Menteng", employeeCount: 14 },
    { name: "Cabang Kemang", employeeCount: 12 },
    { name: "Cabang BSD", employeeCount: 11 },
    { name: "Cabang Kelapa Gading", employeeCount: 9 },
    { name: "Cabang Bekasi", employeeCount: 8 }
  ];

  // Periksa apakah data siap untuk ditampilkan
  const isDataReady = !isLoadingOrder && !loadingOpname && !loadingInvoices && !loadingProducts && !loadingEmployees && !loadingFinance;

  // Statistik untuk stat cards
  const totalSales = order ? order.reduce((sum, o) => sum + o.totalPrice, 0) : 32589500;
  const lowStockCount = lowStockProducts?.length || 18;
  const todayTransactions = order ? order.filter(o => new Date(o.tanggal).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)).length : 47;
  const activeCustomers = order ? new Set(order.map(o => o.customerId)).size : 1248;

  // Chart konfigurasi untuk pendapatan cabang - Connected to finance data
  const branchRevenueChartOptions = {
    options: {
      chart: {
        type: 'bar' as const,
        toolbar: {
          show: false
        },
        fontFamily: "Inter, sans-serif",
      },
      colors: ["#f97316"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          barHeight: '70%',
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: branchRevenueData.map(branch => branch.name),
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px"
          }
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
      },
      tooltip: {
        y: {
          formatter: function(value: number) {
            return formatRupiah(value);
          }
        }
      }
    },
    series: [{
      name: "Pendapatan",
      data: branchRevenueData.map(branch => branch.revenue)
    }]
  };

  // Chart konfigurasi untuk distribusi nilai inventory - Connected to inventory data
  const inventoryValueChartOptions = {
    chart: {
      type: 'pie' as const,
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"],
    labels: inventoryValueData.map(cat => cat.category),
    legend: {
      position: 'bottom' as const,
      fontSize: '10px',
      fontFamily: 'Inter, sans-serif',
      markers: {
        size: 8
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              offsetY: 0,
            },
            value: {
              show: true,
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif',
              color: '#334155',
              formatter: function(val) {
                return formatRupiah(val * 1000000);
              }
            },
            total: {
              show: true,
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              label: 'Total Inventory',
              color: '#64748b',
              formatter: function(w) {
                return formatRupiah(w.globals.seriesTotals.reduce((a, b) => a + b, 0) * 1000000);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px',
        fontFamily: "Inter, sans-serif",
      },
      formatter: function(val: number) {
        return val.toFixed(1) + '%';
      },
      dropShadow: {
        enabled: false
      }
    },
    tooltip: {
      y: {
        formatter: function(value: number) {
          return formatRupiah(value);
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 200
          },
          legend: {
            position: 'bottom',
            offsetY: 5
          }
        }
      }
    ]
  };

  // Chart configuration for sales data - Connected to order data
  const weeklySalesData = order ? 
    Array(7).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - date.getDay() + i);
      const dayOrders = order.filter(o => {
        const orderDate = new Date(o.tanggal);
        return orderDate.getDate() === date.getDate() && 
               orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear();
      });
      
      const totalSales = dayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      const totalCogs = dayOrders.reduce((sum, o) => sum + o.cogsTotal, 0);
      const grossProfit = totalSales - totalCogs;
      
      return {
        day: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][date.getDay()],
        sales: totalSales,
        cogs: totalCogs,
        profit: grossProfit
      };
    }) : 
    [
      { day: "Sen", sales: 4300000, cogs: 3200000, profit: 1100000 },
      { day: "Sel", sales: 2500000, cogs: 1700000, profit: 800000 },
      { day: "Rab", sales: 4800000, cogs: 3600000, profit: 1200000 },
      { day: "Kam", sales: 3800000, cogs: 2800000, profit: 1000000 },
      { day: "Jum", sales: 4100000, cogs: 3000000, profit: 1100000 },
      { day: "Sab", sales: 6200000, cogs: 4500000, profit: 1700000 },
      { day: "Min", sales: 5000000, cogs: 3700000, profit: 1300000 }
    ];

  const chartSettingBar: ChartSetting = {
    options: {
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false
        },
        fontFamily: "Inter, sans-serif",
      },
      colors: ["#f97316", "#fdba74", "#fbbf24"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
        xaxis: {
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
      xaxis: {
        categories: weeklySalesData.map(day => day.day),
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: "#64748b",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (value: number) {
            return formatRupiah(value);
          },
          style: {
            colors: "#64748b",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px"
          }
        }
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
        offsetY: -8,
        markers: {
          size: 12
        },
        itemMargin: {
          horizontal: 8
        },
        onItemClick: {
          toggleDataSeries: true
        }
      }
    },
    series: [
      {
        name: "Total Penjualan",
        data: weeklySalesData.map(day => day.sales)
      },
      {
        name: "HPP",
        data: weeklySalesData.map(day => day.cogs)
      },
      {
        name: "Laba Kotor",
        data: weeklySalesData.map(day => day.profit)
      }
    ]
  };

  // Data dummy untuk pie chart posisi stok, hutang dan piutang
  const financialPositionData = {
    series: [68, 22, 10],
    labels: ['Nilai Stok', 'Piutang', 'Hutang'],
    colors: ['#f97316', '#fb923c', '#fdba74']
  };

  // Pengaturan untuk pie chart
  const financialPositionOptions = {
    chart: {
      type: 'donut' as const,
      fontFamily: 'Inter, sans-serif',
    },
    colors: financialPositionData.colors,
    labels: financialPositionData.labels,
    legend: {
      position: 'bottom' as const,
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      offsetY: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              offsetY: 0,
            },
            value: {
              show: true,
              fontSize: '18px',
              fontFamily: 'Inter, sans-serif',
              color: '#334155',
              formatter: function(val) {
                return formatRupiah(val * 1000000);
              }
            },
            total: {
              show: true,
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              label: 'Total',
              color: '#64748b',
              formatter: function(w) {
                return formatRupiah(w.globals.seriesTotals.reduce((a, b) => a + b, 0) * 1000000);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return formatRupiah(val * 1000000);
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280
          },
          legend: {
            position: 'bottom',
            offsetY: 5
          }
        }
      }
    ]
  };

  // Helper function to format date
  const formatDate = ({ date }: { date: Date }) => {
    return format(date, "dd MMM yyyy, HH:mm");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-full bg-gray-50 py-4">
      {/* Container dengan lebar maksimum 1280px untuk layout yang kompak */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Filter Controls Section */}
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2">
            <Select defaultValue={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="h-9 w-[120px] text-xs">
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="quarter">Kuartal Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white h-9 text-xs">
              <FaDownload className="mr-2 h-3 w-3" />
              Export Data
            </Button>
          </div>
        </div>
        
        {/* Statistik Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard 
            title="Total Penjualan" 
            value={formatRupiah(totalSales)}
            icon={<FaMoneyBillWave className="h-4 w-4" />}
            change={12.5}
            changeText="dari bulan lalu"
            changeType="positive"
            bgFrom="from-orange-500"
            bgTo="to-amber-500"
          />
          <StatCard 
            title="Pelanggan Aktif" 
            value={activeCustomers}
            icon={<FaUser className="h-4 w-4" />}
            change={5.2}
            changeText="dari bulan lalu"
            changeType="positive"
            bgFrom="from-orange-500"
            bgTo="to-amber-500"
          />
          <StatCard 
            title="Stok Menipis" 
            value={lowStockCount}
            icon={<FaExclamationTriangle className="h-4 w-4" />}
            change={12}
            changeText="dari bulan lalu"
            changeType="negative"
            bgFrom="from-orange-500"
            bgTo="to-amber-500"
          />
          <StatCard 
            title="Transaksi Hari Ini" 
            value={todayTransactions}
            icon={<FaClipboardList className="h-4 w-4" />}
            change={8.3}
            changeText="dari kemarin"
            changeType="positive"
            bgFrom="from-orange-500"
            bgTo="to-amber-500"
          />
        </div>

        {/* Menu Modul Grid dengan desain dekoratif yang lebih elegan dan eye-catching */}
        <div className="mb-8 relative">
          {/* Background ornaments */}
          <div className="absolute -top-12 -right-16 h-40 w-40 bg-gradient-to-br from-orange-400/40 to-amber-500/40 rounded-full blur-2xl"></div>
          <div className="absolute top-1/3 left-12 h-28 w-28 bg-gradient-to-r from-orange-300/30 to-amber-300/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-12 right-1/4 h-24 w-24 bg-gradient-to-tr from-orange-400/20 to-amber-300/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-12 h-32 w-32 bg-gradient-to-tr from-orange-500/20 to-amber-400/20 rounded-full blur-2xl"></div>
          
          {/* Animated floating dots */}
          <div className="absolute top-1/4 right-1/3 h-2 w-2 bg-orange-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-2/3 right-1/4 h-2 w-2 bg-amber-400 rounded-full opacity-60 animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 h-3 w-3 bg-orange-300 rounded-full opacity-40 animate-pulse delay-700"></div>
          
          {/* Glassmorphism container with decorative elements */}
          <div className="relative bg-gradient-to-r from-orange-50/90 to-amber-50/90 backdrop-blur-lg p-8 rounded-2xl overflow-hidden border border-orange-200/50 shadow-xl">
            {/* Decorative background patterns */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.15),transparent_70%)]"></div>
              <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_70%)]"></div>
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,rgba(251,146,60,0.3)_25%,transparent_25%,transparent_50%,rgba(251,146,60,0.3)_50%,rgba(251,146,60,0.3)_75%,transparent_75%,transparent)] bg-[length:24px_24px]"></div>
            </div>
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-100/40 to-amber-100/20 rounded-bl-[40px] -z-0"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tr from-orange-100/30 to-amber-100/10 rounded-full blur-md"></div>
            
            {/* Luxurious header with accent elements */}
            <div className="relative flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-1.5 h-10 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-4 shadow-lg shadow-orange-300/30"></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">Akses Cepat Modul</span>
                  </h2>
                  <p className="text-xs text-orange-700/70 mt-0.5">Navigasi ke semua fitur utama aplikasi</p>
                </div>
                <div className="ml-4 bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1 rounded-full text-xs font-medium text-orange-700 border border-orange-200/50 shadow-sm">
                  <span className="flex items-center">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 mr-1.5 animate-pulse"></span>
                    Menu Utama
                  </span>
                </div>
              </div>
              <div className="hidden md:flex items-center px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full border border-orange-200/50 shadow-sm">
                <span className="text-xs font-medium text-orange-700 mr-2">Navigasi Lengkap</span>
                <span className="h-6 w-6 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md shadow-orange-200/50 transform transition-transform hover:scale-110">
                  <FaChevronRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </div>
            
            {/* Card grid with ultra-luxurious design */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative">
              {/* Subtle connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-orange-200/0 via-orange-300/30 to-amber-200/0"></div>
              
              {/* Kasir */}
              <Link href="/pos">
                <div className="group relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-4 rounded-xl border border-orange-100/80 hover:border-orange-300/80 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-102 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-sm">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-orange-100/40 to-amber-100/20 rounded-bl-[40px] -z-0"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-tr from-orange-100/30 to-amber-100/10 rounded-full blur-md"></div>
                  
                  {/* Elegant top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                      <div className="h-full w-8 bg-white blur-sm transform -skew-x-[45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1500"></div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="relative flex flex-col items-center justify-center text-center z-10 pt-1">
                    {/* Icon container */}
                    <div className="relative mb-2.5">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/40 group-hover:shadow-orange-300/50 transition-all">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute h-full w-3 bg-white/20 blur-sm transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                        </div>
                        
                        <FaCashRegister className="h-4.5 w-4.5 text-white transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Kasir</span>
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-amber-600 transition-colors duration-300">Point of Sales</span>
                    
                    {/* Underline animation */}
                    <div className="w-0 group-hover:w-full h-0.5 mt-1 bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
              </Link>
              
              {/* Inventaris */}
              <Link href="/inventory">
                <div className="group relative bg-white p-4 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transform transition-all duration-300 hover:scale-102 hover:-translate-y-1 cursor-pointer overflow-hidden">
                  
                  {/* Main content */}
                  <div className="relative flex flex-col items-center justify-center text-center z-10 pt-1">
                    {/* Icon container */}
                    <div className="relative mb-2.5">
                      <div className="absolute inset-0 bg-white rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative h-11 w-11 rounded-full bg-white flex items-center justify-center shadow-md shadow-gray-200/40 group-hover:shadow-gray-300/50 transition-all">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute h-full w-3 bg-white/20 blur-sm transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                        </div>
                        
                        <FaBoxes className="h-4.5 w-4.5 text-gray-800 transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Inventaris</span>
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-amber-600 transition-colors duration-300">Stok & Gudang</span>
                    
                    {/* Underline animation */}
                    <div className="w-0 group-hover:w-full h-0.5 mt-1 bg-gray-200 transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
              </Link>
              
              {/* Pembelian */}
              <Link href="/purchasing">
                <div className="group relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-4 rounded-xl border border-orange-100/80 hover:border-orange-300/80 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-102 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-sm">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-orange-100/40 to-amber-100/20 rounded-bl-[40px] -z-0"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-tr from-orange-100/30 to-amber-100/10 rounded-full blur-md"></div>
                  
                  {/* Elegant top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                      <div className="h-full w-8 bg-white blur-sm transform -skew-x-[45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1500"></div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="relative flex flex-col items-center justify-center text-center z-10 pt-1">
                    {/* Icon container */}
                    <div className="relative mb-2.5">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/40 group-hover:shadow-orange-300/50 transition-all">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute h-full w-3 bg-white/20 blur-sm transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                        </div>
                        
                        <FaShoppingCart className="h-4.5 w-4.5 text-white transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Pembelian</span>
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-amber-600 transition-colors duration-300">Order & Supplier</span>
                    
                    {/* Underline animation */}
                    <div className="w-0 group-hover:w-full h-0.5 mt-1 bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
              </Link>
              
              {/* Produk */}
              <Link href="/inventory/products">
                <div className="group relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-4 rounded-xl border border-orange-100/80 hover:border-orange-300/80 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-102 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-sm">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-orange-100/40 to-amber-100/20 rounded-bl-[40px] -z-0"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-tr from-orange-100/30 to-amber-100/10 rounded-full blur-md"></div>
                  
                  {/* Elegant top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                      <div className="h-full w-8 bg-white blur-sm transform -skew-x-[45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1500"></div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="relative flex flex-col items-center justify-center text-center z-10 pt-1">
                    {/* Icon container */}
                    <div className="relative mb-2.5">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/40 group-hover:shadow-orange-300/50 transition-all">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute h-full w-3 bg-white/20 blur-sm transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                        </div>
                        
                        <FaTags className="h-4.5 w-4.5 text-white transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Produk</span>
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-amber-600 transition-colors duration-300">Katalog & Obat</span>
                    
                    {/* Underline animation */}
                    <div className="w-0 group-hover:w-full h-0.5 mt-1 bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
              </Link>
              
              {/* Laporan */}
              <Link href="/reports">
                <div className="group relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-4 rounded-xl border border-orange-100/80 hover:border-orange-300/80 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-102 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-sm">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-orange-100/40 to-amber-100/20 rounded-bl-[40px] -z-0"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-tr from-orange-100/30 to-amber-100/10 rounded-full blur-md"></div>
                  
                  {/* Elegant top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                      <div className="h-full w-8 bg-white blur-sm transform -skew-x-[45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1500"></div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="relative flex flex-col items-center justify-center text-center z-10 pt-1">
                    {/* Icon container */}
                    <div className="relative mb-2.5">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/40 group-hover:shadow-orange-300/50 transition-all">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute h-full w-3 bg-white/20 blur-sm transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                        </div>
                        
                        <FaChartLine className="h-4.5 w-4.5 text-white transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Laporan</span>
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-amber-600 transition-colors duration-300">Analisis & Data</span>
                    
                    {/* Underline animation */}
                    <div className="w-0 group-hover:w-full h-0.5 mt-1 bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
              </Link>
              
              {/* Keuangan */}
              <Link href="/finance">
                <div className="group relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-4 rounded-xl border border-orange-100/80 hover:border-orange-300/80 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-102 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-sm">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-orange-100/40 to-amber-100/20 rounded-bl-[40px] -z-0"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-tr from-orange-100/30 to-amber-100/10 rounded-full blur-md"></div>
                  
                  {/* Elegant top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                      <div className="h-full w-8 bg-white blur-sm transform -skew-x-[45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1500"></div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="relative flex flex-col items-center justify-center text-center z-10 pt-1">
                    {/* Icon container */}
                    <div className="relative mb-2.5">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/40 group-hover:shadow-orange-300/50 transition-all">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute h-full w-3 bg-white/20 blur-sm transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                        </div>
                        
                        <FaMoneyBillWave className="h-4.5 w-4.5 text-white transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Keuangan</span>
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-amber-600 transition-colors duration-300">Invoice & Biaya</span>
                    
                    {/* Underline animation */}
                    <div className="w-0 group-hover:w-full h-0.5 mt-1 bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
              </Link>
              
              {/* Pengaturan */}
              <Link href="/settings">
                <div className="group relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 p-4 rounded-xl border border-orange-100/80 hover:border-orange-300/80 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-102 hover:-translate-y-1 cursor-pointer overflow-hidden backdrop-blur-sm">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-br from-orange-100/40 to-amber-100/20 rounded-bl-[40px] -z-0"></div>
                  <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-tr from-orange-100/30 to-amber-100/10 rounded-full blur-md"></div>
                  
                  {/* Elegant top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-400 shadow-sm overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                      <div className="h-full w-8 bg-white blur-sm transform -skew-x-[45deg] translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1500"></div>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="relative flex flex-col items-center justify-center text-center z-10 pt-1">
                    {/* Icon container */}
                    <div className="relative mb-2.5">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative h-11 w-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/40 group-hover:shadow-orange-300/50 transition-all">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute h-full w-3 bg-white/20 blur-sm transform -rotate-45 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                        </div>
                        
                        <FaServer className="h-4.5 w-4.5 text-white transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <span className="text-sm font-medium text-gray-800 group-hover:text-orange-700 transition-colors duration-300">Pengaturan</span>
                    <span className="text-xs text-gray-500 mt-0.5 group-hover:text-amber-600 transition-colors duration-300">Sistem & Akun</span>
                    
                    {/* Underline animation */}
                    <div className="w-0 group-hover:w-full h-0.5 mt-1 bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 rounded-full"></div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Layout Grid utama dengan spacing yang tepat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Chart Penjualan */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-800">Grafik Penjualan</h2>
                <p className="text-xs text-gray-500">Penjualan per hari dalam seminggu terakhir</p>
              </div>
              <Select defaultValue="week">
                <SelectTrigger className="h-8 w-[110px] text-xs">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="quarter">Kuartal Ini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-1 h-[280px]">
              {isLoadingChart || !mounted ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-sm text-gray-500">Memuat data penjualan...</div>
                </div>
              ) : (
                <ReactApexChart 
                  options={{
                    chart: {
                      type: 'bar' as const,
                      toolbar: {
                        show: false
                      },
                      fontFamily: "Inter, sans-serif",
                    },
                    colors: ["#f97316", "#fdba74", "#fbbf24"],
                    plotOptions: {
                      bar: {
                        borderRadius: 3,
                        columnWidth: '60%',
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    grid: {
                      borderColor: '#f1f5f9',
                      strokeDashArray: 4,
                      xaxis: {
                        lines: {
                          show: true
                        }
                      },
                      padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 5
                      }
                    },
                    xaxis: {
                      categories: weeklySalesData.map(day => day.day),
                      axisBorder: {
                        show: false
                      },
                      axisTicks: {
                        show: false
                      },
                      labels: {
                        style: {
                          colors: "#64748b",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "10px"
                        }
                      }
                    },
                    yaxis: {
                      labels: {
                        formatter: function (value: number) {
                          return formatRupiah(value);
                        },
                        style: {
                          colors: "#64748b",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "10px"
                        }
                      }
                    },
                    legend: {
                      show: true,
                      position: "top",
                      horizontalAlign: "right",
                      fontSize: "10px",
                      fontFamily: "Inter, sans-serif",
                      offsetY: -5,
                      markers: {
                        size: 8
                      },
                      itemMargin: {
                        horizontal: 8
                      },
                      onItemClick: {
                        toggleDataSeries: true
                      }
                    }
                  }}
                  series={[
                    {
                      name: "Total Penjualan",
                      data: weeklySalesData.map(day => day.sales)
                    },
                    {
                      name: "HPP",
                      data: weeklySalesData.map(day => day.cogs)
                    },
                    {
                      name: "Laba Kotor",
                      data: weeklySalesData.map(day => day.profit)
                    }
                  ]}
                  type="bar"
                  height={255}
                />
              )}
            </div>
          </div>
          
          {/* Tabel Transaksi Terbaru */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-800">Transaksi Terbaru</h2>
                <p className="text-xs text-gray-500">Daftar transaksi terbaru</p>
              </div>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                Lihat Semua
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="overflow-auto max-h-[255px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">ID</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Pelanggan</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tanggal</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {isLoadingOrder ? (
                    <tr>
                      <td colSpan={4} className="text-center py-3">
                        <div className="text-sm text-gray-500">Memuat...</div>
                      </td>
                    </tr>
                  ) : (
                    order.slice(0, 7).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">#{item.id}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{item.customerName}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{format(new Date(item.tanggal), 'dd/MM/yyyy')}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium text-gray-900">{formatRupiah(item.totalPrice)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Layout Grid untuk dua panel utama */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Pendapatan per Cabang */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-800">Pendapatan Cabang</h2>
                <p className="text-xs text-gray-500">Pendapatan per cabang</p>
              </div>
              <Select defaultValue="month">
                <SelectTrigger className="h-8 w-[110px] text-xs">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Mingguan</SelectItem>
                  <SelectItem value="month">Bulanan</SelectItem>
                  <SelectItem value="year">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-1 h-[280px]">
              {loadingFinance || !mounted ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-sm text-gray-500">Memuat data pendapatan...</div>
                </div>
              ) : (
                <ReactApexChart 
                  options={{
                    chart: {
                      type: 'bar' as const,
                      toolbar: {
                        show: false
                      },
                      fontFamily: "Inter, sans-serif",
                    },
                    colors: ["#f97316"],
                    plotOptions: {
                      bar: {
                        borderRadius: 3,
                        horizontal: true,
                        barHeight: '75%',
                        distributed: true,
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    xaxis: {
                      categories: branchRevenueData.map(branch => branch.name),
                      labels: {
                        style: {
                          colors: "#64748b",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "10px"
                        }
                      }
                    },
                    yaxis: {
                      labels: {
                        style: {
                          colors: "#64748b",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "10px"
                        }
                      }
                    },
                    grid: {
                      borderColor: '#f1f5f9',
                      strokeDashArray: 4,
                      padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 5
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: function(value: number) {
                          return formatRupiah(value);
                        }
                      }
                    }
                  }}
                  series={[{
                    name: "Pendapatan",
                    data: branchRevenueData.map(branch => branch.revenue)
                  }]}
                  type="bar"
                  height={255}
                />
              )}
            </div>
          </div>
          
          {/* Faktur yang perlu dibayar */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-800">Faktur Belum Dibayar</h2>
                <p className="text-xs text-gray-500">Faktur yang perlu dibayar</p>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => router.push('/finance/invoices')}
              >
                Lihat Semua
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="divide-y divide-gray-100 overflow-auto max-h-[255px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {loadingInvoices ? (
                <div className="px-3 py-6 text-center text-sm text-gray-500">Memuat data faktur...</div>
              ) : unpaidInvoicesData.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-gray-500">Tidak ada faktur yang belum dibayar</div>
              ) : (
                unpaidInvoicesData.map((invoice: any) => (
                  <div key={invoice.id} className="relative overflow-hidden px-3 py-2 hover:bg-gray-50">
                    {/* Background progress bar for partially paid invoices */}
                    {invoice.status === "partial" && (
                      <div className="absolute inset-0 z-0">
                        <div 
                          className={`absolute inset-y-0 left-0 ${
                            invoice.paymentPercentage < 30 
                              ? "bg-gradient-to-r from-amber-50 to-amber-100" 
                              : invoice.paymentPercentage < 70 
                                ? "bg-gradient-to-r from-orange-50 via-amber-100 to-amber-200"
                                : "bg-gradient-to-r from-amber-100 via-orange-100 to-orange-200"
                          } opacity-40`}
                          style={{ width: `${invoice.paymentPercentage}%` }}
                        >
                          {/* Diagonal pattern overlay */}
                          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(251,146,60,0.3)_25%,transparent_25%,transparent_50%,rgba(251,146,60,0.3)_50%,rgba(251,146,60,0.3)_75%,transparent_75%,transparent)] bg-[length:8px_8px]"></div>
                          
                          {/* Sparkling effect */}
                          <div className="absolute h-full w-1/5 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" style={{ backgroundSize: '200% 100%', right: 0 }}></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Invoice content (in foreground) */}
                    <div className="flex items-start relative z-10">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-orange-100 text-orange-700 mr-2">
                        <FaClipboardList className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-xs font-medium text-gray-900 truncate">{invoice.id}</p>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">
                            Jatuh tempo: {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                          {invoice.supplier} 
                          <span className="font-medium text-gray-700 ml-1">{formatRupiah(invoice.amount)}</span>
                        </p>
                        <div className="mt-1 flex items-center justify-between">
                          <Badge 
                            className={
                              invoice.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] px-1.5 py-0" : 
                              invoice.status === "paid" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] px-1.5 py-0" :
                              invoice.status === "partial" ? "bg-orange-100 text-orange-800 hover:bg-orange-200 text-[10px] px-1.5 py-0" : 
                              "bg-red-100 text-red-800 hover:bg-red-200 text-[10px] px-1.5 py-0"
                            }
                          >
                            {invoice.status === "pending" ? "Belum Dibayar" : 
                              invoice.status === "paid" ? "Sudah Dibayar" :
                              invoice.status === "partial" ? `Dibayar ${invoice.paymentPercentage}%` : 
                              "Dibatalkan"}
                          </Badge>
                          
                          {/* Show remaining amount for partial payments */}
                          {invoice.status === "partial" && (
                            <span className="text-[10px] text-gray-500">
                              Sisa: {formatRupiah(invoice.amount - invoice.paidAmount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Layout Grid untuk dua panel selanjutnya */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          {/* Nilai Inventory */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-800">Nilai Inventory</h2>
                <p className="text-xs text-gray-500">Distribusi nilai inventory</p>
              </div>
            </div>
            <div className="p-3 relative">
              {/* Elegant decorative elements */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400/30 via-amber-400/40 to-orange-400/30"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100/50 to-amber-100/30 rounded-bl-[40px] -z-0"></div>
              
              {loadingProducts || !mounted ? (
                <div className="flex justify-center items-center h-[230px]">
                  <div className="text-sm text-gray-500">Memuat data inventory...</div>
                </div>
              ) : (
                <ReactApexChart
                  options={inventoryValueChartOptions}
                  series={inventoryValueData.map(item => item.value)}
                  type="pie"
                  height={230}
                />
              )}
            </div>
          </div>
          
          {/* Posisi Keuangan */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-800">Posisi Keuangan</h2>
                <p className="text-xs text-gray-500">Stok, Hutang & Piutang</p>
              </div>
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 px-2 py-1 rounded-full text-xs font-medium text-orange-700 border border-orange-200/50 shadow-sm">
                  <span className="flex items-center">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 mr-1.5 animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 relative">
              {/* Elegant decorative elements */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400/30 via-amber-400/40 to-orange-400/30"></div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100/50 to-amber-100/30 rounded-bl-[40px] -z-0"></div>
              
              {loadingFinance || !mounted ? (
                <div className="flex justify-center items-center h-[230px]">
                  <div className="text-sm text-gray-500">Memuat data keuangan...</div>
                </div>
              ) : (
                <div>
                  <ReactApexChart
                    options={financialPositionOptions}
                    series={financialPositionData.series}
                    type="donut"
                    height={200}
                  />
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="flex flex-col items-center p-1.5 bg-orange-50 rounded-lg border border-orange-100/70">
                      <span className="text-xs font-semibold text-orange-700">Stok</span>
                      <span className="text-xs font-semibold text-gray-800">{formatRupiah(68000000)}</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 bg-amber-50 rounded-lg border border-amber-100/70">
                      <span className="text-xs font-semibold text-amber-700">Piutang</span>
                      <span className="text-xs font-semibold text-gray-800">{formatRupiah(22000000)}</span>
                    </div>
                    <div className="flex flex-col items-center p-1.5 bg-orange-50/80 rounded-lg border border-orange-100/60">
                      <span className="text-xs font-semibold text-orange-600">Hutang</span>
                      <span className="text-xs font-semibold text-gray-800">{formatRupiah(10000000)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stok Menipis */}
        <div className="grid grid-cols-1 gap-3 mb-3">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-gray-800">Stok Menipis</h2>
                <p className="text-xs text-gray-500">Produk dengan stok menipis</p>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => router.push('/inventory')}
              >
                Lihat Semua Stok
                <FaArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Kategori</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Total Produk</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Stok Menipis</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Nilai Inventory</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {inventoryValueData.map((item) => (
                    <tr key={item.category} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-900">
                        <div className="flex items-center">
                          <div className="h-7 w-7 rounded-full flex items-center justify-center bg-orange-100 text-orange-700 mr-2">
                            <FaBoxes className="h-3 w-3" />
                          </div>
                          <span>{item.category}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">{item.itemCount} produk</td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        <Badge 
                          className={item.lowStock > 10 ? "bg-red-100 text-red-800 hover:bg-red-200 text-[10px] px-1.5 py-0" : "bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] px-1.5 py-0"}
                        >
                          {item.lowStock} produk
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right text-xs font-medium text-gray-900">{formatRupiah(item.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Footer Notice */}
        <div className="text-center text-xs text-gray-500 py-2">
          <p> 2025 FARMAX POS - Pharmacy Management System</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
