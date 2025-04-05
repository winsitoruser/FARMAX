import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTrash,
  FaEdit,
  FaEye,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaFileExcel,
  FaFilePdf,
  FaFileDownload,
  FaPills,
} from "react-icons/fa";
import { formatRupiah } from "@/lib/utils";
import { inventoryAPI, Product } from "../services/inventory-api";
import { exportProductsToExcel } from "../utils/exportUtils";
import { 
  DrugClassification, 
  getDrugClassInfo, 
  getDrugClassBadgeStyles 
} from "../utils/drug-classifications";

// Komponen untuk menampilkan simbol klasifikasi obat
const DrugClassificationSymbol = ({ 
  classification, 
  size = "sm" 
}: { 
  classification: string, 
  size?: "sm" | "md" | "lg" 
}) => {
  const sizeClass = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10"
  };

  const getSymbolContent = () => {
    switch (classification) {
      case DrugClassification.FREE:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-black bg-green-500 flex items-center justify-center`} 
               title="Obat Bebas">
          </div>
        );
      case DrugClassification.LIMITED_FREE:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-black bg-blue-600 flex items-center justify-center`} 
               title="Obat Bebas Terbatas">
          </div>
        );
      case DrugClassification.PRESCRIPTION:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-black bg-red-500 flex items-center justify-center`} 
               title="Obat Keras">
            <span className="text-white font-bold" style={{ fontSize: size === "lg" ? "16px" : size === "md" ? "12px" : "9px" }}>K</span>
          </div>
        );
      case DrugClassification.PSYCHOTROPIC:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-red-600 bg-white flex items-center justify-center`} 
               title="Obat Psikotropika">
            <span className="text-red-600 font-bold" style={{ fontSize: size === "lg" ? "20px" : size === "md" ? "16px" : "12px" }}>+</span>
          </div>
        );
      case DrugClassification.NARCOTICS:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-red-600 bg-white flex items-center justify-center`} 
               title="Obat Narkotika">
            <span className="text-red-600 font-bold" style={{ fontSize: size === "lg" ? "20px" : size === "md" ? "16px" : "12px" }}>+</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!classification) return null;

  return (
    <div className="flex-shrink-0 inline-flex">
      {getSymbolContent()}
    </div>
  );
};

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    lowStock: false,
    nearExpiry: false,
    supplier: "",
    manufacturer: "",
    stockRange: "all", // "all", "out", "low", "normal", "high"
    drugClass: "", // Klasifikasi obat: FREE, LIMITED_FREE, PRESCRIPTION, dll
    sortBy: "name",
    sortOrder: "asc" as "asc" | "desc",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    // Fetch categories for filter dropdown
    const fetchCategories = async () => {
      try {
        const categoriesData = await inventoryAPI.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    // Fetch suppliers and manufacturers for filter dropdowns
    const fetchSupplierManufacturer = async () => {
      try {
        // In a real app, this would be API calls
        // For now, we'll extract unique values from products
        const allProductsResponse = await inventoryAPI.getProducts({
          limit: 1000
        });
        
        if (allProductsResponse && allProductsResponse.data) {
          const uniqueSuppliers = [...new Set(
            allProductsResponse.data
              .map(p => p.supplier)
              .filter(Boolean)
          )];
          
          const uniqueManufacturers = [...new Set(
            allProductsResponse.data
              .map(p => p.manufacturer)
              .filter(Boolean)
          )];
          
          setSuppliers(uniqueSuppliers as string[]);
          setManufacturers(uniqueManufacturers as string[]);
        }
      } catch (error) {
        console.error("Error fetching suppliers/manufacturers:", error);
      }
    };

    fetchCategories();
    fetchSupplierManufacturer();
  }, []);

  useEffect(() => {
    // Fetch products when search or filters change
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search: search,
          category: filter.category,
          supplier: filter.supplier,
          manufacturer: filter.manufacturer,
          lowStock: filter.lowStock || filter.stockRange === "low",
          outOfStock: filter.stockRange === "out",
          nearExpiry: filter.nearExpiry,
          drugClassification: filter.drugClass || undefined,
          sortBy: filter.sortBy,
          sortOrder: filter.sortOrder,
        };

        const response = await inventoryAPI.getProducts(params);
        setProducts(response.data);
        setPagination({
          ...pagination,
          total: response.total,
          totalPages: response.totalPages,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    // We're using a timeout here to prevent too many API calls while typing
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    pagination.page,
    pagination.limit,
    search,
    filter.category,
    filter.supplier,
    filter.manufacturer,
    filter.lowStock,
    filter.nearExpiry,
    filter.stockRange,
    filter.drugClass,
    filter.sortBy,
    filter.sortOrder,
  ]);

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page,
    });
  };

  const handleSort = (field: string) => {
    if (filter.sortBy === field) {
      setFilter({
        ...filter,
        sortOrder: filter.sortOrder === "asc" ? "desc" : "asc",
      });
    } else {
      setFilter({
        ...filter,
        sortBy: field,
        sortOrder: "asc",
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `Anda yakin ingin menghapus ${selectedProducts.length} produk terpilih?`
      )
    ) {
      setLoading(true);
      try {
        // In a real app, you might want to batch delete these
        for (const id of selectedProducts) {
          await inventoryAPI.deleteProduct(id);
        }
        // Refresh product list
        const response = await inventoryAPI.getProducts({
          page: pagination.page,
          limit: pagination.limit,
        });
        setProducts(response.data);
        setPagination({
          ...pagination,
          total: response.total,
          totalPages: response.totalPages,
        });
        setSelectedProducts([]);
      } catch (error) {
        console.error("Error deleting products:", error);
        alert("Terjadi kesalahan saat menghapus produk");
      } finally {
        setLoading(false);
      }
    }
  };

  // Check if product is low stock or near expiry
  const isLowStock = (product: Product) => {
    return product.stockQty <= product.minStockQty;
  };

  const isNearExpiry = (product: Product) => {
    if (!product.expiryDate) return false;
    const expiry = new Date(product.expiryDate);
    const now = new Date();
    const daysToExpiry = Math.floor(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpiry <= 30; // Within 30 days
  };

  // Export data to Excel
  const handleExportToExcel = async () => {
    try {
      // Show loading indicator
      setLoading(true);
      
      // Fetch all products for export (no pagination)
      const allProductsResponse = await inventoryAPI.getProducts({
        limit: 1000, // Set a high limit to get all products
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
        category: filter.category,
        supplier: filter.supplier,
        manufacturer: filter.manufacturer,
        lowStock: filter.lowStock || filter.stockRange === "low",
        outOfStock: filter.stockRange === "out",
        nearExpiry: filter.nearExpiry,
        drugClassification: filter.drugClass || undefined,
        search: search
      });
      
      console.log("Exporting products:", allProductsResponse.data.length);
      
      // Check if we have products to export
      if (!allProductsResponse.data || allProductsResponse.data.length === 0) {
        alert("Tidak ada data produk untuk diekspor");
        setLoading(false);
        return;
      }
      
      // Export the data
      exportProductsToExcel(
        allProductsResponse.data, 
        `daftar-produk-farmax-${new Date().toISOString().split('T')[0]}.xlsx`
      );
      
      // Close the export dropdown
      setShowExportOptions(false);
    } catch (error) {
      console.error("Error exporting data to Excel:", error);
      alert("Terjadi kesalahan saat mengekspor data ke Excel. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle export options dropdown
  const toggleExportOptions = () => {
    setShowExportOptions(!showExportOptions);
  };

  // Handle click outside to close export options
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#export-options') && !target.closest('#export-options-button')) {
        setShowExportOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header dengan gradien orange/amber */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-md">
        {/* Elemen dekoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 blur-xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-10 blur-xl transform -translate-x-20 translate-y-20"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Manajemen Produk</h1>
          <p className="mt-1 opacity-90">
            Tambah, edit, dan hapus produk farmasi
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <Card className="border-orange-100">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <div className="flex flex-row space-x-2">
                <Select
                  value={filter.category}
                  onValueChange={(value) =>
                    setFilter({ ...filter, category: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.supplier}
                  onValueChange={(value) =>
                    setFilter({ ...filter, supplier: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Supplier</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.manufacturer}
                  onValueChange={(value) =>
                    setFilter({ ...filter, manufacturer: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Pabrikan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Pabrikan</SelectItem>
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.stockRange}
                  onValueChange={(value) =>
                    setFilter({ ...filter, stockRange: value, lowStock: false })
                  }
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Kondisi Stok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Stok</SelectItem>
                    <SelectItem value="out">Stok Habis</SelectItem>
                    <SelectItem value="low">Stok Rendah</SelectItem>
                    <SelectItem value="normal">Stok Normal</SelectItem>
                    <SelectItem value="high">Stok Tinggi</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant={filter.lowStock ? "default" : "outline"}
                  className={
                    filter.lowStock
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600"
                      : "border-orange-200 text-orange-600"
                  }
                  onClick={() =>
                    setFilter({ ...filter, lowStock: !filter.lowStock, stockRange: "all" })
                  }
                >
                  <FaExclamationTriangle className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Stok Rendah</span>
                </Button>

                <Button
                  variant={filter.nearExpiry ? "default" : "outline"}
                  className={
                    filter.nearExpiry
                      ? "bg-red-500 hover:bg-red-600 text-white border-red-600"
                      : "border-orange-200 text-orange-600"
                  }
                  onClick={() =>
                    setFilter({ ...filter, nearExpiry: !filter.nearExpiry })
                  }
                >
                  <FaCalendarAlt className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Mendekati Kadaluarsa</span>
                </Button>

                <Select
                  value={filter.drugClass}
                  onValueChange={(value) =>
                    setFilter({ ...filter, drugClass: value })
                  }
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Klasifikasi Obat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Klasifikasi</SelectItem>
                    <SelectItem value={DrugClassification.FREE}>Obat Bebas</SelectItem>
                    <SelectItem value={DrugClassification.LIMITED_FREE}>Obat Bebas Terbatas</SelectItem>
                    <SelectItem value={DrugClassification.PRESCRIPTION}>Obat Keras</SelectItem>
                    <SelectItem value={DrugClassification.PSYCHOTROPIC}>Obat Psikotropika</SelectItem>
                    <SelectItem value={DrugClassification.NARCOTICS}>Obat Narkotika</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-2">
              {selectedProducts.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  <FaTrash className="h-4 w-4" />
                  <span className="hidden md:inline">Hapus Terpilih</span>
                </Button>
              )}

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  id="export-options-button"
                  onClick={toggleExportOptions}
                  className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-300"
                >
                  <FaFileDownload className="h-4 w-4" />
                  <span className="hidden md:inline">Export</span>
                </Button>
                
                {showExportOptions && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50"
                    id="export-options"
                  >
                    <div className="py-1">
                      <Button 
                        variant="ghost" 
                        className="w-full flex justify-start px-4 py-2 text-sm hover:bg-green-50"
                        onClick={handleExportToExcel}
                      >
                        <FaFileExcel className="h-4 w-4 mr-2 text-green-600" />
                        Export ke Excel
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full flex justify-start px-4 py-2 text-sm hover:bg-red-50"
                        onClick={() => {
                          alert("Fitur export ke PDF akan segera tersedia");
                          setShowExportOptions(false);
                        }}
                      >
                        <FaFilePdf className="h-4 w-4 mr-2 text-red-600" />
                        Export ke PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => router.push("/inventory/products/new")}
              >
                <FaPlus className="mr-1 h-4 w-4" />
                Produk Baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-orange-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-orange-50/50 border-b border-orange-100">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedProducts.length === products.length &&
                        products.length > 0
                      }
                      onCheckedChange={handleSelectAllProducts}
                      aria-label="Pilih semua produk"
                    />
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("code")}
                  >
                    <div className="flex items-center">
                      Kode
                      {filter.sortBy === "code" && (
                        <>
                          {filter.sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1 h-3 w-3" />
                          ) : (
                            <FaSortAmountDown className="ml-1 h-3 w-3" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Nama Produk
                      {filter.sortBy === "name" && (
                        <>
                          {filter.sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1 h-3 w-3" />
                          ) : (
                            <FaSortAmountDown className="ml-1 h-3 w-3" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("stockQty")}
                  >
                    <div className="flex items-center">
                      Stok
                      {filter.sortBy === "stockQty" && (
                        <>
                          {filter.sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1 h-3 w-3" />
                          ) : (
                            <FaSortAmountDown className="ml-1 h-3 w-3" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Kondisi Stok</TableHead>
                  <TableHead>Klasifikasi</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("buyPrice")}
                  >
                    <div className="flex items-center">
                      Harga Beli
                      {filter.sortBy === "buyPrice" && (
                        <>
                          {filter.sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1 h-3 w-3" />
                          ) : (
                            <FaSortAmountDown className="ml-1 h-3 w-3" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("sellPrice")}
                  >
                    <div className="flex items-center">
                      Harga Jual
                      {filter.sortBy === "sellPrice" && (
                        <>
                          {filter.sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1 h-3 w-3" />
                          ) : (
                            <FaSortAmountDown className="ml-1 h-3 w-3" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("expiryDate")}
                  >
                    <div className="flex items-center">
                      Kadaluarsa
                      {filter.sortBy === "expiryDate" && (
                        <>
                          {filter.sortOrder === "asc" ? (
                            <FaSortAmountUp className="ml-1 h-3 w-3" />
                          ) : (
                            <FaSortAmountDown className="ml-1 h-3 w-3" />
                          )}
                        </>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-orange-50/50 border-b border-orange-100"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) =>
                            handleSelectProduct(
                              product.id,
                              checked as boolean
                            )
                          }
                          aria-label={`Pilih ${product.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.drugClassification && (
                            <DrugClassificationSymbol classification={product.drugClassification} />
                          )}
                          <span>
                            {product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.stockQty.toLocaleString('id-ID')} {product.unit}
                      </TableCell>
                      <TableCell>
                        {product.stockQty === 0 ? (
                          <Badge variant="destructive" className="bg-red-500">Habis</Badge>
                        ) : product.stockQty <= product.minStockQty ? (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">Rendah</Badge>
                        ) : product.stockQty >= product.minStockQty * 3 ? (
                          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">Tinggi</Badge>
                        ) : (
                          <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.drugClassification ? (
                          <Badge className={`${getDrugClassBadgeStyles(product.drugClassification)} flex items-center gap-1`}>
                            <FaPills className="h-3 w-3" />
                            {getDrugClassInfo(product.drugClassification)?.name || product.drugClassification}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-300 bg-gray-50">
                            Belum Diklasifikasi
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatRupiah(product.buyPrice)}</TableCell>
                      <TableCell>{formatRupiah(product.sellPrice)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {product.expiryDate
                            ? new Date(product.expiryDate).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                          {isNearExpiry(product) && (
                            <FaCalendarAlt className="ml-1 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {product.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                            onClick={() =>
                              router.push(`/inventory/products/${product.id}`)
                            }
                          >
                            <FaEye className="h-4 w-4" />
                            <span className="sr-only">Lihat</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                            onClick={() =>
                              router.push(`/inventory/products/${product.id}/edit`)
                            }
                          >
                            <FaEdit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `Anda yakin ingin menghapus produk ${product.name}?`
                                )
                              ) {
                                try {
                                  await inventoryAPI.deleteProduct(product.id);
                                  // Refresh product list
                                  const response = await inventoryAPI.getProducts({
                                    page: pagination.page,
                                    limit: pagination.limit,
                                  });
                                  setProducts(response.data);
                                } catch (error) {
                                  console.error(
                                    "Error deleting product:",
                                    error
                                  );
                                  alert(
                                    "Terjadi kesalahan saat menghapus produk"
                                  );
                                }
                              }
                            }}
                          >
                            <FaTrash className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="p-3 rounded-full bg-orange-50">
                          <FaSearch className="h-6 w-6 text-orange-300" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium">
                          Tidak ada produk
                        </h3>
                        <p className="text-xs mt-1">
                          {search
                            ? `Tidak ada produk yang cocok dengan "${search}"`
                            : "Belum ada produk yang terdaftar"}
                        </p>
                        <Button
                          className="mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => router.push("/inventory/products/new")}
                        >
                          <FaPlus className="mr-1 h-4 w-4" />
                          Tambah Produk Baru
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {products.length} dari {pagination.total} produk
          </p>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page > 1) {
                      handlePageChange(pagination.page - 1);
                    }
                  }}
                  className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={pagination.page === i + 1}
                    className={pagination.page === i + 1 ? "bg-orange-500 text-white" : ""}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.page < pagination.totalPages) {
                      handlePageChange(pagination.page + 1);
                    }
                  }}
                  className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
