import React, { useState, useEffect } from 'react';
import { 
  FaSyncAlt, FaServer, FaCheck, FaTimes, FaExclamationTriangle,
  FaClock, FaHistory, FaCog, FaPlus, FaPlay, FaPause
} from 'react-icons/fa';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Data sampel untuk konfigurasi sinkronisasi
const syncConfig = {
  autoSync: true,
  syncInterval: '30', // dalam menit
  syncOnSale: true,
  syncOnInventoryChange: true,
  syncOnStartup: true,
  lastFullSync: '2025-03-29T15:30:00'
};

// Data sampel untuk log sinkronisasi
const syncLogs = [
  {
    id: 'SL001',
    timestamp: '2025-03-30T14:30:00',
    type: 'auto',
    status: 'success',
    duration: 12, // dalam detik
    recordsProcessed: 125,
    errors: 0,
    message: 'Sinkronisasi berhasil'
  },
  {
    id: 'SL002',
    timestamp: '2025-03-30T13:00:00',
    type: 'manual',
    status: 'success',
    duration: 20,
    recordsProcessed: 256,
    errors: 0,
    message: 'Sinkronisasi penuh berhasil'
  },
  {
    id: 'SL003',
    timestamp: '2025-03-30T09:30:00',
    type: 'auto',
    status: 'partial',
    duration: 15,
    recordsProcessed: 145,
    errors: 3,
    message: 'Sinkronisasi sebagian berhasil dengan 3 error'
  },
  {
    id: 'SL004',
    timestamp: '2025-03-29T18:30:00',
    type: 'transaction',
    status: 'success',
    duration: 2,
    recordsProcessed: 1,
    errors: 0,
    message: 'Sinkronisasi transaksi baru'
  },
  {
    id: 'SL005',
    timestamp: '2025-03-29T15:30:00',
    type: 'manual',
    status: 'error',
    duration: 5,
    recordsProcessed: 0,
    errors: 1,
    message: 'Gagal terhubung ke server POS'
  }
];

// Data sampel tabel status sinkronisasi item
const syncStatusItems = [
  {
    id: 'POS001',
    module: 'Transaksi POS',
    status: 'synced',
    lastSync: '2025-03-30T14:30:00',
    recordCount: 1254,
    errorCount: 0
  },
  {
    id: 'INV001',
    module: 'Stok Produk',
    status: 'synced',
    lastSync: '2025-03-30T14:30:00',
    recordCount: 2145,
    errorCount: 0
  },
  {
    id: 'PROD001',
    module: 'Master Produk',
    status: 'synced',
    lastSync: '2025-03-30T13:00:00',
    recordCount: 1520,
    errorCount: 0
  },
  {
    id: 'CUST001',
    module: 'Pelanggan',
    status: 'partial',
    lastSync: '2025-03-30T09:30:00',
    recordCount: 850,
    errorCount: 3
  },
  {
    id: 'SUPP001',
    module: 'Supplier',
    status: 'error',
    lastSync: '2025-03-29T15:30:00',
    recordCount: 0,
    errorCount: 1
  }
];

interface SinkronisasiDataProps {
  // Props yang mungkin diperlukan
}

const SinkronisasiData: React.FC<SinkronisasiDataProps> = () => {
  const [activeTab, setActiveTab] = useState('status');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStartTime, setSyncStartTime] = useState<Date | null>(null);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [isLogDetailOpen, setIsLogDetailOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState(syncConfig);
  
  // Simulasi proses sinkronisasi
  const handleStartSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncStartTime(new Date());
    
    // Simulasi progress sinkronisasi
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };
  
  // Handler untuk melihat detail log
  const handleViewLogDetail = (log: any) => {
    setSelectedLog(log);
    setIsLogDetailOpen(true);
  };
  
  // Handler untuk menyimpan konfigurasi
  const handleSaveConfig = () => {
    // Disini akan ada kode untuk menyimpan konfigurasi ke API
    console.log('Konfigurasi disimpan:', config);
    setIsConfigOpen(false);
  };
  
  // Helper untuk badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><FaCheck size={10} /> Berhasil</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1"><FaExclamationTriangle size={10} /> Sebagian</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1"><FaTimes size={10} /> Gagal</Badge>;
      case 'synced':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><FaCheck size={10} /> Tersinkronisasi</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  // Helper untuk tipe sinkronisasi
  const getSyncTypeLabel = (type: string) => {
    switch (type) {
      case 'auto':
        return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1"><FaClock size={10} /> Otomatis</Badge>;
      case 'manual':
        return <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1"><FaPlay size={10} /> Manual</Badge>;
      case 'transaction':
        return <Badge className="bg-teal-100 text-teal-800 flex items-center gap-1"><FaPlus size={10} /> Transaksi</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Panel Status Sinkronisasi */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="status">Status Sinkronisasi</TabsTrigger>
          <TabsTrigger value="logs">Log Sinkronisasi</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4">
          {/* Panel sinkronisasi */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaSyncAlt className="text-orange-500" />
                  <span>Status Sinkronisasi POS & Inventaris</span>
                </div>
                <Button 
                  onClick={handleStartSync} 
                  disabled={isSyncing}
                  className="flex items-center gap-2"
                >
                  <FaPlay size={14} />
                  <span>Sinkronisasi Sekarang</span>
                </Button>
              </CardTitle>
              <CardDescription>
                Sinkronisasi terakhir: {format(new Date(syncConfig.lastFullSync), 'dd MMMM yyyy, HH:mm', { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSyncing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Sinkronisasi sedang berlangsung...</div>
                    <div className="text-sm text-gray-500">
                      {syncProgress}%
                    </div>
                  </div>
                  <Progress value={syncProgress} className="h-2" />
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>Waktu mulai: {syncStartTime ? format(syncStartTime, 'HH:mm:ss', { locale: id }) : '-'}</span>
                    <span>Estimasi selesai: {syncStartTime ? format(new Date(syncStartTime.getTime() + 5000), 'HH:mm:ss', { locale: id }) : '-'}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Modul</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Terakhir Sinkronisasi</TableHead>
                        <TableHead className="text-right">Jumlah Data</TableHead>
                        <TableHead className="text-right">Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncStatusItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.module}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>{format(new Date(item.lastSync), 'dd MMM yyyy, HH:mm', { locale: id })}</TableCell>
                          <TableCell className="text-right">{item.recordCount.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.errorCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FaHistory className="text-orange-500" />
                <span>Riwayat Sinkronisasi</span>
              </CardTitle>
              <CardDescription>
                Riwayat aktivitas sinkronisasi antara POS dan sistem inventaris
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Durasi</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                    <TableHead className="text-right">Pesan</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm', { locale: id })}</TableCell>
                      <TableCell>{getSyncTypeLabel(log.type)}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="text-right">{log.duration} detik</TableCell>
                      <TableCell className="text-right">{log.recordsProcessed}</TableCell>
                      <TableCell className="text-right">{log.message}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewLogDetail(log)}
                          className="h-8 w-8 p-0 text-blue-600"
                        >
                          <FaCheck size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <FaCog className="text-orange-500" />
                <span>Pengaturan Sinkronisasi</span>
              </CardTitle>
              <CardDescription>
                Konfigurasi proses sinkronisasi antara POS dan inventaris
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="auto-sync" className="flex-1">Sinkronisasi Otomatis</Label>
                  <Switch 
                    id="auto-sync" 
                    checked={config.autoSync}
                    onCheckedChange={(checked) => setConfig({...config, autoSync: checked})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sync-interval">Interval Sinkronisasi (menit)</Label>
                    <Select 
                      value={config.syncInterval}
                      onValueChange={(value) => setConfig({...config, syncInterval: value})}
                    >
                      <SelectTrigger id="sync-interval">
                        <SelectValue placeholder="Pilih interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 menit</SelectItem>
                        <SelectItem value="10">10 menit</SelectItem>
                        <SelectItem value="15">15 menit</SelectItem>
                        <SelectItem value="30">30 menit</SelectItem>
                        <SelectItem value="60">60 menit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sync-on-sale" className="flex-1">Sinkronisasi pada Setiap Penjualan</Label>
                  <Switch 
                    id="sync-on-sale" 
                    checked={config.syncOnSale}
                    onCheckedChange={(checked) => setConfig({...config, syncOnSale: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sync-on-inventory" className="flex-1">Sinkronisasi pada Perubahan Inventaris</Label>
                  <Switch 
                    id="sync-on-inventory" 
                    checked={config.syncOnInventoryChange}
                    onCheckedChange={(checked) => setConfig({...config, syncOnInventoryChange: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="sync-on-startup" className="flex-1">Sinkronisasi pada Startup Aplikasi</Label>
                  <Switch 
                    id="sync-on-startup" 
                    checked={config.syncOnStartup}
                    onCheckedChange={(checked) => setConfig({...config, syncOnStartup: checked})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="flex items-center gap-2" onClick={handleSaveConfig}>
                <FaCheck size={14} />
                <span>Simpan Pengaturan</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog detail log */}
      <Dialog open={isLogDetailOpen} onOpenChange={setIsLogDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Log Sinkronisasi</DialogTitle>
            <DialogDescription>
              {selectedLog && (
                <>{format(new Date(selectedLog.timestamp), 'dd MMMM yyyy, HH:mm:ss', { locale: id })}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Informasi Umum</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">ID Log</span>
                      <span className="text-sm font-medium">{selectedLog.id}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Tipe</span>
                      <span className="text-sm font-medium">
                        {getSyncTypeLabel(selectedLog.type)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="text-sm font-medium">
                        {getStatusBadge(selectedLog.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Metrik</h3>
                  <div className="bg-gray-50 p-3 rounded-md space-y-2">
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Durasi</span>
                      <span className="text-sm font-medium">{selectedLog.duration} detik</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Records</span>
                      <span className="text-sm font-medium">{selectedLog.recordsProcessed}</span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="text-sm text-gray-500">Errors</span>
                      <span className="text-sm font-medium">{selectedLog.errors}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Pesan</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">{selectedLog.message}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogDetailOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SinkronisasiData;
