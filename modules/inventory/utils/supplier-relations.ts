import { Product, mockProducts } from '../types';

// Data relasi supplier dengan produk
export interface SupplierProductRelation {
  supplierId: string;
  productIds: string[];
}

// Data relasi pembelian dengan supplier
export interface SupplierPurchaseHistory {
  supplierId: string;
  purchases: SupplierPurchase[];
}

export interface SupplierPurchase {
  id: string;
  poNumber: string;
  date: Date;
  total: number;
  status: 'pending' | 'complete' | 'canceled';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

// Data relasi pembayaran dengan supplier
export interface SupplierPaymentHistory {
  supplierId: string;
  payments: SupplierPayment[];
}

export interface SupplierPayment {
  id: string;
  invoiceNumber: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
}

// Data evaluasi kinerja supplier
export interface SupplierPerformance {
  supplierId: string;
  avgLeadTime: number; // dalam hari
  fulfillmentRate: number; // persentase
  qualityScore: number; // 0-100
  responseTime: number; // dalam jam
  lastEvaluationDate: Date;
}

// Dummy data untuk relasi produk
export const supplierProductRelations: SupplierProductRelation[] = [
  {
    supplierId: "1", // PT Kimia Farma
    productIds: mockProducts.filter(p => p.id < "6").map(p => p.id) // 5 produk pertama
  },
  {
    supplierId: "2", // PT Dexa Medica
    productIds: mockProducts.filter(p => p.id >= "6" && p.id < "11").map(p => p.id) // 5 produk berikutnya
  },
  {
    supplierId: "3", // PT Kalbe Farma
    productIds: mockProducts.filter(p => p.id >= "11" && p.id < "16").map(p => p.id) // 5 produk berikutnya
  },
  {
    supplierId: "4", // PT Sanbe Farma
    productIds: mockProducts.filter(p => p.id >= "16").map(p => p.id) // Sisa produk
  },
  {
    supplierId: "5", // PT Phapros
    productIds: ["1", "5", "10", "15"] // Beberapa produk campuran
  }
];

// Dummy data untuk riwayat pembelian
export const supplierPurchaseHistories: SupplierPurchaseHistory[] = [
  {
    supplierId: "1",
    purchases: [
      {
        id: "po1",
        poNumber: "PO-2024-001",
        date: new Date("2024-03-15"),
        total: 5250000,
        status: "complete",
        items: [
          {
            productId: "1",
            productName: "Paracetamol 500mg",
            quantity: 100,
            price: 25000,
            subtotal: 2500000
          },
          {
            productId: "2",
            productName: "Amoxicillin 500mg",
            quantity: 50,
            price: 55000,
            subtotal: 2750000
          }
        ]
      },
      {
        id: "po2",
        poNumber: "PO-2024-018",
        date: new Date("2024-04-02"),
        total: 7800000,
        status: "pending",
        items: [
          {
            productId: "3",
            productName: "Cetirizine 10mg",
            quantity: 200,
            price: 18000,
            subtotal: 3600000
          },
          {
            productId: "4",
            productName: "Omeprazole 20mg",
            quantity: 150,
            price: 28000,
            subtotal: 4200000
          }
        ]
      }
    ]
  },
  {
    supplierId: "2",
    purchases: [
      {
        id: "po3",
        poNumber: "PO-2024-005",
        date: new Date("2024-02-20"),
        total: 12500000,
        status: "complete",
        items: [
          {
            productId: "6",
            productName: "Domperidone 10mg",
            quantity: 250,
            price: 22000,
            subtotal: 5500000
          },
          {
            productId: "7",
            productName: "Vitamin C 1000mg",
            quantity: 300,
            price: 23500,
            subtotal: 7050000
          }
        ]
      }
    ]
  },
  {
    supplierId: "3",
    purchases: [
      {
        id: "po4",
        poNumber: "PO-2024-010",
        date: new Date("2024-03-05"),
        total: 9600000,
        status: "complete",
        items: [
          {
            productId: "11",
            productName: "Captopril 25mg",
            quantity: 150,
            price: 32000,
            subtotal: 4800000
          },
          {
            productId: "12",
            productName: "Simvastatin 10mg",
            quantity: 150,
            price: 32000,
            subtotal: 4800000
          }
        ]
      },
      {
        id: "po5",
        poNumber: "PO-2024-020",
        date: new Date("2024-04-01"),
        total: 15600000,
        status: "pending",
        items: [
          {
            productId: "13",
            productName: "Lansoprazole 30mg",
            quantity: 200,
            price: 42000,
            subtotal: 8400000
          },
          {
            productId: "14",
            productName: "Allopurinol 100mg",
            quantity: 180,
            price: 40000,
            subtotal: 7200000
          }
        ]
      }
    ]
  },
  {
    supplierId: "4",
    purchases: []
  },
  {
    supplierId: "5",
    purchases: [
      {
        id: "po6",
        poNumber: "PO-2024-015",
        date: new Date("2024-03-25"),
        total: 6500000,
        status: "complete",
        items: [
          {
            productId: "1",
            productName: "Paracetamol 500mg",
            quantity: 100,
            price: 25000,
            subtotal: 2500000
          },
          {
            productId: "15",
            productName: "Ibuprofen 400mg",
            quantity: 100,
            price: 40000,
            subtotal: 4000000
          }
        ]
      }
    ]
  }
];

// Dummy data untuk riwayat pembayaran
export const supplierPaymentHistories: SupplierPaymentHistory[] = [
  {
    supplierId: "1",
    payments: [
      {
        id: "pay1",
        invoiceNumber: "INV-2024-001",
        date: new Date("2024-03-20"),
        amount: 5250000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      }
    ]
  },
  {
    supplierId: "2",
    payments: [
      {
        id: "pay2",
        invoiceNumber: "INV-2024-005",
        date: new Date("2024-02-25"),
        amount: 12500000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      }
    ]
  },
  {
    supplierId: "3",
    payments: [
      {
        id: "pay3",
        invoiceNumber: "INV-2024-010",
        date: new Date("2024-03-10"),
        amount: 9600000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      },
      {
        id: "pay4",
        invoiceNumber: "INV-2024-020",
        date: new Date("2024-04-10"),
        amount: 15600000,
        status: "pending",
        paymentMethod: "Transfer Bank"
      }
    ]
  },
  {
    supplierId: "4",
    payments: []
  },
  {
    supplierId: "5",
    payments: [
      {
        id: "pay5",
        invoiceNumber: "INV-2024-015",
        date: new Date("2024-03-28"),
        amount: 6500000,
        status: "paid",
        paymentMethod: "Transfer Bank"
      }
    ]
  }
];

// Dummy data untuk evaluasi kinerja supplier
export const supplierPerformances: SupplierPerformance[] = [
  {
    supplierId: "1",
    avgLeadTime: 3.5,
    fulfillmentRate: 95,
    qualityScore: 92,
    responseTime: 5,
    lastEvaluationDate: new Date("2024-03-31")
  },
  {
    supplierId: "2",
    avgLeadTime: 4.2,
    fulfillmentRate: 98,
    qualityScore: 95,
    responseTime: 4,
    lastEvaluationDate: new Date("2024-03-28")
  },
  {
    supplierId: "3",
    avgLeadTime: 3.8,
    fulfillmentRate: 94,
    qualityScore: 90,
    responseTime: 6,
    lastEvaluationDate: new Date("2024-03-25")
  },
  {
    supplierId: "4",
    avgLeadTime: 5.5,
    fulfillmentRate: 88,
    qualityScore: 85,
    responseTime: 8,
    lastEvaluationDate: new Date("2024-03-20")
  },
  {
    supplierId: "5",
    avgLeadTime: 2.8,
    fulfillmentRate: 99,
    qualityScore: 97,
    responseTime: 3,
    lastEvaluationDate: new Date("2024-04-01")
  }
];

// Fungsi untuk mendapatkan produk berdasarkan supplier ID
export const getProductsBySupplier = (supplierId: string): Product[] => {
  const relation = supplierProductRelations.find(r => r.supplierId === supplierId);
  if (!relation) return [];
  
  return mockProducts.filter(product => relation.productIds.includes(product.id));
};

// Fungsi untuk mendapatkan riwayat pembelian berdasarkan supplier ID
export const getPurchaseHistoryBySupplier = (supplierId: string): SupplierPurchase[] => {
  const history = supplierPurchaseHistories.find(h => h.supplierId === supplierId);
  if (!history) return [];
  
  return history.purchases;
};

// Fungsi untuk mendapatkan riwayat pembayaran berdasarkan supplier ID
export const getPaymentHistoryBySupplier = (supplierId: string): SupplierPayment[] => {
  const history = supplierPaymentHistories.find(h => h.supplierId === supplierId);
  if (!history) return [];
  
  return history.payments;
};

// Fungsi untuk mendapatkan kinerja supplier berdasarkan supplier ID
export const getPerformanceBySupplier = (supplierId: string): SupplierPerformance | null => {
  return supplierPerformances.find(p => p.supplierId === supplierId) || null;
};
