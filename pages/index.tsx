// Sistem Induk Farmanesia
import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { FaBoxes, FaDesktop, FaChartLine, FaUsers, FaShoppingCart, FaColumns } from 'react-icons/fa';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen w-full flex flex-col overflow-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-orange-300 opacity-20"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full bg-amber-400 opacity-20"></div>
          <div className="absolute top-40 left-1/4 w-48 h-48 rounded-full bg-orange-400 opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">FARMAX</h1>
            <p className="text-2xl md:text-3xl font-light mb-8">Sistem Manajemen Apotek Terpadu</p>
            <p className="text-xl mb-12 opacity-90">
              Kelola apotek Anda dengan lebih efisien, pantau persediaan, dan tingkatkan penjualan
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="bg-white text-orange-700 hover:bg-orange-50 font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-200 text-lg">
                Buka Dashboard
              </Link>
              <Link href="/pos" className="bg-orange-500 text-white hover:bg-orange-600 font-medium px-6 py-3 rounded-lg shadow-lg transition-all duration-200 border border-orange-400 text-lg">
                Akses POS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Fitur Utama</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* POS System */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 shadow-sm border border-amber-100 transition-all duration-200 hover:shadow-md">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaDesktop className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-amber-800">Point of Sale (POS)</h3>
              <p className="text-gray-600 mb-6">
                Sistem kasir yang mudah digunakan, dapat mengelola transaksi penjualan dengan cepat dan efisien.
              </p>
              <Link href="/pos" className="text-amber-600 hover:text-amber-700 font-medium">
                Buka POS →
              </Link>
            </div>
            
            {/* Inventory Management */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-200 hover:shadow-md">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaBoxes className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-orange-800">Manajemen Inventori</h3>
              <p className="text-gray-600 mb-6">
                Kelola stok produk, pantau persediaan, dan dapatkan peringatan untuk stok menipis.
              </p>
              <Link href="/inventory" className="text-orange-600 hover:text-orange-700 font-medium">
                Kelola Inventori →
              </Link>
            </div>
            
            {/* Purchase Management */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-200 hover:shadow-md">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-orange-800">Manajemen Pembelian</h3>
              <p className="text-gray-600 mb-6">
                Buat pesanan pembelian, kelola supplier, dan lacak status pesanan dengan mudah.
              </p>
              <Link href="/purchasing" className="text-orange-600 hover:text-orange-700 font-medium">
                Kelola Pembelian →
              </Link>
            </div>
            
            {/* Reports */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-200 hover:shadow-md">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaChartLine className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-orange-800">Laporan & Analisis</h3>
              <p className="text-gray-600 mb-6">
                Akses laporan penjualan, inventori, keuangan, dan metrik bisnis penting lainnya.
              </p>
              <Link href="/reports" className="text-orange-600 hover:text-orange-700 font-medium">
                Lihat Laporan →
              </Link>
            </div>
            
            {/* User Management */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-200 hover:shadow-md">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaUsers className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-orange-800">Manajemen Pengguna</h3>
              <p className="text-gray-600 mb-6">
                Kelola akun pengguna, atur peran, dan tentukan izin akses untuk tim Anda.
              </p>
              <Link href="/users" className="text-orange-600 hover:text-orange-700 font-medium">
                Kelola Pengguna →
              </Link>
            </div>
            
            {/* Dashboard */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 shadow-sm border border-orange-100 transition-all duration-200 hover:shadow-md">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <FaColumns className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-orange-800">Dashboard</h3>
              <p className="text-gray-600 mb-6">
                Lihat ringkasan bisnis Anda, performa penjualan, dan metrik penting lainnya.
              </p>
              <Link href="/dashboard" className="text-orange-600 hover:text-orange-700 font-medium">
                Buka Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gradient-to-r from-orange-800 to-amber-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">FARMAX</h3>
              <p className="text-orange-200 mt-1">Sistem Manajemen Apotek Terpadu</p>
            </div>
            <div className="text-orange-200">
              &copy; {new Date().getFullYear()} FARMAX. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;