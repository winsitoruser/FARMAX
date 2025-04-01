import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { 
  FaBoxOpen, 
  FaChartLine, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaTruckLoading,
  FaExclamationTriangle,
  FaCheckCircle,
  FaWrench,
  FaShippingFast,
  FaClock
} from "react-icons/fa";

// Data untuk ringkasan penerimaan
interface ReceptionSummary {
  totalReceptions: number;
  totalItems: number;
  totalValue: number;
  pendingReceptions: number;
  pendingValue: number;
  completedReceptions: number;
  rejectedItems: number;
  averageProcessingTime: string;
  topSuppliers: { name: string; count: number; value: number }[];
  recentActivity: { date: string; action: string; invoiceNumber: string }[];
  monthlyReceptions: { month: string; count: number; value: number }[];
}

// Data mock untuk ringkasan
const mockSummaryData: ReceptionSummary = {
  totalReceptions: 156,
  totalItems: 1248,
  totalValue: 345670000,
  pendingReceptions: 8,
  pendingValue: 32450000,
  completedReceptions: 148,
  rejectedItems: 12,
  averageProcessingTime: "2 jam 15 menit",
  topSuppliers: [
    { name: "PT Kimia Farma", count: 42, value: 98750000 },
    { name: "PT Parit Padang Global", count: 38, value: 76340000 },
    { name: "PT Tempo Scan Pacific", count: 25, value: 54230000 },
  ],
  recentActivity: [
    { date: "2025-03-30", action: "Penerimaan Baru", invoiceNumber: "INV20250330001" },
    { date: "2025-03-29", action: "Pemeriksaan Selesai", invoiceNumber: "INV20250329002" },
    { date: "2025-03-28", action: "Penerimaan Ditolak", invoiceNumber: "INV20250328001" },
    { date: "2025-03-27", action: "Penerimaan Sebagian", invoiceNumber: "INV20250327003" },
  ],
  monthlyReceptions: [
    { month: "Jan", count: 32, value: 72340000 },
    { month: "Feb", count: 28, value: 65780000 },
    { month: "Mar", count: 35, value: 81450000 },
    { month: "Apr", count: 30, value: 68920000 },
    { month: "Mei", count: 31, value: 70340000 },
  ]
};

const ReceptionDashboard: React.FC = () => {
  const summaryData = mockSummaryData;
  
  // Chart untuk jumlah penerimaan bulanan
  const maxMonthlyCount = Math.max(...summaryData.monthlyReceptions.map(item => item.count));
  
  // Chart untuk nilai penerimaan bulanan
  const maxMonthlyValue = Math.max(...summaryData.monthlyReceptions.map(item => item.value));
  
  return (
    <div className="space-y-6">
      {/* Header card dengan summary */}
      <Card className="shadow-md border-none overflow-hidden">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -mr-10 -mt-10 z-0"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-200 to-amber-100 rounded-full blur-xl opacity-20 -ml-10 -mb-10 z-0"></div>
          
          <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white pb-4 relative z-10">
            <CardTitle className="text-xl flex items-center">
              <FaChartLine className="mr-2 h-5 w-5" />
              Dashboard Penerimaan Barang
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Penerimaan */}
              <Card className="bg-white shadow-sm border-orange-200 hover:shadow-md transition-shadow duration-200 hover:border-orange-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Penerimaan</p>
                      <p className="text-2xl font-bold text-gray-800">{summaryData.totalReceptions}</p>
                      <p className="text-xs text-gray-500 mt-1">Faktur</p>
                    </div>
                    <div className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                      <FaBoxOpen className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Item */}
              <Card className="bg-white shadow-sm border-orange-200 hover:shadow-md transition-shadow duration-200 hover:border-orange-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Item</p>
                      <p className="text-2xl font-bold text-gray-800">{summaryData.totalItems}</p>
                      <p className="text-xs text-gray-500 mt-1">Produk</p>
                    </div>
                    <div className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                      <FaTruckLoading className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Nilai */}
              <Card className="bg-white shadow-sm border-orange-200 hover:shadow-md transition-shadow duration-200 hover:border-orange-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Nilai</p>
                      <p className="text-2xl font-bold text-gray-800">{formatRupiah(summaryData.totalValue)}</p>
                      <p className="text-xs text-gray-500 mt-1">Transaksi</p>
                    </div>
                    <div className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                      <FaMoneyBillWave className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Rata-rata Waktu Proses */}
              <Card className="bg-white shadow-sm border-orange-200 hover:shadow-md transition-shadow duration-200 hover:border-orange-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Waktu Proses</p>
                      <p className="text-2xl font-bold text-gray-800">{summaryData.averageProcessingTime}</p>
                      <p className="text-xs text-gray-500 mt-1">Rata-rata</p>
                    </div>
                    <div className="p-3 rounded-full bg-gradient-to-r from-orange-100 to-amber-100">
                      <FaClock className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Chart 1: Monthly Reception Count */}
              <Card className="col-span-1 bg-white shadow-sm border-orange-200">
                <CardHeader className="py-3 px-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FaCalendarAlt className="mr-2 h-4 w-4 text-orange-500" />
                    Jumlah Penerimaan Bulanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-40 flex items-end justify-between space-x-2">
                    {summaryData.monthlyReceptions.map((month, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-sm"
                          style={{ 
                            height: `${(month.count / maxMonthlyCount) * 100}%`,
                            minHeight: '10%'
                          }}
                        ></div>
                        <span className="text-xs mt-1 text-gray-600">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Chart 2: Monthly Reception Value */}
              <Card className="col-span-1 bg-white shadow-sm border-orange-200">
                <CardHeader className="py-3 px-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FaMoneyBillWave className="mr-2 h-4 w-4 text-orange-500" />
                    Nilai Penerimaan Bulanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-40 flex items-end justify-between space-x-2">
                    {summaryData.monthlyReceptions.map((month, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-8 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-sm"
                          style={{ 
                            height: `${(month.value / maxMonthlyValue) * 100}%`,
                            minHeight: '10%'
                          }}
                        ></div>
                        <span className="text-xs mt-1 text-gray-600">{month.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Status Summary */}
              <Card className="col-span-1 bg-white shadow-sm border-orange-200">
                <CardHeader className="py-3 px-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FaWrench className="mr-2 h-4 w-4 text-orange-500" />
                    Status Penerimaan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Completed */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs flex items-center text-gray-600">
                          <FaCheckCircle className="mr-1 h-3 w-3 text-green-500" />
                          Selesai
                        </span>
                        <span className="text-xs font-medium">{summaryData.completedReceptions}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-teal-400 h-2 rounded-full" 
                          style={{ width: `${(summaryData.completedReceptions / summaryData.totalReceptions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Pending */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs flex items-center text-gray-600">
                          <FaShippingFast className="mr-1 h-3 w-3 text-amber-500" />
                          Menunggu
                        </span>
                        <span className="text-xs font-medium">{summaryData.pendingReceptions}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full" 
                          style={{ width: `${(summaryData.pendingReceptions / summaryData.totalReceptions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Rejected */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs flex items-center text-gray-600">
                          <FaExclamationTriangle className="mr-1 h-3 w-3 text-red-500" />
                          Item Ditolak
                        </span>
                        <span className="text-xs font-medium">{summaryData.rejectedItems}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-pink-400 h-2 rounded-full" 
                          style={{ width: `${(summaryData.rejectedItems / summaryData.totalItems) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Suppliers */}
              <Card className="bg-white shadow-sm border-orange-200">
                <CardHeader className="py-3 px-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FaTruckLoading className="mr-2 h-4 w-4 text-orange-500" />
                    Supplier Teratas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {summaryData.topSuppliers.map((supplier, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${
                            index === 0 ? 'bg-gradient-to-r from-orange-100 to-amber-100' :
                            index === 1 ? 'bg-gradient-to-r from-amber-100 to-yellow-100' :
                            'bg-gradient-to-r from-gray-100 to-gray-50'
                          }`}>
                            <span className={`text-xs font-bold ${
                              index === 0 ? 'text-orange-600' :
                              index === 1 ? 'text-amber-600' :
                              'text-gray-600'
                            }`}>{index + 1}</span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{supplier.name}</p>
                            <p className="text-xs text-gray-500">{supplier.count} penerimaan</p>
                          </div>
                        </div>
                        <p className="font-medium text-sm">{formatRupiah(supplier.value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="bg-white shadow-sm border-orange-200">
                <CardHeader className="py-3 px-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FaCalendarAlt className="mr-2 h-4 w-4 text-orange-500" />
                    Aktivitas Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {summaryData.recentActivity.map((activity, index) => {
                      const getActivityIcon = (action: string) => {
                        switch(action) {
                          case 'Penerimaan Baru':
                            return <FaBoxOpen className="h-4 w-4 text-blue-500" />;
                          case 'Pemeriksaan Selesai':
                            return <FaCheckCircle className="h-4 w-4 text-green-500" />;
                          case 'Penerimaan Ditolak':
                            return <FaExclamationTriangle className="h-4 w-4 text-red-500" />;
                          case 'Penerimaan Sebagian':
                            return <FaWrench className="h-4 w-4 text-amber-500" />;
                          default:
                            return <FaBoxOpen className="h-4 w-4 text-gray-500" />;
                        }
                      };
                      
                      return (
                        <div key={index} className="flex items-start">
                          <div className="p-2 rounded-full bg-gray-100 mr-3">
                            {getActivityIcon(activity.action)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span className="mr-2">{activity.invoiceNumber}</span>
                              <span>{new Date(activity.date).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default ReceptionDashboard;
