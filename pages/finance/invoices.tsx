import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FinanceLayout from "@/components/layouts/finance-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ExportDataDropdown from "@/components/shared/export-data-dropdown";
import ImportDataDialog from "@/components/shared/import-data-dialog";
import {
  FaFileInvoiceDollar,
  FaEye,
  FaSearch,
  FaPlus,
  FaDownload,
  FaCreditCard,
  FaPrint,
  FaBoxOpen,
  FaFilter,
  FaCalendarAlt,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaDollarSign,
  FaHistory,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaDolly,
  FaClipboardList,
  FaFileUpload,
  FaSortUp,
  FaSortDown,
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
  FaCheck
} from "react-icons/fa";
import { Label } from "@/components/ui/label";

// Data dummy untuk tagihan dan faktur
const mockInvoices = [
  {
    id: "INV-2025-001",
    supplier: "PT. Pharma Utama",
    date: "15 Mar 2025",
    dueDate: "30 Mar 2025",
    amount: 7500000,
    status: "pending",
    type: "supplier",
    paymentStatus: "partial",
    totalPaid: 3500000,
    remainingAmount: 4000000,
    paymentHistory: [
      { 
        id: "PAY-001", 
        date: "20 Mar 2025", 
        amount: 2000000, 
        method: "transfer", 
        receivedBy: "Ahmad Riyadi",
        reference: "TRX-87654321" 
      },
      { 
        id: "PAY-002", 
        date: "25 Mar 2025", 
        amount: 1500000, 
        method: "cash", 
        receivedBy: "Budi Santoso",
        reference: "CASH-98765" 
      }
    ],
    purchaseOrder: "PO-2025-001",
    items: [
      { id: 1, product: "Paracetamol 500mg", quantity: 1000, price: 2500, total: 2500000, received: 1000 },
      { id: 2, product: "Amoxicillin 500mg", quantity: 500, price: 5000, total: 2500000, received: 500 },
      { id: 3, product: "Vitamin C 1000mg", quantity: 500, price: 5000, total: 2500000, received: 500 }
    ],
    inventoryStatus: "complete",
    inventoryReceipts: [
      {
        id: "GRN-001",
        receiptNumber: "RCV-2025-001",
        date: "18 Mar 2025",
        receivedBy: "Dian Purnama",
        notes: "Semua barang diterima dalam kondisi baik"
      }
    ]
  },
  {
    id: "INV-2025-002",
    supplier: "CV Medical Supplies",
    date: "17 Mar 2025",
    dueDate: "31 Mar 2025",
    amount: 12000000,
    status: "pending",
    type: "supplier",
    paymentStatus: "unpaid",
    totalPaid: 0,
    remainingAmount: 12000000,
    paymentHistory: [],
    purchaseOrder: "PO-2025-002",
    items: [
      { id: 1, product: "Stetoskop Premium", quantity: 10, price: 500000, total: 5000000, received: 5 },
      { id: 2, product: "Tensimeter Digital", quantity: 20, price: 350000, total: 7000000, received: 10 }
    ],
    inventoryStatus: "partial",
    inventoryReceipts: [
      {
        id: "GRN-002",
        receiptNumber: "RCV-2025-002",
        date: "22 Mar 2025",
        receivedBy: "Eko Prasetyo",
        notes: "Pengiriman pertama sebagian barang"
      }
    ]
  },
  {
    id: "INV-2025-003",
    supplier: "Kimia Farma",
    date: "10 Mar 2025",
    dueDate: "24 Mar 2025",
    amount: 5000000,
    status: "received",
    type: "supplier",
    paymentStatus: "paid",
    totalPaid: 5000000,
    remainingAmount: 0,
    paymentHistory: [
      { 
        id: "PAY-003", 
        date: "15 Mar 2025", 
        amount: 5000000, 
        method: "transfer", 
        receivedBy: "Fina Handayani",
        reference: "TRX-12345" 
      }
    ],
    purchaseOrder: "PO-2025-003",
    items: [
      { id: 1, product: "Salep Antibiotik", quantity: 100, price: 15000, total: 1500000, received: 0 },
      { id: 2, product: "Alkohol 70%", quantity: 50, price: 25000, total: 1250000, received: 0 },
      { id: 3, product: "Perban Steril", quantity: 150, price: 15000, total: 2250000, received: 0 }
    ],
    inventoryStatus: "pending",
    inventoryReceipts: []
  },
  {
    id: "INV-2025-004",
    supplier: "RSUD Citra Medika",
    date: "10 Mar 2025",
    dueDate: "25 Mar 2025",
    amount: 12500000,
    status: "delivered",
    type: "customer",
    paymentStatus: "paid",
    totalPaid: 12500000,
    remainingAmount: 0,
    paymentHistory: [
      { 
        id: 'PAY-002', 
        date: '20 Mar 2025', 
        amount: 12500000, 
        method: 'Transfer Bank', 
        reference: 'TRF/2025/002',
        receivedBy: 'Ahmad Riyadi' 
      }
    ],
    purchaseOrder: null,
    items: [
      { id: 1, product: "Paracetamol 500mg", quantity: 2000, price: 3000, total: 6000000 },
      { id: 2, product: "Amoxicillin 500mg", quantity: 1000, price: 6500, total: 6500000 }
    ],
    inventoryStatus: "complete",
    inventoryReceipts: []
  },
  {
    id: "INV-2025-005",
    supplier: "Klinik Sehat Sentosa",
    date: "12 Mar 2025",
    dueDate: "27 Mar 2025",
    amount: 8750000,
    status: "delivered",
    type: "customer",
    paymentStatus: "partial",
    totalPaid: 5000000,
    remainingAmount: 3750000,
    paymentHistory: [
      { 
        id: 'PAY-003', 
        date: '18 Mar 2025', 
        amount: 5000000, 
        method: 'Cash', 
        reference: 'CSH/2025/001',
        receivedBy: 'Dian Purnama' 
      }
    ],
    purchaseOrder: null,
    items: [
      { id: 1, product: "Vitamin C 1000mg", quantity: 1000, price: 5500, total: 5500000 },
      { id: 2, product: "Vitamin B Complex", quantity: 650, price: 5000, total: 3250000 }
    ],
    inventoryStatus: "complete",
    inventoryReceipts: []
  },
];

// Definisikan tipe untuk payment, receipt, dan item
interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  receivedBy: string;
  reference: string;
}

interface InventoryReceipt {
  id: string;
  receiptNumber: string;
  date: string;
  receivedBy: string;
  notes: string;
}

interface InvoiceItem {
  id: number;
  product: string;
  quantity: number;
  price: number;
  total: number;
  received?: number;
}

interface Invoice {
  id: string;
  supplier: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  type: string;
  paymentStatus: string;
  totalPaid: number;
  remainingAmount: number;
  purchaseOrder: string | null;
  paymentHistory: PaymentHistory[];
  items: InvoiceItem[];
  inventoryStatus: string;
  inventoryReceipts: InventoryReceipt[];
}

// Helper function to determine invoice status label and color
const getInvoiceStatusInfo = (invoice: Invoice) => {
  if (invoice.paymentStatus === "paid") {
    return {
      label: "Sudah Dibayar",
      badge: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <FaCheckCircle className="mr-1 h-3 w-3" />
    };
  } else if (invoice.paymentStatus === "partial") {
    return {
      label: "Pembayaran Sebagian",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <FaHistory className="mr-1 h-3 w-3" />
    };
  } else {
    return {
      label: "Belum Dibayar",
      badge: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <FaTimesCircle className="mr-1 h-3 w-3" />
    };
  }
};

// Helper function to determine inventory status label and color
const getInventoryStatusInfo = (invoice: Invoice) => {
  if (invoice.inventoryStatus === "complete") {
    return {
      label: "Diterima Lengkap",
      badge: "bg-green-100 text-green-800 border-green-200",
      icon: <FaCheckCircle className="mr-1 h-3 w-3" />
    };
  } else if (invoice.inventoryStatus === "partial") {
    return {
      label: "Diterima Sebagian",
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <FaBoxOpen className="mr-1 h-3 w-3" />
    };
  } else {
    return {
      label: "Menunggu Penerimaan",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <FaClock className="mr-1 h-3 w-3" />
    };
  }
};

// Fungsi untuk format Rp currency
const formatCurrency = (amount: number) => {
  return `Rp${amount.toLocaleString('id-ID')}`;
};

const InvoicesPage: NextPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isFullPayment, setIsFullPayment] = useState(true);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  
  // Function to request sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorted items
  const getSortedItems = (items: Invoice[]) => {
    if (!sortConfig) return items;
    
    return [...items].sort((a, b) => {
      if (a[sortConfig.key as keyof Invoice] < b[sortConfig.key as keyof Invoice]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key as keyof Invoice] > b[sortConfig.key as keyof Invoice]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Fungsi untuk menghasilkan template data invoice
  const generateInvoiceTemplate = () => {
    return [
      {
        id: "INV-TEMPLATE-001",
        supplier: "Nama Supplier/Pelanggan",
        date: "2025-03-27", // Format YYYY-MM-DD
        dueDate: "2025-04-15", // Format YYYY-MM-DD
        amount: 5000000,
        status: "pending", // pending, received, delivered, canceled
        type: "supplier", // supplier atau customer
        paymentStatus: "unpaid", // unpaid, partial, paid
        totalPaid: 0,
        remainingAmount: 5000000,
        purchaseOrder: "PO-2025-001",
        items: [
          {
            id: 1,
            product: "Nama Produk 1",
            quantity: 10,
            price: 250000,
            total: 2500000
          },
          {
            id: 2,
            product: "Nama Produk 2",
            quantity: 5,
            price: 500000,
            total: 2500000
          }
        ]
      },
      {
        id: "INV-TEMPLATE-002",
        supplier: "Nama Supplier/Pelanggan Lain",
        date: "2025-03-26", // Format YYYY-MM-DD
        dueDate: "2025-04-10", // Format YYYY-MM-DD
        amount: 3000000,
        status: "pending", // pending, received, delivered, canceled
        type: "customer", // supplier atau customer
        paymentStatus: "unpaid", // unpaid, partial, paid
        totalPaid: 0,
        remainingAmount: 3000000,
        purchaseOrder: "",
        items: [
          {
            id: 1,
            product: "Nama Produk A",
            quantity: 20,
            price: 150000,
            total: 3000000
          }
        ]
      }
    ];
  };

  // Fungsi untuk menangani import data faktur
  const handleImportInvoices = (importedData: any[]) => {
    // Pada implementasi nyata, Anda akan menyimpan data ini ke database
    // Untuk contoh, kita hanya menampilkan alert
    console.log("Data faktur yang diimpor:", importedData);
    alert(`${importedData.length} data faktur berhasil diimpor!`);
  };

  // Menyiapkan data untuk export
  const prepareExportData = () => {
    return filteredInvoices.map(invoice => ({
      'No. Faktur': invoice.id,
      'Supplier/Pelanggan': invoice.supplier,
      'Tanggal': invoice.date,
      'Jatuh Tempo': invoice.dueDate,
      'Total': invoice.amount,
      'Status Pembayaran': getInvoiceStatusInfo(invoice).label,
      'Tipe': invoice.type === 'supplier' ? 'Supplier' : 'Pelanggan',
      'Jumlah Dibayar': invoice.totalPaid,
      'Sisa Pembayaran': invoice.remainingAmount,
      'Nomor PO': invoice.purchaseOrder || '-',
      'Status Inventori': getInventoryStatusInfo(invoice).label
    }));
  };

  // Header untuk PDF export
  const pdfHeaders = [
    'No. Faktur', 'Supplier/Pelanggan', 'Tanggal', 'Jatuh Tempo', 'Total', 
    'Status Pembayaran', 'Tipe', 'Jumlah Dibayar', 'Sisa Pembayaran', 
    'Nomor PO', 'Status Inventori'
  ];

  // Mapping untuk PDF row data
  const pdfMappingInvoice = (item: any) => [
    item['No. Faktur'],
    item['Supplier/Pelanggan'],
    item['Tanggal'],
    item['Jatuh Tempo'],
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(item['Total']),
    item['Status Pembayaran'],
    item['Tipe'],
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(item['Jumlah Dibayar']),
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(item['Sisa Pembayaran']),
    item['Nomor PO'],
    item['Status Inventori']
  ];

  // Filter faktur berdasarkan pencarian, status, dan tipe
  const filteredInvoices = getSortedItems(mockInvoices)
    .filter(invoice => {
      // Filter pencarian
      const searchMatch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter tab
      let tabMatch = true;
      if (tabValue === "unpaid") {
        tabMatch = invoice.paymentStatus === "unpaid";
      } else if (tabValue === "paid") {
        tabMatch = invoice.paymentStatus === "paid";
      } else if (tabValue === "partial") {
        tabMatch = invoice.paymentStatus === "partial";
      }
      
      // Filter status
      let statusMatch = true;
      if (statusFilter !== "all") {
        statusMatch = invoice.paymentStatus === statusFilter;
      }
      
      // Filter tipe
      let typeMatch = true;
      if (typeFilter !== "all") {
        typeMatch = invoice.type === typeFilter;
      }
      
      return searchMatch && tabMatch && statusMatch && typeMatch;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Fungsi untuk menampilkan detail faktur
  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  // Fungsi untuk menampilkan modal pembayaran
  const handlePaymentModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.remainingAmount);
    setIsFullPayment(true);
    setIsPaymentModalOpen(true);
  };

  // Fungsi untuk menampilkan modal penerimaan barang
  const handleInventoryModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInventoryModalOpen(true);
  };

  useEffect(() => {
    // Set payment amount sesuai sisa tagihan ketika fullPayment diubah
    if (selectedInvoice) {
      if (isFullPayment) {
        setPaymentAmount(selectedInvoice.remainingAmount);
      }
    }
  }, [isFullPayment, selectedInvoice]);

  return (
    <FinanceLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Header with decorative element */}
          <div className="flex items-center">
            <div className="h-8 w-1.5 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full mr-3"></div>
            <h1 className="text-2xl font-bold text-gray-800">
              Faktur & Tagihan
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              onClick={() => router.push('/finance/invoices/create')}
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Buat Faktur Baru
            </Button>
            <ExportDataDropdown 
              data={prepareExportData()}
              filename="Daftar_Faktur_Invoice"
              pdfTitle="Daftar Faktur dan Invoice"
              pdfHeaders={pdfHeaders}
              pdfMapping={pdfMappingInvoice}
              buttonVariant="gradient"
              buttonSize="default"
              buttonClassName="bg-gradient-to-r from-orange-500 to-amber-500"
              align="end"
            />
            <ImportDataDialog 
              onImport={handleImportInvoices}
              generateTemplate={generateInvoiceTemplate}
              templateFilename="Template_Import_Faktur"
              templateHeaders={[
                "ID", "Supplier/Pelanggan", "Tanggal", "Jatuh Tempo", 
                "Total", "Status", "Tipe", "Status Pembayaran", 
                "Jumlah Dibayar", "Sisa Pembayaran", "Nomor PO"
              ]}
              title="Import Data Faktur"
              description="Upload file data faktur dan invoice sesuai format template"
              trigger={
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  <FaFileUpload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              }
            />
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              onClick={() => router.push('/finance/ledger')}
            >
              <FaClipboardList className="mr-2 h-4 w-4" />
              Buku Besar
            </Button>
          </div>
        </div>

        <Card className="border-orange-100 overflow-hidden neo-shadow relative">
          {/* Top decorative bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full opacity-20 transform translate-x-20 -translate-y-20"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-100 rounded-full opacity-30"></div>
          
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-6">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 mr-3 shadow-sm">
                <FaFileInvoiceDollar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-orange-800">Faktur & Tagihan</CardTitle>
                <CardDescription className="text-orange-600/70">Kelola faktur pembelian dan penjualan</CardDescription>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between gap-4 mt-4 relative z-10">
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-2/3">
                <div className="relative w-full">
                  <Input
                    className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    placeholder="Cari berdasarkan nomor faktur atau supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border-orange-200">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="paid">Sudah Dibayar</SelectItem>
                    <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                    <SelectItem value="partial">Pembayaran Sebagian</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] border-orange-200">
                    <SelectValue placeholder="Filter Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="supplier">Faktur Supplier</SelectItem>
                    <SelectItem value="customer">Faktur Pelanggan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <div className="px-6 -mt-1 border-b border-orange-100 overflow-x-auto">
            <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
              <TabsList className="bg-orange-50/70 border border-orange-100 p-1 w-full h-auto flex justify-between sm:justify-start">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 sm:flex-initial px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-sm"
                >
                  <span className="flex items-center">
                    <FaFileInvoiceDollar className="mr-1.5 h-4 w-4" />
                    Semua
                    <Badge className="ml-2 bg-orange-100 text-orange-700 hover:bg-orange-100">{filteredInvoices.filter(i => i.paymentStatus === "unpaid" || i.paymentStatus === "partial" || i.paymentStatus === "paid").length}</Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="unpaid" 
                  className="flex-1 sm:flex-initial px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-sm"
                >
                  <span className="flex items-center">
                    <FaExclamationTriangle className="mr-1.5 h-4 w-4" />
                    Belum Dibayar
                    <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100">{filteredInvoices.filter(i => i.paymentStatus === "unpaid").length}</Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="partial" 
                  className="flex-1 sm:flex-initial px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-sm"
                >
                  <span className="flex items-center">
                    <FaArrowDown className="mr-1.5 h-4 w-4" />
                    Sebagian
                    <Badge className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100">{filteredInvoices.filter(i => i.paymentStatus === "partial").length}</Badge>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="paid" 
                  className="flex-1 sm:flex-initial px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-sm"
                >
                  <span className="flex items-center">
                    <FaCheck className="mr-1.5 h-4 w-4" />
                    Sudah Dibayar
                    <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">{filteredInvoices.filter(i => i.paymentStatus === "paid").length}</Badge>
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <CardContent className="p-0 mt-0">
            <div className="rounded-md border-b border-gray-200">
              <Table>
                <TableHeader className="bg-orange-50">
                  <TableRow>
                    <TableHead 
                      className="text-orange-800 font-medium cursor-pointer hover:text-orange-600" 
                      onClick={() => requestSort('id')}
                    >
                      <div className="flex items-center">
                        <span>No. Faktur</span>
                        {sortConfig?.key === 'id' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-800 font-medium cursor-pointer hover:text-orange-600" 
                      onClick={() => requestSort('supplier')}
                    >
                      <div className="flex items-center">
                        <span>Supplier/Pelanggan</span>
                        {sortConfig?.key === 'supplier' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-800 font-medium cursor-pointer hover:text-orange-600" 
                      onClick={() => requestSort('date')}
                    >
                      <div className="flex items-center">
                        <span>Tanggal</span>
                        {sortConfig?.key === 'date' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-800 font-medium cursor-pointer hover:text-orange-600" 
                      onClick={() => requestSort('dueDate')}
                    >
                      <div className="flex items-center">
                        <span>Jatuh Tempo</span>
                        {sortConfig?.key === 'dueDate' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-800 font-medium cursor-pointer hover:text-orange-600" 
                      onClick={() => requestSort('paymentStatus')}
                    >
                      <div className="flex items-center">
                        <span>Status</span>
                        {sortConfig?.key === 'paymentStatus' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-800 font-medium cursor-pointer hover:text-orange-600" 
                      onClick={() => requestSort('type')}
                    >
                      <div className="flex items-center">
                        <span>Tipe</span>
                        {sortConfig?.key === 'type' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-800 font-medium text-right cursor-pointer hover:text-orange-600" 
                      onClick={() => requestSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                        <span>Jumlah</span>
                        {sortConfig?.key === 'amount' && (
                          <span className="ml-1">
                            {sortConfig.direction === 'ascending' ? <FaSortUp className="inline" /> : <FaSortDown className="inline" />}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-orange-800 font-medium text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Tidak ada faktur yang sesuai dengan kriteria pencarian.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="hover:bg-orange-50/50">
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.supplier}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>
                          <Badge className={getInvoiceStatusInfo(invoice).badge}>
                            {getInvoiceStatusInfo(invoice).icon}
                            {getInvoiceStatusInfo(invoice).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {invoice.type === "supplier" ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Supplier
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              Pelanggan
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(invoice.amount)}
                          {invoice.paymentStatus === "partial" && (
                            <div className="text-xs text-gray-500">
                              Dibayar: {formatCurrency(invoice.totalPaid)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetail(invoice)}
                              className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                            >
                              <FaEye className="h-4 w-4" />
                            </Button>
                            {(invoice.paymentStatus === "unpaid" || invoice.paymentStatus === "partial") && invoice.type === "supplier" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePaymentModal(invoice)}
                                className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                              >
                                <FaCreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                            >
                              <FaPrint className="h-4 w-4" />
                            </Button>
                            {invoice.type === "supplier" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleInventoryModal(invoice)}
                                className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                              >
                                <FaDolly className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="bg-white px-6 py-4 border-t border-orange-100">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
              <div className="text-sm text-gray-500">
                Menampilkan {filteredInvoices.length} dari {mockInvoices.length} faktur
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[130px] border-orange-200 focus:ring-orange-500">
                    <SelectValue placeholder="Tampilkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per halaman</SelectItem>
                    <SelectItem value="10">10 per halaman</SelectItem>
                    <SelectItem value="20">20 per halaman</SelectItem>
                    <SelectItem value="50">50 per halaman</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <FaArrowLeft className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaArrowLeft className="h-3 w-3" />
                  </Button>
                  
                  <span className="text-sm px-2">
                    Halaman <span className="font-medium">{currentPage}</span> dari{" "}
                    <span className="font-medium">
                      {Math.ceil(mockInvoices.length / itemsPerPage)}
                    </span>
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(mockInvoices.length / itemsPerPage)}
                  >
                    <FaArrowRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => setCurrentPage(Math.ceil(mockInvoices.length / itemsPerPage))}
                    disabled={currentPage === Math.ceil(mockInvoices.length / itemsPerPage)}
                  >
                    <FaArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Modal Detail Faktur */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto p-0 border-orange-200">
          {/* Top decorative gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-orange-200 rounded-full opacity-20 transform translate-x-20 -translate-y-20 z-0"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-200 rounded-full opacity-20 transform -translate-x-16 translate-y-16 z-0"></div>
          
          <div className="p-5 relative z-10">
            <DialogHeader className="mb-4 flex flex-row items-center">
              <div className="h-10 w-1.5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-3"></div>
              <div>
                <DialogTitle className="text-xl font-bold text-orange-800">Detail Faktur</DialogTitle>
                <DialogDescription className="text-orange-600">
                  Informasi lengkap tentang faktur dan status pembayaran
                </DialogDescription>
              </div>
            </DialogHeader>
            
            {selectedInvoice && (
              <div className="space-y-6">
                {/* Header Faktur - Card Landscape */}
                <div className="relative overflow-hidden rounded-xl shadow-md border border-orange-100 bg-white neo-shadow">
                  <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/10"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full opacity-30 transform translate-x-20 -translate-y-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-100 rounded-full opacity-30 transform -translate-x-10 translate-y-10"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Invoice Information */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white shadow-md">
                          <FaFileInvoiceDollar className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-gray-800">{selectedInvoice.id}</h3>
                          <div className="text-sm text-gray-500">{selectedInvoice.type === 'supplier' ? 'Faktur Pembelian' : 'Faktur Penjualan'}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <div>
                          <div className="flex items-center text-gray-600 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                              <FaBuilding className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Supplier/Pelanggan</p>
                              <p className="font-medium">{selectedInvoice.supplier}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-gray-600 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                              <FaCalendarAlt className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Tanggal Faktur</p>
                              <p className="font-medium">{selectedInvoice.date}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center text-gray-600 mb-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                              <FaCalendarAlt className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Jatuh Tempo</p>
                              <p className="font-medium">{selectedInvoice.dueDate}</p>
                            </div>
                          </div>
                          
                          {selectedInvoice.type === "supplier" && (
                            <div className="flex items-center text-gray-600">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                                <FaTruck className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Status Penerimaan</p>
                                <Badge className={getInventoryStatusInfo(selectedInvoice).badge}>
                                  {getInventoryStatusInfo(selectedInvoice).label}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedInvoice.purchaseOrder && (
                        <div className="flex items-center text-gray-600 mt-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 mr-3">
                            <FaClipboardList className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Pesanan Pembelian</p>
                            <p className="font-medium">{selectedInvoice.purchaseOrder}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Payment Information */}
                    <div className="lg:border-l lg:pl-6 lg:border-orange-100">
                      <div className="text-right mb-4">
                        <div className="mb-2 flex justify-end">
                          <Badge className={getInvoiceStatusInfo(selectedInvoice).badge + " px-3 py-1"}>
                            {getInvoiceStatusInfo(selectedInvoice).icon}
                            <span className="ml-1">{getInvoiceStatusInfo(selectedInvoice).label}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total Faktur</p>
                          <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedInvoice.amount)}</p>
                        </div>
                        
                        {selectedInvoice.paymentStatus !== "unpaid" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                              <p className="text-xs text-gray-500 mb-1">Sudah Dibayar</p>
                              <p className="font-bold text-green-600">{formatCurrency(selectedInvoice.totalPaid)}</p>
                            </div>
                            {selectedInvoice.paymentStatus === "partial" && (
                              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Sisa Tagihan</p>
                                <p className="font-bold text-orange-600">{formatCurrency(selectedInvoice.remainingAmount)}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Payment Progress Bar */}
                        {selectedInvoice.paymentStatus !== "unpaid" && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-500">Progres Pembayaran</span>
                              <span className="font-medium">{Math.round((selectedInvoice.totalPaid / selectedInvoice.amount) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
                              <div 
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                style={{ width: `${(selectedInvoice.totalPaid / selectedInvoice.amount) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 mt-4">
                          {selectedInvoice.paymentStatus !== "paid" && selectedInvoice.type === "supplier" && (
                            <Button 
                              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white justify-center"
                              onClick={() => {
                                setIsDetailModalOpen(false);
                                handlePaymentModal(selectedInvoice);
                              }}
                            >
                              <FaCreditCard className="mr-2 h-4 w-4" />
                              Bayar Faktur
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 justify-center"
                          >
                            <FaPrint className="mr-2 h-4 w-4" />
                            Cetak Faktur
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tabs for Items, Payment History, and Inventory Details */}
                <Tabs defaultValue="items" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-orange-50 border border-orange-100 p-1">
                    <TabsTrigger 
                      value="items" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                    >
                      Detail Item
                    </TabsTrigger>
                    <TabsTrigger 
                      value="payments" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                    >
                      Riwayat Pembayaran
                    </TabsTrigger>
                    {selectedInvoice.type === "supplier" && (
                      <TabsTrigger 
                        value="inventory" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                      >
                        Detail Penerimaan
                      </TabsTrigger>
                    )}
                  </TabsList>
                  
                  {/* Items Tab */}
                  <TabsContent value="items" className="mt-4">
                    <div className="bg-white rounded-lg border border-orange-100 shadow-sm overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                        <h4 className="font-medium text-orange-800 flex items-center">
                          <FaBoxOpen className="mr-2 text-orange-500" />
                          Detail Item Faktur
                        </h4>
                      </div>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-orange-50">
                            <TableRow>
                              <TableHead className="text-orange-900 w-6">#</TableHead>
                              <TableHead className="text-orange-900">Produk</TableHead>
                              <TableHead className="text-orange-900 text-right">Jumlah</TableHead>
                              <TableHead className="text-orange-900 text-right">Harga Satuan</TableHead>
                              <TableHead className="text-orange-900 text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedInvoice.items.map((item: InvoiceItem, index) => (
                              <TableRow key={item.id} className="hover:bg-orange-50/50">
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{item.product}</TableCell>
                                <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow className="bg-orange-50/70">
                              <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                              <TableCell className="text-right font-bold">{formatCurrency(selectedInvoice.amount)}</TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Payment History Tab */}
                  <TabsContent value="payments" className="mt-4">
                    <div className="bg-white rounded-lg border border-orange-100 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 border-b border-orange-100">
                        <h4 className="font-medium text-orange-800 flex items-center">
                          <FaHistory className="mr-2 text-orange-500" />
                          Riwayat Pembayaran
                        </h4>
                      </div>
                      
                      {selectedInvoice.paymentHistory && selectedInvoice.paymentHistory.length > 0 ? (
                        <div className="divide-y divide-orange-100">
                          {selectedInvoice.paymentHistory.map((payment: PaymentHistory) => (
                            <div key={payment.id} className="p-4 hover:bg-orange-50 transition-colors rounded-md">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-orange-700">{formatCurrency(payment.amount)}</span>
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                  {payment.date}
                                </Badge>
                              </div>
                              <div className="ml-13 pl-13 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Referensi:</span> {payment.reference}
                                </div>
                                <div>
                                  <span className="text-gray-500">Diterima oleh:</span> {payment.receivedBy}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-400 mb-4">
                            <FaExclamationTriangle className="h-8 w-8" />
                          </div>
                          <p className="text-gray-500 mb-1">Belum ada riwayat pembayaran</p>
                          <p className="text-sm text-gray-400">Faktur ini belum memiliki transaksi pembayaran.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Inventory Tab */}
                  {selectedInvoice.type === "supplier" && (
                    <TabsContent value="inventory" className="mt-4">
                      <div className="bg-white rounded-lg border border-orange-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 border-b border-orange-100">
                          <h4 className="font-medium text-orange-800 flex items-center">
                            <FaDolly className="mr-2 text-orange-500" />
                            Detail Penerimaan Barang
                          </h4>
                        </div>
                        
                        {selectedInvoice.inventoryReceipts && selectedInvoice.inventoryReceipts.length > 0 ? (
                          <div className="divide-y divide-orange-100">
                            {selectedInvoice.inventoryReceipts.map((receipt: InventoryReceipt) => (
                              <div key={receipt.id} className="p-4 hover:bg-orange-50 transition-colors rounded-md">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{receipt.receiptNumber}</span>
                                  <span className="text-sm text-gray-500">{receipt.date}</span>
                                </div>
                                <div className="ml-13 pl-13 grid grid-cols-1 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-500">Diterima oleh:</span> {receipt.receivedBy}
                                  </div>
                                  {receipt.notes && (
                                    <div>
                                      <span className="text-gray-500">Catatan:</span> {receipt.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-10 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-400 mb-4">
                              <FaExclamationTriangle className="h-8 w-8" />
                            </div>
                            <p className="text-gray-500 mb-1">Belum ada penerimaan barang</p>
                            <p className="text-sm text-gray-400">Barang untuk faktur ini belum diterima.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
                
                {/* Footer Actions */}
                <div className="flex justify-end space-x-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => setIsDetailModalOpen(false)}
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Pembayaran */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0 border-orange-200">
          {/* Top decorative gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-orange-200 rounded-full opacity-20 transform translate-x-20 -translate-y-20 z-0"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-200 rounded-full opacity-20 transform -translate-x-16 translate-y-16 z-0"></div>
          
          <div className="p-5 relative z-10">
            <DialogHeader className="mb-4 flex flex-row items-center">
              <div className="h-10 w-1.5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-3"></div>
              <div>
                <DialogTitle className="text-xl font-bold text-orange-800">Pembayaran Faktur</DialogTitle>
                <DialogDescription className="text-orange-600">
                  Masukkan informasi pembayaran untuk faktur {selectedInvoice?.id}
                </DialogDescription>
              </div>
            </DialogHeader>
            
            {selectedInvoice && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Invoice Information */}
                <div className="md:col-span-1 space-y-5">
                  <div className="relative overflow-hidden rounded-xl bg-white shadow-md border border-orange-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/10"></div>
                    
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-4 border-b border-orange-100 pb-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500/90 to-amber-500/90 text-white shadow-md mr-3">
                          <FaFileInvoiceDollar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{selectedInvoice.id}</p>
                          <p className="text-sm text-gray-500">{selectedInvoice.supplier}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {/* Payment Summary - Visual Representation */}
                      <div className="mb-5">
                        <p className="text-sm text-orange-600 font-medium mb-2">Status Pembayaran</p>
                        <div className="relative h-7 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                            style={{ width: `${(selectedInvoice.totalPaid / selectedInvoice.amount) * 100}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                            {Math.round((selectedInvoice.totalPaid / selectedInvoice.amount) * 100)}% Terbayar
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount Details */}
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-orange-100">
                          <p className="text-xs text-gray-500 mb-1">Total Faktur</p>
                          <p className="font-bold text-gray-800">{formatCurrency(selectedInvoice.amount)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-orange-100">
                          <p className="text-xs text-gray-500 mb-1">Terbayar</p>
                          <p className="font-bold text-green-600">{formatCurrency(selectedInvoice.totalPaid)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-orange-100">
                          <p className="text-xs text-gray-500 mb-1">Sisa</p>
                          <p className="font-bold text-orange-600">{formatCurrency(selectedInvoice.remainingAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Previous Payment History */}
                  {selectedInvoice.paymentHistory && selectedInvoice.paymentHistory.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100">
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2 border-b border-orange-100">
                        <h4 className="font-medium text-orange-800 flex items-center">
                          <FaHistory className="mr-2 text-orange-500" />
                          Riwayat Pembayaran
                        </h4>
                      </div>
                      
                      <div className="max-h-[180px] overflow-y-auto p-3 divide-y divide-orange-100">
                        {selectedInvoice.paymentHistory.map((payment: PaymentHistory) => (
                          <div key={payment.id} className="p-3 hover:bg-orange-50 transition-colors rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-orange-700">{formatCurrency(payment.amount)}</span>
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                {payment.date}
                              </Badge>
                            </div>
                            <div className="text-sm mt-2">
                              <div className="text-xs text-gray-500">Metode: <span className="text-gray-700 capitalize">{payment.method}</span></div>
                              <div className="text-xs text-gray-500">Referensi: <span className="text-gray-700">{payment.reference}</span></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Column - Payment Form */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-orange-100 h-full">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 border-b border-orange-100">
                      <h4 className="font-medium text-orange-800 flex items-center">
                        <FaCreditCard className="mr-2 text-orange-500" />
                        Form Pembayaran
                      </h4>
                    </div>
                    
                    <div className="p-5 space-y-5">
                      {/* Payment Type Toggle */}
                      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div>
                          <label htmlFor="payment-type" className="text-sm font-medium text-gray-700">
                            Tipe Pembayaran
                          </label>
                          <p className="text-xs text-gray-500">
                            {isFullPayment ? 'Bayar total sisa tagihan' : 'Bayar sebagian dari tagihan'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${!isFullPayment ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Sebagian</span>
                          <Switch
                            id="payment-type"
                            checked={isFullPayment}
                            onCheckedChange={setIsFullPayment}
                            className="data-[state=checked]:bg-orange-500"
                          />
                          <span className={`text-xs ${isFullPayment ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>Penuh</span>
                        </div>
                      </div>
                      
                      {/* Payment Amount */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium text-gray-700" htmlFor="payment-amount">
                            Jumlah Pembayaran
                          </label>
                          {!isFullPayment && (
                            <span className="text-xs text-orange-600">
                              Maks: {formatCurrency(selectedInvoice.remainingAmount)}
                            </span>
                          )}
                        </div>
                        <Input
                          id="payment-amount"
                          type="number"
                          className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                          value={paymentAmount}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (value > selectedInvoice.remainingAmount) {
                              setPaymentAmount(selectedInvoice.remainingAmount);
                            } else if (value < 0) {
                              setPaymentAmount(0);
                            } else {
                              setPaymentAmount(value);
                            }
                          }}
                          disabled={isFullPayment}
                        />
                        {!isFullPayment && (
                          <div className="flex justify-between text-sm mt-1 p-2 bg-orange-50 rounded-md">
                            <span className="text-gray-700">
                              Sisa setelah pembayaran:
                            </span>
                            <span className="font-medium text-orange-700">
                              {formatCurrency(selectedInvoice.remainingAmount - paymentAmount)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Two columns layout for payment details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700" htmlFor="payment-method">
                            Metode Pembayaran
                          </label>
                          <Select defaultValue="transfer">
                            <SelectTrigger id="payment-method" className="w-full border-orange-200">
                              <SelectValue placeholder="Pilih metode pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Tunai</SelectItem>
                              <SelectItem value="transfer">Transfer Bank</SelectItem>
                              <SelectItem value="check">Cek</SelectItem>
                              <SelectItem value="debit">Kartu Debit</SelectItem>
                              <SelectItem value="credit">Kartu Kredit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700" htmlFor="payment-date">
                            Tanggal Pembayaran
                          </label>
                          <Input
                            id="payment-date"
                            type="date"
                            className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                            defaultValue={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700" htmlFor="payment-reference">
                            Nomor Referensi
                          </label>
                          <Input
                            id="payment-reference"
                            className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                            placeholder="Nomor referensi transaksi"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700" htmlFor="payment-received-by">
                            Diterima Oleh
                          </label>
                          <Input
                            id="payment-received-by"
                            className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                            placeholder="Nama penerima"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700" htmlFor="payment-notes">
                          Catatan
                        </label>
                        <Textarea
                          id="payment-notes"
                          className="border-orange-200 focus:border-orange-500 focus:ring-orange-500 min-h-[80px]"
                          placeholder="Catatan tambahan (opsional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="p-4 border-t border-orange-100 bg-orange-50">
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)} className="border-orange-200 text-orange-700 hover:bg-orange-50">
              Batal
            </Button>
            <Button onClick={() => {
              // Di sini akan ditambahkan logika untuk memanggil API pembayaran
              console.log(`Processing payment of ${formatCurrency(paymentAmount)} for invoice ${selectedInvoice?.id}`);
              
              // Simulasi proses berhasil
              setIsPaymentModalOpen(false);
              
              // Tampilkan pesan sukses (akan diimplementasikan di UI sesungguhnya)
              alert(`Pembayaran ${formatCurrency(paymentAmount)} untuk ${selectedInvoice?.id} berhasil`);
            }} className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
              Proses Pembayaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Penerimaan Barang (Hanya View) */}
      <Dialog open={isInventoryModalOpen} onOpenChange={setIsInventoryModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orange-800">Informasi Penerimaan Barang</DialogTitle>
            <DialogDescription>
              Informasi penerimaan barang dari modul Inventory
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="mt-4 space-y-6">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Faktur</p>
                    <p className="font-bold text-gray-800">{selectedInvoice.id}</p>
                    <p className="text-sm text-gray-600 mt-2 mb-1">Supplier</p>
                    <p className="font-bold text-gray-800">{selectedInvoice.supplier}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="text-sm text-gray-600 mb-1">Status Penerimaan</p>
                    <Badge className={getInventoryStatusInfo(selectedInvoice).badge}>
                      {getInventoryStatusInfo(selectedInvoice).icon}
                      {getInventoryStatusInfo(selectedInvoice).label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-orange-100">
                <h4 className="font-medium text-orange-800 mb-4">Detail Barang</h4>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-orange-50">
                      <TableRow>
                        <TableHead className="text-orange-900">Produk</TableHead>
                        <TableHead className="text-orange-900 text-right">Jumlah</TableHead>
                        <TableHead className="text-orange-900 text-right">Diterima</TableHead>
                        <TableHead className="text-orange-900 text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item: InvoiceItem) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.received || 0}</TableCell>
                          <TableCell className="text-right">
                            {!item.received ? (
                              <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200">
                                <FaClock className="mr-1 h-3 w-3" />
                                Menunggu
                              </Badge>
                            ) : item.received < item.quantity ? (
                              <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                                <FaHistory className="mr-1 h-3 w-3" />
                                Sebagian
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                                <FaCheckCircle className="mr-1 h-3 w-3" />
                                Diterima
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {selectedInvoice.inventoryReceipts && selectedInvoice.inventoryReceipts.length > 0 ? (
                <div className="bg-white p-4 rounded-lg border border-orange-100">
                  <h4 className="font-medium text-orange-800 mb-4">Riwayat Penerimaan</h4>
                  
                  <div className="space-y-3">
                    {selectedInvoice.inventoryReceipts.map((receipt: InventoryReceipt) => (
                      <div key={receipt.id} className="p-3 border border-orange-100 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-medium">{receipt.receiptNumber}</span>
                          <span className="text-sm text-gray-500">{receipt.date}</span>
                        </div>
                        <div className="text-sm mt-1">
                          <span className="text-gray-500 mr-2">Diterima oleh:</span>
                          <span>{receipt.receivedBy}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          {receipt.notes}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-orange-100 text-center">
                  <FaInfoCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-700 mb-1">Belum Ada Penerimaan Barang</h4>
                  <p className="text-gray-500">Penerimaan barang akan dikelola melalui modul Inventory</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => setIsInventoryModalOpen(false)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </FinanceLayout>
  );
};

export default InvoicesPage;
