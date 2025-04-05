import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaEdit, FaArrowLeft, FaBox, FaHistory, FaBarcode, FaTrash, FaPrint, FaSave, FaPills } from "react-icons/fa";
import { formatRupiah } from "@/lib/utils";
import { inventoryAPI, Product, StockMovement } from "../services/inventory-api";
import { 
  DrugClassification, 
  getDrugClassInfo, 
  getDrugClassBadgeStyles 
} from "../utils/drug-classifications";

interface ProductDetailsProps {
  productId: string;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const productData = await inventoryAPI.getProductById(productId);
        setProduct(productData);

        // Fetch stock movements
        const movements = await inventoryAPI.getStockMovements({
          productId: productId,
          limit: 10,
        });
        setStockMovements(movements.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleDelete = async () => {
    if (!product) return;
    
    if (window.confirm(`Anda yakin ingin menghapus produk ${product.name}?`)) {
      try {
        await inventoryAPI.deleteProduct(productId);
        router.push("/inventory/products");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Terjadi kesalahan saat menghapus produk");
      }
    }
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="h-12 w-12 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-800">Produk tidak ditemukan</h3>
          <p className="mt-2 text-gray-600">Produk yang Anda cari tidak tersedia</p>
          <Button
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => router.push("/inventory/products")}
          >
            Kembali ke Daftar Produk
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header dengan gradien orange/amber */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-md">
        {/* Elemen dekoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 blur-xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-10 blur-xl transform -translate-x-20 translate-y-20"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4 text-white hover:bg-white/20"
              onClick={() => router.back()}
            >
              <FaArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge variant="outline" className="border-white text-white uppercase">
                  {product.category}
                </Badge>
                {product.drugClassification && (
                  <div className="ml-2 flex items-center">
                    <DrugClassificationSymbol classification={product.drugClassification} />
                  </div>
                )}
              </div>
              <p className="mt-1 opacity-90">Kode: {product.code}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-white/20 border-white text-white hover:bg-white/30"
              onClick={() => router.push(`/inventory/products/${productId}/edit`)}
            >
              <FaEdit className="mr-1 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="bg-white/20 border-white text-white hover:bg-white/30"
              onClick={handleDelete}
            >
              <FaTrash className="mr-1 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-orange-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Stok Saat Ini</p>
                <h3 className="text-2xl font-bold text-orange-900">{product.stockQty} {product.unit}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                <FaBox className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Harga Beli</p>
                <h3 className="text-2xl font-bold text-orange-900">{formatRupiah(product.buyPrice)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                <span className="text-orange-500 font-bold">Rp</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Harga Jual</p>
                <h3 className="text-2xl font-bold text-orange-900">{formatRupiah(product.sellPrice)}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                <span className="text-orange-500 font-bold">Rp</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Klasifikasi Obat</p>
                {product.drugClassification ? (
                  <div className="flex items-center mt-1">
                    <DrugClassificationSymbol classification={product.drugClassification} size="lg" />
                    <h3 className="ml-2 text-xl font-bold text-orange-900">
                      {getDrugClassInfo(product.drugClassification)?.name || '-'}
                    </h3>
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-orange-900">Belum Diklasifikasi</h3>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                <FaPills className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6 bg-orange-50 text-orange-900">
          <TabsTrigger value="info" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Informasi Produk
          </TabsTrigger>
          <TabsTrigger value="stock" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Riwayat Stok
          </TabsTrigger>
          <TabsTrigger value="barcode" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Barcode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle>Detail Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Kode Produk</p>
                  <p>{product.code}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Nama Produk</p>
                  <p>{product.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Kategori</p>
                  <p>{product.category} {product.subcategory ? `(${product.subcategory})` : ''}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Satuan</p>
                  <p>{product.unit} {product.packaging ? `(${product.packaging})` : ''}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Harga Beli</p>
                  <p>{formatRupiah(product.buyPrice)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Harga Jual</p>
                  <p>{formatRupiah(product.sellPrice)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Margin</p>
                  <p>{Math.round(((product.sellPrice - product.buyPrice) / product.buyPrice) * 100)}%</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge 
                    variant="outline" 
                    className={product.isActive 
                      ? "border-green-500 text-green-600" 
                      : "border-gray-500 text-gray-600"
                    }
                  >
                    {product.isActive ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Produsen</p>
                  <p>{product.manufacturer || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Supplier</p>
                  <p>{product.supplier || "-"}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Klasifikasi Obat</p>
                  {product.drugClassification ? (
                    <div className="flex items-center">
                      <DrugClassificationSymbol classification={product.drugClassification} />
                      <span className="ml-2">
                        {getDrugClassInfo(product.drugClassification)?.name || product.drugClassification}
                      </span>
                      {product.requiresPrescription && (
                        <Badge className="ml-2 bg-red-100 text-red-700 border border-red-300">
                          Wajib Resep
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p>-</p>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Tanggal Kadaluarsa</p>
                  <p>{formatDate(product.expiryDate)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Lokasi Penyimpanan</p>
                  <p>{product.location || "-"}</p>
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Deskripsi</p>
                  <p className="whitespace-pre-line">{product.description || "-"}</p>
                </div>

                <div className="col-span-2 space-y-1">
                  <p className="text-sm font-medium text-gray-500">Catatan</p>
                  <p className="whitespace-pre-line">{product.notes || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock">
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle>Riwayat Stok</CardTitle>
            </CardHeader>
            <CardContent>
              {stockMovements.length > 0 ? (
                <div className="space-y-4">
                  {stockMovements.map((movement) => (
                    <div key={movement.id} className="p-4 border rounded-lg hover:bg-orange-50">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${
                            movement.type === 'in' ? 'bg-green-100' : 
                            movement.type === 'out' ? 'bg-red-100' : 
                            movement.type === 'adjustment' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            <FaHistory className={`h-4 w-4 ${
                              movement.type === 'in' ? 'text-green-600' : 
                              movement.type === 'out' ? 'text-red-600' : 
                              movement.type === 'adjustment' ? 'text-yellow-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">
                              {movement.type === 'in' ? 'Stok Masuk' : 
                               movement.type === 'out' ? 'Stok Keluar' : 
                               movement.type === 'adjustment' ? 'Penyesuaian' : 'Stock Opname'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(movement.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            movement.type === 'in' ? 'text-green-600' : 
                            movement.type === 'out' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {movement.type === 'in' ? '+' : 
                             movement.type === 'out' ? '-' : 
                             movement.quantity >= 0 ? '+' : '-'} 
                            {Math.abs(movement.quantity)} {product.unit}
                          </p>
                          <p className="text-sm text-gray-500">
                            Sisa: {movement.remainingQty} {product.unit}
                          </p>
                        </div>
                      </div>
                      {(movement.notes || movement.batchNumber || movement.referenceId) && (
                        <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-600">
                          {movement.batchNumber && <p><span className="font-medium">Batch:</span> {movement.batchNumber}</p>}
                          {movement.referenceId && <p><span className="font-medium">Referensi:</span> {movement.referenceId}</p>}
                          {movement.notes && <p><span className="font-medium">Catatan:</span> {movement.notes}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FaHistory className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Belum ada riwayat stok</p>
                  <p className="mt-1">Riwayat pergerakan stok produk ini akan muncul di sini</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="barcode">
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle>Barcode Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10">
                {product.barcode ? (
                  <>
                    <div className="h-32 flex items-center justify-center border-2 border-dashed p-6 rounded-lg border-orange-200 mb-6">
                      <FaBarcode className="h-full w-auto text-gray-700" />
                    </div>
                    <p className="text-lg font-mono mb-6">{product.barcode}</p>
                    <div className="flex space-x-3">
                      <Button
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => {
                          // In a real app, this would trigger the barcode print
                          alert('Mencetak barcode...');
                        }}
                      >
                        <FaPrint className="mr-1 h-4 w-4" />
                        Cetak Barcode
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-32 w-full flex items-center justify-center border-2 border-dashed p-6 rounded-lg border-orange-200 mb-6">
                      <p className="text-gray-400">Belum ada barcode</p>
                    </div>
                    <Button
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={async () => {
                        try {
                          const result = await inventoryAPI.generateBarcode(productId);
                          // In a real app, this would update the product state
                          alert(`Barcode berhasil dibuat: ${result.barcode}`);
                          // You'd refresh the product data here
                        } catch (error) {
                          console.error("Error generating barcode:", error);
                          alert("Gagal membuat barcode");
                        }
                      }}
                    >
                      <FaBarcode className="mr-1 h-4 w-4" />
                      Generate Barcode
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Komponen untuk menampilkan simbol klasifikasi obat
const DrugClassificationSymbol = ({ 
  classification, 
  size = "md" 
}: { 
  classification: string, 
  size?: "sm" | "md" | "lg" 
}) => {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const getSymbolContent = () => {
    switch (classification) {
      case DrugClassification.FREE:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-black bg-green-500 flex items-center justify-center`} 
               title="Obat Bebas">
          </div>
        );
      case DrugClassification.LIMITED_FREE:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-black bg-blue-600 flex items-center justify-center`} 
               title="Obat Bebas Terbatas">
          </div>
        );
      case DrugClassification.PRESCRIPTION:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-black bg-red-500 flex items-center justify-center`} 
               title="Obat Keras">
            <span className="text-white font-bold" style={{ fontSize: size === "lg" ? "18px" : size === "md" ? "14px" : "10px" }}>K</span>
          </div>
        );
      case DrugClassification.PSYCHOTROPIC:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-red-600 bg-white flex items-center justify-center`} 
               title="Obat Psikotropika">
            <span className="text-red-600 font-bold" style={{ fontSize: size === "lg" ? "24px" : size === "md" ? "18px" : "14px" }}>+</span>
          </div>
        );
      case DrugClassification.NARCOTICS:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-red-600 bg-white flex items-center justify-center`} 
               title="Obat Narkotika">
            <span className="text-red-600 font-bold" style={{ fontSize: size === "lg" ? "24px" : size === "md" ? "18px" : "14px" }}>+</span>
          </div>
        );
      default:
        return (
          <div className={`${sizeClass[size]} rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center`} 
               title="Belum Diklasifikasi">
            <span className="text-gray-400">?</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-shrink-0 inline-flex">
      {getSymbolContent()}
    </div>
  );
};
