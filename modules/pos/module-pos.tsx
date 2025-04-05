import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  FaMoneyBillWave, FaShoppingCart, FaExclamationTriangle, FaUserFriends, 
  FaBoxOpen, FaChartLine, FaChartPie, FaUsers, FaCalendarAlt, 
  FaClipboardList, FaArrowUp, FaArrowDown, FaStore, FaWallet,
  FaTag, FaCreditCard, FaTachometerAlt, FaFileInvoiceDollar, FaChartBar,
  FaSort, FaSortUp, FaSortDown, FaInfoCircle, FaSearch, FaCheck, FaFilter,
  FaBuilding, FaCheckCircle, FaArrowRight, FaBoxes, FaRegFileAlt, FaBars,
  FaCashRegister, FaTags, FaPercentage, FaLayerGroup, FaBell, FaEllipsisV,
  FaMapMarkerAlt, FaCog, FaUserCog, FaSignOutAlt, FaShoppingBag, FaPlus,
  FaChevronDown, FaCaretDown, FaThLarge, FaList, FaGlobe, FaCalendar,
  FaDownload, FaReceipt, FaCalculator, FaLock, FaPowerOff, FaPrint,
  FaChevronLeft, FaChevronRight, FaHome, FaCalendarDay, FaCalendarWeek
} from 'react-icons/fa';

import { formatRupiah } from "@/lib/formatter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import ClientOnly from '@/components/common/client-only';

import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, 
  Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ClientOnlyRecharts from '@/components/charts/client-only-recharts';

// SortIcon component for table headers
const SortIcon = ({ field }: { field: string }) => {
  const router = useRouter();
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    // Initialize state from URL params
    const { sort, dir } = router.query;
    if (sort) setSortField(sort as string);
    if (dir) setSortDirection(dir as "asc" | "desc");
  }, [router.query]);

  if (field !== sortField) {
    return <FaSort className="ml-1 h-3 w-3 text-gray-400" />;
  }
  
  return sortDirection === "asc" 
    ? <FaSortUp className="ml-1 h-3 w-3 text-orange-500" />
    : <FaSortDown className="ml-1 h-3 w-3 text-orange-500" />;
};

// Individual stat card component
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendIcon, 
  trendColor,
  color = "orange",
  shadow = true 
}: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendIcon?: React.ReactNode;
  trendColor?: string;
  color?: "orange" | "blue" | "green" | "purple" | "red";
  shadow?: boolean;
}) => {
  const colorStyles = {
    orange: "from-orange-500 to-amber-600 text-orange-50",
    blue: "from-blue-500 to-sky-600 text-blue-50",
    green: "from-emerald-500 to-green-600 text-emerald-50",
    purple: "from-violet-500 to-purple-600 text-violet-50",
    red: "from-rose-500 to-red-600 text-rose-50"
  };

  return (
    <div className={`relative overflow-hidden bg-white rounded-xl ${shadow ? 'shadow-md' : 'border border-gray-100'}`}>
      <div className="flex items-center gap-4 p-4">
        <div className={`flex-shrink-0 rounded-lg w-12 h-12 bg-gradient-to-br ${colorStyles[color]} flex items-center justify-center p-3`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="text-xl font-bold text-gray-800 mt-1">{value}</div>
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${trendColor}`}>
              {trendIcon}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
      {/* Decorative bottom border */}
      <div className={`h-1 w-full bg-gradient-to-r from-${color}-400 via-${color}-500 to-${color}-400`}></div>
    </div>
  );
};

// Type for menu item colors
type MenuItemColor = 'orange' | 'blue' | 'green' | 'purple' | 'red';

// Menu item component 
interface MenuItemProps {
  icon: JSX.Element;
  title: string;
  subtitle?: string;
  href: string;
  color?: MenuItemColor;
}

const MenuItem = ({ icon, title, subtitle, href, color = 'orange' }: MenuItemProps) => {
  const colorClasses = {
    orange: "from-orange-500 to-amber-600 group-hover:from-orange-600 group-hover:to-amber-700",
    blue: "from-blue-500 to-sky-600 group-hover:from-blue-600 group-hover:to-sky-700",
    green: "from-emerald-500 to-green-600 group-hover:from-emerald-600 group-hover:to-green-700",
    purple: "from-purple-500 to-violet-600 group-hover:from-purple-600 group-hover:to-violet-700",
    red: "from-red-500 to-rose-600 group-hover:from-red-600 group-hover:to-rose-700"
  };

  return (
    <Link href={href} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-5 transition-all duration-300 transform group-hover:scale-[1.03] overflow-hidden relative">
        {/* Decorative corner */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-gray-100/50 to-gray-200/30 rounded-full"></div>
        
        {/* Icon with gradient background */}
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${colorClasses[color]} mb-3 shadow-sm transition-all duration-300 group-hover:shadow`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        
        {/* Arrow indicator that appears on hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FaArrowRight className={`h-3 w-3 text-${color === 'orange' ? 'orange' : color}-500`} />
        </div>
      </div>
    </Link>
  );
};

// Function for the Shift Close Modal
const ShiftCloseModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // Dummy shift data
  const shiftData = {
    startTime: "08:00 AM",
    endTime: "05:00 PM",
    totalSales: 4850000,
    totalTransactions: 42,
    cashPayments: 2150000,
    cardPayments: 2700000,
    startingCash: 500000,
    endingCash: 2650000
  };
  
  // State for the multi-step form
  const [step, setStep] = useState<number>(1);
  const [actualCash, setActualCash] = useState<string>(shiftData.endingCash.toString());
  const [cashDifference, setCashDifference] = useState<number>(0);
  const [handoverMethod, setHandoverMethod] = useState<'employee' | 'manager'>('employee');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [managerName, setManagerName] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  
  // Sample employee list
  const employees = [
    { id: 1, name: 'Budi Santoso', role: 'Kasir' },
    { id: 2, name: 'Dewi Safitri', role: 'Kasir' },
    { id: 3, name: 'Ahmad Hidayat', role: 'Supervisor' },
    { id: 4, name: 'Ratna Sari', role: 'Kasir' },
    { id: 5, name: 'Hendra Wijaya', role: 'Manager' },
  ];

  // Calculate cash difference when actual cash changes
  useEffect(() => {
    const actualAmount = parseInt(actualCash.replace(/\D/g, '') || '0');
    setCashDifference(actualAmount - shiftData.endingCash);
  }, [actualCash]);
  
  // Handle manual input of cash with rupiah formatting
  const handleCashChange = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      setActualCash('');
      return;
    }
    
    // Format as rupiah for display
    const formattedValue = formatRupiah(parseInt(numericValue));
    setActualCash(formattedValue);
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Show confirmation message before closing
      setShowConfirmation(true);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle final confirmation
  const handleFinish = () => {
    // In a real app, you would submit the data to an API here
    // For now, we'll just close the modal
    setStep(1);
    setShowConfirmation(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  // If showing final confirmation message
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden animate-scaleIn">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 h-10 w-10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <FaCheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Berhasil</h3>
                  <p className="text-xs text-white/80">Shift telah ditutup</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 text-center">
              <div className="mb-6">
                <FaCheckCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tutup Shift Berhasil</h3>
                <p className="text-gray-600">Uang kas telah diserahkan dan diverifikasi.</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Total Penjualan:</span>
                  <span className="text-sm font-medium">{formatRupiah(shiftData.totalSales)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Kas Akhir:</span>
                  <span className="text-sm font-medium">{actualCash}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-800 font-medium">Diterima oleh:</span>
                  <span className="text-sm font-medium">
                    {handoverMethod === 'employee' ? selectedEmployee : managerName}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-3 rounded-lg text-sm font-medium"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 h-10 w-10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <FaPowerOff className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Tutup Shift</h3>
                <p className="text-xs text-white/80">Langkah {step} dari 3</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <FaArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Steps indicator */}
        <div className="px-5 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`h-1 w-8 ${step > 1 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`h-1 w-8 ${step > 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>Ringkasan</span>
            <span>Verifikasi Kas</span>
            <span>Serah Terima</span>
          </div>
        </div>
        
        <div className="p-5">
          {/* Step 1: Summary */}
          {step === 1 && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Waktu Mulai</p>
                  <p className="text-sm font-medium text-gray-800">{shiftData.startTime}</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Waktu Selesai</p>
                  <p className="text-sm font-medium text-gray-800">{shiftData.endTime}</p>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-800">Total Penjualan</p>
                  <p className="text-lg font-bold text-gray-800">{formatRupiah(shiftData.totalSales)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Jumlah Transaksi</p>
                  <p className="text-sm font-medium text-gray-800">{shiftData.totalTransactions}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-800 mb-3">Rincian Pembayaran</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 h-8 w-8 rounded-lg flex items-center justify-center">
                        <FaMoneyBillWave className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tunai</p>
                        <p className="text-sm font-medium text-gray-800">{formatRupiah(shiftData.cashPayments)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 h-8 w-8 rounded-lg flex items-center justify-center">
                        <FaCreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Non-Tunai</p>
                        <p className="text-sm font-medium text-gray-800">{formatRupiah(shiftData.cardPayments)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-800 mb-3">Kas</h4>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Kas Awal</p>
                  <p className="text-sm font-medium text-gray-800">{formatRupiah(shiftData.startingCash)}</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">Kas Akhir (Sistem)</p>
                  <p className="text-sm font-medium text-gray-800">{formatRupiah(shiftData.endingCash)}</p>
                </div>
              </div>
            </>
          )}
          
          {/* Step 2: Cash Verification */}
          {step === 2 && (
            <>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Verifikasi Kas</h3>
                <p className="text-sm text-gray-600 mb-4">Masukkan jumlah uang tunai yang ada di kasir saat ini.</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-800">Kas Akhir (Sistem)</p>
                  <p className="text-base font-bold text-gray-800">{formatRupiah(shiftData.endingCash)}</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kas Aktual di Laci
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Rp</span>
                    </div>
                    <input
                      type="text"
                      value={actualCash}
                      onChange={(e) => handleCashChange(e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-12 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  cashDifference > 0 
                    ? 'bg-green-100 text-green-800' 
                    : cashDifference < 0 
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm font-medium">Selisih:</p>
                  <p className={`text-sm font-bold ${
                    cashDifference > 0 
                      ? 'text-green-700' 
                      : cashDifference < 0 
                        ? 'text-red-700'
                        : 'text-gray-700'
                  }`}>
                    {formatRupiah(cashDifference)}
                    {cashDifference !== 0 && (
                      <span className="ml-1 text-xs">
                        ({cashDifference > 0 ? 'Lebih' : 'Kurang'})
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan (opsional)
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  rows={2}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Jelaskan alasan selisih jika ada..."
                />
              </div>
            </>
          )}
          
          {/* Step 3: Cash Handover */}
          {step === 3 && (
            <>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Serah Terima Kas</h3>
                <p className="text-sm text-gray-600 mb-4">Tentukan siapa yang menerima uang kas.</p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-800">Total Uang Kas</p>
                  <p className="text-base font-bold text-gray-800">{actualCash || formatRupiah(shiftData.endingCash)}</p>
                </div>
                {cashDifference !== 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <p className={cashDifference > 0 ? 'text-green-600' : 'text-red-600'}>
                      {cashDifference > 0 ? 'Kelebihan' : 'Kekurangan'} kas
                    </p>
                    <p className={cashDifference > 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatRupiah(Math.abs(cashDifference))}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-orange-600"
                      name="handoverMethod"
                      checked={handoverMethod === 'employee'}
                      onChange={() => setHandoverMethod('employee')}
                    />
                    <span className="ml-2 text-sm text-gray-700">Pegawai Shift Berikutnya</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-orange-600"
                      name="handoverMethod"
                      checked={handoverMethod === 'manager'}
                      onChange={() => setHandoverMethod('manager')}
                    />
                    <span className="ml-2 text-sm text-gray-700">Manajer/Lainnya</span>
                  </label>
                </div>
                
                {handoverMethod === 'employee' ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pegawai
                    </label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Pilih pegawai...</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.name}>
                          {employee.name} - {employee.role}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Penerima
                    </label>
                    <input
                      type="text"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                      className="focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Masukkan nama penerima..."
                    />
                  </div>
                )}
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Konfirmasi Penerima</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Pastikan uang kas telah dihitung dengan benar dan diserahkan kepada penerima yang ditunjuk.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                onClick={handlePrevStep}
              >
                Kembali
              </button>
            )}
            <button 
              className={`flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                (step === 2 && !actualCash) || 
                (step === 3 && handoverMethod === 'employee' && !selectedEmployee) ||
                (step === 3 && handoverMethod === 'manager' && !managerName)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              onClick={handleNextStep}
              disabled={
                (step === 2 && !actualCash) || 
                (step === 3 && handoverMethod === 'employee' && !selectedEmployee) ||
                (step === 3 && handoverMethod === 'manager' && !managerName)
              }
            >
              {step === 3 ? (
                <>
                  <FaCheckCircle className="h-4 w-4" /> Konfirmasi & Selesai
                </>
              ) : (
                <>
                  Lanjutkan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModulePos = () => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSort, setActiveSort] = useState({ field: 'tanggal', direction: 'desc' });
  const [sidebarHoverItem, setSidebarHoverItem] = useState<string | null>(null);
  const [dateFilterType, setDateFilterType] = useState<'month' | 'week'>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // Default to current month (YYYY-MM)
  const [selectedWeek, setSelectedWeek] = useState<string>(new Date().toISOString().slice(0, 10)); // Default to current day (YYYY-MM-DD)
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample data for sales trends (for the existing chart)
  const salesTrendData = {
    options: {
      chart: {
        id: "sales-trend",
        toolbar: {
          show: false
        },
        fontFamily: "Inter, sans-serif",
      },
      colors: ["#f97316", "#0ea5e9", "#10b981"],
      stroke: {
        curve: "smooth" as "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
      }
    },
    series: [
      {
        name: "Total Penjualan",
        data: [1200000, 1750000, 1500000, 2300000, 1800000, 2500000, 2100000]
      }
    ]
  };

  // Sample data for sales by category (pie chart)
  const categorySalesData = {
    labels: ["Antibiotik", "Vitamin", "Analgesik", "Suplemen", "Alat Kesehatan", "Herbal"],
    series: [25, 20, 18, 15, 12, 10],
    colors: ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#fff7ed"]
  };

  // Sample data for monthly sales area chart
  const monthlySalesData = {
    options: {
      chart: {
        id: "monthly-sales",
        toolbar: {
          show: false
        },
        fontFamily: "Inter, sans-serif",
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#ef4444", "#f97316", "#f59e0b"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: "#ef4444",
              opacity: 0.8
            },
            {
              offset: 50,
              color: "#f97316",
              opacity: 0.6
            },
            {
              offset: 100,
              color: "#f59e0b", 
              opacity: 0.4
            }
          ]
        }
      },
      stroke: {
        curve: "smooth" as "smooth",
        width: 3,
      },
      xaxis: {
        categories: dateFilterType === 'month' 
          ? ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"] 
          : ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
      },
      yaxis: {
        labels: {
          formatter: function(value: number) {
            return formatRupiah(value).replace('Rp', '');
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value: number) {
            return formatRupiah(value);
          }
        }
      }
    },
    series: [
      {
        name: "Total Penjualan",
        data: dateFilterType === 'month'
          ? [4500000, 5200000, 4800000, 5700000, 6100000, 5800000, 7200000, 7800000, 6900000, 7500000, 8200000, 9100000]
          : [1200000, 1750000, 1500000, 2300000, 1800000, 2500000, 2100000]
      }
    ]
  };

  // Sample data for weekly sales area chart
  const weeklySalesData = {
    options: {
      chart: {
        id: "weekly-sales",
        toolbar: {
          show: false
        },
        fontFamily: "Inter, sans-serif",
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#ef4444", "#f97316", "#f59e0b"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: "#ef4444",
              opacity: 0.8
            },
            {
              offset: 50,
              color: "#f97316",
              opacity: 0.6
            },
            {
              offset: 100,
              color: "#f59e0b", 
              opacity: 0.4
            }
          ]
        }
      },
      stroke: {
        curve: "smooth" as "smooth",
        width: 3,
      },
      xaxis: {
        categories: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
      },
      yaxis: {
        labels: {
          formatter: function(value: number) {
            return formatRupiah(value).replace('Rp', '');
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value: number) {
            return formatRupiah(value);
          }
        }
      }
    },
    series: [
      {
        name: "Total Penjualan",
        data: [1200000, 1750000, 1500000, 2300000, 1800000, 2500000, 2100000]
      }
    ]
  };

  // Format chart data for Recharts
  const formattedWeeklySalesData = weeklySalesData.options.xaxis.categories.map((day, index) => ({
    hari: day,
    penjualan: weeklySalesData.series[0].data[index]
  }));

  const formattedMonthlySalesData = monthlySalesData.options.xaxis.categories.map((month, index) => ({
    bulan: month,
    penjualan: monthlySalesData.series[0].data[index]
  }));

  // Format category data for pie chart
  const formattedCategorySalesData = categorySalesData.labels.map((label, index) => ({
    name: label,
    value: categorySalesData.series[index]
  }));

  // Sample data for daily sales
  const dailySales = {
    totalSales: 3750000,
    transactionCount: 12,
    averageSales: 312500,
    topSellingProducts: [
      { id: "P001", name: "Paracetamol 500mg", qty: 48, total: 480000 },
      { id: "P002", name: "Vitamin C 1000mg", qty: 36, total: 720000 },
      { id: "P003", name: "Amoxicillin 500mg", qty: 24, total: 600000 },
      { id: "P004", name: "Loratadine 10mg", qty: 18, total: 360000 },
      { id: "P005", name: "Antasida Tablet", qty: 12, total: 180000 }
    ],
    recentTransactions: [
      { id: "TRX001", invoice: "INV-001", customer: "Budi Santoso", date: "10:15 AM", total: 245000, status: "Complete" },
      { id: "TRX002", invoice: "INV-002", customer: "Ani Wijaya", date: "11:30 AM", total: 187500, status: "Complete" },
      { id: "TRX003", invoice: "INV-003", customer: "Citra Dewi", date: "12:45 PM", total: 325000, status: "Pending" },
      { id: "TRX004", invoice: "INV-004", customer: "Denny Susanto", date: "14:20 PM", total: 135000, status: "Complete" },
      { id: "TRX005", invoice: "INV-005", customer: "Eka Putri", date: "15:05 PM", total: 220000, status: "Processing" }
    ]
  };

  // Function to handle sorting
  const handleSort = (field: string) => {
    setActiveSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Function to get sort function based on field and direction
  const getSortFunction = (field: string, direction: string) => {
    return (a: any, b: any) => {
      const aVal = a[field];
      const bVal = b[field];
      
      const sortVal = typeof aVal === 'string' && typeof bVal === 'string'
        ? aVal.localeCompare(bVal)
        : aVal - bVal;
        
      return direction === 'asc' ? sortVal : -sortVal;
    };
  };

  // Client-only chart component to avoid SSR issues
  const RechartsAreaChart = ({ 
    data, 
    xAxisKey, 
    areaKey, 
    areaName, 
    height = 300 
  }: { 
    data: Array<Record<string, any>>; 
    xAxisKey: string; 
    areaKey: string; 
    areaName: string; 
    height?: number;
  }) => {
    return (
      <ClientOnlyRecharts height={height}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#666' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#666' }}
            />
            <Tooltip 
              contentStyle={{
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                borderRadius: '4px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={areaKey} 
              name={areaName}
              stroke="#f97316" 
              fillOpacity={1} 
              fill="url(#colorSales)" 
              activeDot={{ r: 6 }}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ClientOnlyRecharts>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white shadow-md z-20 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-[70px]' : 'w-64'
        }`}
      >
        {/* Sidebar Toggle Button */}
        <div className="absolute -right-3 top-6 z-30">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="bg-white rounded-full p-1.5 shadow-md text-orange-500 hover:text-orange-600 transition-all duration-300"
          >
            {isSidebarCollapsed ? (
              <FaChevronRight className="h-4 w-4" />
            ) : (
              <FaChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        
        {/* Sidebar Header with Logo */}
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-gray-100`}>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white h-10 w-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <FaStore className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent truncate">FARMAX</h1>
                <p className="text-xs text-gray-500 truncate">POS System</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar Menu */}
        <div className="p-3">
          <ul className="space-y-2">
            {[
              { icon: <FaHome size={18} />, title: 'Dashboard', path: '/dashboard' },
              { icon: <FaCashRegister size={18} />, title: 'POS', path: '/pos', active: true },
              { icon: <FaBoxes size={18} />, title: 'Inventory', path: '/inventory' },
              { icon: <FaClipboardList size={18} />, title: 'Orders', path: '/orders' },
              { icon: <FaChartBar size={18} />, title: 'Reports', path: '/reports' },
              { icon: <FaUsers size={18} />, title: 'Customers', path: '/customers' },
              { icon: <FaMoneyBillWave size={18} />, title: 'Finance', path: '/finance' },
              { icon: <FaCog size={18} />, title: 'Settings', path: '/settings' },
            ].map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.path} 
                  className={`flex items-center ${!isSidebarCollapsed ? 'justify-start' : 'justify-center'} p-2.5 rounded-lg text-sm transition-all duration-200 ${
                    item.active 
                      ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 border-l-2 border-orange-500' 
                      : 'text-gray-600 hover:bg-orange-50'
                  }`}
                  onMouseEnter={() => setSidebarHoverItem(item.title)}
                  onMouseLeave={() => setSidebarHoverItem(null)}
                >
                  <div className={`${item.active ? 'text-orange-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </div>
                  
                  {!isSidebarCollapsed && (
                    <span className="ml-3 truncate">{item.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Tooltips for collapsed sidebar */}
        {isSidebarCollapsed && sidebarHoverItem && (
          <div className="fixed left-[70px] top-0 mt-[58px] ml-1 bg-white px-3 py-1.5 rounded-md shadow-md text-sm font-medium z-50 pointer-events-none">
            {sidebarHoverItem}
            <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-8 border-transparent border-r-white"></div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 overflow-y-auto ${isSidebarCollapsed ? 'ml-[70px]' : 'ml-64'}`}>
        {/* Page Content */}
        <div className="container mx-auto max-w-[1280px] p-6">
          {/* Pharmacy Name and Logo Header */}
          <div className="flex items-center justify-between mb-8 relative">
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-md"></div>
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-1.5 h-10 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/5 to-amber-500/10 rounded-full blur-xl"></div>
            
            {/* Small decorative dots */}
            <div className="absolute top-1 left-40 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-60"></div>
            <div className="absolute top-12 left-36 w-1 h-1 bg-amber-500 rounded-full opacity-40"></div>
            <div className="absolute top-6 right-40 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-50"></div>
            <div className="absolute bottom-1 right-32 w-1 h-1 bg-amber-500 rounded-full opacity-30"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              {/* Logo with decorative ring */}
              <div className="relative">
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-orange-400/20 to-amber-500/30 rounded-full blur-sm animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 text-white h-12 w-12 rounded-xl flex items-center justify-center shadow-md z-10">
                  <FaStore className="h-6 w-6" />
                </div>
                
                {/* Decorative corner dots */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
              
              <div className="relative">
                {/* Decorative line above text */}
                <div className="absolute -top-3 left-0 w-12 h-0.5 bg-gradient-to-r from-orange-400 to-transparent rounded-full"></div>
                
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">FARMAX</h1>
                <p className="text-sm text-gray-600">Apotek & Retail Farmasi</p>
                
                {/* Decorative line below text */}
                <div className="absolute -bottom-2 right-0 w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="text-right relative z-10">
              {/* Decorative corner */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-500/20 to-amber-400/10 rounded-br-xl"></div>
              
              <p className="text-sm font-medium text-gray-800">Sabtu, 29 Maret 2025</p>
              <p className="text-xs text-gray-500">Shift: Pagi (08:00 - 17:00)</p>
              
              {/* Decorative line below date */}
              <div className="absolute -bottom-2 right-0 w-20 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500/50 rounded-full"></div>
            </div>
          </div>
          
          {/* Welcome Section with Modern Design */}
          <div className="rounded-xl shadow-md mb-8 overflow-hidden">
            <div className="relative h-32">
              {/* New gradient background matching the image */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500">
                {/* Circular decorative element */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-24 w-24 bg-white/10 rounded-full blur-xl"></div>
                
                {/* Small decorative bars in top right */}
                <div className="absolute top-6 right-6 flex space-x-2">
                  <div className="h-1 w-6 bg-white/30 rounded-full"></div>
                  <div className="h-1 w-10 bg-white/30 rounded-full"></div>
                  <div className="h-1 w-4 bg-white/30 rounded-full"></div>
                </div>
              </div>
              
              <div className="relative p-6 z-10 h-full flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-xl font-bold text-white">Selamat Datang, Admin</h1>
                  <p className="text-white/80 text-sm mt-1">Point of Sale dashboard untuk mengelola penjualan dan inventori toko Anda.</p>
                </div>
                
                <div className="mt-4 md:mt-0 flex gap-2">
                  <Button className="bg-white text-gray-800 hover:bg-gray-100 shadow-sm hover:shadow-md border-0 text-xs py-2 h-9 transition-all duration-300">
                    <FaCashRegister className="mr-1.5 h-3.5 w-3.5" /> Mulai Transaksi Baru
                  </Button>
                  <Button 
                    className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white shadow-sm hover:shadow text-xs py-2 h-9 transition-all duration-300"
                    onClick={() => setIsShiftModalOpen(true)}
                  >
                    <FaPowerOff className="mr-1.5 h-3.5 w-3.5 text-white" /> Tutup Shift
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full mr-2"></span>
                Menu Cepat
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <MenuItem 
                icon={<FaCashRegister size={20} />}
                title="Kasir"
                subtitle="Proses transaksi"
                href="/pos/kasir"
                color="orange"
              />
              <MenuItem 
                icon={<FaBoxes size={20} />}
                title="Produk"
                subtitle="Kelola barang"
                href="/inventory"
                color="blue"
              />
              <MenuItem 
                icon={<FaChartBar size={20} />}
                title="Laporan"
                subtitle="Analisis data"
                href="/reports"
                color="purple"
              />
              <MenuItem 
                icon={<FaFileInvoiceDollar size={20} />}
                title="Transaksi"
                subtitle="Riwayat order"
                href="/pos/transactions"
                color="green"
              />
              <MenuItem 
                icon={<FaPercentage size={20} />}
                title="Diskon"
                subtitle="Promo & diskon"
                href="/pos/discounts"
                color="red"
              />
              <MenuItem 
                icon={<FaUsers size={20} />}
                title="Pelanggan"
                subtitle="Data customer"
                href="/customers"
                color="orange"
              />
            </div>
          </div>
          
          {/* New Metrics Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full mr-2"></span>
                Ringkasan Hari Ini
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Transaction Count Card */}
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                <CardContent className="p-4 pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Total Transaksi</p>
                      <div className="flex items-baseline gap-1">
                        <h3 className="text-xl font-bold text-gray-800">{dailySales.transactionCount}</h3>
                        <span className="text-xs font-medium text-green-600 flex items-center">
                          <FaArrowUp className="h-2.5 w-2.5 mr-0.5" />
                          18%
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        {formatRupiah(dailySales.totalSales)}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 shadow-sm">
                      <FaReceipt className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                      <FaArrowUp className="h-2.5 w-2.5 mr-1 text-green-500" />
                      <span className="font-medium">+5</span> dari kemarin
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cash in Register Card */}
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                <CardContent className="p-4 pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Kas di Mesin Kasir</p>
                      <div className="flex items-baseline gap-1">
                        <h3 className="text-xl font-bold text-gray-800">{formatRupiah(4250000)}</h3>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        Terakhir update: 15:30
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 shadow-sm">
                      <FaMoneyBillWave className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                      <FaCheckCircle className="h-2.5 w-2.5 mr-1 text-green-500" />
                      Jumlah sesuai dengan transaksi
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Average Transaction Card */}
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                <CardContent className="p-4 pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Rata-rata Transaksi</p>
                      <div className="flex items-baseline gap-1">
                        <h3 className="text-xl font-bold text-gray-800">{formatRupiah(dailySales.averageSales)}</h3>
                        <span className="text-xs font-medium text-green-600 flex items-center">
                          <FaArrowUp className="h-2.5 w-2.5 mr-0.5" />
                          5%
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        Per transaksi
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 shadow-sm">
                      <FaCalculator className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="font-medium">{dailySales.transactionCount}</span> transaksi hari ini
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stagnant Products Card */}
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                <CardContent className="p-4 pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Produk Tidak Bergerak</p>
                      <div className="flex items-baseline gap-1">
                        <h3 className="text-xl font-bold text-gray-800">24</h3>
                        <span className="text-xs font-medium text-amber-600 flex items-center">
                          <FaExclamationTriangle className="h-2.5 w-2.5 mr-0.5" />
                          8 item
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        Nilai: {formatRupiah(3680000)}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 shadow-sm">
                      <FaBoxOpen className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center">
                      <FaArrowUp className="h-2.5 w-2.5 mr-1 text-amber-500" />
                      <span className="font-medium">+3</span> dari minggu lalu
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Sales Charts Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800 flex items-center">
                <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full mr-2"></span>
                Grafik Penjualan
              </h2>
              
              {/* Date Filter Controls */}
              <div className="flex space-x-2">
                <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm p-1">
                  <button 
                    onClick={() => setDateFilterType('month')}
                    className={`px-3 py-1 text-xs rounded-md flex items-center transition-all duration-200 ${
                      dateFilterType === 'month' 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    <FaCalendarDay className="mr-1.5 h-3 w-3" />
                    Bulan
                  </button>
                  <button 
                    onClick={() => setDateFilterType('week')}
                    className={`px-3 py-1 text-xs rounded-md flex items-center transition-all duration-200 ${
                      dateFilterType === 'week' 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    <FaCalendarWeek className="mr-1.5 h-3 w-3" />
                    Minggu
                  </button>
                </div>
                
                {dateFilterType === 'month' ? (
                  <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="rounded-lg border border-gray-200 text-xs p-2 bg-white shadow-sm"
                  />
                ) : (
                  <input 
                    type="date" 
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="rounded-lg border border-gray-200 text-xs p-2 bg-white shadow-sm"
                  />
                )}
              </div>
            </div>
            
            {/* Area Chart Card */}
            <Card className="overflow-hidden border-0 shadow-md mb-6 relative">
              {/* Enhanced decorative header with gradient */}
              <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400"></div>
              
              {/* Professional decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-full blur-lg"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 left-1/3 w-16 h-16 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-md"></div>
              
              {/* Small decorative elements */}
              <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-40"></div>
              <div className="absolute top-12 right-24 w-1 h-1 bg-amber-500 rounded-full opacity-30"></div>
              <div className="absolute bottom-16 left-16 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-40"></div>
              <div className="absolute bottom-24 left-28 w-1 h-1 bg-amber-500 rounded-full opacity-30"></div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-bl from-orange-500/30 to-amber-400/20 transform rotate-45"></div>
              </div>
              
              <CardContent className="p-5 relative">
                <div className="mb-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="w-1 h-8 bg-gradient-to-b from-red-500 to-amber-500 rounded-full mr-2"></span>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">Trend Penjualan</h3>
                        <p className="text-xs text-gray-500">
                          {dateFilterType === 'month' 
                            ? 'Penjualan bulanan selama 1 tahun terakhir' 
                            : 'Penjualan harian selama 1 minggu terakhir'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professional indicator with subtle animation */}
                  <div className="flex items-center bg-gradient-to-r from-green-50 to-green-100 px-2 py-1 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700">Live Data</span>
                  </div>
                </div>
                
                {/* Decorative separator with gradient */}
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
                
                <div className="h-72 relative">
                  {/* Chart frame with subtle border */}
                  <div className="absolute inset-0 rounded-lg border border-gray-100"></div>
                  
                  {/* Decorative corner elements */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-orange-400 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-orange-400 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-orange-400 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-orange-400 rounded-br-lg"></div>
                  
                  {mounted && (
                    <RechartsAreaChart 
                      data={dateFilterType === 'month' ? formattedMonthlySalesData : formattedWeeklySalesData}
                      xAxisKey={dateFilterType === 'month' ? 'bulan' : 'hari'}
                      areaKey="penjualan"
                      areaName="Total Penjualan"
                    />
                  )}
                </div>
                
                {/* Legend with elegant design */}
                <div className="mt-4 flex justify-center items-center space-x-6">
                  <div className="flex items-center">
                    <div className="h-3 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">Transaksi Tunai</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">Transaksi Non-Tunai</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Category Distribution Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-0 shadow-md relative">
                {/* Enhanced decorative header with gradient */}
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                
                {/* Professional decorative elements */}
                <div className="absolute -top-3 -left-3 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-full blur-lg"></div>
                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-orange-500/10 to-amber-500/5 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-md"></div>
                
                {/* Small decorative elements */}
                <div className="absolute top-6 right-10 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-40"></div>
                <div className="absolute top-10 right-20 w-1 h-1 bg-amber-500 rounded-full opacity-30"></div>
                <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-40"></div>
                <div className="absolute bottom-20 left-24 w-1 h-1 bg-amber-500 rounded-full opacity-30"></div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-10 h-10 overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-10 h-10 bg-gradient-to-bl from-orange-500/30 to-amber-400/20 transform rotate-45"></div>
                </div>
                
                <CardContent className="p-5 relative">
                  <div className="mb-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-2"></span>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">Penjualan per Kategori</h3>
                        <p className="text-xs text-gray-500">Distribusi penjualan berdasarkan kategori produk</p>
                      </div>
                    </div>
                    
                    {/* Elegant summary */}
                    <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                      <span className="text-xs font-medium text-orange-700">{categorySalesData.labels.length} kategori</span>
                    </div>
                  </div>
                  
                  {/* Decorative separator with gradient */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
                  
                  <div className="flex items-start">
                    <div className="w-1/2 h-48 relative">
                      {/* Decorative circle frame */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed border-orange-200 opacity-30"></div>
                      
                      {mounted && (
                        <ClientOnlyRecharts height={200}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie 
                                data={formattedCategorySalesData}
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                                fill="#8884d8" 
                                paddingAngle={5} 
                                dataKey="value"
                              >
                                {formattedCategorySalesData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={categorySalesData.colors[index % categorySalesData.colors.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => [`${value}`, 'Jumlah']}
                                contentStyle={{
                                  fontSize: '12px',
                                  fontFamily: 'Inter, sans-serif',
                                  borderRadius: '4px'
                                }}
                              />
                              <Legend
                                layout="vertical"
                                align="right"
                                verticalAlign="middle"
                                wrapperStyle={{
                                  fontSize: '12px',
                                  fontFamily: 'Inter, sans-serif'
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </ClientOnlyRecharts>
                      )}
                    </div>
                    
                    <div className="w-1/2 mt-2 pl-2 relative">
                      {/* Decorative category indicator */}
                      <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-0.5 h-24 bg-gradient-to-b from-orange-500/50 to-transparent rounded-full"></div>
                      
                      {categorySalesData.labels.map((label, index) => (
                        <div key={index} className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <div 
                                className="h-3 w-3 rounded-sm mr-2" 
                                style={{ backgroundColor: categorySalesData.colors[index] }}
                              ></div>
                              <span className="text-xs font-medium text-gray-600">{label}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-800">{categorySalesData.series[index]}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${categorySalesData.series[index]}%`,
                                backgroundColor: categorySalesData.colors[index]
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top selling products card */}
              <Card className="overflow-hidden border-0 shadow-md relative">
                {/* Enhanced decorative header with gradient */}
                <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                
                {/* Professional decorative elements */}
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-bl from-orange-500/20 to-amber-500/10 rounded-full blur-lg"></div>
                <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-1/4 w-16 h-16 bg-gradient-to-tl from-amber-500/10 to-orange-500/5 rounded-full blur-md"></div>
                
                {/* Small decorative elements */}
                <div className="absolute top-6 left-10 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-40"></div>
                <div className="absolute top-10 left-20 w-1 h-1 bg-amber-500 rounded-full opacity-30"></div>
                <div className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-40"></div>
                <div className="absolute bottom-20 right-24 w-1 h-1 bg-amber-500 rounded-full opacity-30"></div>
                
                {/* Decorative corner accent */}
                <div className="absolute top-0 left-0 w-10 h-10 overflow-hidden">
                  <div className="absolute -top-5 -left-5 w-10 h-10 bg-gradient-to-br from-orange-500/30 to-amber-400/20 transform rotate-45"></div>
                </div>
                
                <CardContent className="p-5 relative">
                  <div className="mb-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full mr-2"></span>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">Produk Terlaris</h3>
                        <p className="text-xs text-gray-500">Produk dengan penjualan tertinggi hari ini</p>
                      </div>
                    </div>
                    
                    {/* Professional indicator with badge */}
                    <div className="bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                      <span className="text-xs font-medium text-orange-700">Top 5</span>
                    </div>
                  </div>
                  
                  {/* Decorative separator with gradient */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
                  
                  <div className="space-y-3 relative">
                    {/* Decorative line */}
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-orange-500/30 to-transparent"></div>
                    
                    {dailySales.topSellingProducts.slice(0, 5).map((product, index: number) => (
                      <div key={index} className="flex items-start justify-between pl-3">
                        <div className="flex items-center space-x-3">
                          <div className={`bg-gradient-to-br from-orange-400 to-amber-500 h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm text-white`}>
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.qty} item</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800">{formatRupiah(product.total)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recent Transactions and Expiring Products - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Transaksi Terbaru</h3>
                  <p className="text-xs text-gray-500">Transaksi yang baru saja selesai</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-orange-500 hover:text-orange-600 p-1 h-auto">
                  <FaEllipsisV className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 border-b border-gray-100 text-left">
                        <div className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700">
                          INVOICE
                          <SortIcon field="invoice" />
                        </div>
                      </th>
                      <th className="px-5 py-3 border-b border-gray-100 text-left">
                        <div className="flex items-center text-xs font-medium text-gray-500 hover:text-gray-700">
                          CUSTOMER
                          <SortIcon field="customer" />
                        </div>
                      </th>
                      <th className="px-5 py-3 border-b border-gray-100 text-right">
                        <div className="flex items-center justify-end text-xs font-medium text-gray-500 hover:text-gray-700">
                          TOTAL
                          <SortIcon field="total" />
                        </div>
                      </th>
                      <th className="px-5 py-3 border-b border-gray-100 text-center">
                        <div className="flex items-center justify-center text-xs font-medium text-gray-500 hover:text-gray-700">
                          STATUS
                          <SortIcon field="status" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySales.recentTransactions
                      .slice(0, 5)
                      .map((transaction, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-5 py-4 border-b border-gray-100 text-left">
                          <span className="text-xs text-gray-800 font-medium">{transaction.invoice}</span>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                              {transaction.customer.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-800">{transaction.customer}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-100 text-right">
                          <span className="text-xs font-medium text-gray-800">{formatRupiah(transaction.total)}</span>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-100 text-center">
                          <Badge className={`
                            px-2 py-0.5 text-[10px] font-medium
                            ${transaction.status === 'Complete' ? 'bg-green-100 text-green-800' : ''}
                            ${transaction.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                            ${transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          `}>
                            {transaction.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                <Link href="/pos/transactions" className="text-xs font-medium text-orange-500 hover:text-orange-600 flex items-center">
                  Lihat Semua Transaksi <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
            
            {/* Products Expiring Soon */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Produk Akan Expired</h3>
                  <p className="text-xs text-gray-500">Produk yang mendekati tanggal kadaluarsa</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-orange-500 hover:text-orange-600 p-1 h-auto">
                  <FaEllipsisV className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 border-b border-gray-100 text-left">
                        <span className="text-xs font-medium text-gray-500">NAMA PRODUK</span>
                      </th>
                      <th className="px-5 py-3 border-b border-gray-100 text-center">
                        <span className="text-xs font-medium text-gray-500">STOK</span>
                      </th>
                      <th className="px-5 py-3 border-b border-gray-100 text-center">
                        <span className="text-xs font-medium text-gray-500">TGL EXPIRED</span>
                      </th>
                      <th className="px-5 py-3 border-b border-gray-100 text-right">
                        <span className="text-xs font-medium text-gray-500">SISA HARI</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Paracetamol 500mg", code: "PR500", stock: 24, expiry: "2025-04-15", daysLeft: 17 },
                      { name: "Amoxicillin 500mg", code: "AM500", stock: 18, expiry: "2025-04-10", daysLeft: 12 },
                      { name: "Vitamin C 1000mg", code: "VC1000", stock: 32, expiry: "2025-04-08", daysLeft: 10 },
                      { name: "Antasida Tablet", code: "AT001", stock: 15, expiry: "2025-04-05", daysLeft: 7 },
                      { name: "Cetirizine 10mg", code: "CE010", stock: 27, expiry: "2025-04-02", daysLeft: 4 }
                    ].map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-5 py-4 border-b border-gray-100">
                          <div>
                            <span className="text-xs text-gray-800 font-medium">{product.name}</span>
                            <div className="text-[10px] text-gray-500 mt-0.5">{product.code}</div>
                          </div>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-100 text-center">
                          <span className="text-xs text-gray-800">{product.stock}</span>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-100 text-center">
                          <span className="text-xs text-gray-800">{product.expiry}</span>
                        </td>
                        <td className="px-5 py-4 border-b border-gray-100 text-right">
                          <Badge className={`
                            px-2 py-0.5 text-[10px] font-medium
                            ${product.daysLeft > 15 ? 'bg-green-100 text-green-800' : ''}
                            ${product.daysLeft > 7 && product.daysLeft <= 15 ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${product.daysLeft <= 7 ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {product.daysLeft} hari
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                <Link href="/inventory/expired" className="text-xs font-medium text-orange-500 hover:text-orange-600 flex items-center">
                  Lihat Semua Produk Expired <FaArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shift Close Modal */}
      <ShiftCloseModal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} />
    </div>
  );
};

const styles = `
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

const ModulePosWithStyles = () => {
  return (
    <>
      <style jsx global>{styles}</style>
      <ModulePos />
    </>
  );
};

export default ModulePosWithStyles;
