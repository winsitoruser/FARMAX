import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { 
  FaBoxOpen, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCheck, 
  FaClock, 
  FaCalendarAlt,
  FaStar,
  FaExclamationTriangle
} from "react-icons/fa";
import { 
  getProductsBySupplier, 
  getPurchaseHistoryBySupplier, 
  getPaymentHistoryBySupplier, 
  getPerformanceBySupplier 
} from "../utils/supplier-relations";

interface SupplierRelationsProps {
  supplierId: string;
}

const SupplierRelations: React.FC<SupplierRelationsProps> = ({ supplierId }) => {
  const products = getProductsBySupplier(supplierId);
  const purchases = getPurchaseHistoryBySupplier(supplierId);
  const payments = getPaymentHistoryBySupplier(supplierId);
  const performance = getPerformanceBySupplier(supplierId);

  // Format date to Indonesian format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <FaBoxOpen className="mr-2 text-orange-500" /> Produk Terkait
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{products.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total produk dari supplier ini</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <FaShoppingCart className="mr-2 text-blue-500" /> Pembelian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{purchases.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total PO yang telah dibuat</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <FaMoneyBillWave className="mr-2 text-green-500" /> Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{payments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Total transaksi pembayaran</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 flex items-center">
              <FaChartLine className="mr-2 text-purple-500" /> Kinerja
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {performance ? `${performance.qualityScore}%` : "N/A"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Skor kualitas supplier</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-orange-50">
          <TabsTrigger value="products" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
            <FaBoxOpen className="mr-2 h-4 w-4" /> Produk
          </TabsTrigger>
          <TabsTrigger value="purchases" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
            <FaShoppingCart className="mr-2 h-4 w-4" /> Pembelian
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
            <FaMoneyBillWave className="mr-2 h-4 w-4" /> Pembayaran
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
            <FaChartLine className="mr-2 h-4 w-4" /> Kinerja
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="border rounded-md border-t-0 rounded-t-none">
          <div className="p-4">
            {products.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-50">
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga Beli</TableHead>
                    <TableHead>Harga Jual</TableHead>
                    <TableHead>Stok Min</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku || "-"}</TableCell>
                      <TableCell>{product.categoryId}</TableCell>
                      <TableCell>{product.purchasePrice ? formatRupiah(product.purchasePrice) : "-"}</TableCell>
                      <TableCell>{product.sellingPrice ? formatRupiah(product.sellingPrice) : "-"}</TableCell>
                      <TableCell>{product.minStock || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaBoxOpen className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p>Tidak ada produk terkait dengan supplier ini</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Purchases Tab */}
        <TabsContent value="purchases" className="border rounded-md border-t-0 rounded-t-none">
          <div className="p-4">
            {purchases.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-50">
                    <TableHead>No. PO</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-medium">{purchase.poNumber}</TableCell>
                      <TableCell>{formatDate(purchase.date)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            purchase.status === "complete" 
                              ? "bg-green-100 text-green-700 border-green-200" 
                              : purchase.status === "pending"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }
                        >
                          {purchase.status === "complete" && <FaCheck className="mr-1 h-3 w-3" />}
                          {purchase.status === "pending" && <FaClock className="mr-1 h-3 w-3" />}
                          {purchase.status === "canceled" && <FaExclamationTriangle className="mr-1 h-3 w-3" />}
                          {purchase.status === "complete" ? "Selesai" : 
                           purchase.status === "pending" ? "Diproses" : "Dibatalkan"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatRupiah(purchase.total)}</TableCell>
                      <TableCell>{purchase.items.length} item</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaShoppingCart className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p>Belum ada riwayat pembelian dari supplier ini</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="border rounded-md border-t-0 rounded-t-none">
          <div className="p-4">
            {payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-50">
                    <TableHead>No. Invoice</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Metode Pembayaran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>{formatRupiah(payment.amount)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            payment.status === "paid" 
                              ? "bg-green-100 text-green-700 border-green-200" 
                              : payment.status === "pending"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }
                        >
                          {payment.status === "paid" && <FaCheck className="mr-1 h-3 w-3" />}
                          {payment.status === "pending" && <FaClock className="mr-1 h-3 w-3" />}
                          {payment.status === "overdue" && <FaExclamationTriangle className="mr-1 h-3 w-3" />}
                          {payment.status === "paid" ? "Lunas" : 
                           payment.status === "pending" ? "Menunggu" : "Terlambat"}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaMoneyBillWave className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p>Belum ada riwayat pembayaran untuk supplier ini</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="border rounded-md border-t-0 rounded-t-none">
          <div className="p-4">
            {performance ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600 flex items-center">
                      <FaClock className="mr-2 text-orange-500" /> Lead Time Rata-rata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-700">{performance.avgLeadTime} hari</div>
                    <p className="text-xs text-gray-500 mt-1">Waktu pengiriman rata-rata</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600 flex items-center">
                      <FaCheck className="mr-2 text-blue-500" /> Tingkat Pemenuhan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-700">{performance.fulfillmentRate}%</div>
                    <p className="text-xs text-gray-500 mt-1">Persentase pesanan yang terpenuhi</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600 flex items-center">
                      <FaStar className="mr-2 text-green-500" /> Skor Kualitas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-700">{performance.qualityScore}/100</div>
                    <p className="text-xs text-gray-500 mt-1">Penilaian kualitas produk</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600 flex items-center">
                      <FaCalendarAlt className="mr-2 text-purple-500" /> Evaluasi Terakhir
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-purple-700">{formatDate(performance.lastEvaluationDate)}</div>
                    <p className="text-xs text-gray-500 mt-1">Tanggal evaluasi kinerja terakhir</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaChartLine className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                <p>Data kinerja tidak tersedia untuk supplier ini</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierRelations;
