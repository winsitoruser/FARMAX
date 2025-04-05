import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaPlus, FaInfoCircle, FaSearch } from 'react-icons/fa';
import { Product } from '@/modules/inventory/types';

// Interface for defect items
export interface DefectItem extends Product {
  reason: string;
  requestDate: Date;
  priority: 'low' | 'medium' | 'high';
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Mock data for defect items
export const mockDefectItems: DefectItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'MED001',
    categoryId: '1',
    unit: 'Tablet',
    minStock: 150,
    description: 'Obat pereda nyeri dan demam',
    purchasePrice: 1200,
    sellingPrice: 1500,
    dateAdded: new Date('2024-03-10'),
    reason: 'Stok rendah, penggunaan meningkat di bulan ini',
    requestDate: new Date('2025-03-28'),
    priority: 'high',
    requestedBy: 'Adi Santoso',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    sku: 'MED002',
    categoryId: '1',
    unit: 'Kaplet',
    minStock: 100,
    description: 'Antibiotik untuk infeksi bakteri',
    purchasePrice: 2500,
    sellingPrice: 3000,
    dateAdded: new Date('2024-02-15'),
    reason: 'Cacat pada kemasan, sebagian produk tidak dapat dijual',
    requestDate: new Date('2025-03-27'),
    priority: 'medium',
    requestedBy: 'Budi Hartono',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    sku: 'VIT001',
    categoryId: '4',
    unit: 'Tablet',
    minStock: 80,
    description: 'Suplemen vitamin',
    purchasePrice: 1800,
    sellingPrice: 2200,
    dateAdded: new Date('2024-01-20'),
    reason: 'Stok rendah, permintaan tinggi',
    requestDate: new Date('2025-03-26'),
    priority: 'high',
    requestedBy: 'Citra Dewi',
    status: 'pending'
  }
];

// Function to format date
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Component definition
interface FixedDefectaListProps {
  onAddItemToPO?: (item: DefectItem) => void;
}

export default function FixedDefectaList({ onAddItemToPO }: FixedDefectaListProps) {
  const priorityColors = {
    high: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
    low: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' }
  };

  return (
    <Card className="border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden">
      <CardHeader className="border-b border-orange-100/50 pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">Daftar Defecta</h3>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {mockDefectItems.length} Item
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari item defecta..."
              className="block w-full pl-10 pr-3 py-2 border border-orange-100 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30"
            />
          </div>
        </div>
        
        {/* Table of defect items */}
        <div className="overflow-auto max-h-[300px]">
          <Table>
            <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[180px] text-orange-600">Nama Produk</TableHead>
                <TableHead className="text-orange-600">SKU</TableHead>
                <TableHead className="text-orange-600">Prioritas</TableHead>
                <TableHead className="text-orange-600">Tanggal</TableHead>
                <TableHead className="text-orange-600 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDefectItems.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-orange-50/50 transition-colors duration-200"
                >
                  <TableCell className="font-medium py-2">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{item.name}</span>
                      <span className="text-xs text-gray-500">{item.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">{item.sku}</TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={`${priorityColors[item.priority].bg} ${priorityColors[item.priority].text} ${priorityColors[item.priority].border} text-xs`}>
                      {item.priority === 'high' ? 'Tinggi' : 
                       item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    {formatDate(item.requestDate)}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        if (onAddItemToPO) {
                          onAddItemToPO(item);
                        }
                      }}
                      className="h-8 w-8 p-0 rounded-full hover:bg-orange-100 hover:text-orange-500"
                    >
                      <FaPlus className="h-3 w-3" />
                      <span className="sr-only">Add to PO</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
