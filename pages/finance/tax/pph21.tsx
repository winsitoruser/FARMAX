import { NextPage } from "next";
import { useState } from "react";
import Link from "next/link";
import FinanceLayout from "@/components/layouts/finance-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FaIdCard, FaUser, FaUsers, FaBuilding, FaCalculator,
  FaFileInvoiceDollar, FaCalendarAlt, FaEdit, FaTrash, FaPlus,
  FaCheck, FaExclamationTriangle
} from "react-icons/fa";

const PPh21Page: NextPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data
  const employees = [
    { id: 1, name: "Budi Santoso", position: "Manager", status: "TK/0", grossSalary: 15000000, annualTax: 24000000 },
    { id: 2, name: "Dewi Lestari", position: "Supervisor", status: "K/1", grossSalary: 10000000, annualTax: 12000000 },
    { id: 3, name: "Ahmad Fauzi", position: "Staff", status: "K/2", grossSalary: 7000000, annualTax: 5400000 },
    { id: 4, name: "Siti Rahayu", position: "Staff", status: "K/0", grossSalary: 7000000, annualTax: 6000000 },
  ];

  const taxPayments = [
    { id: 1, period: "Januari 2025", amount: 3500000, status: "Dibayar", date: "15 Feb 2025" },
    { id: 2, period: "Februari 2025", amount: 3450000, status: "Dibayar", date: "14 Mar 2025" },
    { id: 3, period: "Maret 2025", amount: 3600000, status: "Belum Dibayar", dueDate: "15 Apr 2025" },
  ];

  return (
    <FinanceLayout>
      <div className="flex flex-col space-y-8 p-8 relative">
        {/* Decorative background element */}
        <div className="absolute top-24 right-12 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-amber-100/20 rounded-full blur-3xl -z-10" />
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">PPh 21 (Pajak Penghasilan)</h2>
            <p className="text-muted-foreground">Kelola pajak penghasilan karyawan & non-karyawan</p>
          </div>
          <div className="flex space-x-2">
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
            >
              <FaPlus className="mr-2 h-4 w-4" /> Tambah Karyawan
            </Button>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
            >
              <FaFileInvoiceDollar className="mr-2 h-4 w-4" /> Payroll Bulanan
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-orange-50 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">Overview</TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">Data Karyawan</TabsTrigger>
            <TabsTrigger value="calculations" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">Perhitungan Pajak</TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">Pembayaran Pajak</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-orange-700">Laporan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FaUsers className="mr-2 h-5 w-5 text-orange-500" />
                    Total Karyawan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{employees.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Terdaftar dalam sistem penggajian</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FaCalculator className="mr-2 h-5 w-5 text-orange-500" />
                    PPh 21 Bulanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Rp 3.600.000</div>
                  <p className="text-xs text-muted-foreground mt-1">Bulan Maret 2025</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <FaCalendarAlt className="mr-2 h-5 w-5 text-orange-500" />
                    Jatuh Tempo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold flex items-center">
                    <span>15 April 2025</span>
                    <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-700 bg-yellow-50">
                      <FaExclamationTriangle className="h-3 w-3 mr-1" /> 18 hari lagi
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pelaporan & Pembayaran PPh 21</p>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <CardHeader>
                <CardTitle>Pembayaran PPh 21 Terbaru</CardTitle>
                <CardDescription>Rekam jejak pembayaran pajak penghasilan</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Periode</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Bayar/Jatuh Tempo</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.period}</TableCell>
                        <TableCell>Rp {payment.amount.toLocaleString('id')}</TableCell>
                        <TableCell>
                          {payment.status === "Dibayar" ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <FaCheck className="h-3 w-3 mr-1" /> {payment.status}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
                              <FaExclamationTriangle className="h-3 w-3 mr-1" /> {payment.status}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{payment.date || payment.dueDate}</TableCell>
                        <TableCell className="text-right">
                          {payment.status !== "Dibayar" ? (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                            >
                              Bayar
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="border-orange-200 text-orange-700">
                              Lihat Bukti
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Daftar Karyawan</CardTitle>
                  <CardDescription>Kelola data karyawan untuk perhitungan PPh 21</CardDescription>
                </div>
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                >
                  <FaPlus className="mr-2 h-4 w-4" /> Tambah
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead>Status PTKP</TableHead>
                      <TableHead>Gaji Bruto</TableHead>
                      <TableHead>PPh 21 Tahunan</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.status}</TableCell>
                        <TableCell>Rp {employee.grossSalary.toLocaleString('id')}</TableCell>
                        <TableCell>Rp {employee.annualTax.toLocaleString('id')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                            <FaEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would display placeholder content for now */}
          <TabsContent value="calculations" className="text-center py-12">
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <CardContent className="p-12">
                <FaCalculator className="h-16 w-16 mx-auto text-orange-200" />
                <h3 className="mt-4 text-xl font-medium">Belum Ada Perhitungan Pajak</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Silakan pilih periode untuk memulai perhitungan PPh 21 karyawan.
                </p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                >
                  <FaCalculator className="mr-2 h-4 w-4" /> Hitung Pajak
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="text-center py-12">
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <CardContent className="p-12">
                <FaFileInvoiceDollar className="h-16 w-16 mx-auto text-orange-200" />
                <h3 className="mt-4 text-xl font-medium">Pembayaran PPh 21</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Lakukan dan lacak pembayaran PPh 21 bulanan Anda di sini.
                </p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                >
                  <FaPlus className="mr-2 h-4 w-4" /> Catat Pembayaran
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="text-center py-12">
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
              <CardContent className="p-12">
                <FaFileInvoiceDollar className="h-16 w-16 mx-auto text-orange-200" />
                <h3 className="mt-4 text-xl font-medium">Laporan PPh 21</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Buat dan unduh laporan PPh 21 bulanan atau tahunan Anda.
                </p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                >
                  <FaFileInvoiceDollar className="mr-2 h-4 w-4" /> Generate Laporan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FinanceLayout>
  );
};

export default PPh21Page;
