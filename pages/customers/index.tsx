import React, { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import CustomerLayout from "@/components/layouts/customer-layout";
import { useRouter } from 'next/router';

// Dynamically import the CRM module to prevent server-side rendering issues
const CRMModule = dynamic(
  () => import('@/modules/customers/module-crm'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-96">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-t-4 border-orange-500 border-r-4 border-r-transparent animate-spin"></div>
          <p className="mt-4 text-orange-500 font-medium">Loading CRM Module...</p>
        </div>
      </div>
    )
  }
);

const CustomersPage = () => {
  const router = useRouter();
  
  // Force refresh on mount
  useEffect(() => {
    const refreshPage = async () => {
      await router.replace(router.asPath);
    };
    
    if (typeof window !== 'undefined') {
      refreshPage();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Customer Management - Farmanesia POS</title>
        <meta name="description" content="Manage customers across multiple pharmacy branches" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <CustomerLayout>
        <div className="w-full max-w-7xl mx-auto" key={`customers-container-${Date.now()}`}>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-amber-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl pointer-events-none" />
          
          {/* Main Content */}
          <div className="relative z-10">
            <div className="mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 text-transparent bg-clip-text">Manajemen Pelanggan</h1>
              <p className="text-sm text-gray-500">Kelola pelanggan di semua cabang apotek</p>
            </div>
            
            <Suspense fallback={
              <div className="flex items-center justify-center w-full h-96">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-t-4 border-orange-500 border-r-4 border-r-transparent animate-spin"></div>
                  <p className="mt-4 text-orange-500 font-medium">Loading CRM Module...</p>
                </div>
              </div>
            }>
              <CRMModule />
            </Suspense>
          </div>
        </div>
      </CustomerLayout>
    </>
  );
};

export default CustomersPage;
