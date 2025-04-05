import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaBarcode,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaExclamationTriangle,
  FaBell,
  FaCheckCircle,
  FaBoxOpen,
  FaArrowRight
} from "react-icons/fa";
import { Product, mockCategories, mockStocks, mockProductConsumptionStats } from "../types";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { calculateAllStockMetrics } from "../utils/stockCalculations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductTableProps {
  products: Product[];
  onViewDetail: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onCreatePurchaseOrder?: (product: Product) => void;
  onAddToDefectList?: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onViewDetail,
  onEdit,
  onDelete,
  onCreatePurchaseOrder,
  onAddToDefectList
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered products based on search query
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.sku && product.sku.toLowerCase().includes(query)) ||
      getCategoryName(product.categoryId).toLowerCase().includes(query)
    );
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!a[sortField] && !b[sortField]) return 0;
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;

    const aValue = a[sortField]?.toString().toLowerCase() || '';
    const bValue = b[sortField]?.toString().toLowerCase() || '';

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(cat => cat.id === categoryId);
    return category ? category.name : "Tidak Dikategorikan";
  };

  const getSortIcon = (field: keyof Product) => {
    if (sortField !== field) return <FaSort size={12} className="ml-1 text-gray-400" />;
    
    return sortDirection === "asc" ? (
      <FaSortUp size={12} className="ml-1 text-orange-600" />
    ) : (
      <FaSortDown size={12} className="ml-1 text-orange-600" />
    );
  };

  // Helper function to get stock status color
  const getStockStatusColor = (product: Product) => {
    if (!product.minStock) return "";
    
    // Mock data - in a real app this would come from actual stock records
    const mockStock = Math.floor(Math.random() * 100); // This is just for demonstration
    if (mockStock <= 0) return "text-red-600 font-medium";
    if (mockStock <= product.minStock) return "text-amber-600 font-medium";
    return "";
  };

  // Mendapatkan data stok dan kalkulasinya
  const getStockData = (product: Product) => {
    const stock = mockStocks.find(s => s.productId === product.id);
    const consumptionStats = mockProductConsumptionStats.find(s => s.productId === product.id);
    
    if (!stock) {
      return {
        status: { 
          label: 'Tidak Ada Data', 
          color: 'text-gray-500',
          bgColor: 'bg-gray-100'
        },
        bufferStock: 0,
        suggestedOrder: 0,
        currentStock: 0
      };
    }
    
    return calculateAllStockMetrics(product, stock, consumptionStats);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari produk berdasarkan nama, SKU, atau kategori..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 text-gray-600">
          <FaFilter size={14} />
          Filter
        </Button>
      </div>
      
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50">
              <TableHead className="w-[80px]">Foto</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-orange-100/50"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nama Produk {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-orange-100/50"
                onClick={() => handleSort("sku")}
              >
                <div className="flex items-center">
                  SKU {getSortIcon("sku")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-orange-100/50"
                onClick={() => handleSort("categoryId")}
              >
                <div className="flex items-center">
                  Kategori {getSortIcon("categoryId")}
                </div>
              </TableHead>
              <TableHead>Unit</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-orange-100/50"
                onClick={() => handleSort("sellingPrice")}
              >
                <div className="flex items-center">
                  Harga Jual {getSortIcon("sellingPrice")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-orange-100/50"
                onClick={() => handleSort("minStock")}
              >
                <div className="flex items-center">
                  Stok Min {getSortIcon("minStock")}
                </div>
              </TableHead>
              <TableHead>Status Stok</TableHead>
              <TableHead>Buffer Stok</TableHead>
              <TableHead>Saran Beli</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((product) => {
                const stockData = getStockData(product);
                return (
                  <TableRow key={product.id} className="hover:bg-orange-50/30">
                    <TableCell className="align-middle">
                      {product.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image 
                            src={product.imageUrl} 
                            alt={product.name} 
                            layout="fill" 
                            objectFit="cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
                          <FaBoxOpen size={24} className="text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{getCategoryName(product.categoryId)}</div>
                    </TableCell>
                    <TableCell>
                      {product.sku ? (
                        <div className="flex items-center">
                          <FaBarcode size={12} className="mr-1 text-gray-400" />
                          <span>{product.sku}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {getCategoryName(product.categoryId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      {product.sellingPrice ? (
                        <div className="font-medium">{formatRupiah(product.sellingPrice)}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className={getStockStatusColor(product)}>
                      {product.minStock || "-"}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="outline" 
                              className={`${stockData.status.bgColor} ${stockData.status.color} hover:${stockData.status.bgColor}`}
                            >
                              {stockData.status.status === 'danger' && <FaExclamationTriangle className="mr-1" size={10} />}
                              {stockData.status.status === 'warning' && <FaBell className="mr-1" size={10} />}
                              {stockData.status.status === 'success' && <FaCheckCircle className="mr-1" size={10} />}
                              {stockData.status.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Stok saat ini: {stockData.currentStock} {product.unit}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {stockData.bufferStock} {product.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      {stockData.suggestedOrder > 0 ? (
                        <div className="font-medium text-blue-600">
                          {stockData.suggestedOrder} {product.unit}
                        </div>
                      ) : (
                        <span className="text-green-600 font-medium">Cukup</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => onViewDetail(product)} 
                          className="h-8 w-8 text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                        >
                          <FaEye size={14} />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => onEdit(product)} 
                          className="h-8 w-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <FaEdit size={14} />
                        </Button>
                        {onCreatePurchaseOrder && stockData.suggestedOrder > 0 && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => onCreatePurchaseOrder(product)} 
                            className="h-8 w-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <FaShoppingCart size={14} />
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => onDelete(product.id)} 
                          className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <FaTrash size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center">
                    <FaSearch size={36} className="text-gray-300 mb-2" />
                    <p>Tidak ada produk yang ditemukan</p>
                    <p className="text-sm text-gray-400">Coba cari dengan kata kunci lain</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-600"
            >
              Sebelumnya
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={
                  currentPage === page
                    ? "bg-gradient-to-r from-orange-500 to-amber-500"
                    : "text-gray-600"
                }
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-gray-600"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
