import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/utils";
import { 
  FaFileInvoice, 
  FaBoxOpen, 
  FaPrint, 
  FaDownload, 
  FaHistory, 
  FaTruck, 
  FaSave, 
  FaTimes, 
  FaInfoCircle,
  FaWarehouse,
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheck,
  FaTimesCircle,
  FaArrowLeft,
  FaExclamationTriangle
} from "react-icons/fa";

// Interface untuk produk dalam riwayat
interface HistoryProduct {
  id: string;
  name: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  price: number;
  systemPrice: number; // Harga pada sistem
  supplierOfferPrice: number; // Harga penawaran supplier
  discount: number;
  total: number;
  storageLocation: string;
}

// Interface untuk data riwayat penerimaan
interface ReceptionHistory {
  id: string;
  date: string;
  invoiceNumber: string;
  poNumber: string; // Nomor PO
  supplier: string;
  supplierAddress: string;
  items: HistoryProduct[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  status: 'approved' | 'partial' | 'rejected';
  receivedBy: string;
  approvedBy: string;
  approvedDate: string;
  paymentStatus: 'paid' | 'unpaid' | 'partial';
  paymentDue: string;
}

// Data mock untuk detil riwayat
const mockHistoryData: ReceptionHistory = {
  id: "rcpt002",
  date: "2025-03-25",
  invoiceNumber: "INV20250325003",
  poNumber: "PO20250320001", // Nomor PO
  supplier: "PT Kimia Farma",
  supplierAddress: "Jl. Pemuda No. 56, Jakarta Timur",
  receivedBy: "Anisa Widya",
  approvedBy: "Budi Santoso",
  approvedDate: "2025-03-26",
  paymentStatus: "paid",
  paymentDue: "2025-04-25",
  status: "approved",
  notes: "Pengiriman sesuai dengan pesanan dan dalam kondisi baik",
  subtotal: 4850000,
  tax: 485000,
  discount: 250000,
  total: 5085000,
  items: [
    {
      id: "item001",
      name: "Paracetamol 500mg",
      batchNumber: "PCM-2025-03",
      expiryDate: "2027-03-30",
      quantity: 50,
      unit: "Box",
      price: 35000,
      systemPrice: 34000, // Harga pada sistem
      supplierOfferPrice: 33500, // Harga penawaran supplier
      discount: 0,
      total: 1750000,
      storageLocation: "Rak A-12"
    },
    {
      id: "item002",
      name: "Amoxicillin 500mg",
      batchNumber: "AMX-2025-03",
      expiryDate: "2026-06-30",
      quantity: 30,
      unit: "Box",
      price: 45000,
      systemPrice: 44000, // Harga pada sistem
      supplierOfferPrice: 44500, // Harga penawaran supplier
      discount: 5000,
      total: 1200000,
      storageLocation: "Rak B-05"
    },
    {
      id: "item003",
      name: "Vitamin C 1000mg",
      batchNumber: "VTC-2025-03",
      expiryDate: "2028-01-15",
      quantity: 25,
      unit: "Box",
      price: 76000,
      systemPrice: 75000, // Harga pada sistem
      supplierOfferPrice: 76000, // Harga penawaran supplier
      discount: 0,
      total: 1900000,
      storageLocation: "Rak C-08"
    }
  ]
};

interface ReceptionHistoryDetailProps {
  receptionId: string;
  onBack: () => void;
}

const ReceptionHistoryDetail: React.FC<ReceptionHistoryDetailProps> = ({ receptionId, onBack }) => {
  // Dalam implementasi nyata, kita akan mengambil data berdasarkan receptionId
  // Untuk demo ini, kita gunakan data mock
  const [receptionData, setReceptionData] = useState<ReceptionHistory>(mockHistoryData);

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk cetak
  const handlePrint = () => {
    window.print();
  };

  // Fungsi untuk download
  const handleDownload = () => {
    // Implementasi download PDF/Excel disini
    alert("Download fitur akan diimplementasikan");
  };

  // Mendapatkan warna berdasarkan status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'partial':
        return "bg-amber-100 text-amber-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Mendapatkan warna berdasarkan status pembayaran
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800";
      case 'partial':
        return "bg-blue-100 text-blue-800";
      case 'unpaid':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Translasi status ke Bahasa Indonesia
  const translateStatus = (status: string) => {
    switch (status) {
      case 'approved':
        return "Disetujui";
      case 'partial':
        return "Sebagian Diterima";
      case 'rejected':
        return "Ditolak";
      default:
        return status;
    }
  };

  // Translasi status pembayaran ke Bahasa Indonesia
  const translatePaymentStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return "Lunas";
      case 'partial':
        return "Sebagian";
      case 'unpaid':
        return "Belum Dibayar";
      default:
        return status;
    }
  };

  // Mendapatkan ikon berdasarkan status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheck className="mr-1 h-3 w-3" />;
      case 'partial':
        return <FaInfoCircle className="mr-1 h-3 w-3" />;
      case 'rejected':
        return <FaTimesCircle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dengan action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Button 
          variant="ghost" 
          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 -ml-4 pl-2"
          onClick={onBack}
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={handlePrint}
          >
            <FaPrint className="mr-2 h-4 w-4" />
            Cetak
          </Button>
          <Button
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
            onClick={handleDownload}
          >
            <FaDownload className="mr-2 h-4 w-4" />
            Unduh PDF
          </Button>
        </div>
      </div>
      
      {/* Invoice header */}
      <Card className="shadow-sm border-orange-200 overflow-hidden">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -mr-10 -mt-10 z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -ml-10 -mb-10 z-0"></div>
          
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <CardTitle className="text-xl flex items-center text-orange-700">
                  <FaFileInvoice className="mr-2 h-5 w-5 text-orange-500" />
                  Faktur Penerimaan #{receptionData.invoiceNumber}
                </CardTitle>
                <CardDescription>
                  {formatDate(receptionData.date)}
                </CardDescription>
              </div>
              
              <div className="flex space-x-2 mt-2 md:mt-0">
                <Badge className={getStatusColor(receptionData.status) + " flex items-center"}>
                  {getStatusIcon(receptionData.status)}
                  {translateStatus(receptionData.status)}
                </Badge>
                <Badge className={getPaymentStatusColor(receptionData.paymentStatus) + " flex items-center"}>
                  <FaMoneyBillWave className="mr-1 h-3 w-3" />
                  {translatePaymentStatus(receptionData.paymentStatus)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Supplier info */}
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <FaTruck className="mr-2 h-4 w-4 text-orange-500" />
                  Informasi Supplier
                </h3>
                <p className="font-semibold text-gray-800">{receptionData.supplier}</p>
                <p className="text-sm text-gray-600 mt-1">{receptionData.supplierAddress}</p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Referensi PO:</p>
                  <p className="font-medium text-orange-600">{receptionData.poNumber}</p>
                </div>
              </div>
              
              {/* Reception info */}
              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <FaHistory className="mr-2 h-4 w-4 text-orange-500" />
                  Informasi Penerimaan
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Diterima oleh:</p>
                    <p className="font-medium">{receptionData.receivedBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Disetujui oleh:</p>
                    <p className="font-medium">{receptionData.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal persetujuan:</p>
                    <p className="font-medium">{formatDate(receptionData.approvedDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Jatuh tempo:</p>
                    <p className="font-medium">{formatDate(receptionData.paymentDue)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Items table */}
            <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-6">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>No. Batch</TableHead>
                    <TableHead>Kedaluwarsa</TableHead>
                    <TableHead className="text-center">Qty</TableHead>
                    <TableHead className="text-right">Harga Faktur</TableHead>
                    <TableHead className="text-right">Diskon</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Lokasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receptionData.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.batchNumber}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell className="text-center">{item.quantity} {item.unit}</TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium">{formatRupiah(item.price)}</p>
                          <div className="mt-1 text-xs text-gray-500 space-y-1">
                            <div className="flex justify-between">
                              <span>Sistem:</span>
                              <span className={item.price > item.systemPrice ? "text-orange-600" : ""}>{formatRupiah(item.systemPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Penawaran:</span>
                              <span className={item.price !== item.supplierOfferPrice ? "text-blue-600" : ""}>{formatRupiah(item.supplierOfferPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatRupiah(item.discount)}</TableCell>
                      <TableCell className="text-right font-medium">{formatRupiah(item.total)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FaWarehouse className="mr-1 h-3 w-3 text-gray-400" />
                          {item.storageLocation}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Summary and notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <FaInfoCircle className="mr-2 h-4 w-4 text-orange-500" />
                  Catatan
                </h3>
                <p className="text-sm text-gray-700">
                  {receptionData.notes || "Tidak ada catatan"}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <FaExclamationTriangle className="mr-2 h-4 w-4 text-orange-500" />
                    Perbedaan Harga
                  </h3>
                  {receptionData.items.some(item => item.price > item.systemPrice || item.price !== item.supplierOfferPrice) ? (
                    <div className="space-y-2 text-sm">
                      {receptionData.items.filter(item => item.price > item.systemPrice).map(item => (
                        <div key={`sys-${item.id}`} className="flex items-start text-orange-600">
                          <FaExclamationTriangle className="h-3 w-3 mr-1 mt-1" />
                          <p>{item.name}: Harga faktur lebih tinggi dari sistem ({formatRupiah(item.price)} vs {formatRupiah(item.systemPrice)})</p>
                        </div>
                      ))}
                      {receptionData.items.filter(item => item.price !== item.supplierOfferPrice).map(item => (
                        <div key={`sup-${item.id}`} className="flex items-start text-blue-600">
                          <FaInfoCircle className="h-3 w-3 mr-1 mt-1" />
                          <p>{item.name}: Harga faktur berbeda dengan penawaran ({formatRupiah(item.price)} vs {formatRupiah(item.supplierOfferPrice)})</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600 flex items-center">
                      <FaCheck className="mr-1 h-3 w-3" />
                      Semua harga sesuai dengan sistem dan penawaran
                    </p>
                  )}
                </div>
              </div>
              
              {/* Summary */}
              <div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatRupiah(receptionData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PPN (10%):</span>
                    <span>{formatRupiah(receptionData.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diskon:</span>
                    <span>-{formatRupiah(receptionData.discount)}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total:</span>
                    <span className="text-orange-600">{formatRupiah(receptionData.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ReceptionHistoryDetail;
