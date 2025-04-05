import { POSIntegrationAPI } from './api-service';
import { useToast } from '@/components/ui/use-toast';

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

// Informasi untuk retry operation
interface RetryInfo {
  operation: () => Promise<any>;
  context: any;
  retryCount: number;
  lastError: any;
  timeoutId?: NodeJS.Timeout;
}

// Kelas untuk manajemen error di integrasi POS
export class POSErrorManager {
  private static instance: POSErrorManager;
  private errorQueue: Map<string, RetryInfo>;
  private maxRetries: number = 3;
  private retryDelays: number[] = [5000, 15000, 30000]; // 5 detik, 15 detik, 30 detik
  private toast: ReturnType<typeof useToast> | null = null;
  
  private constructor() {
    this.errorQueue = new Map<string, RetryInfo>();
  }
  
  public static getInstance(): POSErrorManager {
    if (!POSErrorManager.instance) {
      POSErrorManager.instance = new POSErrorManager();
    }
    return POSErrorManager.instance;
  }

  // Set toast function for notifications
  public setToast(toast: ReturnType<typeof useToast>): void {
    this.toast = toast;
  }

  // Log error ke server dan local storage
  public async logError(
    module: string,
    operation: string,
    severity: ErrorLog['severity'],
    message: string,
    details: any,
    stackTrace?: string
  ): Promise<string> {
    try {
      const errorLog: ErrorLog = {
        id: `ERR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        module,
        operation,
        severity,
        message,
        details,
        stackTrace,
        resolved: false
      };

      // Simpan ke local storage untuk tracking
      this.saveErrorToLocalStorage(errorLog);

      // Kirim ke server jika koneksi tersedia - commented out until API is implemented
      // try {
      //   await POSIntegrationAPI.logError(errorLog);
      // } catch (e) {
      //   console.warn('Tidak dapat mengirim error log ke server. Menyimpan secara lokal.', e);
      // }

      // Tampilkan notifikasi user sesuai severity
      this.showErrorNotification(errorLog);

      return errorLog.id;
    } catch (e) {
      console.error('Error dalam logging error:', e);
      return `ERR_FALLBACK_${Date.now()}`;
    }
  }

  // Simpan error ke localStorage
  private saveErrorToLocalStorage(errorLog: ErrorLog): void {
    try {
      const errors = this.getErrorsFromLocalStorage();
      errors.push(errorLog);
      
      // Batasi jumlah error yang disimpan (simpan 100 error terakhir)
      if (errors.length > 100) {
        errors.shift();
      }
      
      localStorage.setItem('pos_error_logs', JSON.stringify(errors));
    } catch (e) {
      console.error('Tidak dapat menyimpan error ke localStorage:', e);
    }
  }

  // Mendapatkan semua error dari localStorage
  private getErrorsFromLocalStorage(): ErrorLog[] {
    try {
      const errorsJson = localStorage.getItem('pos_error_logs');
      return errorsJson ? JSON.parse(errorsJson) : [];
    } catch (e) {
      console.error('Tidak dapat mengambil error dari localStorage:', e);
      return [];
    }
  }

  // Menampilkan notifikasi error ke user
  private showErrorNotification(errorLog: ErrorLog): void {
    const title = `Error: ${errorLog.operation}`;
    let message = errorLog.message;
    
    // If toast function is not available, log to console
    if (!this.toast) {
      console.warn(`${title}: ${message}`);
      return;
    }
    
    switch (errorLog.severity) {
      case 'warning':
        this.toast.toast({
          title: 'Warning',
          description: message,
          variant: 'default',
        });
        break;
      case 'error':
        this.toast.toast({
          title: title,
          description: message,
          variant: 'destructive',
        });
        break;
      case 'critical':
        this.toast.toast({
          title: 'Kesalahan Kritis!',
          description: message,
          variant: 'destructive',
        });
        break;
    }
  }

  // Menambahkan operasi ke queue untuk retry
  public addToRetryQueue(
    errorId: string, 
    operation: () => Promise<any>,
    context: any = {}
  ): void {
    const retryInfo: RetryInfo = {
      operation,
      context,
      retryCount: 0,
      lastError: null
    };
    
    this.errorQueue.set(errorId, retryInfo);
    this.scheduleRetry(errorId);
  }

  // Menjadwalkan retry
  private scheduleRetry(errorId: string): void {
    const retryInfo = this.errorQueue.get(errorId);
    
    if (!retryInfo) {
      console.error(`No retry info found for error ID: ${errorId}`);
      return;
    }
    
    if (retryInfo.retryCount >= this.maxRetries) {
      this.handleMaxRetriesExceeded(errorId, retryInfo);
      return;
    }
    
    const delay = this.retryDelays[retryInfo.retryCount] || this.retryDelays[this.retryDelays.length - 1];
    
    retryInfo.timeoutId = setTimeout(() => {
      this.executeRetry(errorId);
    }, delay);
    
    this.errorQueue.set(errorId, retryInfo);
  }

  // Eksekusi retry
  private async executeRetry(errorId: string): Promise<void> {
    const retryInfo = this.errorQueue.get(errorId);
    
    if (!retryInfo) {
      console.error(`No retry info found for error ID: ${errorId}`);
      return;
    }
    
    try {
      await retryInfo.operation();
      this.handleRetrySuccess(errorId);
    } catch (error) {
      retryInfo.lastError = error;
      retryInfo.retryCount++;
      this.errorQueue.set(errorId, retryInfo);
      
      console.warn(`Retry ${retryInfo.retryCount}/${this.maxRetries} failed for error ${errorId}:`, error);
      
      // Jadwalkan retry berikutnya
      this.scheduleRetry(errorId);
    }
  }

  // Handle ketika retry berhasil
  private handleRetrySuccess(errorId: string): void {
    // Update error log sebagai resolved
    this.markErrorAsResolved(errorId, {
      action: 'auto_retry_success',
      notes: 'Operasi berhasil dieksekusi ulang secara otomatis.'
    });
    
    // Hapus dari queue
    this.removeFromRetryQueue(errorId);
    
    if (this.toast) {
      this.toast.toast({
        title: 'Operasi Berhasil',
        description: 'Operasi yang sebelumnya gagal telah berhasil dieksekusi ulang.',
        variant: 'default',
      });
    }
  }

  // Handle ketika maksimum retry tercapai
  private handleMaxRetriesExceeded(errorId: string, retryInfo: RetryInfo): void {
    // Hapus dari queue
    this.removeFromRetryQueue(errorId);
    
    if (this.toast) {
      this.toast.toast({
        title: 'Operasi Gagal',
        description: 'Sistem tidak dapat menyelesaikan operasi setelah beberapa kali percobaan. Silakan coba lagi nanti.',
        variant: 'destructive',
      });
    }
  }

  // Hapus dari retry queue
  public removeFromRetryQueue(errorId: string): void {
    const retryInfo = this.errorQueue.get(errorId);
    
    if (retryInfo && retryInfo.timeoutId) {
      clearTimeout(retryInfo.timeoutId);
    }
    
    this.errorQueue.delete(errorId);
  }

  // Menandai error sebagai resolved
  public async markErrorAsResolved(
    errorId: string,
    resolution: ErrorResolution
  ): Promise<boolean> {
    try {
      // Dapatkan error dari localStorage
      const errors = this.getErrorsFromLocalStorage();
      const errorIndex = errors.findIndex(e => e.id === errorId);
      
      if (errorIndex === -1) {
        console.warn(`Error dengan ID ${errorId} tidak ditemukan`);
        return false;
      }
      
      // Update status error
      const error = errors[errorIndex];
      error.resolved = true;
      error.resolvedAt = new Date().toISOString();
      error.resolutionNotes = resolution.notes;
      
      // Simpan kembali ke localStorage
      errors[errorIndex] = error;
      localStorage.setItem('pos_error_logs', JSON.stringify(errors));
      
      // Update di server jika tersedia - commented out until API is implemented
      // try {
      //   await POSIntegrationAPI.updateErrorStatus(errorId, { resolved: true, resolution });
      // } catch (e) {
      //   console.warn('Tidak dapat memperbarui status error di server:', e);
      // }
      
      return true;
    } catch (e) {
      console.error('Error dalam menandai error sebagai resolved:', e);
      return false;
    }
  }

  // Mendapatkan semua error logs
  public getErrorLogs(): ErrorLog[] {
    return this.getErrorsFromLocalStorage();
  }

  // Mendapatkan error log berdasarkan ID
  public getErrorLogById(errorId: string): ErrorLog | undefined {
    const errors = this.getErrorsFromLocalStorage();
    return errors.find(e => e.id === errorId);
  }
}

// HOC untuk wrapping API calls dengan error handling
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  module: string,
  operation: string,
  context: any = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorManager = POSErrorManager.getInstance();
      const errorId = await errorManager.logError(
        module,
        operation,
        'error',
        error instanceof Error ? error.message : 'Unknown error',
        { context, args, error },
        error instanceof Error ? error.stack : undefined
      );
      
      throw error;
    }
  };
}

// Error codes untuk operasi POS Integration
export const POS_ERROR_CODES = {
  SYNC_FAILED: 'POS_SYNC_001',
  CONNECTION_FAILED: 'POS_CONN_001',
  AUTHENTICATION_FAILED: 'POS_AUTH_001',
  DATA_FORMAT_ERROR: 'POS_DATA_001',
  INVALID_OPERATION: 'POS_OP_001',
  SERVER_ERROR: 'POS_SRV_001',
  UNKNOWN_ERROR: 'POS_UNK_001'
};
