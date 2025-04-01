import { POSIntegrationAPI } from './api-service';
import { toast } from '@/components/ui/toast';

// Tipe untuk Error Log
export interface ErrorLog {
  id: string;
  timestamp: string;
  module: string;
  operation: string;
  severity: 'warning' | 'error' | 'critical';
  message: string;
  details: any;
  stackTrace?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

// Tipe untuk Error Resolution
export interface ErrorResolution {
  action: string;
  notes: string;
  autoRetry?: boolean;
}

// Kelas untuk manajemen error di integrasi POS
export class POSErrorManager {
  private static instance: POSErrorManager;
  private errorQueue: Map<string, RetryInfo>;
  private maxRetries: number = 3;
  private retryDelays: number[] = [5000, 15000, 30000]; // 5 detik, 15 detik, 30 detik
  
  // Informasi untuk retry operation
  private interface RetryInfo {
    operation: () => Promise<any>;
    context: any;
    retryCount: number;
    lastError: any;
    timeoutId?: NodeJS.Timeout;
  }
  
  private constructor() {
    this.errorQueue = new Map();
  }
  
  public static getInstance(): POSErrorManager {
    if (!POSErrorManager.instance) {
      POSErrorManager.instance = new POSErrorManager();
    }
    return POSErrorManager.instance;
  }
  
  /**
   * Log error ke server dan tangani sesuai severity
   */
  public async logError(
    error: any, 
    module: string, 
    operation: string, 
    severity: 'warning' | 'error' | 'critical' = 'error',
    context: any = {}
  ): Promise<string | null> {
    // Struktur error data yang akan di-log
    const errorData = {
      module,
      operation,
      severity,
      message: error.message || 'Unknown error',
      details: {
        ...context,
        code: error.code,
        response: error.response?.data
      },
      stackTrace: error.stack
    };
    
    try {
      // Log error ke server
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integration/pos/errors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(errorData)
      });
      
      if (!response.ok) {
        console.error('Failed to log error to server', await response.json());
        return null;
      }
      
      const result = await response.json();
      const errorId = result.id;
      
      // Notifikasi user berdasarkan severity
      this.notifyUser(severity, errorData.message, module);
      
      return errorId;
    } catch (logError) {
      // Fallback jika gagal log ke server, log ke console
      console.error('Failed to log error:', logError);
      console.error('Original Error:', errorData);
      return null;
    }
  }
  
  /**
   * Menampilkan notifikasi error ke user
   */
  private notifyUser(severity: 'warning' | 'error' | 'critical', message: string, module: string) {
    const title = `${severity === 'critical' ? 'Error Kritis' : severity === 'error' ? 'Error' : 'Peringatan'} - ${module}`;
    
    switch (severity) {
      case 'critical':
        toast({
          title,
          description: message,
          variant: 'destructive',
          duration: 10000 // 10 detik
        });
        break;
      case 'error':
        toast({
          title,
          description: message,
          variant: 'destructive',
          duration: 7000 // 7 detik
        });
        break;
      case 'warning':
        toast({
          title,
          description: message,
          variant: 'warning',
          duration: 5000 // 5 detik
        });
        break;
    }
  }
  
  /**
   * Menyelesaikan error yang tercatat
   */
  public async resolveError(errorId: string, resolution: ErrorResolution): Promise<boolean> {
    try {
      await POSIntegrationAPI.resolveError(errorId, resolution);
      
      // Jika autoRetry diaktifkan, coba lagi operasi
      if (resolution.autoRetry && this.errorQueue.has(errorId)) {
        const retryInfo = this.errorQueue.get(errorId)!;
        this.retryOperation(errorId, retryInfo);
      } else {
        this.errorQueue.delete(errorId);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to resolve error:', error);
      return false;
    }
  }
  
  /**
   * Menambahkan operasi ke queue untuk retry kemudian
   */
  public queueForRetry(
    errorId: string, 
    operation: () => Promise<any>, 
    context: any,
    error: any
  ): void {
    this.errorQueue.set(errorId, {
      operation,
      context,
      retryCount: 0,
      lastError: error
    });
  }
  
  /**
   * Coba kembali operasi yang gagal
   */
  public retryOperation(errorId: string, retryInfo?: RetryInfo): void {
    if (!retryInfo && this.errorQueue.has(errorId)) {
      retryInfo = this.errorQueue.get(errorId)!;
    }
    
    if (!retryInfo) {
      console.error(`No retry info found for error ID: ${errorId}`);
      return;
    }
    
    // Batalkan timeout yang ada jika ada
    if (retryInfo.timeoutId) {
      clearTimeout(retryInfo.timeoutId);
    }
    
    if (retryInfo.retryCount >= this.maxRetries) {
      console.log(`Max retries reached for error ID: ${errorId}`);
      this.errorQueue.delete(errorId);
      return;
    }
    
    // Set timeout untuk retry
    const delayIndex = Math.min(retryInfo.retryCount, this.retryDelays.length - 1);
    const delay = this.retryDelays[delayIndex];
    
    const timeoutId = setTimeout(async () => {
      try {
        console.log(`Retrying operation for error ID: ${errorId}, attempt: ${retryInfo!.retryCount + 1}`);
        await retryInfo!.operation();
        
        // Jika berhasil, hapus dari queue
        this.errorQueue.delete(errorId);
        
        // Notifikasi sukses
        toast({
          title: 'Operasi Berhasil',
          description: 'Operasi yang sebelumnya gagal telah berhasil dijalankan',
          variant: 'success',
          duration: 3000
        });
      } catch (error) {
        // Update retry info untuk percobaan berikutnya
        retryInfo!.retryCount++;
        retryInfo!.lastError = error;
        this.errorQueue.set(errorId, retryInfo!);
        
        // Log error baru
        this.logError(
          error, 
          retryInfo!.context.module || 'unknown', 
          `${retryInfo!.context.operation || 'unknown'} (retry ${retryInfo!.retryCount})`,
          retryInfo!.context.severity || 'error',
          retryInfo!.context
        );
      }
    }, delay);
    
    // Update timeoutId
    retryInfo.timeoutId = timeoutId;
    this.errorQueue.set(errorId, retryInfo);
  }
  
  /**
   * Mendapatkan daftar error yang belum terselesaikan
   */
  public async getUnresolvedErrors(params: {
    page?: number,
    limit?: number,
    module?: string,
    severity?: 'warning' | 'error' | 'critical'
  }): Promise<{ errors: ErrorLog[], total: number }> {
    try {
      const response = await POSIntegrationAPI.getErrorLogs({
        ...params,
        resolved: false
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get unresolved errors:', error);
      return { errors: [], total: 0 };
    }
  }
  
  /**
   * Mendapatkan statistik error
   */
  public async getErrorStats(): Promise<{
    total: number;
    critical: number;
    error: number;
    warning: number;
    unresolvedByModule: { module: string; count: number }[];
  }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integration/pos/errors/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get error stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get error stats:', error);
      return {
        total: 0,
        critical: 0,
        error: 0,
        warning: 0,
        unresolvedByModule: []
      };
    }
  }
  
  /**
   * Utility untuk menangani operasi dengan retry otomatis
   */
  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    module: string,
    operationName: string,
    context: any = {},
    maxRetries: number = this.maxRetries
  ): Promise<T> {
    let retryCount = 0;
    
    while (true) {
      try {
        return await operation();
      } catch (error: any) {
        retryCount++;
        
        // Jika sudah melebihi maksimum retry, log error dan throw
        if (retryCount > maxRetries) {
          const errorId = await this.logError(
            error,
            module,
            operationName,
            context.severity || 'error',
            { ...context, maxRetriesExceeded: true }
          );
          
          if (errorId) {
            this.queueForRetry(errorId, operation, {
              module,
              operation: operationName,
              ...context
            }, error);
          }
          
          throw error;
        }
        
        // Log warning dan coba lagi
        console.warn(`Operation ${operationName} failed, retrying (${retryCount}/${maxRetries})...`, error);
        
        // Delay sebelum retry berikutnya
        const delayIndex = Math.min(retryCount - 1, this.retryDelays.length - 1);
        const delay = this.retryDelays[delayIndex];
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

// Singleton instance
export const errorManager = POSErrorManager.getInstance();

// HOC untuk wrapping API calls dengan error handling
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  module: string,
  operation: string,
  context: any = {}
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      await errorManager.logError(error, module, operation, context.severity || 'error', {
        ...context,
        args
      });
      throw error;
    }
  };
};

// Error codes untuk operasi POS Integration
export const POS_ERROR_CODES = {
  SYNC_FAILED: 'POS_SYNC_001',
  CONNECTION_FAILED: 'POS_CONN_001',
  AUTH_FAILED: 'POS_AUTH_001',
  DATA_VALIDATION_FAILED: 'POS_DATA_001',
  TRANSACTION_FAILED: 'POS_TRX_001',
  INVENTORY_UPDATE_FAILED: 'POS_INV_001'
};
