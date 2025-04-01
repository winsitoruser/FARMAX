import React from 'react'
import Footer from '../footer'
import Navbar from '../navbar'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen w-full">
      {/* Decorative top header with orange gradient */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 h-16 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white opacity-10 -mr-12 -mt-12"></div>
          <div className="absolute bottom-0 left-1/4 w-16 h-16 rounded-full bg-white opacity-10"></div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-white opacity-10"></div>
        </div>
        
        {/* Main navigation */}
        <Navbar />
      </div>
      
      {/* Main content */}
      <main className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>
      
      {/* Optional footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout