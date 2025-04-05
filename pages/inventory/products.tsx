import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from 'next/router';
import InventoryPageLayout from "@/modules/inventory/components/InventoryPageLayout";
import InventoryPageHeader from "@/modules/inventory/components/InventoryPageHeader";
import InventoryStatCard from "@/modules/inventory/components/InventoryStatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ProductTable from "@/modules/inventory/components/ProductTable";
import LowStockTable from "@/modules/inventory/components/LowStockTable";
import { Product, mockProducts, mockCategories, mockStocks, mockPriceGroups, mockProductConsumptionStats } from "@/modules/inventory/types";
import { 
  FaPlus, 
  FaBoxOpen, 
  FaDownload, 
  FaUpload, 
  FaPrint, 
  FaClipboardList,
  FaInfoCircle,
  FaExclamationTriangle,
  FaFilter,
  FaTags,
  FaCapsules,
  FaBox,
  FaLayerGroup,
  FaTools,
  FaSearch,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaTruck,
  FaBuilding,
  FaChevronDown,
  FaCheckCircle,
  FaFileImport,
  FaFileExport
} from "react-icons/fa";
import ProductForm from "@/modules/inventory/components/ProductForm";
import ProductDetail from "@/modules/inventory/components/ProductDetail";
import CategoryManager from "@/modules/inventory/components/CategoryManager";
import ProductFormManager from "@/modules/inventory/components/ProductFormManager";
import ProductPackagingManager from "@/modules/inventory/components/ProductPackagingManager";
import PriceGroupManager from "@/modules/inventory/components/PriceGroupManager";
import SupplierManager from "@/modules/inventory/components/SupplierManager"; 
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProductsPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("all");
  const [productTab, setProductTab] = useState("products");
  const [stockTab, setStockTab] = useState("all");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'csv' | 'pdf' | ''>('');
  const [importFormat, setImportFormat] = useState<'excel' | 'csv' | ''>('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddProduct = (product: Product) => {
    setProducts([...products, { ...product, id: (products.length + 1).toString() }]);
    setIsAddModalOpen(false);
    toast({
      title: "Produk berhasil ditambahkan",
      description: `${product.name} telah ditambahkan ke inventori.`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setProducts(products.map(p => (p.id === product.id ? product : p)));
    setIsEditModalOpen(false);
    toast({
      title: "Produk berhasil diperbarui",
      description: `${product.name} telah diperbarui.`,
    });
  };

  const handleDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete));
      setIsDeleteModalOpen(false);
      toast({
        title: "Produk berhasil dihapus",
        description: `Produk telah dihapus dari inventori.`,
        variant: "destructive",
      });
      setProductToDelete(null);
    }
  };

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
  };

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    setExportFormat(format);
    setIsExportModalOpen(true);
  };

  const handleImport = (format: 'excel' | 'csv') => {
    setImportFormat(format);
    setIsImportModalOpen(true);
  };

  const exportData = () => {
    // Implementasi ekspor data sesuai format
    toast({
      title: `Ekspor ${exportFormat.toUpperCase()} berhasil`,
      description: `Data produk telah diekspor dalam format ${exportFormat.toUpperCase()}.`,
    });
    setIsExportModalOpen(false);
  };

  const downloadTemplate = () => {
    // Implementasi download template
    toast({
      title: `Template ${importFormat.toUpperCase()} tersedia`,
      description: `Template ${importFormat.toUpperCase()} telah diunduh.`,
    });
  };

  const importData = () => {
    // Implementasi impor data
    toast({
      title: "Impor data berhasil",
      description: "Data produk telah berhasil diimpor.",
    });
    setIsImportModalOpen(false);
  };

  const handleCreatePurchaseOrder = (product: Product) => {
    router.push({
      pathname: '/purchasing',
      query: { 
        action: 'create-order',
        productId: product.id,
        productName: product.name,
        productSku: product.sku
      }
    });
    toast({
      title: "Navigasi ke Pembelian",
      description: `Membuat pesanan pembelian untuk ${product.name}`,
    });
  };

  const handleAddToDefectList = (product: Product) => {
    // In a real application, this would add the product to a defect list
    // Here we just show an alert for demonstration
    alert(`Adding ${product.name} to defect list`);
    // Would typically use a mutation or API call here
  };

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => product.categoryId === activeTab);
    
  const searchFilteredProducts = searchTerm 
    ? filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredProducts;

  const filterProductsByStock = () => {
    if (stockTab === "all") return searchFilteredProducts;
    if (stockTab === "low") {
      return searchFilteredProducts.filter(product => {
        const stock = mockStocks.find(s => s.productId === product.id);
        return stock && stock.currentStock < (product.minStock || 10);
      });
    }
    if (stockTab === "out") {
      return searchFilteredProducts.filter(product => {
        const stock = mockStocks.find(s => s.productId === product.id);
        return stock && stock.currentStock === 0;
      });
    }
    return searchFilteredProducts;
  };

  const stockFilteredProducts = filterProductsByStock();

  // Header action buttons
  const headerActionButtons = (
    <>
      <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm font-medium">
        <FaClipboardList className="mr-1.5 h-4 w-4" />
        Modul Stok
      </Button>
      <Button className="bg-white text-orange-600 hover:bg-orange-50 hover:text-orange-700 border-orange-100 text-sm font-medium">
        <FaPlus className="mr-1.5 h-4 w-4" />
        Tambah Produk
      </Button>
    </>
  );

  return (
    <InventoryPageLayout title="Manajemen Produk" description="Kelola produk, kategori, dan supplier untuk apotek Anda">
      {/* Header dengan gradient dan info statistik */}
      <InventoryPageHeader 
        title="Manajemen Produk" 
        subtitle="Kelola produk farmasi, informasi, dan stok untuk apotek Anda"
        actionButtons={headerActionButtons}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InventoryStatCard
          title="Total Produk"
          value={products.length}
          icon={<FaBoxOpen className="h-5 w-5" />}
          gradient={true}
        />
        
        <InventoryStatCard
          title="Kategori"
          value={mockCategories.length}
          icon={<FaTags className="h-5 w-5" />}
          gradient={true}
        />
        
        <InventoryStatCard
          title="Stok Minimum"
          value={products.filter(p => p.minStock > 0).length}
          icon={<FaInfoCircle className="h-5 w-5" />}
          gradient={true}
        />
        
        <InventoryStatCard
          title="Perlu Perhatian"
          value={5}
          icon={<FaExclamationTriangle className="h-5 w-5" />}
          color="red"
          gradient={true}
        />
      </div>

      {/* Filter dan Aksi */}
      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/3 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Cari produk..." 
                className="pl-10 h-10 text-base"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="text-sm border-orange-200 text-orange-700 hover:bg-orange-50 font-medium"
              >
                <FaFilter className="mr-1.5 h-3.5 w-3.5" /> Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-sm border-orange-200 text-orange-700 hover:bg-orange-50 font-medium"
                  >
                    <FaDownload className="mr-1.5 h-3.5 w-3.5" /> Ekspor
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 font-medium">
                  <DropdownMenuItem onClick={() => handleExport('excel')} className="py-2 text-sm cursor-pointer">
                    <FaFileExcel className="mr-2 h-4 w-4 text-green-600" /> Ekspor ke Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('csv')} className="py-2 text-sm cursor-pointer">
                    <FaFileCsv className="mr-2 h-4 w-4 text-blue-600" /> Ekspor ke CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')} className="py-2 text-sm cursor-pointer">
                    <FaFilePdf className="mr-2 h-4 w-4 text-red-600" /> Ekspor ke PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="text-sm border-orange-200 text-orange-700 hover:bg-orange-50 font-medium"
                  >
                    <FaUpload className="mr-1.5 h-3.5 w-3.5" /> Impor
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 font-medium">
                  <DropdownMenuItem onClick={() => handleImport('excel')} className="py-2 text-sm cursor-pointer">
                    <FaFileExcel className="mr-2 h-4 w-4 text-green-600" /> Impor dari Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleImport('csv')} className="py-2 text-sm cursor-pointer">
                    <FaFileCsv className="mr-2 h-4 w-4 text-blue-600" /> Impor dari CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                className="text-sm bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 font-medium"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FaPlus className="mr-1.5 h-3.5 w-3.5" /> Tambah Produk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Management Tabs */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <Tabs value={productTab} onValueChange={setProductTab}>
          <TabsList className="grid w-full grid-cols-5 bg-orange-50 rounded-none border-b border-orange-100 p-0">
            <TabsTrigger
              value="products"
              className="text-sm py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-700 data-[state=active]:font-medium data-[state=active]:bg-white"
            >
              <FaBoxOpen className="mr-1.5 h-4 w-4" /> Produk
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="text-sm py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-700 data-[state=active]:font-medium data-[state=active]:bg-white"
            >
              <FaTags className="mr-1.5 h-4 w-4" /> Kategori
            </TabsTrigger>
            <TabsTrigger
              value="forms"
              className="text-sm py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-700 data-[state=active]:font-medium data-[state=active]:bg-white"
            >
              <FaCapsules className="mr-1.5 h-4 w-4" /> Bentuk Sediaan
            </TabsTrigger>
            <TabsTrigger
              value="price-groups"
              className="text-sm py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-700 data-[state=active]:font-medium data-[state=active]:bg-white"
            >
              <FaLayerGroup className="mr-1.5 h-4 w-4" /> Grup Harga
            </TabsTrigger>
            <TabsTrigger
              value="suppliers"
              className="text-sm py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-700 data-[state=active]:font-medium data-[state=active]:bg-white"
            >
              <FaTruck className="mr-1.5 h-4 w-4" /> Supplier
            </TabsTrigger>
          </TabsList>

          <CardContent className="p-0">
            <TabsContent value="products" className="m-0">
              <CardHeader className="border-b border-gray-100 p-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="inline-flex h-9 bg-white p-1 rounded-md border border-gray-200">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-sm"
                    >
                      Semua
                    </TabsTrigger>
                    {mockCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-sm"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                <Tabs value={stockTab} onValueChange={setStockTab}>
                  <TabsList className="inline-flex h-9 bg-white p-1 rounded-md border border-gray-200">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-sm"
                    >
                      Semua
                    </TabsTrigger>
                    <TabsTrigger
                      value="low"
                      className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-sm"
                    >
                      Stok Rendah
                    </TabsTrigger>
                    <TabsTrigger
                      value="out"
                      className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-sm"
                    >
                      Stok Habis
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <div className="p-5">
                {productTab === "products" && (
                  <>
                    {stockTab === "low" ? (
                      <LowStockTable
                        products={stockFilteredProducts}
                        stocks={mockStocks}
                        consumptionStats={mockProductConsumptionStats}
                        onViewDetail={(product) => {
                          setSelectedProduct(product);
                          setIsDetailModalOpen(true);
                        }}
                        onCreatePurchaseOrder={handleCreatePurchaseOrder}
                        onAddToDefectList={handleAddToDefectList}
                      />
                    ) : (
                      <ProductTable
                        products={stockFilteredProducts}
                        onViewDetail={(product) => {
                          setSelectedProduct(product);
                          setIsDetailModalOpen(true);
                        }}
                        onEdit={(product) => {
                          setSelectedProduct(product);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={(productId) => {
                          setProductToDelete(productId);
                          setIsDeleteModalOpen(true);
                        }}
                        onCreatePurchaseOrder={handleCreatePurchaseOrder}
                        onAddToDefectList={handleAddToDefectList}
                      />
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories" className="m-0 p-5">
              <CategoryManager />
            </TabsContent>

            <TabsContent value="forms" className="m-0 p-5">
              <ProductFormManager />
            </TabsContent>

            <TabsContent value="price-groups" className="m-0 p-5">
              <PriceGroupManager />
            </TabsContent>

            <TabsContent value="suppliers" className="m-0 p-5">
              <SupplierManager /> 
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Tambah Produk Baru</DialogTitle>
            <DialogDescription className="text-gray-600">
              Masukkan informasi produk baru untuk ditambahkan ke inventori.
            </DialogDescription>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} onCancel={() => setIsAddModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Edit Produk</DialogTitle>
            <DialogDescription className="text-gray-600">
              Ubah informasi produk yang dipilih.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              product={selectedProduct}
              onSubmit={handleEditProduct}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[85vw] p-0 bg-transparent border-0 shadow-none">
          {selectedProduct && (
            <ProductDetail 
              product={selectedProduct} 
              onClose={handleDetailClose} 
              onEdit={(product) => {
                handleDetailClose();
                handleEdit(product);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Konfirmasi Hapus</DialogTitle>
            <DialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="font-medium"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProduct}
              className="font-medium"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Ekspor Data</DialogTitle>
            <DialogDescription className="text-gray-600">
              Pilih format ekspor data produk.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                exportFormat === 'excel' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <FaFileExcel className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Excel (.xlsx)</h3>
                <p className="text-sm text-gray-500">Format spreadsheet untuk Microsoft Excel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                exportFormat === 'csv' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <FaFileCsv className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">CSV (.csv)</h3>
                <p className="text-sm text-gray-500">Format comma-separated values</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                exportFormat === 'pdf' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <FaFilePdf className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">PDF (.pdf)</h3>
                <p className="text-sm text-gray-500">Format dokumen portabel</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(false)}
              className="font-medium"
            >
              Batal
            </Button>
            <Button
              onClick={exportData}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
              disabled={!exportFormat}
            >
              Ekspor Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Impor Data</DialogTitle>
            <DialogDescription className="text-gray-600">
              Pilih format untuk mengimpor data produk.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                importFormat === 'excel' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <FaFileExcel className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Excel (.xlsx)</h3>
                <p className="text-sm text-gray-500">Format spreadsheet dari Microsoft Excel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                importFormat === 'csv' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <FaFileCsv className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">CSV (.csv)</h3>
                <p className="text-sm text-gray-500">Format comma-separated values</p>
              </div>
            </div>
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center mt-4">
              <FaFileImport className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Seret dan lepaskan file atau klik untuk memilih</p>
              <input type="file" className="hidden" id="file-upload" />
              <label htmlFor="file-upload">
                <Button variant="outline" className="font-medium">Pilih File</Button>
              </label>
            </div>
          </div>
          <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-between items-center">
            <Button
              variant="outline" 
              onClick={downloadTemplate}
              className="w-full sm:w-auto font-medium"
              disabled={!importFormat}
            >
              <FaDownload className="mr-1.5 h-4 w-4" />
              Unduh Template
            </Button>
            <div className="flex space-x-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsImportModalOpen(false)}
                className="flex-1 font-medium"
              >
                Batal
              </Button>
              <Button
                onClick={importData}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium"
                disabled={!importFormat}
              >
                Impor Data
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </InventoryPageLayout>
  );
};

export default ProductsPage;
