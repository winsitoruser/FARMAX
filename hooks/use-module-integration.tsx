import { useEffect, useState } from 'react';
import { 
  subscribeToMessages, 
  sendModuleMessage, 
  ModuleMessage, 
  ModuleType 
} from '@/lib/integration-utils';

/**
 * Hook untuk mengintegrasikan modul-modul FARMAX
 * 
 * Menyediakan interface yang konsisten untuk komunikasi antar modul
 * dan menjaga sinkronisasi state dan alur proses bisnis
 */
export const useModuleIntegration = (currentModule: ModuleType) => {
  const [pendingMessages, setPendingMessages] = useState<ModuleMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mendaftarkan modul sebagai subscriber untuk menerima pesan
  useEffect(() => {
    const unsubscribe = subscribeToMessages(currentModule, (message) => {
      setPendingMessages(prev => [...prev, message]);
    });

    return () => {
      unsubscribe();
    };
  }, [currentModule]);

  // Memproses pesan yang tertunda
  useEffect(() => {
    const processMessages = async () => {
      if (pendingMessages.length > 0 && !isProcessing) {
        setIsProcessing(true);
        
        const currentMessage = pendingMessages[0];
        console.log(`[${currentModule}] Processing message:`, currentMessage);
        
        // Proses pesan sesuai dengan action
        await handleMessage(currentMessage);
        
        // Hapus pesan yang sudah diproses
        setPendingMessages(prev => prev.slice(1));
        setIsProcessing(false);
      }
    };
    
    processMessages();
  }, [pendingMessages, isProcessing, currentModule]);

  // Handler pesan berdasarkan action
  const handleMessage = async (message: ModuleMessage) => {
    // Contoh handling untuk beberapa tipe pesan umum
    switch (message.action) {
      case 'PRODUCT_UPDATED':
        console.log('Handling product update in module', currentModule);
        // Implementasi sesuai modul, misalnya refresh data produk
        break;
      
      case 'TRANSACTION_COMPLETED':
        console.log('Handling transaction completion in module', currentModule);
        // Implementasi sesuai modul, misalnya update laporan keuangan
        break;
      
      case 'PURCHASE_ORDER_RECEIVED':
        console.log('Handling purchase order receipt in module', currentModule);
        // Implementasi sesuai modul, misalnya update stok
        break;
      
      case 'INVENTORY_UPDATED':
        console.log('Handling inventory update in module', currentModule);
        // Implementasi sesuai modul, misalnya refresh tampilan stok
        break;
      
      default:
        console.log(`Unhandled message type: ${message.action} in module ${currentModule}`);
    }
    
    // Simulasi waktu proses
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  // Mengirim pesan ke modul lain
  const sendMessage = (
    targetModule: ModuleType, 
    action: string, 
    payload: any
  ) => {
    sendModuleMessage(currentModule, targetModule, action, payload);
  };

  // Function khusus untuk notifikasi perubahan inventory ke modul POS
  const notifyInventoryChange = (productId: string, newQuantity: number) => {
    sendMessage('pos', 'INVENTORY_UPDATED', { productId, quantity: newQuantity });
  };

  // Function khusus untuk notifikasi penjualan ke modul Finance
  const notifySalesToFinance = (saleData: any) => {
    sendMessage('finance', 'SALES_RECORDED', saleData);
  };

  // Function khusus untuk notifikasi pembelian ke modul Inventory
  const notifyPurchaseToInventory = (purchaseData: any) => {
    sendMessage('inventory', 'PURCHASE_RECORDED', purchaseData);
  };

  // Function khusus untuk notifikasi pembayaran invoice ke modul Finance
  const notifyInvoicePayment = (invoiceData: any) => {
    sendMessage('finance', 'INVOICE_PAID', invoiceData);
  };

  return {
    pendingMessages,
    sendMessage,
    notifyInventoryChange,
    notifySalesToFinance,
    notifyPurchaseToInventory,
    notifyInvoicePayment
  };
};

export default useModuleIntegration;
