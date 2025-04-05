import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FaClipboardList, 
  FaShoppingCart, 
  FaHistory, 
  FaChartLine, 
  FaUserTie,
  FaArrowLeft,
  FaHome,
  FaTachometerAlt
} from 'react-icons/fa';
import FarmaxHeader from '@/components/common/farmax-header';

interface PurchasingPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const PurchasingPageLayout: React.FC<PurchasingPageLayoutProps> = ({
  children,
  title,
  description
}) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/purchasing', icon: <FaTachometerAlt className="w-4 h-4" /> },
    { name: 'Pemesanan Baru', path: '/purchasing?tab=new', icon: <FaClipboardList className="w-4 h-4" /> },
    { name: 'Pesanan Tertunda', path: '/purchasing?tab=pending', icon: <FaShoppingCart className="w-4 h-4" /> },
    { name: 'Riwayat Pesanan', path: '/purchasing?tab=history', icon: <FaHistory className="w-4 h-4" /> },
    { name: 'Analisis Supplier', path: '/purchasing?tab=analysis', icon: <FaChartLine className="w-4 h-4" /> },
    { name: 'Supplier', path: '/purchasing/suppliers', icon: <FaUserTie className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-white">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Circular gradient decorations */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/5 blur-xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-500/10 to-orange-500/5 blur-xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-red-500/5 to-orange-500/10 blur-xl"></div>
        
        {/* Pill pattern overlay */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      </div>

      {/* FARMAX Header */}
      <FarmaxHeader />
      
      {/* Navigation */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-1">
          <div className="flex space-x-1 overflow-x-auto pb-1.5 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = 
                item.path.includes('?tab=') 
                  ? currentPath === '/purchasing' && router.query.tab === item.path.split('?tab=')[1]
                  : currentPath === item.path;
                  
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    px-3 py-1.5 rounded-md flex items-center whitespace-nowrap text-sm font-medium
                    ${isActive 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' 
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
      <main className="flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Head>
            <title>{title} - FARMAX POS</title>
            <meta name="description" content={description || `Halaman ${title} untuk manajemen pembelian apotek`} />
          </Head>
          
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 bg-gradient-to-r from-red-500/5 to-orange-500/5 border-t border-orange-100 text-center text-sm text-gray-500 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p>FARMAX Apotek {new Date().getFullYear()} - Manajemen Pembelian</p>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PurchasingPageLayout;
