import dynamic from 'next/dynamic';
import PosLayout from "@/components/layouts/pos-layout";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FaFileExport, FaChartBar, FaFileAlt } from "react-icons/fa";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

// Dynamically import the SalesModule to avoid SSR issues
const SalesModule = dynamic(() => import('../../../modules/pos/sales/module-sales'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading sales data...</div>
});

const SalesPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <PosLayout>
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { title: "Dashboard", href: "/dashboard" },
              { title: "Point of Sale", href: "/pos" },
              { title: "Penjualan", href: "/pos/penjualan" },
            ]}
          />
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Penjualan</h1>
            <p className="text-sm text-gray-500">Laporan penjualan, statistik & analisis</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button size="sm" variant="secondary" className="bg-white hover:bg-gray-100 text-orange-600 border border-orange-200">
              <FaFileAlt className="mr-2 h-4 w-4" />
              Laporan Bulanan
            </Button>
            <Button size="sm" variant="secondary" className="bg-white hover:bg-gray-100 text-orange-600 border border-orange-200">
              <FaChartBar className="mr-2 h-4 w-4" />
              Analisis
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <FaFileExport className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Sales Module */}
        {isMounted && <SalesModule />}
      </div>
    </PosLayout>
  );
};

export default SalesPage;
