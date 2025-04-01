import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FaBoxOpen, 
  FaListAlt, 
  FaWarehouse, 
  FaClipboardCheck, 
  FaExchangeAlt, 
  FaCalendarAlt, 
  FaBarcode, 
  FaChartLine, 
  FaPlus,
  FaSearch,
  FaBell,
  FaExclamationTriangle
} from "react-icons/fa";
import { formatRupiah } from "@/lib/utils";

// Import API service
import { inventoryAPI, InventoryStats } from "./services/inventory-api";

interface InventoryModuleProps {
  onNavigate: (path: string) => void;
}

const InventoryModule: React.FC<InventoryModuleProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InventoryStats | null>(null);

  // Fetch stats from API on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await inventoryAPI.getInventoryStats();
        setStats(response);
      } catch (error) {
        console.error("Error fetching inventory stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const inventoryFeatures = [
    {
      title: "Manajemen Produk",
      description: "Tambah, edit, dan hapus produk farmasi",
      icon: <FaBoxOpen className="h-8 w-8 text-orange-500" />,
      path: "/inventory/products",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Stok Masuk",
      description: "Catat dan kelola penerimaan barang",
      icon: <FaWarehouse className="h-8 w-8 text-orange-500" />,
      path: "/inventory/receive",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Penerimaan Barang",
      description: "Kelola penerimaan barang dari supplier",
      icon: <FaWarehouse className="h-8 w-8 text-orange-500" />,
      path: "/inventory/receptions",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Monitoring Stok",
      description: "Pantau dan kelola stok produk",
      icon: <FaClipboardCheck className="h-8 w-8 text-orange-500" />,
      path: "/inventory/stock",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Stock Opname",
      description: "Verifikasi stok fisik dengan sistem",
      icon: <FaClipboardCheck className="h-8 w-8 text-orange-500" />,
      path: "/inventory/stocktake",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Penyesuaian Stok",
      description: "Adjustment stok karena rusak atau hilang",
      icon: <FaExchangeAlt className="h-8 w-8 text-orange-500" />,
      path: "/inventory/adjustment",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Pelacakan Kadaluarsa",
      description: "Pantau produk yang mendekati kadaluarsa",
      icon: <FaCalendarAlt className="h-8 w-8 text-orange-500" />,
      path: "/inventory/expiry",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Master Data",
      description: "Kelola master data untuk inventory",
      icon: <FaListAlt className="h-8 w-8 text-orange-500" />,
      path: "/inventory/master",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    },
    {
      title: "Laporan Inventori",
      description: "Laporan stok, nilai inventori, dan analisis",
      icon: <FaChartLine className="h-8 w-8 text-orange-500" />,
      path: "/inventory/reports",
      color: "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
    }
  ];

  const filteredFeatures = inventoryFeatures.filter(
    feature => feature.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header dengan gradien orange/amber */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white shadow-md">
        {/* Elemen dekoratif berbentuk lingkaran dengan blur */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10 blur-xl transform translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white opacity-10 blur-xl transform -translate-x-20 translate-y-20"></div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Inventori</h1>
            <p className="mt-1 opacity-90">Kelola produk, stok, dan gudang apotek Anda</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Cari fitur inventori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white/20 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
            </div>
            <Button 
              className="bg-white text-orange-600 hover:bg-white/90 hover:text-orange-700"
              onClick={() => onNavigate("/inventory/products/new")}
            >
              <FaPlus className="mr-2 h-4 w-4" /> Produk Baru
            </Button>
          </div>
        </div>
      </div>

      {/* Statistik Inventori */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-orange-200 shadow-sm">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Total Produk</p>
                  <h3 className="text-2xl font-bold text-orange-900">{stats?.totalProducts.toLocaleString() || '-'}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaBoxOpen className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-orange-200 shadow-sm">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Nilai Inventori</p>
                  <h3 className="text-2xl font-bold text-orange-900">{formatRupiah(stats?.totalValue || 0)}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaChartLine className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-orange-200 shadow-sm">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Stok Minimum</p>
                  <h3 className="text-2xl font-bold text-orange-900">{stats?.lowStockCount || 0}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaExclamationTriangle className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-orange-200 shadow-sm">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-800">Mendekati Kadaluarsa</p>
                  <h3 className="text-2xl font-bold text-orange-900">{stats?.nearExpiryCount || 0}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                  <FaCalendarAlt className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search field for mobile */}
      <div className="md:hidden relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Cari fitur inventori..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Fitur Inventori */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFeatures.map((feature, index) => (
          <Card 
            key={index} 
            className="border-orange-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
            onClick={() => onNavigate(feature.path)}
          >
            <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Aktivitas Terbaru & Notifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-orange-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Pergerakan stok dan aktivitas inventori</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : stats?.recentMovements && stats.recentMovements.length > 0 ? (
              <div className="space-y-4">
                {stats.recentMovements.map((movement, i) => (
                  <div key={movement.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`p-2 rounded-full mr-3 ${
                      movement.type === 'in' ? 'bg-green-100' : 
                      movement.type === 'out' ? 'bg-red-100' : 
                      movement.type === 'adjustment' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {movement.type === 'in' ? (
                        <FaWarehouse className="h-4 w-4 text-green-600" />
                      ) : movement.type === 'out' ? (
                        <FaExchangeAlt className="h-4 w-4 text-red-600" />
                      ) : (
                        <FaExchangeAlt className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{movement.product?.name || `Product #${movement.productId}`}</div>
                      <div className="text-sm text-gray-500">
                        {movement.type === 'in' ? 'Stok Masuk' : 
                        movement.type === 'out' ? 'Stok Keluar' : 
                        movement.type === 'adjustment' ? 'Penyesuaian' : 'Stock Opname'}: {movement.quantity} unit
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(movement.createdAt).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Belum ada aktivitas inventori terbaru
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-orange-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
          <CardHeader>
            <CardTitle>Notifikasi Penting</CardTitle>
            <CardDescription>Peringatan dan notifikasi terkait inventori</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start pb-4 border-b border-gray-100">
                  <div className="p-2 rounded-full bg-yellow-100 mr-3">
                    <FaExclamationTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-medium">Stok Hampir Habis</div>
                    <div className="text-sm text-gray-500">
                      5 produk memiliki stok di bawah batas minimum
                    </div>
                    <Button variant="link" size="sm" className="h-6 p-0 text-orange-600" onClick={() => onNavigate('/inventory/products?filter=lowStock')}>
                      Lihat Produk
                    </Button>
                  </div>
                </div>
                <div className="flex items-start pb-4 border-b border-gray-100">
                  <div className="p-2 rounded-full bg-red-100 mr-3">
                    <FaCalendarAlt className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium">Produk Mendekati Kadaluarsa</div>
                    <div className="text-sm text-gray-500">
                      12 produk akan kadaluarsa dalam 30 hari ke depan
                    </div>
                    <Button variant="link" size="sm" className="h-6 p-0 text-orange-600" onClick={() => onNavigate('/inventory/expiry')}>
                      Lihat Produk
                    </Button>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaBell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Pemberitahuan Sistem</div>
                    <div className="text-sm text-gray-500">
                      Stock opname untuk bulan ini belum dilakukan
                    </div>
                    <Button variant="link" size="sm" className="h-6 p-0 text-orange-600" onClick={() => onNavigate('/inventory/stock-opname/new')}>
                      Mulai Stock Opname
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryModule;
