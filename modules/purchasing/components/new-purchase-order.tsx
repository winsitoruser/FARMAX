import React, { useState, useEffect } from 'react'
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card'
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select'
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { 
  FaPlus, FaTrash, FaSave, FaRegClock, FaBoxes, 
  FaTruck, FaFileInvoiceDollar, FaChartLine 
} from 'react-icons/fa'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Mock data for suppliers
const mockSuppliers = [
  { id: "sup001", name: "PT Kimia Farma", address: "Jakarta", contact: "021-5555-1234", terms: "Net 30" },
  { id: "sup002", name: "PT Phapros", address: "Semarang", contact: "024-7777-5678", terms: "Net 14" },
  { id: "sup003", name: "PT Kalbe Farma", address: "Jakarta", contact: "021-4444-9012", terms: "COD" },
  { id: "sup004", name: "PT Dexa Medica", address: "Palembang", contact: "0711-333-3456", terms: "Net 45" },
  { id: "sup005", name: "PT Sanbe Farma", address: "Bandung", contact: "022-6666-7890", terms: "Net 30" },
];

// Mock data for products with price history
const mockProducts = [
  { 
    id: "prod001", 
    name: "Paracetamol 500mg", 
    category: "Analgesic", 
    uom: "Tab", 
    stock: 1500,
    reorderLevel: 300,
    priceHistory: [
      { date: "2025-01-10", supplier: "sup001", price: 1200, quantity: 1000 },
      { date: "2025-02-15", supplier: "sup002", price: 1250, quantity: 2000 },
      { date: "2025-03-05", supplier: "sup001", price: 1180, quantity: 1500 }
    ]
  },
  { 
    id: "prod002", 
    name: "Amoxicillin 500mg", 
    category: "Antibiotic", 
    uom: "Cap", 
    stock: 800,
    reorderLevel: 200,
    priceHistory: [
      { date: "2025-01-05", supplier: "sup003", price: 2500, quantity: 500 },
      { date: "2025-02-10", supplier: "sup002", price: 2450, quantity: 1000 },
      { date: "2025-03-15", supplier: "sup003", price: 2550, quantity: 800 }
    ]
  },
  { 
    id: "prod003", 
    name: "Omeprazole 20mg", 
    category: "Antacid", 
    uom: "Cap", 
    stock: 600,
    reorderLevel: 150,
    priceHistory: [
      { date: "2025-01-20", supplier: "sup001", price: 3200, quantity: 400 },
      { date: "2025-02-25", supplier: "sup004", price: 3150, quantity: 600 },
      { date: "2025-03-20", supplier: "sup001", price: 3250, quantity: 500 }
    ]
  },
];

// Form schema
const formSchema = z.object({
  supplier: z.string().min(1, { message: "Supplier harus dipilih" }),
  poNumber: z.string().min(1, { message: "Nomor PO diperlukan" }),
  expectedDelivery: z.date({ required_error: "Tanggal pengiriman diperlukan" }),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, { message: "Produk harus dipilih" }),
      quantity: z.number().min(1, { message: "Jumlah minimal 1" }),
      unitPrice: z.number().min(1, { message: "Harga harus diisi" })
    })
  ).min(1, { message: "Minimal satu produk harus dipilih" })
});

export function NewPurchaseOrder() {
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [poNumber, setPoNumber] = useState(`PO-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  const [showPriceAnalysis, setShowPriceAnalysis] = useState<boolean>(false);
  const [selectedProductForAnalysis, setSelectedProductForAnalysis] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
      poNumber: poNumber,
      notes: "",
      items: []
    }
  });

  // Add new product row
  const addProductRow = () => {
    setOrderItems([...orderItems, { 
      id: `item-${Date.now()}`, 
      productId: "", 
      productName: "", 
      quantity: 0, 
      unitPrice: 0, 
      subtotal: 0 
    }]);
  };

  // Remove product row
  const removeProductRow = (index: number) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems);
  };

  // Handle product selection
  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Get latest price from selected supplier if available
    let price = 0;
    if (selectedSupplier) {
      const latestPrice = product.priceHistory
        .filter(ph => ph.supplier === selectedSupplier)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (latestPrice) {
        price = latestPrice.price;
      } else {
        // Use the latest price if no price from selected supplier
        price = product.priceHistory
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.price || 0;
      }
    }
    
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      productId,
      productName: product.name,
      unitPrice: price,
      subtotal: updatedItems[index].quantity * price
    };
    
    setOrderItems(updatedItems);
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
      subtotal: quantity * updatedItems[index].unitPrice
    };
    
    setOrderItems(updatedItems);
  };

  // Handle price change
  const handlePriceChange = (index: number, price: number) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      unitPrice: price,
      subtotal: updatedItems[index].quantity * price
    };
    
    setOrderItems(updatedItems);
  };

  // Calculate total order value
  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  // Show price analysis for a product
  const showAnalysis = (productId: string) => {
    setSelectedProductForAnalysis(productId);
    setShowPriceAnalysis(true);
  };

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Here, we would normally send this to an API
    console.log("Form values:", values);
    console.log("Order items:", orderItems);
    
    // Show success message
    toast({
      title: "Pemesanan berhasil dibuat",
      description: `Order ${values.poNumber} telah berhasil dibuat dan menunggu persetujuan`,
    });
    
    // Reset form
    setOrderItems([]);
    setSelectedSupplier("");
    setDate(new Date());
    setPoNumber(`PO-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`);
  };

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden">
        {/* Decorative header element */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-amber-400"></div>
        
        {/* Decorative blurred circles */}
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-orange-500/20 blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-500/20 blur-xl"></div>
        
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FaBoxes className="mr-2 h-6 w-6 text-orange-500" />
            Pemesanan Produk Baru
          </CardTitle>
          <CardDescription>
            Buat pesanan pembelian baru ke supplier
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Top Section - Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Supplier Selection */}
                <div className="md:col-span-4">
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedSupplier(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih supplier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSuppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* PO Number */}
                <div className="md:col-span-4">
                  <FormField
                    control={form.control}
                    name="poNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor PO</FormLabel>
                        <FormControl>
                          <Input {...field} value={poNumber} onChange={(e) => {
                            field.onChange(e);
                            setPoNumber(e.target.value);
                          }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Expected Delivery Date */}
                <div className="md:col-span-4">
                  <FormField
                    control={form.control}
                    name="expectedDelivery"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Pengiriman</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {date ? (
                                  format(date, "PPP", { locale: id })
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                                <FaRegClock className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={(date) => {
                                setDate(date);
                                field.onChange(date);
                              }}
                              initialFocus
                              locale={id}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Product Selection Section */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Daftar Produk</h3>
                  <Button
                    type="button"
                    onClick={addProductRow}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <FaPlus className="mr-2 h-4 w-4" /> Tambah Produk
                  </Button>
                </div>
                
                {/* Products Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Kuantitas</TableHead>
                        <TableHead>Harga Satuan</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Analisis</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            Belum ada produk. Klik tombol "Tambah Produk" untuk menambahkan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        orderItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Select
                                value={item.productId}
                                onValueChange={(value) => handleProductSelect(index, value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Pilih produk" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockProducts.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      {product.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity || ""}
                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                value={item.unitPrice || ""}
                                onChange={(e) => handlePriceChange(index, parseInt(e.target.value) || 0)}
                                className="w-28"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.subtotal || 0)}
                            </TableCell>
                            <TableCell>
                              {item.productId && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => showAnalysis(item.productId)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <FaChartLine className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProductRow(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      
                      {/* Total Row */}
                      {orderItems.length > 0 && (
                        <TableRow className="border-t-2 border-gray-300">
                          <TableCell colSpan={3} className="text-right font-bold">
                            Total
                          </TableCell>
                          <TableCell className="font-bold text-lg">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(calculateTotal())}
                          </TableCell>
                          <TableCell colSpan={2}></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Notes Section */}
              <div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan Pemesanan</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tambahkan catatan atau instruksi khusus untuk pesanan ini" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Catatan ini akan tercetak pada dokumen pemesanan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOrderItems([]);
                    form.reset();
                  }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  disabled={orderItems.length === 0}
                >
                  <FaSave className="mr-2 h-4 w-4" /> Simpan Pesanan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Price Analysis Dialog - Would normally be implemented as a modal */}
      {showPriceAnalysis && selectedProductForAnalysis && (
        <Card className="mt-4">
          <CardHeader className="bg-gradient-to-r from-orange-500/10 to-amber-500/10">
            <CardTitle className="text-xl">
              <FaChartLine className="inline-block mr-2 text-orange-500" />
              Analisis Harga Produk
            </CardTitle>
            <CardDescription>
              Riwayat harga dan perbandingan supplier untuk {mockProducts.find(p => p.id === selectedProductForAnalysis)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Riwayat Harga</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Kuantitas</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Rasio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts
                    .find(p => p.id === selectedProductForAnalysis)
                    ?.priceHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((history, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(new Date(history.date), "dd MMM yyyy")}</TableCell>
                        <TableCell>{mockSuppliers.find(s => s.id === history.supplier)?.name}</TableCell>
                        <TableCell>{history.quantity}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(history.price)}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(history.price / history.quantity)}
                          /unit
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
              
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPriceAnalysis(false);
                    setSelectedProductForAnalysis(null);
                  }}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
