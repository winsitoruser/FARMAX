import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FarmaxHeader from '@/components/common/farmax-header';
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
}

const BillingLayout: React.FC<BillingLayoutProps> = ({ children, title = "Billing Management" }) => {
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
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Circular gradient decorations */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/5 blur-xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-500/10 to-orange-500/5 blur-xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-orange-500/5 to-amber-500/10 blur-xl"></div>
        
        {/* Pill pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      </div>

      {/* FARMAX Header */}
      <FarmaxHeader />
      
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

      {/* Main Content */}
      <div className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-orange-100 py-3 text-center text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4">
          FARMAX Billing System &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default BillingLayout;
