import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FinanceLayout from "@/components/layouts/finance-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
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
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  FaFileInvoiceDollar,
  FaSearch,
  FaPlus,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaBuilding,
  FaExclamationTriangle,
  FaInfoCircle,
  FaClipboardList,
  FaTrash,
  FaEdit,
  FaTimes,
  FaChevronLeft,
  FaBalanceScale,
  FaCheck,
  FaChevronRight,
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaSortAmountUp,
  FaSortAmountDown
} from "react-icons/fa";

// Define types for the general ledger functionality
interface LedgerEntry {
  id: string;
  date: string;
  referenceNumber: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
  invoiceId?: string;
  transactionType?: string;
  documentNumber?: string;
  accountCode?: string;
  branchId?: string;
  status?: 'verified' | 'pending' | 'rejected';
}

// Type for journal entry form
interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

// Account structure to match SAK standards
interface Account {
  code: string;
  name: string;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subCategory?: string;
  normalBalance: 'debit' | 'credit';
}

// Mock accounts based on SAK (Indonesian Accounting Standards)
const mockAccounts: Account[] = [
  // Asset (Aktiva) accounts - 1-XXXX series
  { code: "1-1100", name: "Kas", category: "asset", normalBalance: "debit" },
  { code: "1-1200", name: "Kas Bank", category: "asset", normalBalance: "debit" },
  { code: "1-1300", name: "Piutang Dagang", category: "asset", normalBalance: "debit" },
  { code: "1-1400", name: "Persediaan Barang Dagang", category: "asset", normalBalance: "debit" },
  { code: "1-2100", name: "Perlengkapan Kantor", category: "asset", normalBalance: "debit" },
  { code: "1-2200", name: "Peralatan", category: "asset", normalBalance: "debit" },
  { code: "1-2300", name: "Akumulasi Penyusutan Peralatan", category: "asset", normalBalance: "credit" },
  
  // Liability (Kewajiban) accounts - 2-XXXX series
  { code: "2-1100", name: "Hutang Dagang", category: "liability", normalBalance: "credit" },
  { code: "2-1200", name: "Hutang Gaji", category: "liability", normalBalance: "credit" },
  { code: "2-1300", name: "Hutang Pajak", category: "liability", normalBalance: "credit" },
  { code: "2-2100", name: "Hutang Bank", category: "liability", normalBalance: "credit" },
  
  // Equity (Ekuitas) accounts - 3-XXXX series
  { code: "3-1000", name: "Modal Pemilik", category: "equity", normalBalance: "credit" },
  { code: "3-2000", name: "Prive", category: "equity", normalBalance: "debit" },
  { code: "3-3000", name: "Laba Ditahan", category: "equity", normalBalance: "credit" },
  
  // Revenue (Pendapatan) accounts - 4-XXXX series
  { code: "4-1000", name: "Pendapatan Penjualan", category: "revenue", normalBalance: "credit" },
  { code: "4-2000", name: "Pendapatan Jasa", category: "revenue", normalBalance: "credit" },
  { code: "4-3000", name: "Pendapatan Lain-lain", category: "revenue", normalBalance: "credit" },
  
  // Expense (Beban) accounts - 5-XXXX series
  { code: "5-1000", name: "Beban Gaji", category: "expense", normalBalance: "debit" },
  { code: "5-2000", name: "Beban Sewa", category: "expense", normalBalance: "debit" },
  { code: "5-3000", name: "Beban Listrik & Air", category: "expense", normalBalance: "debit" },
  { code: "5-4000", name: "Beban Iklan", category: "expense", normalBalance: "debit" },
  { code: "5-5000", name: "Beban Penyusutan", category: "expense", normalBalance: "debit" },
  { code: "5-6000", name: "Harga Pokok Penjualan", category: "expense", normalBalance: "debit" },
  { code: "5-7000", name: "Beban Lain-lain", category: "expense", normalBalance: "debit" },
];

// Mock data for the ledger
const mockLedgerEntries: LedgerEntry[] = [
  {
    id: "JRN-2025-001",
    date: "15 Mar 2025",
    referenceNumber: "TRX-001",
    description: "Pembayaran faktur pembelian",
    account: "Hutang Dagang",
    accountCode: "2-1100",
    debit: 2000000,
    credit: 0,
    status: "verified"
  },
  {
    id: "JRN-2025-001",
    date: "15 Mar 2025",
    referenceNumber: "TRX-001",
    description: "Pembayaran faktur pembelian",
    account: "Kas",
    accountCode: "1-1100",
    debit: 0,
    credit: 2000000,
    status: "verified"
  },
  {
    id: "JRN-2025-002",
    date: "16 Mar 2025",
    referenceNumber: "TRX-002",
    description: "Penjualan tunai",
    account: "Kas",
    accountCode: "1-1100",
    debit: 1500000,
    credit: 0,
    status: "verified"
  },
  {
    id: "JRN-2025-002",
    date: "16 Mar 2025",
    referenceNumber: "TRX-002",
    description: "Penjualan tunai",
    account: "Pendapatan Penjualan",
    accountCode: "4-1000",
    debit: 0,
    credit: 1500000,
    status: "verified"
  },
  {
    id: "JRN-2025-003",
    date: "17 Mar 2025",
    referenceNumber: "TRX-003",
    description: "Pembayaran gaji karyawan",
    account: "Beban Gaji",
    accountCode: "5-1000",
    debit: 3000000,
    credit: 0,
    status: "pending"
  },
  {
    id: "JRN-2025-003",
    date: "17 Mar 2025",
    referenceNumber: "TRX-003",
    description: "Pembayaran gaji karyawan",
    account: "Kas",
    accountCode: "1-1100",
    debit: 0,
    credit: 3000000,
    status: "pending"
  },
  {
    id: "JRN-2025-004",
    date: "20 Mar 2025",
    referenceNumber: "TRX-004",
    description: "Pembelian perlengkapan kantor",
    account: "Perlengkapan Kantor",
    accountCode: "1-2100",
    debit: 500000,
    credit: 0,
    status: "verified"
  },
  {
    id: "JRN-2025-004",
    date: "20 Mar 2025",
    referenceNumber: "TRX-004",
    description: "Pembelian perlengkapan kantor",
    account: "Kas",
    accountCode: "1-1100",
    debit: 0,
    credit: 500000,
    status: "verified"
  },
];

// Fungsi untuk format Rp currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const LedgerPage: NextPage = () => {
  const router = useRouter();
  const { invoiceId } = router.query;
  
  // State
  const [filterText, setFilterText] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<{start: string; end: string}>({start: "", end: ""});
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'}>({
    key: 'date',
    direction: 'desc'
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [exportDateRange, setExportDateRange] = useState<{start: string; end: string}>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // Journal Entry Form States
  const [isJournalEntryModalOpen, setIsJournalEntryModalOpen] = useState<boolean>(false);
  const [journalFormData, setJournalFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    referenceNumber: `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    description: "",
    documentNumber: "",
    transactionType: "manual",
    journalType: "general",
    notes: "",
  });
  const [journalEntryLines, setJournalEntryLines] = useState<JournalEntryLine[]>([
    { 
      id: `line-${Date.now()}-0`, 
      accountCode: "", 
      accountName: "", 
      debit: 0, 
      credit: 0,
      description: ""
    },
    { 
      id: `line-${Date.now()}-1`, 
      accountCode: "", 
      accountName: "", 
      debit: 0, 
      credit: 0,
      description: ""
    }
  ]);
  const [journalEntryErrors, setJournalEntryErrors] = useState({
    general: "",
    balance: false,
    lines: {} as Record<string, {accountCode?: string, debitCredit?: string}>
  });
  
  // Sorting function
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sorted and filtered items
  const getSortedItems = (items: LedgerEntry[]) => {
    const sortableItems = [...items];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof LedgerEntry] < b[sortConfig.key as keyof LedgerEntry]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof LedgerEntry] > b[sortConfig.key as keyof LedgerEntry]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  };
  
  // Filter ledger entries
  const filteredEntries = mockLedgerEntries
    .filter(entry => {
      // Text filter
      if (filterText && !entry.description.toLowerCase().includes(filterText.toLowerCase()) && 
          !entry.referenceNumber.toLowerCase().includes(filterText.toLowerCase()) &&
          !entry.id.toLowerCase().includes(filterText.toLowerCase())) {
        return false;
      }
      
      // Account filter
      if (accountFilter !== "all" && entry.account !== accountFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter.start && dateFilter.end) {
        const entryDate = new Date(entry.date);
        const startDate = new Date(dateFilter.start);
        const endDate = new Date(dateFilter.end);
        endDate.setHours(23, 59, 59, 999); // End of day
        
        if (entryDate < startDate || entryDate > endDate) {
          return false;
        }
      }
      
      // Invoice filter (if provided via URL)
      if (invoiceId && entry.invoiceId !== invoiceId) {
        return false;
      }
      
      return true;
    });
    
  // Apply sorting
  const sortedEntries = getSortedItems(filteredEntries);
  
  // Pagination
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Unique accounts for filter dropdown
  const uniqueAccounts = Array.from(new Set(mockLedgerEntries.map(entry => entry.account)));
  
  // Calculate totals
  const totalDebit = sortedEntries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = sortedEntries.reduce((sum, entry) => sum + entry.credit, 0);
  
  // Journal Entry Form Handlers
  const openJournalEntryModal = () => {
    // Generate a new reference number
    setJournalFormData({
      ...journalFormData,
      date: new Date().toISOString().split('T')[0],
      referenceNumber: `REF-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    });
    setIsJournalEntryModalOpen(true);
  };
  
  const addJournalLine = () => {
    setJournalEntryLines([
      ...journalEntryLines,
      {
        id: `line-${Date.now()}-${journalEntryLines.length}`,
        accountCode: "",
        accountName: "",
        debit: 0,
        credit: 0,
        description: ""
      }
    ]);
  };
  
  const removeJournalLine = (lineId: string) => {
    if (journalEntryLines.length <= 2) {
      return; // Need at least 2 lines for a valid journal entry
    }
    setJournalEntryLines(journalEntryLines.filter(line => line.id !== lineId));
    
    // Remove any errors associated with this line
    const newErrors = { ...journalEntryErrors };
    delete newErrors.lines[lineId];
    setJournalEntryErrors(newErrors);
  };
  
  const handleJournalLineChange = (lineId: string, field: string, value: string | number) => {
    const updatedLines = journalEntryLines.map(line => {
      if (line.id === lineId) {
        // If changing account code, get account name
        if (field === 'accountCode') {
          const account = mockAccounts.find(a => a.code === value.toString());
          return {
            ...line,
            [field]: value.toString(),
            accountName: account ? account.name : ''
          };
        }
        
        // Special handling for debit/credit to ensure they are mutual exclusive
        if (field === 'debit' && Number(value) > 0) {
          return { ...line, debit: Number(value), credit: 0 };
        }
        
        if (field === 'credit' && Number(value) > 0) {
          return { ...line, credit: Number(value), debit: 0 };
        }
        
        return { ...line, [field]: value };
      }
      return line;
    });
    
    setJournalEntryLines(updatedLines);
    
    // Clear any validation errors for this field
    if (journalEntryErrors.lines[lineId] && journalEntryErrors.lines[lineId][field as keyof typeof journalEntryErrors.lines[string]]) {
      const newErrors = { ...journalEntryErrors };
      delete newErrors.lines[lineId][field as keyof typeof journalEntryErrors.lines[string]];
      setJournalEntryErrors(newErrors);
    }
    
    // Check balance (debits = credits)
    const totalDebit = updatedLines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = updatedLines.reduce((sum, line) => sum + line.credit, 0);
    
    setJournalEntryErrors({
      ...journalEntryErrors,
      balance: totalDebit !== totalCredit
    });
  };
  
  const validateJournalEntry = () => {
    const errors: typeof journalEntryErrors = {
      general: "",
      balance: false,
      lines: {}
    };
    
    let isValid = true;
    
    // Check form data
    if (!journalFormData.date) {
      errors.general = "Tanggal jurnal harus diisi";
      isValid = false;
    }
    
    if (!journalFormData.description) {
      errors.general = "Deskripsi jurnal harus diisi";
      isValid = false;
    }
    
    // Check line items
    const totalDebit = journalEntryLines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredit = journalEntryLines.reduce((sum, line) => sum + line.credit, 0);
    
    if (totalDebit !== totalCredit) {
      errors.balance = true;
      errors.general = "Total debit harus sama dengan total kredit";
      isValid = false;
    }
    
    journalEntryLines.forEach(line => {
      errors.lines[line.id] = {};
      
      if (!line.accountCode || line.accountCode === "placeholder") {
        errors.lines[line.id].accountCode = "Akun harus dipilih";
        isValid = false;
      }
      
      if (line.debit === 0 && line.credit === 0) {
        errors.lines[line.id].debitCredit = "Nilai debit atau kredit harus diisi";
        isValid = false;
      }
    });
    
    setJournalEntryErrors(errors);
    return isValid;
  };
  
  const submitJournalEntry = () => {
    if (!validateJournalEntry()) {
      return;
    }
    
    // Here you would typically submit to an API
    // For now, just close the modal and show a success toast
    setIsJournalEntryModalOpen(false);
    
    // In a real app, you'd refresh the data here
    // For now, let's just provide feedback
    alert("Jurnal berhasil disimpan!");
  };
  
  // Reset filter
  const handleResetFilter = () => {
    setFilterText("");
    setDateFilter({start: "", end: ""});
    setAccountFilter("all");
  };
  
  // Render pagination
  const renderPagination = () => {
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
          onClick={() => setCurrentPage(1)}
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
          onClick={() => setCurrentPage(i)}
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
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }
    
    return pages;
  };
  
  // Export functions
  const openExportModal = () => {
    setExportDateRange({
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    });
    setIsExportModalOpen(true);
  };
  
  const handleExport = () => {
    // In a real app, this would trigger an API call to generate the export
    // For now, we'll simulate this with a toast notification
    alert(`Laporan Buku Besar di-export sebagai ${exportFormat.toUpperCase()}`);
    
    setIsExportModalOpen(false);
  };
  
  // Helper function to format dates for display
  const formatDateDisplay = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  // Enhanced filter function
  const applyAdvancedFilters = () => {
    // In a real app, this might trigger a server-side search
    setCurrentPage(1); // Reset to first page when filtering
    
    // Close filter dropdown if it exists
    (document.activeElement as HTMLElement)?.blur();
    
    alert("Filter Diterapkan");
  };

  return (
    <FinanceLayout>
      <div className="space-y-6">
        {/* Page Header with SAK Information */}
        <div className="relative overflow-hidden bg-white rounded-xl border border-orange-100 shadow-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
          <div className="p-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md">
                  <FaFileInvoiceDollar className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Buku Besar (General Ledger)</h1>
                  <p className="text-gray-600 mt-1">Pencatatan transaksi keuangan sesuai Standar Akuntansi Keuangan Indonesia</p>
                  <div className="flex items-center mt-1 text-xs text-orange-600">
                    <FaInfoCircle className="h-3 w-3 mr-1" />
                    <span>Mengikuti PSAK (Pernyataan Standar Akuntansi Keuangan) terbaru</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
                {invoiceId ? (
                  <Button
                    variant="outline"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => router.push('/finance/invoices')}
                  >
                    <FaChevronLeft className="mr-2 h-4 w-4" />
                    Kembali ke Faktur
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                      onClick={openJournalEntryModal}
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Entri Jurnal Baru
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-200 hover:bg-orange-50 text-orange-700"
                      onClick={openExportModal}
                    >
                      <FaDownload className="mr-2 h-4 w-4" />
                      Ekspor Laporan
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16 blur-xl"></div>
          <div className="absolute bottom-0 left-10 w-32 h-32 bg-amber-100 rounded-full opacity-30 transform -translate-y-1/3 blur-lg"></div>
        </div>
        
        {/* Dashboard Summary Cards */}
        {!invoiceId && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Transactions Card */}
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Transaksi</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{sortedEntries.length / 2}</h3>
                    <p className="text-xs text-orange-600 mt-1">Periode: Maret 2025</p>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <FaExclamationTriangle className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Debit Card */}
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Debit</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalDebit)}</h3>
                    <p className="text-xs text-orange-600 mt-1">Periode: Maret 2025</p>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <FaFileInvoiceDollar className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Total Credit Card */}
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Kredit</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalCredit)}</h3>
                    <p className="text-xs text-orange-600 mt-1">Periode: Maret 2025</p>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <FaFileInvoiceDollar className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Balance Card */}
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-amber-400"></div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Keseimbangan</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(totalDebit - totalCredit)}</h3>
                    <Badge variant={totalDebit === totalCredit ? "outline" : "destructive"} className="mt-1">
                      {totalDebit === totalCredit ? "Seimbang" : "Tidak Seimbang"}
                    </Badge>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <FaBalanceScale className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Journal Entry Modal */}
        {isJournalEntryModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-5xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-orange-100 rounded-full opacity-10 transform translate-x-20 -translate-y-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-100 rounded-full opacity-10 transform -translate-x-20 translate-y-20 blur-3xl"></div>
              
              {/* Header with gradient bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-sm mr-3">
                      <FaFileInvoiceDollar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-orange-800">Tambah Entri Jurnal Baru</h3>
                      <p className="text-orange-600/70 text-sm">Sesuai dengan Standar Akuntansi Keuangan (SAK)</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsJournalEntryModalOpen(false)}
                    className="h-8 w-8 p-1 rounded-full hover:bg-orange-100 text-gray-500"
                  >
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Body (scrollable) */}
              <div className="flex-1 overflow-y-auto p-6">
                {journalEntryErrors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                    <div className="flex items-center">
                      <FaExclamationTriangle className="h-4 w-4 mr-2 text-red-500" />
                      {journalEntryErrors.general}
                    </div>
                  </div>
                )}
                
                {/* Journal Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="journal-date" className="text-gray-700 mb-1 block">Tanggal</Label>
                    <Input
                      id="journal-date"
                      type="date"
                      value={journalFormData.date}
                      onChange={(e) => setJournalFormData({ ...journalFormData, date: e.target.value })}
                      className="border-orange-200 focus-visible:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="journal-reference" className="text-gray-700 mb-1 block">Nomor Referensi</Label>
                    <Input
                      id="journal-reference"
                      value={journalFormData.referenceNumber}
                      onChange={(e) => setJournalFormData({ ...journalFormData, referenceNumber: e.target.value })}
                      className="border-orange-200 focus-visible:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="journal-type" className="text-gray-700 mb-1 block">Jenis Jurnal</Label>
                    <Select 
                      value={journalFormData.journalType} 
                      onValueChange={(value) => setJournalFormData({ ...journalFormData, journalType: value })}
                    >
                      <SelectTrigger className="border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300">
                        <SelectValue placeholder="Pilih jenis jurnal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Jurnal Umum</SelectItem>
                        <SelectItem value="adjustment">Jurnal Penyesuaian</SelectItem>
                        <SelectItem value="closing">Jurnal Penutup</SelectItem>
                        <SelectItem value="reversing">Jurnal Pembalik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="journal-description" className="text-gray-700 mb-1 block">Deskripsi Jurnal</Label>
                  <Input
                    id="journal-description"
                    placeholder="Contoh: Pembayaran gaji karyawan untuk bulan Maret 2025"
                    value={journalFormData.description}
                    onChange={(e) => setJournalFormData({ ...journalFormData, description: e.target.value })}
                    className="border-orange-200 focus-visible:ring-orange-500"
                  />
                </div>
                
                {/* Journal Entry Lines */}
                <div className="mb-4">
                  <h4 className="text-gray-800 font-medium mb-2 flex items-center">
                    <FaInfoCircle className="mr-2 text-orange-500 h-4 w-4" />
                    Detail Jurnal
                  </h4>
                  
                  <div className="border border-orange-100 rounded-lg overflow-hidden">
                    <div className="bg-orange-50 p-3 border-b border-orange-100">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-700">
                        <div className="col-span-4">Akun</div>
                        <div className="col-span-3">Deskripsi</div>
                        <div className="col-span-2 text-right">Debit</div>
                        <div className="col-span-2 text-right">Kredit</div>
                        <div className="col-span-1"></div>
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-3">
                      {journalEntryLines.map((line) => (
                        <div key={line.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-4">
                            <Select 
                              value={line.accountCode} 
                              onValueChange={(value) => handleJournalLineChange(line.id, 'accountCode', value)}
                            >
                              <SelectTrigger className={`h-9 text-sm ${journalEntryErrors.lines[line.id]?.accountCode ? 'border-red-500 focus-visible:ring-red-500' : 'border-orange-200 focus-visible:ring-orange-500'}`}>
                                <SelectValue placeholder="Pilih akun" />
                              </SelectTrigger>
                              <SelectContent>
                                <div className="p-2 text-xs text-gray-500 bg-orange-50 border-b border-orange-100">
                                  Kode - Nama Akun
                                </div>
                                <SelectItem value="placeholder">-- Pilih Akun --</SelectItem>
                                
                                <div className="py-1 px-2 text-xs font-semibold text-gray-500 bg-orange-50/80 border-y border-orange-100">
                                  Aktiva
                                </div>
                                {mockAccounts.filter(a => a.category === 'asset').map(account => (
                                  <SelectItem key={account.code} value={account.code}>
                                    {account.code} - {account.name}
                                  </SelectItem>
                                ))}
                                
                                <div className="py-1 px-2 text-xs font-semibold text-gray-500 bg-orange-50/80 border-y border-orange-100">
                                  Kewajiban
                                </div>
                                {mockAccounts.filter(a => a.category === 'liability').map(account => (
                                  <SelectItem key={account.code} value={account.code}>
                                    {account.code} - {account.name}
                                  </SelectItem>
                                ))}
                                
                                <div className="py-1 px-2 text-xs font-semibold text-gray-500 bg-orange-50/80 border-y border-orange-100">
                                  Ekuitas
                                </div>
                                {mockAccounts.filter(a => a.category === 'equity').map(account => (
                                  <SelectItem key={account.code} value={account.code}>
                                    {account.code} - {account.name}
                                  </SelectItem>
                                ))}
                                
                                <div className="py-1 px-2 text-xs font-semibold text-gray-500 bg-orange-50/80 border-y border-orange-100">
                                  Pendapatan
                                </div>
                                {mockAccounts.filter(a => a.category === 'revenue').map(account => (
                                  <SelectItem key={account.code} value={account.code}>
                                    {account.code} - {account.name}
                                  </SelectItem>
                                ))}
                                
                                <div className="py-1 px-2 text-xs font-semibold text-gray-500 bg-orange-50/80 border-y border-orange-100">
                                  Beban
                                </div>
                                {mockAccounts.filter(a => a.category === 'expense').map(account => (
                                  <SelectItem key={account.code} value={account.code}>
                                    {account.code} - {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {journalEntryErrors.lines[line.id]?.accountCode && (
                              <p className="text-red-500 text-xs mt-1">{journalEntryErrors.lines[line.id].accountCode}</p>
                            )}
                          </div>
                          
                          <div className="col-span-3">
                            <Input
                              placeholder="Deskripsi"
                              value={line.description}
                              onChange={(e) => handleJournalLineChange(line.id, 'description', e.target.value)}
                              className="h-9 text-sm border-orange-200 focus-visible:ring-orange-500"
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={line.debit || ''}
                              onChange={(e) => handleJournalLineChange(line.id, 'debit', e.target.value)}
                              className={`h-9 text-sm text-right ${journalEntryErrors.lines[line.id]?.debitCredit ? 'border-red-500 focus-visible:ring-red-500' : 'border-orange-200 focus-visible:ring-orange-500'}`}
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={line.credit || ''}
                              onChange={(e) => handleJournalLineChange(line.id, 'credit', e.target.value)}
                              className={`h-9 text-sm text-right ${journalEntryErrors.lines[line.id]?.debitCredit ? 'border-red-500 focus-visible:ring-red-500' : 'border-orange-200 focus-visible:ring-orange-500'}`}
                            />
                          </div>
                          
                          <div className="col-span-1 text-center">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeJournalLine(line.id)}
                              disabled={journalEntryLines.length <= 2}
                              className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                            >
                              <FaTrash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addJournalLine}
                        className="w-full mt-2 border-dashed border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <FaPlus className="h-3 w-3 mr-2" />
                        Tambah Baris
                      </Button>
                    </div>
                    
                    {/* Totals */}
                    <div className="bg-orange-50 p-3 border-t border-orange-100">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-7 text-right font-medium text-gray-700">Total:</div>
                        <div className="col-span-2 text-right font-medium">
                          {formatCurrency(journalEntryLines.reduce((sum, line) => sum + line.debit, 0))}
                        </div>
                        <div className="col-span-2 text-right font-medium">
                          {formatCurrency(journalEntryLines.reduce((sum, line) => sum + line.credit, 0))}
                        </div>
                        <div className="col-span-1"></div>
                      </div>
                      
                      {/* Balance check */}
                      <div className="mt-2 text-right">
                        {journalEntryErrors.balance ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <FaTimes className="h-2.5 w-2.5 mr-1" />
                            Tidak Seimbang
                          </Badge>
                        ) : (
                          journalEntryLines.some(line => line.debit > 0 || line.credit > 0) && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <FaCheck className="h-2.5 w-2.5 mr-1" />
                              Seimbang
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="journal-notes" className="text-gray-700 mb-1 block">Catatan Tambahan</Label>
                  <textarea
                    id="journal-notes"
                    rows={2}
                    placeholder="Catatan tambahan untuk jurnal (opsional)"
                    value={journalFormData.notes}
                    onChange={(e) => setJournalFormData({ ...journalFormData, notes: e.target.value })}
                    className="w-full rounded-md border border-orange-200 focus-visible:ring-orange-500 px-3 py-2 text-sm"
                  ></textarea>
                </div>
                
                {/* SAK Information */}
                <div className="p-3 bg-orange-50/60 rounded-lg border border-orange-100 text-xs text-gray-600">
                  <div className="flex items-start">
                    <FaInfoCircle className="h-3 w-3 text-orange-500 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium text-orange-700 mb-1">Informasi SAK (Standar Akuntansi Keuangan)</p>
                      <p>Entry jurnal harus mengikuti prinsip keseimbangan dimana total debit harus sama dengan total kredit. Lengkapi semua informasi akun, tanggal, deskripsi, dan nilai transaksi untuk memastikan pencatatan sesuai dengan standar akuntansi.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer with action buttons */}
              <div className="p-4 border-t border-orange-100 bg-gradient-to-r from-orange-50/50 to-amber-50/50 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => setIsJournalEntryModalOpen(false)}
                >
                  Batal
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={submitJournalEntry}
                >
                  <FaCheck className="mr-2 h-4 w-4" />
                  Simpan Jurnal
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Export Modal */}
        {isExportModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full opacity-10 transform translate-x-10 -translate-y-10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-100 rounded-full opacity-10 transform -translate-x-10 translate-y-10 blur-3xl"></div>
              
              {/* Header with gradient bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-sm mr-3">
                      <FaDownload className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-800">Ekspor Laporan Buku Besar</h3>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsExportModalOpen(false)}
                    className="h-8 w-8 p-1 rounded-full hover:bg-orange-100 text-gray-500"
                  >
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <div className="mb-4">
                  <Label htmlFor="export-format" className="text-gray-700 mb-2 block">Format Ekspor</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      type="button"
                      variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                      className={exportFormat === 'pdf' 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                      }
                      onClick={() => setExportFormat('pdf')}
                    >
                      <FaFilePdf className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    
                    <Button 
                      type="button"
                      variant={exportFormat === 'excel' ? 'default' : 'outline'}
                      className={exportFormat === 'excel' 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                      }
                      onClick={() => setExportFormat('excel')}
                    >
                      <FaFileExcel className="mr-2 h-4 w-4" />
                      Excel
                    </Button>
                    
                    <Button 
                      type="button"
                      variant={exportFormat === 'csv' ? 'default' : 'outline'}
                      className={exportFormat === 'csv' 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' 
                        : 'border-orange-200 text-orange-700 hover:bg-orange-50'
                      }
                      onClick={() => setExportFormat('csv')}
                    >
                      <FaFileCsv className="mr-2 h-4 w-4" />
                      CSV
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="export-date-from" className="text-gray-700 mb-1 block">Dari Tanggal</Label>
                    <Input
                      id="export-date-from"
                      type="date"
                      value={exportDateRange.start}
                      onChange={(e) => setExportDateRange({...exportDateRange, start: e.target.value})}
                      className="border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="export-date-to" className="text-gray-700 mb-1 block">Sampai Tanggal</Label>
                    <Input
                      id="export-date-to"
                      type="date"
                      value={exportDateRange.end}
                      onChange={(e) => setExportDateRange({...exportDateRange, end: e.target.value})}
                      className="border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300"
                    />
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-100 text-sm text-orange-800 mb-6">
                  <FaInfoCircle className="h-4 w-4 mr-2 text-orange-500" />
                  <p>Ekspor akan mencakup semua entri jurnal sesuai dengan rentang tanggal yang dipilih.</p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-orange-100 bg-gradient-to-r from-orange-50/50 to-amber-50/50 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                  onClick={() => setIsExportModalOpen(false)}
                >
                  Batal
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={handleExport}
                >
                  <FaDownload className="mr-2 h-4 w-4" />
                  Ekspor
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Ledger Entries */}
        <Card className="border-orange-100 overflow-hidden neo-shadow relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100 rounded-full opacity-10 transform translate-x-16 -translate-y-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100 rounded-full opacity-10 transform -translate-x-16 translate-y-16 blur-3xl"></div>
          
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
          
          {/* Filters Section with SAK Account Structure */}
          <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
            <div className="flex flex-col md:flex-row gap-3 py-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  placeholder="Cari jurnal, referensi, atau keterangan..."
                  className="pl-10 border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-9 border-orange-200 text-orange-700"
                    >
                      <FaFilter className="mr-2 h-3 w-3" />
                      Filter Lanjutan
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-gray-900">Filter Lanjutan</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Dari Tanggal</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={dateFilter.start}
                          onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                          className="border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="end-date">Sampai Tanggal</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={dateFilter.end}
                          onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                          className="border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status-filter">Status Transaksi</Label>
                        <Select value="all" onValueChange={() => {}}>
                          <SelectTrigger id="status-filter" className="border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300">
                            <SelectValue placeholder="Semua Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="verified">Terverifikasi</SelectItem>
                            <SelectItem value="pending">Menunggu</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setDateFilter({ start: "", end: "" });
                          setAccountFilter("all");
                        }}>
                          Reset
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                          onClick={applyAdvancedFilters}
                        >
                          Terapkan Filter
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <div className="w-full sm:w-[200px]">
                  <Select value={accountFilter} onValueChange={setAccountFilter}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-300 focus-visible:ring-orange-300">
                      <SelectValue placeholder="Pilih Akun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Akun</SelectItem>
                      {uniqueAccounts.map((account, index) => (
                        <SelectItem key={index} value={account}>{account}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleResetFilter}
                  className="h-9 w-9 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                >
                  <FaTimes className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-orange-50 border-b border-orange-100">
                  <TableRow>
                    <TableHead 
                      className="text-orange-900 font-medium w-[140px] cursor-pointer"
                      onClick={() => requestSort('date')}
                    >
                      <div className="flex items-center">
                        Tanggal
                        {sortConfig.key === 'date' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium w-[120px] cursor-pointer"
                      onClick={() => requestSort('id')}
                    >
                      <div className="flex items-center">
                        No. Jurnal
                        {sortConfig.key === 'id' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium w-[120px] cursor-pointer"
                      onClick={() => requestSort('referenceNumber')}
                    >
                      <div className="flex items-center">
                        No. Referensi
                        {sortConfig.key === 'referenceNumber' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium cursor-pointer"
                      onClick={() => requestSort('description')}
                    >
                      <div className="flex items-center">
                        Keterangan
                        {sortConfig.key === 'description' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium cursor-pointer"
                      onClick={() => requestSort('account')}
                    >
                      <div className="flex items-center">
                        Akun
                        {sortConfig.key === 'account' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium w-[100px] cursor-pointer"
                      onClick={() => requestSort('accountCode')}
                    >
                      <div className="flex items-center">
                        Kode Akun
                        {sortConfig.key === 'accountCode' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium text-right w-[140px] cursor-pointer"
                      onClick={() => requestSort('debit')}
                    >
                      <div className="flex items-center justify-end">
                        Debit
                        {sortConfig.key === 'debit' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium text-right w-[140px] cursor-pointer"
                      onClick={() => requestSort('credit')}
                    >
                      <div className="flex items-center justify-end">
                        Kredit
                        {sortConfig.key === 'credit' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-orange-900 font-medium w-[80px] text-center cursor-pointer"
                      onClick={() => requestSort('status')}
                    >
                      <div className="flex items-center justify-center">
                        Status
                        {sortConfig.key === 'status' && (
                          sortConfig.direction === 'asc' 
                            ? <FaSortAmountUp className="ml-1 h-3 w-3 text-orange-500" />
                            : <FaSortAmountDown className="ml-1 h-3 w-3 text-orange-500" />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                
                <TableBody>
                  {paginatedEntries.length > 0 ? (
                    paginatedEntries.map((entry, index) => {
                      // Determine if this is the first entry of a transaction group
                      const isFirstInGroup = index === 0 || entry.referenceNumber !== paginatedEntries[index - 1].referenceNumber;
                      const isLastInGroup = index === paginatedEntries.length - 1 || entry.referenceNumber !== paginatedEntries[index + 1].referenceNumber;
                      
                      // Style the row background based on its position in the transaction group
                      const rowStyle = isFirstInGroup ? "border-t-2 border-orange-100" : "";
                      
                      return (
                        <TableRow 
                          key={entry.id} 
                          className={`${rowStyle} hover:bg-orange-50/60 ${
                            entry.status === 'pending' ? 'bg-amber-50/30' : 
                            entry.status === 'rejected' ? 'bg-red-50/30' : ''
                          }`}
                        >
                          {/* Only show date for the first entry in a transaction group */}
                          <TableCell className="font-medium">
                            {isFirstInGroup ? entry.date : ''}
                          </TableCell>
                          
                          <TableCell>{entry.id}</TableCell>
                          <TableCell>{entry.referenceNumber}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>{entry.account}</TableCell>
                          <TableCell className="font-mono text-sm">{entry.accountCode}</TableCell>
                          <TableCell className="text-right font-medium">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : ''}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : ''}
                          </TableCell>
                          <TableCell className="text-center">
                            {entry.status === 'verified' && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <FaCheck className="h-2.5 w-2.5 mr-1" />
                                Terverifikasi
                              </Badge>
                            )}
                            {entry.status === 'pending' && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                <FaInfoCircle className="h-2.5 w-2.5 mr-1" />
                                Tertunda
                              </Badge>
                            )}
                            {entry.status === 'rejected' && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <FaTimes className="h-2.5 w-2.5 mr-1" />
                                Ditolak
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FaExclamationTriangle className="h-8 w-8 text-orange-300 mb-2" />
                          <p className="text-gray-500 mb-1">Tidak ada data entri jurnal</p>
                          <p className="text-sm text-gray-400">Coba ubah filter atau tambahkan entri jurnal baru</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                
                <TableFooter>
                  <TableRow className="bg-orange-50/90 border-t-2 border-orange-200">
                    <TableCell colSpan={6} className="font-bold text-orange-900">
                      Total Halaman Ini
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-900">
                      {formatCurrency(paginatedEntries.reduce((sum, entry) => sum + entry.debit, 0))}
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-900">
                      {formatCurrency(paginatedEntries.reduce((sum, entry) => sum + entry.credit, 0))}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  
                  <TableRow className="bg-gradient-to-r from-orange-100/80 to-amber-100/80 border-t border-orange-200">
                    <TableCell colSpan={6} className="font-bold text-orange-900">
                      Total Keseluruhan
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-900">
                      {formatCurrency(totalDebit)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-orange-900">
                      {formatCurrency(totalCredit)}
                    </TableCell>
                    <TableCell className="text-center">
                      {totalDebit === totalCredit ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <FaCheck className="h-2.5 w-2.5 mr-1" />
                          Seimbang
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <FaTimes className="h-2.5 w-2.5 mr-1" />
                          Tidak Seimbang
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center py-4 border-t border-orange-100 bg-orange-50/50">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-orange-200"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </Button>
                
                {renderPagination()}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-orange-200"
                >
                  <FaChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        {/* SAK Information Section */}
        <div className="bg-white rounded-lg border border-orange-100 shadow-sm p-4 text-sm">
          <h3 className="font-bold text-orange-800 mb-2 flex items-center">
            <FaInfoCircle className="mr-2 text-orange-500" />
            Informasi Standar Akuntansi Keuangan (SAK)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Struktur Kode Akun:</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>1-xxxx: Aset</li>
                <li>2-xxxx: Kewajiban</li>
                <li>3-xxxx: Ekuitas</li>
                <li>4-xxxx: Pendapatan</li>
                <li>5-xxxx: Beban</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Prinsip Dasar:</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Total Debit = Total Kredit</li>
                <li>Aset = Kewajiban + Ekuitas</li>
                <li>Pendapatan - Beban = Laba/Rugi</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Integrasi:</p>
              <ul className="list-disc list-inside text-gray-600">
                <li>Terintegrasi dengan modul Penjualan</li>
                <li>Terintegrasi dengan modul Pembelian</li>
                <li>Terintegrasi dengan modul Inventaris</li>
                <li>Laporan tersedia di modul Laporan Keuangan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </FinanceLayout>
  );
};

export default LedgerPage;
