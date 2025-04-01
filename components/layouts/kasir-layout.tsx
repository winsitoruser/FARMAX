import React from 'react';
import { FaArrowLeft, FaCashRegister, FaChartLine, FaUsers, FaPercent, FaBoxes, FaStore, FaUserClock } from 'react-icons/fa';
import Link from 'next/link';
import PosNavbar from '@/components/pos/pos-navbar';
import Footer from '@/components/shared/footer';

interface KasirLayoutProps {
  children: React.ReactNode;
}

const KasirLayout = ({ children }: KasirLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      {/* POS Navbar - now sticky */}
      <PosNavbar />
      
      {/* Main Content - add padding-top to account for sticky header */}
      <div className="flex-1 flex flex-col h-full pt-16 md:pt-20">
        {/* Page Content */}
        <div className="flex-1 overflow-auto px-4 py-6 bg-orange-50/30">
          <Link href="/pos" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
            <FaArrowLeft className="mr-2" />
            <span>Kembali ke Dashboard</span>
          </Link>
          
          {/* Menu Grid Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <Link className="block h-full" href="/pos/kasir">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                <div className="p-4 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <FaCashRegister height="28" width="28" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Kasir</h3>
                  <p className="text-xs text-orange-100">Proses transaksi penjualan</p>
                </div>
              </div>
            </Link>
            
            <Link className="block h-full" href="/pos/penjualan">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                <div className="p-4 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <FaChartLine height="28" width="28" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Penjualan</h3>
                  <p className="text-xs text-orange-100">Laporan penjualan</p>
                </div>
              </div>
            </Link>
            
            <Link className="block h-full" href="/pos/customer">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                <div className="p-4 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <FaUsers height="28" width="28" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Customer</h3>
                  <p className="text-xs text-orange-100">Kelola data pelanggan</p>
                </div>
              </div>
            </Link>
            
            <Link className="block h-full" href="/pos/promo">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                <div className="p-4 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <FaPercent height="28" width="28" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Promo</h3>
                  <p className="text-xs text-orange-100">Kelola promosi</p>
                </div>
              </div>
            </Link>
            
            <Link className="block h-full" href="/pos/inventory">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                <div className="p-4 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <FaBoxes height="28" width="28" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Inventory</h3>
                  <p className="text-xs text-orange-100">Kelola stok barang</p>
                </div>
              </div>
            </Link>
            
            <Link className="block h-full" href="/pos/toko-online">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                <div className="p-4 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <FaStore height="28" width="28" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Toko Online</h3>
                  <p className="text-xs text-orange-100">Kelola toko online</p>
                </div>
              </div>
            </Link>
            
            <Link className="block h-full" href="/pos/jadwal">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                <div className="p-4 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
                    <FaUserClock height="28" width="28" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">Jadwal Karyawan</h3>
                  <p className="text-xs text-orange-100">Atur jadwal karyawan</p>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Main Content */}
          {children}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default KasirLayout;
