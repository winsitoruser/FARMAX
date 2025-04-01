import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  FaCheck,
  FaCamera,
  FaExchangeAlt,
  FaInfoCircle,
  FaMicroscope,
  FaTemperatureHigh,
  FaClipboardList
} from "react-icons/fa";

// Interface untuk produk pemeriksaan
interface CheckItem {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  receivedQuantity: number;
  price: number;
  systemPrice: number; // Harga pada sistem
  supplierOfferPrice: number; // Harga penawaran supplier
  physicalCheck: boolean;
  packageCheck: boolean;
  expiryCheck: boolean;
  conditionCheck: boolean;
  notes: string;
  image?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Interface untuk data penerimaan
interface ReceptionToCheck {
  id: string;
  date: string;
  invoiceNumber: string;
  poNumber: string; // Nomor PO
  supplier: string;
  items: CheckItem[];
  notes: string;
  status: 'pending' | 'checking' | 'completed' | 'approved' | 'rejected';
}

interface ReceptionCheckFormProps {
  receptionId: string;
  onSave: () => void;
  onCancel: () => void;
}

// Data mock untuk satu penerimaan
const mockReceptionData: ReceptionToCheck = {
  id: "rcpt001",
  date: "2025-03-30",
  invoiceNumber: "INV20250330001",
  poNumber: "PO20250325002", // Nomor PO
  supplier: "PT Kimia Farma",
  status: "checking",
  notes: "",
  items: [
    {
      id: "item001",
      productId: "prod001",
      productName: "Paracetamol 500mg",
      batchNumber: "PCM-2025-03",
      expiryDate: "2027-03-30",
      quantity: 50,
      receivedQuantity: 0,
      price: 35000,
      systemPrice: 34000, // Harga pada sistem
      supplierOfferPrice: 33500, // Harga penawaran supplier
      physicalCheck: false,
      packageCheck: false,
      expiryCheck: false,
      conditionCheck: false,
      notes: "",
      status: 'pending'
    },
    {
      id: "item002",
      productId: "prod002",
      productName: "Amoxicillin 500mg",
      batchNumber: "AMX-2025-03",
      expiryDate: "2026-06-30",
      quantity: 30,
      receivedQuantity: 0,
      price: 45000,
      systemPrice: 44000, // Harga pada sistem
      supplierOfferPrice: 44500, // Harga penawaran supplier
      physicalCheck: false,
      packageCheck: false,
      expiryCheck: false,
      conditionCheck: false,
      notes: "",
      status: 'pending'
    },
    {
      id: "item003",
      productId: "prod003",
      productName: "Vitamin C 1000mg",
      batchNumber: "VTC-2025-03",
      expiryDate: "2028-01-15",
      quantity: 25,
      receivedQuantity: 0,
      price: 20000,
      systemPrice: 19500, // Harga pada sistem
      supplierOfferPrice: 20000, // Harga penawaran supplier
      physicalCheck: false,
      packageCheck: false,
      expiryCheck: false,
      conditionCheck: false,
      notes: "",
      status: 'pending'
    }
  ]
};

const ReceptionCheckForm: React.FC<ReceptionCheckFormProps> = ({ receptionId, onSave, onCancel }) => {
  // Dalam implementasi nyata, kita akan mengambil data berdasarkan receptionId
  // Untuk demo ini, kita gunakan data mock
  const [receptionData, setReceptionData] = useState<ReceptionToCheck>(mockReceptionData);
  
  // State untuk item yang sedang diperiksa
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  
  // State untuk upload gambar
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handler untuk perubahan pada item pemeriksaan
  const handleItemChange = (index: number, field: keyof CheckItem, value: any) => {
    const newItems = [...receptionData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setReceptionData({ ...receptionData, items: newItems });
  };

  // Handler untuk upload gambar
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // Simpan gambar ke item saat ini
        handleItemChange(currentItemIndex, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler untuk menyimpan status pemeriksaan item
  const handleItemStatus = (index: number, status: 'approved' | 'rejected') => {
    handleItemChange(index, 'status', status);
    
    // Cek apakah sudah semua item diperiksa
    const newItems = [...receptionData.items];
    newItems[index] = { ...newItems[index], status };
    
    const allChecked = newItems.every(item => item.status !== 'pending');
    if (allChecked) {
      // Jika semua sudah diperiksa, update status penerimaan
      setReceptionData({ 
        ...receptionData, 
        items: newItems,
        status: 'completed'
      });
    } else {
      setReceptionData({ ...receptionData, items: newItems });
    }
    
    // Pindah ke item berikutnya jika ada
    if (index < receptionData.items.length - 1) {
      setCurrentItemIndex(index + 1);
      setImagePreview(null);
    }
  };

  // Mengetahui apakah semua checklist dicentang
  const isItemFullyChecked = (item: CheckItem) => {
    return item.physicalCheck && item.packageCheck && item.expiryCheck && item.conditionCheck && item.receivedQuantity > 0;
  };

  // Mengetahui apakah ada perbedaan kuantitas
  const hasQuantityDiscrepancy = (item: CheckItem) => {
    return item.receivedQuantity !== item.quantity;
  };

  // Fungsi untuk menyimpan pemeriksaan
  const saveChecking = () => {
    // Lakukan pembaruan status dan penyimpanan data
    // Dalam implementasi nyata, panggil API atau update di state global
    
    // Tentukan status akhir penerimaan
    const hasRejected = receptionData.items.some(item => item.status === 'rejected');
    const finalStatus = hasRejected ? 'rejected' : 'approved';
    
    // Update status penerimaan
    setReceptionData({ ...receptionData, status: finalStatus });
    
    // Panggil callback
    onSave();
  };

  // Jumlah item yang disetujui dan ditolak
  const approvedCount = receptionData.items.filter(item => item.status === 'approved').length;
  const rejectedCount = receptionData.items.filter(item => item.status === 'rejected').length;
  const pendingCount = receptionData.items.filter(item => item.status === 'pending').length;

  // Item yang sedang diperiksa
  const currentItem = receptionData.items[currentItemIndex];

  return (
    <div className="space-y-6">
      {/* Header informasi penerimaan */}
      <Card className="shadow-sm border-orange-200">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
          <CardTitle className="text-lg flex items-center">
            <FaFileInvoice className="mr-2 h-5 w-5 text-orange-500" />
            Informasi Penerimaan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">No. Faktur</p>
              <p className="font-medium">{receptionData.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">No. PO</p>
              <p className="font-medium">{receptionData.poNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal</p>
              <p className="font-medium">{receptionData.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="font-medium">{receptionData.supplier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div>
                <Badge className="bg-blue-100 text-blue-700">
                  Sedang Diperiksa
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between mt-4 space-y-2 md:space-y-0">
            <div className="flex space-x-4">
              <div className="text-center px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-md">
                <p className="text-sm text-green-600">Disetujui</p>
                <p className="text-lg font-bold text-green-700">{approvedCount}</p>
              </div>
              <div className="text-center px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 rounded-md">
                <p className="text-sm text-red-600">Ditolak</p>
                <p className="text-lg font-bold text-red-700">{rejectedCount}</p>
              </div>
              <div className="text-center px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-md">
                <p className="text-sm text-amber-600">Belum Diperiksa</p>
                <p className="text-lg font-bold text-amber-700">{pendingCount}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="border-orange-200 hover:bg-orange-50"
                onClick={onCancel}
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button
                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                onClick={saveChecking}
                disabled={pendingCount > 0}
              >
                <FaSave className="mr-2 h-4 w-4" />
                Simpan Pemeriksaan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs untuk daftar dan pemeriksaan */}
      <Tabs defaultValue="itemList" className="space-y-4">
        <TabsList className="bg-white border p-1">
          <TabsTrigger value="itemList">
            <FaClipboardList className="mr-2 h-4 w-4" />
            Daftar Item
          </TabsTrigger>
          <TabsTrigger value="check">
            <FaMicroscope className="mr-2 h-4 w-4" />
            Pemeriksaan Item
          </TabsTrigger>
        </TabsList>
        
        {/* Tab daftar item */}
        <TabsContent value="itemList">
          <Card className="shadow-sm border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
              <CardTitle className="text-lg flex items-center">
                <FaBoxOpen className="mr-2 h-5 w-5 text-orange-500" />
                Daftar Item untuk Diperiksa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>No. Batch</TableHead>
                    <TableHead>Kedaluwarsa</TableHead>
                    <TableHead className="text-center">Qty. Dipesan</TableHead>
                    <TableHead className="text-center">Qty. Diterima</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receptionData.items.map((item, index) => (
                    <TableRow key={item.id} className={currentItemIndex === index ? "bg-orange-50" : ""}>
                      <TableCell className="font-medium">{item.productName}</TableCell>
                      <TableCell>{item.batchNumber}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-center">
                        {item.receivedQuantity > 0 ? item.receivedQuantity : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.status === 'pending' ? (
                          <Badge className="bg-amber-100 text-amber-800">Belum Diperiksa</Badge>
                        ) : item.status === 'approved' ? (
                          <Badge className="bg-green-100 text-green-800">Disetujui</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                          onClick={() => setCurrentItemIndex(index)}
                        >
                          <FaMicroscope className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab pemeriksaan */}
        <TabsContent value="check">
          {currentItem && (
            <Card className="shadow-sm border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-4">
                <CardTitle className="text-lg flex items-center">
                  <FaMicroscope className="mr-2 h-5 w-5 text-orange-500" />
                  Pemeriksaan {currentItem.productName}
                </CardTitle>
                <CardDescription>
                  Periksa kondisi, jumlah, dan kualitas produk yang diterima
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium mb-2 block">Informasi Produk</Label>
                      <div className="bg-gray-50 p-3 rounded-md space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Produk:</span>
                          <span className="font-medium">{currentItem.productName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">No. Batch:</span>
                          <span className="font-medium">{currentItem.batchNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kedaluwarsa:</span>
                          <span className="font-medium">{currentItem.expiryDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Qty. Dipesan:</span>
                          <span className="font-medium">{currentItem.quantity}</span>
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <p className="text-gray-500 text-sm mb-1">Perbandingan Harga:</p>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Faktur:</span>
                              <span className="font-medium ml-1">{formatRupiah(currentItem.price)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Sistem:</span>
                              <span className="font-medium ml-1">{formatRupiah(currentItem.systemPrice)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Penawaran:</span>
                              <span className="font-medium ml-1">{formatRupiah(currentItem.supplierOfferPrice)}</span>
                            </div>
                          </div>
                          {currentItem.price > currentItem.systemPrice && (
                            <div className="text-orange-600 text-xs mt-1 flex items-center">
                              <FaExclamationTriangle className="mr-1 h-3 w-3" />
                              Harga di faktur lebih tinggi dari harga sistem
                            </div>
                          )}
                          {currentItem.price !== currentItem.supplierOfferPrice && (
                            <div className="text-blue-600 text-xs mt-1 flex items-center">
                              <FaInfoCircle className="mr-1 h-3 w-3" />
                              Harga di faktur berbeda dengan penawaran supplier
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-base font-medium mb-2 block">Checklist Pemeriksaan</Label>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="physicalCheck" 
                          checked={currentItem.physicalCheck}
                          onCheckedChange={(checked) => handleItemChange(currentItemIndex, 'physicalCheck', Boolean(checked))}
                        />
                        <Label htmlFor="physicalCheck" className="text-sm font-normal">
                          Produk sesuai dengan pesanan
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="packageCheck" 
                          checked={currentItem.packageCheck}
                          onCheckedChange={(checked) => handleItemChange(currentItemIndex, 'packageCheck', Boolean(checked))}
                        />
                        <Label htmlFor="packageCheck" className="text-sm font-normal">
                          Kemasan dalam kondisi baik dan tidak rusak
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="expiryCheck" 
                          checked={currentItem.expiryCheck}
                          onCheckedChange={(checked) => handleItemChange(currentItemIndex, 'expiryCheck', Boolean(checked))}
                        />
                        <Label htmlFor="expiryCheck" className="text-sm font-normal">
                          Tanggal kedaluwarsa sesuai dan masih jauh
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="conditionCheck" 
                          checked={currentItem.conditionCheck}
                          onCheckedChange={(checked) => handleItemChange(currentItemIndex, 'conditionCheck', Boolean(checked))}
                        />
                        <Label htmlFor="conditionCheck" className="text-sm font-normal">
                          Obat dalam kondisi baik (tidak rusak/cacat)
                        </Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="receivedQuantity">Jumlah yang Diterima</Label>
                      <Input
                        id="receivedQuantity"
                        type="number"
                        value={currentItem.receivedQuantity}
                        onChange={(e) => handleItemChange(currentItemIndex, 'receivedQuantity', parseInt(e.target.value) || 0)}
                        min="0"
                        max={currentItem.quantity * 2}
                      />
                      {hasQuantityDiscrepancy(currentItem) && currentItem.receivedQuantity > 0 && (
                        <p className={
                          currentItem.receivedQuantity < currentItem.quantity 
                            ? "text-amber-600 text-sm flex items-center" 
                            : "text-blue-600 text-sm flex items-center"
                        }>
                          <FaExclamationTriangle className="mr-1 h-3 w-3" />
                          {currentItem.receivedQuantity < currentItem.quantity 
                            ? `Kekurangan ${currentItem.quantity - currentItem.receivedQuantity} unit dari pesanan.`
                            : `Kelebihan ${currentItem.receivedQuantity - currentItem.quantity} unit dari pesanan.`}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Catatan Pemeriksaan</Label>
                      <Textarea
                        id="notes"
                        value={currentItem.notes}
                        onChange={(e) => handleItemChange(currentItemIndex, 'notes', e.target.value)}
                        placeholder="Tambahkan catatan hasil pemeriksaan"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium mb-2 block">Dokumentasi</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                        {imagePreview ? (
                          <div className="space-y-2 w-full">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-40 mx-auto rounded-md object-contain"
                            />
                            <div className="flex justify-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setImagePreview(null)}
                              >
                                <FaTrash className="mr-2 h-3 w-3" />
                                Hapus
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FaCamera className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500 mb-4 text-center">
                              Upload foto produk untuk dokumentasi
                            </p>
                            <div>
                              <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                              />
                              <Button
                                type="button"
                                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                                onClick={() => document.getElementById('photo-upload')?.click()}
                              >
                                <FaCamera className="mr-2 h-4 w-4" />
                                Ambil Foto
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-md text-amber-800 text-sm mt-4">
                      <div className="flex items-start space-x-2">
                        <FaInfoCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Panduan Pemeriksaan</p>
                          <ul className="list-disc ml-4 mt-1 space-y-1">
                            <li>Periksa apakah produk sesuai dengan pesanan (jenis, merek, dosis)</li>
                            <li>Pastikan kemasan dalam kondisi baik (tidak rusak, bocor, atau terbuka)</li>
                            <li>Verifikasi tanggal kedaluwarsa dan pastikan masih jauh</li>
                            <li>Hitung jumlah yang diterima dan bandingkan dengan pesanan</li>
                            <li>Dokumentasikan dengan foto jika ada ketidaksesuaian</li>
                            <li>Catat temuan penting dalam catatan pemeriksaan</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Item {currentItemIndex + 1} dari {receptionData.items.length}</p>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleItemStatus(currentItemIndex, 'rejected')}
                            disabled={!isItemFullyChecked(currentItem)}
                          >
                            <FaTimes className="mr-2 h-4 w-4" />
                            Tolak Item
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600"
                            onClick={() => handleItemStatus(currentItemIndex, 'approved')}
                            disabled={!isItemFullyChecked(currentItem)}
                          >
                            <FaCheck className="mr-2 h-4 w-4" />
                            Setujui Item
                          </Button>
                        </div>
                      </div>
                      {!isItemFullyChecked(currentItem) && (
                        <p className="text-amber-600 text-sm mt-2 flex items-center">
                          <FaExclamationTriangle className="mr-1 h-3 w-3" />
                          Semua checklist harus dicentang dan jumlah diterima harus diisi
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReceptionCheckForm;
