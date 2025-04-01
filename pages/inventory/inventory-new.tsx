import React, { useState } from 'react';
import Head from 'next/head';
import { 
  FaBoxOpen, FaSearch, FaPlus, FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown,
  FaFilter, FaDownload, FaPrint, FaInfoCircle, FaExclamationTriangle,
  FaExchangeAlt, FaBox, FaTag, FaChartLine, FaCalendarTimes, FaChartBar,
  FaFileExport, FaUpload, FaArrowUp, FaArrowDown, FaWarehouse, FaClipboardList,
  FaCalendarAlt, FaHome
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from '@/components/ui/use-toast';
import DashonicLayout from '@/components/layouts/dashonic-layout';
import { mockProducts, mockStocks, mockCategories, mockTransactions, Transaction } from "@/modules/inventory/types";
import { formatRupiah } from "@/lib/utils";

interface ExtendedProduct {
  id: string;
  name: string;
  stock: number;
  price: number;
  expiryDate?: string;
  category: string;
}

const InventoryNewPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const [products, setProducts] = useState<ExtendedProduct[]>(mockProducts as unknown as ExtendedProduct[]);
  const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>(mockProducts as unknown as ExtendedProduct[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [expiringSoonDays, setExpiringSoonDays] = useState(30);
  
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedProduct | null>(null);
  
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  const lowStockItems = products.filter((product) => product.stock <= lowStockThreshold);
  const expiringSoonItems = products.filter((product) => {
    if (!product.expiryDate) return false;
    const expiryDate = new Date(product.expiryDate);
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= expiringSoonDays && daysUntilExpiry > 0;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get sorted products
  const getSortedProducts = () => {
    return [...filteredProducts].sort((a, b) => {
      const aValue = a[sortField as keyof ExtendedProduct];
      const bValue = b[sortField as keyof ExtendedProduct];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  };

  const navItems = [
    { name: 'Ringkasan', id: 'overview', icon: <FaHome className="w-4 h-4" /> },
    { name: 'Produk', id: 'products', icon: <FaBoxOpen className="w-4 h-4" /> },
    { name: 'Stock Opname', id: 'stocktake', icon: <FaClipboardList className="w-4 h-4" /> },
    { name: 'Kadaluarsa', id: 'expiry', icon: <FaCalendarAlt className="w-4 h-4" /> },
    { name: 'Laporan', id: 'reports', icon: <FaChartBar className="w-4 h-4" /> },
    { name: 'Penyesuaian', id: 'adjustment', icon: <FaExchangeAlt className="w-4 h-4" /> }
  ];

  return (
    <DashonicLayout>
      <Head>
        <title>Manajemen Inventori | Farmanesia</title>
      </Head>
      
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-4 mb-4 shadow-md overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4 backdrop-blur-sm">
              <FaBoxOpen className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Manajemen Inventori</h1>
              <p className="text-sm text-white/80">Kelola produk, stok, dan pantau pergerakan barang</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Produk</p>
                  <p className="text-xl font-bold text-gray-800">{products.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <FaBox className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Total Stok</p>
                  <p className="text-xl font-bold text-gray-800">{totalStock}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <FaBoxOpen className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Stok Menipis</p>
                  <p className="text-xl font-bold text-gray-800">{lowStockItems.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <FaExclamationTriangle className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500"></div>
            <CardContent className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Nilai Inventori</p>
                  <p className="text-xl font-bold text-gray-800">{formatRupiah(totalValue)}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <FaTag className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100"
        >
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <TabsList className="grid grid-cols-6 bg-gray-100 rounded-lg p-0.5">
              {navItems.map(item => (
                <TabsTrigger 
                  key={item.id}
                  value={item.id}
                  className="text-xs py-1.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
                >
                  <div className="flex items-center">
                    {React.cloneElement(item.icon, { 
                      className: `mr-1.5 text-xs ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`
                    })}
                    <span>{item.name}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <FaPlus className="w-3 h-3" />
                    <span>Tambah Produk</span>
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
          
          <TabsContent value="overview" className="p-4">
            {/* Search and action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Cari produk..."
                  className="pl-9 h-8 text-xs"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="outline" 
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 text-xs h-8"
                >
                  <FaFilter className="mr-1.5 h-3 w-3" /> Filter
                </Button>
                
                <Button 
                  size="sm"
                  variant="outline" 
                  className="border-orange-200 text-orange-700 hover:bg-orange-50 text-xs h-8"
                >
                  <FaDownload className="mr-1.5 h-3 w-3" /> Export
                </Button>
              </div>
            </div>
            
            {/* Low stock and expiring soon alerts */}
            {(lowStockItems.length > 0 || expiringSoonItems.length > 0) && (
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowStockItems.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-orange-500 mt-0.5 mr-2 h-3.5 w-3.5" />
                      <div>
                        <h3 className="font-medium text-orange-800 text-xs">Stok Menipis</h3>
                        <p className="text-xs text-orange-700">
                          {lowStockItems.length} produk memiliki stok di bawah batas minimum ({lowStockThreshold} unit).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {expiringSoonItems.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-start">
                      <FaCalendarTimes className="text-red-500 mt-0.5 mr-2 h-3.5 w-3.5" />
                      <div>
                        <h3 className="font-medium text-red-800 text-xs">Kedaluwarsa Segera</h3>
                        <p className="text-xs text-red-700">
                          {expiringSoonItems.length} produk akan kedaluwarsa dalam {expiringSoonDays} hari ke depan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Products table with sticky header and compact style */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="overflow-x-auto max-h-[50vh]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-orange-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">
                        <button 
                          className="flex items-center" 
                          onClick={() => handleSort("name")}
                        >
                          Nama Produk
                          {sortField === "name" ? (
                            sortDirection === "asc" ? (
                              <FaSortUp className="ml-1 text-orange-500" />
                            ) : (
                              <FaSortDown className="ml-1 text-orange-500" />
                            )
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">
                        <button 
                          className="flex items-center" 
                          onClick={() => handleSort("category")}
                        >
                          Kategori
                          {sortField === "category" ? (
                            sortDirection === "asc" ? (
                              <FaSortUp className="ml-1 text-orange-500" />
                            ) : (
                              <FaSortDown className="ml-1 text-orange-500" />
                            )
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">
                        <button 
                          className="flex items-center" 
                          onClick={() => handleSort("stock")}
                        >
                          Stok
                          {sortField === "stock" ? (
                            sortDirection === "asc" ? (
                              <FaSortUp className="ml-1 text-orange-500" />
                            ) : (
                              <FaSortDown className="ml-1 text-orange-500" />
                            )
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-orange-900 uppercase tracking-wider">
                        <button 
                          className="flex items-center" 
                          onClick={() => handleSort("price")}
                        >
                          Harga
                          {sortField === "price" ? (
                            sortDirection === "asc" ? (
                              <FaSortUp className="ml-1 text-orange-500" />
                            ) : (
                              <FaSortDown className="ml-1 text-orange-500" />
                            )
                          ) : (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-orange-900 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {getSortedProducts().length > 0 ? (
                      getSortedProducts().map((product) => (
                        <tr key={product.id} className="hover:bg-orange-50/30 transition-colors">
                          <td className="px-3 py-2 text-xs text-gray-800">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-gray-500 text-xs">ID: {product.id}</div>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 text-xs">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            <span className={`${product.stock <= lowStockThreshold ? 'text-red-600 font-medium' : ''}`}>
                              {product.stock} unit
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {formatRupiah(product.price)}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-500 text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setShowProductModal(true);
                                }}
                              >
                                <FaEdit className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-red-600 hover:text-red-800 hover:bg-red-100"
                              >
                                <FaTrash className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500">
                          {searchTerm ? "Tidak ada produk yang sesuai dengan pencarian" : "Tidak ada produk"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="products" className="p-4">
            <p className="text-gray-500 text-sm">Daftar Produk - Content coming soon</p>
          </TabsContent>
          
          <TabsContent value="stocktake" className="p-4">
            <p className="text-gray-500 text-sm">Stock Opname - Content coming soon</p>
          </TabsContent>
          
          <TabsContent value="expiry" className="p-4">
            <p className="text-gray-500 text-sm">Kadaluarsa - Content coming soon</p>
          </TabsContent>
          
          <TabsContent value="reports" className="p-4">
            <p className="text-gray-500 text-sm">Laporan - Content coming soon</p>
          </TabsContent>
          
          <TabsContent value="adjustment" className="p-4">
            <p className="text-gray-500 text-sm">Penyesuaian - Content coming soon</p>
          </TabsContent>
        </Tabs>
      </div>
    </DashonicLayout>
  );
};

export default InventoryNewPage;
