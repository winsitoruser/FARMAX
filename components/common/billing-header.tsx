import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBars, 
  FaBell, 
  FaEnvelope, 
  FaSearch,
  FaFilePdf,
  FaCalculator
} from 'react-icons/fa';

const BillingHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[999] transition-all duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      {/* Top decorative gradient bar */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 h-1"></div>
      
      <div className="h-16 px-4">
        <div className="max-w-[1280px] relative z-10 h-full mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link className="flex items-center group" href="/dashboard">
              <div className="h-10 flex items-center justify-center group-hover:scale-105 transition-all duration-200">
                <img 
                  alt="Farmanesia Logo" 
                  width="48" 
                  height="48" 
                  decoding="async" 
                  data-nimg="1" 
                  className="object-contain" 
                  src="http://localhost:5004/assets/images/farmanesia.png" 
                  style={{ color: 'transparent' }} 
                />
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">
                  Farmanesia
                </h1>
                <p className="text-[10px] text-gray-500 -mt-1">Pharmacy System</p>
              </div>
            </Link>
          </div>

          <div className="flex-1 hidden md:flex justify-center max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Cari produk, supplier, atau transaksi..." 
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                value="" 
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link className="hidden md:block" href="/finance/billing">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg border-0 mr-1">
                <FaFilePdf className="mr-2 h-4 w-4" />
                Billing Management
              </button>
            </Link>

            <button className="relative p-2 rounded-md hover:bg-orange-50 text-gray-600 hover:text-orange-600">
              <FaCalculator className="h-5 w-5" />
            </button>

            <button 
              className="relative p-2 rounded-md hover:bg-orange-50 text-gray-600 hover:text-orange-600" 
              type="button" 
              id="radix-:r1c:" 
              aria-haspopup="menu" 
              aria-expanded="false" 
              data-state="closed"
            >
              <FaBell className="h-5 w-5" />
              <div className="rounded-md border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground shadow hover:bg-primary/80 absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-0 bg-orange-500">
                2
              </div>
            </button>

            <button 
              className="relative p-2 rounded-md hover:bg-orange-50 text-gray-600 hover:text-orange-600" 
              type="button" 
              id="radix-:r1g:" 
              aria-haspopup="menu" 
              aria-expanded="false" 
              data-state="closed"
            >
              <FaEnvelope className="h-5 w-5" />
              <div className="rounded-md border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground shadow hover:bg-primary/80 absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-0 bg-orange-500">
                3
              </div>
            </button>

            <button 
              className="flex items-center space-x-1 p-1 rounded-md hover:bg-orange-50" 
              type="button" 
              id="radix-:r1k:" 
              aria-haspopup="menu" 
              aria-expanded="false" 
              data-state="closed"
            >
              <span className="relative flex shrink-0 overflow-hidden rounded-full h-7 w-7 border border-gray-200">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs">
                  AP
                </span>
              </span>
              <svg 
                stroke="currentColor" 
                fill="currentColor" 
                strokeWidth="0" 
                viewBox="0 0 448 512" 
                className="h-3 w-3 text-gray-500" 
                height="1em" 
                width="1em" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
              </svg>
            </button>

            <button className="flex items-center justify-center ml-2 w-9 h-9 rounded-lg text-gray-600 bg-gray-100 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200">
              <FaBars />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BillingHeader;
