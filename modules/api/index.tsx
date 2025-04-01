import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));

const APIGatewayModule: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">API Gateway</h1>
      
      {/* Bagian Manajemen API */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Manajemen API</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Endpoint API</h3>
              <p className="text-gray-500">Belum ada endpoint terdaftar</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bagian Monitoring API */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Monitoring API</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Status API</h3>
              <p className="text-gray-500">Semua API berjalan normal</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default APIGatewayModule;
