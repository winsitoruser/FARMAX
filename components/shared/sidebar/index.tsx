import useSidebar from "@/hooks/use-sidebar";
// import { Logo } from "@/public"
import Image from 'next/image';
import { cn } from "@/lib/utils";
import {
  AiFillSetting,
  AiOutlineBarcode,
  BiSolidTime,
  FaKitMedical, FaTruckMedical,
  FaUserNurse,
  IoCalendarNumber,
  MdArchive,
  MdDashboard, MdReportProblem, MdUnarchive, RiBillFill
} from "@/components/common/Icons";
import ItemSidebarKomponen, { ItemSidebar } from "./sidebar-item";
import SidebarToggle from "./sidebar-toggle";
// import DashboardIcon from "";


const itemNavigasiSidebar: ItemSidebar[] = [
  { title: "Dasbor", path: "/admin/dashboard", icon: "/icons/ic_round-dashboard.svg" },
  
  // Farmanesia Parent System
  {
    title: "Sistem Induk", path: "", icon: "/icons/solar_document-medicine-bold.svg", dropdown: [
      {
        title: 'Dasbor Admin',
        path: '/admin/dashboard',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Pusat Pemantauan',
        path: '/monitoring',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Admin Sistem',
        path: '/system',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },
  
  // Multi-tenant Management Layer
  {
    title: "Manajemen Multi-tenant", path: "", icon: "/icons/healthicons_medicines.svg", dropdown: [
      {
        title: 'Router Tenant',
        path: '/tenant',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Pengelola Peran',
        path: '/role',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Gateway API',
        path: '/api',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Agregator Data',
        path: '/data',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },

  // Partner ERP System Modules - Core Modules
  {
    title: "Modul Inti", path: "", icon: "/icons/fa6-solid_truck-medical.svg", dropdown: [
      {
        title: 'Sistem POS',
        path: '/core/pos',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Farmasi',
        path: '/core/pharmacy',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Inventaris',
        path: '/core/inventory',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Keuangan',
        path: '/core/finance',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Pengadaan',
        path: '/core/procurement',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'CRM',
        path: '/core/crm',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Laporan',
        path: '/core/reports',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Kepatuhan',
        path: '/core/compliance',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Admin',
        path: '/core/admin',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },

  // Partner ERP System Modules - Multi-branch Management
  {
    title: "Manajemen Multi-Cabang", path: "", icon: "/icons/solar_wallet-bold.svg", dropdown: [
      {
        title: 'Admin Cabang',
        path: '/multi-branch/branch-admin',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Transfer Stok',
        path: '/multi-branch/stock',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Perizinan',
        path: '/multi-branch/permissions',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Akses Silang',
        path: '/multi-branch/cross-access',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Penjualan Terpadu',
        path: '/multi-branch/sales',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Manajemen Staf',
        path: '/multi-branch/staff',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Laporan Cabang',
        path: '/multi-branch/reports',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Matriks Peran',
        path: '/multi-branch/role-matrix',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },

  // Data Layer
  {
    title: "Lapisan Data", path: "", icon: "/icons/solar_document-medicine-bold.svg", dropdown: [
      {
        title: 'Database Tenant',
        path: '/data-layer/tenant-db',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Gudang Data',
        path: '/data-layer/warehouse',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Penyimpanan Konfigurasi',
        path: '/data-layer/config',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },

  // Integration Layer
  {
    title: "Lapisan Integrasi", path: "", icon: "/icons/solar_document-medicine-bold.svg", dropdown: [
      {
        title: 'BPJS/Asuransi',
        path: '/integration/bpjs',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'BPOM',
        path: '/integration/bpom',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Gateway Pembayaran',
        path: '/integration/payment-gateway',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Sistem Eksternal',
        path: '/integration/external',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  }
];

const Sidebar = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen } = useSidebar();

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200",
      "transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      "w-[250px]",
      className
    )}>
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <h1 className="text-lg font-bold text-gray-800">Farmanesia</h1>
        </div>
        <SidebarToggle className="lg:hidden" />
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {itemNavigasiSidebar.map((item, index) => (
            <ItemSidebarKomponen key={index} item={item} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;