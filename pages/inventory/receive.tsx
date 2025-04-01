import React, { useState } from "react";
import { NextPage } from "next";
import DashboardLayout from "@/components/layouts/dashboard-layout";
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
import { useToast } from "@/components/ui/use-toast";
import { mockProducts, Product } from "@/modules/inventory/types";
import { formatRupiah } from "@/lib/utils";
import { 
  FaWarehouse, 
  FaPlus, 
  FaSearch, 
  FaCalendarAlt, 
  FaUserTie, 
  FaEdit, 
  FaTrash, 
  FaBarcode,
  FaBoxOpen,
  FaSave,
  FaFile,
  FaTimes
} from "react-icons/fa";

// Mock suppliers
const mockSuppliers = [
  { id: "1", name: "PT Pharma Utama" },
  { id: "2", name: "CV Medika Jaya" },
  { id: "3", name: "PT Buana Farma" }
];

// Interface for receipt item
interface ReceiptItem {
  id: string;
  productId: string;
  productName: string;
  batch: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  subtotal: number;
}

const ReceivePage: NextPage = () => {
  const { toast } = useToast();
  
  // Receipt form state
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptDate, setReceiptDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [notes, setNotes] = useState("");
  
  // Receipt items state
  const [receiptItems, setReceiptItems] = useState<ReceiptItem[]>([]);
  
  // Product search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Selected product for adding to receipt
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [batch, setBatch] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState(0);
  
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
    setPurchasePrice(product.purchasePrice);
    setSearchResults([]);
    setSearchQuery("");
  };
  
  // Add product to receipt items
  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    if (!batch) {
      toast({
        title: "Nomor Batch Diperlukan",
        description: "Harap masukkan nomor batch produk.",
        variant: "destructive",
      });
      return;
    }
    
    if (!expiryDate) {
      toast({
        title: "Tanggal Kadaluarsa Diperlukan",
        description: "Harap masukkan tanggal kadaluarsa produk.",
        variant: "destructive",
      });
      return;
    }
    
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      batch,
      expiryDate,
      quantity,
      purchasePrice,
      subtotal: quantity * purchasePrice,
    };
    
    setReceiptItems([...receiptItems, newItem]);
    
    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
    setBatch("");
    setExpiryDate("");
    setPurchasePrice(0);
    
    toast({
      title: "Produk Ditambahkan",
      description: `${selectedProduct.name} telah ditambahkan ke penerimaan.`,
    });
  };
  
  // Remove item from receipt
  const handleRemoveItem = (itemId: string) => {
    setReceiptItems(receiptItems.filter(item => item.id !== itemId));
  };
  
  // Calculate total
  const calculateTotal = () => {
    return receiptItems.reduce((total, item) => total + item.subtotal, 0);
  };
  
  // Save receipt
  const handleSaveReceipt = () => {
    if (!receiptNumber) {
      toast({
        title: "Nomor Penerimaan Diperlukan",
        description: "Harap masukkan nomor penerimaan barang.",
        variant: "destructive",
      });
      return;
    }
    
    if (!supplier) {
      toast({
        title: "Supplier Diperlukan",
        description: "Harap pilih supplier.",
        variant: "destructive",
      });
      return;
    }
    
    if (receiptItems.length === 0) {
      toast({
        title: "Tidak Ada Produk",
        description: "Harap tambahkan minimal satu produk ke penerimaan.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the data to the server
    toast({
      title: "Penerimaan Barang Berhasil",
      description: `Penerimaan ${receiptNumber} telah disimpan.`,
    });
    
    // Reset form (in a real app, you might redirect to a new page)
    setReceiptNumber("");
    setInvoiceNumber("");
    setSupplier("");
    setNotes("");
    setReceiptItems([]);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen">
        <Breadcrumbs
          items={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Inventori", href: "/inventory" },
            { title: "Penerimaan Barang", href: "/inventory/receive" },
          ]}
          className="p-6 pb-0"
        />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaWarehouse className="mr-3 text-green-500" /> Penerimaan Barang
              </h1>
              <p className="text-gray-600 mt-1">
                Catat dan kelola penerimaan barang ke gudang
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                <FaFile className="mr-2 h-4 w-4" /> Riwayat Penerimaan
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Receipt Form */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="bg-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-lg">
                    <FaBoxOpen className="mr-2" /> Form Penerimaan
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Isi data penerimaan barang
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Nomor Penerimaan <span className="text-red-500">*</span></Label>
                    <Input
                      id="receiptNumber"
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      placeholder="GR/2025/03/0001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="receiptDate">Tanggal Penerimaan <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="receiptDate"
                        type="date"
                        value={receiptDate}
                        onChange={(e) => setReceiptDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Nomor Faktur / Invoice</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="INV/2025/0012"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Select value={supplier} onValueChange={setSupplier}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Pilih supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSuppliers.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <h4 className="font-medium text-gray-800">Detail Produk: {selectedProduct.name}</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="batch">Nomor Batch <span className="text-red-500">*</span></Label>
                          <Input
                            id="batch"
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            placeholder="B12345"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Tanggal Kadaluarsa <span className="text-red-500">*</span></Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Jumlah <span className="text-red-500">*</span></Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="purchasePrice">Harga Beli (Rp) <span className="text-red-500">*</span></Label>
                          <Input
                            id="purchasePrice"
                            type="number"
                            min="0"
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={handleAddProduct}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <FaPlus className="mr-2 h-4 w-4" /> Tambahkan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Receipt Items Table */}
            <Card className="lg:col-span-2 border-green-200">
              <CardHeader className="border-b">
                <CardTitle>Daftar Produk yang Diterima</CardTitle>
                <CardDescription>
                  Produk yang akan ditambahkan ke stok
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Produk</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Kadaluarsa</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Harga Beli</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receiptItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                            Belum ada produk yang ditambahkan
                          </TableCell>
                        </TableRow>
                      ) : (
                        receiptItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{item.batch}</TableCell>
                            <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatRupiah(item.purchasePrice)}</TableCell>
                            <TableCell className="text-right">{formatRupiah(item.subtotal)}</TableCell>
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
                
                {receiptItems.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div></div>
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-4">
                          <span className="text-gray-600">Total:</span>
                          <span className="text-xl font-bold text-green-600">
                            {formatRupiah(calculateTotal())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <FaTimes className="mr-2 h-4 w-4" /> Batal
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSaveReceipt}
                  >
                    <FaSave className="mr-2 h-4 w-4" /> Simpan Penerimaan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceivePage;
