import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  FaExclamationTriangle, FaHistory, FaRedoAlt, FaEye, 
  FaCheckCircle, FaTimes, FaFilter, FaPlus, FaBan
} from 'react-icons/fa';

import { errorManager } from '../services/error-service';
import dynamic from 'next/dynamic';

// Import dinamis untuk Chart 
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Interface untuk error log
interface ErrorLog {
  id: string;
  timestamp: Date;
  module: string;
  operation: string;
  errorMessage: string;
  severity: 'warning' | 'error' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved' | 'ignored';
  retryCount: number;
  context: any;
}

const ErrorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    resolved: 0,
    critical: 0,
    retrySuccess: 0,
    moduleBreakdown: {}
  });
  
  // Mengambil data error dari API/service
  useEffect(() => {
    // Dalam produksi, ini akan mengambil data dari API
    // Gunakan errorManager untuk mendapatkan log error
    loadErrorLogs();
  }, [statusFilter, severityFilter, moduleFilter]);
  
  const loadErrorLogs = () => {
    // Simulasi data error logs
    const mockErrorLogs = generateMockErrorLogs();
    
    // Filter data berdasarkan status, severity, dan module
    let filteredLogs = mockErrorLogs;
    
    if (statusFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.status === statusFilter);
    }
    
    if (severityFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.severity === severityFilter);
    }
    
    if (moduleFilter !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.module === moduleFilter);
    }
    
    setErrorLogs(filteredLogs);
    
    // Hitung statistik
    const stats = {
      total: mockErrorLogs.length,
      resolved: mockErrorLogs.filter(log => log.status === 'resolved').length,
      critical: mockErrorLogs.filter(log => log.severity === 'critical').length,
      retrySuccess: mockErrorLogs.filter(log => log.status === 'resolved' && log.retryCount > 0).length,
      moduleBreakdown: {}
    };
    
    // Hitung breakdown berdasarkan modul
    mockErrorLogs.forEach(log => {
      if (!stats.moduleBreakdown[log.module]) {
        stats.moduleBreakdown[log.module] = 0;
      }
      stats.moduleBreakdown[log.module]++;
    });
    
    setStatistics(stats);
  };
  
  // Fungsi untuk mencoba ulang operasi yang error
  const retryOperation = (errorId: string) => {
    console.log(`Mencoba ulang operasi untuk error ID: ${errorId}`);
    
    // Cari error dalam daftar
    const errorLog = errorLogs.find(log => log.id === errorId);
    if (!errorLog) return;
    
    // Dalam implementasi nyata, ini akan menggunakan errorManager
    // untuk menjalankan kembali operasi
    
    // Simulasi hasil retry
    const isSuccess = Math.random() > 0.3; // 70% tingkat keberhasilan
    
    if (isSuccess) {
      // Update status error
      const updatedLogs = errorLogs.map(log => {
        if (log.id === errorId) {
          return { ...log, status: 'resolved' as const, retryCount: log.retryCount + 1 };
        }
        return log;
      });
      
      setErrorLogs(updatedLogs);
      alert('Operasi berhasil diulang dan error teratasi');
    } else {
      const updatedLogs = errorLogs.map(log => {
        if (log.id === errorId) {
          return { ...log, retryCount: log.retryCount + 1 };
        }
        return log;
      });
      
      setErrorLogs(updatedLogs);
      alert('Operasi gagal diulang. Silakan coba lagi nanti');
    }
  };
  
  // Fungsi untuk mengubah status error
  const updateErrorStatus = (errorId: string, newStatus: 'acknowledged' | 'resolved' | 'ignored') => {
    const updatedLogs = errorLogs.map(log => {
      if (log.id === errorId) {
        return { ...log, status: newStatus };
      }
      return log;
    });
    
    setErrorLogs(updatedLogs);
    alert(`Status error berhasil diubah menjadi: ${newStatus}`);
  };
  
  // Helper untuk mendapatkan warna badge berdasarkan severity
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <Badge className="bg-amber-100 text-amber-800">Peringatan</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'critical':
        return <Badge className="bg-purple-100 text-purple-800">Kritis</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{severity}</Badge>;
    }
  };
  
  // Helper untuk mendapatkan warna badge berdasarkan status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">Baru</Badge>;
      case 'acknowledged':
        return <Badge className="bg-amber-100 text-amber-800">Diketahui</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Teratasi</Badge>;
      case 'ignored':
        return <Badge className="bg-gray-100 text-gray-800">Diabaikan</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  // Unique modules for filtering
  const modules = ['POS Integration', 'Stock Synchronization', 'Transaction Processing', 'Inventory Tracking'];
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        {/* Elemen dekoratif berbentuk lingkaran dengan blur */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 blur-xl transform translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white opacity-10 blur-xl transform -translate-x-10 translate-y-10"></div>
        
        <CardTitle className="text-xl font-bold z-10">Sistem Penanganan Error</CardTitle>
        <CardDescription className="text-white/80 z-10">
          Monitoring dan manajemen error dalam integrasi POS dan inventaris
        </CardDescription>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 z-10">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="new">Baru</SelectItem>
              <SelectItem value="acknowledged">Diketahui</SelectItem>
              <SelectItem value="resolved">Teratasi</SelectItem>
              <SelectItem value="ignored">Diabaikan</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="Filter severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Severity</SelectItem>
              <SelectItem value="warning">Peringatan</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Kritis</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="Filter modul" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Modul</SelectItem>
              {modules.map(module => (
                <SelectItem key={module} value={module}>{module}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger 
                value="current" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Error Aktif
              </TabsTrigger>
              <TabsTrigger 
                value="statistics" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                Statistik & Analisis
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="current" className="space-y-4 p-4">
            {errorLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Waktu</TableHead>
                      <TableHead>Modul & Operasi</TableHead>
                      <TableHead>Pesan Error</TableHead>
                      <TableHead className="w-[100px]">Severity</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[120px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errorLogs.map(error => (
                      <TableRow key={error.id}>
                        <TableCell className="font-medium">
                          {format(error.timestamp, 'dd MMM yyyy, HH:mm:ss', { locale: id })}
                        </TableCell>
                        <TableCell>
                          <div>{error.module}</div>
                          <div className="text-sm text-gray-500">{error.operation}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[300px] truncate" title={error.errorMessage}>
                            {error.errorMessage}
                          </div>
                          {error.retryCount > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {error.retryCount} kali dicoba ulang
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                        <TableCell>{getStatusBadge(error.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {error.status !== 'resolved' && error.status !== 'ignored' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => retryOperation(error.id)}
                                  title="Coba Ulang"
                                >
                                  <FaRedoAlt size={12} />
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateErrorStatus(error.id, 'resolved')}
                                  title="Tandai Teratasi"
                                >
                                  <FaCheckCircle size={12} className="text-green-600" />
                                </Button>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => updateErrorStatus(error.id, 'ignored')}
                                  title="Abaikan"
                                >
                                  <FaBan size={12} className="text-gray-600" />
                                </Button>
                              </>
                            )}
                            
                            {error.status === 'new' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateErrorStatus(error.id, 'acknowledged')}
                                title="Tandai Diketahui"
                              >
                                <FaEye size={12} className="text-blue-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <FaCheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Tidak Ada Error Aktif</h3>
                <p className="text-gray-500 mt-2">Semua sistem berjalan dengan baik!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="statistics" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="overflow-hidden border-orange-100 shadow-sm">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Error</p>
                      <h3 className="text-2xl font-bold mt-1">{statistics.total}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <FaExclamationTriangle className="text-red-500" size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress
                      value={(statistics.resolved / Math.max(statistics.total, 1)) * 100}
                      className="h-2"
                      indicatorClassName="bg-gradient-to-r from-orange-500 to-amber-500"
                    />
                    <div className="text-sm text-gray-500 mt-2">
                      {statistics.resolved} teratasi ({((statistics.resolved / Math.max(statistics.total, 1)) * 100).toFixed(0)}%)
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-orange-100 shadow-sm">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Error Kritis</p>
                      <h3 className="text-2xl font-bold mt-1">{statistics.critical}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <FaExclamationTriangle className="text-purple-500" size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <div className="font-medium">{statistics.total - statistics.critical}</div>
                        <div className="text-gray-500 text-xs">Non-Kritis</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded text-center">
                        <div className="font-medium text-purple-700">{statistics.critical}</div>
                        <div className="text-purple-500 text-xs">Kritis</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-orange-100 shadow-sm">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Tingkat Keberhasilan Retry</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {statistics.retrySuccess}/{statistics.resolved}
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FaRedoAlt className="text-green-500" size={20} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-500">
                      {statistics.resolved > 0 
                        ? `${((statistics.retrySuccess / statistics.resolved) * 100).toFixed(0)}% error teratasi melalui retry otomatis`
                        : 'Belum ada data retry'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="overflow-hidden border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Distribusi Error Berdasarkan Modul</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {typeof window !== 'undefined' && (
                      <Chart
                        options={{
                          chart: {
                            type: 'pie',
                            fontFamily: 'Inter, sans-serif'
                          },
                          labels: Object.keys(statistics.moduleBreakdown),
                          colors: ['#ff6b35', '#f7c59f', '#ffdc5e', '#5aa9e6'],
                          legend: {
                            position: 'bottom'
                          },
                          dataLabels: {
                            enabled: true
                          },
                          responsive: [{
                            breakpoint: 480,
                            options: {
                              chart: {
                                width: 250
                              },
                              legend: {
                                position: 'bottom'
                              }
                            }
                          }]
                        }}
                        series={Object.values(statistics.moduleBreakdown)}
                        type="pie"
                        height={300}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-orange-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Statistik Error Harian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {typeof window !== 'undefined' && (
                      <Chart
                        options={{
                          chart: {
                            type: 'bar',
                            fontFamily: 'Inter, sans-serif',
                            toolbar: {
                              show: false
                            }
                          },
                          plotOptions: {
                            bar: {
                              borderRadius: 4,
                              columnWidth: '60%',
                              colors: {
                                ranges: [
                                  {
                                    from: 0,
                                    to: 2,
                                    color: '#4caf50'
                                  },
                                  {
                                    from: 3,
                                    to: 5,
                                    color: '#ff9800'
                                  },
                                  {
                                    from: 6,
                                    to: 50,
                                    color: '#f44336'
                                  }
                                ]
                              }
                            }
                          },
                          dataLabels: {
                            enabled: false
                          },
                          xaxis: {
                            categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                            labels: {
                              style: {
                                fontSize: '12px'
                              }
                            }
                          },
                          yaxis: {
                            title: {
                              text: 'Jumlah Error'
                            }
                          },
                          colors: ['#ff6b35']
                        }}
                        series={[
                          {
                            name: 'Error',
                            data: [4, 3, 5, 8, 2, 1, 3]
                          }
                        ]}
                        type="bar"
                        height={300}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <FaHistory className="inline-block mr-1" size={14} />
          Update terakhir: {format(new Date(), 'dd MMM yyyy, HH:mm:ss', { locale: id })}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FaFilter size={12} />
            <span>Clear Filter</span>
          </Button>
          
          <Button variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1">
            <FaPlus size={12} />
            <span>Mulai Diagnosa</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Helper untuk generate mock data
const generateMockErrorLogs = (): ErrorLog[] => {
  const modules = ['POS Integration', 'Stock Synchronization', 'Transaction Processing', 'Inventory Tracking'];
  const operations = [
    'syncData', 'processTransaction', 'updateInventory', 'fetchProductData', 
    'calculateTotals', 'validateStock', 'transferData', 'generateReport'
  ];
  const errorMessages = [
    'Koneksi terputus saat sinkronisasi data',
    'Gagal memvalidasi data transaksi: Format tidak valid',
    'Timeout saat memproses pembaruan stok',
    'Data produk tidak ditemukan di server',
    'Conflict pada pembaruan stok simultan',
    'Server tidak merespons permintaan data',
    'Invalid access token saat mengakses API',
    'Foreign key constraint failed pada update stok'
  ];
  
  // Generate 15 error logs
  const logs: ErrorLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < 15; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 72));
    
    const severityOptions: ('warning' | 'error' | 'critical')[] = ['warning', 'error', 'critical'];
    const statusOptions: ('new' | 'acknowledged' | 'resolved' | 'ignored')[] = ['new', 'acknowledged', 'resolved', 'ignored'];
    
    logs.push({
      id: `ERR-${Math.floor(Math.random() * 10000)}`,
      timestamp,
      module: modules[Math.floor(Math.random() * modules.length)],
      operation: operations[Math.floor(Math.random() * operations.length)],
      errorMessage: errorMessages[Math.floor(Math.random() * errorMessages.length)],
      severity: severityOptions[Math.floor(Math.random() * severityOptions.length)],
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      retryCount: Math.floor(Math.random() * 3),
      context: { userId: `USR-${Math.floor(Math.random() * 100)}` }
    });
  }
  
  // Sort by timestamp (newest first)
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default ErrorDashboard;
