import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { formatRupiah } from '@/lib/utils';
import useOrderData from '@/hooks/use-order';
import useOpname from '@/hooks/use-opname';
import useInvoiceData from '@/hooks/use-invoice'; 
import useProductData from '@/hooks/use-product'; 
import useEmployeeData from '@/hooks/use-employee'; 
import useFinanceData from '@/hooks/use-finance'; 
import Slider from 'react-slick';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

import { 
  Button,
} from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { 
  Badge,
} from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Separator,
} from '@/components/ui/separator';

import { 
  FaUsers, 
  FaThList, 
  FaTags, 
  FaBoxes, 
  FaChartPie, 
  FaShoppingCart, 
  FaStoreAlt,
  FaFileInvoiceDollar,
  FaEye,
  FaLongArrowAltUp,
  FaLongArrowAltDown,
  FaEquals,
  FaThLarge,
  FaMoneyBillWave,
  FaChartLine,
  FaBoxOpen,
  FaExclamation,
  FaPrescriptionBottle,
  FaTruckLoading,
  FaFileInvoice,
  FaClock,
  FaCashRegister,
  FaTruck,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaSearch,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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
  subtitle: string
  icon: React.ReactNode
  change?: number
  changeText?: string
  changeType?: 'positive' | 'negative'
  iconClass?: string
  trend?: 'up' | 'down' | 'neutral'
}

interface ProductInfo {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface ExtendedProductInfo {
  createdAt: string;
  updatedAt: string;
  id: string;
  type: string;
  product_id: string;
  product_name: string;
  product_code: string;
  typical: string;
  price: string | number;
  qty: number;
  price_total: string;
  order_id: string;
}

interface OrderItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  sender_admin: string;
  receiver_admin: string | null;
  status: string;
  origin: string;
  destination: string;
  payment_method: string;
  product_info: ExtendedProductInfo[]; 
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  totalPrice?: number;
  tanggal?: string;
  customerId?: string;
  customerName?: string;
  cogsTotal?: number;
}

interface SalesDataItem {
  day: string;
  sales: number;
  cogs: number;
  profit: number;
}

interface SalesDataByPeriod {
  daily: SalesDataItem[];
  weekly: SalesDataItem[];
  monthly: SalesDataItem[];
}

interface FormattedOrderItem extends OrderItem {
  totalPrice: number;
  tanggal: string;
  customerId: string;
  customerName: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle,
  icon, 
  change, 
  changeText, 
  changeType = 'positive',
  iconClass = "bg-gradient-to-r from-red-500 to-orange-500",
  trend
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:border-orange-200 relative group">
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="p-5 flex items-start justify-between relative z-10">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
          
          {change && (
            <div className="mt-3 flex items-center">
              <span className={`flex items-center text-xs font-medium ${changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend === 'up' && <FaArrowUp className="h-2.5 w-2.5 mr-1" />}
                {trend === 'down' && <FaArrowDown className="h-2.5 w-2.5 mr-1" />}
                {change}% {changeText}
              </span>
            </div>
          )}
        </div>
        <div className={`${iconClass} text-white p-3 rounded-xl shadow-md relative group-hover:shadow-lg transition-all duration-300 after:content-[""] after:absolute after:inset-0 after:bg-white after:opacity-30 after:rounded-xl after:scale-0 group-hover:after:scale-100 after:transition-transform after:duration-300`}>
          {icon}
          <div className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500 animate-gradient-x"></div>
    </div>
  );
};

function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [mounted, setMounted] = useState(false);
  const [activeTimeFrame, setActiveTimeFrame] = useState<string>("weekly");
  
  // Data dummy untuk chart penjualan - definisikan dalam komponen
  const defaultWeeklySalesData: SalesDataItem[] = [
    { day: "Senin", sales: 5250000, cogs: 3675000, profit: 1575000 },
    { day: "Selasa", sales: 4800000, cogs: 3360000, profit: 1440000 },
    { day: "Rabu", sales: 6300000, cogs: 4410000, profit: 1890000 },
    { day: "Kamis", sales: 7500000, cogs: 5250000, profit: 2250000 },
    { day: "Jumat", sales: 8400000, cogs: 5880000, profit: 2520000 },
    { day: "Sabtu", sales: 9750000, cogs: 6825000, profit: 2925000 },
    { day: "Minggu", sales: 7800000, cogs: 5460000, profit: 2340000 }
  ];

  const defaultMonthlySalesData: SalesDataItem[] = [
    { day: "Jan", sales: 145000000, cogs: 101500000, profit: 43500000 },
    { day: "Feb", sales: 138000000, cogs: 96600000, profit: 41400000 },
    { day: "Mar", sales: 162000000, cogs: 113400000, profit: 48600000 },
    { day: "Apr", sales: 175000000, cogs: 122500000, profit: 52500000 },
    { day: "Mei", sales: 195000000, cogs: 136500000, profit: 58500000 },
    { day: "Jun", sales: 187000000, cogs: 130900000, profit: 56100000 },
    { day: "Jul", sales: 210000000, cogs: 147000000, profit: 63000000 },
    { day: "Ags", sales: 225000000, cogs: 157500000, profit: 67500000 },
    { day: "Sep", sales: 215000000, cogs: 150500000, profit: 64500000 },
    { day: "Okt", sales: 235000000, cogs: 164500000, profit: 70500000 },
    { day: "Nov", sales: 248000000, cogs: 173600000, profit: 74400000 },
    { day: "Des", sales: 275000000, cogs: 192500000, profit: 82500000 }
  ];

  const defaultQuarterlySalesData: SalesDataItem[] = [
    { day: "Q1 2024", sales: 445000000, cogs: 311500000, profit: 133500000 },
    { day: "Q2 2024", sales: 557000000, cogs: 389900000, profit: 167100000 },
    { day: "Q3 2024", sales: 650000000, cogs: 455000000, profit: 195000000 },
    { day: "Q4 2024", sales: 758000000, cogs: 530600000, profit: 227400000 }
  ];
  
  const [activeSalesData, setActiveSalesData] = useState(defaultWeeklySalesData);
  const { order, isLoading: isLoadingOrder } = useOrderData();
  const { opnames, isLoading: loadingOpname } = useOpname();
  const { invoices, isLoading: loadingInvoices } = useInvoiceData();
  const { products, lowStockProducts, isLoading: loadingProducts } = useProductData();
  const { employees, isLoading: loadingEmployees } = useEmployeeData();
  const { financialData, isLoading: loadingFinance } = useFinanceData();
  const [activeTab, setActiveTab] = useState("overview");

  // Konversi data yang sudah ada untuk format baru
  // Data pendapatan per cabang - Connected to financial data
  const branchRevenueData = financialData?.branchRevenue || [
    { name: "Cabang Menteng", revenue: 82500000, growth: 15, invoiceCount: 42, staffCount: 14 },
    { name: "Cabang Kemang", revenue: 76300000, growth: 8, invoiceCount: 38, staffCount: 12 },
    { name: "Cabang BSD", revenue: 65100000, growth: 12, invoiceCount: 31, staffCount: 11 },
    { name: "Cabang Kelapa Gading", revenue: 48700000, growth: -3, invoiceCount: 25, staffCount: 9 },
    { name: "Cabang Bekasi", revenue: 38200000, growth: 5, invoiceCount: 22, staffCount: 8 }
  ];

  // Data faktur yang perlu dibayar - Connected to invoice data
  const unpaidInvoicesData = [
    { 
      id: 'INV-24050001', 
      supplier: 'PT Kimia Farma', 
      amount: 45000000, 
      paidAmount: 25000000, 
      status: 'partial', 
      dueDate: '2025-04-10', 
      paymentPercentage: 55,
      items: 15
    },
    { 
      id: 'INV-24050012', 
      supplier: 'PT Phapros', 
      amount: 28500000, 
      paidAmount: 0, 
      status: 'unpaid', 
      dueDate: '2025-04-15',
      paymentPercentage: 0,
      items: 8
    },
    { 
      id: 'INV-24050023', 
      supplier: 'PT Darya-Varia', 
      amount: 18750000, 
      paidAmount: 10000000, 
      status: 'partial', 
      dueDate: '2025-04-12',
      paymentPercentage: 53,
      items: 12
    },
    { 
      id: 'INV-24050035', 
      supplier: 'PT Kalbe Farma', 
      amount: 36400000, 
      paidAmount: 0, 
      status: 'unpaid', 
      dueDate: '2025-04-20',
      paymentPercentage: 0,
      items: 24
    },
    { 
      id: 'INV-24050047', 
      supplier: 'PT Bio Farma', 
      amount: 15800000, 
      paidAmount: 5000000, 
      status: 'partial', 
      dueDate: '2025-04-08',
      paymentPercentage: 32,
      items: 9
    },
    { 
      id: 'INV-24050056', 
      supplier: 'PT Combiphar', 
      amount: 22500000, 
      paidAmount: 0, 
      status: 'unpaid', 
      dueDate: '2025-04-18',
      paymentPercentage: 0,
      items: 14
    },
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
      type: 'bar' as const,
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#f97316", "#fb923c", "#fbbf24"],
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
      bar: {
        borderRadius: 10,
        horizontal: true,
        distributed: true,
        columnWidth: '70%',
        barHeight: '90%',
        dataLabels: {
          position: 'top',
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val: any, opt: any) {
        const value = typeof val === 'number' ? val.toFixed(1) : '0.0';
        return `${value}% (${formatRupiah(opt.w.globals.series[opt.seriesIndex])})`
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        colors: ['#2c3e50']
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

  // Data dummy untuk pie chart posisi stok, hutang dan piutang
  const financialPositionData = {
    series: [68, 22, 10],
    labels: ['Nilai Stok', 'Piutang', 'Hutang'],
    colors: ["#f97316", "#fb923c", "#fbbf24"]
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
              formatter: function(val: number) {
                return formatRupiah(val * 1000000);
              }
            },
            total: {
              show: true,
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              label: 'Total',
              color: '#64748b',
              formatter: function(w: { globals: { seriesTotals: number[] } }) {
                return formatRupiah(w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0) * 1000000);
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
        formatter: function(val: number) {
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

  // Tambahkan setelah definisi weeklySalesData
  const inventoryTotalValue = 720000000; // Total nilai inventory (dummy data)

  // Data dummy untuk produk terlaris
  const topProducts = [
    { name: 'Paracetamol 500mg', category: 'Obat Bebas', revenue: 15000000, unitsSold: 2500 },
    { name: 'Vitamin C 1000mg', category: 'Vitamin', revenue: 12500000, unitsSold: 1800 },
    { name: 'Amoxicillin 500mg', category: 'Obat Resep', revenue: 10000000, unitsSold: 1200 },
    { name: 'Masker Medis', category: 'Alat Kesehatan', revenue: 8750000, unitsSold: 3500 },
    { name: 'Antasida', category: 'Obat Bebas', revenue: 7500000, unitsSold: 1000 },
    { name: 'Lotion Anti Nyamuk', category: 'Lainnya', revenue: 6250000, unitsSold: 850 },
  ];

  // Data dummy untuk transaksi penjualan POS dari masing-masing cabang
  const formattedOrders: FormattedOrderItem[] = order?.map(order => {
    // Safely calculate total price from product_info
    const totalPrice = order.product_info?.reduce((total, item) => {
      // Using optional chaining and type guards
      const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
      const itemQty = item.qty || 0; // Using qty instead of quantity
      return total + (itemPrice * itemQty);
    }, 0) || 0;
    
    // Create timestamp for formatting
    const tanggal = new Date(order.createdAt).toLocaleDateString('id-ID');
    
    // Return type-safe object with all required properties
    return {
      ...order,
      totalPrice,
      tanggal,
      customerId: order.code.split('-')[0] || 'CUST',
      customerName: `Customer ${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }) || [];

  // Helper function to format date
  const formatDate = ({ date }: { date: Date }) => {
    return format(date, "dd MMM yyyy, HH:mm");
  };

  useEffect(() => {
    setIsLoadingChart(true);
    let chartData = [...activeSalesData]; // Clone array yang sudah ada
    
    // Pilih data sesuai periode yang dipilih
    if (selectedPeriod === 'week') {
      chartData = defaultWeeklySalesData;
    } else if (selectedPeriod === 'month') {
      chartData = defaultMonthlySalesData;
    } else {
      chartData = defaultQuarterlySalesData;
    }
    
    setActiveSalesData(chartData);
    setIsLoadingChart(false);
  }, [selectedPeriod]);

  useEffect(() => {
    setMounted(true);
    // Set default chart data (weekly)
    setActiveSalesData(defaultWeeklySalesData);
    setIsLoadingChart(false);
  }, []);

  const calculateTotalUnpaid = (invoices: typeof unpaidInvoicesData) => {
    return invoices.reduce((total, invoice) => total + (invoice.amount - invoice.paidAmount), 0);
  };

  const calculateTotalAmount = (invoices: typeof unpaidInvoicesData) => {
    return invoices.reduce((total, invoice) => total + invoice.amount, 0);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBadgeColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return "bg-red-50 text-red-700 border-red-200";
    if (daysUntilDue <= 3) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getDueDateText = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return `Terlambat ${Math.abs(daysUntilDue)} hari`;
    if (daysUntilDue === 0) return "Jatuh tempo hari ini";
    return `${daysUntilDue} hari lagi`;
  };

  // Data produk inventory dengan nilai dummy
  const inventoryItemsData = [
    { 
      id: "PRD001", 
      name: "Paracetamol 500mg", 
      category: "Obat Bebas", 
      stock: 1250, 
      minStock: 100, 
      price: 15000, 
      totalValue: 18750000,
      percentageOfTotal: 19.2
    },
    { 
      id: "PRD002", 
      name: "Amoxicillin 500mg", 
      category: "Obat Keras", 
      stock: 850, 
      minStock: 75, 
      price: 25000, 
      totalValue: 21250000,
      percentageOfTotal: 21.8
    },
    { 
      id: "PRD003", 
      name: "Vitacimin Tablet", 
      category: "Vitamin & Suplemen", 
      stock: 1800, 
      minStock: 120, 
      price: 5000, 
      totalValue: 9000000,
      percentageOfTotal: 9.2
    },
    { 
      id: "PRD004", 
      name: "Enervon-C Tablet", 
      category: "Vitamin & Suplemen", 
      stock: 1350, 
      minStock: 100, 
      price: 8000, 
      totalValue: 10800000,
      percentageOfTotal: 11.1
    },
    { 
      id: "PRD005", 
      name: "Antasida Doen Sirup", 
      category: "Obat Bebas", 
      stock: 680, 
      minStock: 50, 
      price: 18000, 
      totalValue: 12240000,
      percentageOfTotal: 12.5
    },
    { 
      id: "PRD006", 
      name: "Cefixime 100mg", 
      category: "Obat Keras", 
      stock: 450, 
      minStock: 40, 
      price: 35000, 
      totalValue: 15750000,
      percentageOfTotal: 16.1
    },
    { 
      id: "PRD007", 
      name: "Alkohol 70% 100ml", 
      category: "Alat Kesehatan", 
      stock: 950, 
      minStock: 80, 
      price: 10000, 
      totalValue: 9500000,
      percentageOfTotal: 9.7
    }
  ];

  // Hitung total nilai inventory
  const totalInventoryValue = inventoryItemsData.reduce((sum, item) => sum + item.totalValue, 0);

  // Fix TypeScript errors for data formatting
  const getFormattedWeeklyData = () => {
    const data: Record<string, { day: string, penjualan: number, pembelian: number, retur: number }> = {};
    
    // Fetch data for different transaction types
    order?.forEach(transaction => {
      // Safe access to properties using optional chaining
      const price = transaction.product_info?.reduce((total, item) => {
        // Using optional chaining and type guards
        const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
        const itemQty = item.qty || 0; // Using qty instead of quantity
        return total + (itemPrice * itemQty);
      }, 0) || 0;
      
      const date = new Date(transaction.createdAt).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      if (!data[date]) {
        data[date] = { day: date, penjualan: 0, pembelian: 0, retur: 0 };
      }
      
      // Increment the appropriate transaction type
      if (transaction.status === 'completed') {
        data[date].penjualan += price;
      } else if (transaction.status === 'pending') {
        data[date].pembelian += price;
      } else if (transaction.status === 'returned') {
        data[date].retur += price;
      }
    });
    
    return Object.values(data);
  };

  // Replace weeklySalesData with function call
  const weeklySalesData = getFormattedWeeklyData();

  // Custom arrow components for the carousel
  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -ml-5 bg-white rounded-full p-2 shadow-md text-red-500 hover:text-orange-500 transition-all duration-300 hover:shadow-lg focus:outline-none"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
    );
  };

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 -mr-5 bg-white rounded-full p-2 shadow-md text-red-500 hover:text-orange-500 transition-all duration-300 hover:shadow-lg focus:outline-none"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Upgraded Header Card with pharmaceutical ornaments */}
      <div className="mx-2 mb-8 relative">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl shadow-lg overflow-hidden relative">
          {/* Decorative pill/capsule patterns */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-orange-300/30 blur-xl"></div>
          <div className="absolute bottom-0 left-1/4 w-16 h-16 rounded-full bg-red-400/20 blur-lg"></div>
          
          {/* Capsule ornaments */}
          <div className="absolute top-6 right-8 opacity-30">
            <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Capsule 1 */}
              <rect x="0" y="10" width="36" height="16" rx="8" fill="white" />
              <rect x="18" y="10" width="18" height="16" rx="8" fill="#fef3c7" />
              <line x1="18" y1="10" x2="18" y2="26" stroke="#f59e0b" strokeWidth="0.5" />
              
              {/* Capsule 2 */}
              <rect x="42" y="5" width="28" height="14" rx="7" fill="white" />
              <rect x="56" y="5" width="14" height="14" rx="7" fill="#fef3c7" />
              <line x1="56" y1="5" x2="56" y2="19" stroke="#f59e0b" strokeWidth="0.5" />
              
              {/* Small pill */}
              <circle cx="85" cy="12" r="6" fill="white" />
            </svg>
          </div>
          
          <div className="px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
            <div className="flex items-center">
              {/* Pharmacy store icon with animated effect */}
              <div className="relative mr-4">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse-slow"></div>
                <div className="bg-white/90 rounded-lg p-1.5 shadow-md relative">
                  <svg className="w-14 h-14" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Decorative background blob */}
                    <path 
                      d="M5,30 C5,15 15,10 25,12 C35,5 45,10 50,20 C55,30 50,45 40,50 C30,55 15,50 10,40 C5,35 5,40 5,30 Z" 
                      fill="#f97316" 
                      opacity="0.3" 
                    />
                    
                    {/* Pharmacy store building */}
                    <rect x="13" y="25" width="34" height="20" rx="2" fill="#2563eb" />
                    
                    {/* Roof/Banner */}
                    <rect x="10" y="21" width="40" height="6" rx="1" fill="#16a34a" />
                    
                    {/* Awning/Canopy */}
                    <path d="M10 27L16 33H22L28 33H34L40 33L46 27H10Z" fill="#0369a1" />
                    
                    {/* Store windows/doors */}
                    <rect x="17" y="30" width="8" height="12" rx="1" fill="#e0f2fe" />
                    <rect x="27" y="30" width="6" height="12" rx="1" fill="#e0f2fe" />
                    <rect x="35" y="30" width="8" height="12" rx="1" fill="#e0f2fe" />
                    
                    {/* Window details */}
                    <rect x="18" y="32" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    <rect x="22" y="32" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    <rect x="18" y="37" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    <rect x="22" y="37" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    <rect x="36" y="32" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    <rect x="40" y="32" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    <rect x="36" y="37" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    <rect x="40" y="37" width="2" height="3" fill="#0369a1" opacity="0.5" />
                    
                    {/* Cross sign */}
                    <circle cx="30" cy="17" r="6" fill="#0369a1" />
                    <rect x="28" y="13" width="4" height="8" rx="1" fill="white" />
                    <rect x="26" y="15" width="8" height="4" rx="1" fill="white" />
                    
                    {/* Pharmacy text banner */}
                    <rect x="20" y="23" width="20" height="4" rx="1" fill="#14b8a6" />
                    
                    {/* Ground/Base */}
                    <rect x="10" y="45" width="40" height="2" rx="1" fill="#475569" />
                  </svg>
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center tracking-tight">
                  Apt. Siaga Farma
                  <span className="ml-2 text-xs font-mono bg-white/20 text-white px-2 py-0.5 rounded-md">Premium</span>
                </h1>
                <div className="flex items-center mt-1">
                  <div className="bg-white/20 rounded-md px-2 py-0.5 text-white text-xs mr-2">v2.5</div>
                  <p className="text-white/90 text-sm">Jl. Soekarno hatta no 17 Jakarta timur</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 items-center">
              {/* Action buttons */}
              <Button className="bg-white text-red-600 hover:bg-white/90 hover:shadow-lg transition-all duration-300">
                <svg className="h-5 w-5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 6V12M12 12V18M12 12H18M12 12H6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Buat Order Baru
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated heartbeat effect for the card */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-500/20 rounded-xl blur-xl -z-10 animate-pulse-slow"></div>
      </div>
      
      {/* Dashboard stats section - positioned right after decorative header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 mb-6">
        <StatCard 
          title="Total Penjualan"
          value={formatRupiah(totalSales)}
          subtitle="Bulan ini"
          icon={<FaCashRegister className="w-6 h-6" />}
          change={3.2}
          changeText="vs bulan lalu"
          changeType="positive"
          trend="up"
        />
        <StatCard 
          title="Stok Menipis"
          value={lowStockCount}
          subtitle="Produk perlu pemesanan"
          icon={<FaBoxOpen className="w-6 h-6" />}
          change={4}
          changeText="dari minggu lalu"
          changeType="negative"
          trend="up"
          iconClass="bg-gradient-to-r from-amber-500 to-orange-500"
        />
        <StatCard 
          title="Transaksi Hari Ini"
          value={todayTransactions}
          subtitle="Per tanggal hari ini"
          icon={<FaFileInvoice className="w-6 h-6" />}
          change={1.8}
          changeText="vs kemarin"
          changeType="positive"
          trend="up"
          iconClass="bg-gradient-to-r from-blue-500 to-indigo-500"
        />
        <StatCard 
          title="Pelanggan Aktif"
          value={activeCustomers}
          subtitle="Total pelanggan aktif"
          icon={<FaUsers className="w-6 h-6" />}
          change={2.4}
          changeText="vs bulan lalu"
          changeType="positive"
          trend="up"
          iconClass="bg-gradient-to-r from-emerald-500 to-green-500"
        />
      </div>
      
      {/* Menu Carousel Section */}
      <div className="p-6 relative overflow-hidden bg-gradient-to-br from-white to-gray-50/70">
        {/* Menu Carousel */}
        <div className="relative z-10 px-8 mb-12">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
            <span className="mr-1">⟳</span> Swipe untuk melihat menu lainnya
          </div>
          
          {/* Decorative pharmacy elements for carousel */}
          <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-20 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 100" fill="none" stroke="url(#pill-gradient-left)" strokeWidth="1">
              <defs>
                <linearGradient id="pill-gradient-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
              </defs>
              <rect x="5" y="30" width="14" height="40" rx="7" ry="7" />
            </svg>
          </div>
          
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-20 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 100" fill="none" stroke="url(#pill-gradient-right)" strokeWidth="1">
              <defs>
                <linearGradient id="pill-gradient-right" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <rect x="5" y="30" width="14" height="40" rx="7" ry="7" />
            </svg>
          </div>
          
          <Slider
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={4}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={5000}
            pauseOnHover={true}
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
            className="pharmacy-carousel"
            centerMode={true}
            centerPadding="0px"
            responsive={[
              {
                breakpoint: 1280,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                }
              },
              {
                breakpoint: 640,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }
              }
            ]}
          >
            {/* Kasir Card */}
            <div className="px-2">
              <Link href="/pos">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar with pill pattern */}
                  <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500 relative">
                    <div className="absolute top-1.5 left-0 w-full flex justify-around">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                    </div>
                  </div>
                  
                  {/* Circuit patterns */}
                  <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                    <div className="absolute top-3/4 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                    <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
                    <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent"></div>
                    
                    {/* Circuit nodes */}
                    <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-red-500 opacity-70"></div>
                    <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 rounded-full bg-orange-500 opacity-70"></div>
                    
                    {/* Digital dotted grid pattern */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4">
                      {Array(48).fill(0).map((_, i) => (
                        <div key={i} className="w-0.5 h-0.5 rounded-full bg-red-500 opacity-20"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pharmacy corner ornament - top right */}
                  <div className="absolute top-0 right-0">
                    <svg className="w-8 h-8 text-red-500/10" viewBox="0 0 100 100" fill="currentColor">
                      <path 
                        d="M0,0 L100,0 L100,100 Q50,20 0,0 Z" 
                        fill="#f97316" 
                        opacity="0.9" 
                      />
                    </svg>
                  </div>
                  
                  {/* Data flow indicator */}
                  <div className="absolute bottom-5 -left-20 w-20 h-4 opacity-30 bg-gradient-to-r from-transparent via-orange-500 to-red-500"></div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-3 right-3 flex space-x-0.5">
                    <div className="w-5 h-2.5 rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
                    <div className="w-3 h-2.5 rounded-full border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      {/* Rings around icon */}
                      <div className="absolute inset-0 rounded-full border border-dashed border-red-500/30 scale-125"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-500/20 scale-150"></div>
                      <div className="absolute inset-0 rounded-full border border-dotted border-red-500/10 scale-[1.75]"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-[6px] opacity-70 scale-110 group-hover:scale-125 group-hover:opacity-80 transition-all duration-300"></div>
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-full shadow-md relative">
                        {/* Medic Symbol Circle - 2D Vector Style */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="white" fillOpacity="0.15" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.5523 7 13 7.44772 13 8V11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H13V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V13H8C7.44772 13 7 12.5523 7 12C7 11.4477 7.44772 11 8 11H11V8C11 7.44772 11.4477 7 12 7Z" fill="white" />
                        </svg>
                      </div>
                      
                      {/* Subtle ring */}
                      <div className="absolute inset-0 rounded-full border border-red-500/20 scale-125 group-hover:scale-150 group-hover:border-orange-500/30 transition-all duration-700"></div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-red-600 transition-colors duration-300">Kasir</h3>
                    <p className="text-xs text-gray-500">Proses transaksi penjualan</p>
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2">
                    <svg className="w-4 h-4 text-red-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  
                  {/* Bottom accent with pill pattern */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-red-500/20 group-hover:to-orange-500/20 transition-all duration-300">
                    <div className="absolute bottom-1 left-0 w-full flex justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-1 h-1 rounded-full bg-red-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-orange-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-red-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-orange-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-red-500/30"></div>
                    </div>
                  </div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-0.5 h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-red-500/20 group-hover:to-orange-500/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Inventory Card */}
            <div className="px-2">
              <Link href="/inventory">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar with pill pattern */}
                  <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500 relative">
                    <div className="absolute top-1.5 left-0 w-full flex justify-around">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                    </div>
                  </div>
                  
                  {/* Circuit patterns */}
                  <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
                    <div className="absolute top-2/3 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                    <div className="absolute top-0 left-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent"></div>
                    <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-red-500 to-transparent"></div>
                    
                    {/* Circuit nodes */}
                    <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-orange-500 opacity-70"></div>
                    <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 rounded-full bg-red-500 opacity-70"></div>
                    
                    {/* Digital hex pattern */}
                    <div className="absolute top-2 left-2 opacity-20">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <path d="M10 15L20 10L30 15L40 10L50 15V30V45L40 50L30 45L20 50L10 45V30V15Z" stroke="#f97316" strokeWidth="0.5" strokeDasharray="3 2" />
                        <path d="M30 25V45" stroke="#f97316" strokeWidth="0.5" strokeDasharray="3 2" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Pharmacy corner ornament - top right */}
                  <div className="absolute top-0 right-0">
                    <svg className="w-8 h-8 text-orange-500/10" viewBox="0 0 100 100" fill="currentColor">
                      <path 
                        d="M0,0 L100,0 L100,100 Q50,20 0,0 Z" 
                        fill="#f97316" 
                        opacity="0.9" 
                      />
                    </svg>
                  </div>
                  
                  {/* Data flow indicator */}
                  <div className="absolute top-5 -right-20 w-20 h-4 opacity-30 bg-gradient-to-l from-red-500 to-orange-500"></div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-3 right-3 flex space-x-0.5">
                    <div className="w-5 h-2.5 rounded-full border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
                    <div className="w-3 h-2.5 rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      {/* Rings around icon */}
                      <div className="absolute inset-0 rounded-full border border-dashed border-orange-500/30 scale-125"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/20 scale-150"></div>
                      <div className="absolute inset-0 rounded-full border border-dotted border-orange-500/10 scale-[1.75]"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-[6px] opacity-70 scale-110 group-hover:scale-125 group-hover:opacity-80 transition-all duration-300"></div>
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full shadow-md relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="8" width="16" height="12" rx="2" stroke="white" strokeWidth="1.5" />
                          <path d="M8 8V6C8 4.89543 8.89543 4 10 4H14C15.1046 4 16 4.89543 16 6V8" stroke="white" strokeWidth="1.5" />
                          <path d="M12 12V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9 14H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      
                      {/* Subtle ring */}
                      <div className="absolute inset-0 rounded-full border border-orange-500/20 scale-125 group-hover:scale-150 group-hover:border-red-500/30 transition-all duration-700"></div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-orange-600 transition-colors duration-300">Inventori</h3>
                    <p className="text-xs text-gray-500">Kelola stok produk</p>
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2">
                    <svg className="w-4 h-4 text-orange-500/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                  
                  {/* Bottom accent with pill pattern */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300">
                    <div className="absolute bottom-1 left-0 w-full flex justify-around opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-1 h-1 rounded-full bg-orange-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-red-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-orange-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-red-500/30"></div>
                      <div className="w-1 h-1 rounded-full bg-orange-500/30"></div>
                    </div>
                  </div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-0.5 h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Finance Card */}
            <div className="px-2">
              <Link href="/finance">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-red-600 to-orange-600"></div>
                  
                  {/* Circuit patterns */}
                  <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-full h-0.5 bg-gradient-to-l from-transparent via-red-600 to-transparent"></div>
                    <div className="absolute bottom-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-600 to-transparent"></div>
                    
                    {/* Digital number pattern */}
                    <div className="absolute bottom-1 right-2 opacity-20 font-mono text-[8px] text-red-600/60">
                      01010111<br/>10101010<br/>01110010
                    </div>
                  </div>
                  
                  {/* Futuristic graph decoration */}
                  <div className="absolute bottom-2 left-1 w-12 h-8 opacity-20">
                    <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="0,25 5,20 10,22 15,15 20,18 25,10 30,15 35,5 40,8" stroke="#f97316" strokeWidth="1" strokeDasharray="1 1" />
                      <line x1="0" y1="25" x2="40" y2="25" stroke="#f97316" strokeWidth="0.5" />
                    </svg>
                  </div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-2 right-2 w-6 h-3 rounded-full border border-red-600/10"></div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      {/* Rings around icon */}
                      <div className="absolute inset-0 rounded-full border border-dashed border-red-600/30 scale-125"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-orange-600/20 scale-150"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-full blur-sm opacity-70 scale-110"></div>
                      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 rounded-full shadow-md relative">
                        {/* Pill - 2D Vector Style */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5 6.5L6.5 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9.5 19.5C6.18629 19.5 3.5 16.8137 3.5 13.5C3.5 10.1863 6.18629 7.5 9.5 7.5L14.5 7.5C17.8137 7.5 20.5 10.1863 20.5 13.5C20.5 16.8137 17.8137 19.5 14.5 19.5L9.5 19.5Z" stroke="white" strokeWidth="1.5" />
                          <path d="M19.5 9.5C19.5 12.8137 16.8137 15.5 13.5 15.5L8.5 15.5C5.18629 15.5 2.5 12.8137 2.5 9.5C2.5 6.18629 5.18629 3.5 8.5 3.5L13.5 3.5C16.8137 3.5 19.5 6.18629 19.5 9.5Z" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-red-600 transition-colors duration-300">Keuangan</h3>
                    <p className="text-xs text-gray-500">Laporan laba rugi</p>
                  </div>
                  
                  {/* Digital counter */}
                  <div className="absolute top-4 left-4 text-[8px] font-mono text-red-600/40">
                    0123456789
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2 text-red-600/20 text-xs font-bold">+</div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-red-600/20 group-hover:to-orange-600/20 transition-all duration-300"></div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-px h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-red-600/20 group-hover:via-orange-600/20 group-hover:to-red-600/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Products Card */}
            <div className="px-2">
              <Link href="/products">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-red-500 to-orange-600"></div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-2 right-2 w-6 h-3 rounded-full border border-red-500/10"></div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-full blur-sm opacity-70 scale-110"></div>
                      <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-3 rounded-full shadow-md relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.5 19.5C6.18629 19.5 3.5 16.8137 3.5 13.5C3.5 10.1863 6.18629 7.5 9.5 7.5L14.5 7.5C17.8137 7.5 20.5 10.1863 20.5 13.5C20.5 16.8137 17.8137 19.5 14.5 19.5L9.5 19.5Z" stroke="white" strokeWidth="1.5" />
                          <path d="M19.5 9.5C19.5 12.8137 16.8137 15.5 13.5 15.5L8.5 15.5C5.18629 15.5 2.5 12.8137 2.5 9.5C2.5 6.18629 5.18629 3.5 8.5 3.5L13.5 3.5C16.8137 3.5 19.5 6.18629 19.5 9.5Z" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-red-600 transition-colors duration-300">Produk</h3>
                    <p className="text-xs text-gray-500">Kelola katalog produk</p>
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2 text-red-500/20 text-xs font-bold">+</div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-red-500/20 group-hover:to-orange-600/20 transition-all duration-300"></div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-px h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-red-500/20 group-hover:via-orange-600/20 group-hover:to-red-500/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Purchasing Card */}
            <div className="px-2">
              <Link href="/purchasing">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-orange-600 to-red-500"></div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-2 right-2 w-6 h-3 rounded-full border border-orange-600/10"></div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-500 rounded-full blur-sm opacity-70 scale-110"></div>
                      <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white p-3 rounded-full shadow-md relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5 6.5L6.5 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9.5 19.5C6.18629 19.5 3.5 16.8137 3.5 13.5C3.5 10.1863 6.18629 7.5 9.5 7.5L14.5 7.5C17.8137 7.5 20.5 10.1863 20.5 13.5C20.5 16.8137 17.8137 19.5 14.5 19.5L9.5 19.5Z" stroke="white" strokeWidth="1.5" />
                          <path d="M19.5 9.5C19.5 12.8137 16.8137 15.5 13.5 15.5L8.5 15.5C5.18629 15.5 2.5 12.8137 2.5 9.5C2.5 6.18629 5.18629 3.5 8.5 3.5L13.5 3.5C16.8137 3.5 19.5 6.18629 19.5 9.5Z" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-orange-600 transition-colors duration-300">Pembelian</h3>
                    <p className="text-xs text-gray-500">Kelola pembelian dan penerimaan</p>
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2 text-orange-600/20 text-xs font-bold">+</div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-orange-600/20 group-hover:to-red-500/20 transition-all duration-300"></div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-px h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-orange-600/20 group-hover:via-red-500/20 group-hover:to-orange-600/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Reports Card */}
            <div className="px-2">
              <Link href="/reports">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-2 right-2 w-6 h-3 rounded-full border border-red-500/10"></div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-sm opacity-70 scale-110"></div>
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-full shadow-md relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5 6.5L6.5 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9.5 19.5C6.18629 19.5 3.5 16.8137 3.5 13.5C3.5 10.1863 6.18629 7.5 9.5 7.5L14.5 7.5C17.8137 7.5 20.5 10.1863 20.5 13.5C20.5 16.8137 17.8137 19.5 14.5 19.5L9.5 19.5Z" stroke="white" strokeWidth="1.5" />
                          <path d="M19.5 9.5C19.5 12.8137 16.8137 15.5 13.5 15.5L8.5 15.5C5.18629 15.5 2.5 12.8137 2.5 9.5C2.5 6.18629 5.18629 3.5 8.5 3.5L13.5 3.5C16.8137 3.5 19.5 6.18629 19.5 9.5Z" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-red-600 transition-colors duration-300">Laporan</h3>
                    <p className="text-xs text-gray-500">Lihat laporan dan analisis bisnis</p>
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2 text-red-500/20 text-xs font-bold">+</div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-red-500/20 group-hover:to-orange-500/20 transition-all duration-300"></div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-px h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-red-500/20 group-hover:via-orange-500/20 group-hover:to-red-500/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Supplier Card */}
            <div className="px-2">
              <Link href="/suppliers">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-orange-600 to-red-600"></div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-2 right-2 w-6 h-3 rounded-full border border-orange-600/10"></div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full blur-sm opacity-70 scale-110"></div>
                      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 rounded-full shadow-md relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5 6.5L6.5 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9.5 19.5C6.18629 19.5 3.5 16.8137 3.5 13.5C3.5 10.1863 6.18629 7.5 9.5 7.5L14.5 7.5C17.8137 7.5 20.5 10.1863 20.5 13.5C20.5 16.8137 17.8137 19.5 14.5 19.5L9.5 19.5Z" stroke="white" strokeWidth="1.5" />
                          <path d="M19.5 9.5C19.5 12.8137 16.8137 15.5 13.5 15.5L8.5 15.5C5.18629 15.5 2.5 12.8137 2.5 9.5C2.5 6.18629 5.18629 3.5 8.5 3.5L13.5 3.5C16.8137 3.5 19.5 6.18629 19.5 9.5Z" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-orange-600 transition-colors duration-300">Supplier</h3>
                    <p className="text-xs text-gray-500">Kelola data supplier</p>
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2 text-orange-600/20 text-xs font-bold">+</div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-orange-600/20 group-hover:to-red-600/20 transition-all duration-300"></div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-px h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-orange-600/20 group-hover:via-red-600/20 group-hover:to-orange-600/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Customers Card */}
            <div className="px-2">
              <Link href="/customers">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative flex flex-col">
                  {/* Top gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-red-500 to-orange-600"></div>
                  
                  {/* Pharmacy pill pattern - top right */}
                  <div className="absolute top-2 right-2 w-6 h-3 rounded-full border border-red-500/10"></div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col items-center justify-center text-center h-full">
                    {/* Icon container */}
                    <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-full blur-sm opacity-70 scale-110"></div>
                      <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-3 rounded-full shadow-md relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.5 6.5L6.5 17.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9.5 19.5C6.18629 19.5 3.5 16.8137 3.5 13.5C3.5 10.1863 6.18629 7.5 9.5 7.5L14.5 7.5C17.8137 7.5 20.5 10.1863 20.5 13.5C20.5 16.8137 17.8137 19.5 14.5 19.5L9.5 19.5Z" stroke="white" strokeWidth="1.5" />
                          <path d="M19.5 9.5C19.5 12.8137 16.8137 15.5 13.5 15.5L8.5 15.5C5.18629 15.5 2.5 12.8137 2.5 9.5C2.5 6.18629 5.18629 3.5 8.5 3.5L13.5 3.5C16.8137 3.5 19.5 6.18629 19.5 9.5Z" stroke="white" strokeWidth="1.5" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-red-600 transition-colors duration-300">Pelanggan</h3>
                    <p className="text-xs text-gray-500">Kelola data pelanggan</p>
                  </div>
                  
                  {/* Pharmacy cross accent - bottom left */}
                  <div className="absolute bottom-2 left-2 text-red-500/20 text-xs font-bold">+</div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-red-500/20 group-hover:to-orange-600/20 transition-all duration-300"></div>
                  
                  {/* Right accent line */}
                  <div className="absolute top-0 right-0 w-px h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-red-500/20 group-hover:via-orange-600/20 group-hover:to-red-500/20 transition-all duration-300"></div>
                </div>
              </Link>
            </div>
          </Slider>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="bg-white border border-gray-100 p-1 rounded-lg shadow-sm">
          <TabsTrigger 
            value="overview"
            className="rounded-md text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <FaThLarge className="h-3.5 w-3.5 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger 
            value="sales"
            className="rounded-md text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <FaMoneyBillWave className="h-3.5 w-3.5 mr-2" /> Transaksi Terakhir
          </TabsTrigger>
          <TabsTrigger 
            value="inventory"
            className="rounded-md text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <FaBoxes className="h-3.5 w-3.5 mr-2" /> Status Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="finance"
            className="rounded-md text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <FaChartLine className="h-3.5 w-3.5 mr-2" /> Faktur Belum Dibayar
          </TabsTrigger>
        </TabsList>

        {/* Main Content based on selected tab */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          {/* Two Column Layout: Revenue Chart and Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="h-full">
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all h-full overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardHeader className="pb-0 pt-4 px-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">Grafik Penjualan</CardTitle>
                      <CardDescription>Data penjualan dalam periode terpilih</CardDescription>
                    </div>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="h-8 w-[130px] border-gray-200 focus:ring-orange-200 bg-white text-xs">
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Minggu Ini</SelectItem>
                        <SelectItem value="month">Bulan Ini</SelectItem>
                        <SelectItem value="quarter">Kuartal Ini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-3">
                  <div className="h-[350px]">
                    {mounted && !isLoadingChart ? (
                      <ClientOnlyRecharts height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={activeSalesData}
                            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                          >
                            <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorCogs" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1}/>
                              </linearGradient>
                              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                            <XAxis 
                              dataKey="day" 
                              tick={{ 
                                fontSize: 12, 
                                fontFamily: 'Inter, sans-serif',
                                fill: '#666'
                              }}
                            />
                            <YAxis 
                              tickFormatter={(value) => `${(value/1000000).toFixed(1)}jt`}
                              tick={{ 
                                fontSize: 12, 
                                fontFamily: 'Inter, sans-serif',
                                fill: '#666'
                              }}
                            />
                            <Tooltip 
                              formatter={(value: number) => formatRupiah(value)}
                              contentStyle={{
                                fontSize: '12px',
                                fontFamily: 'Inter, sans-serif',
                                borderRadius: '4px'
                              }}
                            />
                            <Legend 
                              wrapperStyle={{
                                fontSize: '12px',
                                fontFamily: 'Inter, sans-serif'
                              }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="sales" 
                              name="Total Penjualan"
                              stroke="#f97316" 
                              fillOpacity={1} 
                              fill="url(#colorSales)" 
                              activeDot={{ r: 6 }}
                              strokeWidth={2}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="cogs" 
                              name="HPP"
                              stroke="#fb923c" 
                              fillOpacity={1} 
                              fill="url(#colorCogs)" 
                              activeDot={{ r: 6 }}
                              strokeWidth={2}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="profit" 
                              name="Profit"
                              stroke="#fbbf24" 
                              fillOpacity={1} 
                              fill="url(#colorProfit)" 
                              activeDot={{ r: 6 }}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ClientOnlyRecharts>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="h-10 w-10 rounded-full border-3 border-t-transparent border-orange-500 animate-spin"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <div className="h-full">
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all h-full overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardHeader className="pb-0 pt-4 px-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">Produk Terlaris</CardTitle>
                      <CardDescription>Top 5 produk dengan penjualan tertinggi periode ini</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                      <FaEye className="h-3.5 w-3.5 mr-1" /> Lihat Semua
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[300px] overflow-auto">
                  <div className="pt-2 px-5 pb-4">
                    <div className="space-y-3">
                      {topProducts.slice(0, 5).map((product, idx) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center mr-3 border border-orange-100">
                                <span className="text-xs font-medium text-orange-700">#{idx+1}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.unitsSold} unit terjual</div>
                              </div>
                            </div>
                            <div>
                              <Badge className="bg-orange-50 text-orange-700 border-orange-100">
                                {formatRupiah(product.revenue)}
                              </Badge>
                            </div>
                          </div>
                          <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                              style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Two Column Layout: Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
            {/* Top Products */}
            <div className="h-full">
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all h-full overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardHeader className="pb-0 pt-4 px-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">Produk Terlaris</CardTitle>
                      <CardDescription>Top 5 produk dengan penjualan tertinggi periode ini</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                      <FaEye className="h-3.5 w-3.5 mr-1" /> Lihat Semua
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[300px] overflow-auto">
                  <div className="pt-2 px-5 pb-4">
                    <div className="space-y-3">
                      {topProducts.slice(0, 5).map((product, idx) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center mr-3 border border-orange-100">
                                <span className="text-xs font-medium text-orange-700">#{idx+1}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.unitsSold} unit terjual</div>
                              </div>
                            </div>
                            <div>
                              <Badge className="bg-orange-50 text-orange-700 border-orange-100">
                                {formatRupiah(product.revenue)}
                              </Badge>
                            </div>
                          </div>
                          <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                              style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </TabsContent>

        {/* Content for other tabs will be implemented similarly */}
        <TabsContent value="sales" className="mt-4">
          {/* Implementasi untuk tab penjualan - menggunakan komponen yang sama, hanya layout berbeda dan lebih berfokus pada data penjualan */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">Konten tab Penjualan akan ditampilkan di sini</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-4 space-y-6">
          {/* Filter section for inventory tab */}
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="time-period" className="block text-sm font-medium text-gray-700 mb-1">Periode Waktu</label>
                <div className="flex gap-2">
                  <Select defaultValue="thisMonth">
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="yesterday">Kemarin</SelectItem>
                      <SelectItem value="thisWeek">Minggu Ini</SelectItem>
                      <SelectItem value="lastWeek">Minggu Lalu</SelectItem>
                      <SelectItem value="thisMonth">Bulan Ini</SelectItem>
                      <SelectItem value="lastMonth">Bulan Lalu</SelectItem>
                      <SelectItem value="custom">Kustom...</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className="hidden" id="date-picker-button">
                        <FaCalendarAlt className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {/* Calendar would go here */}
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex-1">
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">Cabang Apotek</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Pilih cabang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Apotek</SelectItem>
                    <SelectItem value="central">Apotek Pusat</SelectItem>
                    <SelectItem value="branch1">Cabang Thamrin</SelectItem>
                    <SelectItem value="branch2">Cabang Sudirman</SelectItem>
                    <SelectItem value="branch3">Cabang Kuningan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600">
                  <FaSearch className="h-3.5 w-3.5 mr-2" /> Filter
                </Button>
              </div>
            </div>
          </div>
          
          {/* Grid layout for all inventory status sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* BEST SELLING PRODUCTS SECTION */}
            <Link href="/inventory/best-selling" className="block cursor-pointer transition-all hover:scale-[1.01]">
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardHeader className="pb-0 pt-4 px-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">Produk Terlaris</CardTitle>
                      <CardDescription>Top 5 produk dengan penjualan tertinggi</CardDescription>
                    </div>
                    <div className="rounded-full bg-orange-100 p-2">
                      <FaBoxOpen className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[300px] overflow-auto">
                  <div className="pt-2 px-5 pb-4">
                    <div className="space-y-3">
                      {topProducts.slice(0, 5).map((product, idx) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center mr-3 border border-orange-100">
                                <span className="text-xs font-medium text-orange-700">#{idx+1}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.unitsSold} unit terjual</div>
                              </div>
                            </div>
                            <div>
                              <Badge className="bg-orange-50 text-orange-700 border-orange-100">
                                {formatRupiah(product.revenue)}
                              </Badge>
                            </div>
                          </div>
                          <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                              style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* LOW STOCK PRODUCTS SECTION */}
            <Link href="/inventory/products?tab=low-stock" className="block cursor-pointer transition-all hover:scale-[1.01]">
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardHeader className="pb-0 pt-4 px-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">Stok Akan Habis</CardTitle>
                      <CardDescription>Produk dengan stok rendah yang perlu diisi ulang</CardDescription>
                    </div>
                    <div className="rounded-full bg-red-100 p-2">
                      <FaExclamation className="h-4 w-4 text-red-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[300px] overflow-auto">
                  <div className="pt-2 px-5 pb-4">
                    <div className="space-y-3">
                      {[
                        { id: 'PR4321', name: 'Parasetamol 500mg', category: 'Analgesik', stock: 10, minStock: 20, stockPercentage: 50 },
                        { id: 'PR2234', name: 'Amoxicillin 500mg', category: 'Antibiotik', stock: 5, minStock: 30, stockPercentage: 17 },
                        { id: 'PR7765', name: 'Antasida Tablet', category: 'Lambung', stock: 3, minStock: 25, stockPercentage: 12 },
                        { id: 'PR9988', name: 'Cetirizine 10mg', category: 'Antihistamin', stock: 8, minStock: 15, stockPercentage: 53 },
                        { id: 'PR8765', name: 'Loratadine 10mg', category: 'Antihistamin', stock: 4, minStock: 20, stockPercentage: 20 }
                      ].map((product, idx) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 border ${
                                product.stockPercentage < 20 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                              }`}>
                                <FaBoxes className={`h-3 w-3 ${
                                  product.stockPercentage < 20 ? 'text-red-600' : 'text-amber-600'
                                }`} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.category} • {product.id}</div>
                              </div>
                            </div>
                            <div>
                              <Badge 
                                className={
                                  product.stockPercentage < 20 
                                    ? "bg-red-50 text-red-700 border-red-200" :
                                    "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {product.stock} / {product.minStock}
                              </Badge>
                            </div>
                          </div>
                          <div className="h-1 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div 
                              className={`h-1 rounded-full ${
                                product.stockPercentage < 20 
                                  ? 'bg-red-500' 
                                  : 'bg-gradient-to-r from-amber-500 to-red-500'
                              }`}
                              style={{ width: `${product.stockPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* EXPIRING PRODUCTS SECTION */}
            <Link href="/inventory/expiring" className="block cursor-pointer transition-all hover:scale-[1.01]">
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardHeader className="pb-0 pt-4 px-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">Akan Expired</CardTitle>
                      <CardDescription>Produk yang mendekati tanggal kadaluarsa</CardDescription>
                    </div>
                    <div className="rounded-full bg-amber-100 p-2">
                      <FaClock className="h-4 w-4 text-amber-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[300px] overflow-auto">
                  <div className="pt-2 px-5 pb-4">
                    <div className="space-y-3">
                      {[
                        { id: 'BAT123', name: 'Vitamin C 500mg', batch: 'VC23A5', expDate: '2025-05-10', daysLeft: 30, stock: 45 },
                        { id: 'BAT456', name: 'Loratadine Sirup 60ml', batch: 'LS22C7', expDate: '2025-05-15', daysLeft: 35, stock: 12 },
                        { id: 'BAT789', name: 'Ranitidin 150mg', batch: 'RN23B8', expDate: '2025-05-20', daysLeft: 40, stock: 28 },
                        { id: 'BAT321', name: 'Paracetamol Sirup 60ml', batch: 'PS22D9', expDate: '2025-06-01', daysLeft: 52, stock: 17 },
                        { id: 'BAT654', name: 'Ambroxol Tablet', batch: 'AT23E3', expDate: '2025-06-10', daysLeft: 61, stock: 32 }
                      ].map((product, idx) => (
                        <div key={idx} className="group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 border ${
                                product.daysLeft < 40 ? 'bg-amber-50 border-amber-200' : 'bg-orange-50 border-orange-200'
                              }`}>
                                <FaPrescriptionBottle className={`h-3 w-3 ${
                                  product.daysLeft < 40 ? 'text-amber-600' : 'text-orange-600'
                                }`} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{product.name}</div>
                                <div className="text-xs text-gray-500">Batch: {product.batch} • Stok: {product.stock}</div>
                              </div>
                            </div>
                            <div>
                              <Badge 
                                className={
                                  product.daysLeft < 40 
                                    ? "bg-amber-50 text-amber-700 border-amber-200" :
                                    "bg-orange-50 text-orange-700 border-orange-200"
                                }
                              >
                                {product.daysLeft} hari lagi
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Exp: {new Date(product.expDate).toLocaleDateString('id-ID')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* ONGOING PURCHASE ORDERS SECTION */}
            <Link href="/purchasing?tab=pending" className="block cursor-pointer transition-all hover:scale-[1.01]">
              <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <CardHeader className="pb-0 pt-4 px-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">Pesanan Ongoing</CardTitle>
                      <CardDescription>PO yang sedang dalam proses pengadaan</CardDescription>
                    </div>
                    <div className="rounded-full bg-blue-100 p-2">
                      <FaTruckLoading className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 max-h-[300px] overflow-auto">
                  <div className="pt-2 px-5 pb-4">
                    <div className="space-y-3">
                      {[
                        { id: 'PO00567', supplier: 'PT Farmasi Utama', items: 12, orderDate: '2025-03-25', status: 'awaiting_delivery', eta: '2025-04-08' },
                        { id: 'PO00568', supplier: 'CV Medika Sejahtera', items: 8, orderDate: '2025-03-27', status: 'processing', eta: '2025-04-10' },
                        { id: 'PO00569', supplier: 'PT Apotek Indonesia', items: 15, orderDate: '2025-03-30', status: 'awaiting_delivery', eta: '2025-04-12' },
                        { id: 'PO00570', supplier: 'CV Kimia Farma', items: 5, orderDate: '2025-04-01', status: 'processing', eta: null },
                        { id: 'PO00571', supplier: 'PT Herbal Nusantara', items: 7, orderDate: '2025-04-02', status: 'submitted', eta: null }
                      ].map((order, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-lg p-3 hover:border-orange-200 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex">
                              <div className="rounded-full bg-gradient-to-br from-red-100 to-orange-50 flex items-center justify-center w-10 h-10 mr-3 border border-orange-200 shadow-sm">
                                <FaFileInvoiceDollar className="h-4 w-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{order.id}</p>
                                <p className="text-xs text-gray-500">{order.supplier}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge 
                                className={
                                  order.status === 'awaiting_delivery' 
                                    ? "bg-green-50 text-green-700 border-green-200" :
                                    order.status === 'processing'
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {order.status === 'awaiting_delivery' 
                                  ? 'Menunggu Pengiriman' 
                                  : order.status === 'processing'
                                    ? 'Diproses'
                                    : 'Submitted'}
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">
                                {order.eta && (
                                  <span className="text-orange-600 font-medium">
                                    ETA: {new Date(order.eta).toLocaleDateString('id-ID')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            <div className="flex justify-between items-center">
                              <span>{order.items} items • Order: {new Date(order.orderDate).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-4 space-y-6">
          {/* Unpaid Invoices Card */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
              <CardHeader className="pb-0 pt-4 px-5">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-800">Faktur Belum Lunas</CardTitle>
                    <CardDescription>Faktur pembelian yang belum dibayar atau dibayar sebagian</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <FaEye className="h-3.5 w-3.5 mr-1" /> Lihat Semua
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pt-3 pb-5">
                <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Total Faktur Belum Lunas</div>
                    <div className="text-lg font-bold text-gray-900">{unpaidInvoicesData.length} faktur</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Total Nilai Belum Dibayar</div>
                    <div className="text-lg font-bold text-gray-900">{formatRupiah(calculateTotalUnpaid(unpaidInvoicesData))}</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="text-xs text-red-700 mb-1">Persentase Terbayar</div>
                    <div className="text-lg font-bold text-gray-900">
                      {Math.round(
                        ((calculateTotalAmount(unpaidInvoicesData) - calculateTotalUnpaid(unpaidInvoicesData)) / 
                         calculateTotalAmount(unpaidInvoicesData)) * 100
                      )}%
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {unpaidInvoicesData.map((invoice, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 rounded-lg p-4 hover:border-orange-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex">
                          <div className="rounded-full bg-gradient-to-br from-red-100 to-orange-50 flex items-center justify-center w-10 h-10 mr-3 border border-orange-200 shadow-sm">
                            <FaFileInvoiceDollar className="h-4 w-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{invoice.id}</div>
                            <div className="text-xs text-gray-500">{invoice.supplier} • {invoice.items} item</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge 
                            className={
                              invoice.status === 'partial' 
                                ? "bg-amber-50 text-amber-700 border-amber-200" :
                                "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {invoice.status === 'partial' ? 'Bayar Sebagian' : 'Belum Dibayar'}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            {getDueDateText(getDaysUntilDue(invoice.dueDate))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Jatuh Tempo: {new Date(invoice.dueDate).toLocaleDateString('id-ID')}</span>
                        <span className="font-medium text-gray-900">{formatRupiah(invoice.amount)}</span>
                      </div>
                      
                      {/* Progress bar for partial payments */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mt-1 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-400 to-orange-400 h-2.5 rounded-full" 
                            style={{ width: `${invoice.paymentPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-gray-500">Sudah Bayar: {formatRupiah(invoice.paidAmount)}</span>
                          <span className="text-xs text-gray-500">Sisa: {formatRupiah(invoice.amount - invoice.paidAmount)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DashboardPage;
