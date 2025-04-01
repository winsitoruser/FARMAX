import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaEye, FaArrowLeft, FaDownload, FaPrint, FaFilePrescription, FaFilter, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { formatRupiah } from "@/lib/formatter";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as XLSX from 'xlsx';

// Define types for our data
interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  date: string;
  total: number;
  items: TransactionItem[];
  hasPrescription: boolean;
  prescriptionImage?: string;
  paymentMethod: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalTransactions: number;
  totalSpent: number;
  lastTransaction: string;
  transactions: Transaction[];
}

// Pagination type
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

// Filter type
interface FilterState {
  date: Date | undefined;
  minSpent: string;
  maxSpent: string;
  paymentMethods: string[];
  hasPrescription: boolean | null;
}

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Budi Santoso",
    phone: "081234567890",
    email: "budi@example.com",
    address: "Jl. Sudirman No. 123, Jakarta",
    totalTransactions: 15,
    totalSpent: 2750000,
    lastTransaction: "2025-03-20",
    transactions: [
      {
        id: "TRX-001",
        date: "2025-03-20",
        total: 350000,
        items: [
          { name: "Paracetamol", quantity: 2, price: 15000 },
          { name: "Vitamin C", quantity: 1, price: 25000 },
          { name: "Amoxicillin", quantity: 1, price: 45000 }
        ],
        hasPrescription: true,
        prescriptionImage: "/images/prescription-1.jpg",
        paymentMethod: "Cash"
      },
      {
        id: "TRX-002",
        date: "2025-03-15",
        total: 250000,
        items: [
          { name: "Vitamin B Complex", quantity: 1, price: 75000 },
          { name: "Antasida", quantity: 2, price: 20000 }
        ],
        hasPrescription: false,
        paymentMethod: "Credit Card"
      }
    ]
  },
  {
    id: 2,
    name: "Siti Rahayu",
    phone: "082345678901",
    email: "siti@example.com",
    address: "Jl. Gatot Subroto No. 45, Jakarta",
    totalTransactions: 8,
    totalSpent: 1250000,
    lastTransaction: "2025-03-18",
    transactions: [
      {
        id: "TRX-003",
        date: "2025-03-18",
        total: 175000,
        items: [
          { name: "Panadol", quantity: 1, price: 18000 },
          { name: "Vitamin D", quantity: 1, price: 85000 }
        ],
        hasPrescription: true,
        prescriptionImage: "/images/prescription-2.jpg",
        paymentMethod: "Debit Card"
      }
    ]
  },
  {
    id: 3,
    name: "Ahmad Hidayat",
    phone: "083456789012",
    email: "ahmad@example.com",
    address: "Jl. Thamrin No. 67, Jakarta",
    totalTransactions: 12,
    totalSpent: 1850000,
    lastTransaction: "2025-03-21",
    transactions: [
      {
        id: "TRX-004",
        date: "2025-03-21",
        total: 320000,
        items: [
          { name: "Insulin", quantity: 1, price: 250000 },
          { name: "Alcohol Swab", quantity: 2, price: 15000 }
        ],
        hasPrescription: true,
        prescriptionImage: "/images/prescription-3.jpg",
        paymentMethod: "BPJS"
      }
    ]
  },
  {
    id: 4,
    name: "Dewi Lestari",
    phone: "084567890123",
    email: "dewi@example.com",
    address: "Jl. Diponegoro No. 89, Jakarta",
    totalTransactions: 5,
    totalSpent: 750000,
    lastTransaction: "2025-03-19",
    transactions: [
      {
        id: "TRX-005",
        date: "2025-03-19",
        total: 125000,
        items: [
          { name: "Vitamin E", quantity: 1, price: 95000 },
          { name: "Plester", quantity: 2, price: 15000 }
        ],
        hasPrescription: false,
        paymentMethod: "E-Wallet"
      }
    ]
  },
  {
    id: 5,
    name: "Rudi Hartono",
    phone: "085678901234",
    email: "rudi@example.com",
    address: "Jl. Asia Afrika No. 101, Jakarta",
    totalTransactions: 20,
    totalSpent: 3250000,
    lastTransaction: "2025-03-22",
    transactions: [
      {
        id: "TRX-006",
        date: "2025-03-22",
        total: 450000,
        items: [
          { name: "Antibiotik", quantity: 1, price: 125000 },
          { name: "Vitamin C", quantity: 2, price: 25000 },
          { name: "Suplemen", quantity: 1, price: 275000 }
        ],
        hasPrescription: true,
        prescriptionImage: "/images/prescription-4.jpg",
        paymentMethod: "Credit Card"
      }
    ]
  }
];

// Client-side only component to avoid hydration errors
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <>{children}</>;
};

// Customer Detail Modal Component
const CustomerDetailModal = ({ customer }: { customer: Customer }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Use client-side only rendering for date formatting to prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Format date safely to prevent hydration errors
  const formatDate = (dateString: string) => {
    if (!isClient) return ''; // Return empty during SSR
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  return (
    <div className="p-1">
      {/* Tabs */}
      <div className="flex border-b mb-4 overflow-x-auto">
        <button 
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'profile' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil Pelanggan
        </button>
        <button 
          className={`px-4 py-2 whitespace-nowrap ${activeTab === 'transactions' ? 'text-orange-500 border-b-2 border-orange-500 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Riwayat Transaksi
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nama Lengkap</h3>
              <p className="mt-1">{customer.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">No. Telepon</h3>
              <p className="mt-1">{customer.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{customer.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Alamat</h3>
              <p className="mt-1">{customer.address}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Ringkasan Transaksi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-gray-500">Total Transaksi</h4>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{customer.totalTransactions}</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-gray-500">Total Pengeluaran</h4>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{formatRupiah(customer.totalSpent)}</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-gray-500">Transaksi Terakhir</h4>
                  <ClientOnly>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {formatDate(customer.lastTransaction)}
                    </p>
                  </ClientOnly>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div>
          {selectedTransaction ? (
            <div>
              <button 
                className="flex items-center text-orange-500 mb-4"
                onClick={() => setSelectedTransaction(null)}
              >
                <FaArrowLeft className="mr-1" /> Kembali ke daftar transaksi
              </button>
              
              <div className="bg-orange-50 p-4 rounded-lg mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <h3 className="text-lg font-medium">Transaksi #{selectedTransaction.id}</h3>
                  <ClientOnly>
                    <p className="text-sm text-gray-500 mt-1 sm:mt-0">
                      {formatDate(selectedTransaction.date)}
                    </p>
                  </ClientOnly>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2">
                  <p className="text-sm text-gray-500">Metode Pembayaran: {selectedTransaction.paymentMethod}</p>
                  <p className="font-bold text-orange-600 mt-1 sm:mt-0">{formatRupiah(selectedTransaction.total)}</p>
                </div>
              </div>

              <h4 className="font-medium mb-2">Rincian Transaksi Terakhir</h4>
              <div className="w-full bg-white rounded-lg shadow-md overflow-hidden mb-4">
                <ClientOnly>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-orange-500 to-orange-400">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Produk</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Jumlah</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Harga</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTransaction.items.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatRupiah(item.price)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatRupiah(item.price * item.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-orange-50">
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-sm text-right font-medium">Total</td>
                          <td className="px-6 py-4 text-sm text-orange-600 font-bold">{formatRupiah(selectedTransaction.total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </ClientOnly>
              </div>

              {selectedTransaction.hasPrescription && (
                <div>
                  <h4 className="font-medium mb-2">Resep Dokter</h4>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="relative h-64 w-full">
                      {/* Gunakan div dengan background-image sebagai fallback untuk Image */}
                      <div 
                        className="w-full h-full bg-contain bg-center bg-no-repeat rounded border border-gray-200"
                        style={{ 
                          backgroundImage: `url(${selectedTransaction.prescriptionImage || '/images/placeholder-prescription.jpg'})` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" className="flex items-center mr-2">
                        <FaPrint className="mr-1" /> Print
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <FaDownload className="mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <ClientOnly>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Transaksi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Metode Pembayaran</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Resep</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customer.transactions.map((transaction, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{transaction.id}</td>
                          <ClientOnly>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(transaction.date)}
                            </td>
                          </ClientOnly>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatRupiah(transaction.total)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{transaction.paymentMethod}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {transaction.hasPrescription ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FaFilePrescription className="mr-1" /> Ada
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Tidak Ada
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-orange-600 hover:text-orange-900"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              <FaEye size={14} className="mr-1" /> Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ClientOnly>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// New Customer Form Component
const NewCustomerForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to an API
    console.log('New customer data:', formData);
    // Add customer to the list (mock implementation)
    // In a real app, this would be handled by a state management solution
    alert('Customer added successfully!');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">No. Telepon</Label>
        <Input 
          id="phone" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Alamat</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">Simpan</Button>
      </DialogFooter>
    </form>
  );
};

// Customer Purchase Chart Component
const CustomerPurchaseChart = ({ customer }: { customer: Customer }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Ringkasan Transaksi</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Transaksi</h4>
              <p className="text-2xl font-bold text-orange-600 mt-1">{customer.totalTransactions}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Belanja</h4>
              <p className="text-2xl font-bold text-orange-600 mt-1">{formatRupiah(customer.totalSpent)}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Transaksi Terakhir</h4>
              <ClientOnly>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {new Date(customer.lastTransaction).toLocaleDateString('id-ID')}
                </p>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Customer Module
const CustomerModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: Math.ceil(mockCustomers.length / 10)
  });
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    date: undefined,
    minSpent: '',
    maxSpent: '',
    paymentMethods: [],
    hasPrescription: null
  });
  
  // Export function
  const exportToExcel = () => {
    const dataToExport = mockCustomers.map(customer => ({
      'Nama Pelanggan': customer.name,
      'No. Telepon': customer.phone,
      'Email': customer.email,
      'Alamat': customer.address,
      'Total Transaksi': customer.totalTransactions,
      'Total Pengeluaran': formatRupiah(customer.totalSpent),
      'Transaksi Terakhir': new Date(customer.lastTransaction).toLocaleDateString('id-ID')
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    
    // Generate file name with current date
    const fileName = `data_pelanggan_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // In browser environment, this would trigger a download
    XLSX.writeFile(workbook, fileName);
    alert(`Data telah diekspor ke ${fileName}`);
  };

  // Apply filters to customers
  const applyFilters = (customers: Customer[]) => {
    return customers.filter(customer => {
      // Filter by search term
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Filter by date if set
      if (filters.date) {
        const filterDate = filters.date.toISOString().split('T')[0];
        const hasTransactionOnDate = customer.transactions.some(
          t => t.date.split('T')[0] === filterDate
        );
        if (!hasTransactionOnDate) return false;
      }
      
      // Filter by min spent
      if (filters.minSpent && customer.totalSpent < parseFloat(filters.minSpent)) {
        return false;
      }
      
      // Filter by max spent
      if (filters.maxSpent && customer.totalSpent > parseFloat(filters.maxSpent)) {
        return false;
      }
      
      // Filter by payment methods
      if (filters.paymentMethods.length > 0) {
        const hasMatchingPaymentMethod = customer.transactions.some(
          t => filters.paymentMethods.includes(t.paymentMethod)
        );
        if (!hasMatchingPaymentMethod) return false;
      }
      
      // Filter by prescription
      if (filters.hasPrescription !== null) {
        const hasMatchingPrescriptionStatus = customer.transactions.some(
          t => t.hasPrescription === filters.hasPrescription
        );
        if (!hasMatchingPrescriptionStatus) return false;
      }
      
      return true;
    });
  };
  
  // Get filtered customers
  const filteredCustomers = applyFilters(mockCustomers);
  
  // Get paginated customers
  const paginatedCustomers = filteredCustomers.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  );
  
  // Update pagination when filters change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalPages: Math.ceil(filteredCustomers.length / prev.itemsPerPage)
    }));
  }, [filteredCustomers.length]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      date: undefined,
      minSpent: '',
      maxSpent: '',
      paymentMethods: [],
      hasPrescription: null
    });
    setShowFilters(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        segments={[
          { title: "Home", href: "/" },
          { title: "POS", href: "/pos" },
          { title: "Data Pelanggan", href: "/pos/customer" },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Pelanggan</h1>
        <Link href="/pos">
          <Button variant="outline" className="flex items-center">
            <FaArrowLeft className="mr-2" /> Kembali
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari pelanggan berdasarkan nama, telepon, atau email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" /> Filter
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={exportToExcel}
              >
                <FaDownload className="mr-2" /> Export
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setShowNewCustomerForm(true)}
              >
                + Tambah Pelanggan
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Filter Lanjutan</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="mr-1" /> Reset
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Filter */}
                <div>
                  <Label htmlFor="date-filter" className="block mb-1">Tanggal Transaksi</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <FaCalendarAlt className="mr-2" />
                        {filters.date ? (
                          <ClientOnly>
                            {format(filters.date, "PPP", { locale: id })}
                          </ClientOnly>
                        ) : (
                          "Pilih tanggal"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.date}
                        onSelect={(date) => setFilters(prev => ({ ...prev, date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Price Range */}
                <div>
                  <Label htmlFor="price-filter" className="block mb-1">Total Pengeluaran</Label>
                  <div className="flex gap-2">
                    <Input
                      id="min-spent"
                      placeholder="Min"
                      value={filters.minSpent}
                      onChange={(e) => setFilters(prev => ({ ...prev, minSpent: e.target.value }))}
                      className="w-1/2"
                    />
                    <Input
                      id="max-spent"
                      placeholder="Max"
                      value={filters.maxSpent}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxSpent: e.target.value }))}
                      className="w-1/2"
                    />
                  </div>
                </div>
                
                {/* Payment Method */}
                <div>
                  <Label className="block mb-1">Metode Pembayaran</Label>
                  <div className="space-y-2">
                    {['Cash', 'Credit Card', 'Debit Card', 'E-Wallet', 'BPJS'].map(method => (
                      <div key={method} className="flex items-center">
                        <Checkbox 
                          id={`payment-${method}`}
                          checked={filters.paymentMethods.includes(method)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({
                                ...prev,
                                paymentMethods: [...prev.paymentMethods, method]
                              }));
                            } else {
                              setFilters(prev => ({
                                ...prev,
                                paymentMethods: prev.paymentMethods.filter(m => m !== method)
                              }));
                            }
                          }}
                        />
                        <Label 
                          htmlFor={`payment-${method}`}
                          className="ml-2 text-sm font-normal"
                        >
                          {method}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Prescription Filter */}
                <div>
                  <Label className="block mb-1">Resep</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Checkbox 
                        id="prescription-yes"
                        checked={filters.hasPrescription === true}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            hasPrescription: checked ? true : null
                          }));
                        }}
                      />
                      <Label 
                        htmlFor="prescription-yes"
                        className="ml-2 text-sm font-normal"
                      >
                        Ada
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="prescription-no"
                        checked={filters.hasPrescription === false}
                        onCheckedChange={(checked) => {
                          setFilters(prev => ({
                            ...prev,
                            hasPrescription: checked ? false : null
                          }));
                        }}
                      />
                      <Label 
                        htmlFor="prescription-no"
                        className="ml-2 text-sm font-normal"
                      >
                        Tidak Ada
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsive Table Design */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto w-full">
        <ClientOnly>
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-orange-500 to-orange-400">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nama Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total Transaksi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total Belanja</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Transaksi Terakhir</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCustomers.map((customer, index) => (
                <tr key={customer.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-medium text-sm">{customer.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.phone}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.totalTransactions} transaksi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatRupiah(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ClientOnly>
                      {new Date(customer.lastTransaction).toLocaleDateString('id-ID')}
                    </ClientOnly>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-orange-600 hover:text-orange-900"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <FaEye size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Detail Pelanggan: {selectedCustomer?.name}</DialogTitle>
                        </DialogHeader>
                        {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} />}
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
              
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Tidak ada data pelanggan yang sesuai dengan filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ClientOnly>
      </div>
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
              className="hidden sm:flex"
            >
              Pertama
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Sebelumnya
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else {
                  const startPage = Math.max(1, pagination.currentPage - 2);
                  const endPage = Math.min(pagination.totalPages, startPage + 4);
                  pageNum = startPage + i;
                  
                  if (pageNum > endPage) {
                    return null;
                  }
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pagination.currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={pagination.currentPage === pageNum ? "bg-orange-500 text-white" : ""}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Selanjutnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="hidden sm:flex"
            >
              Terakhir
            </Button>
          </nav>
        </div>
      )}

      {/* Add New Customer Dialog */}
      <Dialog open={showNewCustomerForm} onOpenChange={setShowNewCustomerForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
          </DialogHeader>
          <NewCustomerForm onClose={() => setShowNewCustomerForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerModule;
