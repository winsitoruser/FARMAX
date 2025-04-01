import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.farmanesia.co.id';

// Interface untuk Product
export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  manufacturer?: string;
  supplier?: string;
  buyPrice: number;
  sellPrice: number;
  unit: string;
  packaging?: string;
  stockQty: number;
  minStockQty: number;
  expiryDate?: Date;
  imagePath?: string;
  barcode?: string;
  isActive: boolean;
  location?: string;
  batchNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface untuk Stock Movement
export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  type: 'in' | 'out' | 'adjustment' | 'opname';
  quantity: number;
  remainingQty: number;
  documentNumber?: string;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
  batchNumber?: string;
  expiryDate?: Date;
  createdBy: string;
  createdAt: Date;
}

// Interface untuk Stock Opname
export interface StockOpname {
  id: string;
  documentNumber: string;
  date: Date;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  items: StockOpnameItem[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockOpnameItem {
  id: string;
  stockOpnameId: string;
  productId: string;
  product?: Product;
  systemQty: number;
  actualQty: number;
  difference: number;
  notes?: string;
}

// Interface untuk Stats
export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  nearExpiryCount: number;
  recentMovements: StockMovement[];
}

// API service singleton
class InventoryAPIService {
  // Product CRUD
  async getProducts(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
    lowStock?: boolean;
    nearExpiry?: boolean;
  }): Promise<{ data: Product[]; total: number; page: number; totalPages: number }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/products`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await axios.post(`${API_BASE_URL}/inventory/products`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const response = await axios.put(`${API_BASE_URL}/inventory/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/inventory/products/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  // Stock Movement
  async getStockMovements(params?: {
    page?: number;
    limit?: number;
    productId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: StockMovement[]; total: number; page: number; totalPages: number }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/stock-movements`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      throw error;
    }
  }

  async addStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): Promise<StockMovement> {
    try {
      const response = await axios.post(`${API_BASE_URL}/inventory/stock-movements`, movement);
      return response.data;
    } catch (error) {
      console.error('Error adding stock movement:', error);
      throw error;
    }
  }

  // Stock Opname
  async getStockOpnames(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: StockOpname[]; total: number; page: number; totalPages: number }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/stock-opnames`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching stock opnames:', error);
      throw error;
    }
  }

  async getStockOpnameById(id: string): Promise<StockOpname> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/stock-opnames/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stock opname ${id}:`, error);
      throw error;
    }
  }

  async createStockOpname(stockOpname: Omit<StockOpname, 'id' | 'createdAt' | 'updatedAt'>): Promise<StockOpname> {
    try {
      const response = await axios.post(`${API_BASE_URL}/inventory/stock-opnames`, stockOpname);
      return response.data;
    } catch (error) {
      console.error('Error creating stock opname:', error);
      throw error;
    }
  }

  async updateStockOpname(id: string, stockOpname: Partial<StockOpname>): Promise<StockOpname> {
    try {
      const response = await axios.put(`${API_BASE_URL}/inventory/stock-opnames/${id}`, stockOpname);
      return response.data;
    } catch (error) {
      console.error(`Error updating stock opname ${id}:`, error);
      throw error;
    }
  }

  // Stats and Dashboard
  async getInventoryStats(): Promise<InventoryStats> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw error;
    }
  }

  // Categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Suppliers
  async getSuppliers(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/suppliers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  // Generate barcode
  async generateBarcode(productId: string): Promise<{ barcode: string; imagePath: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/inventory/barcode/generate`, { productId });
      return response.data;
    } catch (error) {
      console.error('Error generating barcode:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const inventoryAPI = new InventoryAPIService();
