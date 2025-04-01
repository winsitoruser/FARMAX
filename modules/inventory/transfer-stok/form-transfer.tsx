import React, { useState } from 'react';
import { 
  FaPlus, FaTrash, FaInfoCircle, FaCalendarAlt, FaSave, 
  FaPaperPlane, FaTimes, FaExchangeAlt, FaArrowRight
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatRupiah } from '@/lib/utils';

// Data sampel cabang
const branchOptions = [
  { value: 'BR001', label: 'Apotek Pusat - Jakarta' },
  { value: 'BR002', label: 'Cabang Bandung' },
  { value: 'BR003', label: 'Cabang Surabaya' },
  { value: 'BR004', label: 'Cabang Medan' },
];

// Data produk contoh dengan stok
const productSamples = [
  { 
    id: 'P001', 
    name: 'Paracetamol 500mg', 
    sku: 'MED001', 
    unit: 'Tablet', 
    packSize: 100, 
    batchNumber: 'BT2025001',
    expiryDate: '2026-03-15',
    currentStock: 1500,
    price: 35000 
  },
  { 
    id: 'P002', 
    name: 'Amoxicillin 500mg', 
    sku: 'MED002', 
    unit: 'Kapsul', 
    packSize: 50, 
    batchNumber: 'BT2025002',
    expiryDate: '2026-05-20',
    currentStock: 850,
    price: 75000 
  },
  { 
    id: 'P003', 
    name: 'Vitamin C 1000mg', 
    sku: 'SUP001', 
    unit: 'Tablet', 
    packSize: 30, 
    batchNumber: 'BT2025003',
    expiryDate: '2027-01-10',
    currentStock: 1200,
    price: 55000 
  },
  { 
    id: 'P004', 
    name: 'Antasida Tablet', 
    sku: 'MED003', 
    unit: 'Tablet', 
    packSize: 60, 
    batchNumber: 'BT2025004',
    expiryDate: '2026-08-05',
    currentStock: 950,
    price: 45000 
  },
  { 
    id: 'P005', 
    name: 'Omeprazole 20mg', 
    sku: 'MED004', 
    unit: 'Kapsul', 
    packSize: 30, 
    batchNumber: 'BT2025005',
    expiryDate: '2026-06-15',
    currentStock: 720,
    price: 120000 
  },
  { 
    id: 'P006', 
    name: 'Ciprofloxacin 500mg', 
    sku: 'MED005', 
    unit: 'Tablet', 
    packSize: 20, 
    batchNumber: 'BT2025006',
    expiryDate: '2026-04-22',
    currentStock: 420,
    price: 95000 
  },
  { 
    id: 'P007', 
    name: 'Loratadine 10mg', 
    sku: 'MED006', 
    unit: 'Tablet', 
    packSize: 50, 
    batchNumber: 'BT2025007',
    expiryDate: '2026-09-18',
    currentStock: 670,
    price: 65000 
  },
  { 
    id: 'P008', 
    name: 'Ibuprofen 400mg', 
    sku: 'MED007', 
    unit: 'Tablet', 
    packSize: 30, 
    batchNumber: 'BT2025008',
    expiryDate: '2026-07-30',
    currentStock: 320,
    price: 40000 
  },
  { 
    id: 'P009', 
    name: 'Simvastatin 20mg', 
    sku: 'MED008', 
    unit: 'Tablet', 
    packSize: 30, 
    batchNumber: 'BT2025009',
    expiryDate: '2026-05-25',
    currentStock: 450,
    price: 85000 
  },
  { 
    id: 'P010', 
    name: 'Antiseptik Tangan 500ml', 
    sku: 'MED009', 
    unit: 'Botol', 
    packSize: 1, 
    batchNumber: 'BT2025010',
    expiryDate: '2027-03-10',
    currentStock: 180,
    price: 28000 
  },
];

interface TransferItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  maxQuantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes: string;
}

interface FormTransferProps {
  onClose: () => void;
  existingTransfer?: any; // Untuk edit transfer yang sudah ada
}

const FormTransfer: React.FC<FormTransferProps> = ({ onClose, existingTransfer }) => {
  const today = new Date();
  
  // State untuk form
  const [transferNumber, setTransferNumber] = useState(existingTransfer?.transferNumber || `TR-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  const [fromBranchId, setFromBranchId] = useState(existingTransfer?.fromBranchId || 'BR001');
  const [toBranchId, setToBranchId] = useState(existingTransfer?.toBranchId || '');
  const [requestDate, setRequestDate] = useState<Date>(existingTransfer?.requestDate ? new Date(existingTransfer.requestDate) : today);
  const [notes, setNotes] = useState(existingTransfer?.notes || '');
  const [items, setItems] = useState<TransferItem[]>(existingTransfer?.items || []);
  
  // State untuk dialog produk
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  
  // State untuk calendar popover
  const [isDateOpen, setIsDateOpen] = useState(false);
  
  // Menghitung total nilai
  const totalValue = items.reduce((total, item) => total + item.totalPrice, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Menambahkan produk ke items
  const addSelectedProductsToItems = () => {
    const newItems = [...items];
    
    selectedProducts.forEach(productId => {
      // Cek apakah produk sudah ada di items
      const existingItem = newItems.findIndex(item => item.productId === productId);
      const product = productSamples.find(p => p.id === productId);
      
      if (product && existingItem === -1) {
        newItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          batchNumber: product.batchNumber,
          expiryDate: product.expiryDate,
          quantity: 1,
          maxQuantity: product.currentStock,
          unit: product.unit,
          unitPrice: product.price,
          totalPrice: product.price * 1,
          notes: ''
        });
      }
    });
    
    setItems(newItems);
    setSelectedProducts([]);
    setIsProductDialogOpen(false);
  };
  
  // Update quantity & recalculate total
  const updateItemQuantity = (itemId: string, quantity: number) => {
    const newItems = items.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, Math.min(quantity, item.maxQuantity));
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: item.unitPrice * newQuantity
        };
      }
      return item;
    });
    setItems(newItems);
  };
  
  // Update item notes
  const updateItemNotes = (itemId: string, notes: string) => {
    const newItems = items.map(item => {
      if (item.id === itemId) {
        return { ...item, notes };
      }
      return item;
    });
    setItems(newItems);
  };
  
  // Remove item
  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  
  // Handle form submission
  const handleSubmit = (asDraft: boolean = true) => {
    // Validasi form
    if (!fromBranchId) {
      alert('Silakan pilih cabang asal terlebih dahulu');
      return;
    }
    
    if (!toBranchId) {
      alert('Silakan pilih cabang tujuan terlebih dahulu');
      return;
    }
    
    if (fromBranchId === toBranchId) {
      alert('Cabang asal dan tujuan tidak boleh sama');
      return;
    }
    
    if (items.length === 0) {
      alert('Silakan tambahkan minimal 1 produk');
      return;
    }
    
    const transferData = {
      transferNumber,
      fromBranchId,
      toBranchId,
      requestDate,
      status: 'requested',
      notes,
      items,
      totalValue,
      totalItems
    };
    
    console.log('Saving Transfer:', transferData);
    // Di sini nanti akan mengirim data ke backend
    
    // Close form
    onClose();
  };
  
  // Filter produk berdasarkan pencarian
  const filteredProducts = productSamples.filter(product => 
    product.name.toLowerCase().includes(searchProduct.toLowerCase()) || 
    product.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="transferNumber">Nomor Transfer</Label>
            <Input 
              id="transferNumber" 
              value={transferNumber} 
              onChange={(e) => setTransferNumber(e.target.value)} 
              placeholder="Nomor Transfer Stok" 
            />
          </div>
          
          <div>
            <Label htmlFor="fromBranch">Cabang Asal</Label>
            <Select value={fromBranchId} onValueChange={setFromBranchId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Cabang Asal" />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.map((branch) => (
                  <SelectItem key={branch.value} value={branch.value}>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="toBranch" className="flex items-center gap-2">
              <FaArrowRight className="text-blue-500" size={14} />
              <span>Cabang Tujuan</span>
            </Label>
            <Select value={toBranchId} onValueChange={setToBranchId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Cabang Tujuan" />
              </SelectTrigger>
              <SelectContent>
                {branchOptions.filter(branch => branch.value !== fromBranchId).map((branch) => (
                  <SelectItem key={branch.value} value={branch.value}>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fromBranchId === toBranchId && toBranchId !== '' && (
              <p className="text-sm text-red-500 mt-1">Cabang asal dan tujuan tidak boleh sama</p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="requestDate">Tanggal Permintaan</Label>
            <div className="relative">
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    <FaCalendarAlt className="mr-2" />
                    {requestDate ? format(requestDate, 'd MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={requestDate}
                    onSelect={(date) => {
                      if (date) {
                        setRequestDate(date);
                        setIsDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea 
              id="notes" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Alasan transfer, instruksi khusus, dsb." 
              rows={5}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Item Produk</h3>
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FaPlus size={12} />
                <span>Tambah Produk</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Pilih Produk</DialogTitle>
                <DialogDescription>
                  Pilih satu atau lebih produk untuk ditransfer dari {branchOptions.find(b => b.value === fromBranchId)?.label || 'cabang asal'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4">
                <Input
                  placeholder="Cari produk berdasarkan nama atau SKU"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pilih</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Kadaluarsa</TableHead>
                    <TableHead className="text-right">Stok Tersedia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id]);
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                            }
                          }}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.batchNumber}</TableCell>
                      <TableCell>{new Date(product.expiryDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">{product.currentStock} {product.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={addSelectedProductsToItems} disabled={selectedProducts.length === 0}>
                  Tambahkan ({selectedProducts.length}) Produk
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {items.length > 0 ? (
          <Table className="border rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Batch & Kadaluarsa</TableHead>
                <TableHead className="w-20 text-center">Jumlah</TableHead>
                <TableHead className="w-28">Unit</TableHead>
                <TableHead className="text-right">Nilai Satuan</TableHead>
                <TableHead className="text-right">Nilai Total</TableHead>
                <TableHead className="text-center w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>
                    <div>
                      <div>{item.productName}</div>
                      {item.notes && (
                        <div className="text-xs text-gray-500 mt-1">
                          Catatan: {item.notes}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{item.batchNumber}</span>
                      <span className="text-xs text-gray-500">Exp: {new Date(item.expiryDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      max={item.maxQuantity}
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                      className="h-8 w-20 text-center"
                    />
                    {item.quantity >= item.maxQuantity && (
                      <div className="text-xs text-amber-500 mt-1">
                        Max: {item.maxQuantity}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right">
                    {formatRupiah(item.unitPrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatRupiah(item.totalPrice)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-900"
                        onClick={() => {
                          const note = prompt("Tambahkan catatan untuk produk ini:", item.notes);
                          if (note !== null) {
                            updateItemNotes(item.id, note);
                          }
                        }}
                      >
                        <FaInfoCircle size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="border rounded-md p-8 text-center bg-gray-50">
            <p className="text-gray-500">Belum ada produk dalam permintaan transfer ini</p>
            <p className="text-sm text-gray-400 mt-1">Klik tombol "Tambah Produk" untuk menambahkan produk</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <div className="w-80 border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Item:</span>
              <span className="font-medium">{totalItems} produk</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Nilai:</span>
              <span>{formatRupiah(totalValue)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          <FaTimes className="mr-2" size={14} />
          Batal
        </Button>
        
        <Button variant="default" onClick={() => handleSubmit(false)}>
          <FaPaperPlane className="mr-2" size={14} />
          Kirim Permintaan
        </Button>
      </div>
    </div>
  );
};

export default FormTransfer;
