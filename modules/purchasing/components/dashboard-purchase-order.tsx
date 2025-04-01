import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card';
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  FaShoppingCart, FaBox, FaBoxes, FaWarehouse, FaTruck, 
  FaFileInvoiceDollar, FaChartLine, FaArrowRight,
  FaTimes, FaCheck, FaExclamationTriangle, FaSpinner, 
  FaCheckCircle, FaPlus, FaTrash, FaBoxOpen, FaSave, FaRegClock
} from 'react-icons/fa';
import { MdAdd } from "react-icons/md";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { DefectItem } from './defecta-list';
import { useRouter } from 'next/router';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Data mock untuk produk
const mockProducts: { id: string; name: string; sku: string; price: number; unit: string }[] = [
  { id: "1", name: "Paracetamol", sku: "PC-001", price: 10000, unit: "Kotak" },
  { id: "2", name: "Amoxicillin", sku: "AM-002", price: 15000, unit: "Botol" },
  { id: "3", name: "Vitamin C", sku: "VC-003", price: 20000, unit: "Strip" },
  { id: "4", name: "Minyak Kayu Putih", sku: "MK-004", price: 25000, unit: "Botol" },
  { id: "5", name: "Antasida", sku: "AT-005", price: 18000, unit: "Botol" },
];

// Data mock untuk supplier
const mockSuppliers: { id: string; name: string; email: string; phone: string; address: string }[] = [
  { id: "sup001", name: "PT. Kimia Farma", email: "info@kimiaf.co.id", phone: "021-1234567", address: "Jl. Jendral Sudirman No. 1" },
  { id: "sup002", name: "PT. Phapros", email: "contact@phapros.co.id", phone: "021-7654321", address: "Jl. Gatot Subroto No. 2" },
  { id: "sup003", name: "PT. Kalbe Farma", email: "support@kalbe.co.id", phone: "021-9876543", address: "Jl. MT Haryono No. 3" },
  { id: "sup004", name: "PT. Dexa Medica", email: "help@dexa.co.id", phone: "021-3456789", address: "Jl. Casablanca No. 4" },
  { id: "sup005", name: "PT. Sanbe Farma", email: "care@sanbe.co.id", phone: "021-5678901", address: "Jl. Thamrin No. 5" },
];

// Mapping produk dan supplier
const supplierProductMapping: Record<string, string[]> = {
  "sup001": ["1", "2", "3"], // Kimia Farma menjual produk 1, 2, 3
  "sup002": ["3", "4"], // Phapros menjual produk 3, 4
  "sup003": ["1", "5"], // Kalbe Farma menjual produk 1, 5
  "sup004": ["2", "4", "5"], // Dexa Medica menjual produk 2, 4, 5
  "sup005": ["1", "2", "3", "4"], // Sanbe Farma menjual produk 1, 2, 3, 4
};

// Helper function untuk mendapatkan nama supplier berdasarkan ID
const getSupplierNameById = (supplierId: string): string => {
  const supplier = mockSuppliers.find(s => s.id === supplierId);
  return supplier ? supplier.name : "Unknown Supplier";
};

// Helper function untuk cek ketersediaan produk dari supplier
const isProductAvailableFromSupplier = (productId: string, supplierId: string): boolean => {
  // Jika supplierId kosong, return false
  if (!supplierId) return false;
  
  // Cek availability berdasarkan mapping
  const productsAvailable = supplierProductMapping[supplierId] || [];
  return productsAvailable.includes(productId);
};

// Helper function untuk mendapatkan daftar supplier yang menyediakan produk
const getSuppliersForProduct = (productId: string): string[] => {
  return Object.entries(supplierProductMapping)
    .filter(([supplierId, productIds]) => productIds.includes(productId))
    .map(([supplierId]) => supplierId);
};

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

// Types and Interfaces
export interface DefectItemExtended {
  id: string;
  productId: string;
  name: string;
  productName?: string;
  sku?: string;
  unit?: string;
  estimatedPrice?: number;
  purchasePrice?: number;
  supplier?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  purchasePrice: number;
  subtotal: number;
  unit: string;
  source?: string;
}

export interface DashboardPurchaseOrderProps {
  onOrderCreated?: () => void;
}

// Modal styles custom untuk memastikan tampilan berfungsi
const ModalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    zIndex: 1001,
    overflowY: 'auto',
    maxHeight: '85vh'
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    backgroundColor: '#f97316',
    color: 'white',
    borderRadius: '9999px',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }
};

// Modal Component
const CustomModal = ({ isOpen, onClose, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode 
}) => {
  if (!isOpen) return null;
  
  return (
    <div style={ModalStyles.overlay as React.CSSProperties} onClick={onClose}>
      <div style={ModalStyles.modal as React.CSSProperties} onClick={(e) => e.stopPropagation()}>
        <button style={ModalStyles.closeButton as React.CSSProperties} onClick={onClose}>
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

export function DashboardPurchaseOrder({ onOrderCreated }: DashboardPurchaseOrderProps) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [poNumber, setPoNumber] = useState(generatePONumber());
  const [isOver, setIsOver] = useState(false);
  const [unavailableProducts, setUnavailableProducts] = useState<OrderItem[]>([]);
  const [showUnavailableWarning, setShowUnavailableWarning] = useState(false);
  const [showSupplierInfoForProduct, setShowSupplierInfoForProduct] = useState<{productId: string, productName: string} | null>(null);
  const [lastDraggedItem, setLastDraggedItem] = useState<DefectItemExtended | null>(null);
  const [activePoIndex, setActivePoIndex] = useState<number>(0);
  
  // State untuk menyimpan multiple PO
  const [purchaseOrders, setPurchaseOrders] = useState<{
    id: string;
    supplierId: string;
    items: OrderItem[];
    poNumber: string;
    expectedDelivery: Date;
    notes: string;
    isActive: boolean;
  }[]>([
    {
      id: `po-${Date.now()}`,
      supplierId: "",
      items: [],
      poNumber: generatePONumber(),
      expectedDelivery: new Date(),
      notes: "",
      isActive: true
    }
  ]);
  
  // State untuk dialog
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [createdPONumber, setCreatedPONumber] = useState('');
  const [additionalPOs, setAdditionalPOs] = useState<{
    id: string;
    supplierId: string;
    items: OrderItem[];
    poNumber: string;
    isOpen: boolean;
  }[]>([]);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setValidationErrors([
      "2 produk tidak tersedia dari supplier PT. Kimia Farma",
      "- Paracetamol (PC-001)",
      "- Amoxicillin (AM-002)"
    ]);
    setCreatedPONumber(poNumber);
  }, [poNumber]);

  // Effect to ensure activePoIndex is valid
  useEffect(() => {
    // Pastikan selalu ada minimal 1 PO dan activePoIndex valid
    if (purchaseOrders.length === 0) {
      setPurchaseOrders([{
        id: `po-${Date.now()}`,
        supplierId: "",
        items: [],
        poNumber: generatePONumber(),
        expectedDelivery: new Date(),
        notes: "",
        isActive: true
      }]);
      setActivePoIndex(0);
    } else if (activePoIndex >= purchaseOrders.length) {
      // Jika activePoIndex tidak valid, set ke PO terakhir
      setActivePoIndex(purchaseOrders.length - 1);
    }
  }, [purchaseOrders, activePoIndex]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: "",
      poNumber: poNumber,
      expectedDelivery: new Date(),
      notes: ""
    }
  });

  useEffect(() => {
    const activePO = purchaseOrders[activePoIndex];
    if (activePO) {
      form.reset({
        supplier: activePO.supplierId,
        poNumber: activePO.poNumber,
        expectedDelivery: activePO.expectedDelivery,
        notes: activePO.notes
      });
      setSelectedSupplier(activePO.supplierId);
      setOrderItems(activePO.items);
    }
  }, [activePoIndex, form, purchaseOrders]);

  const updateActivePO = (field: string, value: any) => {
    setPurchaseOrders(currentPOs => {
      const updatedPOs = [...currentPOs];
      updatedPOs[activePoIndex] = {
        ...updatedPOs[activePoIndex],
        [field]: value
      };
      return updatedPOs;
    });
  };

  function generatePONumber() {
    return `PO-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }

  // Drop handling
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevent default to allow drop
    e.preventDefault();
    e.stopPropagation();
    
    // Set visual feedback that drop is allowed
    setIsOver(true);
    
    // Explicitly signal that drop is allowed
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset visual state
    setIsOver(false);
    
    console.log("DROP EVENT RECEIVED in PO");
    console.log("Drop event target:", e.currentTarget.className);
    console.log("Available data types:", e.dataTransfer.types);
    
    // Notify user if supplier not selected
    if (!selectedSupplier) {
      toast({
        title: "Pilih supplier terlebih dahulu",
        description: "Anda harus memilih supplier sebelum menambahkan item",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Try all formats to maximize compatibility
      let dataString = "";
      
      if (e.dataTransfer.types.includes('application/json')) {
        dataString = e.dataTransfer.getData('application/json');
        console.log("Got JSON data:", dataString);
      } else if (e.dataTransfer.types.includes('text/plain')) {
        dataString = e.dataTransfer.getData('text/plain');
        console.log("Got text data:", dataString);
      } else {
        console.log("No supported data types found. Available types:", e.dataTransfer.types);
        return;
      }
      
      if (!dataString) {
        console.error("Empty data string");
        return;
      }
      
      // Log the raw string to debug issues
      console.log("Raw data string:", dataString);
      
      // Parse the data
      try {
        const defectItem = JSON.parse(dataString);
        console.log("Parsed item:", defectItem);
        
        // Add to PO with manually constructed object to ensure format is correct
        const poItem = {
          id: defectItem.id || `item-${Date.now()}`,
          name: defectItem.name || defectItem.productName || "Unknown Product",
          sku: defectItem.sku || "",
          price: defectItem.price || defectItem.purchasePrice || 0,
          quantity: 1,
          unit: defectItem.unit || "pcs",
          source: "defecta"
        };
        
        console.log("Adding to PO:", poItem);
        
        // Now add it to the purchase order
        const newItems = [...purchaseOrders[activePoIndex].items, poItem];
        
        const updatedPOs = [...purchaseOrders];
        updatedPOs[activePoIndex] = {
          ...updatedPOs[activePoIndex],
          items: newItems
        };
        
        setPurchaseOrders(updatedPOs);
        
        // Show success notification
        toast({
          title: "Item ditambahkan",
          description: `${poItem.name} telah ditambahkan ke PO`,
          variant: "default"
        });
        
      } catch (parseError) {
        console.error("Failed to parse data:", parseError);
        toast({
          title: "Error",
          description: "Format data tidak valid",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Drop handling error:", error);
    }
  };

  const addItemToPO = (item: any) => {
    console.log("addItemToPO called with:", item);
    
    // Validate basic requirements
    if (!purchaseOrders[activePoIndex]) {
      console.error("No active PO to add item to");
      return;
    }
    
    if (!selectedSupplier) {
      toast({
        title: "Pilih supplier terlebih dahulu",
        description: "Anda harus memilih supplier sebelum menambahkan item",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Normalize the item structure
      const poItem = {
        id: item.id || `item-${Date.now()}`,
        name: item.name || item.productName || "Unknown Product",
        sku: item.sku || "",
        price: item.price || item.purchasePrice || 0,
        quantity: 1,
        unit: item.unit || "pcs",
        source: item.source || "manual"
      };
      
      // Check if we already have this item
      const existingItemIndex = purchaseOrders[activePoIndex].items.findIndex(i => i.id === poItem.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity instead of adding new item
        const updatedItems = [...purchaseOrders[activePoIndex].items];
        updatedItems[existingItemIndex].quantity += 1;
        
        const updatedPOs = [...purchaseOrders];
        updatedPOs[activePoIndex] = {
          ...updatedPOs[activePoIndex],
          items: updatedItems
        };
        
        setPurchaseOrders(updatedPOs);
        toast({
          title: "Quantity diperbarui",
          description: `Quantity ${poItem.name} ditambah 1`,
          variant: "default"
        });
      } else {
        // Add as new item
        const newItems = [...purchaseOrders[activePoIndex].items, poItem];
        
        const updatedPOs = [...purchaseOrders];
        updatedPOs[activePoIndex] = {
          ...updatedPOs[activePoIndex],
          items: newItems
        };
        
        setPurchaseOrders(updatedPOs);
        toast({
          title: "Item ditambahkan",
          description: `${poItem.name} telah ditambahkan ke PO`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error adding item to PO:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan item ke PO",
        variant: "destructive"
      });
    }
  };

  const addNewPO = () => {
    const newPO = {
      id: `po-${Date.now()}`,
      supplierId: "",
      items: [],
      poNumber: generatePONumber(),
      expectedDelivery: new Date(),
      notes: "",
      isActive: false
    };
    
    setPurchaseOrders(current => [...current, newPO]);
    
    setTimeout(() => {
      setActivePoIndex(purchaseOrders.length);
    }, 100);
    
    toast({
      title: "PO Baru Dibuat",
      description: "Purchase Order baru telah ditambahkan",
      variant: "default",
    });
  };

  const deletePO = (index: number) => {
    if (purchaseOrders.length <= 1) {
      toast({
        title: "Tidak Dapat Menghapus",
        description: "Harus ada minimal satu Purchase Order",
        variant: "destructive",
      });
      return;
    }
    
    setPurchaseOrders(current => {
      const newPOs = current.filter((_, i) => i !== index);
      if (index === activePoIndex) {
        setTimeout(() => {
          setActivePoIndex(0);
        }, 100);
      } else if (index < activePoIndex) {
        setTimeout(() => {
          setActivePoIndex(activePoIndex - 1);
        }, 100);
      }
      return newPOs;
    });
    
    toast({
      title: "PO Dihapus",
      description: "Purchase Order telah dihapus",
      variant: "default",
    });
  };

  const setActivePO = (index: number) => {
    setPurchaseOrders(current => 
      current.map((po, i) => ({
        ...po,
        isActive: i === index
      }))
    );
    
    setActivePoIndex(index);
  };

  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);

  const products = [
    { id: 'prod-1', name: 'Paracetamol 500mg', sku: 'PCM500', unit: 'tablet', price: 2500 },
    { id: 'prod-2', name: 'Amoxicillin 500mg', sku: 'AMX500', unit: 'capsule', price: 5000 },
    { id: 'prod-3', name: 'Vitamin C 1000mg', sku: 'VTC1000', unit: 'tablet', price: 4000 },
    { id: 'prod-4', name: 'Ibuprofen 400mg', sku: 'IBP400', unit: 'tablet', price: 3000 },
    { id: 'prod-5', name: 'Loratadine 10mg', sku: 'LRT10', unit: 'tablet', price: 6000 },
    { id: 'prod-6', name: 'Omeprazole 20mg', sku: 'OMP20', unit: 'capsule', price: 7500 },
    { id: 'prod-7', name: 'Simvastatin 10mg', sku: 'SMV10', unit: 'tablet', price: 5500 },
    { id: 'prod-8', name: 'Metformin 500mg', sku: 'MTF500', unit: 'tablet', price: 3500 },
  ];

  const addProductRow = () => {
    setShowProductSelector(true);
    setSelectedProductIndex(null);
  };

  const handleSelectProduct = (product: any) => {
    const newItem: OrderItem = { 
      id: `item-${Date.now()}`, 
      productId: product.id, 
      productName: product.name, 
      sku: product.sku, 
      quantity: 1, 
      purchasePrice: product.price, 
      subtotal: product.price, 
      unit: product.unit,
      source: 'manual'
    };
    
    setPurchaseOrders(currentPOs => {
      const newPOs = [...currentPOs];
      newPOs[activePoIndex] = {
        ...newPOs[activePoIndex],
        items: [...(newPOs[activePoIndex]?.items || []), newItem]
      };
      return newPOs;
    });

    setShowProductSelector(false);
    
    toast({
      title: "Produk Ditambahkan",
      description: `${product.name} telah ditambahkan ke purchase order`,
      variant: "default",
    });
  };

  const handleEditProduct = (index: number) => {
    setSelectedProductIndex(index);
    setShowProductSelector(true);
  };

  // Calculate total price for the PO
  const calculateTotal = () => {
    if (!purchaseOrders[activePoIndex]?.items) return 0;
    
    return purchaseOrders[activePoIndex].items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleAccordion = (poId: string) => {
    setAdditionalPOs(additionalPOs.map(po => 
      po.id === poId ? { ...po, isOpen: !po.isOpen } : po
    ));
  };

  const deleteAdditionalPO = (poId: string) => {
    setAdditionalPOs(additionalPOs.filter(po => po.id !== poId));
    
    toast({
      title: "PO Dihapus",
      description: "Purchase Order tambahan telah dihapus.",
      variant: "default",
    });
  };

  const createNewPOForSupplier = (supplierId: string, items: OrderItem[]) => {
    const newPO = {
      id: `po-${Date.now()}`,
      supplierId,
      poNumber: generatePONumber(),
      items,
      isOpen: true
    };
    
    setAdditionalPOs([...additionalPOs, newPO]);
    setShowUnavailableWarning(false);
    
    toast({
      title: "PO Baru Dibuat",
      description: `Purchase Order baru untuk ${getSupplierNameById(supplierId)} telah dibuat.`,
      variant: "default",
    });
  };

  const processPurchaseOrder = async () => {
    if (!purchaseOrders[activePoIndex]) {
      toast({
        title: "Error",
        description: "Purchase order tidak ditemukan. Silahkan refresh halaman.",
        variant: "destructive",
      });
      return;
    }

    setShowProcessingDialog(true);
    
    setTimeout(() => {
      setShowProcessingDialog(false);
      setCreatedPONumber(purchaseOrders[activePoIndex]?.poNumber || generatePONumber());
      setShowSuccessDialog(true);
      
      const newPO = {
        id: `po-${Date.now()}`,
        supplierId: "",
        items: [],
        poNumber: generatePONumber(),
        expectedDelivery: new Date(),
        notes: "",
        isActive: true
      };
      
      setPurchaseOrders([newPO]);
      setActivePoIndex(0);
      
      form.reset({
        supplier: "",
        poNumber: newPO.poNumber,
        expectedDelivery: new Date(),
        notes: ""
      });
      
      toast({
        title: "PO berhasil didistribusikan",
        description: "Informasi PO telah terkirim ke modul inventaris dan finance",
        variant: "default",
      });
      
      if (onOrderCreated) {
        onOrderCreated();
      }
    }, 2000);
  };

  const validateProductAvailability = (): boolean => {
    const activePO = purchaseOrders[activePoIndex];
    if (!activePO) {
      toast({
        title: "Error",
        description: "Purchase order tidak ditemukan. Silahkan refresh halaman.",
        variant: "destructive",
      });
      return false;
    }
    
    const unavailableItems = activePO.items.filter(item => 
      !isProductAvailableFromSupplier(item.productId, activePO.supplierId || "")
    );
    
    if (unavailableItems.length > 0) {
      setValidationErrors([
        `${unavailableItems.length} produk tidak tersedia dari supplier ${getSupplierNameById(activePO.supplierId || "")}`,
        ...unavailableItems.map(item => `- ${item.productName} (${item.sku})`)
      ]);
      setShowValidationDialog(true);
      return false;
    }
    
    return true;
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setPurchaseOrders(current => {
      const newPOs = [...current];
      newPOs[activePoIndex] = {
        ...newPOs[activePoIndex],
        supplierId: data.supplier || "",
        poNumber: data.poNumber,
        expectedDelivery: data.expectedDelivery,
        notes: data.notes
      };
      return newPOs;
    });
    
    if (!validateProductAvailability()) {
      setShowValidationDialog(true);
      return;
    }
    
    processPurchaseOrder();
  };

  // Handle quantity change
  const handleItemQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    
    const updatedPOs = [...purchaseOrders];
    updatedPOs[activePoIndex].items[index].quantity = newQuantity;
    updatedPOs[activePoIndex].items[index].subtotal = updatedPOs[activePoIndex].items[index].price * newQuantity;
    setPurchaseOrders(updatedPOs);
  };
  
  // Handle price change
  const handleItemPriceChange = (index: number, newPrice: number) => {
    if (newPrice < 0) newPrice = 0;
    
    const updatedPOs = [...purchaseOrders];
    updatedPOs[activePoIndex].items[index].price = newPrice;
    updatedPOs[activePoIndex].items[index].subtotal = newPrice * updatedPOs[activePoIndex].items[index].quantity;
    setPurchaseOrders(updatedPOs);
  };
  
  // Handle removing item
  const handleRemoveItem = (index: number) => {
    const updatedPOs = [...purchaseOrders];
    updatedPOs[activePoIndex].items.splice(index, 1);
    setPurchaseOrders(updatedPOs);
    
    toast({
      title: "Item dihapus",
      description: "Item telah dihapus dari Purchase Order",
      variant: "default"
    });
  };

  useEffect(() => {
    const handleAddToPOEvent = (e: CustomEvent) => {
      console.log('Custom event received:', e.detail);
      if (e.detail) {
        addItemToPO(e.detail);
      }
    };
    
    // Add event listener
    document.addEventListener('add-to-po', handleAddToPOEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('add-to-po', handleAddToPOEvent as EventListener);
    };
  }, []);

  return (
    <div 
      className={`relative p-4 ${isOver ? 'bg-orange-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* PO Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50">
            {purchaseOrders.map((po, index) => (
              <button
                key={po.id}
                onClick={() => setActivePO(index)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 ${
                  index === activePoIndex
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>PO #{index + 1}</span>
                {purchaseOrders.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePO(index);
                    }}
                    className="ml-2 text-xs p-1 rounded-full hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <FaTimes size={10} />
                  </button>
                )}
              </button>
            ))}
            
            <button
              onClick={addNewPO}
              className="px-3 py-2 rounded-t-lg text-sm bg-gray-50 text-orange-600 hover:bg-gray-100 flex items-center"
            >
              <FaPlus size={12} className="mr-1" />
              <span>Tambah PO</span>
            </button>
          </div>
        </div>
      </div>
      
      <Card className="border-red-100 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-sm mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">Purchase Order #{activePoIndex + 1}</h3>
                <p className="text-xs text-gray-500">Drag item defecta untuk menambahkan ke pesanan</p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200">
              {purchaseOrders[activePoIndex]?.items?.length || 0} Item
            </Badge>
          </div>
        </CardHeader>
        
        {/* Filter dan export tools */}
        <div className="flex flex-wrap gap-2 mb-4 mt-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-orange-500 focus:border-orange-500" 
                placeholder="Cari produk..."
              />
            </div>
          </div>
          
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Urut berdasarkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nama (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nama (Z-A)</SelectItem>
              <SelectItem value="price-asc">Harga (Terendah)</SelectItem>
              <SelectItem value="price-desc">Harga (Tertinggi)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>Export</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            <span>Import</span>
          </Button>
        </div>

        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Supplier */}
                <div>
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">Supplier</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateActivePO('supplierId', value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih supplier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSuppliers.map((supplier) => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {getSupplierNameById(supplier.id)}
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
                <div>
                  <FormField
                    control={form.control}
                    name="poNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">Nomor PO</FormLabel>
                        <FormControl>
                          <Input {...field} className="font-medium" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Expected Delivery */}
                <div>
                  <FormField
                    control={form.control}
                    name="expectedDelivery"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">Tanggal Pengiriman</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md pl-3 bg-white">
                            <FaRegClock className="text-gray-400 mr-2" />
                            <Input 
                              type="date"
                              value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                field.onChange(date);
                                updateActivePO('expectedDelivery', date);
                              }}
                              className="border-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Order Items */}
              <div 
                className={`border-2 rounded-md transition-all p-4 ${
                  isOver 
                    ? 'border-orange-500 bg-orange-50/50 border-solid' 
                    : 'border-dashed border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {purchaseOrders[activePoIndex] && purchaseOrders[activePoIndex].items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50">
                          <TableHead className="whitespace-nowrap font-medium text-orange-800">Produk</TableHead>
                          <TableHead className="whitespace-nowrap font-medium text-orange-800">SKU</TableHead>
                          <TableHead className="whitespace-nowrap font-medium text-orange-800">Unit</TableHead>
                          <TableHead className="whitespace-nowrap text-center font-medium text-orange-800">Qty</TableHead>
                          <TableHead className="whitespace-nowrap text-right font-medium text-orange-800">Harga Satuan</TableHead>
                          <TableHead className="whitespace-nowrap text-right font-medium text-orange-800">Subtotal</TableHead>
                          <TableHead className="whitespace-nowrap text-center font-medium text-orange-800">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchaseOrders[activePoIndex].items.map((item, index) => (
                          <TableRow key={index} className="hover:bg-orange-50/50 border-b border-orange-100/30">
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.sku || '-'}</TableCell>
                            <TableCell>{item.unit || 'pcs'}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                min={1}
                                className="w-16 text-center mx-auto"
                                onChange={(e) => handleItemQuantityChange(index, parseInt(e.target.value) || 0)}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                type="number"
                                value={item.price}
                                min={0}
                                className="w-24 text-right"
                                onChange={(e) => handleItemPriceChange(index, parseInt(e.target.value) || 0)}
                              />
                            </TableCell>
                            <TableCell className="text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</TableCell>
                            <TableCell className="text-center">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="hover:text-red-600 hover:bg-red-50 text-red-500"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <FaTimes size={14} />
                                <span className="sr-only">Hapus</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={5} className="text-right font-medium">Total</TableCell>
                          <TableCell className="text-right font-bold">Rp {calculateTotal().toLocaleString('id-ID')}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-orange-100 to-amber-50 rounded-full flex items-center justify-center">
                      <FaBoxOpen className="text-orange-400 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-1">Belum ada item</h3>
                    <p className="text-gray-500 mb-4">Drag item dari daftar defecta atau gunakan tombol di bawah untuk menambahkan produk</p>
                    
                    {isOver && (
                      <div className="absolute inset-0 bg-orange-50/80 backdrop-blur-[1px] flex items-center justify-center rounded border-2 border-orange-500 z-10">
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white mb-3">
                            <FaPlus className="w-6 h-6" />
                          </div>
                          <p className="font-medium text-orange-800">Lepaskan untuk menambahkan ke PO</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-800"
                    onClick={() => setShowProductSelector(true)}
                  >
                    <FaPlus className="mr-2 h-4 w-4" /> Tambah Produk
                  </Button>
                </div>
              </div>
              
              {/* Peringatan produk tidak tersedia */}
              {showUnavailableWarning && unavailableProducts.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Beberapa produk tidak tersedia dari supplier ini
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {unavailableProducts.map(item => (
                            <li key={item.id}>
                              {item.productName} (SKU: {item.sku})
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => setShowUnavailableWarning(false)}
                        >
                          Tutup Peringatan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Info supplier untuk produk */}
              {showSupplierInfoForProduct && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-blue-800">
                        Informasi Supplier untuk {showSupplierInfoForProduct.productName}
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Produk ini tersedia dari supplier berikut:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                          {showSupplierInfoForProduct && showSupplierInfoForProduct.productId && 
                            getSuppliersForProduct(showSupplierInfoForProduct.productId).map(supplierId => (
                            <li key={supplierId} className="flex items-center justify-between">
                              <span>{getSupplierNameById(supplierId)}</span>
                              {supplierId !== (purchaseOrders[activePoIndex]?.supplierId || "") && (
                                <Button 
                                  size="sm" 
                                  className="text-xs py-0 h-6 ml-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white"
                                  onClick={() => {
                                    updateActivePO('supplierId', supplierId);
                                    setShowSupplierInfoForProduct(null);
                                    toast({
                                      title: "Supplier Diubah",
                                      description: `Supplier diubah ke ${getSupplierNameById(supplierId)}`,
                                      variant: "default",
                                    });
                                  }}
                                >
                                  Pilih
                                </Button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          onClick={() => setShowSupplierInfoForProduct(null)}
                        >
                          Tutup Info
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notes */}
              <div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">Catatan</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tambahkan catatan khusus untuk pesanan ini"
                          className="resize-none h-20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
                  disabled={orderItems.length === 0}
                >
                  <FaSave className="mr-2 h-4 w-4" /> Buat Pesanan
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Additional Purchase Orders */}
      {additionalPOs.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="border-t border-red-100 pt-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Purchase Orders Tambahan</h3>
            
            <div className="space-y-3">
              {additionalPOs.map((po) => (
                <div key={po.id} className="border border-red-100 rounded-md overflow-hidden bg-white">
                  {/* Accordion header */}
                  <div 
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-orange-50 cursor-pointer"
                    onClick={() => toggleAccordion(po.id)}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2">PO #{po.poNumber}</h4>
                        <p className="text-sm text-gray-500">Supplier: {getSupplierNameById(po.supplierId)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                        {po.items.length} item
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 mr-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAdditionalPO(po.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </Button>
                      <div className={`transition-transform ${po.isOpen ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Accordion content */}
                  {po.isOpen && (
                    <div className="p-3 border-t border-red-100">
                      <div className="mb-4">
                        <h5 className="font-medium text-sm text-gray-600 mb-2">Daftar Item</h5>
                        <Table>
                          <TableHeader className="bg-red-50">
                            <TableRow>
                              <TableHead>Produk</TableHead>
                              <TableHead className="text-right">Jumlah</TableHead>
                              <TableHead className="text-right">Harga</TableHead>
                              <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {po.items.map(item => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                  <div>{item.productName}</div>
                                  <div className="text-xs text-gray-500">{item.sku}</div>
                                </TableCell>
                                <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                                <TableCell className="text-right">Rp {item.purchasePrice.toLocaleString('id-ID')}</TableCell>
                                <TableCell className="text-right">Rp {item.subtotal.toLocaleString('id-ID')}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                              <TableCell className="text-right font-bold">
                                Rp {po.items.reduce((total, item) => total + item.subtotal, 0).toLocaleString('id-ID')}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-gradient-to-r from-red-500 to-orange-500">
                          Proses PO
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Product Selector Dialog */}
      <Dialog open={showProductSelector} onOpenChange={setShowProductSelector}>
        <DialogContent className="max-w-3xl border border-orange-100 overflow-hidden">
          {/* Decorative gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-amber-500"></div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-to-bl from-red-500/10 to-orange-500/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-500/10 to-red-500/5 rounded-full blur-xl"></div>
          
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {selectedProductIndex !== null ? 'Edit Produk' : 'Pilih Produk'}
            </DialogTitle>
            <DialogDescription>
              {selectedProductIndex !== null ? 'Edit produk yang dipilih' : 'Pilih produk untuk ditambahkan ke Purchase Order'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="relative mb-4">
              <Input 
                type="text" 
                placeholder="Cari produk..." 
                className="pl-9 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="border border-orange-100 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableHead className="whitespace-nowrap font-medium text-orange-800">Nama Produk</TableHead>
                    <TableHead className="whitespace-nowrap font-medium text-orange-800">SKU</TableHead>
                    <TableHead className="whitespace-nowrap font-medium text-orange-800">Unit</TableHead>
                    <TableHead className="whitespace-nowrap text-right font-medium text-orange-800">Harga</TableHead>
                    <TableHead className="whitespace-nowrap text-center font-medium text-orange-800">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-orange-50/50 border-b border-orange-100/30">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell className="text-right">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:text-orange-600 hover:bg-orange-50 transition-all hover:scale-105"
                          onClick={() => handleSelectProduct(product)}
                        >
                          <MdAdd size={18} className="text-orange-500" />
                          <span className="sr-only">Pilih</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowProductSelector(false)}
              className="border-orange-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:text-orange-600 hover:border-orange-300 transition-all hover:scale-105"
            >
              Tutup
            </Button>
            <Button 
              onClick={() => setShowProductSelector(false)} 
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-sm transition-all hover:scale-105"
            >
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Validation Dialog - Produk tidak tersedia */}
      <CustomModal 
        isOpen={showValidationDialog} 
        onClose={() => setShowValidationDialog(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Produk Tidak Tersedia
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Beberapa produk tidak tersedia dari supplier yang dipilih.
            </p>
            <div className="mt-4 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3 space-y-2">
                  {validationErrors.map((error, index) => (
                    <p key={index} className="text-sm text-yellow-700">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-0 sm:justify-end">
            <Button
              variant="default"
              className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white"
              onClick={() => setShowValidationDialog(false)}
            >
              Kembali Edit PO
            </Button>
          </div>
        </div>
      </CustomModal>
      
      {/* Dialog proses PO */}
      <CustomModal
        isOpen={showProcessingDialog}
        onClose={() => {}}
      >
        <div className="space-y-4 text-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Memproses Purchase Order
          </h3>
          <div className="flex justify-center py-4">
            <div className="h-12 w-12 rounded-full border-4 border-t-amber-500 border-orange-200 animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500">
            Harap tunggu sementara kami memproses order anda...
          </p>
        </div>
      </CustomModal>
      
      {/* Dialog sukses */}
      <CustomModal
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      >
        <div className="space-y-4 text-center">
          <div className="flex justify-center py-4">
            <div className="rounded-full bg-green-100 p-3">
              <FaCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Purchase Order Berhasil
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Purchase Order dengan nomor <span className="font-semibold">{createdPONumber}</span> telah berhasil dibuat.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-0 sm:justify-center">
            <Button
              className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white"
              onClick={() => {
                setShowSuccessDialog(false);
                router.push('/purchasing?tab=pending');
              }}
            >
              Lihat Detail PO
            </Button>
          </div>
        </div>
      </CustomModal>
      
      {/* Dialog untuk supplier alternatif */}
      <CustomModal
        isOpen={showUnavailableWarning}
        onClose={() => setShowUnavailableWarning(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Produk Tidak Tersedia
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {lastDraggedItem?.name} tidak tersedia dari supplier yang dipilih. Pilih supplier alternatif:
            </p>
            <div className="mt-4 space-y-2">
              {lastDraggedItem && lastDraggedItem.productId && 
                getSuppliersForProduct(lastDraggedItem.productId).map(supplierId => (
                <Button
                  key={supplierId}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => createNewPOForSupplier(supplierId, [{
                    id: `item-${Date.now()}`,
                    productId: lastDraggedItem.productId || "",
                    productName: lastDraggedItem.name || "",
                    sku: lastDraggedItem.sku || "",
                    quantity: 1,
                    unitPrice: lastDraggedItem.estimatedPrice || lastDraggedItem.purchasePrice || 0,
                    subtotal: lastDraggedItem.estimatedPrice || lastDraggedItem.purchasePrice || 0,
                    unit: lastDraggedItem.unit,
                    source: 'defecta'
                  }])}
                >
                  <span>{getSupplierNameById(supplierId)}</span>
                  <FaArrowRight className="ml-2" />
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              className="border-orange-200 text-orange-600"
              onClick={() => setShowUnavailableWarning(false)}
            >
              Batal
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
