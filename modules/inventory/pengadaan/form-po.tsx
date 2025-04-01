import React, { useState } from 'react';
import { 
  FaPlus, FaTrash, FaInfoCircle, FaCalendarAlt, FaSave, FaPaperPlane, FaTimes
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

// Data sampel
const supplierOptions = [
  { value: 'S001', label: 'PT Kimia Farma', terms: 'Net 30', minOrder: 5000000 },
  { value: 'S002', label: 'PT Kalbe Farma', terms: 'Net 45', minOrder: 10000000 },
  { value: 'S003', label: 'PT Dexa Medica', terms: 'Net 30', minOrder: 7500000 },
  { value: 'S004', label: 'PT Tempo Scan Pacific', terms: 'COD', minOrder: 3000000 },
  { value: 'S005', label: 'PT Phapros', terms: 'Net 60', minOrder: 15000000 },
];

const branchOptions = [
  { value: 'BR001', label: 'Apotek Pusat - Jakarta' },
  { value: 'BR002', label: 'Cabang Bandung' },
  { value: 'BR003', label: 'Cabang Surabaya' },
  { value: 'BR004', label: 'Cabang Medan' },
];

// Data produk contoh
const productSamples = [
  { id: 'P001', name: 'Paracetamol 500mg', sku: 'MED001', unit: 'Tablet', packSize: 100, price: 35000 },
  { id: 'P002', name: 'Amoxicillin 500mg', sku: 'MED002', unit: 'Kapsul', packSize: 50, price: 75000 },
  { id: 'P003', name: 'Vitamin C 1000mg', sku: 'SUP001', unit: 'Tablet', packSize: 30, price: 55000 },
  { id: 'P004', name: 'Antasida Tablet', sku: 'MED003', unit: 'Tablet', packSize: 60, price: 45000 },
  { id: 'P005', name: 'Omeprazole 20mg', sku: 'MED004', unit: 'Kapsul', packSize: 30, price: 120000 },
  { id: 'P006', name: 'Ciprofloxacin 500mg', sku: 'MED005', unit: 'Tablet', packSize: 20, price: 95000 },
  { id: 'P007', name: 'Loratadine 10mg', sku: 'MED006', unit: 'Tablet', packSize: 50, price: 65000 },
  { id: 'P008', name: 'Ibuprofen 400mg', sku: 'MED007', unit: 'Tablet', packSize: 30, price: 40000 },
  { id: 'P009', name: 'Simvastatin 20mg', sku: 'MED008', unit: 'Tablet', packSize: 30, price: 85000 },
  { id: 'P010', name: 'Antiseptik Tangan 500ml', sku: 'MED009', unit: 'Botol', packSize: 1, price: 28000 },
];

interface POItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  notes: string;
}

interface FormPOProps {
  onClose: () => void;
  existingPO?: any; // Untuk edit PO yang sudah ada
}

const FormPO: React.FC<FormPOProps> = ({ onClose, existingPO }) => {
  const today = new Date();
  
  // State untuk form
  const [poNumber, setPONumber] = useState(existingPO?.poNumber || `PO-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  const [supplierId, setSupplierId] = useState(existingPO?.supplierId || '');
  const [branchId, setBranchId] = useState(existingPO?.branchId || 'BR001');
  const [orderDate, setOrderDate] = useState<Date>(existingPO?.orderDate ? new Date(existingPO.orderDate) : today);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<Date>(existingPO?.expectedDeliveryDate ? new Date(existingPO.expectedDeliveryDate) : new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000));
  const [notes, setNotes] = useState(existingPO?.notes || '');
  const [items, setItems] = useState<POItem[]>(existingPO?.items || []);
  
  // State untuk dialog produk
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchProduct, setSearchProduct] = useState('');
  
  // State untuk calendar popover
  const [isOrderDateOpen, setIsOrderDateOpen] = useState(false);
  const [isDeliveryDateOpen, setIsDeliveryDateOpen] = useState(false);
  
  // Menghitung total PO
  const totalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
  
  // Selected supplier info
  const selectedSupplier = supplierOptions.find(s => s.value === supplierId);
  
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
          quantity: 1,
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
        const newQuantity = quantity < 1 ? 1 : quantity;
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
  
  // Update unit price & recalculate total
  const updateItemUnitPrice = (itemId: string, price: number) => {
    const newItems = items.map(item => {
      if (item.id === itemId) {
        const newPrice = price < 0 ? 0 : price;
        return {
          ...item,
          unitPrice: newPrice,
          totalPrice: newPrice * item.quantity
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
    if (!supplierId) {
      alert('Silakan pilih supplier terlebih dahulu');
      return;
    }
    
    if (items.length === 0) {
      alert('Silakan tambahkan minimal 1 produk');
      return;
    }
    
    const poData = {
      poNumber,
      supplierId,
      branchId,
      orderDate,
      expectedDeliveryDate,
      totalAmount,
      status: asDraft ? 'draft' : 'sent',
      notes,
      items
    };
    
    console.log('Saving PO:', poData);
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
            <Label htmlFor="poNumber">Nomor PO</Label>
            <Input 
              id="poNumber" 
              value={poNumber} 
              onChange={(e) => setPONumber(e.target.value)} 
              placeholder="Nomor Purchase Order" 
            />
          </div>
          
          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Select value={supplierId} onValueChange={setSupplierId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Supplier" />
              </SelectTrigger>
              <SelectContent>
                {supplierOptions.map((supplier) => (
                  <SelectItem key={supplier.value} value={supplier.value}>
                    {supplier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedSupplier && (
              <div className="mt-2 text-sm text-gray-500 flex items-center space-x-1">
                <FaInfoCircle size={12} />
                <span>Terms: {selectedSupplier.terms} | Min. Order: {formatRupiah(selectedSupplier.minOrder)}</span>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="branch">Cabang Tujuan</Label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Cabang" />
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
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="orderDate">Tanggal Pemesanan</Label>
            <div className="relative">
              <Popover open={isOrderDateOpen} onOpenChange={setIsOrderDateOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    <FaCalendarAlt className="mr-2" />
                    {orderDate ? format(orderDate, 'd MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={orderDate}
                    onSelect={(date) => {
                      if (date) {
                        setOrderDate(date);
                        setIsOrderDateOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <Label htmlFor="expectedDeliveryDate">Tanggal Pengiriman Diharapkan</Label>
            <div className="relative">
              <Popover open={isDeliveryDateOpen} onOpenChange={setIsDeliveryDateOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                  >
                    <FaCalendarAlt className="mr-2" />
                    {expectedDeliveryDate ? format(expectedDeliveryDate, 'd MMMM yyyy', { locale: id }) : 'Pilih tanggal'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={expectedDeliveryDate}
                    onSelect={(date) => {
                      if (date) {
                        setExpectedDeliveryDate(date);
                        setIsDeliveryDateOpen(false);
                      }
                    }}
                    initialFocus
                    disabled={(date) => date < orderDate}
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
              placeholder="Tambahkan catatan untuk supplier" 
              rows={3}
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
                  Pilih satu atau lebih produk untuk ditambahkan ke PO
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
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
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
                      <TableCell>{product.unit} ({product.packSize})</TableCell>
                      <TableCell className="text-right">{formatRupiah(product.price)}</TableCell>
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
                <TableHead className="w-20 text-center">Jumlah</TableHead>
                <TableHead className="w-28">Unit</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Total</TableHead>
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
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value))}
                      className="h-8 w-20 text-center"
                    />
                  </TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      min={0}
                      value={item.unitPrice}
                      onChange={(e) => updateItemUnitPrice(item.id, parseInt(e.target.value))}
                      className="h-8 w-28 text-right"
                    />
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
            <p className="text-gray-500">Belum ada produk dalam PO ini</p>
            <p className="text-sm text-gray-400 mt-1">Klik tombol "Tambah Produk" untuk menambahkan produk</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <div className="w-80 border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatRupiah(totalAmount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Pajak (0%):</span>
              <span className="font-medium">{formatRupiah(0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatRupiah(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          <FaTimes className="mr-2" size={14} />
          Batal
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit(true)}>
            <FaSave className="mr-2" size={14} />
            Simpan sebagai Draft
          </Button>
          <Button variant="default" onClick={() => handleSubmit(false)}>
            <FaPaperPlane className="mr-2" size={14} />
            Kirim ke Supplier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormPO;
