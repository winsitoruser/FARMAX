import { Product, Stock, ProductConsumptionStats } from "../types";

// Fungsi untuk menghitung safety stock
export const calculateSafetyStock = (
  leadTimeMax: number,
  leadTimeAvg: number,
  dailyConsumption: number
): number => {
  return Math.ceil((leadTimeMax - leadTimeAvg) * dailyConsumption);
};

// Fungsi untuk menghitung buffer stock
export const calculateBufferStock = (
  riskPercentage: number,
  monthlyConsumption: number
): number => {
  return Math.ceil((riskPercentage / 100) * monthlyConsumption);
};

// Fungsi untuk menghitung reorder point
export const calculateReorderPoint = (
  dailyConsumption: number,
  leadTimeAvg: number,
  safetyStock: number
): number => {
  return Math.ceil((dailyConsumption * leadTimeAvg) + safetyStock);
};

// Fungsi untuk menghitung saran pembelian
export const calculateSuggestedOrder = (
  reorderPoint: number,
  bufferStock: number,
  currentStock: number
): number => {
  return Math.max(0, Math.ceil(reorderPoint + bufferStock - currentStock));
};

// Fungsi untuk menghitung semua nilai sekaligus
export const calculateAllStockMetrics = (
  product: Product, 
  stock: Stock,
  consumptionStats?: ProductConsumptionStats,
  options?: {
    leadTimeAvg?: number;
    leadTimeMax?: number;
    riskPercentage?: number;
  }
) => {
  // Default values
  const leadTimeAvg = options?.leadTimeAvg || 3; // Default 3 hari
  const leadTimeMax = options?.leadTimeMax || 5; // Default 5 hari
  const riskPercentage = options?.riskPercentage || 20; // Default 20%
  
  const dailyConsumption = consumptionStats?.dailyAverage || 5;
  const monthlyConsumption = consumptionStats?.monthlyAverage || dailyConsumption * 30;
  
  const safetyStock = calculateSafetyStock(leadTimeMax, leadTimeAvg, dailyConsumption);
  const bufferStock = calculateBufferStock(riskPercentage, monthlyConsumption);
  const reorderPoint = calculateReorderPoint(dailyConsumption, leadTimeAvg, safetyStock);
  const suggestedOrder = calculateSuggestedOrder(reorderPoint, bufferStock, stock.currentStock);

  return {
    safetyStock,
    bufferStock,
    reorderPoint,
    suggestedOrder,
    currentStock: stock.currentStock,
    status: getStockStatus(stock.currentStock, safetyStock, reorderPoint)
  };
};

// Fungsi untuk menentukan status stok
export const getStockStatus = (
  currentStock: number,
  safetyStock: number,
  reorderPoint: number
) => {
  if (currentStock <= safetyStock) {
    return { 
      status: 'danger', 
      label: 'Kritis',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    };
  } else if (currentStock <= reorderPoint) {
    return { 
      status: 'warning', 
      label: 'Perlu Reorder',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    };
  } else {
    return { 
      status: 'success', 
      label: 'Aman',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    };
  }
};
