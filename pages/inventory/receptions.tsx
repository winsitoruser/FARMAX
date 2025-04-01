import React, { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import InventoryPageLayout from "@/modules/inventory/components/InventoryPageLayout";
import InventoryPageHeader from "@/modules/inventory/components/InventoryPageHeader";
import ReceptionForm from "@/modules/inventory/components/ReceptionForm";
import ReceptionCheckForm from "@/modules/inventory/components/ReceptionCheckForm";
import ReceptionHistoryDetail from "@/modules/inventory/components/ReceptionHistoryDetail";
import ProductInspectionDetail from "@/modules/inventory/components/ProductInspectionDetail";
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
  FaBoxOpen,
  FaSearch,
  FaPlus,
  FaTrash,
  FaSave,
  FaEdit,
  FaCheck,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimes,
  FaClipboardCheck,
  FaFileInvoice,
  FaClipboardList,
  FaHistory,
  FaEye,
  FaPrint,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaExchangeAlt,
  FaCheckCircle,
  FaTruck,
  FaShippingFast,
  FaCamera,
  FaMicroscope,
  FaTemperatureHigh,
  FaBarcode,
  FaArrowLeft,
  FaArrowRight,
  FaEllipsisH
} from "react-icons/fa";

// Sedikit data mock untuk tab Pemeriksaan dan Riwayat
const mockPendingReceptions = [
  {
    id: "rcpt001",
    date: "2025-03-30",
    invoiceNumber: "INV20250330001",
    poNumber: "PO20250325001", // Nomor PO
    supplier: "PT Kimia Farma",
    totalItems: 12,
    totalValue: 5875000,
    status: "pending"
  },
  {
    id: "rcpt002",
    date: "2025-03-30",
    invoiceNumber: "INV20250330002",
    poNumber: "PO20250321002", // Nomor PO
    supplier: "PT Enseval Putera Megatrading",
    totalItems: 8,
    totalValue: 3250000,
    status: "checking"
  },
  {
    id: "rcpt003",
    date: "2025-03-29",
    invoiceNumber: "INV20250329001",
    poNumber: "PO20250320003", // Nomor PO
    supplier: "PT Bina San Prima",
    totalItems: 15,
    totalValue: 7450000,
    status: "pending"
  }
];

const mockHistoryReceptions = [
  {
    id: "rcpt101",
    date: "2025-03-28",
    invoiceNumber: "INV20250328001",
    poNumber: "PO20250315001", // Nomor PO
    supplier: "PT Kimia Farma",
    totalItems: 10,
    totalValue: 4750000,
    status: "approved",
    paymentStatus: "paid"
  },
  {
    id: "rcpt102",
    date: "2025-03-27",
    invoiceNumber: "INV20250327001",
    poNumber: "PO20250310002", // Nomor PO
    supplier: "PT Parit Padang Global",
    totalItems: 18,
    totalValue: 6230000,
    status: "partial",
    paymentStatus: "partial"
  },
  {
    id: "rcpt103",
    date: "2025-03-25",
    invoiceNumber: "INV20250325002",
    poNumber: "PO20250305003", // Nomor PO
    supplier: "PT Tempo Scan Pacific",
    totalItems: 7,
    totalValue: 3150000,
    status: "rejected",
    paymentStatus: "unpaid"
  }
];

const ReceptionsPage: NextPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("new");
  const [selectedReception, setSelectedReception] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);
  
  // State untuk dialog cetak faktur
  const [showInvoicePDF, setShowInvoicePDF] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  
  // State untuk dialog inspeksi produk
  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // State untuk dropdown aksi pada item pemeriksaan
  const [actionMenuOpen, setActionMenuOpen] = useState<{[key: string]: boolean}>({});
  
  // Format nilai ke format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Handler saat pemeriksaan selesai disimpan
  const handleCheckingSaved = () => {
    toast({
      title: "Pemeriksaan berhasil disimpan",
      description: "Data pemeriksaan telah diperbarui di sistem",
      variant: "default",
    });
    setSelectedReception(null);
  };

  // Handler untuk membatalkan pemeriksaan
  const handleCheckingCancelled = () => {
    setSelectedReception(null);
  };

  // Handler untuk kembali dari detail riwayat
  const handleHistoryBack = () => {
    setSelectedHistory(null);
  };
  
  // Handler untuk menampilkan menu aksi
  const toggleActionMenu = (id: string) => {
    setActionMenuOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Handler untuk aksi cepat pada item
  const handleQuickAction = (receptionId: string, action: string) => {
    setActionMenuOpen({});
    
    switch(action) {
      case 'check':
        setSelectedReception(receptionId);
        break;
      case 'approve':
        toast({
          title: "Penerimaan disetujui",
          description: `Penerimaan ${receptionId} telah disetujui tanpa pemeriksaan detail`,
          variant: "default",
        });
        break;
      case 'reject':
        toast({
          title: "Penerimaan ditolak",
          description: `Penerimaan ${receptionId} telah ditolak`,
          variant: "destructive",
        });
        break;
      case 'print':
        const reception = mockPendingReceptions.find(r => r.id === receptionId);
        if (reception) {
          setInvoiceData(reception);
          setShowInvoicePDF(true);
        }
        break;
      default:
        break;
    }
  };
  
  // Handler untuk cetak faktur
  const handlePrintInvoice = (receptionId: string) => {
    const reception = mockHistoryReceptions.find(r => r.id === receptionId);
    if (reception) {
      setInvoiceData(reception);
      setShowInvoicePDF(true);
    }
  };
  
  // Handler untuk membuka modal inspeksi produk
  const handleInspectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowInspectionModal(true);
    
    toast({
      title: "Memuat data produk",
      description: `Sedang memuat data produk untuk inspeksi detail`,
      variant: "default",
    });
  };
  
  // Handler untuk menutup modal inspeksi produk
  const handleCloseInspection = () => {
    setSelectedProductId(null);
    setShowInspectionModal(false);
  };
  
  return (
    <InventoryPageLayout title="Penerimaan Barang">
      <Head>
        <title>Penerimaan Barang | Farmanesia</title>
      </Head>
      
      <div className="max-w-7xl mx-auto">
        {/* Decorative header with gradient - matching design style */}
        <div className="relative rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-4 mb-4 shadow-md overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="relative flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mr-4 backdrop-blur-sm">
              <FaTruck className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Penerimaan Barang</h1>
              <p className="text-white/80 text-sm">Kelola penerimaan barang dari supplier</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="new" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="bg-white border p-1 w-full flex space-x-1 mb-4">
            <TabsTrigger value="new" className="flex-1">
              <FaTruck className="mr-2 h-4 w-4" />
              Penerimaan Baru
            </TabsTrigger>
            <TabsTrigger value="check" className="flex-1">
              <FaClipboardCheck className="mr-2 h-4 w-4" />
              Cek Barang
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <FaHistory className="mr-2 h-4 w-4" />
              Riwayat Penerimaan
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <ReceptionForm />
          </TabsContent>
          
          <TabsContent value="check">
            {selectedReception ? (
              <ReceptionCheckForm 
                receptionId={selectedReception}
                onSave={handleCheckingSaved}
                onCancel={handleCheckingCancelled}
              />
            ) : (
              <Card className="shadow-md border-none mb-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <FaClipboardCheck className="mr-2 h-5 w-5 text-orange-500" />
                    Pemeriksaan Barang
                  </CardTitle>
                  <CardDescription>
                    Verifikasi kualitas dan kondisi barang yang diterima
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {/* Filter dan pencarian */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Input placeholder="Cari berdasarkan nomor faktur, PO, atau supplier" className="pl-10" />
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
                    
                    {/* Daftar penerimaan yang menunggu pemeriksaan */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>No. Faktur</TableHead>
                            <TableHead>No. PO</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-center">Jumlah Item</TableHead>
                            <TableHead className="text-right">Nilai Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPendingReceptions.map((reception) => (
                            <TableRow key={reception.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <TableCell className="font-medium">{new Date(reception.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</TableCell>
                              <TableCell>{reception.invoiceNumber}</TableCell>
                              <TableCell>{reception.poNumber}</TableCell>
                              <TableCell>{reception.supplier}</TableCell>
                              <TableCell className="text-center">{reception.totalItems}</TableCell>
                              <TableCell className="text-right">{formatRupiah(reception.totalValue)}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant={reception.status === "pending" ? "outline" : "secondary"} className={reception.status === "pending" ? "text-orange-500 border-orange-200 bg-orange-50" : ""}>
                                  {reception.status === "pending" ? "Menunggu" : "Checking"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center justify-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => setSelectedReception(reception.id)}
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
                                    onClick={() => handleInspectProduct(reception.id)}
                                  >
                                    <FaMicroscope className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    onClick={() => toggleActionMenu(reception.id)}
                                  >
                                    <FaEllipsisH className="h-4 w-4" />
                                  </Button>
                                  {actionMenuOpen[reception.id] && (
                                    <div className="absolute bg-white shadow-md p-2 w-40 right-0 mt-2 z-10">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-orange-500 hover:text-orange-700 hover:bg-orange-50 w-full justify-start"
                                        onClick={() => handleQuickAction(reception.id, 'check')}
                                      >
                                        <FaClipboardCheck className="mr-2 h-4 w-4" />
                                        Periksa
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-green-500 hover:text-green-700 hover:bg-green-50 w-full justify-start"
                                        onClick={() => handleQuickAction(reception.id, 'approve')}
                                      >
                                        <FaCheckCircle className="mr-2 h-4 w-4" />
                                        Setujui
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full justify-start"
                                        onClick={() => handleQuickAction(reception.id, 'reject')}
                                      >
                                        <FaTimes className="mr-2 h-4 w-4" />
                                        Tolak
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 w-full justify-start"
                                        onClick={() => handleQuickAction(reception.id, 'print')}
                                      >
                                        <FaPrint className="mr-2 h-4 w-4" />
                                        Cetak Faktur
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
              <ReceptionHistoryDetail 
                receptionId={selectedHistory} 
                onBack={handleHistoryBack} 
              />
            ) : (
              <Card className="shadow-md border-none mb-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
                  <CardTitle className="text-lg flex items-center">
                    <FaHistory className="mr-2 h-5 w-5 text-orange-500" />
                    Riwayat Penerimaan
                  </CardTitle>
                  <CardDescription>
                    Catatan historis penerimaan barang di gudang
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-6">
                    {/* Filter dan pencarian */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Input placeholder="Cari berdasarkan nomor faktur, PO, atau supplier" className="pl-10" />
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
                          <span>PO</span>
                        </Button>
                      </div>
                    </div>
                    
                    {/* Daftar riwayat penerimaan */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>No. Faktur</TableHead>
                            <TableHead>No. PO</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead className="text-center">Item</TableHead>
                            <TableHead className="text-right">Nilai Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Pembayaran</TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockHistoryReceptions.map((reception) => (
                            <TableRow key={reception.id}>
                              <TableCell>{reception.date}</TableCell>
                              <TableCell>{reception.invoiceNumber}</TableCell>
                              <TableCell>{reception.poNumber}</TableCell>
                              <TableCell>{reception.supplier}</TableCell>
                              <TableCell className="text-center">{reception.totalItems}</TableCell>
                              <TableCell className="text-right">{formatRupiah(reception.totalValue)}</TableCell>
                              <TableCell className="text-center">
                                <Badge className={
                                  reception.status === "approved" 
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : reception.status === "partial"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }>
                                  {reception.status === "approved" 
                                    ? "Disetujui" 
                                    : reception.status === "partial"
                                    ? "Sebagian"
                                    : "Ditolak"
                                  }
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={
                                  reception.paymentStatus === "paid" 
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : reception.paymentStatus === "partial"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                }>
                                  {reception.paymentStatus === "paid" 
                                    ? "Lunas" 
                                    : reception.paymentStatus === "partial"
                                    ? "Sebagian"
                                    : "Belum Dibayar"
                                  }
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                    onClick={() => setSelectedHistory(reception.id)}
                                  >
                                    <FaEye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <FaPrint className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
                                  >
                                    <FaDownload className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    onClick={() => handlePrintInvoice(reception.id)}
                                  >
                                    <FaFileInvoice className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-gray-500">Menampilkan 1-10 dari 24 penerimaan</p>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" disabled>
                          <FaArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-orange-50">1</Button>
                        <Button variant="outline" size="sm">2</Button>
                        <Button variant="outline" size="sm">3</Button>
                        <Button variant="outline" size="sm">
                          <FaArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialog PDF Faktur Penerimaan */}
      {showInvoicePDF && invoiceData && (
        <Dialog open={showInvoicePDF} onOpenChange={setShowInvoicePDF}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <div className="flex flex-col h-[85vh]">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <FaFileInvoice className="mr-2 h-5 w-5" />
                  <DialogTitle className="text-lg font-semibold">Faktur Penerimaan Barang</DialogTitle>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => {
                      // Simulasi print PDF
                      toast({
                        title: "Faktur dicetak",
                        description: "Faktur berhasil dicetak ke printer default",
                        variant: "default",
                      });
                    }}
                  >
                    <FaPrint className="mr-2 h-4 w-4" />
                    Cetak
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => {
                      // Simulasi download PDF
                      toast({
                        title: "Faktur diunduh",
                        description: "Faktur berhasil diunduh sebagai PDF",
                        variant: "default",
                      });
                    }}
                  >
                    <FaDownload className="mr-2 h-4 w-4" />
                    Unduh PDF
                  </Button>
                  <DialogClose asChild>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <FaTimes className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto bg-white p-8">
                {/* Preview PDF faktur */}
                <div className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 p-8">
                  {/* Header faktur */}
                  <div className="flex justify-between mb-8">
                    <div>
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg mr-3 flex items-center justify-center">
                          <FaBoxOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-800">FARMANESIA</h1>
                          <p className="text-sm text-gray-500">Apotek & Distributor Farmasi</p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-500">
                        <p>Jl. Farmasi Raya No. 123, Jakarta Selatan</p>
                        <p>Telp: (021) 1234-5678 | Email: info@farmanesia.id</p>
                        <p>NPWP: 01.234.567.8-123.000</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col items-end">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">FAKTUR PENERIMAAN</h2>
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-md">
                          <p className="font-semibold">{invoiceData.invoiceNumber}</p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-gray-500 text-right">
                        <p>Tanggal: {new Date(invoiceData.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p>No. PO: {invoiceData.poNumber}</p>
                        <p>Status: {invoiceData.status === 'approved' ? 'Disetujui' : invoiceData.status === 'rejected' ? 'Ditolak' : 'Pending'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informasi supplier */}
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-md border border-orange-100">
                      <h3 className="font-semibold text-gray-700 mb-2">Informasi Supplier:</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Supplier:</p>
                          <p className="font-medium">{invoiceData.supplier}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Alamat:</p>
                          <p className="font-medium">Jl. Industri Farmasi No. 45, Jakarta Timur</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Kontak:</p>
                          <p className="font-medium">021-87654321</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email:</p>
                          <p className="font-medium">sales@{invoiceData.supplier.toLowerCase().replace(/\s+/g, '')}.co.id</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detail produk */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-700 mb-4">Detail Produk:</h3>
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead className="bg-gradient-to-r from-orange-50 to-amber-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nama Produk</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">Jumlah</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">Harga</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">Diskon</th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Simulasi item karena kita tidak memiliki data item sebenarnya */}
                        {Array.from({ length: Math.max(3, Math.min(6, invoiceData.totalItems)) }, (_, i) => {
                          const basePrice = Math.floor(Math.random() * 50 + 20) * 1000;
                          const qty = Math.floor(Math.random() * 30 + 5);
                          const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) * 1000 : 0;
                          const total = basePrice * qty - discount;
                          
                          return (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-2.5 text-sm text-gray-500">{i + 1}</td>
                              <td className="px-4 py-2.5 text-sm text-gray-800">
                                <div>
                                  <p className="font-medium">
                                    {["Paracetamol 500mg", "Amoxicillin 500mg", "Vitamin C 1000mg", "Cetirizine 10mg", "Omeprazole 20mg", "Metformin 500mg"][i % 6]}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Batch: {`B${Math.floor(Math.random() * 1000)}/${new Date().getFullYear()}`}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-sm text-gray-800 text-right">{qty} Box</td>
                              <td className="px-4 py-2.5 text-sm text-gray-800 text-right">{formatRupiah(basePrice)}</td>
                              <td className="px-4 py-2.5 text-sm text-gray-800 text-right">{formatRupiah(discount)}</td>
                              <td className="px-4 py-2.5 text-sm text-gray-800 text-right font-medium">{formatRupiah(total)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider text-right">Subtotal:</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">{formatRupiah(invoiceData.totalValue * 0.9)}</td>
                        </tr>
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider text-right">Pajak (10%):</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">{formatRupiah(invoiceData.totalValue * 0.1)}</td>
                        </tr>
                        <tr className="bg-gradient-to-r from-orange-50 to-amber-50">
                          <td colSpan={5} className="px-4 py-3 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Total:</td>
                          <td className="px-4 py-3 text-sm font-bold text-orange-600 text-right">{formatRupiah(invoiceData.totalValue)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  {/* Footer faktur */}
                  <div className="mt-12 grid grid-cols-3 gap-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-12">Diterima oleh:</p>
                      <div className="border-t border-gray-300 pt-1">
                        <p className="font-medium">Admin Gudang</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-12">Diperiksa oleh:</p>
                      <div className="border-t border-gray-300 pt-1">
                        <p className="font-medium">Apoteker Penanggung Jawab</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-12">Disetujui oleh:</p>
                      <div className="border-t border-gray-300 pt-1">
                        <p className="font-medium">Manajer Farmasi</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stempel dan tanda tangan digital */}
                  {invoiceData.status === 'approved' && (
                    <div className="absolute bottom-20 right-20 opacity-30 rotate-[-15deg]">
                      <div className="border-4 border-orange-500 rounded-full p-3 w-40 h-40 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-600">DISETUJUI</p>
                          <p className="text-xs text-orange-500">{new Date(invoiceData.date).toLocaleDateString('id-ID')}</p>
                          <p className="text-xs text-orange-500 mt-2">Farmanesia</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {invoiceData.status === 'rejected' && (
                    <div className="absolute bottom-20 right-20 opacity-30 rotate-[-15deg]">
                      <div className="border-4 border-red-500 rounded-full p-3 w-40 h-40 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xl font-bold text-red-600">DITOLAK</p>
                          <p className="text-xs text-red-500">{new Date(invoiceData.date).toLocaleDateString('id-ID')}</p>
                          <p className="text-xs text-red-500 mt-2">Farmanesia</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog Inspeksi Produk */}
      {showInspectionModal && selectedProductId && (
        <ProductInspectionDetail
          isOpen={showInspectionModal}
          onClose={handleCloseInspection}
          productId={selectedProductId}
        />
      )}
    </InventoryPageLayout>
  );
};

export default ReceptionsPage;
