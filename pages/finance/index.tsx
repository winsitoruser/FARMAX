import { NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import FinanceLayout from "@/components/layouts/finance-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ExportDataDropdown from "@/components/shared/export-data-dropdown";
import ImportDataDialog from "@/components/shared/import-data-dialog";
import Link from "next/link";
import {
  FaChartLine, FaFileInvoiceDollar, FaMoneyBillWave, FaWallet, 
  FaCreditCard, FaStoreAlt, FaShoppingBag, FaChartPie, FaCalendarAlt,
  FaSyncAlt, FaDownload, FaFilter, FaSearch, FaPiggyBank, FaStore,
  FaShoppingCart, FaTag, FaClipboardList, FaArrowUp, FaArrowDown,
  FaSortUp, FaSortDown, FaSortAmountUp, FaSortAmountDown, FaFileUpload,
  FaMapMarkerAlt, FaClock, FaExclamationTriangle, FaEye, FaUniversity,
  FaSort, FaTimes, FaPrint, FaPlus, FaExchangeAlt, FaBook, FaCashRegister,
  FaArrowRight, FaBuilding
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
import SafeChart from "@/components/dashboard/safe-chart";
import { Progress } from "@/components/ui/progress";

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
  Legend,
);

// Tipe data untuk cabang apotek
interface Branch {
  id: string;
  name: string;
  location: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
  invoicesCount: {
    total: number;
    paid: number;
    unpaid: number;
    partial: number;
  };
  inventory: {
    value: number;
    items: number;
    lowStock: number;
  };
  cashPosition: number;
}

// Data dummy untuk cabang apotek
const mockBranches: Branch[] = [
  {
    id: "all",
    name: "Semua Cabang",
    location: "Seluruh Indonesia",
    revenue: 245600000,
    expenses: 178300000,
    profit: 67300000,
    growth: 12.5,
    invoicesCount: {
      total: 156,
      paid: 98,
      unpaid: 42,
      partial: 16
    },
    inventory: {
      value: 325000000,
      items: 3240,
      lowStock: 28
    },
    cashPosition: 87500000
  },
  {
    id: "branch-1",
    name: "Apotek Sehat Jakarta",
    location: "Jakarta Selatan",
    revenue: 98500000,
    expenses: 76300000,
    profit: 22200000,
    growth: 8.3,
    invoicesCount: {
      total: 62,
      paid: 38,
      unpaid: 18,
      partial: 6
    },
    inventory: {
      value: 127000000,
      items: 1320,
      lowStock: 12
    },
    cashPosition: 32500000
  },
  {
    id: "branch-2",
    name: "Apotek Sehat Bandung",
    location: "Bandung Utara",
    revenue: 84200000,
    expenses: 59800000,
    profit: 24400000,
    growth: 15.2,
    invoicesCount: {
      total: 58,
      paid: 42,
      unpaid: 12,
      partial: 4
    },
    inventory: {
      value: 112000000,
      items: 1150,
      lowStock: 8
    },
    cashPosition: 28700000
  },
  {
    id: "branch-3",
    name: "Apotek Sehat Surabaya",
    location: "Surabaya Timur",
    revenue: 62900000,
    expenses: 42200000,
    profit: 20700000,
    growth: 18.7,
    invoicesCount: {
      total: 36,
      paid: 18,
      unpaid: 12,
      partial: 6
    },
    inventory: {
      value: 86000000,
      items: 770,
      lowStock: 8
    },
    cashPosition: 26300000
  }
];

// Data dummy untuk transaksi terbaru
const mockRecentTransactions = [
  { id: 1, date: "2025-03-26", description: "Penjualan Obat", amount: 1250000, type: "income", branch: "branch-1" },
  { id: 2, date: "2025-03-25", description: "Pembelian Stok", amount: 5000000, type: "expense", branch: "branch-1" },
  { id: 3, date: "2025-03-24", description: "Pembayaran Tagihan", amount: 750000, type: "expense", branch: "branch-2" },
  { id: 4, date: "2025-03-24", description: "Penjualan Obat", amount: 2300000, type: "income", branch: "branch-2" },
  { id: 5, date: "2025-03-23", description: "Penjualan Obat", amount: 980000, type: "income", branch: "branch-3" },
];

// Data dummy untuk tagihan belum dibayar & dibayar sebagian
const mockInvoices = [
  { 
    id: "INV-2025-001", 
    supplier: "PT. Pharma Utama", 
    date: "2025-03-10",
    dueDate: "2025-03-30", 
    totalAmount: 7500000, 
    paidAmount: 3500000,
    remainingAmount: 4000000,
    status: "partial",
    branch: "branch-1",
    age: 15,
    lastPayment: "2025-03-15",
    paymentHistory: [
      { date: "2025-03-01", amount: 2000000 },
      { date: "2025-03-15", amount: 1500000 }
    ],
    items: [
      { description: "Panadol Extra 500mg (10 Strip)", quantity: 50, unitPrice: 125000 },
      { description: "One Med Hand Sanitizer 100ml", quantity: 100, unitPrice: 28500 },
      { description: "Amoxicillin 500mg (10 Strip)", quantity: 40, unitPrice: 85000 }
    ]
  },
  { 
    id: "INV-2025-002", 
    customer: "Klinik Sehat Sentosa", 
    date: "2025-03-12",
    dueDate: "2025-03-27", 
    totalAmount: 8750000, 
    paidAmount: 5000000,
    remainingAmount: 3750000,
    status: "partial",
    branch: "branch-1",
    age: 12,
    lastPayment: "2025-03-20",
    paymentHistory: [
      { date: "2025-03-15", amount: 2000000 },
      { date: "2025-03-20", amount: 3000000 }
    ],
    items: [
      { description: "Panadol Extra 500mg (10 Strip)", quantity: 50, unitPrice: 125000 },
      { description: "One Med Hand Sanitizer 100ml", quantity: 100, unitPrice: 28500 },
      { description: "Amoxicillin 500mg (10 Strip)", quantity: 40, unitPrice: 85000 }
    ]
  },
  { 
    id: "INV-2025-003", 
    supplier: "PT. Kalbe Farma", 
    date: "2025-03-15",
    dueDate: "2025-04-02", 
    totalAmount: 12500000, 
    paidAmount: 7500000,
    remainingAmount: 5000000,
    status: "partial",
    branch: "branch-2",
    age: 8,
    lastPayment: "2025-03-22",
    paymentHistory: [
      { date: "2025-03-19", amount: 3500000 },
      { date: "2025-03-22", amount: 4000000 }
    ],
    items: [
      { description: "Panadol Extra 500mg (10 Strip)", quantity: 50, unitPrice: 125000 },
      { description: "One Med Hand Sanitizer 100ml", quantity: 100, unitPrice: 28500 },
      { description: "Amoxicillin 500mg (10 Strip)", quantity: 40, unitPrice: 85000 }
    ]
  },
  { 
    id: "INV-2025-004", 
    customer: "RS Medika Jaya", 
    date: "2025-03-19",
    dueDate: "2025-04-05", 
    totalAmount: 15000000, 
    paidAmount: 10000000,
    remainingAmount: 5000000,
    status: "partial",
    branch: "branch-3",
    age: 5,
    lastPayment: "2025-03-24",
    paymentHistory: [
      { date: "2025-03-20", amount: 5000000 },
      { date: "2025-03-24", amount: 5000000 }
    ],
    items: [
      { description: "Panadol Extra 500mg (10 Strip)", quantity: 50, unitPrice: 125000 },
      { description: "One Med Hand Sanitizer 100ml", quantity: 100, unitPrice: 28500 },
      { description: "Amoxicillin 500mg (10 Strip)", quantity: 40, unitPrice: 85000 }
    ]
  }
];

// Data untuk aging analysis
const mockAgingAnalysis = {
  receivables: [
    { range: "Current", amount: 68500000 },
    { range: "1-30 days", amount: 42300000 },
    { range: "31-60 days", amount: 18700000 },
    { range: "61-90 days", amount: 7200000 },
    { range: "> 90 days", amount: 3800000 }
  ],
  payables: [
    { range: "Current", amount: 82700000 },
    { range: "1-30 days", amount: 37500000 },
    { range: "31-60 days", amount: 14200000 },
    { range: "61-90 days", amount: 4500000 },
    { range: "> 90 days", amount: 1800000 }
  ]
};

// Data dummy untuk bank accounts
const mockBankAccounts = [
  { 
    id: 1, 
    name: "BCA Main Account", 
    accountNumber: "1234567890", 
    balance: 45700000, 
    lastReconciled: "2025-03-25",
    reconciliationStatus: "reconciled"
  },
  { 
    id: 2, 
    name: "Mandiri Operational", 
    accountNumber: "0987654321", 
    balance: 28300000, 
    lastReconciled: "2025-03-24",
    reconciliationStatus: "reconciled" 
  },
  { 
    id: 3, 
    name: "BNI Savings", 
    accountNumber: "5678901234", 
    balance: 13500000, 
    lastReconciled: "2025-03-20",
    reconciliationStatus: "pending" 
  }
];

const mockCashFlowForecast = [
  { date: "2025-03-28", inflow: 8500000, outflow: 4200000 },
  { date: "2025-03-29", inflow: 6200000, outflow: 3100000 },
  { date: "2025-03-30", inflow: 5800000, outflow: 7500000 },
  { date: "2025-03-31", inflow: 9200000, outflow: 4800000 },
  { date: "2025-04-01", inflow: 7800000, outflow: 12500000 },
  { date: "2025-04-02", inflow: 8500000, outflow: 5200000 },
  { date: "2025-04-03", inflow: 6700000, outflow: 3800000 },
];

const mockCostCategories = [
  { name: 'Pembelian Obat', amount: 103400000, percentage: 58 },
  { name: 'Gaji Karyawan', amount: 44600000, percentage: 25 },
  { name: 'Operasional', amount: 17800000, percentage: 10 },
  { name: 'Marketing', amount: 8900000, percentage: 5 },
  { name: 'Lainnya', amount: 3600000, percentage: 2 },
];

// Mock data for inventory value
const mockInventoryData = [
  { 
    branch: "all", 
    totalItems: 4856, 
    totalValue: 3250000000, 
    lowStock: 124, 
    expiringSoon: 78, 
    topCategories: [
      { name: "Obat Resep", value: 1450000000, percentage: 44.6 },
      { name: "OTC", value: 850000000, percentage: 26.2 },
      { name: "Vitamin & Suplemen", value: 520000000, percentage: 16.0 },
      { name: "Alat Kesehatan", value: 320000000, percentage: 9.8 },
      { name: "Kecantikan", value: 110000000, percentage: 3.4 }
    ]
  },
  { 
    branch: "central", 
    totalItems: 2103, 
    totalValue: 1450000000, 
    lowStock: 42, 
    expiringSoon: 31, 
    topCategories: [
      { name: "Obat Resep", value: 650000000, percentage: 44.8 },
      { name: "OTC", value: 380000000, percentage: 26.2 },
      { name: "Vitamin & Suplemen", value: 230000000, percentage: 15.9 },
      { name: "Alat Kesehatan", value: 140000000, percentage: 9.7 },
      { name: "Kecantikan", value: 50000000, percentage: 3.4 }
    ]
  },
  { 
    branch: "branch1", 
    totalItems: 854, 
    totalValue: 580000000, 
    lowStock: 28, 
    expiringSoon: 17, 
    topCategories: [
      { name: "Obat Resep", value: 260000000, percentage: 44.8 },
      { name: "OTC", value: 150000000, percentage: 25.9 },
      { name: "Vitamin & Suplemen", value: 95000000, percentage: 16.4 },
      { name: "Alat Kesehatan", value: 55000000, percentage: 9.5 },
      { name: "Kecantikan", value: 20000000, percentage: 3.4 }
    ]
  },
  { 
    branch: "branch2", 
    totalItems: 743, 
    totalValue: 480000000, 
    lowStock: 22, 
    expiringSoon: 14, 
    topCategories: [
      { name: "Obat Resep", value: 210000000, percentage: 43.8 },
      { name: "OTC", value: 130000000, percentage: 27.1 },
      { name: "Vitamin & Suplemen", value: 75000000, percentage: 15.6 },
      { name: "Alat Kesehatan", value: 50000000, percentage: 10.4 },
      { name: "Kecantikan", value: 15000000, percentage: 3.1 }
    ]
  },
  { 
    branch: "branch3", 
    totalItems: 625, 
    totalValue: 410000000, 
    lowStock: 18, 
    expiringSoon: 9, 
    topCategories: [
      { name: "Obat Resep", value: 180000000, percentage: 43.9 },
      { name: "OTC", value: 110000000, percentage: 26.8 },
      { name: "Vitamin & Suplemen", value: 65000000, percentage: 15.9 },
      { name: "Alat Kesehatan", value: 40000000, percentage: 9.8 },
      { name: "Kecantikan", value: 15000000, percentage: 3.6 }
    ]
  },
  { 
    branch: "branch4", 
    totalItems: 531, 
    totalValue: 330000000, 
    lowStock: 14, 
    expiringSoon: 7, 
    topCategories: [
      { name: "Obat Resep", value: 150000000, percentage: 45.5 },
      { name: "OTC", value: 80000000, percentage: 24.2 },
      { name: "Vitamin & Suplemen", value: 55000000, percentage: 16.7 },
      { name: "Alat Kesehatan", value: 35000000, percentage: 10.6 },
      { name: "Kecantikan", value: 10000000, percentage: 3.0 }
    ]
  }
];

// Mock data for top value products
const mockTopProducts = [
  { id: "P001", name: "Panadol Extra 500mg (10 Strip)", stock: 145, unitPrice: 12500, totalValue: 1812500, category: "OTC", branch: "central" },
  { id: "P002", name: "Amoxicillin 500mg (10 Strip)", stock: 98, unitPrice: 35000, totalValue: 3430000, category: "Obat Resep", branch: "branch1" },
  { id: "P003", name: "Blackmores Vitamin C 500mg (60 Tab)", stock: 72, unitPrice: 185000, totalValue: 13320000, category: "Vitamin & Suplemen", branch: "central" },
  { id: "P004", name: "OneTouch Ultra Test Strip (25 Strip)", stock: 53, unitPrice: 275000, totalValue: 14575000, category: "Alat Kesehatan", branch: "branch2" },
  { id: "P005", name: "Neurobion Forte (10 Strip)", stock: 119, unitPrice: 95000, totalValue: 11305000, category: "Vitamin & Suplemen", branch: "branch3" },
  { id: "P006", name: "Glucophage 500mg (10 Strip)", stock: 87, unitPrice: 45000, totalValue: 3915000, category: "Obat Resep", branch: "central" },
  { id: "P007", name: "Micardis 80mg (10 Strip)", stock: 45, unitPrice: 285000, totalValue: 12825000, category: "Obat Resep", branch: "branch4" },
  { id: "P008", name: "Ensure Gold 900g", stock: 35, unitPrice: 420000, totalValue: 14700000, category: "Vitamin & Suplemen", branch: "central" }
];

const FinanceDashboardPage: NextPage = () => {
  const router = useRouter();

  // State for filters and branch selection
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>("overview");
  const [activeInvoiceTab, setActiveInvoiceTab] = useState<string>("all");
  const [activeInventoryTab, setActiveInventoryTab] = useState<string>("summary");
  const [showInvoiceDetail, setShowInvoiceDetail] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  // Pagination states
  const [invoicesPage, setInvoicesPage] = useState<number>(1);
  const [inventoryProductsPage, setInventoryProductsPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Sorting states
  const [invoicesSortField, setInvoicesSortField] = useState<string>("date");
  const [invoicesSortDirection, setInvoicesSortDirection] = useState<"asc" | "desc">("desc");
  const [inventorySortField, setInventorySortField] = useState<string>("totalValue");
  const [inventorySortDirection, setInventorySortDirection] = useState<"asc" | "desc">("desc");

  // Filter states
  const [invoicesFilter, setInvoicesFilter] = useState<string>("");
  const [inventoryFilter, setInventoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<{start: string; end: string}>({
    start: "", 
    end: ""
  });

  // Get branch information
  const activeBranch = mockBranches.find(branch => branch.id === selectedBranch) || mockBranches[0];

  // Filter data based on selected branch
  const filteredInvoices = selectedBranch === "all" 
    ? mockInvoices 
    : mockInvoices.filter(invoice => invoice.branch === selectedBranch);

  const filteredTransactions = selectedBranch === "all"
    ? mockRecentTransactions
    : mockRecentTransactions.filter(transaction => transaction.branch === selectedBranch);

  // Handlers
  const handleTabChange = (tab: string) => {
    setActiveDashboardTab(tab);
  };

  const handleInvoiceTabChange = (tab: string) => {
    setActiveInvoiceTab(tab);
  };

  const handleShowInvoiceDetail = (invoice: any) => {
    // Create a complete copy with default empty items array if missing
    const completeInvoice = {
      ...invoice,
      items: invoice.items || []
    };
    setSelectedInvoice(completeInvoice);
    setShowInvoiceDetail(true);
  };

  const handleCloseInvoiceDetail = () => {
    setShowInvoiceDetail(false);
  };

  const sortData = (data: any[], field: string, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  };
  
  const filterInvoices = (invoices: any[], filter: string) => {
    if (!filter.trim()) {
      // Apply status filter even when search is empty
      return filterInvoicesByStatus(invoices, statusFilter, dateRangeFilter);
    }
    
    const lowercasedFilter = filter.toLowerCase();
    // First filter by text search
    const textFilteredInvoices = invoices.filter(invoice => 
      (invoice.id && invoice.id.toLowerCase().includes(lowercasedFilter)) ||
      (invoice.supplier && invoice.supplier.toLowerCase().includes(lowercasedFilter)) ||
      (invoice.customer && invoice.customer.toLowerCase().includes(lowercasedFilter)) ||
      (invoice.date && invoice.date.toLowerCase().includes(lowercasedFilter))
    );
    
    // Then apply status and date filter
    return filterInvoicesByStatus(textFilteredInvoices, statusFilter, dateRangeFilter);
  };
  
  const filterInvoicesByStatus = (invoices: any[], status: string, dateRange: {start: string; end: string}) => {
    let filteredByStatus = invoices;
    
    // Apply status filter
    if (status !== "all") {
      filteredByStatus = filteredByStatus.filter(invoice => invoice.status === status);
    }
    
    // Apply date filter if dates are provided
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of day
      
      filteredByStatus = filteredByStatus.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    }
    
    return filteredByStatus;
  };
  
  const filterInventoryProducts = (products: any[], filter: string) => {
    if (!filter.trim()) return products;
    
    const lowercasedFilter = filter.toLowerCase();
    return products.filter(product => 
      (product.name && product.name.toLowerCase().includes(lowercasedFilter)) ||
      (product.category && product.category.toLowerCase().includes(lowercasedFilter))
    );
  };
  
  const handleSortChange = (field: string, tableType: 'invoices' | 'inventory') => {
    if (tableType === 'invoices') {
      if (field === invoicesSortField) {
        setInvoicesSortDirection(invoicesSortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setInvoicesSortField(field);
        setInvoicesSortDirection('asc');
      }
    } else {
      if (field === inventorySortField) {
        setInventorySortDirection(inventorySortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setInventorySortField(field);
        setInventorySortDirection('asc');
      }
    }
  };
  
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setInvoicesPage(1); // Reset to first page
    setInventoryProductsPage(1);
  };
  
  const Pagination = ({ 
    currentPage, 
    totalItems, 
    onPageChange,
    itemsPerPage
  }: { 
    currentPage: number, 
    totalItems: number,
    onPageChange: (page: number) => void,
    itemsPerPage: number
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const renderPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      if (startPage > 1) {
        pages.push(
          <Button 
            key="first" 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 border-orange-200"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
        );
        
        if (startPage > 2) {
          pages.push(
            <span key="ellipsis1" className="px-1">...</span>
          );
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <Button 
            key={i} 
            variant={currentPage === i ? "default" : "outline"} 
            size="sm" 
            className={`h-8 w-8 p-0 ${
              currentPage === i 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                : 'border-orange-200'
            }`}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push(
            <span key="ellipsis2" className="px-1">...</span>
          );
        }
        
        pages.push(
          <Button 
            key="last" 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 border-orange-200"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        );
      }
      
      return pages;
    };
    
    return (
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}>
            <SelectTrigger className="w-[80px] h-8 ml-2 border-orange-200">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-orange-200"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-1 mx-1">
            {renderPageNumbers()}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 border-orange-200"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  // Filter invoices based on selected tab
  const filteredInvoicesBasedOnTab = activeInvoiceTab === "all" 
    ? filteredInvoices 
    : activeInvoiceTab === "partial" 
      ? filteredInvoices.filter(invoice => invoice.status === "partial") 
      : filteredInvoices.filter(invoice => invoice.status === "overdue");

  // Format currency function
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Force clean up of chart instances when switching tabs
  useEffect(() => {
    // Cleanup function for when component unmounts or tab changes
    return () => {
      // Reset any chart-related state
      // Chart instances are managed by the SafeChart component
      console.log("Tab changed or component unmounted, charts will be recreated");
    };
  }, [activeDashboardTab]);

  // Get the active inventory data based on selected branch
  const activeInventoryData = mockInventoryData.find(data => data.branch === selectedBranch) || mockInventoryData[0];
  
  // Filter top products based on selected branch
  const filteredTopProducts = selectedBranch === 'all' 
    ? mockTopProducts 
    : mockTopProducts.filter(product => product.branch === selectedBranch);

  // Branch Stat Card component with orange theme
  const BranchStatCard = ({ icon, title, value, colorClass, subValue, trend, isAction = false, onActionClick }: { 
    icon: React.ReactNode, 
    title: string, 
    value: string | number, 
    colorClass: string,
    subValue?: string,
    trend?: { 
      direction: 'up' | 'down', 
      percentage: number 
    },
    isAction?: boolean,
    onActionClick?: () => void
  }) => (
    <Card className="border-orange-100 shadow-sm hover:shadow-md transition-all duration-200 neo-shadow relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full opacity-20 transform translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-100 rounded-full opacity-30 transform -translate-x-14 translate-y-14"></div>
      
      {/* Top decorative bar */}
      <div className={`h-1.5 w-full ${colorClass}`}></div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-xl font-bold text-gray-800">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </h3>
            {subValue && (
              <p className="text-xs text-gray-500 mt-1">{subValue}</p>
            )}
            {trend && (
              <p className={`text-xs mt-2 flex items-center ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend.direction === 'up' ? <FaArrowUp className="mr-1 h-3 w-3" /> : <FaArrowDown className="mr-1 h-3 w-3" />}
                {trend.percentage}% dibanding periode lalu
              </p>
            )}
          </div>
          
          <div className={`p-2 rounded-lg flex items-center justify-center ${colorClass} shadow-sm text-white`}>
            {icon}
          </div>
        </div>
        {isAction && (
          <div className="mt-4">
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              onClick={onActionClick}
            >
              Lihat Detail
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Branch Selector dan Periode */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-4 rounded-lg border border-orange-100 neo-shadow">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FaStore className="text-orange-500 h-5 w-5" />
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full sm:w-[260px] border-orange-200 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Pilih Cabang" />
              </SelectTrigger>
              <SelectContent>
                {mockBranches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name} 
                    {branch.id !== "all" && <span className="text-sm text-gray-500 ml-2">({branch.location})</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FaCalendarAlt className="text-orange-500 h-5 w-5" />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-[180px] border-orange-200 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="quarter">Kuartal Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
              <FaSyncAlt className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
              <FaDownload className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Branch Overview */}
        <div className="bg-white rounded-lg border border-orange-100 neo-shadow overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <div className="flex items-center">
              <div className="h-7 w-1.5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full mr-3"></div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {activeBranch.name}
                </h2>
                {activeBranch.id !== "all" && (
                  <p className="text-sm text-gray-600">{activeBranch.location}</p>
                )}
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BranchStatCard 
              icon={<FaMoneyBillWave className="h-4 w-4" />} 
              title="Pendapatan" 
              value={activeBranch.revenue} 
              colorClass="bg-gradient-to-r from-orange-500 to-amber-500"
              trend={{ direction: 'up', percentage: 8.3 }}
              subValue="Periode: Bulan Ini"
            />
            <BranchStatCard 
              icon={<FaWallet className="h-4 w-4" />} 
              title="Pengeluaran" 
              value={activeBranch.expenses} 
              colorClass="bg-gradient-to-r from-amber-500 to-orange-500"
              trend={{ direction: 'up', percentage: 5.7 }}
              subValue="Periode: Bulan Ini"
            />
            <BranchStatCard 
              icon={<FaChartLine className="h-4 w-4" />} 
              title="Keuntungan" 
              value={activeBranch.profit} 
              colorClass="bg-gradient-to-r from-green-500 to-emerald-500"
              trend={{ direction: 'up', percentage: activeBranch.growth }}
              subValue="Periode: Bulan Ini"
            />
            <BranchStatCard 
              icon={<FaBook className="h-4 w-4" />} 
              title="Buku Besar" 
              value={78} 
              colorClass="bg-gradient-to-r from-blue-500 to-indigo-500"
              subValue="Lihat Jurnal"
              isAction={true}
              onActionClick={() => router.push('/finance/ledger')}
            />
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeDashboardTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="bg-orange-50 p-1 border border-orange-100">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="invoices" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              Faktur & Pembayaran
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              Nilai Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              Performa Keuangan
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Card className="col-span-1 sm:col-span-2 xl:col-span-5 border-orange-100 overflow-hidden neo-shadow relative">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-base font-bold text-orange-800 flex items-center">
                    <FaFileInvoiceDollar className="mr-2 text-orange-500 h-4 w-4" />
                    Faktur Perlu Diperhatikan
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="overflow-x-auto w-full">
                    <Table className="w-full">
                      <TableHeader className="bg-orange-50/50">
                        <TableRow>
                          <TableHead 
                            className="w-[170px] cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('id', 'invoices')}
                          >
                            Faktur
                            {invoicesSortField === 'id' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="w-[200px] cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('date', 'invoices')}
                          >
                            Tanggal
                            {invoicesSortField === 'date' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="w-[170px] cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('supplier', 'invoices')}
                          >
                            Supplier
                            {invoicesSortField === 'supplier' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="w-[150px] text-right cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('totalAmount', 'invoices')}
                          >
                            Total
                            {invoicesSortField === 'totalAmount' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="w-[150px] text-right cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('paidAmount', 'invoices')}
                          >
                            Dibayar
                            {invoicesSortField === 'paidAmount' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="w-[150px] text-right cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('remainingAmount', 'invoices')}
                          >
                            Sisa
                            {invoicesSortField === 'remainingAmount' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="w-[130px] cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('status', 'invoices')}
                          >
                            Status
                            {invoicesSortField === 'status' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead 
                            className="w-[130px] cursor-pointer hover:text-orange-600"
                            onClick={() => handleSortChange('branch', 'invoices')}
                          >
                            Cabang
                            {invoicesSortField === 'branch' && (
                              <span className="ml-1">
                                {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </TableHead>
                          <TableHead className="w-[100px]">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filterInvoices(sortData(filteredInvoices, invoicesSortField, invoicesSortDirection), invoicesFilter).length > 0 ? 
                          filterInvoices(sortData(filteredInvoices, invoicesSortField, invoicesSortDirection), invoicesFilter)
                            .slice((invoicesPage - 1) * itemsPerPage, invoicesPage * itemsPerPage)
                            .map(invoice => (
                            <TableRow key={invoice.id} className="hover:bg-orange-50/50">
                              <TableCell className="font-medium">#{invoice.id}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-gray-900">{invoice.date}</span>
                                  <span className="text-xs text-gray-500">Jatuh tempo: {invoice.dueDate}</span>
                                </div>
                              </TableCell>
                              <TableCell>{invoice.supplier || invoice.customer}</TableCell>
                              <TableCell className="text-right">{formatCurrency(invoice.totalAmount)}</TableCell>
                              <TableCell className="text-right text-green-600">{formatCurrency(invoice.paidAmount)}</TableCell>
                              <TableCell className="text-right text-orange-600">{formatCurrency(invoice.remainingAmount)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col space-y-1">
                                  <Badge 
                                    className={
                                      invoice.status === 'partial' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : invoice.status === 'overdue' 
                                          ? 'bg-red-100 text-red-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                    }
                                  >
                                    {invoice.status === 'partial' ? 'Terbayar Sebagian' : 
                                     invoice.status === 'overdue' ? 'Jatuh Tempo' : 'Menunggu'}
                                  </Badge>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div 
                                      className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" 
                                      style={{ width: `${(invoice.paidAmount / invoice.totalAmount) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{Math.round((invoice.paidAmount / invoice.totalAmount) * 100)}% terbayar</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <FaMapMarkerAlt className="h-3 w-3 mr-1.5 text-orange-500" />
                                  {mockBranches.find(b => b.id === invoice.branch)?.name || invoice.branch}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 p-0 text-blue-600"
                                  onClick={() => handleShowInvoiceDetail(invoice)}
                                >
                                  Detail
                                </Button>
                              </TableCell>
                            </TableRow>
                          )) : (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                              Tidak ada faktur yang memerlukan perhatian.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filterInvoices(sortData(filteredInvoices, invoicesSortField, invoicesSortDirection), invoicesFilter).length > 0 && (
                    <div className="p-4 border-t border-orange-100">
                      <Pagination 
                        currentPage={invoicesPage}
                        totalItems={filterInvoices(sortData(filteredInvoices, invoicesSortField, invoicesSortDirection), invoicesFilter).length}
                        onPageChange={setInvoicesPage}
                        itemsPerPage={itemsPerPage}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Invoices & Receivables Tab Content */}
          <TabsContent value="invoices" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Aging Analysis */}
              <Card className="col-span-1 lg:col-span-2 border-orange-100 overflow-hidden neo-shadow relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-100 rounded-full opacity-30"></div>
                
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                      <FaClock className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-base font-bold text-orange-800">
                      Aging Analysis
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <Tabs defaultValue="receivables" className="mt-2">
                    <TabsList className="bg-orange-50 border border-orange-100">
                      <TabsTrigger 
                        value="receivables" 
                        className="text-xs px-3 h-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                      >
                        Piutang
                      </TabsTrigger>
                      <TabsTrigger 
                        value="payables" 
                        className="text-xs px-3 h-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                      >
                        Hutang
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="receivables" className="mt-5">
                      <div className="grid grid-cols-1 gap-5">
                        {mockAgingAnalysis.receivables.map((item, index) => (
                          <div key={item.range} className="flex flex-col bg-white rounded-lg p-4 border border-orange-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                  index === 0 ? 'bg-emerald-500' :
                                  index === 1 ? 'bg-yellow-500' :
                                  index === 2 ? 'bg-orange-500' :
                                  index === 3 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}></div>
                                <span className="text-sm font-semibold text-gray-800">{item.range}</span>
                              </div>
                              <span className="text-base font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                            </div>
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-2.5 text-xs flex rounded bg-orange-100">
                                <div
                                  style={{ width: `${(item.amount / mockAgingAnalysis.receivables.reduce((sum, curr) => sum + curr.amount, 0)) * 100}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded ${
                                    index === 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                    index === 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                    index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                                    index === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                    'bg-gradient-to-r from-red-500 to-red-400'
                                  }`}
                                ></div>
                              </div>
                              <div className="flex justify-end mt-1">
                                <span className="text-xs font-medium text-gray-600">
                                  {((item.amount / mockAgingAnalysis.receivables.reduce((sum, curr) => sum + curr.amount, 0)) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                              <FaMoneyBillWave className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">Total Piutang:</span>
                          </div>
                          <span className="text-lg font-bold text-orange-800">{formatCurrency(mockAgingAnalysis.receivables.reduce((sum, curr) => sum + curr.amount, 0))}</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="payables" className="mt-5">
                      <div className="grid grid-cols-1 gap-5">
                        {mockAgingAnalysis.payables.map((item, index) => (
                          <div key={item.range} className="flex flex-col bg-white rounded-lg p-4 border border-orange-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                  index === 0 ? 'bg-emerald-500' :
                                  index === 1 ? 'bg-yellow-500' :
                                  index === 2 ? 'bg-orange-500' :
                                  index === 3 ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`}></div>
                                <span className="text-sm font-semibold text-gray-800">{item.range}</span>
                              </div>
                              <span className="text-base font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                            </div>
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-2.5 text-xs flex rounded bg-orange-100">
                                <div
                                  style={{ width: `${(item.amount / mockAgingAnalysis.payables.reduce((sum, curr) => sum + curr.amount, 0)) * 100}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded ${
                                    index === 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                    index === 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                    index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                                    index === 3 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                    'bg-gradient-to-r from-red-500 to-red-400'
                                  }`}
                                ></div>
                              </div>
                              <div className="flex justify-end mt-1">
                                <span className="text-xs font-medium text-gray-600">
                                  {((item.amount / mockAgingAnalysis.payables.reduce((sum, curr) => sum + curr.amount, 0)) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                              <FaMoneyBillWave className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold text-gray-800">Total Hutang:</span>
                          </div>
                          <span className="text-lg font-bold text-orange-800">{formatCurrency(mockAgingAnalysis.payables.reduce((sum, curr) => sum + curr.amount, 0))}</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Invoice Summary */}
              <Card className="border-orange-100 overflow-hidden neo-shadow">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-base font-bold text-orange-800 flex items-center">
                    <FaFileInvoiceDollar className="mr-2 text-orange-500 h-4 w-4" />
                    Status Faktur
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-gray-700">Lunas</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          {activeBranch.invoicesCount.paid}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {Math.round((activeBranch.invoicesCount.paid / activeBranch.invoicesCount.total) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                        <span className="text-sm text-gray-700">Sebagian</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                          {activeBranch.invoicesCount.partial}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {Math.round((activeBranch.invoicesCount.partial / activeBranch.invoicesCount.total) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm text-gray-700">Belum Dibayar</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          {activeBranch.invoicesCount.unpaid}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {Math.round((activeBranch.invoicesCount.unpaid / activeBranch.invoicesCount.total) * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center font-medium">
                        <span className="text-gray-800">Total Faktur</span>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm">
                          {activeBranch.invoicesCount.total}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                        onClick={() => router.push('/finance/invoices')}
                      >
                        Kelola Faktur
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Detailed Partial Invoices */}
            <Card className="border-orange-100 overflow-hidden neo-shadow">
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold text-orange-800 flex items-center">
                    <FaExclamationTriangle className="mr-2 text-orange-500 h-4 w-4" />
                    Faktur Memerlukan Perhatian
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input 
                      placeholder="Cari faktur..."
                      className="w-60 text-sm border-orange-200 focus:ring-orange-500 focus:border-orange-500 h-8"
                      value={invoicesFilter}
                      onChange={(e) => setInvoicesFilter(e.target.value)}
                    />
                    <Button variant="outline" size="sm" className="h-8 border-orange-200 text-orange-700">
                      <FaFilter className="mr-1.5 h-3 w-3" />
                      Filter
                    </Button>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40 text-sm border-orange-200 h-8">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="partial">Terbayar Sebagian</SelectItem>
                        <SelectItem value="overdue">Jatuh Tempo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-8 border-orange-200 text-orange-700">
                      <FaCalendarAlt className="mr-1.5 h-3 w-3" />
                      Tanggal
                    </Button>
                    <Input 
                      type="date" 
                      className="w-40 text-sm border-orange-200 focus:ring-orange-500 focus:border-orange-500 h-8"
                      value={dateRangeFilter.start}
                      onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, start: e.target.value })}
                    />
                    <span className="text-sm text-gray-500">-</span>
                    <Input 
                      type="date" 
                      className="w-40 text-sm border-orange-200 focus:ring-orange-500 focus:border-orange-500 h-8"
                      value={dateRangeFilter.end}
                      onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, end: e.target.value })}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                  <Table className="w-full">
                    <TableHeader className="bg-orange-50/50">
                      <TableRow>
                        <TableHead 
                          className="w-[170px] cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('id', 'invoices')}
                        >
                          Faktur
                          {invoicesSortField === 'id' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="w-[200px] cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('date', 'invoices')}
                        >
                          Tanggal
                          {invoicesSortField === 'date' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="w-[170px] cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('supplier', 'invoices')}
                        >
                          Supplier
                          {invoicesSortField === 'supplier' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="w-[150px] text-right cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('totalAmount', 'invoices')}
                        >
                          Total
                          {invoicesSortField === 'totalAmount' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="w-[150px] text-right cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('paidAmount', 'invoices')}
                        >
                          Dibayar
                          {invoicesSortField === 'paidAmount' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="w-[150px] text-right cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('remainingAmount', 'invoices')}
                        >
                          Sisa
                          {invoicesSortField === 'remainingAmount' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="w-[130px] cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('status', 'invoices')}
                        >
                          Status
                          {invoicesSortField === 'status' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead 
                          className="w-[130px] cursor-pointer hover:text-orange-600"
                          onClick={() => handleSortChange('branch', 'invoices')}
                        >
                          Cabang
                          {invoicesSortField === 'branch' && (
                            <span className="ml-1">
                              {invoicesSortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </TableHead>
                        <TableHead className="w-[100px]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterInvoices(filteredInvoices, invoicesFilter).length > 0 ? filterInvoices(filteredInvoices, invoicesFilter)
                        .slice((invoicesPage - 1) * itemsPerPage, invoicesPage * itemsPerPage)
                        .map(invoice => (
                        <TableRow key={invoice.id} className="hover:bg-orange-50/50">
                          <TableCell className="font-medium">#{invoice.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-gray-900">{invoice.date}</span>
                              <span className="text-xs text-gray-500">Jatuh tempo: {invoice.dueDate}</span>
                            </div>
                          </TableCell>
                          <TableCell>{invoice.supplier || invoice.customer}</TableCell>
                          <TableCell className="text-right">{formatCurrency(invoice.totalAmount)}</TableCell>
                          <TableCell className="text-right text-green-600">{formatCurrency(invoice.paidAmount)}</TableCell>
                          <TableCell className="text-right text-orange-600">{formatCurrency(invoice.remainingAmount)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col space-y-1">
                              <Badge 
                                className={
                                  invoice.status === 'partial' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : invoice.status === 'overdue' 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {invoice.status === 'partial' ? 'Terbayar Sebagian' : 
                                 invoice.status === 'overdue' ? 'Jatuh Tempo' : 'Menunggu'}
                              </Badge>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" 
                                  style={{ width: `${(invoice.paidAmount / invoice.totalAmount) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{Math.round((invoice.paidAmount / invoice.totalAmount) * 100)}% terbayar</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="h-3 w-3 mr-1.5 text-orange-500" />
                              {mockBranches.find(b => b.id === invoice.branch)?.name || invoice.branch}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-blue-600"
                              onClick={() => handleShowInvoiceDetail(invoice)}
                            >
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                            Tidak ada faktur yang memerlukan perhatian.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filterInvoices(filteredInvoices, invoicesFilter).length > 0 && (
                  <div className="p-4 border-t border-orange-100">
                    <Pagination 
                      currentPage={invoicesPage}
                      totalItems={filterInvoices(filteredInvoices, invoicesFilter).length}
                      onPageChange={setInvoicesPage}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab Content */}
          <TabsContent value="inventory" className="space-y-4">
            {/* Inventory Value Summary Card */}
            <Card className="border-orange-100 overflow-hidden neo-shadow">
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold text-orange-800 flex items-center">
                    <FaShoppingCart className="mr-2 text-orange-500 h-4 w-4" />
                    Nilai Inventory
                  </CardTitle>
                  <Tabs value={activeInventoryTab} onValueChange={setActiveInventoryTab} className="w-auto">
                    <TabsList className="bg-orange-50 p-1 border border-orange-100 h-8">
                      <TabsTrigger
                        value="summary"
                        className="text-xs px-3 h-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                      >
                        Ringkasan
                      </TabsTrigger>
                      <TabsTrigger
                        value="categories"
                        className="text-xs px-3 h-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                      >
                        Kategori
                      </TabsTrigger>
                      <TabsTrigger
                        value="products"
                        className="text-xs px-3 h-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                      >
                        Produk Bernilai Tinggi
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {activeInventoryTab === "summary" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <Card className="bg-orange-50 border-orange-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Total Nilai Inventory</span>
                            <span className="text-xl font-bold text-gray-900">{formatCurrency(activeInventoryData.totalValue)}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 border-orange-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Total Item</span>
                            <span className="text-xl font-bold text-gray-900">{activeInventoryData.totalItems}</span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 border-orange-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Stok Menipis</span>
                            <div className="flex items-center">
                              <span className="text-xl font-bold text-amber-600">{activeInventoryData.lowStock}</span>
                              <Badge className="ml-2 bg-amber-100 text-amber-800">Perlu Tindakan</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 border-orange-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Mendekati Kadaluarsa</span>
                            <div className="flex items-center">
                              <span className="text-xl font-bold text-red-600">{activeInventoryData.expiringSoon}</span>
                              <Badge className="ml-2 bg-red-100 text-red-800">Perlu Perhatian</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Tren Nilai Inventory</h3>
                      <div className="h-[220px] p-2">
                        <SafeChart
                          id="inventory-trend-chart"
                          title="Tren Nilai Inventory"
                          subtitle="6 bulan terakhir"
                          chartType="line"
                          hideHeader={true}
                          chartHeight={220}
                          data={{
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                            datasets: [
                              {
                                label: 'Nilai Inventory',
                                data: [2800000000, 2950000000, 3100000000, 3000000000, 3150000000, 3250000000],
                                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                borderColor: 'rgb(249, 115, 22)',
                                borderWidth: 2,
                                tension: 0.3,
                                fill: true,
                                pointRadius: 4,
                                pointBackgroundColor: 'white',
                                pointBorderColor: 'rgb(249, 115, 22)',
                                pointBorderWidth: 2,
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              x: {
                                grid: {
                                  display: false,
                                  drawBorder: false,
                                },
                                ticks: {
                                  font: {
                                    size: 10,
                                  },
                                  color: '#6b7280',
                                },
                              },
                              y: {
                                grid: {
                                  color: 'rgba(243, 244, 246, 1)', // gray-100
                                  drawBorder: false,
                                },
                                ticks: {
                                  font: {
                                    size: 10,
                                  },
                                  color: '#6b7280',
                                  callback: function(value: number) {
                                    // Format nilai dalam milyar dengan 1 desimal
                                    return (Number(value) / 1000000000).toFixed(1) + ' M';
                                  }
                                },
                                beginAtZero: false,
                              }
                            },
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                titleColor: '#f97316',
                                bodyColor: '#374151',
                                borderColor: 'rgba(249, 115, 22, 0.3)',
                                borderWidth: 1,
                                padding: 10,
                                boxPadding: 4,
                                usePointStyle: true,
                                callbacks: {
                                  label: function(context: {label?: string; raw: number; parsed: number; formattedValue: string; dataIndex: number}) {
                                    return new Intl.NumberFormat('id-ID', {
                                      style: 'currency',
                                      currency: 'IDR',
                                      minimumFractionDigits: 0
                                    }).format(context.raw as number);
                                  }
                                }
                              }
                            },
                            interaction: {
                              intersect: false,
                              mode: 'index'
                            },
                            elements: {
                              line: {
                                borderWidth: 2
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start mt-4 p-3 bg-orange-50 rounded-lg text-sm">
                      <FaExclamationTriangle className="text-orange-500 h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-gray-700">
                        <p>Nilai inventory meningkat 3.2% dari bulan lalu. Top kategori adalah Obat Resep (44.6%) dan OTC (26.2%).</p>
                      </div>
                    </div>
                  </>
                )}

                {activeInventoryTab === "categories" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Nilai Inventory per Kategori</h3>
                        <div className="space-y-3">
                          {activeInventoryData.topCategories.map((category) => (
                            <div key={category.name} className="flex flex-col bg-white rounded-lg p-4 border border-orange-100 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full mr-2 ${
                                    category.name === "Obat Resep" ? 'bg-emerald-500' :
                                    category.name === "OTC" ? 'bg-yellow-500' :
                                    category.name === "Vitamin & Suplemen" ? 'bg-orange-500' :
                                    category.name === "Alat Kesehatan" ? 'bg-amber-500' :
                                    'bg-red-500'
                                  }`}></div>
                                  <span className="text-sm font-semibold text-gray-800">{category.name}</span>
                                </div>
                                <span className="text-base font-bold text-gray-900">{formatCurrency(category.value)}</span>
                              </div>
                              <div className="relative pt-1">
                                <div className="overflow-hidden h-2.5 text-xs flex rounded bg-orange-100">
                                  <div
                                    style={{ width: `${category.percentage}%` }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded ${
                                      category.name === "Obat Resep" ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                      category.name === "OTC" ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                      category.name === "Vitamin & Suplemen" ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                                      category.name === "Alat Kesehatan" ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                      'bg-gradient-to-r from-red-500 to-red-400'
                                    }`}
                                  ></div>
                                </div>
                                <div className="flex justify-end mt-1">
                                  <span className="text-xs font-medium text-gray-600">
                                    {category.percentage}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative h-[220px] flex items-center justify-center">
                        <SafeChart
                          id="inventory-category-chart"
                          title="Distribusi Nilai Inventory"
                          subtitle="Berdasarkan kategori"
                          chartType="doughnut"
                          hideHeader={true}
                          chartHeight={220}
                          data={{
                            labels: activeInventoryData.topCategories.map(c => c.name),
                            datasets: [
                              {
                                data: activeInventoryData.topCategories.map(c => c.percentage),
                                backgroundColor: [
                                  '#f97316', // orange-500
                                  '#fb923c', // orange-400
                                  '#f59e0b', // amber-500
                                  '#fbbf24', // amber-400
                                  '#fdba74', // orange-300
                                ],
                                borderColor: '#ffffff',
                                borderWidth: 2,
                                hoverOffset: 15,
                                spacing: 2,
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            cutout: '65%',
                            plugins: {
                              legend: {
                                display: true,
                                position: 'right',
                                labels: {
                                  font: {
                                    size: 10,
                                  },
                                  color: '#4b5563',
                                  usePointStyle: true,
                                  padding: 15,
                                  generateLabels: function(chart: any) {
                                    const data = chart.data;
                                    if (data.labels.length && data.datasets.length) {
                                      return data.labels.map((label: string, i: number) => {
                                        const value = data.datasets[0].data[i];
                                        const backgroundColor = data.datasets[0].backgroundColor[i];
                                        return {
                                          text: `${label}: ${value}%`,
                                          fillStyle: backgroundColor,
                                          fontColor: '#4b5563',
                                          lineWidth: 0,
                                          strokeStyle: '#fff',
                                          pointStyle: 'circle',
                                          index: i
                                        };
                                      });
                                    }
                                    return [];
                                  }
                                }
                              },
                              tooltip: {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                titleColor: '#f97316',
                                bodyColor: '#374151',
                                borderColor: 'rgba(249, 115, 22, 0.3)',
                                borderWidth: 1,
                                padding: 10,
                                boxPadding: 4,
                                usePointStyle: true,
                                callbacks: {
                                  label: function(context: {label?: string; raw: number; parsed: number; formattedValue: string; dataIndex: number}) {
                                    const label = context.label || '';
                                    const value = context.raw as number;
                                    const formattedValue = formatCurrency(activeInventoryData.topCategories[context.dataIndex].value);
                                    return `${label}: ${value}% (${formattedValue})`;
                                  }
                                }
                              }
                            },
                            animation: {
                              animateScale: true,
                              animateRotate: true
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Total Nilai Inventory:</span>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(activeInventoryData.totalValue)}</span>
                      </div>
                    </div>
                  </>
                )}

                {activeInventoryTab === "products" && (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-gray-700">Produk dengan Nilai Inventory Tertinggi</h3>
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="Cari produk..."
                            className="w-60 text-sm border-orange-200 focus:ring-orange-500 focus:border-orange-500 h-8"
                            value={inventoryFilter}
                            onChange={(e) => setInventoryFilter(e.target.value)}
                          />
                          <Button variant="outline" size="sm" className="h-8 border-orange-200 text-orange-700">
                            <FaFilter className="mr-1.5 h-3 w-3" />
                            Filter
                          </Button>
                        </div>
                      </div>
                      <div className="overflow-x-auto mt-3 rounded-lg border border-orange-100">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                            <tr className="text-xs text-gray-700">
                              <th className="py-2.5 px-4 text-left font-medium">
                                <div className="flex items-center cursor-pointer" onClick={() => handleSortChange('name', 'inventory')}>
                                  Nama Produk
                                  {inventorySortField === 'name' ? (
                                    inventorySortDirection === 'asc' ? <FaSortUp className="ml-1.5 h-3.5 w-3.5 text-amber-500" /> : <FaSortDown className="ml-1.5 h-3.5 w-3.5 text-amber-500" />
                                  ) : <FaSort className="ml-1.5 h-3.5 w-3.5 text-gray-400" />}
                                </div>
                              </th>
                              <th className="py-2.5 px-4 text-left font-medium">
                                <div className="flex items-center cursor-pointer" onClick={() => handleSortChange('category', 'inventory')}>
                                  Kategori
                                  {inventorySortField === 'category' ? (
                                    inventorySortDirection === 'asc' ? <FaSortUp className="ml-1.5 h-3.5 w-3.5 text-amber-500" /> : <FaSortDown className="ml-1.5 h-3.5 w-3.5 text-amber-500" />
                                  ) : <FaSort className="ml-1.5 h-3.5 w-3.5 text-gray-400" />}
                                </div>
                              </th>
                              <th className="py-2.5 px-4 text-center font-medium">
                                <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSortChange('stock', 'inventory')}>
                                  Stok
                                  {inventorySortField === 'stock' ? (
                                    inventorySortDirection === 'asc' ? <FaSortUp className="ml-1.5 h-3.5 w-3.5 text-amber-500" /> : <FaSortDown className="ml-1.5 h-3.5 w-3.5 text-amber-500" />
                                  ) : <FaSort className="ml-1.5 h-3.5 w-3.5 text-gray-400" />}
                                </div>
                              </th>
                              <th className="py-2.5 px-4 text-right font-medium">
                                <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('unitPrice', 'inventory')}>
                                  Harga Satuan
                                  {inventorySortField === 'unitPrice' ? (
                                    inventorySortDirection === 'asc' ? <FaSortUp className="ml-1.5 h-3.5 w-3.5 text-amber-500" /> : <FaSortDown className="ml-1.5 h-3.5 w-3.5 text-amber-500" />
                                  ) : <FaSort className="ml-1.5 h-3.5 w-3.5 text-gray-400" />}
                                </div>
                              </th>
                              <th className="py-2.5 px-4 text-right font-medium">
                                <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortChange('totalValue', 'inventory')}>
                                  Nilai Total
                                  {inventorySortField === 'totalValue' ? (
                                    inventorySortDirection === 'asc' ? <FaSortUp className="ml-1.5 h-3.5 w-3.5 text-amber-500" /> : <FaSortDown className="ml-1.5 h-3.5 w-3.5 text-amber-500" />
                                  ) : <FaSort className="ml-1.5 h-3.5 w-3.5 text-gray-400" />}
                                </div>
                              </th>
                              <th className="py-2.5 px-4 text-center font-medium">Tindakan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filterInventoryProducts(sortData(filteredTopProducts, inventorySortField, inventorySortDirection), inventoryFilter).length > 0 ? filterInventoryProducts(sortData(filteredTopProducts, inventorySortField, inventorySortDirection), inventoryFilter)
                              .slice((inventoryProductsPage - 1) * itemsPerPage, inventoryProductsPage * itemsPerPage)
                              .map((product) => (
                              <tr key={product.id} className={`text-sm border-b border-gray-100 ${inventoryProductsPage % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'} hover:bg-orange-50`}>
                                <td className="py-3 px-4 text-gray-800">
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-xs text-gray-500">SKU: {product.id}</div>
                                </td>
                                <td className="py-3 px-4 text-gray-800">
                                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                                    {product.category}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className={`font-medium ${product.stock < 50 ? 'text-red-600' : 'text-gray-800'}`}>
                                    {product.stock}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-medium text-gray-800">
                                  {formatCurrency(product.unitPrice)}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-orange-800">
                                  {formatCurrency(product.totalValue)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex justify-center space-x-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                                      <FaEye className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => router.push(`/inventory/products/${product.id}`)}
                                      className="h-8 w-8 p-0 text-orange-600"
                                    >
                                      <FaArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                  Tidak ada produk yang ditemukan.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {filterInventoryProducts(sortData(filteredTopProducts, inventorySortField, inventorySortDirection), inventoryFilter).length > 0 && (
                        <div className="mt-4">
                          <Pagination 
                            currentPage={inventoryProductsPage}
                            totalItems={filterInventoryProducts(sortData(filteredTopProducts, inventorySortField, inventorySortDirection), inventoryFilter).length}
                            onPageChange={setInventoryProductsPage}
                            itemsPerPage={itemsPerPage}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-start mt-4 p-3 bg-orange-50 rounded-lg text-sm">
                      <FaExclamationTriangle className="text-orange-500 h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-gray-700">
                        <p>Produk bernilai tinggi memerlukan pengelolaan inventory yang lebih ketat. Pertimbangkan untuk melakukan audit regular dan menyesuaikan level re-order.</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Management Tab Content */}
          <TabsContent value="performance" className="space-y-4">
            {/* Bank Accounts Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {mockBankAccounts.map(account => (
                <Card key={account.id} className="border-orange-100 overflow-hidden neo-shadow relative">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full opacity-20 transform translate-x-12 -translate-y-12"></div>
                  <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-100 rounded-full opacity-30 transform -translate-x-14 translate-y-14"></div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <FaUniversity className="h-5 w-5 text-orange-500 mr-2" />
                          <h3 className="font-medium text-gray-800">{account.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{account.accountNumber}</p>
                      </div>
                      <Badge className={`${account.reconciliationStatus === 'reconciled' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {account.reconciliationStatus === 'reconciled' ? 'Direkonsiliasi' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Saldo Saat Ini</span>
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(account.balance)}</span>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Rekon. Terakhir: {account.lastReconciled}</span>
                        <Button variant="link" size="sm" className="text-orange-600 p-0 h-auto">
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Cash Flow Forecast */}
            <Card className="border-orange-100 overflow-hidden neo-shadow">
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold text-orange-800 flex items-center">
                    <FaChartLine className="mr-2 text-orange-500 h-4 w-4" />
                    Perkiraan Arus Kas (7 Hari ke Depan)
                  </CardTitle>
                  <Select defaultValue="7days">
                    <SelectTrigger className="w-[140px] text-sm border-orange-200 h-8">
                      <SelectValue placeholder="Pilih Periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Hari</SelectItem>
                      <SelectItem value="14days">14 Hari</SelectItem>
                      <SelectItem value="30days">30 Hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[300px]">
                  {/* Cash Flow Chart would go here - using a placeholder for now */}
                  <SafeChart
                    id="cashflow-chart"
                    title="Forecast Arus Kas 7 Hari"
                    subtitle="Proyeksi inflow dan outflow"
                    chartType="bar"
                    data={{
                      labels: Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
                      }),
                      datasets: [
                        {
                          label: 'Inflow',
                          data: [4500000, 2100000, 3800000, 1200000, 900000, 2500000, 1800000],
                          backgroundColor: 'rgba(34, 197, 94, 0.6)',
                          borderColor: 'rgb(34, 197, 94)',
                          borderWidth: 1,
                        },
                        {
                          label: 'Outflow',
                          data: [2200000, 1800000, 4600000, 850000, 1200000, 950000, 1100000],
                          backgroundColor: 'rgba(249, 115, 22, 0.6)',
                          borderColor: 'rgb(249, 115, 22)',
                          borderWidth: 1,
                        }
                      ]
                    }}
                  />
                </div>
                <div className="mt-4 p-4 bg-orange-50 rounded-lg grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Masuk</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(mockCashFlowForecast.reduce((sum, day) => sum + day.inflow, 0))}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Keluar</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(mockCashFlowForecast.reduce((sum, day) => sum + day.outflow, 0))}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Perkiraan Net</p>
                    <p className={`text-lg font-bold ${
                      mockCashFlowForecast.reduce((sum, day) => sum + day.inflow - day.outflow, 0) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(mockCashFlowForecast.reduce((sum, day) => sum + day.inflow - day.outflow, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Real-Time Cash Position */}
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full opacity-20 transform translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-100 rounded-full opacity-30 transform -translate-x-14 translate-y-14"></div>
              
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <CardTitle className="text-base font-bold text-orange-800 flex items-center">
                  <FaWallet className="mr-2 text-orange-500 h-4 w-4" />
                  Posisi Kas Real-time
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Kas di Bank:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(mockBankAccounts.reduce((sum, account) => sum + account.balance, 0))}</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kas di Seluruh Cabang:</span>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(mockBranches.slice(1).reduce((sum, branch) => sum + branch.cashPosition, 0))}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 border border-orange-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="font-medium text-gray-800">Total Posisi Kas:</div>
                    </div>
                    <span className="font-bold text-xl text-orange-800">{formatCurrency(
                      mockBankAccounts.reduce((sum, account) => sum + account.balance, 0) +
                      mockBranches.slice(1).reduce((sum, branch) => sum + branch.cashPosition, 0)
                    )}</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <FaSyncAlt className="h-3 w-3 mr-1 text-orange-500 animate-spin" />
                    Terakhir diperbarui: 27 Mar 2025, 22:25
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showInvoiceDetail && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Decorative Header with orange/amber gradient */}
            <div className="relative h-14 bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-between px-6">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-4 left-8 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
                <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
              </div>
              <div className="relative flex items-center">
                <FaFileInvoiceDollar className="text-white h-5 w-5 mr-2" />
                <h2 className="text-base font-semibold text-white">Detail Faktur #{selectedInvoice.id}</h2>
              </div>
              <div className="relative flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:bg-gray-200" 
                  onClick={() => handleCloseInvoiceDetail()}
                >
                  Tutup
                </Button>
              </div>
            </div>

            {/* Content Container with scrollable area */}
            <div className="overflow-y-auto max-h-[calc(90vh-3.5rem)]">
              <div className="grid grid-cols-12 gap-4 p-5">
                {/* Left Panel */}
                <div className="col-span-12 md:col-span-7 space-y-4">
                  {/* Invoice Overview Section */}
                  <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Informasi Faktur</h3>
                        <p className="text-sm text-gray-500">Detail dan status faktur</p>
                      </div>
                      <Badge 
                        className={
                          selectedInvoice.status === 'partial' 
                            ? 'bg-blue-100 text-blue-800' 
                            : selectedInvoice.status === 'overdue' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {selectedInvoice.status === 'partial' ? 'Terbayar Sebagian' : 
                         selectedInvoice.status === 'overdue' ? 'Jatuh Tempo' : 'Menunggu'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Supplier</div>
                        <div className="font-medium">{selectedInvoice.supplier}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Cabang</div>
                        <div className="flex items-center font-medium">
                          <FaMapMarkerAlt className="h-3 w-3 mr-1.5 text-orange-500" />
                          {mockBranches.find(b => b.id === selectedInvoice.branch)?.name || selectedInvoice.branch}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Tanggal Faktur</div>
                        <div className="font-medium">{selectedInvoice.date}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Jatuh Tempo</div>
                        <div className="font-medium">{selectedInvoice.dueDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">No. Referensi</div>
                        <div className="font-medium">{selectedInvoice.referenceNumber || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">PO Terkait</div>
                        <div className="font-medium">{selectedInvoice.purchaseOrder || '-'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-orange-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">Progress Pembayaran</div>
                        <div className="text-sm font-medium">
                          {Math.round((selectedInvoice.paidAmount / selectedInvoice.totalAmount) * 100)}% selesai
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500" 
                          style={{ width: `${(selectedInvoice.paidAmount / selectedInvoice.totalAmount) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Invoice Items Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Item Faktur</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 text-sm text-gray-500">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium">Deskripsi</th>
                            <th className="py-3 px-4 text-center font-medium">Jumlah</th>
                            <th className="py-3 px-4 text-right font-medium">Harga Satuan</th>
                            <th className="py-3 px-4 text-right font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {selectedInvoice.items?.map((item: any, index: number) => (
                            <tr key={index} className="text-sm">
                              <td className="py-3 px-4 text-gray-900">{item.description}</td>
                              <td className="py-3 px-4 text-center text-gray-900">{item.quantity}x</td>
                              <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(item.unitPrice)}</td>
                              <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr className="text-sm">
                            <td colSpan={3} className="py-3 px-4 text-right font-medium text-gray-500">Subtotal</td>
                            <td className="py-3 px-4 text-right font-medium text-gray-900">{formatCurrency(selectedInvoice.totalAmount)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel */}
                <div className="col-span-12 md:col-span-5 space-y-6">
                  {/* Payment Summary Section */}
                  <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-100">
                    <h3 className="font-medium text-gray-900 mb-4">Ringkasan Pembayaran</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">Total Faktur</div>
                        <div className="font-medium text-gray-900">{formatCurrency(selectedInvoice.totalAmount)}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">Total Dibayar</div>
                        <div className="font-medium text-green-600">{formatCurrency(selectedInvoice.paidAmount)}</div>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900">Sisa Pembayaran</div>
                        <div className="font-bold text-orange-600">{formatCurrency(selectedInvoice.remainingAmount)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        as={Link}
                        href="/finance/ledger"
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                        onClick={() => {
                          handleCloseInvoiceDetail();
                          router.push('/finance/ledger');
                        }}
                      >
                        <FaArrowRight className="mr-2 h-4 w-4" /> Lihat Buku Besar
                      </Button>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                      onClick={() => {
                        handleCloseInvoiceDetail();
                        router.push('/finance/invoices');
                      }}
                    >
                      <FaMoneyBillWave className="h-4 w-4 mr-2" />
                      Catat Pembayaran
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => {
                        // Simulate printing - would implement actual print functionality here
                        alert(`Mencetak Faktur: ${selectedInvoice.id}`);
                      }}
                    >
                      <FaPrint className="h-4 w-4 mr-2" />
                      Cetak Faktur
                    </Button>
                  </div>
                  
                  {/* Notes Section */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Catatan</h3>
                    <textarea 
                      className="w-full h-24 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tambahkan catatan terkait faktur ini..."
                      defaultValue={selectedInvoice.notes || ""}
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <Button variant="ghost" size="sm" className="text-xs text-orange-600 hover:bg-orange-50">
                        Simpan Catatan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Terakhir diperbarui: <span className="font-medium">{selectedInvoice.lastUpdated || selectedInvoice.date}</span>
                </div>
                <Button variant="ghost" className="text-gray-600 hover:bg-gray-200" onClick={() => handleCloseInvoiceDetail()}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Action Menu */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
        {/* Main toggle button */}
        <Button
          onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
          className={`h-14 w-14 rounded-full relative shadow-lg hover:shadow-xl transition-all duration-300 p-0
            ${isFloatingMenuOpen 
              ? "bg-gradient-to-r from-amber-500 to-orange-600 rotate-45" 
              : "bg-gradient-to-r from-orange-500 to-amber-500"}`}
        >
          {/* Decorative circles with blur effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-orange-800 opacity-20 blur-sm"></div>
          </div>
          
          <FaPlus className="h-6 w-6 text-white transition-transform duration-300" />
        </Button>
        
        {/* Menu items */}
        <div className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ${isFloatingMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          {/* Add Income Button */}
          <div className="group relative">
            <Button
              onClick={() => router.push('/finance/income/new')}
              className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-green-500 p-0 relative overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white opacity-20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-emerald-800 opacity-20 blur-sm"></div>
              </div>
              <FaArrowUp className="h-5 w-5 text-white" />
            </Button>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg px-3 py-1 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
              Tambah Pemasukan
            </div>
          </div>
          
          {/* Add Expense Button */}
          <div className="group relative">
            <Button
              onClick={() => router.push('/finance/expense/new')}
              className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-rose-500 to-red-500 p-0 relative overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white opacity-20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-rose-800 opacity-20 blur-sm"></div>
              </div>
              <FaArrowDown className="h-5 w-5 text-white" />
            </Button>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-lg px-3 py-1 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
              Tambah Pengeluaran
            </div>
          </div>
          
          {/* Transfer Button */}
          <div className="group relative">
            <Button
              onClick={() => router.push('/finance/transfer/new')}
              className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 p-0 relative overflow-hidden hover:shadow-xl transition-all duration-200"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white opacity-20"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 rounded-full bg-blue-800 opacity-20 blur-sm"></div>
              </div>
              <FaExchangeAlt className="h-5 w-5 text-white" />
            </Button>
            <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg px-3 py-1 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
              Transfer Baru
            </div>
          </div>
        </div>
      </div>
    </FinanceLayout>
  );
}

export default FinanceDashboardPage;
