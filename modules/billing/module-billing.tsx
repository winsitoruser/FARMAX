import React, { useState } from 'react';
import BillingLayout from './components/BillingLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionManagement } from './components/subscription-management';
import { PaymentHistory } from './components/payment-history';
import { InvoiceManagement } from './components/invoice-management';
import { PaymentSettings } from './components/payment-settings';
import { UsageAnalytics } from './components/usage-analytics';

export default function ModuleBilling() {
  const [activeTab, setActiveTab] = useState<string>("subscription");

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <BillingLayout title="Billing Management">
      <div className="space-y-6">
        {/* Content for Billing Management */}
        <Tabs 
          defaultValue="subscription" 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger 
              value="subscription" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger 
              value="invoice" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              Invoice
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              Payment History
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              Usage Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Subscription Management Tab */}
          <TabsContent value="subscription">
            <SubscriptionManagement />
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice">
            <InvoiceManagement />
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="history">
            <PaymentHistory />
          </TabsContent>

          {/* Usage Analytics Tab */}
          <TabsContent value="analytics">
            <UsageAnalytics />
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="settings">
            <PaymentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </BillingLayout>
  );
}
