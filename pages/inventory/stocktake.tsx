import React, { useState, useRef, useCallback } from "react";
import Head from "next/head";
import { NextPage } from "next";
import InventoryLayout from "@/components/layouts/inventory-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  mockProducts, 
  Product, 
  mockStocks 
} from "@/modules/inventory/types";
import { 
  FaClipboardCheck, 
  FaSearch, 
  FaCalendarAlt, 
  FaUserAlt, 
  FaTrash, 
  FaBarcode,
  FaSave,
  FaFile,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaHistory,
  FaFileExport,
  FaFilter,
  FaBoxes,
  FaExchangeAlt,
  FaFileAlt,
  FaPlus,
  FaBoxOpen,
  FaCheck,
  FaMinus,
  FaDownload,
  FaPrint,
  FaEye,
  FaInfoCircle,
  FaFilePdf,
  FaPaperclip,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";
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
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Interface for stocktake item
interface StocktakeItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  systemStock: number;
  physicalStock: number;
  variance: number;
  hasVariance: boolean;
  reason?: string; // Alasan selisih
  location?: string; // Lokasi produk
  category?: string; // Kategori produk
  imageUrl?: string; // URL gambar produk
  batchNumber?: string; // Nomor batch
  expiryDate?: Date; // Tanggal kadaluarsa
}

// Interface untuk riwayat stock opname
interface StocktakeHistory {
  id: string;
  date: Date;
  location: string;
  stocktakeBy: string;
  approvedBy: string;
  totalItems: number;
  itemsWithVariance: number;
  status: 'completed' | 'pending' | 'cancelled';
  attachmentUrl?: string;
  items?: StocktakeHistoryItem[];
}

// Interface untuk item dalam riwayat stock opname
interface StocktakeHistoryItem {
  id: string;
  productName: string;
  sku: string;
  unit: string;
  systemStock: number;
  physicalStock: number;
  variance: number;
  hasVariance: boolean;
  reason?: string;
  batchNumber?: string;
  expiryDate?: Date;
}

// Locations for stocktaking
const stockLocations = [
  { id: "all", name: "Semua Lokasi" },
  { id: "display", name: "Rak Display" },
  { id: "warehouse", name: "Gudang Utama" },
  { id: "pharmacy", name: "Area Farmasi" }
];

// Alasan selisih stok
const stockVarianceReasons = [
  { id: "damage", name: "Rusak/Hancur" },
  { id: "expired", name: "Kadaluarsa" },
  { id: "theft", name: "Kehilangan/Pencurian" },
  { id: "admin_error", name: "Kesalahan Administrasi" },
  { id: "not_received", name: "Belum Diterima" },
  { id: "return", name: "Retur ke Supplier" },
  { id: "other", name: "Lainnya" },
];

// Sample data untuk Stock Opname
const dummyStocktakeItems: StocktakeItem[] = [
  {
    id: "st1",
    productId: "1",
    productName: "Paracetamol 500mg",
    sku: "MED001",
    unit: "Tablet",
    systemStock: 120,
    physicalStock: 115,
    variance: -5,
    hasVariance: true,
    reason: "damage",
    location: "display",
    category: "Obat Bebas",
    imageUrl: "/images/products/paracetamol.jpg",
    batchNumber: "BT12345",
    expiryDate: new Date('2024-07-15')
  },
  {
    id: "st2",
    productId: "2",
    productName: "Amoxicillin 500mg",
    sku: "MED002",
    unit: "Kapsul",
    systemStock: 85,
    physicalStock: 85,
    variance: 0,
    hasVariance: false,
    location: "pharmacy",
    category: "Obat Keras",
    batchNumber: "BT67890",
    expiryDate: new Date('2024-06-10')
  },
  {
    id: "st3",
    productId: "3",
    productName: "Vitamin C 500mg",
    sku: "VIT001",
    unit: "Tablet",
    systemStock: 200,
    physicalStock: 198,
    variance: -2,
    hasVariance: true,
    reason: "damage",
    location: "display",
    category: "Suplemen",
    batchNumber: "BT54321",
    expiryDate: new Date('2024-09-20')
  },
  {
    id: "st4",
    productId: "4",
    productName: "Omeprazole 20mg",
    sku: "MED003",
    unit: "Kapsul",
    systemStock: 60,
    physicalStock: 63,
    variance: 3,
    hasVariance: true,
    reason: "admin_error",
    location: "warehouse",
    category: "Obat Keras",
    batchNumber: "BT98765",
    expiryDate: new Date('2024-08-05')
  },
  {
    id: "st5",
    productId: "5",
    productName: "Cetirizine 10mg",
    sku: "MED004",
    unit: "Tablet",
    systemStock: 75,
    physicalStock: 72,
    variance: -3,
    hasVariance: true,
    reason: "theft",
    location: "pharmacy",
    category: "Obat Bebas Terbatas",
    batchNumber: "BT24680",
    expiryDate: new Date('2024-10-12')
  }
];

// Dummy data untuk riwayat stock opname
const stocktakeHistoryData: StocktakeHistory[] = [
  {
    id: 'SO-2025-001',
    date: new Date('2025-03-25'),
    location: 'Gudang Utama',
    stocktakeBy: 'Annisa Wijaya',
    approvedBy: 'dr. Budi Santoso, Apt.',
    totalItems: 120,
    itemsWithVariance: 8,
    status: 'completed',
    attachmentUrl: '/dummy/stock-opname-2025-001.pdf',
    items: [
      {
        id: '1',
        productName: 'Paracetamol 500mg',
        sku: 'PARA-001',
        unit: 'tablet',
        systemStock: 200,
        physicalStock: 195,
        variance: -5,
        hasVariance: true,
        reason: 'damaged',
        batchNumber: 'B12345'
      },
      {
        id: '2',
        productName: 'Amoxicillin 500mg',
        sku: 'AMOX-001',
        unit: 'kapsul',
        systemStock: 150,
        physicalStock: 150,
        variance: 0,
        hasVariance: false,
        batchNumber: 'B54321'
      },
      {
        id: '3',
        productName: 'Vitamin C 1000mg',
        sku: 'VITC-001',
        unit: 'tablet',
        systemStock: 80,
        physicalStock: 78,
        variance: -2,
        hasVariance: true,
        reason: 'damaged',
        batchNumber: 'B98765'
      },
      {
        id: '4',
        productName: 'Loratadine 10mg',
        sku: 'LORA-001',
        unit: 'tablet',
        systemStock: 100,
        physicalStock: 102,
        variance: 2,
        hasVariance: true,
        reason: 'miscounted',
        batchNumber: 'B24680'
      },
      {
        id: '5',
        productName: 'Cetirizine 10mg',
        sku: 'CETI-001',
        unit: 'tablet',
        systemStock: 120,
        physicalStock: 120,
        variance: 0,
        hasVariance: false,
        batchNumber: 'B13579'
      }
    ]
  },
  {
    id: 'SO-2025-002',
    date: new Date('2025-03-10'),
    location: 'Rak Display',
    stocktakeBy: 'Rudi Hermawan',
    approvedBy: 'dr. Budi Santoso, Apt.',
    totalItems: 68,
    itemsWithVariance: 5,
    status: 'completed',
    attachmentUrl: '/dummy/stock-opname-2025-002.pdf',
    items: [
      {
        id: '1',
        productName: 'Promag Tablet',
        sku: 'PROM-001',
        unit: 'tablet',
        systemStock: 150,
        physicalStock: 148,
        variance: -2,
        hasVariance: true,
        reason: 'stolen',
        batchNumber: 'B13579'
      },
      {
        id: '2',
        productName: 'Panadol Biru',
        sku: 'PANA-001',
        unit: 'strip',
        systemStock: 50,
        physicalStock: 47,
        variance: -3,
        hasVariance: true,
        reason: 'damaged',
        batchNumber: 'B24680'
      },
      {
        id: '3',
        productName: 'Betadine Solution',
        sku: 'BETA-001',
        unit: 'botol',
        systemStock: 30,
        physicalStock: 30,
        variance: 0,
        hasVariance: false,
        batchNumber: 'B98765'
      }
    ]
  },
];

const StocktakePage: NextPage = () => {
  const { toast } = useToast();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<string>("new");
  
  // State for stocktake date and location
  const [stocktakeDate, setStocktakeDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [stocktakeBy, setStocktakeBy] = useState("");
  const [stocktakeLocation, setStocktakeLocation] = useState("all");
  
  // Stocktake items state - initialized with dummy data
  const [stocktakeItems, setStocktakeItems] = useState<StocktakeItem[]>(dummyStocktakeItems);
  const [showOnlyVariance, setShowOnlyVariance] = useState(false);
  
  // Product search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Selected product for physical count
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSystemStock, setSelectedSystemStock] = useState<number>(0);
  const [physicalStock, setPhysicalStock] = useState<number>(0);
  
  // File attachment state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle file attachment
  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: "Format File Tidak Didukung",
          description: "Hanya file PDF yang diperbolehkan sebagai lampiran",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file tidak boleh melebihi 5MB",
          variant: "destructive"
        });
        return;
      }
      setAttachedFile(file);
      toast({
        title: "File Berhasil Dilampirkan",
        description: `${file.name} ditambahkan sebagai lampiran`
      });
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove attached file
  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Filter for display
  const filteredItems = showOnlyVariance 
    ? stocktakeItems.filter(item => item.hasVariance) 
    : stocktakeItems;
  
  // Handle product search
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Filter products based on search query
    const results = mockProducts.filter(
      product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };
  
  // Handle selecting a product
  const handleSelectProduct = (product: Product) => {
    // Check if product is already in stocktake items
    const existingItem = stocktakeItems.find(item => item.productId === product.id);
    if (existingItem) {
      toast({
        title: "Produk Sudah Ditambahkan",
        description: "Produk ini sudah ada dalam daftar Stock Opname.",
        variant: "destructive"
      });
      setSearchResults([]);
      setSearchQuery("");
      return;
    }
    
    setSelectedProduct(product);
    
    // Find current stock for this product
    const stockInfo = mockStocks.find(s => s.productId === product.id);
    const systemStock = stockInfo ? stockInfo.currentStock : 0;
    
    setSelectedSystemStock(systemStock);
    setPhysicalStock(systemStock); // Default physical stock to system stock
    setSearchResults([]);
    setSearchQuery("");
  };
  
  // Add product to stocktake items
  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    const variance = physicalStock - selectedSystemStock;
    const hasVariance = variance !== 0;
    
    const newItem: StocktakeItem = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku || 'N/A', // Memberikan nilai default jika SKU undefined
      unit: selectedProduct.unit,
      systemStock: selectedSystemStock,
      physicalStock,
      variance,
      hasVariance,
    };
    
    setStocktakeItems([...stocktakeItems, newItem]);
    
    // Reset form
    setSelectedProduct(null);
    setSelectedSystemStock(0);
    setPhysicalStock(0);
    
    toast({
      title: "Produk Ditambahkan",
      description: `${selectedProduct.name} telah ditambahkan ke Stock Opname.`,
    });
  };
  
  // Remove item from stocktake
  const handleRemoveItem = (itemId: string) => {
    setStocktakeItems(stocktakeItems.filter(item => item.id !== itemId));
    toast({
      title: "Produk Dihapus",
      description: "Produk telah dihapus dari Stock Opname.",
    });
  };

  // Update physical stock and reason
  const handleUpdateItem = (itemId: string, physicalStock: number, reason?: string) => {
    setStocktakeItems(
      stocktakeItems.map(item => {
        if (item.id === itemId) {
          const variance = physicalStock - item.systemStock;
          return {
            ...item,
            physicalStock,
            variance,
            hasVariance: variance !== 0,
            reason: variance !== 0 ? reason : undefined
          };
        }
        return item;
      })
    );
  };
  
  // Confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [managerName, setManagerName] = useState("");
  const [staffAcknowledgement, setStaffAcknowledgement] = useState(false);
  const [managerAcknowledgement, setManagerAcknowledgement] = useState(false);
  
  // State untuk dialog detail stock opname
  const [selectedHistory, setSelectedHistory] = useState<StocktakeHistory | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // Function to handle PDF report generation
  const generatePDF = (history: StocktakeHistory) => {
    // Create a new PDF document in landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add company header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('FARMANESIA', 14, 15);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Laporan Stock Opname', 14, 22);
    
    // Add stock opname information
    doc.setFontSize(10);
    doc.text(`ID: ${history.id}`, 14, 30);
    doc.text(`Tanggal: ${new Date(history.date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}`, 14, 35);
    doc.text(`Lokasi: ${history.location}`, 14, 40);
    doc.text(`Dilakukan oleh: ${history.stocktakeBy}`, 14, 45);
    doc.text(`Disetujui oleh: ${history.approvedBy}`, 14, 50);
    doc.text(`Status: ${history.status === 'completed' ? 'Selesai' : 
      history.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}`, 14, 55);
    
    // Add summary information
    doc.text(`Total Produk: ${history.totalItems}`, 120, 30);
    doc.text(`Produk Selisih: ${history.itemsWithVariance}`, 120, 35);
    doc.text(`Produk Sesuai: ${history.totalItems - history.itemsWithVariance}`, 120, 40);
    doc.text(`Persentase Selisih: ${((history.itemsWithVariance / history.totalItems) * 100).toFixed(1)}%`, 120, 45);
    
    // Add products table
    if (history.items && history.items.length > 0) {
      // @ts-ignore
      doc.autoTable({
        startY: 65,
        head: [['No', 'Produk', 'SKU', 'Batch', 'Stok Sistem', 'Stok Fisik', 'Selisih', 'Alasan']],
        body: history.items.map((item, index) => [
          index + 1,
          item.productName,
          item.sku,
          item.batchNumber || 'N/A',
          `${item.systemStock} ${item.unit}`,
          `${item.physicalStock} ${item.unit}`,
          `${item.variance > 0 ? `+${item.variance}` : item.variance} ${item.unit}`,
          item.hasVariance ? 
            (item.reason === 'damaged' ? 'Barang Rusak' : 
             item.reason === 'expired' ? 'Kadaluarsa' :
             item.reason === 'miscounted' ? 'Kesalahan Hitung' :
             item.reason === 'missing' ? 'Barang Hilang' :
             item.reason === 'stolen' ? 'Barang Dicuri' :
             item.reason === 'admin' ? 'Kesalahan Admin' : '-') : '-'
        ]),
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [255, 243, 224] },
        rowPageBreak: 'auto',
        bodyStyles: { cellPadding: 3 },
        styles: { fontSize: 8 }
      });
    }
    
    // Add footer
    // @ts-ignore - jsPDF's typings are incomplete, but getNumberOfPages exists at runtime
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Halaman ${i} dari ${pageCount} - Dicetak pada: ${new Date().toLocaleString('id-ID')}`,
        doc.internal.pageSize.getWidth() / 2, 
        doc.internal.pageSize.getHeight() - 10, 
        { align: 'center' }
      );
    }
    
    // Save the PDF with filename
    doc.save(`stock-opname-${history.id}.pdf`);
  };

  // Function to handle printing using react-to-print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Stock Opname - ${selectedHistory?.id || 'Laporan'}`,
    onAfterPrint: () => {
      toast({
        title: "Dokumen dicetak",
        description: "Laporan stock opname berhasil dicetak",
      });
    },
  });

  // Handle final submission
  const handleSubmitStocktake = () => {
    if (!staffAcknowledgement || !managerAcknowledgement || !managerName) {
      toast({
        title: "Persetujuan Diperlukan",
        description: "Semua persetujuan dan tanda tangan diperlukan untuk menyimpan Stock Opname.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would save the data to your backend
    toast({
      title: "Stock Opname Tersimpan",
      description: `Stock Opname tanggal ${stocktakeDate} telah berhasil disimpan.`
    });
    
    // Reset confirmation dialog
    setShowConfirmation(false);
    setManagerName("");
    setStaffAcknowledgement(false);
    setManagerAcknowledgement(false);
  };
  
  // Calculate statistics
  const totalItems = stocktakeItems.length;
  const itemsWithVariance = stocktakeItems.filter(item => item.hasVariance).length;
  const totalVarianceValue = stocktakeItems.reduce((sum, item) => {
    // This is just a placeholder. In a real app, we would have the item price
    // and calculate the actual value of the variance
    return sum + Math.abs(item.variance);
  }, 0);
  
  const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);
  const [savedStocktakeId, setSavedStocktakeId] = useState<string>("");
  const stocktakeTableRef = useRef<HTMLDivElement>(null);

  const handlePrintStocktakeTable = useReactToPrint({
    content: () => stocktakeTableRef.current,
    documentTitle: `Stock Opname - ${stocktakeDate}`,
    onAfterPrint: () => {
      toast({
        title: "Dokumen dicetak",
        description: "Daftar barang stock opname berhasil dicetak",
      });
    },
  });

  const handleSaveStocktake = () => {
    setShowSaveConfirmation(true);
  };

  const confirmSaveStocktake = useCallback(() => {
    setShowSaveConfirmation(false);
    
    const newStocktakeId = `SO-${new Date().getFullYear()}-${String(stocktakeHistoryData.length + 1).padStart(3, '0')}`;
    
    setTimeout(() => {
      setSavedStocktakeId(newStocktakeId);
      setShowSaveSuccess(true);
      
      toast({
        title: "Stock Opname Tersimpan",
        description: `Stock Opname dengan ID ${newStocktakeId} berhasil disimpan.`,
      });
    }, 1000);
  }, [stocktakeHistoryData.length]);

  const handlePrintAfterSave = useCallback(() => {
    handlePrintStocktakeTable();
    setShowSaveSuccess(false);
  }, [handlePrintStocktakeTable]);

  const handleViewDetailsAfterSave = useCallback(() => {
    setShowSaveSuccess(false);
    setActiveTab("history");
  }, []);

  const handleCloseSuccessDialog = useCallback(() => {
    setShowSaveSuccess(false);
  }, []);

  return (
    <InventoryLayout>
      <Head>
        <title>Stock Opname | Farmanesia</title>
      </Head>
      
      <div className="max-w-7xl mx-auto">
        {/* Decorative header with gradient - matching inventory page */}
        <div className="relative rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-4 mb-4 shadow-md overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4 backdrop-blur-sm">
              <FaClipboardCheck className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Stock Opname</h1>
              <p className="text-sm text-white/80">Hitung dan verifikasi stok fisik dengan stok di sistem</p>
            </div>
          </div>
        </div>

        {/* Tabs for switching between new stock opname and history */}
        <Tabs 
          defaultValue="new" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-6"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="new" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <FaClipboardCheck className="mr-2 h-4 w-4" />
              Stock Opname Baru
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
              <FaHistory className="mr-2 h-4 w-4" />
              Riwayat Stock Opname
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-4">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-base font-medium flex items-center">
                    <FaBoxOpen className="mr-2 h-4 w-4 text-orange-500" />
                    Total Produk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <p className="text-xs text-muted-foreground">Produk dalam Stock Opname</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-base font-medium flex items-center">
                    <FaExchangeAlt className="mr-2 h-4 w-4 text-orange-500" />
                    Selisih Produk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{itemsWithVariance}</div>
                  <p className="text-xs text-muted-foreground">Produk dengan selisih stok</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-base font-medium flex items-center">
                    <FaBoxes className="mr-2 h-4 w-4 text-orange-500" />
                    Total Selisih
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalVarianceValue}</div>
                  <p className="text-xs text-muted-foreground">Total unit dengan selisih</p>
                </CardContent>
              </Card>
            </div>
        
            {/* Stock Opname Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="md:col-span-1 overflow-hidden border-0 shadow-sm">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FaFileAlt className="mr-2 h-4 w-4 text-orange-500" />
                    Detail Stock Opname
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stocktake-date">Tanggal Stock Opname</Label>
                    <Input
                      id="stocktake-date"
                      type="date"
                      value={stocktakeDate}
                      onChange={(e) => setStocktakeDate(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stocktake-by">Stock Opname Oleh</Label>
                    <Input
                      id="stocktake-by"
                      placeholder="Nama Petugas"
                      value={stocktakeBy}
                      onChange={(e) => setStocktakeBy(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stocktake-location">Lokasi</Label>
                    <Select
                      value={stocktakeLocation}
                      onValueChange={setStocktakeLocation}
                    >
                      <SelectTrigger id="stocktake-location">
                        <SelectValue placeholder="Pilih Lokasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Lokasi</SelectItem>
                        <SelectItem value="mainstore">Gudang Utama</SelectItem>
                        <SelectItem value="pharmacy">Apotek</SelectItem>
                        <SelectItem value="warehouse">Gudang Cadangan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Tambahkan input file attachment */}
                  <div className="space-y-2 mt-6">
                    <Label className="flex items-center">
                      <FaPaperclip className="h-4 w-4 mr-2 text-orange-500" />
                      Lampiran Dokumen
                    </Label>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept="application/pdf"
                      onChange={handleFileAttachment}
                      className="hidden"
                    />
                    {attachedFile ? (
                      <div className="flex items-center justify-between p-2 rounded-md bg-orange-50 border border-orange-100">
                        <div className="flex items-center">
                          <FaFilePdf className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm truncate max-w-[140px]">{attachedFile.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                          onClick={removeAttachedFile}
                        >
                          <FaTimes className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={triggerFileUpload}
                        className="w-full text-sm border-dashed flex items-center justify-center border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <FaFilePdf className="mr-2 h-4 w-4" />
                        Lampirkan Dokumen PDF
                      </Button>
                    )}
                    <p className="text-xs text-gray-500">Format file yang didukung: PDF (Maks 5MB)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2 overflow-hidden border-0 shadow-sm">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FaBoxOpen className="mr-2 h-4 w-4 text-orange-500" />
                    Tambah Produk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Cari produk berdasarkan nama atau SKU"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        onClick={handleSearch}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <FaSearch className="mr-2 h-4 w-4" />
                        Cari
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-50"
                      >
                        <FaBarcode className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                    </div>
                    
                    {/* Search Results */}
                    {isSearching ? (
                      <div className="text-center py-4">Loading...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nama Produk</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Unit</TableHead>
                              <TableHead className="w-[100px]">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {searchResults.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>{product.unit}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSelectProduct(product)}
                                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                                  >
                                    <FaPlus className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : null}
                    
                    {/* Selected Product Form */}
                    {selectedProduct && (
                      <Card className="border border-orange-200 bg-orange-50/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{selectedProduct.name}</CardTitle>
                          <CardDescription>{selectedProduct.sku} - {selectedProduct.unit}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="system-stock">Stok Sistem</Label>
                              <Input
                                id="system-stock"
                                type="number"
                                value={selectedSystemStock}
                                onChange={(e) => setSelectedSystemStock(Number(e.target.value))}
                                disabled
                                className="w-full bg-gray-100"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="physical-stock">Stok Fisik</Label>
                              <Input
                                id="physical-stock"
                                type="number"
                                value={physicalStock}
                                onChange={(e) => setPhysicalStock(Number(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedProduct(null)}
                              className="border-gray-300"
                            >
                              Batal
                            </Button>
                            <Button
                              onClick={handleAddProduct}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              Tambah ke Stock Opname
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
        
            {/* Stock Opname table */}
            <Card className="overflow-hidden border-0 shadow-sm mt-4 mb-8" ref={stocktakeTableRef}>
              <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FaClipboardCheck className="mr-2 h-4 w-4 text-orange-500" />
                  Daftar Barang Stock Opname
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="show-variance" 
                      checked={showOnlyVariance}
                      onCheckedChange={(checked: boolean) => setShowOnlyVariance(checked)}
                      className="mr-2"
                    />
                    <Label htmlFor="show-variance" className="text-sm">Tampilkan hanya yang selisih</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {stocktakeItems.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Produk</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead className="text-right">Stok Sistem</TableHead>
                          <TableHead className="text-right">Stok Fisik</TableHead>
                          <TableHead className="text-right">Selisih</TableHead>
                          <TableHead className="w-[100px]">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell className="text-right">{item.systemStock}</TableCell>
                            <TableCell className="text-right">{item.physicalStock}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                {item.variance > 0 ? (
                                  <FaArrowUp className="text-green-500 mr-1 h-3 w-3" />
                                ) : item.variance < 0 ? (
                                  <FaArrowDown className="text-red-500 mr-1 h-3 w-3" />
                                ) : null}
                                <span className={
                                  item.variance > 0 
                                    ? "text-green-500" 
                                    : item.variance < 0 
                                      ? "text-red-500" 
                                      : ""
                                }>
                                  {Math.abs(item.variance)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Belum ada produk yang ditambahkan ke Stock Opname
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    Total Produk: {totalItems}
                  </Badge>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    Produk Selisih: {itemsWithVariance}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    onClick={handlePrintStocktakeTable}
                    disabled={stocktakeItems.length === 0}
                  >
                    <FaPrint className="mr-2 h-4 w-4" />
                    Cetak
                  </Button>
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleSaveStocktake}
                    disabled={stocktakeItems.length === 0}
                  >
                    <FaSave className="mr-2 h-4 w-4" />
                    Simpan
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FaHistory className="mr-2 h-4 w-4 text-orange-500" />
                  Riwayat Stock Opname
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Daftar riwayat Stock Opname yang telah dilakukan sebelumnya
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <TableRow>
                      <TableHead className="w-28">ID</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Lokasi</TableHead>
                      <TableHead>Petugas</TableHead>
                      <TableHead className="text-center">Total Produk</TableHead>
                      <TableHead className="text-center">Selisih</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocktakeHistoryData.map((history) => (
                      <TableRow key={history.id} className="hover:bg-orange-50">
                        <TableCell className="font-medium">{history.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-orange-500 h-3.5 w-3.5 mr-1.5" />
                            {new Date(history.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{history.location}</TableCell>
                        <TableCell>
                          <div>
                            <div>{history.stocktakeBy}</div>
                            <div className="text-xs text-gray-500">
                              Disetujui: {history.approvedBy}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{history.totalItems}</TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            className={
                              history.itemsWithVariance > 0 
                                ? "bg-amber-100 text-amber-800 border-amber-200" 
                                : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {history.itemsWithVariance}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {history.status === 'completed' ? 'Selesai' : 
                             history.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                  onClick={() => setSelectedHistory(history)}
                                >
                                  <FaEye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" style={{ width: '90vw' }}>
                                <div ref={printRef} className="print:p-10">
                                  <DialogHeader className="border-b pb-4">
                                    <div className="flex items-center justify-between">
                                      <DialogTitle className="text-xl font-semibold flex items-center">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 mr-2">
                                          <FaClipboardCheck className="text-orange-500 h-4 w-4" />
                                        </div>
                                        Detail Stock Opname: {history.id}
                                      </DialogTitle>
                                      <Badge 
                                        className={history.status === 'completed' 
                                          ? "bg-green-100 text-green-800 border-green-200" 
                                          : history.status === 'pending' 
                                          ? "bg-amber-100 text-amber-800 border-amber-200"
                                          : "bg-red-100 text-red-800 border-red-200"
                                        }
                                      >
                                        {history.status === 'completed' ? 'Selesai' : 
                                         history.status === 'pending' ? 'Menunggu' : 'Dibatalkan'}
                                      </Badge>
                                    </div>
                                    <DialogDescription className="mt-2">
                                      Tanggal: {new Date(history.date).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                      })}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  <div className="py-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                      {/* Detail Stock Opname */}
                                      <Card className="col-span-1 border-0 shadow-sm">
                                        <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-base font-medium flex items-center">
                                            <FaFileAlt className="mr-2 h-4 w-4 text-orange-500" />
                                            Informasi
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm">
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-gray-500">Lokasi:</div>
                                            <div className="col-span-2 font-medium">{history.location}</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-gray-500">Total Produk:</div>
                                            <div className="col-span-2 font-medium">{history.totalItems} item</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-gray-500">Produk Selisih:</div>
                                            <div className="col-span-2 font-medium">{history.itemsWithVariance} item</div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-gray-500">Dilakukan oleh:</div>
                                            <div className="col-span-2 font-medium flex items-center">
                                              <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center mr-1">
                                                <FaUserAlt className="h-3 w-3 text-orange-500" />
                                              </div>
                                              {history.stocktakeBy}
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-gray-500">Disetujui oleh:</div>
                                            <div className="col-span-2 font-medium flex items-center">
                                              <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-1">
                                                <FaUserAlt className="h-3 w-3 text-green-500" />
                                              </div>
                                              {history.approvedBy}
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-3 gap-1">
                                            <div className="text-gray-500">Tanggal:</div>
                                            <div className="col-span-2 font-medium flex items-center">
                                              <FaCalendarAlt className="h-3 w-3 mr-1 text-orange-500" />
                                              {new Date(history.date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                              })}
                                            </div>
                                          </div>
                                          {history.attachmentUrl && (
                                            <div className="grid grid-cols-3 gap-1">
                                              <div className="text-gray-500">Lampiran:</div>
                                              <div className="col-span-2">
                                                <Button 
                                                  variant="outline" 
                                                  size="sm"
                                                  className="h-7 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                                                >
                                                  <FaFilePdf className="mr-1 h-3 w-3 text-red-500" />
                                                  Lihat Dokumen
                                                </Button>
                                              </div>
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                      
                                      {/* Statistics */}
                                      <Card className="col-span-2 border-0 shadow-sm">
                                        <div className="h-1.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-base font-medium flex items-center">
                                            <FaBoxes className="mr-2 h-4 w-4 text-orange-500" />
                                            Ringkasan
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg">
                                              <div className="text-orange-700 text-xs mb-1">Total Produk</div>
                                              <div className="text-2xl font-bold text-orange-800">{history.totalItems}</div>
                                              <div className="text-xs text-orange-600">
                                                item dihitung
                                              </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-lg">
                                              <div className="text-amber-700 text-xs mb-1">Produk Selisih</div>
                                              <div className="text-2xl font-bold text-amber-800">{history.itemsWithVariance}</div>
                                              <div className="text-xs text-amber-600">
                                                {((history.itemsWithVariance / history.totalItems) * 100).toFixed(1)}% dari total
                                              </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                                              <div className="text-blue-700 text-xs mb-1">Produk Sesuai</div>
                                              <div className="text-2xl font-bold text-blue-800">{history.totalItems - history.itemsWithVariance}</div>
                                              <div className="text-xs text-blue-600">
                                                {(((history.totalItems - history.itemsWithVariance) / history.totalItems) * 100).toFixed(1)}% dari total
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                    
                                    {/* Produk Stock Opname */}
                                    <div className="mt-4">
                                      <div className="text-base font-semibold mb-2 flex items-center">
                                        <FaBoxOpen className="text-orange-500 h-4 w-4 mr-2" />
                                        Daftar Produk ({history.items?.length || 0})
                                      </div>
                                      <div className="border rounded-md overflow-hidden">
                                        <Table>
                                          <TableHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                                            <TableRow>
                                              <TableHead className="w-8">No</TableHead>
                                              <TableHead>Produk</TableHead>
                                              <TableHead className="text-center">Batch</TableHead>
                                              <TableHead className="text-center">Stok Sistem</TableHead>
                                              <TableHead className="text-center">Stok Fisik</TableHead>
                                              <TableHead className="text-center">Selisih</TableHead>
                                              <TableHead>Alasan</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {history.items && history.items.length > 0 ? (
                                              history.items.map((item, index) => (
                                                <TableRow key={item.id} className={item.hasVariance ? "bg-orange-50" : ""}>
                                                  <TableCell>{index + 1}</TableCell>
                                                  <TableCell>
                                                    <div className="font-medium">{item.productName}</div>
                                                    <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    <Badge variant="outline" className="bg-gray-50">
                                                      {item.batchNumber || 'N/A'}
                                                    </Badge>
                                                  </TableCell>
                                                  <TableCell className="text-center font-medium">
                                                    {item.systemStock} {item.unit}
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    {item.physicalStock} {item.unit}
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    <Badge className={`
                                                      ${item.variance > 0 ? 'bg-green-100 text-green-800 border-green-200' : 
                                                        item.variance < 0 ? 'bg-red-100 text-red-800 border-red-200' : 
                                                        'bg-gray-100 text-gray-800 border-gray-200'}
                                                    `}>
                                                      {item.variance > 0 ? `+${item.variance}` : item.variance} {item.unit}
                                                    </Badge>
                                                  </TableCell>
                                                  <TableCell>
                                                    {item.hasVariance ? (
                                                      <span className="text-sm">
                                                        {item.reason === 'damaged' && 'Barang Rusak'}
                                                        {item.reason === 'expired' && 'Kadaluarsa'}
                                                        {item.reason === 'miscounted' && 'Kesalahan Hitung'}
                                                        {item.reason === 'missing' && 'Barang Hilang'}
                                                        {item.reason === 'stolen' && 'Barang Dicuri'}
                                                        {item.reason === 'admin' && 'Kesalahan Admin'}
                                                        {!item.reason && '-'}
                                                      </span>
                                                    ) : (
                                                      <span className="text-xs text-gray-500">-</span>
                                                    )}
                                                  </TableCell>
                                                </TableRow>
                                              ))
                                            ) : (
                                              <TableRow>
                                                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                                                  Data produk tidak tersedia
                                                </TableCell>
                                              </TableRow>
                                            )}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <DialogFooter className="flex justify-between border-t pt-4">
                                    <div className="text-xs text-gray-500 italic flex items-center">
                                      <FaClock className="mr-1 h-3 w-3" />
                                      Terakhir diperbarui: {new Date(history.date).toLocaleString('id-ID')}
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="outline" 
                                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                        onClick={() => generatePDF(history)}
                                      >
                                        <FaFilePdf className="mr-2 h-4 w-4" />
                                        Unduh PDF
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                        onClick={handlePrint}
                                      >
                                        <FaPrint className="mr-2 h-4 w-4" />
                                        Cetak Laporan
                                      </Button>
                                      <DialogClose asChild>
                                        <Button>Tutup</Button>
                                      </DialogClose>
                                    </div>
                                  </DialogFooter>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                              onClick={() => 
                                history.attachmentUrl &&
                                toast({
                                  title: "Mengunduh Lampiran",
                                  description: `Mengunduh file dari ${history.attachmentUrl}`
                                })
                              }
                            >
                              <FaFilePdf className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                            >
                              <FaPrint className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="py-4 border-t border-gray-100">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-gray-500">
                    Menampilkan {stocktakeHistoryData.length} entri
                  </div>
                  <div className="flex">
                    <Button variant="outline" size="sm" className="text-sm">
                      <FaFileExport className="mr-1.5 h-3.5 w-3.5" />
                      Export Riwayat
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog konfirmasi */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
              <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-5">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 transform translate-x-16 -translate-y-16 opacity-20"></div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center">
                    <FaClipboardCheck className="h-6 w-6 mr-3 text-white" />
                    <h2 className="text-xl font-bold">Konfirmasi Stock Opname</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
                    onClick={() => setShowConfirmation(false)}
                  >
                    <FaTimes className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6 bg-orange-50 p-3 rounded-lg border border-orange-100 text-orange-800 text-sm">
                  <div className="flex items-start">
                    <FaInfoCircle className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Perhatian:</p>
                      <p>Dengan menyimpan Stock Opname ini, Anda menyatakan bahwa:</p>
                      <ul className="list-disc ml-5 mt-1 space-y-1">
                        <li>Data stok fisik yang diinput sudah benar sesuai dengan kondisi produk sebenarnya</li>
                        <li>Alasan selisih stok sudah diisi dengan benar untuk semua produk yang memiliki selisih</li>
                        <li>Perubahan stok akan diterapkan ke sistem setelah dikonfirmasi</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Detail Stock Opname</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tanggal:</span>
                        <span className="font-medium">{new Date(stocktakeDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Petugas:</span>
                        <span className="font-medium">{stocktakeBy || '(Belum diisi)'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lokasi:</span>
                        <span className="font-medium">{stockLocations.find(loc => loc.id === stocktakeLocation)?.name || 'Semua Lokasi'}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                        <span className="text-gray-500">Total Produk:</span>
                        <span className="font-medium">{stocktakeItems.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Produk dengan Selisih:</span>
                        <span className="font-medium">{stocktakeItems.filter(item => item.hasVariance).length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Persetujuan</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="manager-name">Nama Manajer / Apoteker Penanggung Jawab</Label>
                        <Input 
                          id="manager-name" 
                          placeholder="Masukkan nama manajer"
                          value={managerName}
                          onChange={(e) => setManagerName(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-start space-x-2 mt-4">
                        <Checkbox 
                          id="staff-acknowledge" 
                          checked={staffAcknowledgement}
                          onCheckedChange={(checked: boolean) => setStaffAcknowledgement(checked)}
                        />
                        <Label htmlFor="staff-acknowledge" className="text-sm font-normal leading-tight cursor-pointer">
                          Saya, sebagai petugas Stock Opname, menyatakan bahwa data yang diinput telah sesuai dengan kondisi fisik produk di lapangan.
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2 mt-2">
                        <Checkbox 
                          id="manager-acknowledge" 
                          checked={managerAcknowledgement}
                          onCheckedChange={(checked: boolean) => setManagerAcknowledgement(checked)}
                        />
                        <Label htmlFor="manager-acknowledge" className="text-sm font-normal leading-tight cursor-pointer">
                          Saya, sebagai Manajer / Apoteker Penanggung Jawab, telah memeriksa dan menyetujui hasil Stock Opname ini.
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-5 mt-2">
                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Kembali
                    </Button>
                    
                    <Button 
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      onClick={handleSubmitStocktake}
                      disabled={!staffAcknowledgement || !managerAcknowledgement || !managerName}
                    >
                      <FaCheck className="mr-1.5 h-4 w-4" />
                      Simpan dan Terapkan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Save Confirmation Dialog */}
        <Dialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FaClipboardCheck className="mr-2 h-5 w-5 text-orange-500" />
                Konfirmasi Penyimpanan
              </DialogTitle>
              <DialogDescription>
                Anda akan menyimpan data stock opname. Pastikan semua data sudah benar.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="bg-amber-50 p-3 rounded-md text-sm border border-amber-200 text-amber-800">
                  <div className="flex items-start">
                    <FaInfoCircle className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Penting</p>
                      <p>Data stock opname yang telah disimpan akan memengaruhi perhitungan inventaris. Pastikan data yang dimasukkan sudah benar dan telah diverifikasi.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="approval-name">Nama Penanggung Jawab</Label>
                  <Input
                    id="approval-name"
                    placeholder="Masukkan nama penanggung jawab"
                    className="w-full"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="staff-acknowledgement"
                    checked={staffAcknowledgement}
                    onCheckedChange={(checked) => setStaffAcknowledgement(checked as boolean)}
                  />
                  <Label htmlFor="staff-acknowledgement" className="text-sm">
                    Saya sudah melakukan penghitungan stok dengan teliti
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manager-acknowledgement"
                    checked={managerAcknowledgement}
                    onCheckedChange={(checked) => setManagerAcknowledgement(checked as boolean)}
                  />
                  <Label htmlFor="manager-acknowledgement" className="text-sm">
                    Saya menyetujui hasil stock opname ini
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSaveConfirmation(false)}>
                Batal
              </Button>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!staffAcknowledgement || !managerAcknowledgement || !managerName}
                onClick={confirmSaveStocktake}
              >
                Simpan Stock Opname
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Success Dialog after Save */}
        <Dialog open={showSaveSuccess} onOpenChange={setShowSaveSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-center">Stock Opname Berhasil Disimpan</DialogTitle>
              <DialogDescription className="text-center">
                Stock Opname dengan ID <span className="font-medium">{savedStocktakeId}</span> telah berhasil disimpan.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer" onClick={handlePrintAfterSave}>
                  <CardContent className="p-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center mr-3">
                      <FaPrint className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cetak Laporan</h3>
                      <p className="text-xs text-orange-700">Cetak laporan stock opname</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer" onClick={handleViewDetailsAfterSave}>
                  <CardContent className="p-4 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                      <FaEye className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Lihat Detail</h3>
                      <p className="text-xs text-blue-700">Lihat detail stock opname</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <DialogFooter className="sm:justify-center">
              <Button variant="ghost" onClick={handleCloseSuccessDialog}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
      </div>
    </InventoryLayout>
  );
};

export default StocktakePage;
