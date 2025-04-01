import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Products } from "@/types/products";
import { SimplifiedProduct } from "@/types/simplified-products";
import useSWR, { mutate } from "swr";
import { ApiResponse, handleApiResponse } from '@/lib/api-utils';
import { toastAlert } from '@/components/common/alerts';
import { mockProducts } from "@/lib/mock-data";

interface TotalPageProps {
  status: number,
  totalPages: number
}

// Define product type with stock thresholds
interface ProductWithStock extends SimplifiedProduct {
  stock: number;
  minStock: number;
  buyPrice: number;
}

// Mock products data with stock information
const mockProductsWithStock: ProductWithStock[] = [
  { id: "P001", name: "Paracetamol 500mg", price: 20000, stock: 120, minStock: 50, buyPrice: 15000, category: "Obat Resep", image: "/images/products/medicine-1.jpg", description: "Obat pereda nyeri dan penurun demam" },
  { id: "P002", name: "Amoxicillin 500mg", price: 35000, stock: 85, minStock: 40, buyPrice: 25000, category: "Obat Resep", image: "/images/products/medicine-2.jpg", description: "Antibiotik untuk infeksi bakteri" },
  { id: "P003", name: "Vitamin C 1000mg", price: 45000, stock: 35, minStock: 40, buyPrice: 35000, category: "OTC", image: "/images/products/vitamin-1.jpg", description: "Suplemen daya tahan tubuh" },
  { id: "P004", name: "Omeprazole 20mg", price: 25000, stock: 42, minStock: 30, buyPrice: 18000, category: "Obat Resep", image: "/images/products/medicine-3.jpg", description: "Obat untuk tukak lambung" },
  { id: "P005", name: "Simvastatin 10mg", price: 30000, stock: 56, minStock: 30, buyPrice: 22000, category: "Obat Resep", image: "/images/products/medicine-4.jpg", description: "Obat penurun kolesterol" },
  { id: "P006", name: "Metformin 500mg", price: 22000, stock: 28, minStock: 35, buyPrice: 17000, category: "Obat Resep", image: "/images/products/medicine-5.jpg", description: "Obat diabetes" },
  { id: "P007", name: "Betadine Solution", price: 18000, stock: 46, minStock: 25, buyPrice: 12000, category: "OTC", image: "/images/products/antiseptic-1.jpg", description: "Antiseptik untuk luka" },
  { id: "P008", name: "Tensimeter Digital", price: 450000, stock: 18, minStock: 10, buyPrice: 350000, category: "Alat Kesehatan", image: "/images/products/device-1.jpg", description: "Alat pengukur tekanan darah" },
  { id: "P009", name: "Masker N95", price: 25000, stock: 150, minStock: 100, buyPrice: 15000, category: "Alat Kesehatan", image: "/images/products/mask-1.jpg", description: "Masker pelindung" },
  { id: "P010", name: "Susu Pediasure", price: 250000, stock: 32, minStock: 20, buyPrice: 180000, category: "Susu & Nutrisi", image: "/images/products/milk-1.jpg", description: "Susu pertumbuhan anak" },
  { id: "P011", name: "Susu Ensure", price: 275000, stock: 25, minStock: 15, buyPrice: 200000, category: "Susu & Nutrisi", image: "/images/products/milk-2.jpg", description: "Susu nutrisi dewasa" },
  { id: "P012", name: "Body Lotion", price: 65000, stock: 40, minStock: 25, buyPrice: 45000, category: "Perawatan Pribadi", image: "/images/products/skincare-1.jpg", description: "Pelembab kulit" },
  { id: "P013", name: "Hand Sanitizer", price: 35000, stock: 65, minStock: 40, buyPrice: 25000, category: "Perawatan Pribadi", image: "/images/products/sanitizer-1.jpg", description: "Pembersih tangan" },
  { id: "P014", name: "Clobazam 10mg", price: 35000, stock: 22, minStock: 30, buyPrice: 28000, category: "Obat Resep", image: "/images/products/medicine-6.jpg", description: "Obat anti kejang/epilepsi" },
  { id: "P015", name: "Fluoxetine 20mg", price: 40000, stock: 18, minStock: 25, buyPrice: 32000, category: "Obat Resep", image: "/images/products/medicine-7.jpg", description: "Obat anti depresi" },
  { id: "P016", name: "Glucose Test Strips", price: 200000, stock: 8, minStock: 15, buyPrice: 150000, category: "Alat Kesehatan", image: "/images/products/device-2.jpg", description: "Alat tes gula darah" },
  { id: "P017", name: "Thermometer Digital", price: 120000, stock: 12, minStock: 20, buyPrice: 85000, category: "Alat Kesehatan", image: "/images/products/device-3.jpg", description: "Pengukur suhu tubuh" },
  { id: "P018", name: "Vitamin D3", price: 95000, stock: 15, minStock: 25, buyPrice: 75000, category: "OTC", image: "/images/products/vitamin-2.jpg", description: "Suplemen vitamin D" },
  { id: "P019", name: "Zinc Supplement", price: 85000, stock: 22, minStock: 30, buyPrice: 65000, category: "OTC", image: "/images/products/vitamin-3.jpg", description: "Suplemen zinc" },
  { id: "P020", name: "Calcium Supplement", price: 90000, stock: 28, minStock: 30, buyPrice: 70000, category: "OTC", image: "/images/products/vitamin-4.jpg", description: "Suplemen kalsium" }
];

const useProduct = () => {
  // Using mock data instead of API calls
  const mockTotalPages = { status: 200, totalPages: 1 };
  
  // Simulate loading state for 1 second
  const { data, error, isLoading } = useSWR<ProductWithStock[]>(
    'mock-products-with-stock',
    () => new Promise<ProductWithStock[]>((resolve) => {
      setTimeout(() => resolve(mockProductsWithStock), 1000);
    })
  );

  // Filter products with stock below minimum threshold
  const lowStockProducts = data ? data.filter(product => product.stock < product.minStock) : [];
  
  const getProductByCurrentPage = async (currentPage: number): Promise<ApiResponse<SimplifiedProduct[]>> => {
    try {
      // Return mock data instead of making an API call
      return {
        status: 200,
        data: mockProductsWithStock,
        message: "Success",
        error: null,
        success: true
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        status: 500,
        data: [],
        message: "Error fetching products",
        error: "Failed to fetch products",
        success: false
      };
    }
  };

  const createProduct = async (data: any, id: string): Promise<ApiResponse<any>> => {
    try {
      // Simulate successful product creation
      toastAlert('Product Berhasil Ditambahkan', 'success');
      return { 
        data: { ...data, id }, 
        error: null, 
        success: true,
        status: 200,
        message: "Product created successfully"
      };
    } catch (error) {
      console.error('Error creating product:', error);
      toastAlert('Product Gagal Ditambahkan', 'error');
      return { 
        data: null, 
        error: "Failed to create product", 
        success: false,
        status: 500,
        message: "Error creating product"
      };
    }
  };

  const updateProduct = async (data: any, id: string): Promise<ApiResponse<any>> => {
    try {
      // Simulate successful product update
      toastAlert('Product Berhasil Diperbarui', 'success');
      return { 
        data: { ...data, id }, 
        error: null, 
        success: true,
        status: 200,
        message: "Product updated successfully"
      };
    } catch (error) {
      console.error('Error updating product:', error);
      toastAlert('Product Gagal Diperbarui', 'error');
      return { 
        data: null, 
        error: "Failed to update product", 
        success: false,
        status: 500,
        message: "Error updating product"
      };
    }
  };

  const deleteProduct = async (id: string): Promise<ApiResponse<any>> => {
    try {
      // Simulate successful product deletion
      toastAlert('Product Berhasil Dihapus', 'success');
      return { 
        data: { id }, 
        error: null, 
        success: true,
        status: 200,
        message: "Product deleted successfully"
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      toastAlert('Product Gagal Dihapus', 'error');
      return { 
        data: null, 
        error: "Failed to delete product", 
        success: false,
        status: 500,
        message: "Error deleting product"
      };
    }
  };

  const getProductById = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const product = mockProductsWithStock.find(p => p.id === id);
      return { 
        data: product || null, 
        error: product ? null : 'Product not found', 
        success: !!product,
        status: product ? 200 : 404,
        message: product ? "Product found" : "Product not found"
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { 
        data: null, 
        error: "Failed to fetch product", 
        success: false,
        status: 500,
        message: "Error fetching product"
      };
    }
  };

  return {
    products: data || [],
    error,
    isLoading,
    getProductByCurrentPage,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    lowStockProducts  // Added low stock products for dashboard
  };
};

export default useProduct;