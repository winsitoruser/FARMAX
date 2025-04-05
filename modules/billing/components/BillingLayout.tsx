import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import BillingHeader from '@/components/common/billing-header';
import CollapsedSidebar from '@/components/shared/collapsed-sidebar';
import useSidebar from '@/hooks/use-sidebar';
import Link from 'next/link';
import { 
  FaCreditCard, 
  FaHistory, 
  FaFileInvoice, 
  FaCog,
  FaChartLine
} from 'react-icons/fa';

interface BillingLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const BillingLayout: React.FC<BillingLayoutProps> = ({ 
  children, 
  title = "Billing Management | FARMAX", 
  description = "Kelola langganan, invoice, dan pembayaran untuk FARMAX POS Anda"
}) => {
  const { isOpen } = useSidebar();
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { name: 'Subscription', path: '/billing', icon: <FaCreditCard className="w-4 h-4" /> },
    { name: 'Invoice', path: '/billing/invoice', icon: <FaFileInvoice className="w-4 h-4" /> },
    { name: 'Payment History', path: '/billing/history', icon: <FaHistory className="w-4 h-4" /> },
    { name: 'Usage Analytics', path: '/billing/analytics', icon: <FaChartLine className="w-4 h-4" /> },
    { name: 'Payment Settings', path: '/billing/settings', icon: <FaCog className="w-4 h-4" /> }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-white">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Collapsible Sidebar */}
      <CollapsedSidebar />

      <div className={`flex flex-col ${isOpen ? 'ml-56' : 'ml-16'} transition-all duration-300 pt-[68px]`}>
        <BillingHeader />

        {/* Title and Navigation */}
        <div className="bg-white border-b border-orange-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 pt-3 pb-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-3">
              {title}
            </h1>
            
            <div className="flex space-x-1 overflow-x-auto pb-1.5 scrollbar-hide">
              {navItems.map((item) => {
                const isActive = 
                  item.path === '/billing' 
                    ? currentPath === '/billing' || currentPath === '/billing/index'
                    : currentPath === item.path;
                    
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      px-3 py-1.5 rounded-md flex items-center whitespace-nowrap text-sm font-medium
                      ${isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}
                      transition-all duration-200 hover:scale-105
                    `}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <main className="flex-grow py-6">
          <div className="max-w-7xl mx-auto px-4">
            {children}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">
                  {new Date().getFullYear()} FARMANESIA Solusi Bisnis Farmasi dan klinik anda 
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">Terms</a>
                <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">Privacy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BillingLayout;
