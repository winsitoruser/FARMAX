import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaSearch, 
  FaFilter, 
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilePdf,
  FaFileExcel,
  FaCalendarAlt
} from "react-icons/fa";

interface StockMovement {
  id: string;
  date: Date;
  type: "in" | "out" | "adjustment";
  reference: string;
  productName: string;
  quantity: number;
  fromTo: string;
  notes: string;
}

interface StockMovementHistoryModalProps {
  open: boolean;
  onClose: () => void;
  movements: StockMovement[];
}

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const StockMovementHistoryModal: React.FC<StockMovementHistoryModalProps> = ({
  open,
  onClose,
  movements
}) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [movementType, setMovementType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  
  // State for sorting
  const [sortField, setSortField] = useState<keyof StockMovement>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Handle sorting
  const handleSort = (field: keyof StockMovement) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get sort icon
  const getSortIcon = (field: keyof StockMovement) => {
    if (sortField !== field) return <FaSort className="ml-1 h-3 w-3 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="ml-1 h-3 w-3 text-indigo-600" /> 
      : <FaSortDown className="ml-1 h-3 w-3 text-indigo-600" />;
  };
  
  // Filter and sort data
  const filteredData = useMemo(() => {
    return movements
      .filter(item => {
        const matchesSearch = 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.fromTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.notes.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesType = movementType === 'all' || item.type === movementType;
        
        const matchesDate = !dateFilter || 
          new Date(item.date).toISOString().split('T')[0] === dateFilter;
        
        return matchesSearch && matchesType && matchesDate;
      })
      .sort((a, b) => {
        if (sortField === 'date') {
          return sortDirection === 'asc' 
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        
        if (sortField === 'quantity') {
          return sortDirection === 'asc' 
            ? a.quantity - b.quantity
            : b.quantity - a.quantity;
        }
        
        // For string fields
        const aValue = a[sortField]?.toString().toLowerCase() || '';
        const bValue = b[sortField]?.toString().toLowerCase() || '';
        
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
  }, [movements, searchTerm, movementType, dateFilter, sortField, sortDirection]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
  // Generate page numbers
  const pageNumbers = [];
  const maxPageNumbersToShow = 5;
  
  if (totalPages <= maxPageNumbersToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate start and end of page numbers to display
    let startPage = Math.max(2, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPageNumbersToShow - 3);
    
    // Adjust if we're near the start
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, maxPageNumbersToShow - 1);
    }
    
    // Adjust if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, totalPages - maxPageNumbersToShow + 2);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('ellipsis1');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('ellipsis2');
    }
    
    // Always show last page
    pageNumbers.push(totalPages);
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FaSort className="mr-2 h-5 w-5 text-indigo-500" /> Riwayat Pergerakan Stok
          </DialogTitle>
          <DialogDescription>
            Catatan lengkap semua pergerakan stok masuk dan keluar
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-6">
          <div className="relative flex-1 w-full">
            <Input 
              placeholder="Cari berdasarkan produk, referensi, atau sumber" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
              <Input 
                type="date" 
                className="pl-10 w-full md:w-[180px]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            
            <Select 
              value={movementType} 
              onValueChange={setMovementType}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Jenis Pergerakan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pergerakan</SelectItem>
                <SelectItem value="in">Stok Masuk</SelectItem>
                <SelectItem value="out">Stok Keluar</SelectItem>
                <SelectItem value="adjustment">Penyesuaian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-auto flex-1 border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Tanggal {getSortIcon('date')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('reference')}
                >
                  <div className="flex items-center">
                    Referensi {getSortIcon('reference')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('productName')}
                >
                  <div className="flex items-center">
                    Produk {getSortIcon('productName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Tipe {getSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-center"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center justify-center">
                    Jumlah {getSortIcon('quantity')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('fromTo')}
                >
                  <div className="flex items-center">
                    Sumber/Tujuan {getSortIcon('fromTo')}
                  </div>
                </TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    Tidak ada data pergerakan stok yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((movement) => (
                  <TableRow key={movement.id} className="hover:bg-gray-50">
                    <TableCell>{formatDate(movement.date)}</TableCell>
                    <TableCell className="font-medium">{movement.reference}</TableCell>
                    <TableCell>{movement.productName}</TableCell>
                    <TableCell>
                      {movement.type === "in" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <FaArrowUp className="mr-1 h-3 w-3" /> Masuk
                        </Badge>
                      )}
                      {movement.type === "out" && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <FaArrowDown className="mr-1 h-3 w-3" /> Keluar
                        </Badge>
                      )}
                      {movement.type === "adjustment" && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          Penyesuaian
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{movement.quantity}</TableCell>
                    <TableCell>{movement.fromTo}</TableCell>
                    <TableCell>{movement.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tampilkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per halaman</SelectItem>
                <SelectItem value="10">10 per halaman</SelectItem>
                <SelectItem value="25">25 per halaman</SelectItem>
                <SelectItem value="50">50 per halaman</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-sm text-gray-500">
              Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} item
            </p>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {pageNumbers.map((number, index) => (
                <PaginationItem key={index}>
                  {number === 'ellipsis1' || number === 'ellipsis2' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(number as number);
                      }}
                      isActive={currentPage === number}
                    >
                      {number}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        
        <DialogFooter className="flex gap-2 mt-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <FaFilePdf className="mr-2 h-4 w-4" /> Ekspor PDF
              </Button>
              <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                <FaFileExcel className="mr-2 h-4 w-4" /> Ekspor Excel
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockMovementHistoryModal;
