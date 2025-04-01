import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewPurchaseOrder } from './components/new-purchase-order'
import { PendingOrders } from './components/pending-orders'
import { OrderHistory } from './components/order-history'
import { SupplierAnalysis } from './components/supplier-analysis'
import { PurchasingDashboard } from './components/purchasing-dashboard'
import PurchasingPageLayout from './components/PurchasingPageLayout'

export default function ModulePurchasing() {
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <PurchasingPageLayout title="Manajemen Pemesanan">
      <div className="space-y-8">
        {/* Main content with tabs */}
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Pemesanan Baru
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Pesanan Tertunda
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Riwayat Pesanan
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">
              Analisis Supplier
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6">
            <PurchasingDashboard />
          </TabsContent>

          {/* New Purchase Order Tab */}
          <TabsContent value="new" className="mt-6">
            <NewPurchaseOrder />
          </TabsContent>

          {/* Pending Orders Tab */}
          <TabsContent value="pending" className="mt-6">
            <PendingOrders />
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="history" className="mt-6">
            <OrderHistory />
          </TabsContent>

          {/* Supplier Analysis Tab */}
          <TabsContent value="analysis" className="mt-6">
            <SupplierAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </PurchasingPageLayout>
  )
}
