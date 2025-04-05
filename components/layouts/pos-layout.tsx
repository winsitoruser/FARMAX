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
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <PosNavbar 
            scrolled={scrolled} 
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
    </div>
  );
};

export default PosLayout;
