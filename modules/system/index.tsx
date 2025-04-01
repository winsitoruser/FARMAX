import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));

const SystemAdmin: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Sistem</h1>
      
      {/* Bagian Konfigurasi Tenant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Konfigurasi Tenant</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Daftar Tenant</h3>
              <p className="text-gray-500">Belum ada tenant terdaftar</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bagian Manajemen Akses */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manajemen Akses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Hak Akses Pengguna</h3>
              <p className="text-gray-500">Belum ada data pengguna</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SystemAdmin;
