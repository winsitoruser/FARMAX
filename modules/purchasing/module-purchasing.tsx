import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewPurchaseOrder } from './components/new-purchase-order'
import { PendingOrders } from './components/pending-orders'
import { OrderHistory } from './components/order-history'
import { SupplierAnalysis } from './components/supplier-analysis'
import { PurchasingDashboard } from './components/improved-purchasing-dashboard'
import PurchasingPageLayout from './components/PurchasingPageLayout'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ModulePurchasing() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>("dashboard")
  
  // Read tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['dashboard', 'new', 'pending', 'history', 'analysis'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])
  
  // Update document title based on active tab
  useEffect(() => {
    const titles = {
      dashboard: "Dashboard Pembelian",
      new: "Pemesanan Baru",
      pending: "Pesanan Tertunda",
      history: "Riwayat Pesanan",
      analysis: "Analisis Supplier"
    };
    
    document.title = `FARMAX - ${titles[activeTab as keyof typeof titles] || "Purchasing"}`;
  }, [activeTab]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL without reloading the page
    const newUrl = `${window.location.pathname}?tab=${value}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  return (
    <PurchasingPageLayout title="Manajemen Pemesanan">
      <div className="relative w-full overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-bl from-red-500/10 to-red-300/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-gradient-to-tr from-red-600/10 to-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-20 w-96 h-96 bg-gradient-to-tl from-red-500/10 to-red-300/5 rounded-full blur-3xl"></div>

        {/* Main content with tabs */}
        <div className="relative z-10 space-y-8">
          <Card className="border-red-100 shadow-lg bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-0">
              <div className="w-full h-1 bg-gradient-to-r from-red-700 via-red-500 to-orange-400 mb-4"></div>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-500 bg-clip-text text-transparent">
                  Pembelian & Pemesanan
                </CardTitle>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {new Date().toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-red-50 p-1">
                  <TabsTrigger 
                    value="dashboard" 
                    className="text-red-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-md data-[state=active]:shadow-red-500/20
                    hover:bg-red-100/50 transition-all"
                  >
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="new" 
                    className="text-red-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-md data-[state=active]:shadow-red-500/20
                    hover:bg-red-100/50 transition-all"
                  >
                    Pemesanan Baru
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className={`text-red-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-md data-[state=active]:shadow-red-500/20
                    hover:bg-red-100/50 transition-all ${activeTab === 'pending' ? 'ring-2 ring-red-300 ring-offset-1' : ''}`}
                  >
                    Pesanan Tertunda
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className="text-red-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-md data-[state=active]:shadow-red-500/20
                    hover:bg-red-100/50 transition-all"
                  >
                    Riwayat Pesanan
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analysis" 
                    className="text-red-800 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-700 data-[state=active]:to-red-500 
                    data-[state=active]:text-white data-[state=active]:font-medium
                    data-[state=active]:shadow-md data-[state=active]:shadow-red-500/20
                    hover:bg-red-100/50 transition-all"
                  >
                    Analisis Supplier
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-6 relative">
                  <TabsContent value="dashboard" className="border-none p-0">
                    <PurchasingDashboard />
                  </TabsContent>
                  
                  <TabsContent value="new" className="border-none p-0">
                    <NewPurchaseOrder />
                  </TabsContent>
                  
                  <TabsContent value="pending" className="border-none p-0">
                    <PendingOrders />
                  </TabsContent>
                  
                  <TabsContent value="history" className="border-none p-0">
                    <OrderHistory />
                  </TabsContent>
                  
                  <TabsContent value="analysis" className="border-none p-0">
                    <SupplierAnalysis />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PurchasingPageLayout>
  )
}
