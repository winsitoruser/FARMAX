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
  FaShoppingCart
} from "react-icons/fa";
import { Product, mockCategories } from "../types";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";

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

  // Filter products based on search query
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      getCategoryName(product.categoryId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (
      (typeof aValue === "number" && typeof bValue === "number") ||
      (typeof aValue === "undefined" && typeof bValue === "number") ||
      (typeof aValue === "number" && typeof bValue === "undefined")
    ) {
      const numA = typeof aValue === "number" ? aValue : 0;
      const numB = typeof bValue === "number" ? bValue : 0;
      return sortDirection === "asc" ? numA - numB : numB - numA;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get current page items
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Product) => {
    if (field === sortField) {
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
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-orange-50/30">
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-orange-300">
                          <FaBarcode size={16} />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.name}
                    <div className="text-xs text-gray-500 mt-1">
                      {product.brand || "Tidak diketahui"}
                    </div>
                  </TableCell>
                  <TableCell>{product.sku || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {getCategoryName(product.categoryId)}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.sellingPrice ? formatRupiah(product.sellingPrice) : "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`mr-2 ${getStockStatusColor(product)}`}>
                        {product.minStock || 0}
                      </span>
                      {getStockStatusColor(product) && (
                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetail(product)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <FaEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                      >
                        <FaEdit className="h-4 w-4" />
                      </Button>
                      {onCreatePurchaseOrder && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onCreatePurchaseOrder(product)}
                          className="h-8 w-8 text-orange-600 hover:text-orange-800 hover:bg-orange-50"
                          title="Buat pesanan pembelian"
                        >
                          <FaShoppingCart className="h-4 w-4" />
                        </Button>
                      )}
                      {onAddToDefectList && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onAddToDefectList(product)}
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                          title="Tambah ke daftar cacat"
                        >
                          <FaTrash className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <FaTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? "Tidak ada produk yang sesuai dengan pencarian Anda"
                    : "Belum ada data produk tersedia"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-orange-100 pt-4">
          <div className="text-sm text-gray-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} produk
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              Sebelumnya
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Show 5 pages max with the current page in the middle if possible
              let pageToShow = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageToShow = currentPage - 3 + i + 1;
                }
                if (pageToShow > totalPages) {
                  pageToShow = totalPages - 5 + i + 1;
                }
              }
              
              return (
                <Button
                  key={i}
                  variant={currentPage === pageToShow ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageToShow)}
                  className={currentPage === pageToShow 
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600" 
                    : "border-orange-200 text-orange-700 hover:bg-orange-50"}
                >
                  {pageToShow}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
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
