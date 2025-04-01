import dynamic from 'next/dynamic'
import Layout from '@/components/shared/layout'
import React from 'react'

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));
const StatDashboard = dynamic(() => import('@/components/common/stat'));

const DashboardAdmin = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dasbor Admin</h1>
      
      {/* Stats Overview */}
      <div className="mb-10">
        <StatDashboard />
      </div>
      
      {/* Main Content */}
      <div className="space-y-10">
        {/* Bagian Manajemen Mitra */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">Manajemen Mitra</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-5 shadow-md rounded-lg border border-gray-100 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Aktivitas Terbaru</h3>
                <div className="text-sm text-gray-500 flex-grow">
                  <p className="py-2">Belum ada aktivitas terbaru</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-5 shadow-md rounded-lg border border-gray-100 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Performa Mitra</h3>
                <div className="text-sm text-gray-500 flex-grow">
                  <p className="py-2">Data performa belum tersedia</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-5 shadow-md rounded-lg border border-gray-100 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Status Mitra</h3>
                <div className="text-sm text-gray-500 flex-grow">
                  <p className="py-2">Semua mitra aktif</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Bagian Pelaporan Global */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">Pelaporan Global</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 shadow-md rounded-lg border border-gray-100 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Laporan Penjualan</h3>
                <div className="text-sm text-gray-500 flex-grow">
                  <p className="py-2">Belum ada data penjualan</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-5 shadow-md rounded-lg border border-gray-100 h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Laporan Inventaris</h3>
                <div className="text-sm text-gray-500 flex-grow">
                  <p className="py-2">Belum ada data inventaris</p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default function HalamanDashboard() {
  return (
    <Layout>
      <DashboardAdmin />
    </Layout>
  )
}
