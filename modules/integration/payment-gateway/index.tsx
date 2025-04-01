import { FC } from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));

const PaymentGatewayModule: FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gateway Pembayaran</h1>
      
      {/* Bagian Konfigurasi Pembayaran */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Konfigurasi Pembayaran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Metode Pembayaran</h3>
              <p className="text-gray-500">Belum ada metode pembayaran terkonfigurasi</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Bagian Transaksi */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Riwayat Transaksi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="p-4">
              <h3 className="text-lg font-medium">Transaksi Terbaru</h3>
              <p className="text-gray-500">Belum ada data transaksi</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PaymentGatewayModule;
