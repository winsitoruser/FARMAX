import React, { ReactNode, useEffect, useState } from 'react'
import Sidebar from './sidebar'
import SimpleHeader from './simple-header'
import Footer from './footer'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode;
  pageHeader?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, pageHeader }) => {
  const router = useRouter();
  const [showFooter, setShowFooter] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false); // Default to false for full-width layout
  const [showHeader, setShowHeader] = useState(true);
  
  useEffect(() => {
    // Check if we're in POS section
    const isPosSection = router.pathname.startsWith('/pos');
    const isDashboard = router.pathname === '/dashboard';
    
    // Don't show footer on kasir page
    setShowFooter(!router.pathname.includes('/pos/kasir') && !isDashboard);
    
    // Only show sidebar in POS section
    setShowSidebar(isPosSection);
    
    // Show header on all pages except POS section
    // Removed !isDashboard to show header on dashboard
    setShowHeader(!isPosSection);
    
    // Force a reflow to ensure proper rendering
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router.pathname]);

  return (
    <div className="flex w-full min-h-screen">
      {showSidebar && <Sidebar />}
      <div className="flex flex-col flex-1 w-full">
        {showHeader && !pageHeader && (
          <SimpleHeader
            title={getPageTitle(router.pathname)}
            subtitle={getPageSubtitle(router.pathname)}
            showBackButton={shouldShowBackButton(router.pathname)}
            backUrl={getBackUrl(router.pathname)}
          />
        )}
        {pageHeader && (
          <div className="w-full">
            {pageHeader}
          </div>
        )}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 w-full">
          {children}
        </main>
        {showFooter && <Footer themeColor="gray" />}
      </div>
    </div>
  );
};

// Helper functions to determine page title and subtitle based on route
const getPageTitle = (pathname: string): string => {
  if (pathname.includes('/inventory')) return 'Inventory Management';
  if (pathname.includes('/finance')) return 'Financial Management';
  if (pathname.includes('/products')) return 'Product Catalog';
  return 'FARMAX';
};

const getPageSubtitle = (pathname: string): string => {
  if (pathname.includes('/inventory')) return 'Manage your pharmacy inventory';
  if (pathname.includes('/finance')) return 'Track financial performance';
  if (pathname.includes('/products')) return 'Manage your product catalog';
  return 'Pharmacy Management System';
};

const shouldShowBackButton = (pathname: string): boolean => {
  // Show back button on detail pages but not on main section pages
  return pathname.includes('/detail/') || 
         pathname.includes('/edit/') || 
         pathname.includes('/add') ||
         (pathname.split('/').length > 2 && !pathname.endsWith('/'));
};

const getBackUrl = (pathname: string): string => {
  if (pathname.includes('/inventory')) return '/inventory';
  if (pathname.includes('/finance')) return '/finance';
  if (pathname.includes('/products')) return '/products';
  return '/dashboard';
};

export default Layout
