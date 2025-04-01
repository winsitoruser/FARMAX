import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FaMicroscope, 
  FaTimes, 
  FaBoxOpen, 
  FaClipboardCheck, 
  FaCamera, 
  FaFlask, 
  FaInfoCircle, 
  FaSave, 
  FaFilePdf, 
  FaFileExcel, 
  FaDownload
} from "react-icons/fa";

interface ProductInspectionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

// Data mock untuk inspeksi produk
const mockProductData = {
  id: "prod001",
  name: "Paracetamol 500mg",
  code: "PARA-500",
  quantity: 50,
  unit: "Box",
  price: 35000,
  batchNumber: "PCM-2025-03",
  manufacturingDate: "2025-03-15",
  expiryDate: "2027-03-30",
  manufacturer: "PT Kimia Farma",
  receptionId: "rcpt001",
  invoiceNumber: "INV20250330001",
  poNumber: "PO20250325001",
  supplier: "PT Kimia Farma",
  receptionDate: "2025-03-30"
};

const ProductInspectionDetail: React.FC<ProductInspectionDetailProps> = ({ 
  isOpen, 
  onClose, 
  productId 
}) => {
  // State untuk tab aktif
  const [activeTab, setActiveTab] = useState<string>("detail");
  
  // State untuk upload gambar
  const [images, setImages] = useState<string[]>([]);
  
  // State untuk kondisi pemeriksaan
  const [conditions, setConditions] = useState({
    packageGood: true,
    quantityMatches: true,
    qualityStandard: true,
    expiryDateMatches: true,
    sealBroken: false,
    colorSmellChanged: false
  });
  
  // State untuk catatan
  const [notes, setNotes] = useState({
    inspection: "",
    visual: "",
    lab: ""
  });
  
  // State untuk status lab
  const [labStatus, setLabStatus] = useState<string>("complete");
  
  // Handler untuk perubahan kondisi
  const handleConditionChange = (condition: keyof typeof conditions, value: boolean) => {
    setConditions(prev => ({
      ...prev,
      [condition]: value
    }));
  };
  
  // Handler untuk perubahan catatan
  const handleNotesChange = (noteType: keyof typeof notes, value: string) => {
    setNotes(prev => ({
      ...prev,
      [noteType]: value
    }));
  };
  
  // Handler untuk menyimpan hasil inspeksi
  const handleSave = () => {
    console.log("Menyimpan hasil inspeksi produk:", {
      productId,
      conditions,
      notes,
      labStatus,
      images
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div className="flex flex-col h-[90vh]">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <FaMicroscope className="mr-2 h-5 w-5" />
              <DialogTitle className="text-lg font-semibold">Inspeksi Detail Produk</DialogTitle>
            </div>
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
          
          <div className="flex-1 overflow-auto bg-white p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header dengan info penerimaan */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-md mb-6 shadow-sm border border-orange-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Detail Penerimaan</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">No. Faktur:</p>
                    <p className="font-medium">{mockProductData.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tanggal:</p>
                    <p className="font-medium">{new Date(mockProductData.receptionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Supplier:</p>
                    <p className="font-medium">{mockProductData.supplier}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">No. PO:</p>
                    <p className="font-medium">{mockProductData.poNumber}</p>
                  </div>
                </div>
              </div>
              
              {/* Tab untuk beralih antara tampilan */}
              <Tabs defaultValue="detail" className="mb-6" onValueChange={setActiveTab} value={activeTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="detail" className="font-medium">
                    <FaInfoCircle className="mr-2 h-4 w-4" />
                    Detail Produk
                  </TabsTrigger>
                  <TabsTrigger value="visual" className="font-medium">
                    <FaCamera className="mr-2 h-4 w-4" />
                    Inspeksi Visual
                  </TabsTrigger>
                  <TabsTrigger value="lab" className="font-medium">
                    <FaFlask className="mr-2 h-4 w-4" />
                    Hasil Lab
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="detail" className="space-y-6">
                  {/* Detail produk */}
                  <Card className="shadow-sm border-orange-100">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardTitle className="text-md flex items-center">
                        <FaBoxOpen className="mr-2 h-4 w-4 text-orange-500" />
                        Informasi Produk
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm text-gray-500">Nama Produk</Label>
                              <p className="font-medium text-lg">{mockProductData.name}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Kode Produk</Label>
                              <p className="font-medium">{mockProductData.code}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Jumlah</Label>
                              <p className="font-medium">{mockProductData.quantity} {mockProductData.unit}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Harga</Label>
                              <p className="font-medium">Rp {mockProductData.price.toLocaleString('id-ID')} / {mockProductData.unit}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm text-gray-500">No. Batch</Label>
                              <p className="font-medium">{mockProductData.batchNumber}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Tanggal Produksi</Label>
                              <p className="font-medium">{new Date(mockProductData.manufacturingDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Tanggal Kadaluarsa</Label>
                              <p className="font-medium">{new Date(mockProductData.expiryDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <Label className="text-sm text-gray-500">Produsen</Label>
                              <p className="font-medium">{mockProductData.manufacturer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-orange-100">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardTitle className="text-md flex items-center">
                        <FaClipboardCheck className="mr-2 h-4 w-4 text-orange-500" />
                        Pemeriksaan Kondisi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="condition1" 
                              checked={conditions.packageGood}
                              onCheckedChange={(checked) => handleConditionChange('packageGood', checked as boolean)}
                            />
                            <Label htmlFor="condition1" className="font-medium">Kondisi Kemasan Baik</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="condition2" 
                              checked={conditions.quantityMatches}
                              onCheckedChange={(checked) => handleConditionChange('quantityMatches', checked as boolean)}
                            />
                            <Label htmlFor="condition2" className="font-medium">Jumlah Sesuai</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="condition3" 
                              checked={conditions.qualityStandard}
                              onCheckedChange={(checked) => handleConditionChange('qualityStandard', checked as boolean)}
                            />
                            <Label htmlFor="condition3" className="font-medium">Kualitas Sesuai Standar</Label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="condition4" 
                              checked={conditions.expiryDateMatches}
                              onCheckedChange={(checked) => handleConditionChange('expiryDateMatches', checked as boolean)}
                            />
                            <Label htmlFor="condition4" className="font-medium">Kadaluarsa Sesuai</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="condition5" 
                              checked={conditions.sealBroken}
                              onCheckedChange={(checked) => handleConditionChange('sealBroken', checked as boolean)}
                            />
                            <Label htmlFor="condition5" className="font-medium">Segel Rusak</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="condition6" 
                              checked={conditions.colorSmellChanged}
                              onCheckedChange={(checked) => handleConditionChange('colorSmellChanged', checked as boolean)}
                            />
                            <Label htmlFor="condition6" className="font-medium">Perubahan Warna/Bau</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="notes" className="text-sm text-gray-500">Catatan Pemeriksaan</Label>
                        <Textarea 
                          id="notes" 
                          placeholder="Tambahkan catatan hasil pemeriksaan..." 
                          className="mt-1"
                          value={notes.inspection}
                          onChange={(e) => handleNotesChange('inspection', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="visual">
                  <Card className="shadow-sm border-orange-100">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardTitle className="text-md flex items-center">
                        <FaCamera className="mr-2 h-4 w-4 text-orange-500" />
                        Dokumentasi Visual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center h-48">
                          <FaCamera className="h-8 w-8 text-gray-300 mb-2" />
                          <p className="text-sm text-gray-500 mb-2">Tambahkan foto</p>
                          <Button variant="outline" size="sm">Upload</Button>
                        </div>
                        <div className="border border-gray-200 rounded-md overflow-hidden h-48">
                          <div className="bg-gray-100 h-full flex items-center justify-center">
                            <img src="https://placehold.co/300x200/orange/white?text=Foto+Produk" alt="Placeholder" className="object-cover max-h-full" />
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-md overflow-hidden h-48">
                          <div className="bg-gray-100 h-full flex items-center justify-center">
                            <img src="https://placehold.co/300x200/orange/white?text=Foto+Kemasan" alt="Placeholder" className="object-cover max-h-full" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="visual-notes" className="text-sm text-gray-500">Catatan Inspeksi Visual</Label>
                        <Textarea 
                          id="visual-notes" 
                          placeholder="Tambahkan catatan hasil inspeksi visual..." 
                          className="mt-1"
                          value={notes.visual}
                          onChange={(e) => handleNotesChange('visual', e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="lab">
                  <Card className="shadow-sm border-orange-100">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardTitle className="text-md flex items-center">
                        <FaFlask className="mr-2 h-4 w-4 text-orange-500" />
                        Hasil Pengujian Laboratorium
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-500">Status Pengujian</Label>
                          <Select value={labStatus} onValueChange={setLabStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Menunggu Pengujian</SelectItem>
                              <SelectItem value="process">Sedang Diuji</SelectItem>
                              <SelectItem value="complete">Pengujian Selesai</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">Hasil Pengujian</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <p className="text-sm font-medium">Kadar Zat Aktif</p>
                              <div className="flex items-center mt-1">
                                <Progress value={96} className="h-2 flex-1 mr-2" />
                                <span className="text-sm font-medium">96%</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Standar: 95-105%</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Disolusi</p>
                              <div className="flex items-center mt-1">
                                <Progress value={98} className="h-2 flex-1 mr-2" />
                                <span className="text-sm font-medium">98%</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Standar: &gt;80% dalam 30 menit</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Keseragaman Bobot</p>
                              <div className="flex items-center mt-1">
                                <Progress value={95} className="h-2 flex-1 mr-2" />
                                <span className="text-sm font-medium">95%</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Standar: CV &lt; 5%</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">pH</p>
                              <div className="flex items-center mt-1">
                                <Progress value={90} className="h-2 flex-1 mr-2" />
                                <span className="text-sm font-medium">5.2</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Standar: 5.0-5.5</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="lab-notes" className="text-sm text-gray-500">Catatan Laboratorium</Label>
                          <Textarea 
                            id="lab-notes" 
                            placeholder="Tambahkan catatan hasil pengujian laboratorium..." 
                            className="mt-1"
                            value={notes.lab}
                            onChange={(e) => handleNotesChange('lab', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">Dokumen Pengujian</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                              <div className="flex items-center">
                                <FaFilePdf className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-sm">Hasil_Uji_PCM-2025-03.pdf</span>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <FaDownload className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                              <div className="flex items-center">
                                <FaFileExcel className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm">Data_Pengujian_PCM-2025-03.xlsx</span>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <FaDownload className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={onClose}>Kembali</Button>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                  onClick={handleSave}
                >
                  <FaSave className="mr-2 h-4 w-4" />
                  Simpan Hasil Pemeriksaan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductInspectionDetail;
