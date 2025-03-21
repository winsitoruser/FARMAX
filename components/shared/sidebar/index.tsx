import useSidebar from "@/hooks/use-sidebar";
import { Logo } from "@/public"
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
import SidebarItem from "./sidebar-item";
import SidebarToggle from "./sidebar-toggle";
// import DashboardIcon from "";


const sidebarNavItem = [
  { title: "Dashboard", path: "/", icon: "/icons/ic_round-dashboard.svg" },
  { title: "PoS", path: "/pos", icon: "/icons/fa6-solid_truck-medical.svg" },
  {
    title: "Keuangan", path: "", icon: "/icons/solar_wallet-bold.svg", dropdown: [
      {
        title: 'Dompet',
        path: '/keuangan',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Riwayat Dompet',
        path: '/keuangan/riwayat',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },
  {
    title: "Produk & Inventory", path: "", icon: "/icons/healthicons_medicines.svg", dropdown: [
      {
        title: 'List Produk & Stok (Dashboard)',
        path: '',
        icon: "/icons/material-symbols_circle-outline.svg",
        subdropdown: [
          {
            title: 'Laporan Kartu Stok',
            path: '/product-inventory/laporan-kartu-stok',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Mutasi Produk',
            path: '/product-inventory/mutasi-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Import Data Produk',
            path: '/product-inventory/import-data-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
        ],
      },
      {
        title: 'Stok Opname',
        path: '',
        icon: "/icons/material-symbols_circle-outline.svg",
        subdropdown: [
          {
            title: 'Laporan Stok Opname',
            path: '/product-inventory/stok-opname/laporan-stok-opname',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Produk yang Belum Stok Opname',
            path: '/product-inventory/stok-opname/produk-yang-belum-stok-opname',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
        ],
      },
      {
        title: 'Harga Jual',
        path: '',
        icon: "/icons/material-symbols_circle-outline.svg",
        subdropdown: [
          {
            title: 'Pengaturan Harga Jual Produk',
            path: '/product-inventory/harga-jual/pengaturan-harga-jual-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Riwayat Perubahan Harga',
            path: '/product-inventory/harga-jual/riwayat-perubahan-harga',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
        ],
      },
      {
        title: 'Stok Kosong dan Kadaluarsa',
        path: '',
        icon: "/icons/material-symbols_circle-outline.svg",
        subdropdown: [
          {
            title: 'Laporan Stok Kosong',
            path: '/product-inventory/stok-kosong-dan-kadaluarsa/laporan-stok-kosong',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Laporan Produk Kadaluarsa',
            path: '/product-inventory/stok-kosong-dan-kadaluarsa/laporan-produk-kadaluarsa',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
        ],
      },
      {
        title: 'Barcode',
        path: '/product-inventory/barcode',
        icon: "/icons/material-symbols_circle-outline.svg",
      }
    ]
  },
  { title: "Order Produk (PBF)", path: "/order-produk", icon: "/icons/lets-icons_order-fill.svg" },
  {
    title: "Jadwal Shift", path: "", icon: "/icons/solar_calendar-bold.svg", dropdown: [
      {
        title: 'Jadwal & Shift Pegawai',
        path: '/jadwal-shift/jadwal-and-shift-pegawai',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Pergantian Shift',
        path: '/jadwal-shift/pergantian-shift',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Laporan Pergantian Shift',
        path: '/jadwal-shift/laporan-pergantian-shift',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },
  {
    title: "Transaksi", path: "", icon: "/icons/mdi_report-box.svg", dropdown: [
      {
        title: 'Laporan Transaksi Obat',
        path: '/transaksi/laporan-transaksi-obat',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Laporan Transaksi Per Item Produk',
        path: '/transaksi/laporan-transaksi-per-item-produk',
        icon: "/icons/material-symbols_circle-outline.svg"
      },
      {
        title: 'Laporan Rugi/Laba',
        path: '/transaksi/laporan-rugi-laba',
        icon: "/icons/material-symbols_circle-outline.svg"
      }
    ]
  },
  {
    title: "Master Apotek", path: "", icon: "/icons/solar_document-medicine-bold.svg", dropdown: [
      {
        title: 'Data',
        path: '',
        icon: "/icons/material-symbols_circle-outline.svg",
        subdropdown: [
          {
            title: 'Data Suplier/Distributor',
            path: '/data/data-suplier-distributor',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Data Principal/Pabrik',
            path: '/data/data-principal-pabrik',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Data Lokasi Produk',
            path: '/data/data-lokasi-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Data Tata Letak Produk',
            path: '/data/data-tata-letak-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Data Kategori Produk',
            path: '/data/data-kategori-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Data Golongan Produk',
            path: '/data/data-golongan-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Data Kemasan Produk',
            path: '/data/data-kemasan-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Data Satuan Produk',
            path: '/data/data-satuan-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
        ],
      },
      {
        title: 'Laporan',
        path: '',
        icon: "/icons/material-symbols_circle-outline.svg",
        subdropdown: [
          {
            title: 'Laporan Principal/Pabrik',
            path: '/laporan/stok-opname/laporan-principal-pabrik',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Laporan Data Lokasi Produk',
            path: '/laporan/stok-opname/laporan-data-lokasi-produk',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
          {
            title: 'Laporan Data Supplier/Distributor',
            path: '/laporan/stok-opname/laporan-data-supplier-distributor',
            icon: "/icons/material-symbols_circle-outline.svg",
          },
        ],
      },
    ]
  },
  // { title: "Supplier", path: "/supplier", icon: FaTruckMedical },
  // { title: "Petugas", path: "/staff", icon: FaUserNurse },
  // { title: 'Penjualan', path: '/selling', icon: RiBillFill },
  // { title: 'Cetak Barcode', path: '/barcode', icon: AiOutlineBarcode },
  // { title: 'Jadwal', path: "/scheduler", icon: IoCalendarNumber },
  // {
  //   title: "Laporan", path: "#", icon: MdReportProblem, dropdown: [
  //     {
  //       title: 'Stok Opname',
  //       path: '/stock-opname',
  //       icon: FaKitMedical
  //     }, {
  //       title: 'Hampir Kadaluwarsa',
  //       path: '/expired',
  //       icon: MdReportProblem
  //     }, {
  //       title: 'Penerimaan Produk',
  //       path: '/goods-in',
  //       icon: MdArchive
  //     }, {
  //       title: 'Retur Produk',
  //       path: '/retur-product',
  //       icon: MdUnarchive
  //     }
  //   ]
  // },
  // {
  //   title: 'General Setting', path: '/general-setting', icon: AiFillSetting
  // }
];

export default function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar();

  return (
    <nav
      className={cn(
        `pb-12 border-r-2 h-screen sticky top-0 duration-500 bg-white`,
        isOpen ? "w-[23%]" : "w-[8%]",
        className
      )}
    >
      <div className="space-y-4 py-4 relative">
        <div className="pl-6 pr-6 py-2">
          <div className="flex justify-between items-center mb-3 pb-3">
            <h2
              className={cn(
                "text-2xl font-semibold tracking-tight duration-500",
                !isOpen && "hidden"
              )}
            >
              <Image src="/farmanesia.png" alt="Pharmacy Logo" width={150} height={50} />
            </h2>
            <SidebarToggle />
          </div>
          <hr />

          <div className="mt-8 space-y-1">
            {sidebarNavItem.map((item) => (
              <SidebarItem
                key={item.path}
                title={item.title}
                path={item.path}
                icon={item.icon}
                dropdown={item.dropdown}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}