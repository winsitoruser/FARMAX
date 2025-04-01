import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import InventoryPageLayout from "@/modules/inventory/components/InventoryPageLayout";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { nanoid } from "nanoid";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBoxOpen,
  FaCalendarAlt,
  FaCamera,
  FaCheck,
  FaCheckCircle,
  FaClipboardCheck,
  FaClipboardList,
  FaDownload,
  FaEllipsisH,
  FaExchangeAlt,
  FaEye,
  FaFileInvoice,
  FaFilter,
  FaHistory,
  FaInfoCircle,
  FaMicroscope,
  FaPaperPlane,
  FaPlus,
  FaPrint,
  FaSave,
  FaSearch,
  FaShippingFast,
  FaTimes,
  FaTrash,
  FaTruck
} from "react-icons/fa";

// Mock data for pending returns
const mockPendingReturns = [
  {
    id: "ret001",
    date: "2025-03-30",
    returnNumber: "RTN20250330001",
    supplier: "PT Kimia Farma",
    totalItems: 7,
    totalValue: 2850000,
    status: "pending",
    reason: "Produk rusak saat pengiriman"
  },
  {
    id: "ret002",
    date: "2025-03-29",
    returnNumber: "RTN20250329001",
    supplier: "PT Enseval Putera Megatrading",
    totalItems: 4,
    totalValue: 1750000,
    status: "checking",
    reason: "Produk tidak sesuai spesifikasi"
  },
  {
    id: "ret003",
    date: "2025-03-28",
    returnNumber: "RTN20250328002",
    supplier: "PT Bina San Prima",
    totalItems: 6,
    totalValue: 3100000,
    status: "pending",
    reason: "Produk mendekati kedaluwarsa"
  }
];

// Mock data for history returns
const mockHistoryReturns = [
  {
    id: "retn001",
    date: "2025-03-25",
    returnNumber: "RTN20250325001",
    supplier: "PT Kimia Farma",
    totalItems: 5,
    totalValue: 2250000,
    reason: "Produk rusak saat pengiriman",
    status: "approved",
    refundStatus: "refunded"
  },
  {
    id: "retn002",
    date: "2025-03-21",
    returnNumber: "RTN20250321001",
    supplier: "PT Kalbe Farma",
    totalItems: 3,
    totalValue: 1750000,
    reason: "Produk mendekati kedaluwarsa",
    status: "partial", 
    refundStatus: "partial"
  },
  {
    id: "retn003",
    date: "2025-03-19",
    returnNumber: "RTN20250319001",
    supplier: "PT Novell Pharmaceutical Laboratories",
    totalItems: 2,
    totalValue: 950000,
    reason: "Kesalahan pengiriman produk",
    status: "rejected",
    refundStatus: "none"
  },
  {
    id: "retn004",
    date: "2025-03-15",
    returnNumber: "RTN20250315002",
    supplier: "PT Bintang Toedjoe",
    totalItems: 4,
    totalValue: 1300000,
    reason: "Kemasan produk rusak",
    status: "approved",
    refundStatus: "refunded"
  },
  {
    id: "retn005",
    date: "2025-03-15",
    returnNumber: "RTN20250315001",
    supplier: "PT Phapros",
    totalItems: 2,
    totalValue: 875000,
    reason: "Batch mismatch dengan PO",
    status: "approved",
    refundStatus: "refunded"
  }
];

const ReturnsPage: NextPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("new");
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<Record<string, boolean>>({});
  
  // State for print invoice dialog
  const [showInvoicePDF, setShowInvoicePDF] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  
  // State for product inspection dialog
  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // State for product selection dialog
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  
  // State for selected products in the return form
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [currentProduct, setCurrentProduct] = useState<{
    id: string;
    name: string;
    batch: string;
    expDate: string;
    quantity: number;
    unitPrice: number;
    condition: string;
    reason: string;
    hasPhoto: boolean;
  } | null>(null);

  // Mock product data
  const mockProducts = [
    {
      id: "prod001",
      name: "Paracetamol 500mg",
      detail: "Tab 100's",
      batches: [
        { id: "BN012345", expDate: "2025-12-31" },
        { id: "BN012346", expDate: "2025-11-15" }
      ],
      unitPrice: 400000
    },
    {
      id: "prod002",
      name: "Amoxicillin 500mg",
      detail: "Cap 100's",
      batches: [
        { id: "BN023456", expDate: "2025-10-15" },
        { id: "BN023457", expDate: "2025-09-30" }
      ],
      unitPrice: 525000
    },
    {
      id: "prod003",
      name: "Loratadine 10mg",
      detail: "Tab 50's",
      batches: [
        { id: "BN034567", expDate: "2025-08-22" },
        { id: "BN034568", expDate: "2025-07-18" }
      ],
      unitPrice: 350000
    },
    {
      id: "prod004",
      name: "Omeprazole 20mg",
      detail: "Cap 30's",
      batches: [
        { id: "BN045678", expDate: "2025-06-10" },
        { id: "BN045679", expDate: "2025-05-25" }
      ],
      unitPrice: 480000
    },
    {
      id: "prod005",
      name: "Cetirizine 10mg",
      detail: "Tab 100's",
      batches: [
        { id: "BN056789", expDate: "2026-04-15" },
        { id: "BN056790", expDate: "2026-03-20" }
      ],
      unitPrice: 320000
    }
  ];

  // Format value to Indonesian Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Navigation and action handlers
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSelectedReturn(null);
    setSelectedHistory(null);
  };

  const toggleActionMenu = (id: string) => {
    setActionMenuOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleQuickAction = (id: string, action: string) => {
    // Close the action menu
    setActionMenuOpen(prev => ({
      ...prev,
      [id]: false
    }));

    // Perform the action
    switch (action) {
      case 'check':
        setSelectedReturn(id);
        break;
      case 'approve':
        // Logic for approving the return
        console.log(`Approving return ${id}`);
        break;
      case 'reject':
        // Logic for rejecting the return
        console.log(`Rejecting return ${id}`);
        break;
      case 'print':
        handlePrintInvoice(id);
        break;
      default:
        break;
    }
  };

  // Handle checkout action from the new return form
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for saving the return
    console.log("Return submitted");
    setShowForm(false);
    // Here you would normally make an API call to save the return
  };

  // Handle checking cancelled
  const handleCheckingCancelled = () => {
    setSelectedReturn(null);
  };

  // Handle checking saved/approved
  const handleCheckingSaved = () => {
    // Logic for saving the checking result
    console.log("Return checking saved and approved");
    setSelectedReturn(null);
    // Here you would normally make an API call to save the checking result
  };

  // History tab handlers
  const handleHistoryBack = () => {
    setSelectedHistory(null);
  };

  // Handle print invoice
  const handlePrintInvoice = (id: string) => {
    // Find the return data
    const returnData = mockHistoryReturns.find(item => item.id === id);
    if (returnData) {
      setInvoiceData(returnData);
      setShowInvoicePDF(true);
    }
  };

  // Product selection handlers
  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setCurrentProduct({
        id: product.id,
        name: product.name,
        batch: product.batches[0]?.id || '',
        expDate: product.batches[0]?.expDate || '',
        quantity: 1,
        unitPrice: product.unitPrice,
        condition: 'damaged',
        reason: '',
        hasPhoto: false
      });
    }
  };

  const handleBatchSelect = (batchId: string) => {
    if (!currentProduct) return;
    
    const product = mockProducts.find(p => p.id === currentProduct.id);
    if (!product) return;
    
    const batch = product.batches.find(b => b.id === batchId);
    if (batch) {
      setCurrentProduct({
        ...currentProduct,
        batch: batch.id,
        expDate: batch.expDate
      });
    }
  };

  const handleQuantityChange = (qty: number) => {
    if (!currentProduct) return;
    
    setCurrentProduct({
      ...currentProduct,
      quantity: qty
    });
  };

  const handleConditionSelect = (condition: string) => {
    if (!currentProduct) return;
    
    setCurrentProduct({
      ...currentProduct,
      condition
    });
  };

  const handleReasonChange = (reason: string) => {
    if (!currentProduct) return;
    
    setCurrentProduct({
      ...currentProduct,
      reason
    });
  };

  const handleAddPhoto = () => {
    if (!currentProduct) return;
    
    setCurrentProduct({
      ...currentProduct,
      hasPhoto: true
    });
  };

  const handleAddProductToReturn = () => {
    if (!currentProduct) return;
    
    // Find product details
    const product = mockProducts.find(p => p.id === currentProduct.id);
    if (!product) return;
    
    // Add product to the return
    const newProduct = {
      ...currentProduct,
      detail: product.detail
    };
    
    setSelectedProducts([...selectedProducts, newProduct]);
    setShowProductForm(false);
    setCurrentProduct(null);
  };

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const calculateTotalValue = () => {
    return selectedProducts.reduce((total, product) => {
      return total + (product.unitPrice * product.quantity);
    }, 0);
  };

  // Mock data for inspection and additional state
  const [inspectionProducts, setInspectionProducts] = useState<any[]>([]);
  const [inspectionNotes, setInspectionNotes] = useState<string>("");
  const [showProductInspection, setShowProductInspection] = useState<boolean>(false);
  const [inspectedProduct, setInspectedProduct] = useState<any>(null);
  const [productDecisions, setProductDecisions] = useState<Record<string, 'approved' | 'rejected' | 'pending'>>({});

  // Mock inspection products
  const mockInspectionProducts = [
    {
      id: "prod001-001",
      name: "Paracetamol 500mg",
      detail: "Tab 100's",
      batch: "BN012345",
      expDate: "2025-12-31",
      quantity: 10,
      unitPrice: 400000,
      condition: "damaged",
      reason: "Kemasan rusak",
      subtotal: 4000000
    },
    {
      id: "prod002-001",
      name: "Amoxicillin 500mg",
      detail: "Cap 100's",
      batch: "BN023456",
      expDate: "2025-10-15",
      quantity: 5,
      unitPrice: 525000,
      condition: "damaged",
      reason: "Segel rusak",
      subtotal: 2625000
    }
  ];

  useEffect(() => {
    if (selectedReturn) {
      setInspectionProducts(mockInspectionProducts);
      // Initialize all products as pending
      const initialDecisions: Record<string, 'approved' | 'rejected' | 'pending'> = {};
      mockInspectionProducts.forEach(product => {
        initialDecisions[product.id] = 'pending';
      });
      setProductDecisions(initialDecisions);
    } else {
      setInspectionProducts([]);
      setProductDecisions({});
    }
  }, [selectedReturn]);

  const handleViewInspectionProduct = (productId: string) => {
    const product = inspectionProducts.find(p => p.id === productId);
    if (product) {
      setInspectedProduct(product);
      setShowProductInspection(true);
    }
  };

  const handleApproveProduct = (productId: string) => {
    setProductDecisions(prev => ({
      ...prev,
      [productId]: 'approved'
    }));
  };

  const handleRejectProduct = (productId: string) => {
    setProductDecisions(prev => ({
      ...prev,
      [productId]: 'rejected'
    }));
  };

  const handleUpdateInspectionNotes = (notes: string) => {
    setInspectionNotes(notes);
  };

  const allProductsInspected = () => {
    return Object.values(productDecisions).every(status => status !== 'pending');
  };

  // Action handlers for pending returns
  const handleViewReturn = (returnId: string) => {
    // Find the return and display its details
    const returnToView = mockPendingReturns.find(item => item.id === returnId);
    if (returnToView) {
      // Set up view dialog here - could be implemented in future
      console.log("Viewing return:", returnToView);
      // For now, we'll alert for demonstration
      alert(`Melihat detail retur: ${returnToView.returnNumber}`);
    }
  };

  const handleCheckReturn = (returnId: string) => {
    // Set up the return for checking/inspection
    setSelectedReturn(returnId);
    setActiveTab("check");
  };

  const handleApproveReturn = (returnId: string) => {
    // Find the return and set it to approved status
    const returnToApprove = mockPendingReturns.find(item => item.id === returnId);
    if (returnToApprove) {
      console.log("Approving return:", returnToApprove);
      // For demonstration, we'll alert
      alert(`Menyetujui retur: ${returnToApprove.returnNumber}`);
      // In a real app, you would update the status in the database
    }
  };

  const handleRejectReturn = (returnId: string) => {
    // Find the return and set it to rejected status
    const returnToReject = mockPendingReturns.find(item => item.id === returnId);
    if (returnToReject) {
      console.log("Rejecting return:", returnToReject);
      // For demonstration, we'll alert
      alert(`Menolak retur: ${returnToReject.returnNumber}`);
      // In a real app, you would update the status in the database
    }
  };

  const handlePrintReturn = (returnId: string) => {
    // Find the return and print its details
    const returnToPrint = mockPendingReturns.find(item => item.id === returnId);
    if (returnToPrint) {
      console.log("Printing return:", returnToPrint);
      // For demonstration, we'll alert
      alert(`Mencetak retur: ${returnToPrint.returnNumber}`);
      // In a real app, you would generate a PDF and initiate printing
    }
  };

  return (
    <InventoryPageLayout title="Retur Barang">
      <Head>
        <title>Retur Barang | Farmanesia</title>
      </Head>
      
      <div className="max-w-7xl mx-auto">
        {/* Decorative header with gradient - matching design style */}
        <div className="relative rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-4 mb-4 shadow-md overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4 backdrop-blur-sm">
              <FaExchangeAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Retur Barang</h1>
              <p className="text-white/80 text-sm">Kelola pengembalian barang ke supplier</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="new" className="space-y-4" onValueChange={handleTabChange}>
          <TabsList className="bg-white border p-1 w-full flex space-x-1 mb-4">
            <TabsTrigger value="new" className="flex-1">
              <FaExchangeAlt className="mr-2 h-4 w-4" />
              Retur Baru
            </TabsTrigger>
            <TabsTrigger value="check" className="flex-1">
              <FaClipboardCheck className="mr-2 h-4 w-4" />
              Cek Retur
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <FaHistory className="mr-2 h-4 w-4" />
              Riwayat Retur
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            {!showForm ? (
              <>
                <Card className="shadow-md border-none mb-6">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <FaBoxOpen className="mr-2 h-5 w-5 text-orange-500" />
                      Buat Retur Baru
                    </CardTitle>
                    <CardDescription>
                      Form untuk membuat retur produk ke supplier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Buat Retur Baru
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-none">
                  <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <FaClipboardList className="mr-2 h-5 w-5 text-orange-500" />
                      Retur Tertunda
                    </CardTitle>
                    <CardDescription>
                      Daftar retur yang belum selesai diproses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-6">
                      {/* Filter and search */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Input placeholder="Cari berdasarkan nomor retur atau supplier" className="pl-10" />
                          <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        <div className="flex gap-2">
                          <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Semua Status</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="pending">Menunggu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* List of pending returns */}
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tanggal</TableHead>
                              <TableHead>No. Retur</TableHead>
                              <TableHead>Supplier</TableHead>
                              <TableHead className="text-center">Jumlah Item</TableHead>
                              <TableHead className="text-right">Nilai Total</TableHead>
                              <TableHead>Alasan</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                              <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockPendingReturns.map((returnItem) => (
                              <TableRow key={returnItem.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <TableCell className="font-medium">{new Date(returnItem.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}</TableCell>
                                <TableCell>{returnItem.returnNumber}</TableCell>
                                <TableCell>{returnItem.supplier}</TableCell>
                                <TableCell className="text-center">{returnItem.totalItems}</TableCell>
                                <TableCell className="text-right">{formatRupiah(returnItem.totalValue)}</TableCell>
                                <TableCell>
                                  <div className="max-w-xs truncate">{returnItem.reason}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant={returnItem.status === "draft" ? "outline" : "secondary"} className={returnItem.status === "pending" ? "text-orange-500 border-orange-200 bg-orange-50" : ""}>
                                    {returnItem.status === "draft" ? "Draft" : "Menunggu"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                      onClick={() => handleViewReturn(returnItem.id)}
                                      title="Lihat Detail"
                                    >
                                      <FaEye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                      onClick={() => handleCheckReturn(returnItem.id)}
                                      title="Periksa Retur"
                                    >
                                      <FaClipboardCheck className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => handleApproveReturn(returnItem.id)}
                                      title="Setujui"
                                    >
                                      <FaCheck className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleRejectReturn(returnItem.id)}
                                      title="Tolak"
                                    >
                                      <FaTimes className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                                      onClick={() => handlePrintReturn(returnItem.id)}
                                      title="Cetak"
                                    >
                                      <FaPrint className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md border-none mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaBoxOpen className="mr-3 h-5 w-5 text-orange-500" />
                      <div>
                        <h3 className="text-lg font-medium">Form Retur Barang</h3>
                        <p className="text-sm text-gray-500">Isi detail barang yang akan dikembalikan ke supplier</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setShowForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Return form */}
                <form onSubmit={handleCheckoutSubmit} className="p-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Supplier</label>
                        <Select defaultValue="kimia-farma">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kimia-farma">PT Kimia Farma</SelectItem>
                            <SelectItem value="kalbe">PT Kalbe Farma</SelectItem>
                            <SelectItem value="novell">PT Novell Pharmaceutical</SelectItem>
                            <SelectItem value="bintang">PT Bintang Toedjoe</SelectItem>
                            <SelectItem value="phapros">PT Phapros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Nomor Referensi</label>
                        <Input placeholder="No. Faktur / Invoice terkait" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Alasan Retur</label>
                        <Select defaultValue="damaged">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih alasan retur" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="damaged">Produk rusak saat pengiriman</SelectItem>
                            <SelectItem value="expiry">Produk mendekati kedaluwarsa</SelectItem>
                            <SelectItem value="wrong">Kesalahan pengiriman produk</SelectItem>
                            <SelectItem value="packaging">Kemasan produk rusak</SelectItem>
                            <SelectItem value="batch">Batch mismatch dengan PO</SelectItem>
                            <SelectItem value="other">Alasan lain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Tanggal Retur</label>
                        <Input type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Lokasi</label>
                        <Select defaultValue="gudang">
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih lokasi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gudang">Gudang Utama</SelectItem>
                            <SelectItem value="apotek">Apotek</SelectItem>
                            <SelectItem value="cabang">Cabang Selatan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Catatan</label>
                        <textarea 
                          className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm"
                          placeholder="Catatan tambahan tentang retur ini"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-lg font-medium mb-4 flex items-center">
                      <FaClipboardList className="mr-2 h-5 w-5 text-orange-500" />
                      Daftar Produk
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Exp Date</TableHead>
                            <TableHead className="text-center">Jumlah</TableHead>
                            <TableHead className="text-right">Harga Satuan</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                            <TableHead>Alasan</TableHead>
                            <TableHead>Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedProducts.length > 0 ? (
                            selectedProducts.map((product, index) => (
                              <TableRow key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                <TableCell>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-xs text-gray-500">{product.detail}</div>
                                </TableCell>
                                <TableCell>{product.batch}</TableCell>
                                <TableCell>{product.expDate}</TableCell>
                                <TableCell className="text-center">{product.quantity}</TableCell>
                                <TableCell className="text-right">{formatRupiah(product.unitPrice)}</TableCell>
                                <TableCell className="text-right">{formatRupiah(product.unitPrice * product.quantity)}</TableCell>
                                <TableCell>
                                  <div className="max-w-xs truncate">{product.reason}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0">
                                      <FaEye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                      onClick={() => handleRemoveProduct(index)}
                                    >
                                      <FaTrash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8">
                                <div className="text-gray-500 mb-2">Belum ada produk ditambahkan</div>
                                <Button 
                                  onClick={() => setShowProductForm(true)}
                                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                                  size="sm"
                                >
                                  <FaPlus className="mr-2 h-3 w-3" />
                                  Tambah Produk
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                        {selectedProducts.length > 0 && (
                          <TableFooter className="bg-gray-50">
                            <TableRow>
                              <TableCell colSpan={5} className="text-right font-medium">Total</TableCell>
                              <TableCell className="text-right font-bold">{formatRupiah(calculateTotalValue())}</TableCell>
                              <TableCell colSpan={2}></TableCell>
                            </TableRow>
                          </TableFooter>
                        )}
                      </Table>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowProductForm(true)}
                      className="border-orange-200 hover:bg-orange-50"
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Tambah Produk Lain
                    </Button>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="border-orange-200 hover:bg-orange-50" onClick={() => setShowForm(false)}>
                        Batal
                      </Button>
                      <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" type="submit">
                        <FaSave className="mr-2 h-4 w-4" />
                        Simpan Retur
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Product selection dialog */}
            {showProductForm && (
              <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg flex items-center">
                      <FaBoxOpen className="mr-2 h-5 w-5 text-orange-500" />
                      Tambah Produk untuk Retur
                    </DialogTitle>
                    <DialogDescription>
                      Pilih produk yang akan dikembalikan ke supplier
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="mb-4">
                    <div className="relative">
                      <Input 
                        placeholder="Cari produk berdasarkan nama atau kode" 
                        className="pl-10"
                      />
                      <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Produk</label>
                      <Select onValueChange={handleProductSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih produk" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map(product => (
                            <SelectItem key={product.id} value={product.id}>{product.name} {product.detail}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Batch</label>
                      <Select onValueChange={handleBatchSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentProduct && mockProducts
                            .find(p => p.id === currentProduct.id)?.batches.map(batch => (
                              <SelectItem key={batch.id} value={batch.id}>{batch.id} (Exp: {batch.expDate})</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Jumlah</label>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Jumlah"
                        value={currentProduct?.quantity || 1}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Kondisi</label>
                      <Select 
                        defaultValue="damaged"
                        onValueChange={handleConditionSelect}
                        value={currentProduct?.condition || 'damaged'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kondisi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="damaged">Rusak</SelectItem>
                          <SelectItem value="expired">Kadaluarsa</SelectItem>
                          <SelectItem value="wrong">Salah Produk</SelectItem>
                          <SelectItem value="packaging">Kemasan Rusak</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Dokumentasi</label>
                      <div className="flex items-center gap-2">
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white w-full"
                          onClick={handleAddPhoto}
                        >
                          <FaCamera className="mr-2 h-4 w-4" />
                          {currentProduct?.hasPhoto ? 'Foto Ditambahkan ✓' : 'Ambil Foto'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Alasan Detail</label>
                    <textarea 
                      className="w-full h-20 border border-gray-300 rounded-md p-2 text-sm"
                      placeholder="Detail alasan pengembalian untuk produk ini"
                      value={currentProduct?.reason || ''}
                      onChange={(e) => handleReasonChange(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" className="border-orange-200 hover:bg-orange-50" onClick={() => setShowProductForm(false)}>
                      Batal
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                      onClick={handleAddProductToReturn}
                      disabled={!currentProduct}
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Tambah ke Retur
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
          
          <TabsContent value="check">
            {selectedReturn ? (
              <div className="bg-white rounded-lg shadow-md border-none mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaClipboardCheck className="mr-3 h-5 w-5 text-orange-500" />
                      <div>
                        <h3 className="text-lg font-medium">Pemeriksaan Retur</h3>
                        <p className="text-sm text-gray-500">Verifikasi barang yang akan dikembalikan ke supplier</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={handleCheckingCancelled}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-1">Nomor Retur:</span>
                        <span className="text-lg font-semibold">RTN20250330001</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-1">Supplier:</span>
                        <span className="text-lg font-semibold">PT Kimia Farma</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Tanggal Retur:</span>
                        <span className="text-lg font-semibold">30 Maret 2025</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-1">Alasan Retur:</span>
                        <span className="text-lg font-semibold">Produk rusak saat pengiriman</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Catatan:</span>
                        <span className="text-base">Beberapa produk mengalami kerusakan pada kemasan dan segel selama proses pengiriman.</span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-medium mb-4 border-b border-gray-200 pb-2">Daftar Produk</h4>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Exp Date</TableHead>
                        <TableHead className="text-center">Jumlah</TableHead>
                        <TableHead className="text-center">Kondisi</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inspectionProducts.map(product => (
                        <TableRow key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.detail}</div>
                          </TableCell>
                          <TableCell>{product.batch}</TableCell>
                          <TableCell>{product.expDate}</TableCell>
                          <TableCell className="text-center">{product.quantity}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {product.condition === 'damaged' ? 'Rusak' : 'Kadaluarsa'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {productDecisions[product.id] === 'approved' ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Disetujui
                              </Badge>
                            ) : productDecisions[product.id] === 'rejected' ? (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                Ditolak
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                Menunggu
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                onClick={() => handleViewInspectionProduct(product.id)}
                              >
                                <FaEye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 h-8 w-8 p-0">
                                <FaCamera className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-500 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0"
                                onClick={() => handleApproveProduct(product.id)}
                                disabled={productDecisions[product.id] === 'approved'}
                              >
                                <FaCheck className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                onClick={() => handleRejectProduct(product.id)}
                                disabled={productDecisions[product.id] === 'rejected'}
                              >
                                <FaTimes className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-orange-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-orange-800 mb-1">Informasi Penting</h5>
                          <p className="text-sm text-orange-700">
                            Pastikan untuk memeriksa kondisi fisik produk dengan teliti. Dokumentasikan kerusakan dengan foto jika diperlukan.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-3">Catatan Pemeriksaan</h5>
                      <textarea 
                        className="w-full h-20 border border-gray-300 rounded-md p-2 text-sm"
                        placeholder="Tambahkan catatan pemeriksaan di sini..."
                        value={inspectionNotes}
                        onChange={(e) => handleUpdateInspectionNotes(e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" className="border-orange-200 hover:bg-orange-50" onClick={handleCheckingCancelled}>
                        Batal
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                        onClick={handleCheckingSaved}
                        disabled={!allProductsInspected()}
                      >
                        <FaCheck className="mr-2 h-4 w-4" />
                        Setujui Retur
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="shadow-md border-none mb-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <FaClipboardCheck className="mr-2 h-5 w-5 text-orange-500" />
                    Pemeriksaan Retur
                  </CardTitle>
                  <CardDescription>
                    Verifikasi barang yang akan dikembalikan ke supplier
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {/* Filter and search */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Input placeholder="Cari berdasarkan nomor retur atau supplier" className="pl-10" />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      <div className="flex gap-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Menunggu Pemeriksaan</SelectItem>
                            <SelectItem value="checking">Sedang Diperiksa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* List of returns awaiting inspection */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>No. Retur</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-center">Jumlah Item</TableHead>
                            <TableHead className="text-right">Nilai Total</TableHead>
                            <TableHead>Alasan</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPendingReturns.map((returnItem) => (
                            <TableRow key={returnItem.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <TableCell className="font-medium">{new Date(returnItem.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</TableCell>
                              <TableCell>{returnItem.returnNumber}</TableCell>
                              <TableCell>{returnItem.supplier}</TableCell>
                              <TableCell className="text-center">{returnItem.totalItems}</TableCell>
                              <TableCell className="text-right">{formatRupiah(returnItem.totalValue)}</TableCell>
                              <TableCell>
                                <div className="max-w-xs truncate">{returnItem.reason}</div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant={returnItem.status === "pending" ? "outline" : "secondary"} className={returnItem.status === "pending" ? "text-orange-500 border-orange-200 bg-orange-50" : ""}>
                                  {returnItem.status === "pending" ? "Menunggu" : "Checking"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => setSelectedReturn(returnItem.id)}
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    onClick={() => toggleActionMenu(returnItem.id)}
                                  >
                                    <FaEllipsisH className="h-4 w-4" />
                                  </Button>
                                  {actionMenuOpen[returnItem.id] && (
                                    <div className="absolute bg-white shadow-md p-2 w-40 right-0 mt-2 z-10">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 w-full justify-start"
                                        onClick={() => handleQuickAction(returnItem.id, 'check')}
                                      >
                                        <FaClipboardCheck className="mr-2 h-4 w-4" />
                                        Periksa
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-green-500 hover:text-green-700 hover:bg-green-50 w-full justify-start"
                                        onClick={() => handleQuickAction(returnItem.id, 'approve')}
                                      >
                                        <FaCheckCircle className="mr-2 h-4 w-4" />
                                        Setujui
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full justify-start"
                                        onClick={() => handleQuickAction(returnItem.id, 'reject')}
                                      >
                                        <FaTimes className="mr-2 h-4 w-4" />
                                        Tolak
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 w-full justify-start"
                                        onClick={() => handleQuickAction(returnItem.id, 'print')}
                                      >
                                        <FaPrint className="mr-2 h-4 w-4" />
                                        Cetak Dokumen
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {selectedHistory ? (
              <div className="bg-white rounded-lg shadow-md border-none mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaHistory className="mr-3 h-5 w-5 text-orange-500" />
                      <div>
                        <h3 className="text-lg font-medium">Detail Riwayat Retur</h3>
                        <p className="text-sm text-gray-500">Informasi lengkap retur barang</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={handleHistoryBack}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Kembali
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Gradient card with detail information */}
                <div className="relative p-6 border border-gray-100 rounded-lg overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 opacity-10 blur-lg"></div>
                  <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 rounded-full bg-gradient-to-tr from-red-400 to-orange-300 opacity-10 blur-lg"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-1">Nomor Retur:</span>
                        <span className="text-lg font-semibold">RTN20250325001</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-1">Supplier:</span>
                        <span className="text-lg font-semibold">PT Kimia Farma</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Tanggal Retur:</span>
                        <span className="text-lg font-semibold">25 Maret 2025</span>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-1">Alasan Retur:</span>
                        <span className="text-lg font-semibold">Produk rusak saat pengiriman</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500 block mb-1">Status Retur:</span>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Disetujui
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">Status Pengembalian Dana:</span>
                        <div className="flex items-center mt-1">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Sudah Dikembalikan
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-lg font-medium mb-4 border-b border-gray-200 pb-2 flex items-center">
                      <FaClipboardList className="mr-2 text-orange-500" />
                      Daftar Produk
                    </h4>
                    
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                        <TableRow>
                          <TableHead>Produk</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead>Exp Date</TableHead>
                          <TableHead className="text-center">Jumlah</TableHead>
                          <TableHead className="text-right">Harga Satuan</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Paracetamol 500mg</div>
                            <div className="text-xs text-gray-500">Tab 100's</div>
                          </TableCell>
                          <TableCell>BN012345</TableCell>
                          <TableCell>2025-12-31</TableCell>
                          <TableCell className="text-center">3</TableCell>
                          <TableCell className="text-right">{formatRupiah(400000)}</TableCell>
                          <TableCell className="text-right">{formatRupiah(1200000)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Disetujui
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <div className="font-medium">Amoxicillin 500mg</div>
                            <div className="text-xs text-gray-500">Cap 100's</div>
                          </TableCell>
                          <TableCell>BN023456</TableCell>
                          <TableCell>2025-10-15</TableCell>
                          <TableCell className="text-center">2</TableCell>
                          <TableCell className="text-right">{formatRupiah(525000)}</TableCell>
                          <TableCell className="text-right">{formatRupiah(1050000)}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Disetujui
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableFooter className="bg-gray-50">
                        <TableRow>
                          <TableCell colSpan={5} className="text-right font-medium">Total</TableCell>
                          <TableCell className="text-right font-bold">{formatRupiah(2250000)}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                    
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="flex items-start">
                        <FaInfoCircle className="text-orange-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-orange-800 mb-1">Catatan Approval</h5>
                          <p className="text-sm text-orange-700">
                            Produk telah diperiksa dan retur disetujui. Pengembalian dana telah diproses pada tanggal 27 Maret 2025.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        className="border-orange-200 hover:bg-orange-50"
                        onClick={() => handlePrintInvoice(selectedHistory)}
                      >
                        <FaPrint className="mr-2 h-4 w-4" />
                        Cetak Dokumen
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                      >
                        <FaDownload className="mr-2 h-4 w-4" />
                        Ekspor ke PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="shadow-md border-none mb-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <FaHistory className="mr-2 h-5 w-5 text-orange-500" />
                    Riwayat Retur
                  </CardTitle>
                  <CardDescription>
                    Catatan historis pengembalian barang ke supplier
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {/* Filter dan pencarian */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Input placeholder="Cari berdasarkan nomor retur atau supplier" className="pl-10" />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                          <Input type="date" className="pl-10 w-[180px]" />
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="approved">Disetujui</SelectItem>
                            <SelectItem value="partial">Sebagian</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" className="border-orange-200 hover:bg-orange-50 flex items-center gap-1">
                          <FaFilter className="h-4 w-4" />
                          <span>Alasan</span>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Daftar riwayat retur */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>No. Retur</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-center">Item</TableHead>
                            <TableHead className="text-right">Nilai Total</TableHead>
                            <TableHead>Alasan</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Refund</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockHistoryReturns.map((returnItem) => (
                            <TableRow key={returnItem.id}>
                              <TableCell>{returnItem.date}</TableCell>
                              <TableCell>{returnItem.returnNumber}</TableCell>
                              <TableCell>{returnItem.supplier}</TableCell>
                              <TableCell className="text-center">{returnItem.totalItems}</TableCell>
                              <TableCell className="text-right">{formatRupiah(returnItem.totalValue)}</TableCell>
                              <TableCell>
                                <div className="max-w-xs truncate">{returnItem.reason}</div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={
                                  returnItem.status === "approved" 
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : returnItem.status === "rejected"
                                      ? "bg-red-100 text-red-800 hover:bg-red-200"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                }>
                                  {returnItem.status === "approved" 
                                    ? "Disetujui" 
                                    : returnItem.status === "rejected"
                                      ? "Ditolak"
                                      : "Sebagian"
                                  }
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className={
                                  returnItem.refundStatus === "refunded" 
                                    ? "border-green-200 text-green-800 bg-green-50"
                                    : returnItem.refundStatus === "partial"
                                      ? "border-amber-200 text-amber-800 bg-amber-50"
                                      : "border-gray-200 text-gray-800 bg-gray-50"
                                }>
                                  {returnItem.refundStatus === "refunded" 
                                    ? "Dikembalikan" 
                                    : returnItem.refundStatus === "partial"
                                      ? "Sebagian"
                                      : "Belum"
                                  }
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => setSelectedHistory(returnItem.id)}
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
                                    onClick={() => handlePrintInvoice(returnItem.id)}
                                  >
                                    <FaPrint className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Modal untuk tampilan PDF faktur retur */}
            {showInvoicePDF && invoiceData && (
              <Dialog open={showInvoicePDF} onOpenChange={setShowInvoicePDF}>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg flex items-center">
                      <FaFileInvoice className="mr-2 h-5 w-5 text-orange-500" />
                      Dokumen Retur #{invoiceData.id}
                    </DialogTitle>
                    <DialogDescription>
                      Detail retur untuk {invoiceData.supplier}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="p-4 bg-white border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-1">Farmanesia</h3>
                        <p className="text-sm text-gray-500">Jl. Pharmacy No. 123</p>
                        <p className="text-sm text-gray-500">Jakarta, Indonesia</p>
                        <p className="text-sm text-gray-500">Tel: (021) 123-4567</p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-xl font-bold mb-1 text-orange-600">FORMULIR RETUR</h4>
                        <p className="text-sm text-gray-500">No: {invoiceData.returnNumber}</p>
                        <p className="text-sm text-gray-500">Tanggal: {new Date(invoiceData.date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Supplier:</h5>
                        <p className="text-sm">{invoiceData.supplier}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Alasan Retur:</h5>
                        <p className="text-sm">{invoiceData.reason}</p>
                      </div>
                    </div>
                    
                    <Table>
                      <TableHeader className="bg-orange-50">
                        <TableRow>
                          <TableHead>No.</TableHead>
                          <TableHead>Deskripsi</TableHead>
                          <TableHead className="text-center">Jumlah</TableHead>
                          <TableHead className="text-right">Harga Satuan</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>1</TableCell>
                          <TableCell>
                            <div className="font-medium">Paracetamol 500mg Tab 100's</div>
                            <div className="text-xs text-gray-500">Batch: BN012345</div>
                          </TableCell>
                          <TableCell className="text-center">3</TableCell>
                          <TableCell className="text-right">{formatRupiah(400000)}</TableCell>
                          <TableCell className="text-right">{formatRupiah(1200000)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>2</TableCell>
                          <TableCell>
                            <div className="font-medium">Amoxicillin 500mg Cap 100's</div>
                            <div className="text-xs text-gray-500">Batch: BN023456</div>
                          </TableCell>
                          <TableCell className="text-center">2</TableCell>
                          <TableCell className="text-right">{formatRupiah(525000)}</TableCell>
                          <TableCell className="text-right">{formatRupiah(1050000)}</TableCell>
                        </TableRow>
                      </TableBody>
                      <TableFooter className="bg-gray-50">
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-medium">Total</TableCell>
                          <TableCell className="text-right font-bold">{formatRupiah(invoiceData.totalValue)}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                    
                    <div className="grid grid-cols-3 gap-6 mt-8">
                      <div className="border-t border-gray-200 pt-4 text-center">
                        <p className="text-sm text-gray-600 mb-12">Dibuat Oleh</p>
                        <p className="font-medium">Admin Farmasi</p>
                      </div>
                      <div className="border-t border-gray-200 pt-4 text-center">
                        <p className="text-sm text-gray-600 mb-12">Diperiksa Oleh</p>
                        <p className="font-medium">Supervisor</p>
                      </div>
                      <div className="border-t border-gray-200 pt-4 text-center">
                        <p className="text-sm text-gray-600 mb-12">Disetujui Oleh</p>
                        <p className="font-medium">Manager Apotek</p>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowInvoicePDF(false)}>
                      Tutup
                    </Button>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <FaPrint className="mr-2 h-4 w-4" />
                      Cetak
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
        </Tabs>
      </div>
        
      {/* Product inspection dialog */}
      {showProductInspection && inspectedProduct && (
        <Dialog open={showProductInspection} onOpenChange={setShowProductInspection}>
          <DialogContent className="max-w-4xl overflow-hidden">
            <DialogHeader>
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 -mx-6 -mt-6 px-6 py-4 rounded-t-lg flex items-center relative overflow-hidden">
                {/* Decorative pill shapes */}
                <div className="absolute top-1/2 right-10 transform -translate-y-1/2 w-20 h-10 bg-white opacity-10 rounded-full blur-sm"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full blur-xl -ml-8 -mb-8"></div>
                <FaMicroscope className="mr-2 h-5 w-5 text-white relative z-10" />
                <DialogTitle className="text-lg text-white relative z-10">Inspeksi Detail Produk</DialogTitle>
              </div>
              <DialogDescription className="pt-4">
                Periksa detail produk untuk verifikasi retur
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative p-6 border border-gray-100 rounded-lg overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 opacity-20 blur-lg"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 rounded-full bg-gradient-to-tr from-red-400 to-orange-300 opacity-20 blur-lg"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
                <div>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-t-lg relative overflow-hidden">
                    {/* Decorative pill shape */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-4 bg-white opacity-10 rounded-full blur-sm"></div>
                    <h3 className="font-medium relative z-10">Informasi Produk</h3>
                  </div>
                  <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-white shadow-sm">
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500 block mb-1">Nama Produk:</span>
                      <span className="text-lg font-semibold">{inspectedProduct.name}</span>
                      <span className="text-sm text-gray-500 ml-2">{inspectedProduct.detail}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500 block mb-1">Nomor Batch:</span>
                      <span className="text-lg font-medium">{inspectedProduct.batch}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500 block mb-1">Tanggal Kadaluarsa:</span>
                      <span className="text-lg font-medium">{inspectedProduct.expDate}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500 block mb-1">Jumlah:</span>
                      <span className="text-lg font-medium">{inspectedProduct.quantity} unit</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Nilai:</span>
                      <span className="text-lg font-medium">{formatRupiah(inspectedProduct.subtotal)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-t-lg relative overflow-hidden">
                    {/* Decorative pill shape */}
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-4 bg-white opacity-10 rounded-full blur-sm"></div>
                    <h3 className="font-medium relative z-10">Detail Kondisi</h3>
                  </div>
                  <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-white shadow-sm">
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500 block mb-1">Kondisi:</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-sm">
                        {inspectedProduct.condition === 'damaged' ? 'Rusak' : 'Kadaluarsa'}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-500 block mb-1">Alasan Retur:</span>
                      <p className="text-base">{inspectedProduct.reason}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-1">Status Inspeksi:</span>
                      {productDecisions[inspectedProduct.id] === 'approved' ? (
                        <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
                      ) : productDecisions[inspectedProduct.id] === 'rejected' ? (
                        <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Menunggu Keputusan
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-t-lg relative overflow-hidden">
                  {/* Decorative pill shape */}
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-4 bg-white opacity-10 rounded-full blur-sm"></div>
                  <h3 className="font-medium relative z-10">Bukti Visual</h3>
                </div>
                <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-white shadow-sm">
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FaCamera className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-gray-500 mb-3">Belum ada foto bukti yang diunggah</p>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      <FaCamera className="mr-2 h-4 w-4" />
                      Ambil Foto
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 rounded-t-lg relative overflow-hidden">
                  {/* Decorative pill shape */}
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-4 bg-white opacity-10 rounded-full blur-sm"></div>
                  <h3 className="font-medium relative z-10">Catatan Inspeksi</h3>
                </div>
                <div className="border border-t-0 border-gray-200 rounded-b-lg p-4 bg-white shadow-sm">
                  <textarea 
                    className="w-full h-24 border border-gray-300 rounded-md p-2 text-sm"
                    placeholder="Tambahkan catatan pemeriksaan produk ini..."
                  ></textarea>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FaInfoCircle className="text-orange-500 h-5 w-5 mr-2" />
                  <span className="text-sm text-gray-600">Mohon verifikasi dengan cermat sebelum mengambil keputusan</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => {
                      handleRejectProduct(inspectedProduct.id);
                      setShowProductInspection(false);
                    }}
                  >
                    <FaTimes className="mr-2 h-4 w-4" />
                    Tolak Produk
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    onClick={() => {
                      handleApproveProduct(inspectedProduct.id);
                      setShowProductInspection(false);
                    }}
                  >
                    <FaCheck className="mr-2 h-4 w-4" />
                    Setujui Produk
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </InventoryPageLayout>
  );
};

export default ReturnsPage;
