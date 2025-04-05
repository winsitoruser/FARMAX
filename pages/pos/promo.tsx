import PosLayout from "@/components/layouts/pos-layout";
import { Button } from "@/components/ui/button";
import { FaPlus, FaFileExport } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

const PromoPage = () => {
  return (
    <PosLayout>
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { title: "Dashboard", href: "/dashboard" },
              { title: "Point of Sale", href: "/pos" },
              { title: "Promo", href: "/pos/promo" },
            ]}
          />
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Promo & Diskon</h1>
            <p className="text-sm text-gray-500">Kelola promo, voucher, dan diskon untuk penjualan</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button size="sm" variant="secondary" className="bg-white hover:bg-gray-100 text-orange-600 border border-orange-200">
              <FaFileExport className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <FaPlus className="mr-2 h-4 w-4" />
              Tambah Promo
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <CardTitle className="text-lg font-medium text-orange-800">Promo Aktif</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Belum ada promo aktif saat ini. Silakan tambahkan promo baru dengan mengklik tombol &quot;Tambah Promo&quot; di atas.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <CardTitle className="text-lg font-medium text-orange-800">Riwayat Promo</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600">Riwayat promo yang pernah dibuat akan ditampilkan di sini.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PosLayout>
  );
};

export default PromoPage;
