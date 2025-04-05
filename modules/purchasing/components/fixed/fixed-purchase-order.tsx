import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FaTruck, FaPlus, FaTrash } from 'react-icons/fa';

// Types
interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  purchasePrice: number;
  subtotal: number;
  unit: string;
}

// Mock data for demo purposes
const initialItems: OrderItem[] = [
  {
    id: '1',
    productName: 'Paracetamol 500mg',
    sku: 'MED001',
    quantity: 10,
    purchasePrice: 1200,
    subtotal: 12000,
    unit: 'Box'
  },
  {
    id: '2',
    productName: 'Amoxicillin 500mg',
    sku: 'MED002',
    quantity: 5,
    purchasePrice: 2500,
    subtotal: 12500,
    unit: 'Box'
  }
];

// Formatter for currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export default function FixedPurchaseOrder() {
  const { toast } = useToast();
  const [items, setItems] = useState<OrderItem[]>(initialItems);

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Handle remove item
  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item dihapus",
      description: "Item telah dihapus dari Purchase Order",
    });
  };

  // Handle submit
  const handleSubmit = () => {
    toast({
      title: "Purchase Order Dibuat",
      description: "Purchase Order berhasil dibuat dan telah dikirim ke supplier.",
    });
  };

  return (
    <Card className="border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden">
      <CardHeader className="border-b border-orange-100/50 pb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm mr-3">
            <FaTruck className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
            Purchase Order
          </h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">PO-240403001</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">Supplier</h4>
            <span className="text-sm font-medium text-orange-600">PT. Kimia Farma</span>
          </div>
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-700">Tanggal Pengiriman</h4>
            <span className="text-sm font-medium text-orange-600">10 Apr 2025</span>
          </div>
        </div>

        <div className="overflow-auto max-h-[300px] mb-4">
          <Table>
            <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[180px] text-orange-600">Produk</TableHead>
                <TableHead className="text-orange-600 text-center">QTY</TableHead>
                <TableHead className="text-orange-600 text-right">Harga</TableHead>
                <TableHead className="text-orange-600 text-right">Subtotal</TableHead>
                <TableHead className="text-orange-600 w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{item.productName}</span>
                      <span className="text-xs text-gray-500">{item.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.purchasePrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.subtotal)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                    >
                      <FaTrash className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 border-t border-orange-100 pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">Total</h4>
            <span className="text-lg font-bold text-orange-700">{formatCurrency(total)}</span>
          </div>
          
          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 flex-1"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Tambah Item
            </Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 flex-1"
              onClick={handleSubmit}
            >
              Buat Purchase Order
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
