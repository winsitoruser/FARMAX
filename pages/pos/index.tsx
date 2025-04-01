import ModulePos from "@/modules/pos/module-pos";
import PosLayout from "@/components/layouts/pos-layout";
import { FaCashRegister, FaArrowRight, FaStar, FaHistory } from 'react-icons/fa';
import Link from 'next/link';

const PosPage = () => {
  return (
    <PosLayout>
      <ModulePos />
      <div className="container mx-auto max-w-7xl px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* POS Kasir Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="relative h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-lg flex items-center justify-center shadow-md">
                  <FaCashRegister size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">POS Kasir</h3>
                  <p className="text-sm text-gray-500">Sistem kasir untuk transaksi penjualan obat dan produk kesehatan</p>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link href="/pos/kasir" className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  <FaArrowRight className="mr-2" size={14} />
                  Buka Kasir
                </Link>
                <Link href="/pos/kasir-backup" className="inline-flex items-center rounded-lg bg-white border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 shadow-sm hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  <FaHistory className="mr-2" size={14} />
                  Versi Lama
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PosLayout>
  );
};

export default PosPage;