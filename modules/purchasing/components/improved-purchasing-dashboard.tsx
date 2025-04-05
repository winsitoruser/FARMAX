import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import DefectaList, { DefectItem } from './improved-defecta-list';
import { DashboardPurchaseOrder } from './dashboard-purchase-order';
import { useToast } from "@/components/ui/use-toast";
import { FaListAlt, FaClipboardCheck } from 'react-icons/fa';
import FarmaxHeader from '@/components/common/farmax-header';

export function PurchasingDashboard() {
  const { toast } = useToast();

  // State to hold the selected item from defecta to be moved to PO
  const [selectedDefectItem, setSelectedDefectItem] = useState<DefectItem | null>(null);
  
  // Reference to dashboard PO component
  const dashboardPORef = React.useRef<any>(null);
  
  // Handler for drag start event
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, item: DefectItem) => {
    // Pastikan data ditransfer dengan benar
    try {
      const data = {
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: item.purchasePrice,
        unit: item.unit || 'pcs'
      };
      
      e.dataTransfer.setData('text/plain', JSON.stringify(data));
      e.dataTransfer.setData('application/json', JSON.stringify(data));
      console.log('Data set in drag event:', data);
    } catch (error) {
      console.error('Error setting drag data:', error);
    }
  };
  
  // Handler for add defect item to PO
  const handleAddDefectItemToPO = (item: DefectItem) => {
    // Create our event data with all necessary information
    const customEvent = new CustomEvent('add-to-po', {
      detail: {
        id: item.id,
        name: item.name,
        sku: item.sku,
        price: item.purchasePrice,
        unit: item.unit || 'pcs',
        quantity: 1
      },
      bubbles: true,
      cancelable: true
    });
    
    // Emit the event on the document
    document.dispatchEvent(customEvent);
    
    // Show success notification
    toast({
      title: "Item ditambahkan ke PO",
      description: `${item.name} telah ditambahkan ke purchase order`,
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Farmmax Header */}
      <FarmaxHeader />
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <Card className="border-red-100 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden relative h-full">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-500"></div>
              <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-red-500/10 to-red-300/5 rounded-full blur-xl -z-0"></div>
              <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-red-500/10 to-orange-400/5 rounded-full blur-xl -z-0"></div>
              
              <CardHeader className="pb-2 border-b border-red-100/50 relative z-10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text flex items-center gap-2">
                  <span className="inline-block p-1.5 rounded-full bg-gradient-to-br from-red-600 to-red-500">
                    <FaListAlt className="h-4 w-4 text-white" />
                  </span>
                  Daftar Defekta
                </h2>
                <p className="text-sm text-gray-500">
                  Drag item dari daftar defekta ke form purchase order untuk menambahkannya
                </p>
              </CardHeader>
              
              <CardContent className="p-0">
                <DefectaList 
                  onDragStart={handleDragStart} 
                  onAddItemToPO={handleAddDefectItemToPO}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1">
            <Card className="border-red-100 shadow-lg bg-white/70 backdrop-blur-sm overflow-hidden relative h-full">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-500"></div>
              <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-red-500/10 to-red-300/5 rounded-full blur-xl -z-0"></div>
              <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-red-500/10 to-orange-400/5 rounded-full blur-xl -z-0"></div>
              
              <CardHeader className="pb-2 border-b border-red-100/50 relative z-10">
                <h2 className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-500 text-transparent bg-clip-text flex items-center gap-2">
                  <span className="inline-block p-1.5 rounded-full bg-gradient-to-br from-red-600 to-red-500">
                    <FaClipboardCheck className="h-4 w-4 text-white" />
                  </span>
                  Form Purchase Order
                </h2>
                <p className="text-sm text-gray-500">
                  Buat dan proses purchase order baru
                </p>
              </CardHeader>
              
              <CardContent className="p-4">
                <DashboardPurchaseOrder ref={dashboardPORef} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
