import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import { nanoid } from "nanoid";
import { 
  FaPlus, 
  FaTrash, 
  FaSearch, 
  FaBarcode, 
  FaCalendarAlt, 
  FaWarehouse, 
  FaSave, 
  FaTimes,
  FaExclamationTriangle,
  FaBoxOpen,
  FaFileInvoice,
  FaInfoCircle,
  FaCheck,
  FaSpinner
} from "react-icons/fa";
import { Supplier, Product, mockSuppliers, mockProducts } from "../types";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

// Antarmuka untuk item yang akan diterima
interface ReceptionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  systemPrice: number;
  supplierOfferPrice: number;
  discount: number;
  total: number;
  batchNumber: string;
  expiryDate: string;
  storageLocation: string;
}

// Antarmuka untuk data penerimaan
interface ReceptionData {
  id: string;
  supplier: string;
  date: string;
  invoiceNumber: string;
  referenceNumber: string;
  poNumber: string;
  notes: string;
  items: ReceptionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'draft' | 'received' | 'checked' | 'approved' | 'rejected';
}

const mockPurchaseOrders = [
  {
    id: "po001",
    poNumber: "PO20250315001",
    date: "2025-03-15",
    supplier: "PT Kimia Farma",
    status: "approved",
    totalItems: 3,
    totalValue: 4250000,
    items: [
      {
        productId: "prod001",
        productName: "Paracetamol 500mg",
        quantity: 50,
        unit: "Box",
        price: 35000,
        systemPrice: 34000,
        supplierOfferPrice: 33500,
        discount: 0,
        total: 1750000
      },
      {
        productId: "prod002",
        productName: "Amoxicillin 500mg",
        quantity: 30,
        unit: "Box",
        price: 45000,
        systemPrice: 44000,
        supplierOfferPrice: 44500,
        discount: 5000,
        total: 1200000
      },
      {
        productId: "prod003",
        productName: "Vitamin C 1000mg",
        quantity: 25,
        unit: "Box",
        price: 76000,
        systemPrice: 75000,
        supplierOfferPrice: 76000,
        discount: 0,
        total: 1900000
      }
    ]
  },
  {
    id: "po002",
    poNumber: "PO20250320002",
    date: "2025-03-20",
    supplier: "PT Parit Padang Global",
    status: "approved",
    totalItems: 2,
    totalValue: 6750000,
    items: [
      {
        productId: "prod004",
        productName: "Cetirizine 10mg",
        quantity: 40,
        unit: "Box",
        price: 65000,
        systemPrice: 63000,
        supplierOfferPrice: 64000,
        discount: 0,
        total: 2600000
      },
      {
        productId: "prod005",
        productName: "Ranitidine 150mg",
        quantity: 60,
        unit: "Box",
        price: 55000,
        systemPrice: 53000,
        supplierOfferPrice: 54000,
        discount: 0,
        total: 3300000
      }
    ]
  },
  {
    id: "po003",
    poNumber: "PO20250325003",
    date: "2025-03-25",
    supplier: "PT Tempo Scan Pacific",
    status: "approved",
    totalItems: 2,
    totalValue: 3150000,
    items: [
      {
        productId: "prod006",
        productName: "Ibuprofen 400mg",
        quantity: 35,
        unit: "Box",
        price: 48000,
        systemPrice: 47000,
        supplierOfferPrice: 46500,
        discount: 0,
        total: 1680000
      },
      {
        productId: "prod007",
        productName: "Metformin 500mg",
        quantity: 30,
        unit: "Box",
        price: 49000,
        systemPrice: 48000,
        supplierOfferPrice: 47500,
        discount: 0,
        total: 1470000
      }
    ]
  },
  {
    id: "po004",
    poNumber: "PO20250328004",
    date: "2025-03-28",
    supplier: "PT Enseval Putera Megatrading",
    status: "approved",
    totalItems: 10,
    totalValue: 5500000,
    items: [
      {
        productId: "prod008",
        productName: "Asam Mefenamat 500mg",
        quantity: 50,
        unit: "Box",
        price: 42000,
        systemPrice: 41000,
        supplierOfferPrice: 41500,
        discount: 0,
        total: 2100000
      },
      {
        productId: "prod009",
        productName: "Ketoprofen 100mg",
        quantity: 40,
        unit: "Box",
        price: 52000,
        systemPrice: 51000,
        supplierOfferPrice: 51500,
        discount: 0,
        total: 2080000
      },
      {
        productId: "prod010",
        productName: "Piroksikam 20mg",
        quantity: 30,
        unit: "Box",
        price: 58000,
        systemPrice: 57000,
        supplierOfferPrice: 57500,
        discount: 0,
        total: 1740000
      },
      {
        productId: "prod011",
        productName: "Naproxen 250mg",
        quantity: 25,
        unit: "Box",
        price: 62000,
        systemPrice: 61000,
        supplierOfferPrice: 61500,
        discount: 0,
        total: 1550000
      },
      {
        productId: "prod012",
        productName: "Diklofenak 50mg",
        quantity: 20,
        unit: "Box",
        price: 68000,
        systemPrice: 67000,
        supplierOfferPrice: 67500,
        discount: 0,
        total: 1360000
      },
      {
        productId: "prod013",
        productName: "Ketorolak 10mg",
        quantity: 40,
        unit: "Box",
        price: 50000,
        systemPrice: 49000,
        supplierOfferPrice: 49500,
        discount: 0,
        total: 1980000
      },
      {
        productId: "prod014",
        productName: "Lornoksikam 8mg",
        quantity: 30,
        unit: "Box",
        price: 55000,
        systemPrice: 54000,
        supplierOfferPrice: 54500,
        discount: 0,
        total: 1635000
      },
      {
        productId: "prod015",
        productName: "Meloksikam 15mg",
        quantity: 25,
        unit: "Box",
        price: 60000,
        systemPrice: 59000,
        supplierOfferPrice: 59500,
        discount: 0,
        total: 1487500
      },
      {
        productId: "prod016",
        productName: "Nimesulid 100mg",
        quantity: 20,
        unit: "Box",
        price: 65000,
        systemPrice: 64000,
        supplierOfferPrice: 64500,
        discount: 0,
        total: 1290000
      },
      {
        productId: "prod017",
        productName: "Parekoksib 40mg",
        quantity: 15,
        unit: "Box",
        price: 70000,
        systemPrice: 69000,
        supplierOfferPrice: 69500,
        discount: 0,
        total: 1035000
      }
    ]
  },
  {
    id: "po005",
    poNumber: "PO20250330005",
    date: "2025-03-30",
    supplier: "PT Bina San Prima",
    status: "approved",
    totalItems: 7,
    totalValue: 4100000,
    items: [
      {
        productId: "prod018",
        productName: "Aceclofenak 100mg",
        quantity: 40,
        unit: "Box",
        price: 45000,
        systemPrice: 44000,
        supplierOfferPrice: 44500,
        discount: 0,
        total: 1780000
      },
      {
        productId: "prod019",
        productName: "Etoksikimab 60mg",
        quantity: 30,
        unit: "Box",
        price: 50000,
        systemPrice: 49000,
        supplierOfferPrice: 49500,
        discount: 0,
        total: 1485000
      },
      {
        productId: "prod020",
        productName: "Fenilbutazon 200mg",
        quantity: 25,
        unit: "Box",
        price: 55000,
        systemPrice: 54000,
        supplierOfferPrice: 54500,
        discount: 0,
        total: 1362500
      },
      {
        productId: "prod021",
        productName: "Flurbiprofen 100mg",
        quantity: 20,
        unit: "Box",
        price: 60000,
        systemPrice: 59000,
        supplierOfferPrice: 59500,
        discount: 0,
        total: 1190000
      },
      {
        productId: "prod022",
        productName: "Ibuprofen 400mg",
        quantity: 40,
        unit: "Box",
        price: 48000,
        systemPrice: 47000,
        supplierOfferPrice: 47500,
        discount: 0,
        total: 1920000
      },
      {
        productId: "prod023",
        productName: "Indometasin 25mg",
        quantity: 30,
        unit: "Box",
        price: 52000,
        systemPrice: 51000,
        supplierOfferPrice: 51500,
        discount: 0,
        total: 1560000
      },
      {
        productId: "prod024",
        productName: "Ketoprofen 100mg",
        quantity: 25,
        unit: "Box",
        price: 58000,
        systemPrice: 57000,
        supplierOfferPrice: 57500,
        discount: 0,
        total: 1450000
      }
    ]
  }
];

const ReceptionForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [receptionData, setReceptionData] = useState<ReceptionData>({
    id: nanoid(),
    supplier: "",
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: "",
    referenceNumber: "",
    poNumber: "",
    notes: "",
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    status: 'draft'
  });

  // State untuk item baru yang akan ditambahkan
  const [newItem, setNewItem] = useState<Partial<ReceptionItem>>({
    id: nanoid(),
    productId: "",
    quantity: 1,
    price: 0,
    systemPrice: 0,
    supplierOfferPrice: 0,
    discount: 0,
    batchNumber: "",
    expiryDate: "",
    storageLocation: ""
  });

  // State untuk pencarian produk
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // State untuk pencarian dan dropdown PO
  const [poSearchTerm, setPoSearchTerm] = useState<string>("");
  const [poSearchResults, setPoSearchResults] = useState<typeof mockPurchaseOrders>([]);
  const [isPoDropdownOpen, setIsPoDropdownOpen] = useState<boolean>(false);
  const poInputRef = useRef<HTMLInputElement>(null);

  // State untuk dialog konfirmasi penyimpanan
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  // State untuk loading
  const [isLoading, setIsLoading] = useState(false);

  // Efek untuk menghitung ulang total saat item berubah
  useEffect(() => {
    calculateTotals();
  }, [receptionData.items, receptionData.tax, receptionData.discount]);

  // Fungsi pencarian produk
  const searchProducts = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = mockProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) || 
      (product.sku?.toLowerCase() || "").includes(term.toLowerCase()) ||
      (product.barcode?.toLowerCase() || "").includes(term.toLowerCase())
    );
    
    setSearchResults(results.slice(0, 5)); // Batasi hasil menjadi 5 produk
  };

  // Handler untuk perubahan pada form utama
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReceptionData(prev => ({ ...prev, [name]: value }));
  };

  // Handler untuk pemilihan supplier
  const handleSupplierChange = (value: string) => {
    setReceptionData(prev => ({ ...prev, supplier: value }));
  };

  // Handler untuk perubahan pada item baru
  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Konversi nilai numerik
    if (name === 'quantity' || name === 'price' || name === 'systemPrice' || name === 'supplierOfferPrice' || name === 'discount') {
      const numValue = parseFloat(value) || 0;
      setNewItem(prev => ({ ...prev, [name]: numValue }));
    } else {
      setNewItem(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handler untuk pemilihan produk dari hasil pencarian
  const handleProductSelect = (product: Product) => {
    setNewItem(prev => ({
      ...prev,
      productId: product.id,
      productName: product.name,
      unit: product.unit,
      price: product.purchasePrice || 0,
      systemPrice: product.purchasePrice || 0,
      supplierOfferPrice: product.purchasePrice || 0
    }));
    setSearchResults([]);
    setSearchTerm("");
  };

  // Fungsi untuk menambahkan item baru
  const addNewItem = () => {
    if (!newItem.productId || !newItem.quantity) {
      // Tampilkan pesan error jika data tidak lengkap
      return;
    }

    const selectedProduct = mockProducts.find(p => p.id === newItem.productId);
    if (!selectedProduct) return;

    const total = (newItem.quantity || 0) * (newItem.price || 0) - (newItem.discount || 0);
    
    const item: ReceptionItem = {
      id: newItem.id || nanoid(),
      productId: newItem.productId,
      productName: selectedProduct.name,
      quantity: newItem.quantity || 0,
      unit: selectedProduct.unit,
      price: newItem.price || 0,
      systemPrice: newItem.systemPrice || 0,
      supplierOfferPrice: newItem.supplierOfferPrice || 0,
      discount: newItem.discount || 0,
      total,
      batchNumber: newItem.batchNumber || "",
      expiryDate: newItem.expiryDate || "",
      storageLocation: newItem.storageLocation || ""
    };

    setReceptionData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    // Reset form untuk item baru
    setNewItem({
      id: nanoid(),
      productId: "",
      quantity: 1,
      price: 0,
      systemPrice: 0,
      supplierOfferPrice: 0,
      discount: 0,
      batchNumber: "",
      expiryDate: "",
      storageLocation: ""
    });
  };

  // Fungsi untuk menghapus item
  const removeItem = (itemId: string) => {
    setReceptionData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  // Fungsi untuk menghitung subtotal, pajak, dan total
  const calculateTotals = () => {
    const subtotal = receptionData.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * (receptionData.tax / 100);
    const total = subtotal + tax - receptionData.discount;

    setReceptionData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  };

  // Fungsi untuk menangani penyimpanan data
  const handleSave = async () => {
    if (!receptionData.invoiceNumber || !receptionData.supplier) {
      toast({
        title: "Form tidak lengkap",
        description: "Mohon lengkapi nomor invoice dan supplier",
        variant: "destructive"
      });
      return;
    }
    
    if (receptionData.items.length === 0) {
      toast({
        title: "Tidak ada produk",
        description: "Mohon tambahkan minimal 1 produk ke daftar penerimaan",
        variant: "destructive"
      });
      return;
    }
    
    // Validasi data produk
    const invalidItems = receptionData.items.filter(item => !item.batchNumber || !item.expiryDate);
    if (invalidItems.length > 0) {
      toast({
        title: "Data produk tidak lengkap",
        description: `${invalidItems.length} produk belum memiliki nomor batch atau tanggal kadaluwarsa`,
        variant: "destructive"
      });
      return;
    }
    
    // Buka dialog konfirmasi
    setIsSaveDialogOpen(true);
  };

  // Fungsi untuk menyimpan data setelah konfirmasi
  const confirmSave = async () => {
    setIsSaveDialogOpen(false);
    setIsLoading(true);
    
    try {
      // Simulasi proses penyimpanan ke server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form setelah berhasil
      setReceptionData({
        id: nanoid(),
        supplier: "",
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: "",
        referenceNumber: "",
        poNumber: "",
        notes: "",
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'draft'
      });
      
      // Tampilkan notifikasi sukses
      toast({
        title: "Penerimaan berhasil disimpan",
        description: `${receptionData.items.length} produk berhasil diterima dengan No. Invoice: ${receptionData.invoiceNumber}`,
        variant: "default"
      });
      
      // Redirect ke halaman riwayat penerimaan (tab ketiga)
      router.push("/inventory/receptions?tab=history");
    } catch (error) {
      // Tampilkan error jika gagal
      toast({
        title: "Gagal menyimpan penerimaan",
        description: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk mencari PO berdasarkan nomor
  useEffect(() => {
    if (poSearchTerm) {
      const results = mockPurchaseOrders.filter(po => 
        po.poNumber.toLowerCase().includes(poSearchTerm.toLowerCase()) ||
        po.supplier.toLowerCase().includes(poSearchTerm.toLowerCase())
      );
      setPoSearchResults(results);
      setIsPoDropdownOpen(true);
    } else {
      setPoSearchResults([]);
      setIsPoDropdownOpen(false);
    }
  }, [poSearchTerm]);

  // Fungsi untuk memilih PO
  const selectPurchaseOrder = (po: typeof mockPurchaseOrders[0]) => {
    // Update supplier dan nomor PO
    setReceptionData(prev => ({ 
      ...prev, 
      poNumber: po.poNumber,
      supplier: po.supplier 
    }));
    
    setPoSearchTerm("");
    setIsPoDropdownOpen(false);
    
    // Auto-fill tabel produk dengan item dari PO
    if (po.items && po.items.length > 0) {
      // Mengkonversi item PO ke format ReceptionItem
      const poItems: ReceptionItem[] = po.items.map(item => ({
        id: nanoid(),
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        systemPrice: item.systemPrice,
        supplierOfferPrice: item.supplierOfferPrice,
        discount: item.discount,
        total: item.total,
        batchNumber: "",
        expiryDate: "",
        storageLocation: ""
      }));
      
      // Menghitung subtotal, tax, dan total
      const subtotal = poItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.1; // 10% pajak
      const total = subtotal + tax;
      
      // Update state dengan item baru dan perhitungan total
      setReceptionData(prev => ({
        ...prev,
        items: poItems,
        subtotal: subtotal,
        tax: tax,
        total: total
      }));
      
      // Notifikasi sukses
      console.log("Data PO berhasil dimuat:", po.poNumber);
    }
  };

  // Fungsi untuk menangani klik diluar dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (poInputRef.current && !poInputRef.current.contains(event.target as Node)) {
        setIsPoDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle focus pada input PO
  const handlePoInputFocus = () => {
    if (poSearchTerm) {
      setIsPoDropdownOpen(true);
    }
  };

  // Handle klik pada ikon pencarian PO
  const handlePoSearchIconClick = () => {
    setIsPoDropdownOpen(true);
    poInputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Form Penerimaan */}
      <Card className="shadow-sm border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
          <CardTitle className="text-lg flex items-center">
            <FaWarehouse className="mr-2 h-5 w-5 text-orange-500" />
            Informasi Penerimaan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select 
                value={receptionData.supplier} 
                onValueChange={handleSupplierChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih supplier" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} ({supplier.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Penerimaan</Label>
              <div className="relative">
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={receptionData.date}
                  onChange={handleFormChange}
                  className="w-full"
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Nomor Faktur</Label>
              <Input
                id="invoiceNumber"
                name="invoiceNumber"
                value={receptionData.invoiceNumber}
                onChange={handleFormChange}
                placeholder="Masukkan nomor faktur supplier"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poNumber">Nomor PO</Label>
              <div className="relative" ref={poInputRef}>
                <Input
                  type="text"
                  id="poNumber"
                  placeholder="Ketik atau cari nomor Purchase Order"
                  value={receptionData.poNumber}
                  onChange={(e) => {
                    handleFormChange(e);
                    setPoSearchTerm(e.target.value);
                  }}
                  onFocus={handlePoInputFocus}
                  className="pl-10"
                />
                <FaSearch 
                  className="absolute left-3 top-3 text-orange-400 cursor-pointer hover:text-orange-600" 
                  onClick={handlePoSearchIconClick}
                />
                
                {/* Dropdown untuk hasil pencarian PO */}
                {isPoDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-2 text-xs text-gray-500">
                      {poSearchTerm ? 
                        `${poSearchResults.length} PO ditemukan` : 
                        "PO terakhir"
                      }
                    </div>
                    
                    {poSearchResults.length > 0 ? (
                      <ul className="max-h-64 overflow-auto">
                        {poSearchResults.map((po) => (
                          <li 
                            key={po.id}
                            className="p-2 hover:bg-orange-50 cursor-pointer border-t border-gray-100"
                            onClick={() => selectPurchaseOrder(po)}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-orange-600">{po.poNumber}</span>
                              <span className="text-xs text-gray-500">{po.date}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm">{po.supplier}</span>
                              <span className="text-xs text-gray-500">{formatRupiah(po.totalValue)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : poSearchTerm ? (
                      <div className="p-4 text-center text-gray-500">
                        Tidak ada PO yang cocok dengan pencarian
                      </div>
                    ) : (
                      <ul className="max-h-64 overflow-auto">
                        {mockPurchaseOrders.slice(0, 3).map((po) => (
                          <li 
                            key={po.id}
                            className="p-2 hover:bg-orange-50 cursor-pointer border-t border-gray-100"
                            onClick={() => selectPurchaseOrder(po)}
                          >
                            <div className="flex justify-between">
                              <span className="font-medium text-orange-600">{po.poNumber}</span>
                              <span className="text-xs text-gray-500">{po.date}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm">{po.supplier}</span>
                              <span className="text-xs text-gray-500">{formatRupiah(po.totalValue)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="p-2 border-t border-gray-100">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full justify-center text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        onClick={() => {
                          // Di implementasi nyata, arahkan ke halaman manajemen PO
                          console.log("Lihat Semua PO");
                        }}
                      >
                        Lihat Semua PO
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenceNumber">Nomor Referensi</Label>
              <Input
                id="referenceNumber"
                name="referenceNumber"
                value={receptionData.referenceNumber}
                onChange={handleFormChange}
                placeholder="Masukkan nomor referensi internal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                name="notes"
                value={receptionData.notes}
                onChange={handleFormChange}
                placeholder="Tambahkan catatan penerimaan jika ada"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Pencarian Produk dan Form Tambah Item */}
      <Card className="shadow-sm border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
          <CardTitle className="text-lg flex items-center">
            <FaPlus className="mr-2 h-5 w-5 text-orange-500" />
            Tambah Produk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Cari produk (nama, SKU, atau barcode)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchProducts(e.target.value);
                }}
                className="w-full pr-10"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
              
              {/* Hasil pencarian */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border rounded-md overflow-hidden">
                  <ul className="max-h-60 overflow-auto">
                    {searchResults.map((product) => (
                      <li 
                        key={product.id}
                        className="p-2 hover:bg-orange-50 cursor-pointer border-b last:border-0"
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          SKU: {product.sku} | Harga: {formatRupiah(product.purchasePrice || 0)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="border-orange-200 hover:bg-orange-50 hover:text-orange-600"
              onClick={() => {
                // Simulasi pemindaian barcode
                const randomProductIndex = Math.floor(Math.random() * mockProducts.length);
                const randomProduct = mockProducts[randomProductIndex];
                
                handleProductSelect(randomProduct);
              }}
            >
              <FaBarcode className="mr-2 h-4 w-4" />
              Scan
            </Button>
          </div>
          
          {newItem.productId && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah</Label>
                  <Input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Harga Satuan</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    value={newItem.price}
                    onChange={handleNewItemChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemPrice">Harga Sistem</Label>
                  <Input
                    type="number"
                    id="systemPrice"
                    name="systemPrice"
                    value={newItem.systemPrice}
                    onChange={handleNewItemChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierOfferPrice">Harga Penawaran Supplier</Label>
                  <Input
                    type="number"
                    id="supplierOfferPrice"
                    name="supplierOfferPrice"
                    value={newItem.supplierOfferPrice}
                    onChange={handleNewItemChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Diskon</Label>
                  <Input
                    type="number"
                    id="discount"
                    name="discount"
                    value={newItem.discount}
                    onChange={handleNewItemChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Nomor Batch</Label>
                  <Input
                    id="batchNumber"
                    name="batchNumber"
                    value={newItem.batchNumber}
                    onChange={handleNewItemChange}
                    placeholder="Nomor batch"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Tanggal Kedaluwarsa</Label>
                  <Input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={newItem.expiryDate}
                    onChange={handleNewItemChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storageLocation">Lokasi Penyimpanan</Label>
                  <Input
                    id="storageLocation"
                    name="storageLocation"
                    value={newItem.storageLocation}
                    onChange={handleNewItemChange}
                    placeholder="Lokasi penyimpanan"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="button"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                  onClick={addNewItem}
                >
                  <FaPlus className="mr-2 h-4 w-4" />
                  Tambahkan Produk
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Tabel Item Penerimaan */}
      <Card className="shadow-md border-orange-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -mr-10 -mt-10 z-0"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -ml-10 -mb-10 z-0"></div>
        
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center">
                <FaBoxOpen className="mr-2 h-5 w-5 text-orange-500" />
                Produk yang Diterima
              </CardTitle>
              {receptionData.poNumber && (
                <div className="flex items-center mt-1">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-xs flex items-center">
                    <FaFileInvoice className="mr-1 h-3 w-3" />
                    PO: {receptionData.poNumber}
                  </span>
                </div>
              )}
            </div>
            <div>
              <span className="text-xs text-gray-500">
                Total Item: <span className="font-medium">{receptionData.items.length}</span>
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-6 relative z-10">
          {/* Tabel produk yang ditambahkan */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Daftar Produk</h3>
              {receptionData.items.length > 0 && (
                <div className="flex items-center">
                  <Button
                    variant="outline" 
                    size="sm"
                    className="h-8 border-orange-200 text-orange-600 hover:bg-orange-50 mr-2"
                    onClick={() => {
                      // Hapus semua item
                      setReceptionData(prev => ({
                        ...prev,
                        items: [],
                        subtotal: 0,
                        tax: 0,
                        total: 0
                      }));
                      console.log("Daftar produk dibersihkan");
                    }}
                  >
                    <FaTrash className="mr-1.5 h-3 w-3" />
                    <span className="text-xs">Bersihkan</span>
                  </Button>
                </div>
              )}
            </div>
            
            {receptionData.items.length > 0 ? (
              <div className="border border-orange-100 rounded-md overflow-hidden shadow-sm">
                <div className="max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gradient-to-r from-orange-50 to-amber-50 z-10">
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Harga</TableHead>
                        <TableHead className="text-right">Harga Sistem</TableHead>
                        <TableHead className="text-right">Penawaran</TableHead>
                        <TableHead className="text-right">Diskon</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-center">Batch</TableHead>
                        <TableHead className="text-center">Exp</TableHead>
                        <TableHead className="text-center">Lokasi</TableHead>
                        <TableHead className="text-center">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receptionData.items.map((item, index) => (
                        <TableRow 
                          key={item.id} 
                          className={`group transition-colors duration-150 hover:bg-orange-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                          <TableCell className="font-medium">
                            <div>
                              <p>{item.productName}</p>
                              <p className="text-xs text-gray-500">{item.productId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="w-16 h-8 text-right"
                              value={item.quantity}
                              onChange={(e) => {
                                const quantity = parseInt(e.target.value) || 0;
                                const total = quantity * item.price - item.discount;
                                setReceptionData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? { ...i, quantity, total } : i)
                                }));
                              }}
                              min="1"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              className="w-20 h-8 text-right"
                              value={item.price}
                              onChange={(e) => {
                                const price = parseInt(e.target.value) || 0;
                                const total = item.quantity * price - item.discount;
                                setReceptionData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? { ...i, price, total } : i)
                                }));
                              }}
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <span className={item.price > item.systemPrice ? "text-orange-600 font-medium" : "text-gray-500"}>
                                {formatRupiah(item.systemPrice)}
                              </span>
                              {item.price > item.systemPrice && (
                                <div className="text-xs text-orange-600 mt-0.5 flex items-center justify-end">
                                  <FaExclamationTriangle className="h-2.5 w-2.5 mr-0.5" />
                                  <span className="text-orange-600">+{formatRupiah(item.price - item.systemPrice)}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <span className={item.price !== item.supplierOfferPrice ? "text-blue-600 font-medium" : "text-gray-500"}>
                                {formatRupiah(item.supplierOfferPrice)}
                              </span>
                              {item.price !== item.supplierOfferPrice && (
                                <div className="text-xs text-blue-600 mt-0.5 flex items-center justify-end">
                                  <FaInfoCircle className="h-2.5 w-2.5 mr-0.5" />
                                  <span className="text-blue-600">{item.price > item.supplierOfferPrice ? '+' : ''}{formatRupiah(item.price - item.supplierOfferPrice)}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input 
                              type="number"
                              className="w-16 h-8 text-right"
                              value={item.discount}
                              onChange={(e) => {
                                const discount = parseInt(e.target.value) || 0;
                                const total = item.quantity * item.price - discount;
                                setReceptionData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? { ...i, discount, total } : i)
                                }));
                              }}
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatRupiah(item.total)}</TableCell>
                          <TableCell className="text-center">
                            <Input 
                              className="w-24 h-8 m-auto text-center text-sm"
                              value={item.batchNumber || ""}
                              onChange={(e) => {
                                setReceptionData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? { ...i, batchNumber: e.target.value } : i)
                                }));
                              }}
                              placeholder="No. Batch"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              type="date"
                              className="w-28 h-8 m-auto text-center text-sm"
                              value={item.expiryDate || ""}
                              onChange={(e) => {
                                setReceptionData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? { ...i, expiryDate: e.target.value } : i)
                                }));
                              }}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Input 
                              className="w-20 h-8 m-auto text-center text-sm"
                              value={item.storageLocation || ""}
                              onChange={(e) => {
                                setReceptionData(prev => ({
                                  ...prev,
                                  items: prev.items.map(i => i.id === item.id ? { ...i, storageLocation: e.target.value } : i)
                                }));
                              }}
                              placeholder="Lokasi"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeItem(item.id)}
                            >
                              <FaTrash className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Ringkasan produk */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2 flex items-center">
                      <div className="flex-1">
                        <span className="text-xs text-gray-500">Status Item</span>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-orange-400 mr-1.5"></div>
                            <span className="text-xs">Harga Tinggi: {receptionData.items.filter(i => i.price > i.systemPrice).length}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-400 mr-1.5"></div>
                            <span className="text-xs">Harga Berbeda: {receptionData.items.filter(i => i.price !== i.supplierOfferPrice).length}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5"></div>
                            <span className="text-xs">Normal: {receptionData.items.filter(i => i.price <= i.systemPrice && i.price === i.supplierOfferPrice).length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="space-y-1">
                        <div className="text-sm flex justify-between">
                          <span className="text-gray-600">Jumlah Item:</span>
                          <span className="font-medium">{receptionData.items.length}</span>
                        </div>
                        <div className="text-sm flex justify-between">
                          <span className="text-gray-600">Total Kuantitas:</span>
                          <span className="font-medium">{receptionData.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-r from-orange-50 to-amber-50 border border-dashed border-orange-200 rounded-md">
                <FaBoxOpen className="h-10 w-10 text-orange-300 mb-2" />
                <p className="text-gray-600 mb-3">Belum ada produk yang ditambahkan</p>
                <p className="text-sm text-gray-500">Anda dapat menambahkan produk dengan form di atas atau pilih nomor PO</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Panel Ringkasan dan Tombol Aksi */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="shadow-sm border-orange-200 flex-1">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
            <CardTitle className="text-lg">Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatRupiah(receptionData.subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">PPN (%):</span>
                  <Input
                    type="number"
                    name="tax"
                    value={receptionData.tax}
                    onChange={(e) => setReceptionData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    className="w-16 h-8 p-1 text-center"
                    min="0"
                  />
                </div>
                <span className="font-medium">{formatRupiah(receptionData.subtotal * (receptionData.tax / 100))}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Diskon:</span>
                <Input
                  type="number"
                  name="discount"
                  value={receptionData.discount}
                  onChange={(e) => setReceptionData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  className="w-32 h-8 p-1 text-right"
                  min="0"
                />
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold text-orange-600">{formatRupiah(receptionData.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col space-y-4 justify-between">
          <Button
            type="button"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <FaSave className="mr-2 h-4 w-4" />
                Simpan Penerimaan
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            Batal
          </Button>
        </div>
      </div>
      
      {/* Dialog Konfirmasi Penyimpanan */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md border-orange-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -mr-20 -mt-20 z-0"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -ml-20 -mb-20 z-0"></div>
          
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-semibold text-orange-800 flex items-center">
              <FaExclamationTriangle className="mr-2 h-5 w-5 text-orange-500" />
              Konfirmasi Penerimaan Barang
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Anda akan menyimpan data penerimaan barang dengan detail berikut:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Tanggal Penerimaan:</p>
                <p className="font-medium">{new Date(receptionData.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-gray-500">No. Invoice:</p>
                <p className="font-medium">{receptionData.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">No. PO:</p>
                <p className="font-medium">{receptionData.poNumber || "-"}</p>
              </div>
              <div>
                <p className="text-gray-500">Supplier:</p>
                <p className="font-medium">{receptionData.supplier}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-md border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Total Produk:</p>
                  <p className="text-2xl font-bold text-orange-700">{receptionData.items.length} item</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-medium">Total Nilai:</p>
                  <p className="text-2xl font-bold text-orange-700">{formatRupiah(receptionData.total)}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              Pastikan semua informasi sudah benar sebelum menyimpan. Data yang sudah disimpan akan masuk ke riwayat penerimaan.
            </p>
          </div>
          
          <DialogFooter className="relative z-10">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              <FaTimes className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
              onClick={confirmSave}
            >
              <FaCheck className="mr-2 h-4 w-4" />
              Konfirmasi & Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center mb-4">
              <FaSpinner className="h-12 w-12 text-orange-500 animate-spin" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-1">Menyimpan Data</h3>
            <p className="text-gray-500 text-center mb-4">
              Sedang menyimpan data penerimaan barang, mohon tunggu sebentar...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full animate-pulse w-full"></div>
            </div>
            <p className="text-xs text-gray-400">Jangan tutup halaman ini</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionForm;
