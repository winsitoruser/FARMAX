import React, { ReactNode } from 'react';
import Head from 'next/head';
import FarmaxHeader from '@/components/common/farmax-header';
import CollapsedSidebar from '@/components/shared/collapsed-sidebar';
import useSidebar from '@/hooks/use-sidebar';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'FARMAX Pharmacy Management System',
  description = 'Modern pharmacy management system for streamlined operations',
  showHeader = true,
  showFooter = true,
}) => {
  const { isOpen } = useSidebar();
  
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

      <div className={`flex flex-col ${isOpen ? 'ml-56' : 'ml-16'} transition-all duration-300`}>
        {showHeader && <FarmaxHeader />}

        <main className="flex-grow">
          {children}
        </main>

        {showFooter && (
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
        )}
      </div>
    </div>
  );
};

export default MainLayout;
