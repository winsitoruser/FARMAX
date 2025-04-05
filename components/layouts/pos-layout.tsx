import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/components/shared/footer';
import { FaChevronLeft, FaChevronRight, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import PosNavbar from '@/components/pos/pos-navbar';

interface PosLayoutProps {
  children: React.ReactNode;
}

const PosLayout = ({ children }: PosLayoutProps) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    // Check if sidebar state is saved in localStorage
    const savedSidebarState = localStorage.getItem('pos_sidebar_collapsed');
    if (savedSidebarState) {
      setSidebarCollapsed(savedSidebarState === 'true');
    } else {
      // If no saved state, default to collapsed and save it
      localStorage.setItem('pos_sidebar_collapsed', 'true');
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle sidebar and save state to localStorage
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('pos_sidebar_collapsed', newState.toString());
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen fixed top-0 left-0 z-40 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link href="/dashboard">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-gray-600 flex items-center justify-center text-white font-bold">
                  F
                </div>
                {!sidebarCollapsed && (
                  <span className="ml-2 font-semibold text-gray-700">FARMAX</span>
                )}
              </div>
            </Link>
            
            {/* Toggle Sidebar Button - Replaced orange with gray */}
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Toggle Sidebar"
            >
              {sidebarCollapsed ? (
                <FaChevronRight className="h-3 w-3" />
              ) : (
                <FaChevronLeft className="h-3 w-3" />
              )}
            </button>
          </div>
          
          {/* Sidebar Nav Items */}
          <nav className="flex-1 pt-4 overflow-y-auto">
            <div className="px-3 space-y-1">
              {/* Each navigation item is conditionally rendered with gray styling */}
              <Link 
                href="/pos"
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  router.pathname === '/pos' 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center h-6 w-6">
                  <FaBars className="h-4 w-4" />
                </div>
                {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
              </Link>
              
              {/* Add more sidebar items here */}
              
            </div>
          </nav>
          
          {/* User Profile */}
          <div className="border-t border-gray-200 p-4">
            <div 
              className={`flex items-center ${
                sidebarCollapsed ? 'justify-center' : 'justify-start'
              }`}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {/* User avatar or initials */}
                <span className="text-xs font-medium text-gray-600">AD</span>
              </div>
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">Farmax</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <PosNavbar 
            scrolled={scrolled} 
            sidebarCollapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar}
            showBilling={true}
            showBusinessSettings={true}
          />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto pt-16">
          <div className="container mx-auto py-4 px-4">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
      
      {/* Drawer background overlay - will be visible when drawer is open */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default PosLayout;
