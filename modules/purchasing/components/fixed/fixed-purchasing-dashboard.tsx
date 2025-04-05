import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import FixedDefectaList from './fixed-defecta-list';
import FixedPurchaseOrder from './fixed-purchase-order';

export function FixedPurchasingDashboard() {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="relative">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
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
        <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-orange-500/10 to-amber-500/20 rounded-full blur-xl -z-10"></div>
        <div className="absolute top-10 right-12 h-8 w-8 bg-gradient-to-bl from-amber-500/40 to-orange-500/30 rounded-full blur-sm -z-10"></div>
      </div>

      {/* Quick Info Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-orange-100 overflow-hidden relative bg-gradient-to-br from-white to-orange-50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-amber-500/20 rounded-full blur-xl -z-0"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">Pesanan Bulan Ini</p>
                <h4 className="text-2xl font-bold text-gray-900">42</h4>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" />
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
        
        <Card className="border-green-100 overflow-hidden relative bg-gradient-to-br from-white to-green-50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/10 to-emerald-500/20 rounded-full blur-xl -z-0"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">Total Nilai Pesanan</p>
                <h4 className="text-2xl font-bold text-gray-900">Rp 24,5jt</h4>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
                8.3%
              </span>
              <span className="text-gray-500 ml-2">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 overflow-hidden relative bg-gradient-to-br from-white to-amber-50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-yellow-500/20 rounded-full blur-xl -z-0"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">Items Defecta</p>
                <h4 className="text-2xl font-bold text-gray-900">15</h4>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-amber-600 font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                5 mendesak
              </span>
              <span className="text-gray-500 ml-2">perlu tindakan segera</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column - Defecta List */}
        <div className="lg:col-span-5">
          <FixedDefectaList />
        </div>
        
        {/* Right column - PO Creation */}
        <div className="lg:col-span-7">
          <FixedPurchaseOrder />
        </div>
      </div>
    </div>
  );
}
