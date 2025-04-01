import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));

const TenantDatabaseModule: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Database Tenant</h1>
      
      {/* Bagian Manajemen Database */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manajemen Database</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Status Database</h3>
              <p className="text-gray-500">Semua database berjalan normal</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bagian Backup */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Backup & Restore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Jadwal Backup</h3>
              <p className="text-gray-500">Backup otomatis setiap hari pukul 00:00</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TenantDatabaseModule;
