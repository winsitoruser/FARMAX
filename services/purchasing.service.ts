/**
 * Purchasing Service
 * Handles all API requests related to purchase orders and supplier management
 * Integrates with inventory, finance, and supplier modules
 */

import apiService from './api';
import { format } from 'date-fns';

// Types
export interface Supplier {
  id: string;
  name: string;
  address: string;
  contact: string;
  email?: string;
  terms: string;
  paymentMethod?: string;
  taxId?: string;
  notes?: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  uom: string;
  stock: number;
  reorderLevel: number;
  supplierPrice?: number;
  supplier?: string;
}

export interface PriceHistory {
  id: string;
  productId: string;
  supplierId: string;
  price: number;
  date: string;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  receivedQuantity?: number;
  status?: 'pending' | 'received' | 'partial' | 'rejected';
}

export interface PurchaseOrder {
  id?: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName?: string;
  expectedDelivery: string;
  totalItems: number;
  totalValue: number;
  status: 'draft' | 'awaiting_approval' | 'approved' | 'shipped' | 'partial_delivery' | 'completed' | 'rejected' | 'returned';
  paymentStatus?: 'unpaid' | 'partial' | 'paid' | 'refunded';
  notes?: string;
  items: OrderItem[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierPerformance {
  supplierId: string;
  onTimeDelivery: number;
  orderFulfillment: number;
  qualityRating: number;
  returnRate: number;
  avgResponseTime: number;
}

// Service methods
const purchasingService = {
  // Supplier methods
  getSuppliers: () => {
    return apiService.get<Supplier[]>('/suppliers');
  },

  getSupplier: (id: string) => {
    return apiService.get<Supplier>(`/suppliers/${id}`);
  },

  createSupplier: (supplier: Omit<Supplier, 'id'>) => {
    return apiService.post<Supplier>('/suppliers', supplier);
  },

  updateSupplier: (id: string, supplier: Partial<Supplier>) => {
    return apiService.put<Supplier>(`/suppliers/${id}`, supplier);
  },

  deleteSupplier: (id: string) => {
    return apiService.delete<void>(`/suppliers/${id}`);
  },

  // Purchase Order methods
  getPurchaseOrders: (filters?: {
    status?: string,
    supplierId?: string,
    startDate?: Date,
    endDate?: Date
  }) => {
    return apiService.get<PurchaseOrder[]>('/purchase-orders', filters);
  },

  getPurchaseOrder: (id: string) => {
    return apiService.get<PurchaseOrder>(`/purchase-orders/${id}`);
  },

  createPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => {
    return apiService.post<PurchaseOrder>('/purchase-orders', order);
  },

  updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => {
    return apiService.put<PurchaseOrder>(`/purchase-orders/${id}`, order);
  },

  deletePurchaseOrder: (id: string) => {
    return apiService.delete<void>(`/purchase-orders/${id}`);
  },

  // Purchase Order Status methods
  approvePurchaseOrder: (id: string) => {
    return apiService.patch<PurchaseOrder>(`/purchase-orders/${id}/approve`, {
      status: 'approved',
      updatedBy: 'current-user', // Would be replaced with actual user ID
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    });
  },

  rejectPurchaseOrder: (id: string, reason: string) => {
    return apiService.patch<PurchaseOrder>(`/purchase-orders/${id}/reject`, {
      status: 'rejected',
      notes: reason,
      updatedBy: 'current-user', // Would be replaced with actual user ID
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    });
  },

  receivePurchaseOrder: (id: string, receivedItems: {
    itemId: string,
    receivedQuantity: number,
    status: 'received' | 'partial' | 'rejected'
  }[]) => {
    return apiService.patch<PurchaseOrder>(`/purchase-orders/${id}/receive`, {
      receivedItems,
      updatedBy: 'current-user', // Would be replaced with actual user ID
      updatedAt: format(new Date(), 'yyyy-MM-dd')
    });
  },

  // Integration with Inventory module
  getProductsForPurchase: () => {
    return apiService.get<Product[]>('/inventory/products/for-purchase');
  },

  getProductPriceHistory: (productId: string, supplierId?: string) => {
    return apiService.get<PriceHistory[]>(`/products/${productId}/price-history`, { supplierId });
  },

  updateProductStock: (productId: string, quantity: number) => {
    return apiService.patch<Product>(`/inventory/products/${productId}/stock`, { quantity });
  },

  // Integration with Finance module
  createPurchaseInvoice: (purchaseOrderId: string) => {
    return apiService.post<{invoiceId: string, invoiceNumber: string}>(`/finance/invoices/purchase-order/${purchaseOrderId}`);
  },

  recordPurchasePayment: (invoiceId: string, amount: number, paymentMethod: string, date: string) => {
    return apiService.post<{success: boolean}>(`/finance/invoices/${invoiceId}/payment`, {
      amount,
      paymentMethod,
      date
    });
  },

  // Supplier Analysis methods
  getSupplierPerformance: (supplierId: string) => {
    return apiService.get<SupplierPerformance>(`/suppliers/${supplierId}/performance`);
  },

  compareProductPrices: (productId: string) => {
    return apiService.get<{
      supplierId: string,
      supplierName: string, 
      price: number, 
      lastUpdated: string
    }[]>(`/products/${productId}/price-comparison`);
  },

  // Mock data generators for development (would be removed in production)
  _getMockPendingOrders: () => {
    // This would be removed in production, only for development
    return [
      {
        id: "po001",
        poNumber: "PO-20250330-001",
        date: "2025-03-30",
        supplier: {
          id: "sup001",
          name: "PT Kimia Farma"
        },
        expectedDelivery: "2025-04-10",
        totalItems: 5,
        totalValue: 12500000,
        status: "awaiting_approval",
        items: [
          { id: "item001", product: "Paracetamol 500mg", quantity: 1000, unitPrice: 1200, subtotal: 1200000 },
          { id: "item002", product: "Amoxicillin 500mg", quantity: 500, unitPrice: 2500, subtotal: 1250000 },
        ]
      },
      // More mock data...
    ];
  },

  _getMockSuppliers: () => {
    // This would be removed in production, only for development
    return [
      { id: "sup001", name: "PT Kimia Farma", address: "Jakarta", contact: "021-5555-1234", terms: "Net 30" },
      { id: "sup002", name: "PT Phapros", address: "Semarang", contact: "024-7777-5678", terms: "Net 14" },
      // More mock data...
    ];
  },
};

export default purchasingService;
