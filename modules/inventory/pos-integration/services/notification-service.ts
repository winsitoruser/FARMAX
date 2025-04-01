import { POSIntegrationAPI } from './api-service';
import { Subject, Observable } from 'rxjs';

// Tipe notifikasi
export enum NotificationType {
  SYNC_ERROR = 'sync_error',
  SYNC_WARNING = 'sync_warning',
  SYNC_SUCCESS = 'sync_success',
  STOCK_ALERT = 'stock_alert',
  DATA_INCONSISTENCY = 'data_inconsistency',
  CONNECTION_ISSUE = 'connection_issue',
  SYSTEM = 'system'
}

// Tingkat severity notifikasi
export enum NotificationSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Interface untuk notifikasi
export interface Notification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: any;
  actionUrl?: string;
  actionLabel?: string;
}

// Interface untuk konfigurasi notifikasi
export interface NotificationSettings {
  enableEmail: boolean;
  enablePush: boolean;
  enableInApp: boolean;
  severityThreshold: NotificationSeverity;
  types: NotificationType[];
}

// Kelas service untuk manajemen notifikasi
export class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private notificationSubject = new Subject<Notification>();
  private settings: NotificationSettings = {
    enableEmail: true,
    enablePush: true,
    enableInApp: true,
    severityThreshold: NotificationSeverity.WARNING,
    types: Object.values(NotificationType)
  };
  private pollingInterval: NodeJS.Timeout | null = null;
  private lastFetchTime: string | null = null;

  private constructor() {
    // Memulai polling notifikasi
    this.startPolling();
    
    // Mengambil pengaturan dari localStorage atau default
    this.loadSettings();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Memulai polling untuk notifikasi baru dari server
  private startPolling(intervalMs: number = 30000): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(async () => {
      await this.fetchNewNotifications();
    }, intervalMs);
  }

  // Menghentikan polling
  public stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Mengambil notifikasi baru dari server
  private async fetchNewNotifications(): Promise<void> {
    try {
      const params: any = {
        limit: 20,
        read: false
      };

      if (this.lastFetchTime) {
        params.since = this.lastFetchTime;
      }

      const response = await POSIntegrationAPI.getNotifications(params);
      const newNotifications = response.data.notifications;

      if (newNotifications.length > 0) {
        // Update waktu fetch terakhir
        this.lastFetchTime = new Date().toISOString();
        
        // Tambahkan notifikasi baru ke daftar
        this.notifications = [...newNotifications, ...this.notifications];
        
        // Batasi jumlah notifikasi yang disimpan di memori
        if (this.notifications.length > 100) {
          this.notifications = this.notifications.slice(0, 100);
        }
        
        // Emit notifikasi baru
        newNotifications.forEach(notification => {
          this.notificationSubject.next(notification);
        });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  // Mendapatkan semua notifikasi
  public async getNotifications(params: {
    page?: number,
    limit?: number,
    read?: boolean,
    type?: NotificationType
  } = {}): Promise<{ notifications: Notification[], total: number }> {
    try {
      const response = await POSIntegrationAPI.getNotifications(params);
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return { notifications: [], total: 0 };
    }
  }

  // Mendapatkan notifikasi secara reaktif
  public getNotificationsStream(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }

  // Menandai notifikasi sebagai telah dibaca
  public async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await POSIntegrationAPI.markNotificationAsRead(notificationId);
      
      // Update notifikasi lokal
      this.notifications = this.notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  // Menandai semua notifikasi sebagai telah dibaca
  public async markAllAsRead(): Promise<boolean> {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integration/pos/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      // Update notifikasi lokal
      this.notifications = this.notifications.map(notification => {
        return { ...notification, read: true };
      });
      
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }

  // Mendapatkan pengaturan notifikasi
  public async getSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integration/pos/notifications/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get notification settings');
      }
      
      const settings = await response.json();
      this.settings = settings;
      this.saveSettings();
      
      return settings;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return this.settings;
    }
  }

  // Menyimpan pengaturan notifikasi
  public async updateSettings(settings: NotificationSettings): Promise<boolean> {
    try {
      await POSIntegrationAPI.updateNotificationSettings(settings);
      
      // Update pengaturan lokal
      this.settings = settings;
      this.saveSettings();
      
      return true;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      return false;
    }
  }

  // Menyimpan pengaturan ke localStorage
  private saveSettings(): void {
    try {
      localStorage.setItem('pos_notification_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save notification settings to localStorage:', error);
    }
  }

  // Memuat pengaturan dari localStorage
  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('pos_notification_settings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load notification settings from localStorage:', error);
    }
  }

  // Membuat notifikasi baru
  public async createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<string | null> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integration/pos/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(notification)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create notification');
      }
      
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }

  // Helper untuk membuat notifikasi sync error
  public async notifySyncError(message: string, metadata: any = {}, severity: NotificationSeverity = NotificationSeverity.ERROR): Promise<string | null> {
    return this.createNotification({
      type: NotificationType.SYNC_ERROR,
      severity,
      title: 'Error Sinkronisasi',
      message,
      metadata
    });
  }

  // Helper untuk membuat notifikasi sync berhasil
  public async notifySyncSuccess(message: string, metadata: any = {}): Promise<string | null> {
    return this.createNotification({
      type: NotificationType.SYNC_SUCCESS,
      severity: NotificationSeverity.INFO,
      title: 'Sinkronisasi Berhasil',
      message,
      metadata
    });
  }

  // Helper untuk membuat notifikasi data inconsistency
  public async notifyDataInconsistency(message: string, metadata: any = {}): Promise<string | null> {
    return this.createNotification({
      type: NotificationType.DATA_INCONSISTENCY,
      severity: NotificationSeverity.WARNING,
      title: 'Inkonsistensi Data',
      message,
      metadata
    });
  }

  // Helper untuk membuat notifikasi stock alert
  public async notifyStockAlert(message: string, metadata: any = {}): Promise<string | null> {
    return this.createNotification({
      type: NotificationType.STOCK_ALERT,
      severity: NotificationSeverity.WARNING,
      title: 'Peringatan Stok',
      message,
      metadata
    });
  }

  // Mendapatkan jumlah notifikasi yang belum dibaca
  public async getUnreadCount(): Promise<number> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/integration/pos/notifications/unread-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get unread notification count');
      }
      
      const result = await response.json();
      return result.count;
    } catch (error) {
      console.error('Failed to get unread notification count:', error);
      return 0;
    }
  }
}

// Singleton instance
export const notificationService = NotificationService.getInstance();
