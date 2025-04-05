import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaChartLine, FaShoppingCart, FaUsers, FaCog, FaNotesMedical, FaExchangeAlt, FaCreditCard, FaBoxes } from 'react-icons/fa';
import Link from 'next/link';

export default function Dashboard() {
  // Data untuk panel statistik
  const stats = [
    { id: 1, title: 'Pendapatan Hari Ini', value: 'Rp 5,240,000', change: '+12.5%', icon: <FaChartLine className="w-5 h-5 text-white" /> },
    { id: 2, title: 'Transaksi Hari Ini', value: '42', change: '+8.2%', icon: <FaExchangeAlt className="w-5 h-5 text-white" /> },
    { id: 3, title: 'Pelanggan Baru', value: '8', change: '+4.5%', icon: <FaUsers className="w-5 h-5 text-white" /> },
    { id: 4, title: 'Stok Hampir Habis', value: '12', change: '-2.3%', icon: <FaBoxes className="w-5 h-5 text-white" /> },
  ];

  // Data untuk menu akses cepat
  const quickAccess = [
    { id: 1, title: 'Point of Sale', icon: <FaShoppingCart className="w-6 h-6" />, path: '/pos', color: 'from-orange-600 to-amber-500' },
    { id: 2, title: 'Manajemen Stok', icon: <FaBoxes className="w-6 h-6" />, path: '/inventory', color: 'from-orange-500 to-amber-400' },
    { id: 3, title: 'Transaksi & Pesanan', icon: <FaExchangeAlt className="w-6 h-6" />, path: '/transactions', color: 'from-amber-500 to-orange-400' },
    { id: 4, title: 'Customer Management', icon: <FaUsers className="w-6 h-6" />, path: '/customers', color: 'from-amber-400 to-orange-500' },
    { id: 5, title: 'Purchasing', icon: <FaShoppingCart className="w-6 h-6" />, path: '/purchasing', color: 'from-orange-400 to-amber-500' },
    { id: 6, title: 'Billing & Payments', icon: <FaCreditCard className="w-6 h-6" />, path: '/billing', color: 'from-orange-500 to-amber-400' },
    { id: 7, title: 'Inventory Reports', icon: <FaChartLine className="w-6 h-6" />, path: '/reports', color: 'from-amber-500 to-orange-500' },
    { id: 8, title: 'Settings', icon: <FaCog className="w-6 h-6" />, path: '/settings', color: 'from-amber-400 to-orange-400' },
  ];

  // Data untuk tabel transaksi terakhir
  const recentTransactions = [
    { id: 'TRX-001', customer: 'Budi Santoso', date: '04 Apr, 14:30', amount: 'Rp 124,500', status: 'Selesai' },
    { id: 'TRX-002', customer: 'Siti Aminah', date: '04 Apr, 13:45', amount: 'Rp 235,000', status: 'Selesai' },
    { id: 'TRX-003', customer: 'Ahmad Hidayat', date: '04 Apr, 12:10', amount: 'Rp 87,500', status: 'Selesai' },
    { id: 'TRX-004', customer: 'Dewi Lestari', date: '04 Apr, 11:30', amount: 'Rp 345,000', status: 'Proses' },
    { id: 'TRX-005', customer: 'Joko Widodo', date: '04 Apr, 10:15', amount: 'Rp 76,000', status: 'Selesai' },
  ];

  return (
    <MainLayout title="Dashboard - FARMAX">
      <div className="container mx-auto px-4 py-6 max-w-[1280px]">
        {/* Page Title */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview aktifitas bisnis Anda</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-sm h-9 px-4 border-orange-200 hover:bg-orange-50 text-orange-700">
              <FaNotesMedical className="mr-1.5 h-4 w-4" />
              Laporan
            </Button>
            <Button className="text-sm h-9 px-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white border-none">
              Aksi Cepat
            </Button>
          </div>
        </div>

        {/* Quick Access Menu */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Akses Cepat</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickAccess.map((item) => (
              <Link href={item.path} key={item.id}>
                <Card className="border-none shadow hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer h-[120px]">
                  <div className="h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                  <CardContent className="flex flex-col items-center justify-center p-4 h-full">
                    <div className={`bg-gradient-to-br ${item.color} p-3 rounded-full mb-3 shadow`}>
                      <div className="text-white">{item.icon}</div>
                    </div>
                    <h3 className="text-sm font-medium text-center text-gray-700">{item.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Tables Section - Only Recent Transactions */}
        <Card className="border-none shadow-md w-full">
          <div className="h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold">Transaksi Terakhir</CardTitle>
              <Button variant="link" className="text-xs text-orange-600 hover:text-orange-700 p-0">
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b text-left">
                    <th className="py-2 text-xs font-medium text-gray-500">ID</th>
                    <th className="py-2 text-xs font-medium text-gray-500">Pelanggan</th>
                    <th className="py-2 text-xs font-medium text-gray-500">Tanggal</th>
                    <th className="py-2 text-xs font-medium text-gray-500 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-orange-50 cursor-pointer">
                      <td className="py-2.5 text-gray-700">{tx.id}</td>
                      <td className="py-2.5 text-gray-700">{tx.customer}</td>
                      <td className="py-2.5 text-gray-500 text-xs">{tx.date}</td>
                      <td className="py-2.5 text-gray-700 font-medium text-right">{tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Circular decorative elements */}
        <div className="fixed -bottom-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 blur-2xl opacity-50 z-0"></div>
        <div className="fixed -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 blur-3xl opacity-40 z-0"></div>
      </div>
    </MainLayout>
  );
}
