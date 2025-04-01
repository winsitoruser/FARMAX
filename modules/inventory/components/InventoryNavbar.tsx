import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaBoxOpen, 
  FaClipboardList, 
  FaFileImport, 
  FaBalanceScale, 
  FaCalendarTimes, 
  FaChartBar, 
  FaCog 
} from 'react-icons/fa';

const InventoryNavbar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const navItems = [
    {
      label: 'Produk',
      href: '/inventory/products',
      icon: <FaBoxOpen className="w-4 h-4" />,
    },
    {
      label: 'Stok',
      href: '/inventory/stock',
      icon: <FaClipboardList className="w-4 h-4" />,
    },
    {
      label: 'Penerimaan',
      href: '/inventory/receive',
      icon: <FaFileImport className="w-4 h-4" />,
    },
    {
      label: 'Penyesuaian',
      href: '/inventory/adjustment',
      icon: <FaBalanceScale className="w-4 h-4" />,
    },
    {
      label: 'Stockopname',
      href: '/inventory/stocktake',
      icon: <FaClipboardList className="w-4 h-4" />,
    },
    {
      label: 'Kadaluarsa',
      href: '/inventory/expiry',
      icon: <FaCalendarTimes className="w-4 h-4" />,
    },
    {
      label: 'Laporan',
      href: '/inventory/reports',
      icon: <FaChartBar className="w-4 h-4" />,
    },
    {
      label: 'Pengaturan',
      href: '/inventory/settings',
      icon: <FaCog className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <div className="flex">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-center px-6 py-4 text-sm font-medium whitespace-nowrap
                  ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }
                `}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryNavbar;
