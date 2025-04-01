import React from 'react';
import InventoryLayout from '@/components/layouts/inventory-layout';

interface InventoryLayoutWrapperProps {
  children: React.ReactNode;
}

const InventoryLayoutWrapper: React.FC<InventoryLayoutWrapperProps> = ({ children }) => {
  return <InventoryLayout>{children}</InventoryLayout>;
};

export default InventoryLayoutWrapper;
