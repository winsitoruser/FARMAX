/**
 * use-module-sync.ts
 * 
 * Hook untuk mensinkronisasi data antar modul dalam aplikasi FARMAX
 * Memastikan konsistensi data dan status antara modul POS, Inventory, Finance, dll.
 */

import { useCallback, useEffect, useState } from 'react';
import { ModuleType } from '@/lib/integration-utils';

// Tipe untuk status sinkronisasi
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

// Interface untuk item yang akan disinkronkan
export interface SyncItem {
  id: string;
  type: string;
  sourceModule: ModuleType;
  targetModule: ModuleType;
  data: any;
  lastSyncedAt?: Date;
}

/**
 * Hook untuk mensinkronisasi data antar modul
 */
export function useModuleSync(sourceModule: ModuleType) {
  const [pendingItems, setPendingItems] = useState<SyncItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Menambahkan item ke queue sinkronisasi
   */
  const addToSyncQueue = useCallback((
    itemId: string,
    itemType: string,
    targetModule: ModuleType,
    data: any
  ) => {
    const syncItem: SyncItem = {
      id: itemId,
      type: itemType,
      sourceModule,
      targetModule,
      data,
      lastSyncedAt: undefined
    };

    setPendingItems(prev => [...prev, syncItem]);
    console.log(`[ModuleSync] Added item to sync queue: ${itemType} (${itemId}) → ${targetModule}`);
    
    return syncItem;
  }, [sourceModule]);

  /**
   * Mensinkronisasi semua item yang tertunda
   */
  const syncAllPendingItems = useCallback(async () => {
    if (pendingItems.length === 0 || syncStatus === 'syncing') {
      return;
    }

    setSyncStatus('syncing');
    setError(null);
    
    try {
      // Dalam implementasi nyata, ini akan melakukan API call atau operasi lain
      // untuk mensinkronisasi data antar modul
      
      // Simulasi delay sinkronisasi
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Menandai semua item sebagai tersinkronisasi
      const now = new Date();
      setPendingItems(prev => prev.map(item => ({
        ...item,
        lastSyncedAt: now
      })));
      
      setLastSyncedAt(now);
      setSyncStatus('success');
      
      console.log(`[ModuleSync] Successfully synced ${pendingItems.length} items`);
    } catch (err) {
      console.error('[ModuleSync] Error syncing items:', err);
      setError(err instanceof Error ? err.message : 'Unknown error during sync');
      setSyncStatus('error');
    }
  }, [pendingItems, syncStatus]);

  /**
   * Sinkronisasi otomatis saat ada perubahan dalam queue
   */
  useEffect(() => {
    if (pendingItems.length > 0 && syncStatus === 'idle') {
      // Tunda sinkronisasi sedikit untuk memungkinkan batching
      const timer = setTimeout(() => {
        syncAllPendingItems();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [pendingItems, syncStatus, syncAllPendingItems]);

  /**
   * Reset status setelah sinkronisasi selesai
   */
  useEffect(() => {
    if (syncStatus === 'success' || syncStatus === 'error') {
      const timer = setTimeout(() => {
        // Bersihkan queue jika sinkronisasi berhasil
        if (syncStatus === 'success') {
          setPendingItems([]);
        }
        setSyncStatus('idle');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  return {
    addToSyncQueue,
    syncAllPendingItems,
    pendingItems,
    syncStatus,
    lastSyncedAt,
    error,
    clearQueue: () => setPendingItems([])
  };
}

export default useModuleSync;
