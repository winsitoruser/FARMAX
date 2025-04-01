import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import DefectaList, { DefectItem } from './defecta-list';
import { DashboardPurchaseOrder } from './dashboard-purchase-order';
import { useToast } from "@/components/ui/use-toast";

// Komponen pengujian drag-drop sederhana
const SimpleDragDropTest: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("TEST DRAG START");
    e.dataTransfer.setData('text/plain', 'test-data');
    e.currentTarget.style.opacity = '0.5';
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("TEST DRAG END");
    e.currentTarget.style.opacity = '1';
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("TEST DRAG OVER");
    e.currentTarget.style.backgroundColor = '#fed7aa'; // orange-200
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("TEST DRAG LEAVE");
    e.currentTarget.style.backgroundColor = '#fff7ed'; // orange-50
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("TEST DROP");
    const data = e.dataTransfer.getData('text/plain');
    console.log("TEST DROP DATA:", data);
    e.currentTarget.style.backgroundColor = '#fff7ed'; // orange-50
    
    // Menampilkan alert untuk memastikan drop berhasil
    alert("Drop event berhasil! Data: " + data);
  };
  
  return (
    <div className="mb-4 p-4 border-2 border-orange-500 rounded-md">
      <h3 className="font-bold text-orange-600 mb-2">Test Drag and Drop</h3>
      <div className="flex gap-4">
        <div 
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="p-4 bg-orange-500 text-white rounded-md cursor-grab"
        >
          Drag Me
        </div>
        
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="p-4 bg-orange-50 border-2 border-dashed border-orange-300 rounded-md w-40 h-20 flex items-center justify-center"
        >
          Drop Here
        </div>
      </div>
    </div>
  );
};

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
    
    // Dispatch event to document
    document.dispatchEvent(customEvent);
    
    // Show notification
    toast({
      title: "Item ditambahkan",
      description: `${item.name} telah ditambahkan ke Purchase Order`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="relative">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Pembelian</h1>
            <p className="text-sm text-gray-500">Kelola defecta dan pesanan pembelian</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-red-500/10 to-orange-500/20 rounded-full blur-xl -z-10"></div>
        <div className="absolute top-10 right-12 h-8 w-8 bg-gradient-to-bl from-amber-500/40 to-orange-500/30 rounded-full blur-sm -z-10"></div>
      </div>

      {/* Quick Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-red-100 overflow-hidden relative bg-gradient-to-br from-white to-orange-50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/10 to-orange-500/20 rounded-full blur-xl -z-0"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">Pesanan Bulan Ini</p>
                <h4 className="text-2xl font-bold text-gray-900">42</h4>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
                12.5%
              </span>
              <span className="text-gray-500 ml-2">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Other cards omitted for brevity */}
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Defecta List */}
        <div className="lg:col-span-4">
          <Card className="border-red-100 shadow-md bg-gradient-to-br from-white to-orange-50/50 overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-red-500/10 to-orange-500/5 rounded-full blur-xl -z-0"></div>
            <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-tr from-amber-500/10 to-red-500/5 rounded-full blur-xl -z-0"></div>
            
            <CardHeader className="border-b border-red-100/50 pb-3 relative">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-sm mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Zm-12 0h.008v.008H6V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">Daftar Defecta</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">Tarik item ke formulir pesanan</p>
              
              {/* Decorative dots */}
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              </div>
            </CardHeader>
            
            <DefectaList onDragStart={handleDragStart} onAddItemToPO={handleAddDefectItemToPO} />
          </Card>
        </div>
        
        {/* Right column - Purchase Order Form */}
        <div className="lg:col-span-8">
          <DashboardPurchaseOrder ref={dashboardPORef} onOrderCreated={() => {
            toast({
              title: "Pesanan Berhasil Dibuat",
              description: "Pesanan pembelian telah berhasil dibuat",
              variant: "default",
            });
          }} />
        </div>
      </div>
      
      {/* Test component */}
      <SimpleDragDropTest />
    </div>
  );
}
