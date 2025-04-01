import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FaExclamationTriangle, FaPlus, FaInfoCircle, FaSearch
} from 'react-icons/fa';
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
  },
  {
    id: '4',
    name: 'Loratadine 10mg',
    sku: 'MED003',
    categoryId: '1',
    unit: 'Tablet',
    minStock: 70,
    description: 'Antihistamin untuk alergi',
    purchasePrice: 1500,
    sellingPrice: 1900,
    dateAdded: new Date('2024-03-05'),
    reason: 'Produk rusak dalam penyimpanan',
    requestDate: new Date('2025-03-30'),
    priority: 'medium',
    requestedBy: 'Dian Permata',
    status: 'pending'
  },
  {
    id: '5',
    name: 'Metformin 500mg',
    sku: 'MED004',
    categoryId: '1',
    unit: 'Tablet',
    minStock: 120,
    description: 'Obat diabetes',
    purchasePrice: 2000,
    sellingPrice: 2400,
    dateAdded: new Date('2024-02-10'),
    reason: 'Stok rendah, kebutuhan rutin pasien',
    requestDate: new Date('2025-03-25'),
    priority: 'high',
    requestedBy: 'Eko Prasetyo',
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
interface DefectaListProps {
  onDragStart?: (e: React.DragEvent<HTMLTableRowElement>, item: DefectItem) => void;
  onAddItemToPO?: (item: DefectItem) => void;
}

export default function DefectaList({ onDragStart, onAddItemToPO }: DefectaListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Filtered items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm) return mockDefectItems;
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return mockDefectItems.filter(item => 
      item.name.toLowerCase().includes(lowerCaseSearchTerm) || 
      (item.sku?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
      item.reason.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);
  
  const priorityColors = {
    high: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    medium: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
    low: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' }
  };

  return (
    <Card className="shadow-md border-orange-100 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-orange-500" />
            <CardTitle className="text-lg font-semibold text-orange-800">Daftar Defecta</CardTitle>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {mockDefectItems.length} Item
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Search bar */}
        <div className="p-3 border-b border-red-100/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari item defecta..."
              className="block w-full pl-10 pr-3 py-2 border border-red-100 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Table of defect items */}
        <div className="overflow-auto max-h-[360px] custom-scrollbar">
          <Table>
            <TableHeader className="bg-gradient-to-r from-red-50 to-orange-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[180px] text-red-600">Nama Produk</TableHead>
                <TableHead className="text-red-600">SKU</TableHead>
                <TableHead className="text-red-600">Prioritas</TableHead>
                <TableHead className="text-red-600">Tanggal</TableHead>
                <TableHead className="text-red-600">Status</TableHead>
                <TableHead className="text-red-600 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow 
                    key={item.id} 
                    draggable={true}
                    onDragStart={(e) => {
                      console.log('Drag started in DefectaList for item:', item.name);
                      
                      // Set the drag effect to copy
                      e.dataTransfer.effectAllowed = 'copy';
                      
                      // Create a very simple data structure
                      const dragData = {
                        id: item.id,
                        name: item.name,
                        sku: item.sku,
                        price: item.purchasePrice,
                        unit: item.unit || 'pcs'
                      };
                      
                      // Log the data we're setting
                      console.log('Setting drag data:', JSON.stringify(dragData));
                      
                      // Set both formats
                      e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
                      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                      
                      // Provide visual feedback
                      e.currentTarget.style.opacity = '0.5';
                      e.currentTarget.style.backgroundColor = '#FFF7ED'; // orange-50
                      
                      // Call parent handler if provided
                      if (onDragStart) {
                        onDragStart(e, item);
                      }
                    }}
                    onDragEnd={(e) => {
                      // Reset visual feedback
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.backgroundColor = '';
                      console.log('Drag ended in DefectaList');
                    }}
                    className="cursor-grab hover:bg-orange-50/50 transition-colors group border-b border-red-100/30"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {item.sku}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${priorityColors[item.priority].bg} ${priorityColors[item.priority].text} ${priorityColors[item.priority].border}`}
                      >
                        {item.priority === 'high' 
                          ? 'Tinggi' 
                          : item.priority === 'medium' 
                            ? 'Sedang' 
                            : 'Rendah'
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(item.requestDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        {item.status === 'pending' 
                          ? 'Menunggu' 
                          : item.status === 'approved' 
                            ? 'Disetujui' 
                            : 'Ditolak'
                        }
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-orange-500 hover:text-orange-700 hover:bg-orange-100 transition-all hover:scale-110"
                          onClick={() => onAddItemToPO?.(item)}
                          title="Tambahkan ke PO"
                        >
                          <FaPlus size={14} />
                          <span className="sr-only">Tambahkan ke PO</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <FaExclamationTriangle className="h-4 w-4 text-red-500" />
                      </div>
                      <p>Tidak ada item defecta yang ditemukan</p>
                      <p className="text-sm text-gray-400 mt-1">Coba dengan kata kunci lain</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Dragging instruction */}
        <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border-t border-red-100/50 flex items-center justify-center text-sm">
          <div className="rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>
          <span className="text-gray-600">Tarik item ke formulir pesanan untuk menambahkannya</span>
        </div>
      </CardContent>
    </Card>
  );
};
