import React, { useState, useRef } from 'react';
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaClipboardList,
  FaBoxOpen,
  FaFileInvoice,
  FaMinus,
  FaShoppingCart,
  FaExclamationTriangle,
  FaClock,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import { format, addDays } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableFooter
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Mock data for defect items
const mockDefectItems = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    sku: 'MED001',
    priority: 'high',
    quantity: 500,
    price: 1200,
    supplier: 'PT Kimia Farma',
    lastPurchasePrice: 1150
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    sku: 'MED002',
    priority: 'medium',
    quantity: 200,
    price: 2500,
    supplier: 'PT Phapros',
    lastPurchasePrice: 2400
  },
  {
    id: '3',
    name: 'Omeprazole 20mg',
    sku: 'MED003',
    priority: 'high',
    quantity: 300,
    price: 3000,
    supplier: 'PT Kalbe Farma',
    lastPurchasePrice: 2950
  },
  {
    id: '4',
    name: 'Cetirizine 10mg',
    sku: 'MED004',
    priority: 'low',
    quantity: 400,
    price: 1800,
    supplier: 'PT Dexa Medica',
    lastPurchasePrice: 1750
  },
];

// Mock data for suppliers
const mockSuppliers = [
  { id: 'sup1', name: 'PT Kimia Farma' },
  { id: 'sup2', name: 'PT Phapros' },
  { id: 'sup3', name: 'PT Kalbe Farma' },
  { id: 'sup4', name: 'PT Dexa Medica' },
];

const mockStatsData = {
  pendingOrders: 8,
  inTransit: 3,
  totalValue: 15000000,
  lowStockItems: 12
};

// Mock data for low stock items
const mockLowStockItems = [
  {
    id: 'low1',
    name: 'Paracetamol 500mg',
    sku: 'MED001',
    currentStock: 35,
    minStock: 100,
    price: 1200,
    supplier: 'PT Kimia Farma',
    lastPurchasePrice: 1150
  },
  {
    id: 'low2',
    name: 'Ciprofloxacin 500mg',
    sku: 'MED008',
    currentStock: 25,
    minStock: 80,
    price: 3500,
    supplier: 'PT Phapros',
    lastPurchasePrice: 3400
  },
  {
    id: 'low3',
    name: 'Vitamin C 1000mg',
    sku: 'MED015',
    currentStock: 40,
    minStock: 120,
    price: 1500,
    supplier: 'PT Kalbe Farma',
    lastPurchasePrice: 1450
  }
];

// Mock data for near expiry items
const mockNearExpiryItems = [
  {
    id: 'exp1',
    name: 'Cefixime 100mg',
    sku: 'MED022',
    expiryDate: '2025-05-15',
    currentStock: 75,
    price: 4200,
    supplier: 'PT Dexa Medica',
    lastPurchasePrice: 4100
  },
  {
    id: 'exp2',
    name: 'Metformin 500mg',
    sku: 'MED018',
    expiryDate: '2025-05-30',
    currentStock: 90,
    price: 1800,
    supplier: 'PT Phapros',
    lastPurchasePrice: 1750
  },
  {
    id: 'exp3',
    name: 'Loratadine 10mg',
    sku: 'MED031',
    expiryDate: '2025-06-10',
    currentStock: 60,
    price: 2200,
    supplier: 'PT Kimia Farma',
    lastPurchasePrice: 2150
  }
];

// Mock data for defect items by supplier
interface DefectItem {
  id: string;
  name: string;
  sku: string;
  priority: string;
  quantity: number;
  price: number;
  supplier: string;
  lastPurchasePrice: number;
}

interface DefectItemsBySupplier {
  [key: string]: DefectItem[];
}

const mockDefectItemsBySupplier: DefectItemsBySupplier = {
  'PT Kimia Farma': [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      sku: 'MED001',
      priority: 'high',
      quantity: 500,
      price: 1200,
      supplier: 'PT Kimia Farma',
      lastPurchasePrice: 1150
    },
    {
      id: '5',
      name: 'Vitamin B Complex',
      sku: 'MED005',
      priority: 'medium',
      quantity: 300,
      price: 1800,
      supplier: 'PT Kimia Farma',
      lastPurchasePrice: 1700
    }
  ],
  'PT Phapros': [
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      sku: 'MED002',
      priority: 'medium',
      quantity: 200,
      price: 2500,
      supplier: 'PT Phapros',
      lastPurchasePrice: 2400
    }
  ],
  'PT Kalbe Farma': [
    {
      id: '3',
      name: 'Omeprazole 20mg',
      sku: 'MED003',
      priority: 'high',
      quantity: 300,
      price: 3000,
      supplier: 'PT Kalbe Farma',
      lastPurchasePrice: 2950
    }
  ],
  'PT Dexa Medica': [
    {
      id: '4',
      name: 'Cetirizine 10mg',
      sku: 'MED004',
      priority: 'low',
      quantity: 400,
      price: 1800,
      supplier: 'PT Dexa Medica',
      lastPurchasePrice: 1750
    }
  ]
};

// Interface for PO item
interface POItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

// Interface for PO form
interface POForm {
  id: string;
  supplier: string;
  items: POItem[];
}

export function AlignedPurchasingDashboard() {
  const { toast } = useToast();
  const searchRef = useRef<HTMLInputElement>(null);
  const [poForms, setPOForms] = useState<POForm[]>([
    { id: 'po1', supplier: '', items: [] }
  ]);
  const [activeTab, setActiveTab] = useState('po1');
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [dialogActiveTab, setDialogActiveTab] = useState('low-stock');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [defectaActiveTab, setDefectaActiveTab] = useState('all');
  const [isDragActive, setIsDragActive] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPOId, setProcessedPOId] = useState<string | null>(null);
  
  // Current date and delivery date (7 days later)
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const deliveryDate = format(addDays(new Date(), 7), 'yyyy-MM-dd');

  // Handle drag start event
  const handleDragStart = (e: React.DragEvent, item: any) => {
    setDraggedItem(item);
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, poId: string) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (!draggedItem) return;
    
    // Add the dragged item to the selected PO
    const updatedForms = poForms.map(form => {
      if (form.id === poId) {
        // Check if the item is already in the PO
        const existingItemIndex = form.items.findIndex(item => item.id === draggedItem.id);
        
        if (existingItemIndex >= 0) {
          // Update the quantity if the item already exists
          const updatedItems = [...form.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          
          return {
            ...form,
            items: updatedItems
          };
        } else {
          // Add the new item to the PO with supplier info
          return {
            ...form,
            items: [...form.items, {
              id: draggedItem.id,
              name: draggedItem.name,
              sku: draggedItem.sku,
              quantity: 1,
              price: draggedItem.price
            }],
            supplier: draggedItem.supplier
          };
        }
      }
      
      return form;
    });
    
    setPOForms(updatedForms);
    
    toast({
      title: "Item Ditambahkan",
      description: `${draggedItem.name} telah ditambahkan ke PO`,
    });
    
    setDraggedItem(null);
  };

  // Add new PO form
  const addNewPOForm = () => {
    const newId = `po${poForms.length + 1}`;
    setPOForms([...poForms, { id: newId, supplier: '', items: [] }]);
    setActiveTab(newId);
  };

  // Remove item from PO
  const removeItemFromPO = (poId: string, itemId: string) => {
    const updatedForms = poForms.map(form => {
      if (form.id === poId) {
        return {
          ...form,
          items: form.items.filter(item => item.id !== itemId)
        };
      }
      return form;
    });
    
    setPOForms(updatedForms);
  };

  // Update supplier for a PO
  const updateSupplier = (poId: string, supplier: string) => {
    const updatedForms = poForms.map(form => {
      if (form.id === poId) {
        return { ...form, supplier };
      }
      return form;
    });
    
    setPOForms(updatedForms);
  };

  // Calculate PO total
  const calculatePOTotal = (items: POItem[]) => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  // Add item from dialog to active PO
  const addItemFromDialog = (item: any) => {
    const updatedForms = poForms.map(form => {
      if (form.id === activeTab) {
        // Check if item already exists in the PO
        const existingItem = form.items.find(i => i.id === item.id);
        
        if (existingItem) {
          // Increment quantity if item already exists
          return {
            ...form,
            items: form.items.map(i => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + 1 } 
                : i
            )
          };
        } else {
          // Add new item to the PO
          return {
            ...form,
            items: [...form.items, {
              id: item.id,
              name: item.name,
              sku: item.sku,
              quantity: 1,
              price: item.price || 0
            }]
          };
        }
      }
      return form;
    });
    
    setPOForms(updatedForms);
    
    toast({
      title: "Item Ditambahkan",
      description: `${item.name} telah ditambahkan ke PO`,
    });
  };

  // Add all items from a supplier to the active PO
  const addAllItemsFromSupplier = (supplier: string) => {
    const itemsToAdd = mockDefectItemsBySupplier[supplier] || [];
    
    if (itemsToAdd.length === 0) {
      toast({
        title: "Tidak Ada Item",
        description: `Tidak ada item dari supplier ${supplier} yang dapat ditambahkan`,
      });
      return;
    }
    
    const updatedForms = poForms.map(form => {
      if (form.id === activeTab) {
        // Update the supplier in the PO form to match the selected supplier tab
        // Create a map of existing items for easier lookup
        const existingItemsMap = new Map<string, POItem>();
        form.items.forEach(item => existingItemsMap.set(item.id, item));
        
        // Process each item from the supplier
        const updatedItems = [...form.items];
        
        itemsToAdd.forEach((newItem: DefectItem) => {
          const existingItem = existingItemsMap.get(newItem.id);
          
          if (existingItem) {
            // Update quantity if item already exists
            const index = updatedItems.findIndex(item => item.id === newItem.id);
            updatedItems[index] = {
              ...existingItem,
              quantity: existingItem.quantity + 1
            };
          } else {
            // Add new item
            updatedItems.push({
              id: newItem.id,
              name: newItem.name,
              sku: newItem.sku,
              quantity: 1,
              price: newItem.price
            });
          }
        });
        
        return { ...form, items: updatedItems, supplier: supplier };
      }
      return form;
    });
    
    setPOForms(updatedForms);
    
    toast({
      title: "Semua Item Ditambahkan",
      description: `${itemsToAdd.length} item dari ${supplier} telah ditambahkan ke PO`,
    });
  };

  // Get all suppliers
  const allSuppliers = Object.keys(mockDefectItemsBySupplier);

  // Get defecta items based on active tab
  const getDefectaItems = (): DefectItem[] => {
    if (defectaActiveTab === 'all') {
      // Flatten all items from all suppliers
      return Object.values(mockDefectItemsBySupplier).flat();
    }
    return mockDefectItemsBySupplier[defectaActiveTab] || [];
  };

  // Remove PO tab
  const removePOTab = (poId: string) => {
    const updatedForms = poForms.filter(form => form.id !== poId);
    setPOForms(updatedForms);
    setActiveTab(updatedForms[0].id);
  };

  // Generate a PO number
  const generatePONumber = () => {
    const datePrefix = format(new Date(), 'yyyyMMdd');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `PO-${datePrefix}-${randomSuffix}`;
  };
  
  // Process PO
  const processPO = () => {
    setIsProcessing(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      setIsReviewDialogOpen(false);
      
      // Update pending orders stats (in a real app, this would be handled by the backend)
      
      // Show success toast
      toast({
        title: "PO Berhasil Diproses",
        description: `Purchase Order telah berhasil dibuat dan dipindahkan ke Pesanan Tertunda.`,
      });
      
      // Store processed PO ID to show completion message
      setProcessedPOId(activeTab);
      
      // Reset the current PO form
      const updatedForms = poForms.map(form => 
        form.id === activeTab ? { ...form, items: [], supplier: '' } : form
      );
      setPOForms(updatedForms);
      
      // Show success message
      setTimeout(() => {
        setProcessedPOId(null);
      }, 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Heading and Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
            Dashboard Pembelian
          </h2>
          <p className="text-gray-500 mt-1">
            Kelola pesanan, pembelian, dan stok barang
          </p>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              ref={searchRef}
              placeholder="Cari produk..." 
              className="pl-9 pr-4 border-orange-100 focus:border-orange-300 focus:ring-orange-200"
            />
          </div>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            Cari
          </Button>
        </form>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Pesanan Tertunda</p>
                <p className="text-2xl font-bold">{mockStatsData.pendingOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-sm">
                <FaClipboardList className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Dalam Pengiriman</p>
                <p className="text-2xl font-bold">{mockStatsData.inTransit}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shadow-sm">
                <FaShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Total Nilai</p>
                <p className="text-2xl font-bold">Rp{(mockStatsData.totalValue / 1000000).toFixed(1)}jt</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm">
                <FaFileInvoice className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-100 shadow-md overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-bl from-orange-500/10 to-amber-500/5 blur-xl"></div>
          
          <CardContent className="pt-6 pb-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Stok Menipis</p>
                <p className="text-2xl font-bold">{mockStatsData.lowStockItems}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-sm">
                <FaBoxOpen className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content - Side by Side Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Defecta List with drag & drop */}
        <div>
          <Card className="border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden relative h-full">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-xl -z-0"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            
            <CardHeader className="pb-2 border-b border-orange-100/50 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                    Daftar Defekta
                  </CardTitle>
                  <CardDescription>
                    Drag & drop item ke form PO untuk menambahkan
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={() => setIsProductDialogOpen(true)}
                >
                  Tambah Item
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 relative z-10">
              <Tabs value={defectaActiveTab} onValueChange={setDefectaActiveTab}>
                <TabsList className="w-full bg-orange-50/80 overflow-x-auto flex-nowrap p-1 gap-1">
                  <TabsTrigger 
                    value="all"
                    className="flex-shrink-0 text-orange-700 hover:bg-orange-100
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20
                    rounded-md px-4 py-2"
                  >
                    Semua
                  </TabsTrigger>
                  {allSuppliers.map(supplier => (
                    <TabsTrigger 
                      key={supplier}
                      value={supplier}
                      className="flex-shrink-0 text-orange-700 hover:bg-orange-100
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 
                      data-[state=active]:text-white data-[state=active]:font-medium
                      data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20
                      rounded-md px-4 py-2"
                    >
                      {supplier}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {defectaActiveTab !== 'all' && (
                  <div className="p-2 bg-orange-50/50 border-b border-orange-100 flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => addAllItemsFromSupplier(defectaActiveTab)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      Tambahkan Semua ke PO
                    </Button>
                  </div>
                )}
                
                <Table>
                  <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableRow>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-center">Prioritas</TableHead>
                      <TableHead className="text-center">Jumlah</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Harga Beli Terakhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getDefectaItems().map((item: DefectItem) => (
                      <TableRow 
                        key={item.id} 
                        className="hover:bg-orange-50/30 cursor-move"
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                      >
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={
                            item.priority === 'high' 
                              ? "border-orange-200 text-orange-700 bg-orange-50" 
                              : item.priority === 'medium'
                              ? "border-amber-200 text-amber-700 bg-amber-50"
                              : "border-green-200 text-green-700 bg-green-50"
                          }>
                            {item.priority === 'high' ? 'Tinggi' : item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>Rp{item.price.toLocaleString('id-ID')}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>Rp{item.lastPurchasePrice.toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Multi-form PO with drag & drop target */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-2">
              <TabsList className="bg-orange-50/80 p-1 gap-1">
                {poForms.map((form) => (
                  <TabsTrigger 
                    key={form.id} 
                    value={form.id}
                    className="text-orange-700 hover:bg-orange-100
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20
                    rounded-md px-4 py-2"
                  >
                    PO {form.id.replace('po', '')}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={addNewPOForm}
                  className="hover:bg-orange-100 hover:text-orange-600"
                >
                  <FaPlus className="h-3.5 w-3.5 mr-1" /> PO Baru
                </Button>
                {poForms.length > 1 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      // Get current active tab index
                      const currentIndex = poForms.findIndex(form => form.id === activeTab);
                      // Remove the current active tab
                      const updatedForms = poForms.filter(form => form.id !== activeTab);
                      // Set new active tab (previous tab or first tab if none)
                      const newActiveTab = updatedForms[currentIndex > 0 ? currentIndex - 1 : 0]?.id || '';
                      setPOForms(updatedForms);
                      setActiveTab(newActiveTab);
                      
                      toast({
                        title: "PO Dihapus",
                        description: `PO ${activeTab.replace('po', '')} telah dihapus`
                      });
                    }}
                    className="hover:bg-orange-100 hover:text-orange-600"
                  >
                    <FaTrash className="h-3.5 w-3.5 mr-1" /> Hapus PO
                  </Button>
                )}
              </div>
            </div>
            
            {poForms.map((form) => (
              <TabsContent key={form.id} value={form.id} className="m-0">
                <Card 
                  className={`border-orange-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden relative`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, form.id)}
                >
                  <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
                  <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-xl -z-0"></div>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                  
                  <CardHeader className="relative z-10">
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
                      Form Purchase Order
                    </CardTitle>
                    <CardDescription>
                      Buat purchase order baru
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <div className="grid">
                          <Label htmlFor={`supplier-${form.id}`}>Supplier</Label>
                          <Select 
                            value={form.supplier} 
                            onValueChange={(value) => {
                              const updatedForms = poForms.map(f => 
                                f.id === form.id ? { ...f, supplier: value } : f
                              );
                              setPOForms(updatedForms);
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih supplier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Supplier</SelectLabel>
                                {allSuppliers.map(supplier => (
                                  <SelectItem key={supplier} value={supplier}>
                                    {supplier}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="grid">
                            <Label htmlFor="po-date">Tanggal PO</Label>
                            <Input type="date" id="po-date" className="w-full" defaultValue={currentDate} />
                          </div>
                          <div className="grid">
                            <Label htmlFor="delivery-date">Tanggal Kirim</Label>
                            <Input type="date" id="delivery-date" className="w-full" defaultValue={deliveryDate} />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Table>
                          <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                            <TableRow>
                              <TableHead>Nama Produk</TableHead>
                              <TableHead>Jumlah</TableHead>
                              <TableHead>Harga</TableHead>
                              <TableHead className="text-right">Subtotal</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {form.items.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-6 text-gray-500 italic">
                                  Belum ada item. Drag item dari daftar defekta atau gunakan tombol Tambah Item.
                                </TableCell>
                              </TableRow>
                            ) : (
                              <>
                                {form.items.map(item => (
                                  <TableRow key={item.id} className="hover:bg-orange-50/30">
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center space-x-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-6 w-6 p-0 hover:bg-orange-100 hover:text-orange-600"
                                          onClick={() => {
                                            const updatedForms = poForms.map(f => {
                                              if (f.id === form.id) {
                                                return {
                                                  ...f,
                                                  items: f.items.map(i => 
                                                    i.id === item.id && i.quantity > 1
                                                      ? { ...i, quantity: i.quantity - 1 }
                                                      : i
                                                  )
                                                };
                                              }
                                              return f;
                                            });
                                            setPOForms(updatedForms);
                                          }}
                                        >
                                          <FaMinus className="h-3 w-3" />
                                        </Button>
                                        <span>{item.quantity}</span>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-6 w-6 p-0 hover:bg-orange-100 hover:text-orange-600"
                                          onClick={() => {
                                            const updatedForms = poForms.map(f => {
                                              if (f.id === form.id) {
                                                return {
                                                  ...f,
                                                  items: f.items.map(i => 
                                                    i.id === item.id
                                                      ? { ...i, quantity: i.quantity + 1 }
                                                      : i
                                                  )
                                                };
                                              }
                                              return f;
                                            });
                                            setPOForms(updatedForms);
                                          }}
                                        >
                                          <FaPlus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                    <TableCell>Rp{item.price.toLocaleString('id-ID')}</TableCell>
                                    <TableCell className="text-right">
                                      Rp{(item.quantity * item.price).toLocaleString('id-ID')}
                                    </TableCell>
                                    <TableCell>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => {
                                          const updatedForms = poForms.map(f => {
                                            if (f.id === form.id) {
                                              return {
                                                ...f,
                                                items: f.items.filter(i => i.id !== item.id)
                                              };
                                            }
                                            return f;
                                          });
                                          setPOForms(updatedForms);
                                        }}
                                      >
                                        <FaTrash className="h-3 w-3" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            )}
                          </TableBody>
                          <TableFooter className="bg-gradient-to-r from-orange-100/30 to-amber-100/30">
                            <TableRow>
                              <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                              <TableCell className="text-right font-bold">
                                Rp{calculatePOTotal(form.items).toLocaleString('id-ID')}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" className="border-orange-200 hover:bg-orange-50 hover:text-orange-600">Simpan Draft</Button>
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                          disabled={form.items.length === 0 || !form.supplier}
                          onClick={() => {
                            // Only open review dialog if there are items and a supplier selected
                            if (form.items.length > 0 && form.supplier) {
                              setIsReviewDialogOpen(true);
                            }
                          }}
                        >
                          Proses PO
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-white to-orange-50/20">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
          
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
              Daftar Produk
            </DialogTitle>
            <DialogDescription>
              Pilih produk untuk ditambahkan ke Purchase Order
            </DialogDescription>
          </DialogHeader>
          
          <div className="border-b border-orange-100 pb-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Cari produk..."
                className="pl-9 focus-visible:ring-orange-500"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs value={dialogActiveTab} onValueChange={setDialogActiveTab}>
            <TabsList className="w-full bg-orange-50/80 p-1 gap-1">
              <TabsTrigger 
                value="low-stock"
                className="text-orange-700 hover:bg-orange-100
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 
                data-[state=active]:text-white data-[state=active]:font-medium
                data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20
                rounded-md px-4 py-2"
              >
                Stok Menipis
              </TabsTrigger>
              <TabsTrigger 
                value="near-expiry"
                className="text-orange-700 hover:bg-orange-100
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 
                data-[state=active]:text-white data-[state=active]:font-medium
                data-[state=active]:shadow-sm data-[state=active]:shadow-orange-500/20
                rounded-md px-4 py-2"
              >
                Mendekati Kadaluarsa
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="low-stock" className="m-0 pt-3">
              <Table>
                <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Stok Saat Ini</TableHead>
                    <TableHead className="text-center">Min. Stok</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Harga Beli Terakhir</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLowStockItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-center">{item.currentStock}</TableCell>
                      <TableCell className="text-center">{item.minStock}</TableCell>
                      <TableCell>Rp{item.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>Rp{item.lastPurchasePrice.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            addItemFromDialog(item);
                            setIsProductDialogOpen(false);
                          }}
                          className="hover:bg-orange-100 hover:text-orange-600"
                        >
                          <FaPlus className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="near-expiry" className="m-0 pt-3">
              <Table>
                <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Tanggal Kadaluarsa</TableHead>
                    <TableHead className="text-center">Stok Saat Ini</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Harga Beli Terakhir</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockNearExpiryItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-center">{item.expiryDate}</TableCell>
                      <TableCell className="text-center">{item.currentStock}</TableCell>
                      <TableCell>Rp{item.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>Rp{item.lastPurchasePrice.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            addItemFromDialog(item);
                            setIsProductDialogOpen(false);
                          }}
                          className="hover:bg-orange-100 hover:text-orange-600"
                        >
                          <FaPlus className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* PO Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-orange-50/20">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl -z-0"></div>
          
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">
              Konfirmasi Purchase Order
            </DialogTitle>
            <DialogDescription>
              Periksa detail PO sebelum diproses
            </DialogDescription>
          </DialogHeader>
          
          {processedPOId ? (
            <div className="flex flex-col items-center p-6 text-center">
              <FaCheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">PO Berhasil Diproses!</h3>
              <p className="text-gray-600 mb-4">
                Purchase Order telah berhasil dibuat dan dipindahkan ke Pesanan Tertunda.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* PO Information */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50/50 rounded-md">
                  <div>
                    <p className="text-sm text-gray-500">Nomor PO</p>
                    <p className="font-medium">{generatePONumber()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal</p>
                    <p className="font-medium">{format(new Date(currentDate), 'dd MMM yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-medium">
                      {poForms.find(form => form.id === activeTab)?.supplier || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Item</p>
                    <p className="font-medium">
                      {poForms.find(form => form.id === activeTab)?.items.reduce((sum, item) => sum + item.quantity, 0) || 0} item
                    </p>
                  </div>
                </div>
                
                {/* Items Summary */}
                <div className="border border-orange-100 rounded-md overflow-hidden">
                  <div className="bg-orange-50 p-2 border-b border-orange-100">
                    <h3 className="font-medium">Ringkasan Item</h3>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto p-2">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                        <TableRow>
                          <TableHead>Nama Produk</TableHead>
                          <TableHead>Jumlah</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poForms.find(form => form.id === activeTab)?.items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell className="text-right">
                              Rp{(item.quantity * item.price).toLocaleString('id-ID')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter className="bg-gradient-to-r from-orange-100/30 to-amber-100/30">
                        <TableRow>
                          <TableCell colSpan={2} className="text-right font-medium">Total:</TableCell>
                          <TableCell className="text-right font-bold">
                            Rp{calculatePOTotal(poForms.find(form => form.id === activeTab)?.items || []).toLocaleString('id-ID')}
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                  onClick={() => setIsReviewDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Kembali
                </Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  onClick={processPO}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <FaSpinner className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Proses PO Sekarang'
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
