import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, mockCategories, mockStocks, StockTransaction } from "../types";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";
import { 
  FaBoxOpen, 
  FaInfoCircle, 
  FaWarehouse, 
  FaCalendarAlt, 
  FaBarcode, 
  FaIndustry,
  FaClipboardList,
  FaEdit,
  FaPrint,
  FaQrcode,
  FaTimes,
  FaTag,
  FaBoxes,
  FaMoneyBillWave,
  FaShoppingCart,
  FaHistory,
  FaExchangeAlt,
  FaArrowDown,
  FaArrowUp,
  FaExclamationTriangle,
  FaCheck,
  FaUserAlt,
  FaRegularCalendarAlt,
  FaClock,
  FaRegularClock,
  FaStore
} from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

// Extended product properties not included in the Product interface
interface ExtendedProductProps {
  barcode?: string;
  brand?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  dateUpdated?: Date;
}

// Sample mock data for transactions and stock movements
const mockOrderHistory = [
  { id: "PO-001", date: new Date("2024-03-15"), quantity: 50, status: "completed", supplier: "PT Farmasi Utama", price: 120000 },
  { id: "PO-002", date: new Date("2024-02-20"), quantity: 25, status: "pending", supplier: "Distributor Medika", price: 60000 },
  { id: "PO-003", date: new Date("2024-01-05"), quantity: 100, status: "completed", supplier: "PT Farmasi Utama", price: 220000 },
];

const mockStockTransactions = [
  { id: "TR-001", date: new Date("2024-03-20"), type: "in", quantity: 50, source: "Pembelian PO-001", notes: "Penerimaan barang" },
  { id: "TR-002", date: new Date("2024-03-21"), type: "out", quantity: 5, source: "Penjualan INV-123", notes: "Penjualan ke pelanggan" },
  { id: "TR-003", date: new Date("2024-03-22"), type: "out", quantity: 2, source: "Penjualan INV-124", notes: "Penjualan ke pelanggan" },
  { id: "TR-004", date: new Date("2024-03-22"), type: "out", quantity: 1, source: "Penggunaan internal", notes: "Sampel produk" },
  { id: "TR-005", date: new Date("2024-03-25"), type: "in", quantity: 25, source: "Retur INV-125", notes: "Pengembalian produk rusak" },
];

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = useState("info");
  
  const getCategoryName = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    return category ? category.name : "Tidak Dikategorikan";
  };

  // Find stock information for this product
  const stockInfo = mockStocks.find(s => s.productId === product.id);
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Tidak tersedia";
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "Tidak tersedia";
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Cast product to include extended properties
  const extendedProduct = product as unknown as Product & ExtendedProductProps;
  
  // Calculate profit margin percentage if purchase and selling prices are available
  const purchasePrice = extendedProduct.purchasePrice || 0;
  const sellingPrice = extendedProduct.sellingPrice || 0;
  const profitMarginPercentage = purchasePrice > 0 
    ? Math.round(((sellingPrice - purchasePrice) / purchasePrice) * 100) 
    : 0;

  // Determine stock status
  const getStockStatus = () => {
    if (!stockInfo?.currentStock) return { text: "Habis", color: "bg-red-500 text-white" };
    if (product.minStock && stockInfo.currentStock <= product.minStock) 
      return { text: "Stok Minimum", color: "bg-amber-500 text-white" };
    return { text: "Tersedia", color: "bg-emerald-500 text-white" };
  };
  
  const stockStatus = getStockStatus();

  // Determine expiry status
  const getExpiryStatus = () => {
    if (!stockInfo?.expiryDate) return { text: "Tidak Ada", color: "text-gray-500" };
    const expiryDate = new Date(stockInfo.expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    if (expiryDate < now) return { text: formatDate(expiryDate), color: "text-red-600" };
    if (expiryDate < thirtyDaysFromNow) return { text: formatDate(expiryDate), color: "text-amber-600" };
    return { text: formatDate(expiryDate), color: "text-gray-800" };
  };
  
  const expiryStatus = getExpiryStatus();

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10 lg:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="rounded-full h-8 w-8 bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-md transition-all hover:scale-105"
        >
          <FaTimes className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Decorative element - top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-lg"></div>
      
      <div className="max-h-[90vh] overflow-hidden w-full" style={{ maxWidth: '850px' }}>
        {/* Card Container with Pharmaceutical Style */}
        <div className="bg-white rounded-xl shadow-xl relative overflow-hidden flex flex-col h-[650px]">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Abstract Pill Shapes - Top Layer */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-red-500/15 to-orange-500/5 blur-xl"></div>
            <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-orange-500/15 to-amber-500/5 blur-xl"></div>
            <div className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-red-500/10 to-orange-500/5 blur-xl"></div>
            
            {/* Pill Dots Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none"></div>
          </div>

          {/* Header - Always visible */}
          <div className="flex items-start p-5 border-b border-orange-100">
            {/* Left Side - Product Image */}
            <div className="mr-5">
              <div className="w-[90px] h-[90px] rounded-lg bg-gradient-to-br from-red-500 to-amber-500 p-0.5 shadow-lg">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={85}
                      height={85}
                      className="object-contain p-1 rounded-md"
                    />
                  ) : (
                    <FaBoxOpen size={40} className="text-orange-400" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Middle - Product Info */}
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-0 mb-1 rounded-md text-xs mr-2 px-2 py-0.5">
                  <FaTag className="h-2.5 w-2.5 mr-1" /> {getCategoryName(product.categoryId)}
                </Badge>
                
                <Badge className={`px-2 py-0.5 text-xs rounded-md ${stockStatus.color}`}>
                  {stockStatus.text}
                  {stockInfo && stockInfo.currentStock > 0 && (
                    <span className="ml-1 inline-flex items-center">
                      <FaBoxes className="mr-1 h-2.5 w-2.5" />{stockInfo.currentStock} {product.unit}
                    </span>
                  )}
                </Badge>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
              
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <div className="flex items-center mr-4">
                  <FaBarcode className="h-3 w-3 mr-1 text-orange-500" /> 
                  <span>{product.sku || "Tidak ada SKU"}</span>
                </div>
                
                {extendedProduct.brand && (
                  <div className="flex items-center">
                    <FaIndustry className="h-3 w-3 mr-1 text-orange-500" /> 
                    <span>{extendedProduct.brand}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right - Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8 hidden lg:block"
            >
              <FaTimes size={16} />
            </Button>
          </div>
          
          {/* Main Content with Tabs */}
          <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
            <div className="px-5 pt-4 border-b border-orange-100">
              <TabsList className="grid w-full grid-cols-3 bg-orange-50 p-0.5">
                <TabsTrigger 
                  value="info" 
                  className="py-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                >
                  <FaInfoCircle className="mr-2 h-3.5 w-3.5" /> Informasi Produk
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="py-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                >
                  <FaShoppingCart className="mr-2 h-3.5 w-3.5" /> Riwayat Pembelian
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="py-2 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
                >
                  <FaExchangeAlt className="mr-2 h-3.5 w-3.5" /> Mutasi Stok
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Information Tab */}
            <TabsContent value="info" className="flex-1 overflow-y-auto p-0 m-0">
              <div className="p-5">
                {/* Top Section: Price and Stock Information */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Price Section */}
                  <div className="bg-gradient-to-r from-orange-50/80 to-white rounded-lg border border-orange-100 overflow-hidden h-full">
                    <div className="flex items-center px-3 py-2 border-b border-orange-100 bg-gradient-to-r from-orange-100/50 to-white">
                      <FaMoneyBillWave className="text-orange-500 mr-2" size={14} />
                      <h3 className="font-medium text-orange-800 text-sm">Informasi Harga</h3>
                    </div>
                    
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-center justify-center p-2 bg-orange-50/50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Harga Beli</div>
                          <div className="text-base font-semibold text-gray-800 truncate max-w-full">
                            {purchasePrice ? formatRupiah(purchasePrice) : "—"}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center p-2 bg-orange-50/50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Harga Jual</div>
                          <div className="text-base font-semibold text-gray-800 truncate max-w-full">
                            {sellingPrice ? formatRupiah(sellingPrice) : "—"}
                          </div>
                        </div>
                      </div>
                      
                      {purchasePrice > 0 && sellingPrice > 0 && (
                        <div className="mt-2.5">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Margin Keuntungan</span>
                            <span className="font-medium text-orange-600">{profitMarginPercentage}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 w-full overflow-hidden">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500" 
                              style={{ width: `${Math.min(profitMarginPercentage, 100)}%` }} 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Stock and Expiry Grid */}
                  <div className="grid grid-rows-2 gap-3">
                    {/* Stock Information */}
                    <div className="bg-gradient-to-r from-red-50/80 to-white rounded-lg border border-red-100 overflow-hidden">
                      <div className="flex items-center px-3 py-2 border-b border-red-100 bg-gradient-to-r from-red-100/50 to-white">
                        <FaWarehouse className="text-red-500 mr-2" size={14} />
                        <h3 className="font-medium text-red-800 text-sm">Stok</h3>
                      </div>
                      
                      <div className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-lg font-semibold text-gray-800 mr-1">
                            {stockInfo?.currentStock || 0}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.unit}
                          </div>
                        </div>
                        
                        <div className="border-l border-red-100 pl-3">
                          <div className="text-xs text-gray-500">Min. Stok</div>
                          <div className="text-sm font-medium text-gray-700">
                            {product.minStock || 0} {product.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expiry Information */}
                    <div className="bg-gradient-to-r from-amber-50/80 to-white rounded-lg border border-amber-100 overflow-hidden">
                      <div className="flex items-center px-3 py-2 border-b border-amber-100 bg-gradient-to-r from-amber-100/50 to-white">
                        <FaCalendarAlt className="text-amber-500 mr-2" size={14} />
                        <h3 className="font-medium text-amber-800 text-sm">Kadaluarsa</h3>
                      </div>
                      
                      <div className="p-3 flex items-center justify-between">
                        <div className={`text-sm font-medium ${expiryStatus.color} line-clamp-1`}>
                          {expiryStatus.text}
                        </div>
                        
                        {stockInfo?.batchNumber && (
                          <div className="border-l border-amber-100 pl-3">
                            <div className="text-xs text-gray-500">No. Batch</div>
                            <div className="text-sm font-medium text-gray-700">
                              {stockInfo.batchNumber}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Middle Section: Product Information */}
                <div className="bg-gradient-to-r from-orange-50/80 to-white rounded-lg border border-orange-100 overflow-hidden mt-4">
                  <div className="flex items-center px-3 py-2 border-b border-orange-100 bg-gradient-to-r from-orange-100/50 to-white">
                    <FaClipboardList className="text-orange-500 mr-2" size={14} />
                    <h3 className="font-medium text-orange-800 text-sm">Detail Produk</h3>
                  </div>
                  
                  <div className="divide-y divide-orange-100">
                    {/* Barcode */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="text-sm text-gray-700 flex items-center">
                        <FaBarcode className="text-orange-500 mr-2" size={14} />
                        Barcode
                      </div>
                      <div className="flex items-center text-sm text-gray-900 max-w-[170px] truncate">
                        {extendedProduct.barcode ? (
                          <span className="font-mono">{extendedProduct.barcode}</span>
                        ) : (
                          <span className="text-gray-400">Tidak ada</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Storage Location */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="text-sm text-gray-700 flex items-center">
                        <FaStore className="text-orange-500 mr-2" size={14} />
                        Lokasi
                      </div>
                      <div className="text-sm font-medium text-gray-900 max-w-[170px] truncate">
                        {stockInfo?.storageLocation || "Tidak Ditentukan"}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="p-3">
                      <div className="text-sm text-gray-700 flex items-center mb-2">
                        <FaInfoCircle className="text-orange-500 mr-2" size={14} />
                        Deskripsi
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line overflow-y-auto max-h-[70px]">
                        {product.description ? (
                          <p>{product.description}</p>
                        ) : (
                          <div className="flex items-center justify-center py-2.5 text-center text-gray-400 text-sm">
                            <p>Tidak ada deskripsi produk</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Dates */}
                    <div className="p-3 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ditambahkan</div>
                        <div className="text-sm font-medium text-gray-700 truncate">{formatDate(product.dateAdded)}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Diperbarui</div>
                        <div className="text-sm font-medium text-gray-700 truncate">{formatDate(extendedProduct.dateUpdated)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Orders Tab */}
            <TabsContent value="orders" className="flex-1 overflow-y-auto p-0 m-0">
              <div className="p-5">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader className="bg-orange-50">
                      <TableRow>
                        <TableHead className="text-sm font-medium text-orange-800">No. PO</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Tanggal</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Supplier</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Jumlah</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Total</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrderHistory.length > 0 ? (
                        mockOrderHistory.map((order) => (
                          <TableRow key={order.id} className="hover:bg-orange-50/60">
                            <TableCell className="font-medium text-sm">{order.id}</TableCell>
                            <TableCell className="text-sm">{formatDate(order.date)}</TableCell>
                            <TableCell className="text-sm">{order.supplier}</TableCell>
                            <TableCell className="text-sm">{order.quantity} {product.unit}</TableCell>
                            <TableCell className="text-sm">{formatRupiah(order.price)}</TableCell>
                            <TableCell>
                              <Badge className={order.status === "completed" 
                                ? "bg-green-100 text-green-800 border-0" 
                                : "bg-amber-100 text-amber-800 border-0"}>
                                {order.status === "completed" ? "Selesai" : "Menunggu"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-gray-500 text-sm">
                            Belum ada riwayat pembelian untuk produk ini
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 flex items-center">
                  <FaInfoCircle className="mr-2 text-orange-500" size={14} />
                  Menampilkan riwayat pemesanan pembelian 3 bulan terakhir
                </div>
              </div>
            </TabsContent>
            
            {/* Stock Transactions Tab */}
            <TabsContent value="transactions" className="flex-1 overflow-y-auto p-0 m-0">
              <div className="p-5">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader className="bg-orange-50">
                      <TableRow>
                        <TableHead className="text-sm font-medium text-orange-800">Tanggal</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Tipe</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Jumlah</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Sumber</TableHead>
                        <TableHead className="text-sm font-medium text-orange-800">Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockStockTransactions.length > 0 ? (
                        mockStockTransactions.map((transaction) => (
                          <TableRow key={transaction.id} className="hover:bg-orange-50/60">
                            <TableCell className="text-sm">{formatDate(transaction.date)}</TableCell>
                            <TableCell>
                              <div className={`flex items-center ${
                                transaction.type === "in" ? "text-emerald-600" : "text-red-600"
                              }`}>
                                {transaction.type === "in" ? (
                                  <FaArrowDown className="mr-2" size={12} />
                                ) : (
                                  <FaArrowUp className="mr-2" size={12} />
                                )}
                                <span className="text-sm">
                                  {transaction.type === "in" ? "Masuk" : "Keluar"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {transaction.quantity} {product.unit}
                            </TableCell>
                            <TableCell className="text-sm">{transaction.source}</TableCell>
                            <TableCell className="text-sm text-gray-600">{transaction.notes}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-gray-500 text-sm">
                            Belum ada riwayat mutasi stok untuk produk ini
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 text-sm text-gray-500 flex items-center">
                  <FaInfoCircle className="mr-2 text-orange-500" size={14} />
                  Menampilkan riwayat mutasi stok 30 hari terakhir
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Action Buttons - Always visible at bottom */}
          <div className="p-4 border-t border-orange-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 gap-2"
              >
                <FaEdit className="h-4 w-4" /> Edit Produk
              </Button>
              
              <Button 
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 gap-2"
              >
                <FaShoppingCart className="h-4 w-4" /> Buat Pesanan Pembelian
              </Button>
              
              <Button 
                variant="outline"
                className="border-orange-200 text-orange-700 hover:bg-orange-50 gap-2"
                onClick={onClose}
              >
                <FaTimes className="h-4 w-4" /> Tutup
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
