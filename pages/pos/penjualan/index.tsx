import dynamic from 'next/dynamic';
import PosLayout from "@/components/layouts/pos-layout";
import PosHeader from "@/components/pos/pos-header";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FaFileExport, FaChartBar, FaFileAlt } from "react-icons/fa";

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
  
  // Create POS header with action buttons
  const posHeader = (
    <PosHeader
      title="Penjualan"
      description="Laporan penjualan, statistik & analisis"
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Point of Sale", href: "/pos" },
        { title: "Penjualan", href: "/pos/penjualan" },
      ]}
      actionButtons={
        <>
          <Button size="sm" variant="secondary" className="bg-white hover:bg-gray-100 text-orange-600">
            <FaFileExport className="mr-2 h-4 w-4" />
            Export Laporan
          </Button>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
            <FaChartBar className="mr-2 h-4 w-4" />
            Analisis Lanjutan
          </Button>
        </>
      }
    />
  );
  
  return (
    <PosLayout pageHeader={posHeader}>
      {isMounted ? <SalesModule /> : <div className="p-8 text-center">Loading sales data...</div>}
    </PosLayout>
  )
}

export default SalesPage;
