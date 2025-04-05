import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, FaFileExport, FaBoxOpen, FaTags, 
  FaWarehouse, FaSort, FaSortUp, FaSortDown, FaDownload
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  LineChart, Line, CartesianGrid, XAxis, YAxis, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

// Import dinamis untuk chart.js
// const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Data sampel untuk stok
const sampleStockData = [
  // Obat Bebas
  { id: 'P001', name: 'Paracetamol 500mg', category: 'Obat Bebas', branch: 'Apotek Pusat - Jakarta', stock: 850, minStock: 200, maxStock: 1000, value: 850 * 12500, lowStock: false, overStock: false, branchId: 'BR001', categoryId: 'CAT001' },
  { id: 'P002', name: 'Ibuprofen 400mg', category: 'Obat Bebas', branch: 'Cabang Bandung', stock: 420, minStock: 150, maxStock: 600, value: 420 * 15000, lowStock: false, overStock: false, branchId: 'BR002', categoryId: 'CAT001' },
  { id: 'P003', name: 'Antasida Tablet', category: 'Obat Bebas', branch: 'Cabang Surabaya', stock: 320, minStock: 100, maxStock: 500, value: 320 * 10000, lowStock: false, overStock: false, branchId: 'BR003', categoryId: 'CAT001' },
  
  // Obat Bebas Terbatas
  { id: 'P004', name: 'CTM 4mg', category: 'Obat Bebas Terbatas', branch: 'Apotek Pusat - Jakarta', stock: 620, minStock: 200, maxStock: 800, value: 620 * 8000, lowStock: false, overStock: false, branchId: 'BR001', categoryId: 'CAT002' },
  { id: 'P005', name: 'Pseudoephedrine 30mg', category: 'Obat Bebas Terbatas', branch: 'Cabang Medan', stock: 180, minStock: 150, maxStock: 400, value: 180 * 25000, lowStock: false, overStock: false, branchId: 'BR004', categoryId: 'CAT002' },
  
  // Obat Keras
  { id: 'P006', name: 'Amoxicillin 500mg', category: 'Obat Keras', branch: 'Apotek Pusat - Jakarta', stock: 480, minStock: 150, maxStock: 600, value: 480 * 35000, lowStock: false, overStock: false, branchId: 'BR001', categoryId: 'CAT003' },
  { id: 'P007', name: 'Ciprofloxacin 500mg', category: 'Obat Keras', branch: 'Cabang Bandung', stock: 150, minStock: 100, maxStock: 300, value: 150 * 40000, lowStock: false, overStock: false, branchId: 'BR002', categoryId: 'CAT003' },
  
  // Antibiotik
  { id: 'P008', name: 'Cefixime 100mg', category: 'Antibiotik', branch: 'Cabang Surabaya', stock: 25, minStock: 50, maxStock: 150, value: 25 * 45000, lowStock: true, overStock: false, branchId: 'BR003', categoryId: 'CAT004' },
  { id: 'P009', name: 'Ceftriaxone 1g Inj', category: 'Antibiotik', branch: 'Cabang Medan', stock: 60, minStock: 30, maxStock: 100, value: 60 * 120000, lowStock: false, overStock: false, branchId: 'BR004', categoryId: 'CAT004' },
  
  // Vitamin dan Suplemen
  { id: 'P010', name: 'Vitamin C 1000mg', category: 'Vitamin dan Suplemen', branch: 'Apotek Pusat - Jakarta', stock: 1200, minStock: 500, maxStock: 1000, value: 1200 * 15000, lowStock: false, overStock: true, branchId: 'BR001', categoryId: 'CAT005' },
  { id: 'P011', name: 'Vitamin B Complex', category: 'Vitamin dan Suplemen', branch: 'Cabang Bandung', stock: 850, minStock: 300, maxStock: 800, value: 850 * 28000, lowStock: false, overStock: true, branchId: 'BR002', categoryId: 'CAT005' },
  
  // Alat Kesehatan
  { id: 'P012', name: 'Masker Medis', category: 'Alat Kesehatan', branch: 'Cabang Surabaya', stock: 2500, minStock: 1000, maxStock: 3000, value: 2500 * 8000, lowStock: false, overStock: false, branchId: 'BR003', categoryId: 'CAT006' },
  { id: 'P013', name: 'Hand Sanitizer 500ml', category: 'Alat Kesehatan', branch: 'Cabang Medan', stock: 15, minStock: 50, maxStock: 200, value: 15 * 35000, lowStock: true, overStock: false, branchId: 'BR004', categoryId: 'CAT006' },
];

// Data ringkasan stok per cabang
const stockSummaryByBranch = [
  { branch: 'Apotek Pusat - Jakarta', branchId: 'BR001', totalStock: 3150, totalValue: 105250000, lowStockCount: 0, overStockCount: 1 },
  { branch: 'Cabang Bandung', branchId: 'BR002', totalStock: 1420, totalValue: 48100000, lowStockCount: 0, overStockCount: 1 },
  { branch: 'Cabang Surabaya', branchId: 'BR003', totalStock: 2845, totalValue: 33900000, lowStockCount: 1, overStockCount: 0 },
  { branch: 'Cabang Medan', branchId: 'BR004', totalStock: 255, totalValue: 12025000, lowStockCount: 1, overStockCount: 0 },
];

// Data ringkasan stok per kategori
const stockSummaryByCategory = [
  { category: 'Obat Bebas', categoryId: 'CAT001', totalStock: 1590, totalValue: 23350000, lowStockCount: 0, overStockCount: 0, percentage: 25 },
  { category: 'Obat Bebas Terbatas', categoryId: 'CAT002', totalStock: 800, totalValue: 9460000, lowStockCount: 0, overStockCount: 0, percentage: 12 },
  { category: 'Obat Keras', categoryId: 'CAT003', totalStock: 630, totalValue: 22800000, lowStockCount: 0, overStockCount: 0, percentage: 10 },
  { category: 'Antibiotik', categoryId: 'CAT004', totalStock: 85, totalValue: 8325000, lowStockCount: 1, overStockCount: 0, percentage: 2 },
  { category: 'Vitamin dan Suplemen', categoryId: 'CAT005', totalStock: 2050, totalValue: 41800000, lowStockCount: 0, overStockCount: 2, percentage: 32 },
  { category: 'Alat Kesehatan', categoryId: 'CAT006', totalStock: 2515, totalValue: 20525000, lowStockCount: 1, overStockCount: 0, percentage: 19 },
];

interface LaporanStokProps {
  startDate?: Date;
  endDate?: Date;
  filterCabang: string;
  filterKategori: string;
}

const LaporanStok: React.FC<LaporanStokProps> = ({
  startDate,
  endDate,
  filterCabang,
  filterKategori
}) => {
  const [activeTab, setActiveTab] = useState('ringkasan');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const itemsPerPage = 10;
  
  // Filter data stok
  const filteredStockData = sampleStockData.filter(item => {
    if (filterCabang !== 'all' && item.branchId !== filterCabang) {
      return false;
    }
    
    if (filterKategori !== 'all' && item.categoryId !== filterKategori) {
      return false;
    }
    
    return true;
  });
  
  // Filter data ringkasan cabang
  const filteredBranchSummary = stockSummaryByBranch.filter(branch => {
    if (filterCabang !== 'all' && branch.branchId !== filterCabang) {
      return false;
    }
    
    return true;
  });
  
  // Filter data ringkasan kategori
  const filteredCategorySummary = stockSummaryByCategory.filter(category => {
    if (filterKategori !== 'all' && category.categoryId !== filterKategori) {
      return false;
    }
    
    return true;
  });
  
  // Sort data
  const sortedStockData = [...filteredStockData].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'stock') {
      return sortOrder === 'asc'
        ? a.stock - b.stock
        : b.stock - a.stock;
    } else if (sortBy === 'value') {
      return sortOrder === 'asc'
        ? a.value - b.value
        : b.value - a.value;
    } else if (sortBy === 'category') {
      return sortOrder === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortBy === 'branch') {
      return sortOrder === 'asc'
        ? a.branch.localeCompare(b.branch)
        : b.branch.localeCompare(a.branch);
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedStockData.length / itemsPerPage);
  const paginatedStockData = sortedStockData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handler Sort
  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  
  // Helper untuk mendapatkan ikon sort
  const getSortIcon = (column: string) => {
    if (column !== sortBy) return <FaSort size={14} className="text-gray-300" />;
    return sortOrder === 'asc' ? <FaSortUp size={14} /> : <FaSortDown size={14} />;
  };
  
  // Format data for Recharts
  const formattedCategoryData = filteredCategorySummary.map(item => ({
    name: item.category,
    value: item.totalStock
  }));
  
  // Format data for branch bar chart
  const formattedBranchData = filteredBranchSummary.map(item => ({
    name: item.branch,
    value: item.totalValue
  }));
  
  // Custom colors for pie chart
  const CATEGORY_COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fde68a'];
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 max-w-md">
          <TabsTrigger value="ringkasan" className="flex items-center gap-2">
            <FaChartBar size={14} />
            <span>Ringkasan Stok</span>
          </TabsTrigger>
          <TabsTrigger value="detail" className="flex items-center gap-2">
            <FaBoxOpen size={14} />
            <span>Detail Produk</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ringkasan" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FaBoxOpen className="text-orange-500" size={16} />
                  <span>Total Produk</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStockData.length} produk
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredStockData.reduce((acc, item) => acc + item.stock, 0).toLocaleString()} unit total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FaTags className="text-orange-500" size={16} />
                  <span>Nilai Stok</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatRupiah(filteredStockData.reduce((acc, item) => acc + item.value, 0))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Rata-rata: {formatRupiah(Math.round(filteredStockData.reduce((acc, item) => acc + item.value, 0) / (filteredStockData.length || 1)))} / produk
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FaWarehouse className="text-red-500" size={16} />
                  <span>Stok Menipis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStockData.filter(item => item.lowStock).length} produk
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Nilai: {formatRupiah(filteredStockData.filter(item => item.lowStock).reduce((acc, item) => acc + item.value, 0))}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FaBoxOpen className="text-amber-500" size={16} />
                  <span>Stok Berlebih</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredStockData.filter(item => item.overStock).length} produk
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Nilai: {formatRupiah(filteredStockData.filter(item => item.overStock).reduce((acc, item) => acc + item.value, 0))}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart stok per kategori */}
            <Card className="shadow-md border-orange-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaTags className="text-orange-500" />
                    <span>Stok per Kategori</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Distribusi stok berdasarkan kategori produk
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isMounted && filteredCategorySummary.length > 0 ? (
                  <ClientOnlyRecharts height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={formattedCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={110}
                          innerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: { name: string; percent: number }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {formattedCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`${value.toLocaleString()} unit`, 'Jumlah']}
                          contentStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '4px'
                          }}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            paddingTop: '20px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Tidak ada data kategori untuk ditampilkan
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Chart stok per cabang */}
            <Card className="shadow-md border-orange-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaWarehouse className="text-orange-500" />
                    <span>Stok per Cabang</span>
                  </div>
                </CardTitle>
                <CardDescription>
                  Nilai stok pada setiap cabang
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isMounted && filteredBranchSummary.length > 0 ? (
                  <ClientOnlyRecharts height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={formattedBranchData}
                        margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${Math.round(value/1000000)} jt`}
                          label={{ value: 'Nilai Stok (jt)', angle: -90, position: 'insideLeft', dy: 50 }}
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatRupiah(value), 'Nilai Stok']}
                          contentStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '4px'
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            fontSize: '12px',
                            fontFamily: 'Inter, sans-serif',
                            paddingTop: '20px'
                          }}
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#fdba74" stopOpacity={0.5}/>
                          </linearGradient>
                        </defs>
                        <Bar 
                          dataKey="value" 
                          name="Nilai Stok" 
                          fill="url(#barGradient)" 
                          radius={[4, 4, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ClientOnlyRecharts>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Tidak ada data cabang untuk ditampilkan
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Button variant="outline" className="float-right">
            <FaDownload className="mr-2 h-4 w-4" />
            <span>Download Laporan Ringkasan</span>
          </Button>
        </TabsContent>
        
        <TabsContent value="detail" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaBoxOpen className="text-orange-500" />
                  <span>Detail Stok Produk</span>
                </div>
                <Button variant="outline" size="sm">
                  <FaDownload className="mr-2 h-4 w-4" />
                  <span>Export</span>
                </Button>
              </CardTitle>
              <CardDescription>
                {startDate && endDate && (
                  <>Periode: {format(startDate, 'dd MMM yyyy', { locale: id })} - {format(endDate, 'dd MMM yyyy', { locale: id })}</>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-1">
                          Nama Produk
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('category')}
                      >
                        <div className="flex items-center gap-1">
                          Kategori
                          {getSortIcon('category')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => handleSort('branch')}
                      >
                        <div className="flex items-center gap-1">
                          Cabang
                          {getSortIcon('branch')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer text-center"
                        onClick={() => handleSort('stock')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Stok
                          {getSortIcon('stock')}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Min-Max</TableHead>
                      <TableHead 
                        className="cursor-pointer text-right"
                        onClick={() => handleSort('value')}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Nilai
                          {getSortIcon('value')}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStockData.length > 0 ? (
                      paginatedStockData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.branch}</TableCell>
                          <TableCell className="text-center">{item.stock.toLocaleString()}</TableCell>
                          <TableCell className="text-center">{item.minStock} - {item.maxStock}</TableCell>
                          <TableCell className="text-right">{formatRupiah(item.value)}</TableCell>
                          <TableCell className="text-center">
                            {item.lowStock ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                Stok Menipis
                              </span>
                            ) : item.overStock ? (
                              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                                Stok Berlebih
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Normal
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Tidak ada data stok yang sesuai dengan filter
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {filteredStockData.length > 0 && (
                <div className="flex items-center justify-between space-x-2 py-4 px-4">
                  <div className="text-sm text-gray-500">
                    Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredStockData.length)} - {Math.min(currentPage * itemsPerPage, filteredStockData.length)} dari {filteredStockData.length} produk
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages || totalPages === 0}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaporanStok;
