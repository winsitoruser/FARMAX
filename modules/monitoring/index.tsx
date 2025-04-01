import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));

const MonitoringCenter: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pusat Monitoring</h1>
      
      {/* Bagian Pelacakan Aktivitas */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pelacakan Aktivitas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Aktivitas Terkini</h3>
              <p className="text-gray-500">Belum ada data aktivitas</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bagian Analitik Mitra */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Analitik Lintas Mitra</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Performa Mitra</h3>
              <p className="text-gray-500">Belum ada data performa</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MonitoringCenter;
