import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';

interface TopProduct {
  id: string;
  name: string;
  qty: number;
  total: number;
}

interface TopProductsProps {
  products: TopProduct[];
  title: string;
}

const TopProducts: React.FC<TopProductsProps> = ({ products, title }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* Top colored strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-400"></div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-orange-50">
              <TableHead className="text-orange-700">Produk</TableHead>
              <TableHead className="text-orange-700 text-right">Qty</TableHead>
              <TableHead className="text-orange-700 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id} className="border-b border-orange-100/30">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-orange-50 text-orange-700 border-orange-200">
                      #{index + 1}
                    </Badge>
                    {product.name}
                  </div>
                </TableCell>
                <TableCell className="text-right">{product.qty}</TableCell>
                <TableCell className="text-right font-medium">{formatRupiah(product.total)}</TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  Tidak ada data penjualan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
