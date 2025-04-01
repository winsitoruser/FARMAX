import { NextPage } from "next";
import { useState } from "react";
import FinanceLayout from "@/components/layouts/finance-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FaCalculator, FaFileAlt, FaPlus, FaFileExport, 
  FaSearch, FaFilter, FaCalendarAlt, FaChartBar 
} from "react-icons/fa";

const PPNPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <FinanceLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PPN (Pajak Pertambahan Nilai)</h1>
            <p className="text-gray-600">Pengelolaan Pajak Pertambahan Nilai</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button 
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <FaFileExport className="mr-2 h-4 w-4" />
              Export SPT
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Transaksi Baru
            </Button>
          </div>
        </div>
        
        {/* PPN Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-orange-50 p-1 border border-orange-100">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="input" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              PPN Masukan
            </TabsTrigger>
            <TabsTrigger 
              value="output" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              PPN Keluaran
            </TabsTrigger>
            <TabsTrigger 
              value="report" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white font-medium"
            >
              Laporan
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-orange-100 overflow-hidden neo-shadow relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full opacity-20 transform translate-x-12 -translate-y-12 blur-md"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-100 rounded-full opacity-30 transform -translate-x-14 translate-y-14 blur-md"></div>
                
                {/* Top decorative bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                
                <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-base font-bold text-orange-800">PPN Keluaran (Output VAT)</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-orange-800">Rp 28.750.000</div>
                  <div className="text-sm text-gray-600 mt-1">87 Transaksi Penjualan</div>
                  
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Periode Pajak: Maret 2025</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-orange-100 overflow-hidden neo-shadow relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full opacity-20 transform translate-x-12 -translate-y-12 blur-md"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-100 rounded-full opacity-30 transform -translate-x-14 translate-y-14 blur-md"></div>
                
                {/* Top decorative bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                
                <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-base font-bold text-orange-800">PPN Masukan (Input VAT)</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-orange-800">Rp 15.250.000</div>
                  <div className="text-sm text-gray-600 mt-1">53 Transaksi Pembelian</div>
                  
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Periode Pajak: Maret 2025</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-orange-100 overflow-hidden neo-shadow relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full opacity-20 transform translate-x-12 -translate-y-12 blur-md"></div>
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-amber-100 rounded-full opacity-30 transform -translate-x-14 translate-y-14 blur-md"></div>
                
                {/* Top decorative bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
                
                <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-base font-bold text-orange-800">Kurang Bayar</CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="text-3xl font-bold text-red-600">Rp 13.500.000</div>
                  <div className="text-sm text-gray-600 mt-1">Jatuh Tempo: 15 April 2025</div>
                  
                  <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                      Generate Bukti Bayar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="border-orange-100 overflow-hidden neo-shadow relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-20 transform translate-x-16 -translate-y-16 blur-md"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-100 rounded-full opacity-30 transform -translate-x-16 translate-y-16 blur-md"></div>
              
              {/* Top decorative bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              
              <CardHeader className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold text-orange-800">Transaksi Terbaru</CardTitle>
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                    <FaSearch className="mr-2 h-3 w-3" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-orange-50">
                    <TableRow>
                      <TableHead className="text-orange-800">Tanggal</TableHead>
                      <TableHead className="text-orange-800">No. Faktur</TableHead>
                      <TableHead className="text-orange-800">Deskripsi</TableHead>
                      <TableHead className="text-orange-800">Tipe</TableHead>
                      <TableHead className="text-orange-800 text-right">DPP</TableHead>
                      <TableHead className="text-orange-800 text-right">PPN</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-orange-50">
                      <TableCell>28/03/2025</TableCell>
                      <TableCell>FP-010001</TableCell>
                      <TableCell>Penjualan Obat</TableCell>
                      <TableCell>Keluaran</TableCell>
                      <TableCell className="text-right">Rp 10.000.000</TableCell>
                      <TableCell className="text-right font-medium">Rp 1.100.000</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-orange-50">
                      <TableCell>27/03/2025</TableCell>
                      <TableCell>FP-010002</TableCell>
                      <TableCell>Pembelian Stok Vitamin</TableCell>
                      <TableCell>Masukan</TableCell>
                      <TableCell className="text-right">Rp 5.000.000</TableCell>
                      <TableCell className="text-right font-medium">Rp 550.000</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-orange-50">
                      <TableCell>26/03/2025</TableCell>
                      <TableCell>FP-010003</TableCell>
                      <TableCell>Penjualan Peralatan Kesehatan</TableCell>
                      <TableCell>Keluaran</TableCell>
                      <TableCell className="text-right">Rp 8.500.000</TableCell>
                      <TableCell className="text-right font-medium">Rp 935.000</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-orange-50">
                      <TableCell>25/03/2025</TableCell>
                      <TableCell>FP-010004</TableCell>
                      <TableCell>Pembelian Alat Kesehatan</TableCell>
                      <TableCell>Masukan</TableCell>
                      <TableCell className="text-right">Rp 7.200.000</TableCell>
                      <TableCell className="text-right font-medium">Rp 792.000</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-orange-50">
                      <TableCell>24/03/2025</TableCell>
                      <TableCell>FP-010005</TableCell>
                      <TableCell>Penjualan Obat Resep</TableCell>
                      <TableCell>Keluaran</TableCell>
                      <TableCell className="text-right">Rp 12.300.000</TableCell>
                      <TableCell className="text-right font-medium">Rp 1.353.000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Placeholder for other tabs */}
          <TabsContent value="input" className="space-y-4">
            <Card className="border-orange-100 overflow-hidden neo-shadow">
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <CardContent className="p-8 text-center">
                <FaCalculator className="h-16 w-16 mx-auto text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">PPN Masukan (Input VAT)</h3>
                <p className="text-gray-600 mb-6">Kelola faktur pajak masukan dari pembelian dan pengeluaran perusahaan</p>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  <FaPlus className="mr-2 h-4 w-4" />
                  Tambah Faktur Masukan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="output" className="space-y-4">
            <Card className="border-orange-100 overflow-hidden neo-shadow">
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <CardContent className="p-8 text-center">
                <FaFileAlt className="h-16 w-16 mx-auto text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">PPN Keluaran (Output VAT)</h3>
                <p className="text-gray-600 mb-6">Kelola faktur pajak keluaran dari penjualan dan pendapatan perusahaan</p>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  <FaPlus className="mr-2 h-4 w-4" />
                  Tambah Faktur Keluaran
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="report" className="space-y-4">
            <Card className="border-orange-100 overflow-hidden neo-shadow">
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
              <CardContent className="p-8 text-center">
                <FaChartBar className="h-16 w-16 mx-auto text-orange-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Laporan SPT Masa PPN</h3>
                <p className="text-gray-600 mb-6">Generate dan export laporan SPT Masa PPN untuk pelaporan pajak</p>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  <FaFileExport className="mr-2 h-4 w-4" />
                  Generate Laporan PPN
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceLayout>
  );
};

export default PPNPage;
