import React, { useState } from 'react';
import { 
  FaExclamationTriangle, FaCalendarTimes, FaEye, 
  FaCheck, FaPlus, FaSortDown, FaSortUp
} from 'react-icons/fa';
import {
  Card,
  CardContent,
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
import { formatRupiah } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { id } from 'date-fns/locale';

// Data sampel produk kedaluwarsa
const sampleExpiryProducts = [
  {
    id: 'PROD001-BATCH01',
    productName: 'Paracetamol 500mg',
    batchNumber: 'BATCH-2023-001',
    category: 'Obat Bebas',
    categoryId: 'CAT001',
    supplier: 'PT Kimia Farma',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    expiryDate: '2025-04-15',
    quantity: 120,
    unitPrice: 12500,
    totalValue: 1500000,
    status: 'near-expiry', // expired, near-expiry
    daysUntilExpiry: 15
  },
  {
    id: 'PROD002-BATCH01',
    productName: 'Amoxicillin 500mg',
    batchNumber: 'BATCH-2023-015',
    category: 'Antibiotik',
    categoryId: 'CAT004',
    supplier: 'PT Dexa Medica',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    expiryDate: '2025-03-10',
    quantity: 85,
    unitPrice: 15000,
    totalValue: 1275000,
    status: 'expired',
    daysUntilExpiry: -20
  },
  {
    id: 'PROD003-BATCH02',
    productName: 'Vitamin C 1000mg',
    batchNumber: 'BATCH-2023-078',
    category: 'Vitamin dan Suplemen',
    categoryId: 'CAT005',
    supplier: 'PT Kalbe Farma',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    expiryDate: '2025-06-22',
    quantity: 200,
    unitPrice: 5000,
    totalValue: 1000000,
    status: 'near-expiry',
    daysUntilExpiry: 83
  },
  {
    id: 'PROD004-BATCH03',
    productName: 'Cefixime 100mg',
    batchNumber: 'BATCH-2023-045',
    category: 'Antibiotik',
    categoryId: 'CAT004',
    supplier: 'PT Bernofarm',
    branchId: 'BR003',
    branchName: 'Cabang Surabaya',
    expiryDate: '2025-03-05',
    quantity: 65,
    unitPrice: 25000,
    totalValue: 1625000,
    status: 'expired',
    daysUntilExpiry: -25
  },
  {
    id: 'PROD005-BATCH01',
    productName: 'Lansoprazole 30mg',
    batchNumber: 'BATCH-2023-057',
    category: 'Obat Keras',
    categoryId: 'CAT003',
    supplier: 'PT Ferron Par Pharmaceuticals',
    branchId: 'BR004',
    branchName: 'Cabang Medan',
    expiryDate: '2025-05-12',
    quantity: 40,
    unitPrice: 18000,
    totalValue: 720000,
    status: 'near-expiry',
    daysUntilExpiry: 42
  },
  {
    id: 'PROD006-BATCH02',
    productName: 'Cetirizine 10mg',
    batchNumber: 'BATCH-2023-089',
    category: 'Obat Bebas Terbatas',
    categoryId: 'CAT002',
    supplier: 'PT Hexpharm Jaya',
    branchId: 'BR002',
    branchName: 'Cabang Bandung',
    expiryDate: '2025-04-02',
    quantity: 150,
    unitPrice: 8000,
    totalValue: 1200000,
    status: 'near-expiry',
    daysUntilExpiry: 2
  },
  {
    id: 'PROD007-BATCH01',
    productName: 'Omeprazole 20mg',
    batchNumber: 'BATCH-2023-094',
    category: 'Obat Keras',
    categoryId: 'CAT003',
    supplier: 'PT Pharma Health Care',
    branchId: 'BR001',
    branchName: 'Apotek Pusat - Jakarta',
    expiryDate: '2025-03-18',
    quantity: 75,
    unitPrice: 14000,
    totalValue: 1050000,
    status: 'expired',
    daysUntilExpiry: -12
  }
];

// Props interface untuk komponen
interface DaftarKedaluwarsaProps {
  searchQuery: string;
  filterBranch: string;
  filterCategory: string;
  filterExpiryPeriod: string;
}

const DaftarKedaluwarsa: React.FC<DaftarKedaluwarsaProps> = ({
  searchQuery,
  filterBranch,
  filterCategory,
  filterExpiryPeriod
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('expiryDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const itemsPerPage = 10;
  
  // Fungsi sort table
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
    if (column !== sortBy) return null;
    return sortOrder === 'asc' ? <FaSortUp size={14} /> : <FaSortDown size={14} />;
  };
  
  // Filter produk
  const filteredProducts = sampleExpiryProducts.filter(product => {
    // Filter cabang
    if (filterBranch !== 'all' && product.branchId !== filterBranch) {
      return false;
    }
    
    // Filter kategori
    if (filterCategory !== 'all' && product.categoryId !== filterCategory) {
      return false;
    }
    
    // Filter periode kedaluwarsa
    if (filterExpiryPeriod !== 'all') {
      const daysLeft = product.daysUntilExpiry;
      
      switch (filterExpiryPeriod) {
        case 'expired':
          if (daysLeft >= 0) return false;
          break;
        case '30days':
          if (daysLeft < 0 || daysLeft >= 30) return false;
          break;
        case '60days':
          if (daysLeft < 30 || daysLeft >= 60) return false;
          break;
        case '90days':
          if (daysLeft < 60 || daysLeft >= 90) return false;
          break;
        case '180days':
          if (daysLeft < 90 || daysLeft >= 180) return false;
          break;
      }
    }
    
    // Filter pencarian
    if (
      searchQuery && 
      !product.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'expiryDate') {
      return sortOrder === 'asc' 
        ? a.daysUntilExpiry - b.daysUntilExpiry
        : b.daysUntilExpiry - a.daysUntilExpiry;
    } else if (sortBy === 'productName') {
      return sortOrder === 'asc'
        ? a.productName.localeCompare(b.productName)
        : b.productName.localeCompare(a.productName);
    } else if (sortBy === 'quantity') {
      return sortOrder === 'asc'
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else if (sortBy === 'totalValue') {
      return sortOrder === 'asc'
        ? a.totalValue - b.totalValue
        : b.totalValue - a.totalValue;
    }
    return 0;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Helper untuk warna status kedaluwarsa
  const getExpiryStatusColor = (status: string): string => {
    return status === 'expired' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-amber-100 text-amber-800';
  };
  
  // Helper untuk label status kedaluwarsa
  const getExpiryStatusLabel = (product: any): string => {
    if (product.status === 'expired') {
      return `Kedaluwarsa ${Math.abs(product.daysUntilExpiry)} hari yang lalu`;
    } else {
      return `Kedaluwarsa dalam ${product.daysUntilExpiry} hari`;
    }
  };
  
  // Handler lihat detail produk
  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer w-[220px]"
                  onClick={() => handleSort('productName')}
                >
                  <div className="flex items-center">
                    Produk
                    {getSortIcon('productName')}
                  </div>
                </TableHead>
                <TableHead>Informasi Batch</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('expiryDate')}
                >
                  <div className="flex items-center">
                    Kedaluwarsa
                    {getSortIcon('expiryDate')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center justify-end">
                    Qty
                    {getSortIcon('quantity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => handleSort('totalValue')}
                >
                  <div className="flex items-center justify-end">
                    Nilai
                    {getSortIcon('totalValue')}
                  </div>
                </TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{product.batchNumber}</div>
                      <div className="text-xs text-gray-500">Supplier: {product.supplier}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{product.branchName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(product.expiryDate), 'dd MMM yyyy', { locale: id })}
                      </div>
                      <Badge className={getExpiryStatusColor(product.status)}>
                        {getExpiryStatusLabel(product)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatRupiah(product.totalValue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600"
                          onClick={() => handleViewDetail(product)}
                        >
                          <FaEye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-orange-600"
                        >
                          <FaPlus size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Tidak ada produk kedaluwarsa yang sesuai dengan filter
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-500">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} produk
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
  );
};

export default DaftarKedaluwarsa;
