import PosLayout from "@/components/layouts/pos-layout";
import PosHeader from "@/components/pos/pos-header";
import { Button } from "@/components/ui/button";
import { FaPlus, FaFileExport } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PromoPage = () => {
  // Create POS header with action buttons
  const posHeader = (
    <PosHeader
      title="Promo & Diskon"
      description="Kelola promo, voucher, dan diskon untuk penjualan"
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Point of Sale", href: "/pos" },
        { title: "Promo", href: "/pos/promo" },
      ]}
      actionButtons={
        <>
          <Button size="sm" variant="secondary" className="bg-white hover:bg-gray-100 text-orange-600">
            <FaFileExport className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            <FaPlus className="mr-2 h-4 w-4" />
            Tambah Promo
          </Button>
        </>
      }
    />
  );
  
  return (
    <PosLayout pageHeader={posHeader}>
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
    </PosLayout>
  );
};

export default PromoPage;
