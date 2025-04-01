// Enhanced type definitions for multi-branch inventory management

import { User } from '../auth/types';

// Core Entities
export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string;
  pic: string; // Person in charge
  isMainWarehouse: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  genericName?: string;
  sku: string;
  barcode?: string;
  categoryId: string;
  formId: string; // tablet, capsule, syrup, etc.
  unit: string;
  packagingId: string;
  brand: string;
  manufacturer?: string;
  purchasePrice: number;
  sellingPrice: number;
  markupPercentage: number;
  priceGroupId?: string;
  dosagedId?: string;
  minStock: number;
  maxStock?: number;
  reorderPoint: number;
  isPrescription: boolean;
  isMedicineList?: boolean; // DOEN/FORNAS
  imageUrl?: string;
  description?: string;
  sideEffects?: string;
  dosageInstructions?: string;
  contraindications?: string;
  storageRequirements?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stock {
  id: string;
  productId: string;
  branchId: string;
  batchNumber: string;
  initialStock: number;
  currentStock: number;
  expiryDate: Date;
  manufacturingDate?: Date;
  purchaseDate: Date;
  purchasePrice: number;
  sellingPrice: number;
  supplierId: string;
  storageLocation?: string;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  parentId?: string; // For hierarchical categories
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  address: string;
  phone: string;
  email?: string;
  taxId?: string;
  paymentTerms?: string;
  leadTime?: number; // in days
  minOrderAmount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductForm {
  id: string;
  name: string; // tablet, capsule, syrup, etc.
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPackaging {
  id: string;
  name: string; // box, bottle, strip, etc.
  unitsPerPackage: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dosage {
  id: string;
  name: string; // e.g., 500mg, 250ml
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceGroup {
  id: string;
  name: string;
  discountPercentage: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Transactions & Operations
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  branchId: string;
  orderDate: Date;
  expectedDeliveryDate: Date;
  totalAmount: number;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'completed' | 'cancelled';
  approvedBy?: string;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentDueDate?: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  poId: string;
  productId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  status: 'pending' | 'partial' | 'complete';
  notes?: string;
}

export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  poId?: string; // Optional, can receive without PO
  branchId: string;
  supplierId: string;
  receiveDate: Date;
  invoiceNumber?: string;
  invoiceDate?: Date;
  totalAmount: number;
  receivedBy: string;
  status: 'draft' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: GoodsReceiptItem[];
}

export interface GoodsReceiptItem {
  id: string;
  receiptId: string;
  productId: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  expiryDate: Date;
  manufacturingDate?: Date;
  storageLocation?: string;
  notes?: string;
  qualityChecked: boolean;
  qualityCheckNotes?: string;
  poItemId?: string;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromBranchId: string;
  toBranchId: string;
  requestDate: Date;
  approvalDate?: Date;
  approvedBy?: string;
  shipmentDate?: Date;
  receivedDate?: Date;
  receivedBy?: string;
  status: 'requested' | 'approved' | 'shipped' | 'received' | 'cancelled' | 'rejected';
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  items: StockTransferItem[];
}

export interface StockTransferItem {
  id: string;
  transferId: string;
  productId: string;
  stockId: string; // Specific batch/stock
  requestedQuantity: number;
  approvedQuantity?: number;
  sentQuantity?: number;
  receivedQuantity?: number;
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  branchId: string;
  adjustmentDate: Date;
  reason: 'damage' | 'expiry' | 'theft' | 'loss' | 'count' | 'other';
  description?: string;
  totalValue: number;
  status: 'draft' | 'approved' | 'completed' | 'cancelled';
  approvedBy?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  items: StockAdjustmentItem[];
}

export interface StockAdjustmentItem {
  id: string;
  adjustmentId: string;
  productId: string;
  stockId: string; // Specific batch/stock
  currentQuantity: number;
  newQuantity: number;
  adjustmentQuantity: number; // Can be positive or negative
  unitPrice: number;
  totalValue: number;
  reason?: string;
  notes?: string;
}

export interface StockOpname {
  id: string;
  opnameNumber: string;
  branchId: string;
  opnameDate: Date;
  scheduledDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  totalItems: number;
  completedItems: number;
  totalDiscrepancy: number;
  totalDiscrepancyValue: number;
  conductedBy: string;
  verifiedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: StockOpnameItem[];
}

export interface StockOpnameItem {
  id: string;
  opnameId: string;
  productId: string;
  stockId: string; // Specific batch/stock
  systemQuantity: number;
  actualQuantity: number;
  discrepancy: number;
  unitPrice: number;
  totalValue: number;
  notes?: string;
  countedBy: string;
  countedAt: Date;
}

export interface StockMovement {
  id: string;
  movementNumber: string;
  productId: string;
  stockId: string;
  branchId: string;
  date: Date;
  type: 'purchase' | 'sale' | 'transfer_in' | 'transfer_out' | 'adjustment' | 'expired' | 'damaged' | 'return';
  quantity: number; // Positive for in, negative for out
  remainingStock: number;
  referenceId: string; // ID of PO, sale, transfer, etc.
  referenceType: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface DrugDestruction {
  id: string;
  destructionNumber: string;
  branchId: string;
  destructionDate: Date;
  method: 'incineration' | 'chemical' | 'other';
  status: 'planned' | 'approved' | 'completed' | 'cancelled';
  approvedBy?: string;
  witnessName?: string;
  witnessTitle?: string;
  totalItems: number;
  documentUrl?: string; // BPOM form/documentation
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  items: DrugDestructionItem[];
}

export interface DrugDestructionItem {
  id: string;
  destructionId: string;
  productId: string;
  stockId: string;
  quantity: number;
  reason: 'expired' | 'damaged' | 'recalled' | 'other';
  batchNumber: string;
  expiryDate?: Date;
  notes?: string;
  imageUrl?: string; // Photo evidence
}

// Report Types
export interface InventoryValuation {
  branchId: string;
  asOfDate: Date;
  totalValue: number;
  items: Array<{
    productId: string;
    productName: string;
    category: string;
    totalStock: number;
    averageCost: number;
    totalValue: number;
  }>;
}

export interface StockAgingReport {
  branchId: string;
  asOfDate: Date;
  items: Array<{
    productId: string;
    productName: string;
    batchNumber: string;
    expiryDate: Date;
    daysToExpiry: number;
    currentStock: number;
    value: number;
    ageCategory: '0-30' | '31-60' | '61-90' | '91-180' | '181-365' | '365+';
  }>;
}

export interface StockAlert {
  id: string;
  productId: string;
  branchId: string;
  type: 'low_stock' | 'expiring_soon' | 'expired' | 'overstock';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  threshold?: number;
  currentValue: number;
  createdAt: Date;
  isRead: boolean;
  readBy?: string;
  readAt?: Date;
}

// Integration Types
export interface POSTransaction {
  id: string;
  transactionId: string; // From POS module
  branchId: string;
  date: Date;
  items: Array<{
    productId: string;
    stockId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
}

export interface VoucherProductAssociation {
  voucherId: string;
  productId: string;
  discountAmount?: number;
  discountPercentage?: number;
  maxDiscount?: number;
  isActive: boolean;
}
