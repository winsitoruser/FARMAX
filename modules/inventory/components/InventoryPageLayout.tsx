import React, { ReactNode } from 'react';
import Head from 'next/head';
import InventoryLayout from '@/components/layouts/inventory-layout';

interface InventoryPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const InventoryPageLayout: React.FC<InventoryPageLayoutProps> = ({
  children,
  title,
  description
}) => {
  return (
    <InventoryLayout>
      <Head>
        <title>{title} - FARMAX POS</title>
        <meta name="description" content={description || `Halaman ${title} untuk manajemen inventaris apotek`} />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
    </InventoryLayout>
  );
};

export default InventoryPageLayout;
