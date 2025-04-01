import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));

const PharmacyModule: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Modul Farmasi</h1>
      
      {/* Bagian Manajemen Obat */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manajemen Obat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Daftar Obat</h3>
              <p className="text-gray-500">Belum ada data obat</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bagian Resep */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manajemen Resep</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Resep Terbaru</h3>
              <p className="text-gray-500">Belum ada data resep</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PharmacyModule;
