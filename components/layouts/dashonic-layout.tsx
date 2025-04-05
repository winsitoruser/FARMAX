import React, { useState, useEffect } from 'react';
import PosNavbar from '@/components/pos/pos-navbar';
import Footer from '@/components/shared/footer';
import { useRouter } from 'next/router';

interface DashonicLayoutProps {
  children: React.ReactNode;
}

const DashonicLayout: React.FC<DashonicLayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      // Keep window resize logic for responsiveness
      const width = window.innerWidth;
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* Header with Farmanesia logo */}
      <PosNavbar 
        scrolled={scrolled} 
        sidebarCollapsed={true} 
        toggleSidebar={() => {}} 
      />
      
      <div className="flex flex-1 pt-16">
        {/* Main Content - full width without sidebar */}
        <div className="flex-1 transition-all duration-300">
          <main className="p-4 md:p-6">
            <div className="max-w-[1280px] mx-auto">
              {children}
            </div>
          </main>
          
          <Footer themeColor="orange" />
        </div>
      </div>
    </div>
  );
};

export default DashonicLayout;
