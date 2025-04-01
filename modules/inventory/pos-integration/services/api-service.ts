import axios from 'axios';

// Konfigurasi dasar untuk axios
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.farmax.co.id/v1';

// Buat instance axios dengan konfigurasi default
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 detik timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor untuk menambahkan token otentikasi
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handling response dan error
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tangani error berdasarkan kode HTTP
    if (error.response) {
      // Error server dengan response
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - token expired atau invalid
        // Redirect ke login atau refresh token
        localStorage.removeItem('auth_token');
        window.location.href = '/login?session=expired';
      } else if (status === 403) {
        // Forbidden - tidak punya akses
        console.error('Access forbidden', error.response.data);
      } else if (status === 500) {
        // Server error
        console.error('Server error', error.response.data);
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response (network issues)
      console.error('Network error, no response received', error.request);
    } else {
      // Error saat setup request
      console.error('Error setting up request', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API untuk POS Integration
export const POSIntegrationAPI = {
  // Sinkronisasi
  syncData: async (params: { type: 'full' | 'incremental' | 'specific', modules?: string[] }) => {
    return apiClient.post('/integration/pos/sync', params);
  },
  
  getSyncStatus: async () => {
    return apiClient.get('/integration/pos/sync/status');
  },
  
  getSyncLogs: async (params: { 
    page?: number, 
    limit?: number, 
    startDate?: string, 
    endDate?: string,
    type?: string,
    status?: string
  }) => {
    return apiClient.get('/integration/pos/sync/logs', { params });
  },
  
  getSyncSettings: async () => {
    return apiClient.get('/integration/pos/sync/settings');
  },
  
  updateSyncSettings: async (settings: {
    autoSync: boolean,
    syncInterval: number,
    syncOnSale: boolean,
    syncOnInventoryChange: boolean,
    syncOnStartup: boolean
  }) => {
    return apiClient.put('/integration/pos/sync/settings', settings);
  },
  
  // Transaksi POS
  getTransactions: async (params: {
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string,
    branchId?: string,
    searchQuery?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) => {
    return apiClient.get('/integration/pos/transactions', { params });
  },
  
  getTransactionDetail: async (transactionId: string) => {
    return apiClient.get(`/integration/pos/transactions/${transactionId}`);
  },
  
  // Pergerakan Stok
  getStockMovements: async (params: {
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string,
    branchId?: string,
    productId?: string,
    category?: string,
    movementType?: 'in' | 'out' | 'all',
    source?: string,
    searchQuery?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  }) => {
    return apiClient.get('/integration/pos/stock-movements', { params });
  },
  
  getStockMovementSummary: async (params: {
    startDate?: string,
    endDate?: string,
    branchId?: string,
    groupBy?: 'category' | 'product' | 'branch'
  }) => {
    return apiClient.get('/integration/pos/stock-movements/summary', { params });
  },
  
  // Dashboard dan Analytics
  getDashboardMetrics: async (params: {
    startDate?: string,
    endDate?: string,
    branchId?: string
  }) => {
    return apiClient.get('/integration/pos/dashboard', { params });
  },
  
  getAnalytics: async (params: {
    type: 'sales-trends' | 'inventory-impact' | 'top-products' | 'branch-performance',
    startDate?: string,
    endDate?: string,
    branchId?: string,
    interval?: 'daily' | 'weekly' | 'monthly',
    limit?: number
  }) => {
    return apiClient.get('/integration/pos/analytics', { params });
  },
  
  // Error Log
  getErrorLogs: async (params: {
    page?: number,
    limit?: number,
    startDate?: string,
    endDate?: string,
    severity?: 'warning' | 'error' | 'critical',
    module?: string,
    resolved?: boolean
  }) => {
    return apiClient.get('/integration/pos/errors', { params });
  },
  
  resolveError: async (errorId: string, resolution: { 
    action: string, 
    notes: string 
  }) => {
    return apiClient.post(`/integration/pos/errors/${errorId}/resolve`, resolution);
  },
  
  // Notifikasi
  getNotifications: async (params: {
    page?: number,
    limit?: number,
    read?: boolean,
    type?: string
  }) => {
    return apiClient.get('/integration/pos/notifications', { params });
  },
  
  markNotificationAsRead: async (notificationId: string) => {
    return apiClient.put(`/integration/pos/notifications/${notificationId}/read`);
  },
  
  updateNotificationSettings: async (settings: {
    enableEmail: boolean,
    enablePush: boolean,
    enableInApp: boolean,
    severityThreshold: 'info' | 'warning' | 'error' | 'critical',
    types: string[]
  }) => {
    return apiClient.put('/integration/pos/notifications/settings', settings);
  }
};

export default apiClient;
