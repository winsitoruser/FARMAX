import dynamic from 'next/dynamic';
import PosLayout from "@/components/layouts/pos-layout";
import { useEffect, useState } from 'react';
import ClientOnly from '@/components/common/client-only';

// Dynamically import the CustomerModule to avoid SSR issues
const CustomerModule = dynamic(() => import('../../../modules/pos/customer/module-customer'), {
  ssr: false,
  loading: () => (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading customer data...</h2>
      </div>
    </div>
  )
});

const CustomerPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Force reflow to ensure content is visible
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <PosLayout>
      <ClientOnly fallback={
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading customer data...</h2>
          </div>
        </div>
      }>
        {isMounted ? <CustomerModule /> : 
          <div className="p-8 flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary"></div>
              <h2 className="text-xl font-semibold text-gray-700">Loading customer data...</h2>
            </div>
          </div>
        }
      </ClientOnly>
    </PosLayout>
  )
}

export default CustomerPage;
