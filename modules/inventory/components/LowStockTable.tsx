import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FaPlus, FaExclamationTriangle, FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { Product, Stock, ProductConsumptionStats } from "../types";

interface LowStockTableProps {
  products: Product[];
  stocks: Stock[];
  consumptionStats: ProductConsumptionStats[];
  onViewDetail: (product: Product) => void;
  onCreatePurchaseOrder: (product: Product) => void;
  onAddToDefectList: (product: Product) => void;
}

const LowStockTable: React.FC<LowStockTableProps> = ({
  products,
  stocks,
  consumptionStats,
  onViewDetail,
  onCreatePurchaseOrder,
  onAddToDefectList
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Calculate days left based on daily consumption
  const calculateDaysLeft = (stock: number, dailyConsumption: number) => {
    if (dailyConsumption <= 0) return '∞';
    const days = Math.floor(stock / dailyConsumption);
    return days.toString();
  };

  // Calculate recommended order quantity based on monthly consumption and min stock
  const calculateRecommendedOrder = (product: Product, monthlyConsumption: number) => {
    const minStock = product.minStock || 10;
    // Order enough for 2 months of consumption plus minimum stock level
    return Math.ceil(monthlyConsumption * 2 + minStock);
  };

  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Toggle all products selection
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  // Create purchase order for selected products
  const createBulkPurchaseOrder = () => {
    const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
    // Typically this would be handled by a more complex function that collects all selected products
    // and redirects to the purchase order creation page with these products pre-filled
    console.log('Creating bulk purchase order for:', selectedProductsData);
    alert('Bulk purchase order creation would go here');
  };

  // Get stock level class based on current stock vs min stock
  const getStockLevelClass = (currentStock: number, minStock: number) => {
    if (currentStock === 0) return 'text-red-600 font-bold';
    if (currentStock < minStock * 0.5) return 'text-red-500';
    if (currentStock < minStock) return 'text-orange-500';
    return 'text-green-500';
  };

  // Join product data with its stock and consumption stats
  const productData = products.map(product => {
    const stock = stocks.find(s => s.productId === product.id);
    const consumption = consumptionStats.find(c => c.productId === product.id);

    return {
      product,
      currentStock: stock?.currentStock || 0,
      minStock: product.minStock || 10,
      dailyAverage: consumption?.dailyAverage || 0,
      weeklyAverage: consumption?.weeklyAverage || 0,
      monthlyAverage: consumption?.monthlyAverage || 0,
    };
  }).filter(item => item.currentStock < item.minStock); // Only show low stock products

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1.5 py-1.5 px-2.5">
            <FaExclamationTriangle className="h-3.5 w-3.5" />
            <span>Produk Stok Menipis: <strong>{productData.length}</strong></span>
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
            onClick={createBulkPurchaseOrder}
            disabled={selectedProducts.length === 0}
          >
            <FaShoppingCart className="mr-1.5 h-3 w-3" /> Buat PO untuk Item Terpilih
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-orange-100 overflow-hidden">
        <Table>
          <TableCaption>Daftar produk dengan stok di bawah minimum</TableCaption>
          <TableHeader className="bg-orange-50">
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox 
                  checked={selectedProducts.length === productData.length && productData.length > 0} 
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Produk</TableHead>
              <TableHead className="text-center">Stok</TableHead>
              <TableHead className="text-center">Minimal</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Konsumsi per Hari</TableHead>
              <TableHead className="text-center">Konsumsi per Minggu</TableHead>
              <TableHead className="text-center">Konsumsi per Bulan</TableHead>
              <TableHead className="text-center">Estimasi Habis</TableHead>
              <TableHead className="text-center">Rekomendasi Order</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FaBoxOpen className="h-8 w-8 text-orange-300" />
                    <p>Semua produk memiliki stok yang cukup</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              productData.map(({ product, currentStock, minStock, dailyAverage, weeklyAverage, monthlyAverage }) => (
                <TableRow key={product.id} className="hover:bg-orange-50/50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)} 
                      onCheckedChange={() => toggleProductSelection(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="text-xs text-gray-500">{product.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-center ${getStockLevelClass(currentStock, minStock)}`}>
                    {currentStock}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">{minStock}</TableCell>
                  <TableCell className="text-center">
                    {currentStock === 0 ? (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        Habis
                      </Badge>
                    ) : currentStock < minStock * 0.5 ? (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        Kritis
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                        Rendah
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">{dailyAverage}</TableCell>
                  <TableCell className="text-center text-gray-600">{weeklyAverage}</TableCell>
                  <TableCell className="text-center text-gray-600">{monthlyAverage}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${
                      calculateDaysLeft(currentStock, dailyAverage) === '∞' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                      parseInt(calculateDaysLeft(currentStock, dailyAverage)) < 7 ? 'bg-red-50 text-red-600 border-red-200' :
                      parseInt(calculateDaysLeft(currentStock, dailyAverage)) < 14 ? 'bg-orange-50 text-orange-600 border-orange-200' :
                      'bg-green-50 text-green-600 border-green-200'
                    }`}>
                      {calculateDaysLeft(currentStock, dailyAverage) === '∞' ? '∞' : `${calculateDaysLeft(currentStock, dailyAverage)} hari`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {calculateRecommendedOrder(product, monthlyAverage)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => onViewDetail(product)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => onCreatePurchaseOrder(product)}
                      >
                        <FaShoppingCart className="h-3.5 w-3.5" />
                      </Button>

                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onAddToDefectList(product)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M12 2v20M2 12h20" />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LowStockTable;
