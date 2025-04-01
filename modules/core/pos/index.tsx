import { FC } from 'react';
import dynamic from 'next/dynamic';

const Layout = dynamic(() => import('@/components/shared/layout').then(mod => mod.default));

export const POSModule: FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Sistem POS</h1>
      {/* Fungsionalitas POS yang sudah ada akan diintegrasikan di sini */}
    </div>
  );
};

export default POSModule;
