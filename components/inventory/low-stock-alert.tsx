import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FaExclamationTriangle, FaShoppingCart, FaEye } from 'react-icons/fa'
import Link from 'next/link'
import purchasingService, { Product } from '@/services/purchasing.service'

interface LowStockAlertProps {
  threshold?: number;
}

export function LowStockAlert({ threshold = 0 }: LowStockAlertProps) {
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a production app, this would call the API
    // For now, we'll use mock data
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        // This would be replaced with actual API call in production
        // const response = await purchasingService.getProductsForPurchase();
        
        // Mock data for development
        const mockProducts: Product[] = [
          { 
            id: "prod001", 
            name: "Paracetamol 500mg", 
            category: "Analgesic", 
            uom: "Tab", 
            stock: 120,
            reorderLevel: 300,
          },
          { 
            id: "prod002", 
            name: "Amoxicillin 500mg", 
            category: "Antibiotic", 
            uom: "Cap", 
            stock: 50,
            reorderLevel: 200,
          },
          { 
            id: "prod003", 
            name: "Omeprazole 20mg", 
            category: "Antacid", 
            uom: "Cap", 
            stock: 80,
            reorderLevel: 150,
          }
        ];
        
        // Filter products with stock below reorder level
        const lowStock = mockProducts.filter(product => 
          product.stock < product.reorderLevel
        );
        
        setLowStockItems(lowStock);
      } catch (error) {
        console.error("Error fetching low stock items:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLowStockItems();
  }, []);
  
  const createPurchaseOrder = (productId: string) => {
    // This would navigate to the purchase order creation page with this product pre-selected
    window.location.href = `/purchasing?action=new&productId=${productId}`;
  };

  return (
    <Card className="overflow-hidden border-orange-200">
      {/* Decorative header element */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-400"></div>
      
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10">
        <CardTitle className="flex items-center text-lg">
          <FaExclamationTriangle className="mr-2 h-5 w-5 text-amber-500" />
          Peringatan Stok Rendah
        </CardTitle>
        <CardDescription>
          Produk yang perlu segera dipesan kembali
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : lowStockItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">Semua produk memiliki stok yang cukup</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-orange-50/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                        {item.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{item.uom}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="font-medium text-red-600">{item.stock}</span>
                      <span className="mx-1 text-muted-foreground">/</span>
                      <span className="text-sm text-muted-foreground">{item.reorderLevel}</span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600"
                        asChild
                      >
                        <Link href={`/inventory/products?id=${item.id}`}>
                          <FaEye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => createPurchaseOrder(item.id)}
                        className="h-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      >
                        <FaShoppingCart className="mr-1 h-3 w-3" />
                        Pesan
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-amber-500 ${
                        item.stock < item.reorderLevel * 0.3 ? "!from-red-500 !to-red-600" : ""
                      }`}
                      style={{ width: `${Math.min(100, (item.stock / item.reorderLevel) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gradient-to-r from-orange-50 to-amber-50 flex justify-between py-3">
        <Link href="/inventory/products?filter=low-stock" passHref>
          <Button variant="ghost" className="text-orange-700 hover:text-orange-800 hover:bg-orange-100">
            Lihat Semua
          </Button>
        </Link>
        <Link href="/purchasing?action=new" passHref>
          <Button 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <FaShoppingCart className="mr-2 h-4 w-4" />
            Buat Pemesanan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
