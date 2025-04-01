import React, { useState } from "react";
import { NextPage } from "next";
import InventoryLayout from "@/components/layouts/inventory-layout";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { mockProducts, Product, mockStocks } from "@/modules/inventory/types";
import { formatRupiah } from "@/lib/utils";
import { 
  FaBalanceScale, 
  FaPlus, 
  FaSearch, 
  FaCalendarAlt, 
  FaUserAlt, 
  FaEdit, 
  FaTrash, 
  FaBarcode,
  FaSave,
  FaFile,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaHistory
} from "react-icons/fa";

// Interface for adjustment item
interface AdjustmentItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  newStock: number;
  adjustmentQuantity: number;
  adjustmentType: "increase" | "decrease";
  reason: string;
}

// Adjustment reasons
const adjustmentReasons = [
  { id: "damaged", label: "Produk Rusak" },
  { id: "expired", label: "Produk Kadaluarsa" },
  { id: "counting", label: "Hasil Stock Opname" },
  { id: "lost", label: "Kehilangan" },
  { id: "admin", label: "Kesalahan Admin" },
  { id: "other", label: "Lainnya" }
];

const AdjustmentPage: NextPage = () => {
  const { toast } = useToast();
  
  // Adjustment form state
  const [adjustmentNumber, setAdjustmentNumber] = useState("");
  const [adjustmentDate, setAdjustmentDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [adjustmentBy, setAdjustmentBy] = useState("");
  const [notes, setNotes] = useState("");
  
  // Adjustment items state
  const [adjustmentItems, setAdjustmentItems] = useState<AdjustmentItem[]>([]);
  
  // Product search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Selected product for adding to adjustment
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStock, setSelectedStock] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<"increase" | "decrease">("increase");
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  
  // Handle product search
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Filter products based on search query
    const results = mockProducts.filter(
      product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery))
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  // Handle selecting a product
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    
    // Find current stock for this product
    const stockInfo = mockStocks.find(s => s.productId === product.id);
    const currentStock = stockInfo ? stockInfo.currentStock : 0;
    
    setSelectedStock(currentStock);
    setNewStock(currentStock);
    setSearchResults([]);
    setSearchQuery("");
  };
  
  // Handle new stock change
  const handleNewStockChange = (value: number) => {
    setNewStock(value);
    
    if (value > selectedStock) {
      setAdjustmentType("increase");
    } else if (value < selectedStock) {
      setAdjustmentType("decrease");
    }
  };
  
  // Add product to adjustment items
  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    if (newStock === selectedStock) {
      toast({
        title: "Tidak Ada Perubahan",
        description: "Stok baru harus berbeda dari stok lama.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reason) {
      toast({
        title: "Alasan Diperlukan",
        description: "Harap pilih alasan penyesuaian stok.",
        variant: "destructive",
      });
      return;
    }
    
    const adjustmentQuantity = Math.abs(newStock - selectedStock);
    const type = newStock > selectedStock ? "increase" : "decrease";
    
    const reasonText = reason === "other" ? customReason : 
      adjustmentReasons.find(r => r.id === reason)?.label || "";
    
    const newItem: AdjustmentItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      currentStock: selectedStock,
      newStock,
      adjustmentQuantity,
      adjustmentType: type,
      reason: reasonText,
    };
    
    setAdjustmentItems([...adjustmentItems, newItem]);
    
    // Reset form
    setSelectedProduct(null);
    setSelectedStock(0);
    setNewStock(0);
    setReason("");
    setCustomReason("");
    
    toast({
      title: "Produk Ditambahkan",
      description: `${selectedProduct.name} telah ditambahkan ke penyesuaian stok.`,
    });
  };
  
  // Remove item from adjustment
  const handleRemoveItem = (itemId: string) => {
    setAdjustmentItems(adjustmentItems.filter(item => item.id !== itemId));
  };
  
  // Save adjustment
  const handleSaveAdjustment = () => {
    if (!adjustmentNumber) {
      toast({
        title: "Nomor Penyesuaian Diperlukan",
        description: "Harap masukkan nomor penyesuaian stok.",
        variant: "destructive",
      });
      return;
    }
    
    if (!adjustmentBy) {
      toast({
        title: "Nama Petugas Diperlukan",
        description: "Harap masukkan nama petugas yang melakukan penyesuaian.",
        variant: "destructive",
      });
      return;
    }
    
    if (adjustmentItems.length === 0) {
      toast({
        title: "Tidak Ada Produk",
        description: "Harap tambahkan minimal satu produk ke penyesuaian stok.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the data to the server
    toast({
      title: "Penyesuaian Stok Berhasil",
      description: `Penyesuaian ${adjustmentNumber} telah disimpan.`,
    });
    
    // Reset form (in a real app, you might redirect to a new page)
    setAdjustmentNumber("");
    setAdjustmentBy("");
    setNotes("");
    setAdjustmentItems([]);
  };
  
  return (
    <InventoryLayout>
      <div className="flex flex-col min-h-screen">
        <Breadcrumbs
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Inventori", href: "/inventory" },
            { title: "Penyesuaian Stok", href: "/inventory/adjustment" },
          ]}
          className="p-6 pb-0"
        />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaBalanceScale className="mr-3 text-purple-500" /> Penyesuaian Stok
              </h1>
              <p className="text-gray-600 mt-1">
                Sesuaikan stok fisik dengan stok di sistem
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                <FaHistory className="mr-2 h-4 w-4" /> Riwayat Penyesuaian
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Adjustment Form */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="bg-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-lg">
                    <FaBalanceScale className="mr-2" /> Form Penyesuaian
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Isi data penyesuaian stok
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adjustmentNumber">Nomor Penyesuaian <span className="text-red-500">*</span></Label>
                    <Input
                      id="adjustmentNumber"
                      value={adjustmentNumber}
                      onChange={(e) => setAdjustmentNumber(e.target.value)}
                      placeholder="ADJ/2025/03/0001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adjustmentDate">Tanggal Penyesuaian <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="adjustmentDate"
                        type="date"
                        value={adjustmentDate}
                        onChange={(e) => setAdjustmentDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adjustmentBy">Dilakukan Oleh <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="adjustmentBy"
                        value={adjustmentBy}
                        onChange={(e) => setAdjustmentBy(e.target.value)}
                        className="pl-10"
                        placeholder="Nama petugas"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Catatan tambahan (opsional)"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Product Search & Add */}
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tambah Produk</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchProduct">Cari Produk</Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="searchProduct"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Nama produk atau barcode"
                          className="pl-10"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={handleSearch}
                      >
                        Cari
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        className="px-3"
                      >
                        <FaBarcode size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Search Results */}
                  {isSearching && <p className="text-gray-500 text-center py-2">Mencari...</p>}
                  
                  {!isSearching && searchResults.length > 0 && (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>SKU</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {searchResults.map((product) => (
                            <TableRow key={product.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{product.sku}</TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSelectProduct(product)}
                                  className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  Pilih
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {!isSearching && searchQuery && searchResults.length === 0 && (
                    <p className="text-gray-500 text-center py-2">Tidak ada produk yang ditemukan</p>
                  )}
                  
                  {/* Selected Product Form */}
                  {selectedProduct && (
                    <div className="space-y-4 mt-4 border-t pt-4">
                      <h4 className="font-medium text-gray-800">Penyesuaian untuk: {selectedProduct.name}</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentStock">Stok Saat Ini</Label>
                        <Input
                          id="currentStock"
                          value={selectedStock}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newStock">Stok Baru <span className="text-red-500">*</span></Label>
                        <Input
                          id="newStock"
                          type="number"
                          min="0"
                          value={newStock}
                          onChange={(e) => handleNewStockChange(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
                        <div className="text-sm font-medium text-gray-700">Ringkasan Perubahan:</div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-600">Kuantitas:</span>
                          <Badge className={
                            newStock > selectedStock 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : newStock < selectedStock 
                              ? "bg-red-100 text-red-800 hover:bg-red-100" 
                              : "bg-gray-100 text-gray-800"
                          }>
                            {newStock > selectedStock && (
                              <><FaArrowUp className="mr-1 h-3 w-3" /> +{newStock - selectedStock}</>
                            )}
                            {newStock < selectedStock && (
                              <><FaArrowDown className="mr-1 h-3 w-3" /> -{selectedStock - newStock}</>
                            )}
                            {newStock === selectedStock && "Tidak ada perubahan"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reason">Alasan Penyesuaian <span className="text-red-500">*</span></Label>
                        <Select value={reason} onValueChange={setReason}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih alasan" />
                          </SelectTrigger>
                          <SelectContent>
                            {adjustmentReasons.map((r) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {reason === "other" && (
                        <div className="space-y-2">
                          <Label htmlFor="customReason">Alasan Lainnya <span className="text-red-500">*</span></Label>
                          <Input
                            id="customReason"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="Masukkan alasan penyesuaian"
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={handleAddProduct}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={newStock === selectedStock}
                        >
                          <FaPlus className="mr-2 h-4 w-4" /> Tambahkan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Adjustment Items Table */}
            <Card className="lg:col-span-2 border-purple-200">
              <CardHeader className="border-b">
                <CardTitle>Daftar Penyesuaian Stok</CardTitle>
                <CardDescription>
                  Produk yang akan disesuaikan stoknya
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-center">Stok Lama</TableHead>
                        <TableHead className="text-center">Stok Baru</TableHead>
                        <TableHead className="text-center">Perubahan</TableHead>
                        <TableHead>Alasan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adjustmentItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                            Belum ada produk yang ditambahkan
                          </TableCell>
                        </TableRow>
                      ) : (
                        adjustmentItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-gray-500">{item.sku}</div>
                            </TableCell>
                            <TableCell className="text-center">{item.currentStock}</TableCell>
                            <TableCell className="text-center">{item.newStock}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={
                                item.adjustmentType === "increase" 
                                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                              }>
                                {item.adjustmentType === "increase" ? (
                                  <><FaArrowUp className="mr-1 h-3 w-3" /> +{item.adjustmentQuantity}</>
                                ) : (
                                  <><FaArrowDown className="mr-1 h-3 w-3" /> -{item.adjustmentQuantity}</>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                                className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <FaTimes className="mr-2 h-4 w-4" /> Batal
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={handleSaveAdjustment}
                  >
                    <FaSave className="mr-2 h-4 w-4" /> Simpan Penyesuaian
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </InventoryLayout>
  );
};

export default AdjustmentPage;
