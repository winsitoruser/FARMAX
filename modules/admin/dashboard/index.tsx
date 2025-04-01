import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));
const StatDashboard = dynamic(() => import('@/components/common/stat'));

const DashboardAdmin: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dasbor Admin</h1>
      
      {/* Bagian Manajemen Mitra */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manajemen Mitra</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <StatDashboard />
          </Card>
        </div>
      </section>

      {/* Bagian Pelaporan Global */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pelaporan Global</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-4">
            <StatDashboard />
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DashboardAdmin;
