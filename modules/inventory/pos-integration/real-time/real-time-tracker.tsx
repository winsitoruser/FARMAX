import React, { useState, useEffect, useRef } from 'react';
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  FaSyncAlt, FaBoxes, FaArrowDown, FaExclamationTriangle, 
  FaCheckCircle, FaStore, FaHistory, FaPause, FaPlay
} from 'react-icons/fa';

// Tipe untuk transaksi dan pergerakan stok
interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  category: string;
  branchName: string;
  transactionId: string;
  invoiceNumber: string;
  timestamp: Date;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  value: number;
}

// Status koneksi WebSocket
enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

const RealTimeStockTracker: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [isPaused, setIsPaused] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  
  const wsRef = useRef<WebSocket | null>(null);
  
  // Efek untuk menginisialisasi WebSocket
  useEffect(() => {
    if (!isPaused && !wsRef.current) {
      connectWebSocket();
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isPaused]);
  
  // Fungsi untuk menghubungkan ke WebSocket
  const connectWebSocket = () => {
    // Dalam produksi, URL ini akan diganti dengan endpoint WebSocket aktual
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.farmax.co.id/ws/pos-inventory';
    
    setConnectionStatus(ConnectionStatus.CONNECTING);
    
    try {
      // Simulasi koneksi WebSocket
      // Dalam implementasi nyata, ini akan menggunakan koneksi WebSocket sebenarnya
      setTimeout(() => {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        setLastSync(new Date());
        
        // Simulasi menerima data setiap 5 detik
        const interval = setInterval(() => {
          if (!isPaused) {
            const newMovement = generateDummyMovement();
            setMovements(prev => [newMovement, ...prev].slice(0, 100)); // Simpan max 100 item
            setTotalProcessed(prev => prev + 1);
            
            // Secara acak, simulasi error sesekali
            if (Math.random() < 0.05) {
              setErrorCount(prev => prev + 1);
              showNotification(
                'Terjadi kesalahan dalam sinkronisasi produk ' + newMovement.productName,
                'error'
              );
            }
          }
        }, 5000);
        
        return () => clearInterval(interval);
      }, 1500);
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionStatus(ConnectionStatus.ERROR);
    }
  };
  
  // Fungsi untuk menonaktifkan/mengaktifkan sinkronisasi real-time
  const togglePause = () => {
    setIsPaused(!isPaused);
    
    if (isPaused) {
      connectWebSocket();
      showNotification('Pelacakan real-time diaktifkan kembali', 'success');
    } else {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      showNotification('Pelacakan real-time dijeda', 'info');
    }
  };
  
  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Sembunyikan notifikasi setelah 5 detik
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };
  
  // Render badge status koneksi
  const renderConnectionStatus = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return <Badge className="bg-green-100 text-green-800">Terhubung</Badge>;
      case ConnectionStatus.CONNECTING:
        return <Badge className="bg-blue-100 text-blue-800">Menghubungkan...</Badge>;
      case ConnectionStatus.DISCONNECTED:
        return <Badge className="bg-gray-100 text-gray-800">Tidak Terhubung</Badge>;
      case ConnectionStatus.ERROR:
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    }
  };
  
  // Generator data dummy untuk demo
  const generateDummyMovement = (): StockMovement => {
    const products = [
      { id: 'P001', name: 'Paracetamol 500mg', category: 'Obat Bebas' },
      { id: 'P002', name: 'Amoxicillin 500mg', category: 'Obat Keras' },
      { id: 'P003', name: 'Vitamin C 1000mg', category: 'Vitamin & Suplemen' },
      { id: 'P004', name: 'Antasida Tablet', category: 'Obat Bebas' },
      { id: 'P005', name: 'Cetirizine 10mg', category: 'Obat Bebas' }
    ];
    
    const branches = [
      'Apotek Pusat - Jakarta',
      'Cabang Bandung',
      'Cabang Surabaya',
      'Cabang Medan'
    ];
    
    const product = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const stockBefore = Math.floor(Math.random() * 500) + 100;
    
    return {
      id: 'SM' + Date.now(),
      productId: product.id,
      productName: product.name,
      category: product.category,
      branchName: branches[Math.floor(Math.random() * branches.length)],
      transactionId: 'TX' + Date.now(),
      invoiceNumber: 'INV/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + Math.floor(Math.random() * 1000),
      timestamp: new Date(),
      quantity,
      stockBefore,
      stockAfter: stockBefore - quantity,
      value: quantity * (Math.floor(Math.random() * 50000) + 10000)
    };
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        {/* Elemen dekoratif berbentuk lingkaran dengan blur */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 blur-xl transform translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white opacity-10 blur-xl transform -translate-x-10 translate-y-10"></div>
        
        <div className="flex items-center justify-between z-10">
          <div>
            <CardTitle className="text-lg font-bold">Pelacakan Stok Real-Time</CardTitle>
            <CardDescription className="text-white/80 mt-1">
              Monitoring pergerakan stok dari transaksi POS secara real-time
            </CardDescription>
          </div>
          
          <Button 
            variant={isPaused ? "outline" : "secondary"}
            className={isPaused ? "bg-white/20 border-white/30 text-white hover:bg-white/30" : ""}
            size="sm"
            onClick={togglePause}
          >
            {isPaused ? (
              <><FaPlay size={14} className="mr-2" /> Mulai</>
            ) : (
              <><FaPause size={14} className="mr-2" /> Jeda</>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-3 z-10">
          <div className="text-xs">Status:</div>
          {renderConnectionStatus()}
          
          {lastSync && (
            <div className="text-xs ml-4">
              Sinkronisasi terakhir: {format(lastSync, 'HH:mm:ss', { locale: id })}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Notifikasi */}
        {showAlert && (
          <div className="p-3">
            <Alert variant={alertType === 'error' ? 'destructive' : alertType === 'warning' ? 'warning' : 'default'}>
              {alertType === 'error' && <FaExclamationTriangle className="mr-2" />}
              {alertType === 'success' && <FaCheckCircle className="mr-2" />}
              {alertType === 'warning' && <FaExclamationTriangle className="mr-2" />}
              {alertType === 'info' && <FaSyncAlt className="mr-2" />}
              <AlertTitle>{alertType === 'error' ? 'Error' : alertType === 'warning' ? 'Peringatan' : alertType === 'success' ? 'Sukses' : 'Informasi'}</AlertTitle>
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Daftar pergerakan stok terbaru */}
        <div className="divide-y">
          {connectionStatus === ConnectionStatus.CONNECTING ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : movements.length > 0 ? (
            movements.map((movement, index) => (
              <div key={movement.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 flex items-center justify-center">
                      <FaBoxes className="text-orange-500" size={18} />
                    </div>
                    <div>
                      <div className="font-medium">{movement.productName}</div>
                      <div className="text-sm text-gray-500">{movement.category}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-red-600 flex items-center justify-end">
                      <FaArrowDown size={12} className="mr-1" />
                      {movement.quantity} unit
                    </div>
                    <div className="text-sm text-gray-500">{formatRupiah(movement.value)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaStore size={10} />
                    <span>{movement.branchName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaHistory size={10} />
                    <span>{format(movement.timestamp, 'HH:mm:ss', { locale: id })}</span>
                  </div>
                  <div>Invoice: {movement.invoiceNumber}</div>
                  <div>Stok: {movement.stockBefore} → {movement.stockAfter}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Belum ada pergerakan stok yang tercatat
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4">
        <div className="grid grid-cols-2 gap-4 w-full">
          <div>
            <div className="text-sm text-gray-500">Total Transaksi Tercatat</div>
            <div className="font-medium text-lg">{totalProcessed}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 flex items-center justify-between">
              <span>Error</span>
              <Badge variant="outline" className="text-red-600 border-red-200">
                {errorCount}
              </Badge>
            </div>
            <div className="mt-1">
              <Progress
                value={(totalProcessed - errorCount) / Math.max(totalProcessed, 1) * 100}
                className="h-2"
                indicatorClassName="bg-gradient-to-r from-orange-500 to-amber-500"
              />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RealTimeStockTracker;
