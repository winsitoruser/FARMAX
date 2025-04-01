import React, { useState } from 'react';
import Head from 'next/head';
import { 
  FaTags, FaPercent, FaTicketAlt, FaCreditCard, FaChartLine, 
  FaCalendarAlt, FaUsers, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes
} from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import DashonicLayout from '@/components/layouts/dashonic-layout';

// Sample data for vouchers
const sampleVouchers = [
  {
    id: 'v1',
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 100000,
    maxDiscount: 50000,
    validFrom: '2025-03-01',
    validUntil: '2025-04-30',
    usageCount: 45,
    status: 'active',
    category: 'new-user'
  },
  {
    id: 'v2',
    code: 'FARMASI50',
    discountType: 'fixed',
    discountValue: 50000,
    minPurchase: 200000,
    maxDiscount: 50000,
    validFrom: '2025-03-15',
    validUntil: '2025-05-15',
    usageCount: 32,
    status: 'active',
    category: 'product-specific'
  },
  {
    id: 'v3',
    code: 'MEMBER10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 50000,
    maxDiscount: 25000,
    validFrom: '2025-02-01',
    validUntil: '2025-12-31',
    usageCount: 128,
    status: 'active',
    category: 'member'
  },
  {
    id: 'v4',
    code: 'SEASONAL25',
    discountType: 'percentage',
    discountValue: 25,
    minPurchase: 150000,
    maxDiscount: 100000,
    validFrom: '2025-03-01',
    validUntil: '2025-03-15',
    usageCount: 89,
    status: 'expired',
    category: 'seasonal'
  },
  {
    id: 'v5',
    code: 'BUNDLE15',
    discountType: 'percentage',
    discountValue: 15,
    minPurchase: 75000,
    maxDiscount: 30000,
    validFrom: '2025-03-20',
    validUntil: '2025-06-30',
    usageCount: 56,
    status: 'active',
    category: 'bundle'
  }
];

// Sample data for promotions
const samplePromotions = [
  {
    id: 'p1',
    name: 'Diskon Obat Generik',
    discountType: 'percentage',
    discountValue: 15,
    applyTo: 'category',
    categoryId: 'generik',
    validFrom: '2025-03-01',
    validUntil: '2025-04-30',
    usageCount: 312,
    status: 'active'
  },
  {
    id: 'p2',
    name: 'Beli 2 Gratis 1',
    discountType: 'buy-x-get-y',
    buyQuantity: 2,
    getQuantity: 1,
    applyTo: 'product',
    productId: 'vitamin-c',
    validFrom: '2025-03-15',
    validUntil: '2025-05-15',
    usageCount: 89,
    status: 'active'
  },
  {
    id: 'p3',
    name: 'Diskon Akhir Pekan',
    discountType: 'percentage',
    discountValue: 10,
    applyTo: 'all',
    validDays: ['Friday', 'Saturday', 'Sunday'],
    validFrom: '2025-03-01',
    validUntil: '2025-12-31',
    usageCount: 498,
    status: 'active'
  },
  {
    id: 'p4',
    name: 'Diskon Ulang Tahun',
    discountType: 'percentage',
    discountValue: 20,
    applyTo: 'customer',
    customerType: 'birthday',
    validFrom: '2025-01-01',
    validUntil: '2025-12-31',
    usageCount: 76,
    status: 'active'
  }
];

// Sample statistics data
const statistics = {
  totalDiscountAmount: 12500000,
  totalDiscountCount: 1567,
  averageDiscountValue: 7978,
  topVoucherCode: 'WELCOME20',
  topVoucherUsage: 245,
  topPromotionName: 'Diskon Akhir Pekan',
  topPromotionUsage: 498,
  discountValueByType: {
    percentage: 9870000,
    fixed: 2630000
  }
};

// Helper function to format currency in IDR
const formatIDR = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const DiscountsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('vouchers');

  return (
    <DashonicLayout>
      <Head>
        <title>Manajemen Diskon & Promosi | Farmanesia</title>
      </Head>
      
      <div className="max-w-7xl mx-auto">
        {/* Decorative header with gradient */}
        <div className="relative rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-4 mb-4 shadow-md overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4 backdrop-blur-sm">
              <FaTags className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Manajemen Diskon & Promosi</h1>
              <p className="text-sm text-white/80">Kelola voucher, promo, dan pantau efektivitas program diskon</p>
            </div>
          </div>
        </div>
        
        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-medium flex items-center text-gray-700">
                <FaCreditCard className="mr-2 text-orange-500" />
                Total Nilai Diskon
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Periode Maret 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-800">{formatIDR(statistics.totalDiscountAmount)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Dari {statistics.totalDiscountCount} transaksi
                <span className="inline-block ml-1 text-green-600">
                  +12.5% dari bulan lalu
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-medium flex items-center text-gray-700">
                <FaTicketAlt className="mr-2 text-orange-500" />
                Voucher Terpopuler
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Berdasarkan jumlah penggunaan
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-gray-800">{statistics.topVoucherCode}</div>
              <div className="text-xs text-gray-500 mt-1">
                Digunakan {statistics.topVoucherUsage} kali
                <span className="inline-block ml-1 text-green-600">
                  +8.2% dari bulan lalu
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-medium flex items-center text-gray-700">
                <FaPercent className="mr-2 text-orange-500" />
                Promosi Terpopuler
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Berdasarkan jumlah transaksi
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-gray-800 truncate">{statistics.topPromotionName}</div>
              <div className="text-xs text-gray-500 mt-1">
                {statistics.topPromotionUsage} transaksi
                <span className="inline-block ml-1 text-green-600">
                  +15.3% dari bulan lalu
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content tabs */}
        <Tabs 
          defaultValue="vouchers" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <TabsList className="grid grid-cols-2 bg-gray-100 rounded-lg p-0.5 w-64">
              <TabsTrigger 
                value="vouchers" 
                className="text-xs py-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <FaTicketAlt className="mr-1.5 text-xs" /> Voucher
              </TabsTrigger>
              <TabsTrigger 
                value="promotions" 
                className="text-xs py-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
              >
                <FaPercent className="mr-1.5 text-xs" /> Promosi
              </TabsTrigger>
            </TabsList>
            
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <FaPlus className="w-3 h-3" />
                    <span>Tambah {activeTab === 'vouchers' ? 'Voucher' : 'Promosi'}</span>
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-md overflow-hidden rounded-lg border-0">
                  {/* Decorative top header with gradient */}
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-orange-500 to-red-500 z-0">
                    <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-white/20"></div>
                    <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-white/10"></div>
                  </div>
                  
                  <DialogHeader className="relative z-10 pt-4 pb-2 px-4">
                    <DialogTitle className="text-lg font-semibold text-white">
                      {activeTab === 'vouchers' ? 'Tambah Voucher Baru' : 'Tambah Promosi Baru'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-white/90">
                      {activeTab === 'vouchers' 
                        ? 'Isi data berikut untuk membuat voucher diskon baru'
                        : 'Isi data berikut untuk membuat promosi diskon baru'
                      }
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="bg-white relative z-10 rounded-t-2xl -mt-2 px-4 pt-4 pb-3">
                    {activeTab === 'vouchers' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor="code" className="text-xs font-medium text-gray-700">Kode Voucher</label>
                            <Input 
                              id="code"
                              placeholder="WELCOME20" 
                              className="text-xs h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="category" className="text-xs font-medium text-gray-700">Kategori</label>
                            <Input 
                              id="category"
                              placeholder="new-user, seasonal, etc" 
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor="discountType" className="text-xs font-medium text-gray-700">Jenis Diskon</label>
                            <select 
                              id="discountType"
                              className="w-full text-xs h-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent px-2"
                            >
                              <option value="percentage">Persentase (%)</option>
                              <option value="fixed">Nominal Tetap (Rp)</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="discountValue" className="text-xs font-medium text-gray-700">Nilai Diskon</label>
                            <Input 
                              id="discountValue"
                              type="number" 
                              placeholder="20" 
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor="minPurchase" className="text-xs font-medium text-gray-700">Min. Pembelian (Rp)</label>
                            <Input 
                              id="minPurchase"
                              type="number" 
                              placeholder="100000" 
                              className="text-xs h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="maxDiscount" className="text-xs font-medium text-gray-700">Maks. Diskon (Rp)</label>
                            <Input 
                              id="maxDiscount"
                              type="number" 
                              placeholder="50000" 
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor="validFrom" className="text-xs font-medium text-gray-700">Berlaku Dari</label>
                            <Input 
                              id="validFrom"
                              type="date" 
                              className="text-xs h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="validUntil" className="text-xs font-medium text-gray-700">Berlaku Hingga</label>
                            <Input 
                              id="validUntil"
                              type="date" 
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="status" className="text-xs font-medium text-gray-700">Status</label>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-1 text-xs">
                              <input type="radio" name="status" value="active" checked />
                              <span>Aktif</span>
                            </label>
                            <label className="flex items-center space-x-1 text-xs">
                              <input type="radio" name="status" value="inactive" />
                              <span>Tidak Aktif</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label htmlFor="promoName" className="text-xs font-medium text-gray-700">Nama Promosi</label>
                          <Input 
                            id="promoName"
                            placeholder="Diskon Akhir Pekan" 
                            className="text-xs h-8"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor="promoDiscountType" className="text-xs font-medium text-gray-700">Jenis Diskon</label>
                            <select 
                              id="promoDiscountType"
                              className="w-full text-xs h-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent px-2"
                            >
                              <option value="percentage">Persentase (%)</option>
                              <option value="fixed">Nominal Tetap (Rp)</option>
                              <option value="buy-x-get-y">Beli X Gratis Y</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="promoDiscountValue" className="text-xs font-medium text-gray-700">Nilai Diskon</label>
                            <Input 
                              id="promoDiscountValue"
                              type="number" 
                              placeholder="10" 
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor="applyTo" className="text-xs font-medium text-gray-700">Berlaku Untuk</label>
                            <select 
                              id="applyTo"
                              className="w-full text-xs h-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent px-2"
                            >
                              <option value="all">Semua Produk</option>
                              <option value="category">Kategori</option>
                              <option value="product">Produk</option>
                              <option value="customer">Pelanggan</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="selectedItem" className="text-xs font-medium text-gray-700">Pilih Item</label>
                            <Input 
                              id="selectedItem"
                              placeholder="ID Kategori/Produk" 
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label htmlFor="validFromPromo" className="text-xs font-medium text-gray-700">Berlaku Dari</label>
                            <Input 
                              id="validFromPromo"
                              type="date" 
                              className="text-xs h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="validUntilPromo" className="text-xs font-medium text-gray-700">Berlaku Hingga</label>
                            <Input 
                              id="validUntilPromo"
                              type="date" 
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Hari Berlaku</label>
                          <div className="flex flex-wrap gap-2">
                            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                              <label key={day} className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-md text-xs">
                                <input type="checkbox" name="validDays" value={day} />
                                <span>{day}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label htmlFor="promoStatus" className="text-xs font-medium text-gray-700">Status</label>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-1 text-xs">
                              <input type="radio" name="promoStatus" value="active" checked />
                              <span>Aktif</span>
                            </label>
                            <label className="flex items-center space-x-1 text-xs">
                              <input type="radio" name="promoStatus" value="inactive" />
                              <span>Tidak Aktif</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Batal
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs h-8 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md"
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Vouchers Tab Content */}
          <TabsContent value="vouchers" className="p-0">
            <div className="overflow-hidden rounded-b-lg">
              <div className="relative">
                {/* Table Search & Filter Bar */}
                <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Cari kode voucher..."
                      className="w-full py-1.5 pl-8 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="text-xs h-8 rounded-md border border-gray-200 px-2 focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="all">Semua Status</option>
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                      <option value="expired">Kadaluarsa</option>
                    </select>
                    <select className="text-xs h-8 rounded-md border border-gray-200 px-2 focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="all">Semua Kategori</option>
                      <option value="new-user">Pengguna Baru</option>
                      <option value="seasonal">Musiman</option>
                      <option value="member">Member</option>
                    </select>
                  </div>
                </div>
                
                {/* Table Container */}
                <div className="max-h-[calc(100vh-420px)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
                  <table className="w-full border-collapse table-fixed min-w-[800px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gradient-to-r from-orange-500 to-red-500">
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-28">Kode Voucher</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-20">Jenis</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-20">Nilai</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-24">Min. Pembelian</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-32">Periode</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-20">Kategori</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-16">Status</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleVouchers.map((voucher) => (
                        <tr key={voucher.id} className="hover:bg-orange-50/50 border-b border-orange-100/30">
                          <td className="text-xs py-1.5 px-3 font-medium">{voucher.code}</td>
                          <td className="text-xs py-1.5 px-3">
                            {voucher.discountType === 'percentage' ? 'Persentase' : 'Nominal Tetap'}
                          </td>
                          <td className="text-xs py-1.5 px-3">
                            {voucher.discountType === 'percentage' 
                              ? `${voucher.discountValue}%` 
                              : formatIDR(voucher.discountValue)}
                          </td>
                          <td className="text-xs py-1.5 px-3">{formatIDR(voucher.minPurchase)}</td>
                          <td className="text-xs py-1.5 px-3">{voucher.validFrom} - {voucher.validUntil}</td>
                          <td className="text-xs py-1.5 px-3">
                            <Badge className="text-[10px] bg-orange-100 text-orange-800 hover:bg-orange-200">
                              {voucher.category}
                            </Badge>
                          </td>
                          <td className="text-xs py-1.5 px-3">
                            <Badge 
                              className={`text-[10px] ${
                                voucher.status === 'active' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : voucher.status === 'inactive'
                                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {voucher.status === 'active' ? 'Aktif' : voucher.status === 'inactive' ? 'Tidak Aktif' : 'Kadaluarsa'}
                            </Badge>
                          </td>
                          <td className="text-xs py-1.5 px-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button className="p-1 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full">
                                <FaEdit size={12} />
                              </button>
                              <button className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Menampilkan 5 dari 25 voucher
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7 text-xs">
                      &lt;
                    </Button>
                    <Button variant="default" size="icon" className="h-7 w-7 text-xs bg-gradient-to-r from-orange-500 to-red-500">
                      1
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 text-xs">
                      2
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 text-xs">
                      3
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 text-xs">
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Promotions Tab Content */}
          <TabsContent value="promotions" className="p-0">
            <div className="overflow-hidden rounded-b-lg">
              <div className="relative">
                {/* Table Search & Filter Bar */}
                <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Cari nama promosi..."
                      className="w-full py-1.5 pl-8 pr-3 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="text-xs h-8 rounded-md border border-gray-200 px-2 focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="all">Semua Status</option>
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                      <option value="expired">Kadaluarsa</option>
                    </select>
                    <select className="text-xs h-8 rounded-md border border-gray-200 px-2 focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="all">Semua Tipe</option>
                      <option value="percentage">Persentase</option>
                      <option value="fixed">Nominal</option>
                      <option value="buy-x-get-y">Beli X Gratis Y</option>
                    </select>
                  </div>
                </div>
                
                {/* Table Container */}
                <div className="max-h-[calc(100vh-420px)] overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-gray-50">
                  <table className="w-full border-collapse table-fixed min-w-[800px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gradient-to-r from-orange-500 to-red-500">
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-28">Kode Promo</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-32">Nama Promo</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-20">Jenis</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-20">Nilai</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-24">Target</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-32">Periode</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-20">Penggunaan</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-left w-16">Status</th>
                        <th className="text-xs text-white py-2 px-3 font-medium text-right w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {samplePromotions.map((promo) => (
                        <tr key={promo.id} className="hover:bg-orange-50/50 border-b border-orange-100/30">
                          <td className="text-xs py-1.5 px-3 font-medium">{promo.code}</td>
                          <td className="text-xs py-1.5 px-3">{promo.name}</td>
                          <td className="text-xs py-1.5 px-3">
                            {promo.discountType === 'percentage' 
                              ? 'Persentase' 
                              : promo.discountType === 'buy-x-get-y'
                                ? 'Beli X Gratis Y'
                                : 'Nominal Tetap'
                            }
                          </td>
                          <td className="text-xs py-1.5 px-3">
                            {promo.discountType === 'percentage' 
                              ? `${promo.discountValue}%` 
                              : promo.discountType === 'buy-x-get-y'
                                ? `Beli ${promo.buyQuantity} Gratis ${promo.getQuantity}`
                                : formatIDR(promo.discountValue || 0)
                            }
                          </td>
                          <td className="text-xs py-1.5 px-3">
                            {promo.applyTo === 'all' 
                              ? 'Semua Produk'
                              : promo.applyTo === 'category'
                                ? 'Kategori'
                                : promo.applyTo === 'product'
                                  ? 'Produk'
                                  : 'Pelanggan'
                            }
                          </td>
                          <td className="text-xs py-1.5 px-3">{promo.validFrom} - {promo.validUntil}</td>
                          <td className="text-xs py-1.5 px-3">{promo.usageCount} kali</td>
                          <td className="text-xs py-1.5 px-3">
                            <Badge 
                              className={`text-[10px] ${
                                promo.status === 'active' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : promo.status === 'inactive'
                                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {promo.status === 'active' ? 'Aktif' : promo.status === 'inactive' ? 'Tidak Aktif' : 'Kadaluarsa'}
                            </Badge>
                          </td>
                          <td className="text-xs py-1.5 px-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button className="p-1 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-full">
                                <FaEdit size={12} />
                              </button>
                              <button className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full">
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Table Footer */}
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Menampilkan 4 dari 12 promosi
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7 text-xs">
                      &lt;
                    </Button>
                    <Button variant="default" size="icon" className="h-7 w-7 text-xs bg-gradient-to-r from-orange-500 to-red-500">
                      1
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 text-xs">
                      2
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 text-xs">
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashonicLayout>
  );
};

export default DiscountsPage;
