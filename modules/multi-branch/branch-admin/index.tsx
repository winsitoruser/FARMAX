import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));

const BranchAdminModule: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Cabang</h1>
      
      {/* Bagian Manajemen Cabang */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manajemen Cabang</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Daftar Cabang</h3>
              <p className="text-gray-500">Belum ada data cabang</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bagian Performa Cabang */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Performa Cabang</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Statistik Cabang</h3>
              <p className="text-gray-500">Belum ada data statistik</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BranchAdminModule;
