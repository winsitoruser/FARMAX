import React, { useState, useEffect } from 'react';
import { 
  FaBoxes, FaSearch, FaSort, FaSortUp, FaSortDown, 
  FaFileExport, FaArrowDown, FaArrowUp, FaDownload
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

// Data sampel pergerakan stok
const sampleStockMovements = [
  {
    id: 'SM001',
    productId: 'P001',
    productName: 'Paracetamol 500mg',
    category: 'Obat Bebas',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    date: '2025-03-30T10:15:00',
    movementType: 'out',
    source: 'pos', // pos, transfer, adjustment, expiry
    referenceId: 'TX001',
    referenceNumber: 'INV/2025/03/001',
    quantity: 2,
    stockBefore: 852,
    stockAfter: 850,
    unitPrice: 25000,
    value: 50000
  },
  {
    id: 'SM002',
    productId: 'P006',
    productName: 'Amoxicillin 500mg',
    category: 'Obat Keras',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    date: '2025-03-30T10:15:00',
    movementType: 'out',
    source: 'pos',
    referenceId: 'TX001',
    referenceNumber: 'INV/2025/03/001',
    quantity: 1,
    stockBefore: 481,
    stockAfter: 480,
    unitPrice: 75000,
    value: 75000
  },
  {
    id: 'SM003',
    productId: 'P010',
    productName: 'Vitamin C 1000mg',
    category: 'Vitamin dan Suplemen',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    date: '2025-03-30T10:15:00',
    movementType: 'out',
    source: 'pos',
    referenceId: 'TX001',
    referenceNumber: 'INV/2025/03/001',
    quantity: 2,
    stockBefore: 1202,
    stockAfter: 1200,
    unitPrice: 25000,
    value: 50000
  },
  {
    id: 'SM004',
    productId: 'P006',
    productName: 'Amoxicillin 500mg',
    category: 'Obat Keras',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    date: '2025-03-30T11:20:00',
    movementType: 'out',
    source: 'pos',
    referenceId: 'TX002',
    referenceNumber: 'INV/2025/03/002',
    quantity: 2,
    stockBefore: 480,
    stockAfter: 478,
    unitPrice: 75000,
    value: 150000
  },
  {
    id: 'SM005',
    productId: 'P011',
    productName: 'Vitamin B Complex',
    category: 'Vitamin dan Suplemen',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    date: '2025-03-30T11:20:00',
    movementType: 'out',
    source: 'pos',
    referenceId: 'TX002',
    referenceNumber: 'INV/2025/03/002',
    quantity: 2,
    stockBefore: 852,
    stockAfter: 850,
    unitPrice: 85000,
    value: 170000
  },
  {
    id: 'SM006',
    productId: 'P001',
    productName: 'Paracetamol 500mg',
    category: 'Obat Bebas',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    date: '2025-03-30T12:00:00',
    movementType: 'in',
    source: 'purchase',
    referenceId: 'PO005',
    referenceNumber: 'PO-2025-03-005',
    quantity: 150,
    stockBefore: 850,
    stockAfter: 1000,
    unitPrice: 20000,
    value: 3000000
  },
  {
    id: 'SM007',
    productId: 'P007',
    productName: 'Ciprofloxacin 500mg',
    category: 'Obat Keras',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    date: '2025-03-30T13:45:00',
    movementType: 'out',
    source: 'pos',
    referenceId: 'TX003',
    referenceNumber: 'INV/2025/03/003',
    quantity: 1,
    stockBefore: 151,
    stockAfter: 150,
    unitPrice: 40000,
    value: 40000
  },
  {
    id: 'SM008',
    productId: 'P007',
    productName: 'Ciprofloxacin 500mg',
    category: 'Obat Keras',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    date: '2025-03-30T13:50:00',
    movementType: 'in',
    source: 'transfer',
    referenceId: 'TR005',
    referenceNumber: 'TRF-2025-03-005',
    quantity: 50,
    stockBefore: 150,
    stockAfter: 200,
    unitPrice: 35000,
    value: 1750000
  },
  {
    id: 'SM009',
    productId: 'P003',
    productName: 'Antasida Tablet',
    category: 'Obat Bebas',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    date: '2025-03-30T14:30:00',
    movementType: 'out',
    source: 'pos',
    referenceId: 'TX004',
    referenceNumber: 'INV/2025/03/004',
    quantity: 2,
    stockBefore: 322,
    stockAfter: 320,
    unitPrice: 10000,
    value: 20000
  },
  {
    id: 'SM010',
    productId: 'P008',
    productName: 'Cefixime 100mg',
    category: 'Antibiotik',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    date: '2025-03-30T14:30:00',
    movementType: 'out',
    source: 'pos',
    referenceId: 'TX004',
    referenceNumber: 'INV/2025/03/004',
    quantity: 1,
    stockBefore: 26,
    stockAfter: 25,
    unitPrice: 45000,
    value: 45000
  }
];

// Data ringkasan per kategori untuk chart
const stockMovementByCategory = [
  { category: 'Obat Bebas', in: 3000000, out: 70000 },
  { category: 'Obat Keras', in: 1750000, out: 265000 },
  { category: 'Vitamin dan Suplemen', in: 0, out: 220000 },
  { category: 'Antibiotik', in: 0, out: 45000 },
  { category: 'Alat Kesehatan', in: 0, out: 0 },
  { category: 'Obat Bebas Terbatas', in: 0, out: 0 }
];

interface StokProductProps {
  startDate?: Date;
  endDate?: Date;
  filterCabang: string;
}

const StokProduct: React.FC<StokProductProps> = ({
  startDate,
  endDate,
  filterCabang
}) => {
  // State untuk filter dan sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [movementTypeFilter, setMovementTypeFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter pergerakan stok
  const filteredMovements = sampleStockMovements.filter(movement => {
    // Filter berdasarkan cabang
    if (filterCabang !== 'all' && movement.branchId !== filterCabang) {
      return false;
    }
    
    // Filter berdasarkan rentang tanggal
    if (startDate && endDate) {
      const movementDate = new Date(movement.date);
      if (movementDate < startDate || movementDate > endDate) {
        return false;
      }
    }
    
    // Filter berdasarkan tipe pergerakan
    if (movementTypeFilter !== 'all' && movement.movementType !== movementTypeFilter) {
      return false;
    }
    
    // Filter berdasarkan kategori
    if (categoryFilter !== 'all' && movement.category !== categoryFilter) {
      return false;
    }
    
    // Filter berdasarkan sumber
    if (sourceFilter !== 'all' && movement.source !== sourceFilter) {
      return false;
    }
    
    // Filter berdasarkan pencarian
    if (
      searchTerm && 
      !movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !movement.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Sorting
  const sortedMovements = [...filteredMovements].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'product') {
      return sortOrder === 'asc'
        ? a.productName.localeCompare(b.productName)
        : b.productName.localeCompare(a.productName);
    } else if (sortBy === 'quantity') {
      return sortOrder === 'asc'
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else if (sortBy === 'value') {
      return sortOrder === 'asc'
        ? a.value - b.value
        : b.value - a.value;
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedMovements.length / itemsPerPage);
  const paginatedMovements = sortedMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handler Sort
  const handleSort = (column: string) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  // Helper untuk mendapatkan ikon sort
  const getSortIcon = (column: string) => {
    if (column !== sortBy) return <FaSort size={14} className="text-gray-300" />;
    return sortOrder === 'asc' ? <FaSortUp size={14} /> : <FaSortDown size={14} />;
  };
  
  // Helper untuk mendapatkan warna tipe pergerakan
  const getMovementBadge = (type: string) => {
    if (type === 'in') {
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><FaArrowUp size={10} /> Masuk</Badge>;
    } else {
      return <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1"><FaArrowDown size={10} /> Keluar</Badge>;
    }
  };
  
  // Helper untuk mendapatkan label sumber
  const getSourceLabel = (source: string): string => {
    switch (source) {
      case 'pos': return 'Penjualan (POS)';
      case 'purchase': return 'Pembelian';
      case 'transfer': return 'Transfer';
      case 'adjustment': return 'Penyesuaian';
      case 'expiry': return 'Kedaluwarsa';
      default: return source;
    }
  };
  
  // Hitung ringkasan nilai
  const totalIn = filteredMovements
    .filter(m => m.movementType === 'in')
    .reduce((sum, m) => sum + m.value, 0);
    
  const totalOut = filteredMovements
    .filter(m => m.movementType === 'out')
    .reduce((sum, m) => sum + m.value, 0);
    
  const totalMovements = filteredMovements.length;
  const uniqueProducts = new Set(filteredMovements.map(m => m.productId)).size;
  
  // Format data for Recharts
  const formatCategoryData = () => {
    return stockMovementByCategory.map(item => ({
      category: item.category,
      Masuk: item.in,
      Keluar: item.out
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-orange-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaBoxes className="text-orange-500" size={16} />
              <span>Total Pergerakan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMovements}</div>
            <p className="text-sm text-gray-500 mt-1">
              {uniqueProducts} produk berbeda
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-orange-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaArrowUp className="text-green-500" size={16} />
              <span>Nilai Masuk</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalIn)}</div>
            <p className="text-sm text-gray-500 mt-1">
              {filteredMovements.filter(m => m.movementType === 'in').length} transaksi
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-orange-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaArrowDown className="text-orange-500" size={16} />
              <span>Nilai Keluar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalOut)}</div>
            <p className="text-sm text-gray-500 mt-1">
              {filteredMovements.filter(m => m.movementType === 'out').length} transaksi
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-orange-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FaBoxes className="text-blue-500" size={16} />
              <span>Nilai Pergerakan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalIn + totalOut)}</div>
            <p className="text-sm text-gray-500 mt-1">
              Neraca: {formatRupiah(totalIn - totalOut)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md border-orange-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500"></div>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBoxes className="text-orange-500" />
              <span>Pergerakan Stok per Kategori</span>
            </div>
            <Button variant="outline" size="sm">
              <FaDownload className="mr-2 h-3 w-3" />
              Unduh Data
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-4">
          {isMounted && (
            <ClientOnlyRecharts height={350}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={formatCategoryData()}
                  margin={{ top: 10, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis 
                    type="number"
                    tickFormatter={(value) => `${Math.round(value/1000000)} jt`}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#f1f5f9' }}
                    tickLine={false}
                  />
                  <YAxis 
                    dataKey="category" 
                    type="category"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#f1f5f9' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatRupiah(value), '']}
                    contentStyle={{
                      fontSize: '12px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="Masuk" 
                    fill="#4CAF50" 
                    radius={[4, 4, 4, 4]}
                    barSize={25}
                  />
                  <Bar 
                    dataKey="Keluar" 
                    fill="#f97316" 
                    radius={[4, 4, 4, 4]}
                    barSize={25}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnlyRecharts>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBoxes className="text-orange-500" />
              <span>Log Pergerakan Stok</span>
            </div>
            <Button variant="outline" size="sm">
              <FaFileExport className="mr-2 h-4 w-4" />
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
          <div className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Cari produk atau nomor referensi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-sm"
                icon={<FaSearch className="text-gray-400" />}
              />
              
              <div className="flex gap-2">
                <Button 
                  variant={movementTypeFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setMovementTypeFilter('all')}
                  className="h-10"
                >
                  Semua
                </Button>
                <Button 
                  variant={movementTypeFilter === 'in' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setMovementTypeFilter('in')}
                  className="h-10"
                >
                  <FaArrowUp className="mr-2 h-3 w-3 text-green-500" />
                  Masuk
                </Button>
                <Button 
                  variant={movementTypeFilter === 'out' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setMovementTypeFilter('out')}
                  className="h-10"
                >
                  <FaArrowDown className="mr-2 h-3 w-3 text-orange-500" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Tanggal & Waktu
                      {getSortIcon('date')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('product')}
                  >
                    <div className="flex items-center gap-1">
                      Produk
                      {getSortIcon('product')}
                    </div>
                  </TableHead>
                  <TableHead>Cabang</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Sumber</TableHead>
                  <TableHead 
                    className="cursor-pointer text-center"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Kuantitas
                      {getSortIcon('quantity')}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Stok</TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort('value')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Nilai
                      {getSortIcon('value')}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMovements.length > 0 ? (
                  paginatedMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {format(new Date(movement.date), 'dd MMM yyyy', { locale: id })}
                        <div className="text-xs text-gray-500">
                          {format(new Date(movement.date), 'HH:mm', { locale: id })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{movement.productName}</div>
                        <div className="text-xs text-gray-500">{movement.category}</div>
                      </TableCell>
                      <TableCell>{movement.branchName}</TableCell>
                      <TableCell>{getMovementBadge(movement.movementType)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{getSourceLabel(movement.source)}</div>
                        <div className="text-xs text-gray-500">{movement.referenceNumber}</div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{movement.quantity}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span>{movement.stockBefore}</span>
                          <span className="text-gray-500">→</span>
                          <span>{movement.stockAfter}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatRupiah(movement.value)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Tidak ada data pergerakan stok yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredMovements.length > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4 px-4">
              <div className="text-sm text-gray-500">
                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredMovements.length)} - {Math.min(currentPage * itemsPerPage, filteredMovements.length)} dari {filteredMovements.length} pergerakan
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
    </div>
  );
};

export default StokProduct;
