import React, { useState } from 'react';
import BillingLayout from './components/BillingLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionManagement } from './components/subscription-management';
import { PaymentHistory } from './components/payment-history';
import { InvoiceManagement } from './components/invoice-management';
import { PaymentSettings } from './components/payment-settings';
import { UsageAnalytics } from './components/usage-analytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCreditCard, FaFileInvoice, FaHistory, FaChartLine, FaCog } from 'react-icons/fa';

export default function ModuleBilling() {
  const [activeTab, setActiveTab] = useState<string>("subscription");

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Tab data untuk konsistensi
  const tabsData = [
    {
      id: 'subscription',
      label: 'Subscription',
      icon: <FaCreditCard className="mr-2 h-4 w-4" />,
      component: <SubscriptionManagement />
    },
    {
      id: 'invoice',
      label: 'Invoice',
      icon: <FaFileInvoice className="mr-2 h-4 w-4" />,
      component: <InvoiceManagement />
    },
    {
      id: 'history',
      label: 'Payment History',
      icon: <FaHistory className="mr-2 h-4 w-4" />,
      component: <PaymentHistory />
    },
    {
      id: 'analytics',
      label: 'Usage Analytics',
      icon: <FaChartLine className="mr-2 h-4 w-4" />,
      component: <UsageAnalytics />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FaCog className="mr-2 h-4 w-4" />,
      component: <PaymentSettings />
    }
  ];

  return (
    <BillingLayout title="Billing Management">
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-orange-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">Billing & Subscription</CardTitle>
            <CardDescription>
              Kelola langganan, lihat riwayat pembayaran, dan atur preferensi billing untuk FARMAX POS Anda
            </CardDescription>
          </CardHeader>
        </Card>
        
        {/* Main Navigation Tabs */}
        <Tabs 
          defaultValue="subscription" 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-orange-50 p-1 rounded-xl">
            {tabsData.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="flex items-center justify-center data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          {tabsData.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="p-1">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </BillingLayout>
  );
}
