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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaPlay, FaStop, FaBug, FaPaperPlane, FaSync } from 'react-icons/fa';

// Komponen untuk testing WebSocket
const WebSocketTester: React.FC = () => {
  const [wsUrl, setWsUrl] = useState<string>('wss://api.farmax.co.id/ws/pos-inventory');
  const [connected, setConnected] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState<string>('{"type":"stock_movement","productId":"P001","quantity":2}');
  const [activeTab, setActiveTab] = useState<string>('connection');
  const [intervalMs, setIntervalMs] = useState<number>(5000);
  const [autoInterval, setAutoInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Fungsi untuk menambahkan log
  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [`[${timestamp}] [${type.toUpperCase()}] ${message}`, ...prev.slice(0, 99)]);
  };
  
  // Fungsi untuk connect ke WebSocket
  const connectWebSocket = () => {
    addLog(`Mencoba menghubungkan ke ${wsUrl}...`, 'info');
    
    // Simulasi koneksi untuk keperluan demo
    setTimeout(() => {
      setConnected(true);
      addLog('WebSocket terhubung dengan sukses!', 'success');
    }, 1500);
  };
  
  // Fungsi untuk disconnect dari WebSocket
  const disconnectWebSocket = () => {
    addLog('Menutup koneksi WebSocket...', 'info');
    
    // Simulasi disconnect
    setTimeout(() => {
      setConnected(false);
      addLog('WebSocket terputus.', 'info');
      
      // Clear auto interval jika ada
      if (autoInterval) {
        clearInterval(autoInterval);
        setAutoInterval(null);
      }
    }, 500);
  };
  
  // Fungsi untuk mengirim pesan test
  const sendTestMessage = () => {
    if (!connected) {
      addLog('Tidak dapat mengirim pesan: WebSocket tidak terhubung.', 'error');
      return;
    }
    
    try {
      // Validasi JSON
      const parsedMessage = JSON.parse(testMessage);
      
      addLog(`Mengirim pesan: ${testMessage}`, 'info');
      
      // Simulasi respons untuk uji coba
      setTimeout(() => {
        addLog(`Respons diterima: {"status":"success","message":"Processed stock movement for ${parsedMessage.productId}"}`, 'success');
      }, 800);
    } catch (e) {
      addLog(`Error memparsing JSON: ${e.message}`, 'error');
    }
  };
  
  // Toggle auto send interval
  const toggleAutoSend = () => {
    if (autoInterval) {
      clearInterval(autoInterval);
      setAutoInterval(null);
      addLog('Auto-send dinonaktifkan', 'info');
    } else {
      const interval = setInterval(() => {
        if (connected) {
          try {
            const parsedMessage = JSON.parse(testMessage);
            // Modifikasi productId atau quantity secara acak untuk testing berbagai skenario
            const randomProductId = `P${String(Math.floor(Math.random() * 10) + 1).padStart(3, '0')}`;
            const randomQuantity = Math.floor(Math.random() * 5) + 1;
            
            const modifiedMessage = {
              ...parsedMessage,
              productId: randomProductId,
              quantity: randomQuantity
            };
            
            const messageString = JSON.stringify(modifiedMessage);
            addLog(`Auto-send: ${messageString}`, 'info');
            
            // Simulasi respons untuk uji coba
            setTimeout(() => {
              addLog(`Respons auto-send: {"status":"success","message":"Processed stock movement for ${modifiedMessage.productId}"}`, 'success');
            }, 500);
          } catch (e) {
            addLog(`Error auto-send: ${e.message}`, 'error');
          }
        } else {
          addLog('Auto-send gagal: WebSocket tidak terhubung.', 'error');
          clearInterval(autoInterval);
          setAutoInterval(null);
        }
      }, intervalMs);
      
      setAutoInterval(interval);
      addLog(`Auto-send diaktifkan, interval: ${intervalMs}ms`, 'info');
    }
  };
  
  // Simulasi error untuk testing
  const simulateError = () => {
    if (!connected) {
      addLog('Tidak dapat mensimulasikan error: WebSocket tidak terhubung.', 'error');
      return;
    }
    
    addLog('Mensimulasikan error koneksi...', 'info');
    
    setTimeout(() => {
      setConnected(false);
      addLog('Error koneksi: Connection closed abnormally (code: 1006)', 'error');
      
      // Clear auto interval jika ada
      if (autoInterval) {
        clearInterval(autoInterval);
        setAutoInterval(null);
      }
      
      // Simulasi reconnect otomatis setelah 3 detik
      addLog('Mencoba menghubungkan kembali dalam 3 detik...', 'info');
      setTimeout(() => {
        setConnected(true);
        addLog('WebSocket berhasil terhubung kembali!', 'success');
      }, 3000);
    }, 1000);
  };
  
  // Clean up interval pada unmount
  useEffect(() => {
    return () => {
      if (autoInterval) {
        clearInterval(autoInterval);
      }
    };
  }, [autoInterval]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        {/* Elemen dekoratif berbentuk lingkaran dengan blur */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white opacity-10 blur-xl transform translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white opacity-10 blur-xl transform -translate-x-10 translate-y-10"></div>
        
        <CardTitle className="text-lg font-bold z-10">WebSocket Tester</CardTitle>
        <CardDescription className="text-white/80 z-10">
          Tool untuk verifikasi koneksi WebSocket real-time tracker
        </CardDescription>
        
        <div className="flex items-center gap-3 mt-2 z-10">
          <Badge className={connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {connected ? "Terhubung" : "Terputus"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-4 mt-4 mb-2">
            <TabsTrigger 
              value="connection" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Koneksi
            </TabsTrigger>
            <TabsTrigger 
              value="messages" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Pesan & Pengujian
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="ws-url">URL WebSocket</Label>
                <Input 
                  id="ws-url" 
                  value={wsUrl} 
                  onChange={(e) => setWsUrl(e.target.value)} 
                  placeholder="wss://example.com/ws"
                  disabled={connected}
                />
              </div>
              
              <div className="flex items-center gap-2">
                {!connected ? (
                  <Button 
                    className="bg-orange-500 hover:bg-orange-600"
                    onClick={connectWebSocket}
                  >
                    <FaPlay className="mr-2" size={14} />
                    Connect
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={disconnectWebSocket}
                  >
                    <FaStop className="mr-2" size={14} />
                    Disconnect
                  </Button>
                )}
                
                {connected && (
                  <Button 
                    variant="destructive"
                    onClick={simulateError}
                  >
                    <FaBug className="mr-2" size={14} />
                    Simulasi Error
                  </Button>
                )}
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle>Informasi Koneksi</AlertTitle>
                <AlertDescription>
                  Untuk pengujian real-time tracker, pastikan server WebSocket menerima dan mengirim pesan dalam format yang sesuai.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="p-4 space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="test-message">Pesan Uji (format JSON)</Label>
                <Input 
                  id="test-message" 
                  value={testMessage} 
                  onChange={(e) => setTestMessage(e.target.value)} 
                  placeholder='{"type":"command","action":"..."}'
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="interval">Interval Auto-send (ms)</Label>
                  <Input 
                    id="interval" 
                    type="number" 
                    value={intervalMs} 
                    onChange={(e) => setIntervalMs(parseInt(e.target.value))} 
                    min={1000}
                    step={500}
                  />
                </div>
                
                <div className="flex items-center gap-2 self-end">
                  <Button 
                    onClick={sendTestMessage}
                    disabled={!connected}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <FaPaperPlane className="mr-2" size={14} />
                    Kirim Sekali
                  </Button>
                  
                  <Button 
                    variant={autoInterval ? "destructive" : "outline"}
                    onClick={toggleAutoSend}
                    disabled={!connected}
                  >
                    <FaSync className="mr-2" size={14} />
                    {autoInterval ? "Stop Auto" : "Auto Send"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="p-4 border-t">
          <h3 className="font-medium mb-2">Log Aktivitas</h3>
          <div className="bg-gray-50 border rounded-md h-60 overflow-y-auto p-2 font-mono text-xs">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`py-1 ${
                    log.includes('[ERROR]') 
                      ? 'text-red-600' 
                      : log.includes('[SUCCESS]') 
                        ? 'text-green-600' 
                        : 'text-gray-700'
                  }`}
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic">
                Log aktivitas akan muncul di sini...
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4 flex justify-between">
        <div className="text-sm text-gray-500">
          {connected ? (
            <span className="text-green-600">● Koneksi aktif</span>
          ) : (
            <span className="text-red-600">● Tidak terhubung</span>
          )}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setLogs([])}
        >
          Clear Log
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebSocketTester;
