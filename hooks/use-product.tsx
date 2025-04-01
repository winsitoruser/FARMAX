import { useState, useEffect } from 'react';

// Sample inventory product data dengan informasi yang lebih lengkap
const inventoryProducts = [
  {
    id: "1",
    product_name: "Paracetamol 500mg",
    product_code: "PCM500",
    price_input: 10000,
    price_output: 12000,
    qty: 100,
    sales_unit: "Tablet",
    category: "Obat Bebas",
    description: "Obat pereda nyeri dan penurun demam",
    image: "https://i.imgur.com/JQpMvmD.jpg",
    location: "Rak A-1",
    expiry: "2025-12-31",
    manufacturer: "PT. Kimia Farma",
    batch: "BT2023001"
  },
  {
    id: "2",
    product_name: "Amoxicillin 500mg",
    product_code: "AMX500",
    price_input: 15000,
    price_output: 18000,
    qty: 80,
    sales_unit: "Kaplet",
    category: "Obat Resep",
    description: "Antibiotik untuk mengatasi infeksi bakteri",
    image: "https://i.imgur.com/0K3f8W3.jpg",
    location: "Rak B-2",
    expiry: "2026-05-15",
    manufacturer: "PT. Dexa Medica",
    batch: "BT2023002"
  },
  {
    id: "3",
    product_name: "Vitamin C 1000mg",
    product_code: "VTC1000",
    price_input: 25000,
    price_output: 30000,
    qty: 50,
    sales_unit: "Tablet",
    category: "Suplemen",
    description: "Suplemen untuk meningkatkan daya tahan tubuh",
    image: "https://i.imgur.com/9G8S86l.jpg",
    location: "Rak C-1",
    expiry: "2026-08-20",
    manufacturer: "PT. Bintang Toedjoe",
    batch: "BT2023003"
  },
  {
    id: "4",
    product_name: "Antasida Doen",
    product_code: "ANTD",
    price_input: 8000,
    price_output: 10000,
    qty: 120,
    sales_unit: "Botol",
    category: "Obat Bebas",
    description: "Obat untuk menetralkan asam lambung",
    image: "https://i.imgur.com/JzULzmP.jpg",
    location: "Rak A-3",
    expiry: "2025-11-10",
    manufacturer: "PT. Phapros",
    batch: "BT2023004"
  },
  {
    id: "5",
    product_name: "Ibuprofen 400mg",
    product_code: "IBP400",
    price_input: 12000,
    price_output: 15000,
    qty: 90,
    sales_unit: "Tablet",
    category: "Obat Bebas",
    description: "Anti-inflamasi non-steroid untuk mengurangi nyeri dan peradangan",
    image: "https://i.imgur.com/1LYzPnG.jpg",
    location: "Rak A-2",
    expiry: "2026-02-28",
    manufacturer: "PT. Kalbe Farma",
    batch: "BT2023005"
  },
  {
    id: "6",
    product_name: "Masker Medis (50pcs)",
    product_code: "MSK50",
    price_input: 40000,
    price_output: 50000,
    qty: 30,
    sales_unit: "Box",
    category: "Alat Kesehatan",
    description: "Masker sekali pakai untuk perlindungan kesehatan",
    image: "https://i.imgur.com/0K3f8W3.jpg",
    location: "Rak F-1",
    expiry: "2027-01-01",
    manufacturer: "PT. Surgika Alkesindo",
    batch: "BT2023006"
  },
  {
    id: "7",
    product_name: "Betadine 60ml",
    product_code: "BTD60",
    price_input: 25000,
    price_output: 28000,
    qty: 40,
    sales_unit: "Botol",
    category: "Antiseptik",
    description: "Antiseptik untuk membersihkan luka",
    image: "https://i.imgur.com/9G8S86l.jpg",
    location: "Rak F-2",
    expiry: "2026-05-10",
    manufacturer: "PT. Mahakam Beta Farma",
    batch: "BT2023007"
  },
  {
    id: "8",
    product_name: "Plester Luka (20pcs)",
    product_code: "PST20",
    price_input: 12000,
    price_output: 15000,
    qty: 50,
    sales_unit: "Box",
    category: "Alat Kesehatan",
    description: "Plester untuk menutup luka kecil",
    image: "https://i.imgur.com/JzULzmP.jpg",
    location: "Rak F-3",
    expiry: "2027-03-15",
    manufacturer: "PT. Hisamitsu Pharma",
    batch: "BT2023008"
  },
  {
    id: "9",
    product_name: "Minyak Kayu Putih 60ml",
    product_code: "MKP60",
    price_input: 28000,
    price_output: 32000,
    qty: 35,
    sales_unit: "Botol",
    category: "Herbal",
    description: "Minyak esensial untuk meredakan gejala flu dan nyeri otot",
    image: "https://i.imgur.com/1LYzPnG.jpg",
    location: "Rak G-1",
    expiry: "2026-08-20",
    manufacturer: "PT. Eagle Indo Pharma",
    batch: "BT2023009"
  },
  {
    id: "10",
    product_name: "Thermometer Digital",
    product_code: "THD01",
    price_input: 75000,
    price_output: 85000,
    qty: 20,
    sales_unit: "Pcs",
    category: "Alat Kesehatan",
    description: "Alat pengukur suhu tubuh digital dengan akurasi tinggi",
    image: "https://i.imgur.com/8JKz7p4.jpg",
    location: "Rak G-2",
    expiry: "2030-01-01",
    manufacturer: "PT. Omron Healthcare",
    batch: "BT2023010"
  }
];

// Type for API response
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Enhanced Product type with additional fields
export type EnhancedProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image?: string;
  location?: string;
  expiry?: string;
  manufacturer?: string;
  batch?: string;
  product_code?: string;
  sales_unit?: string;
  product_name?: string;
};

const useProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productTotalPage, setProductTotalPage] = useState(1);
  const [products, setProducts] = useState<EnhancedProduct[]>([]);

  // Konversi data inventori menjadi format yang dibutuhkan oleh kasir
  const convertToEnhancedProduct = (product: any): EnhancedProduct => {
    return {
      id: product.id,
      name: product.product_name,
      price: product.price_output || product.price_input,
      stock: product.qty,
      category: product.category || "Umum",
      description: product.description || "",
      image: product.image,
      location: product.location,
      expiry: product.expiry,
      manufacturer: product.manufacturer,
      batch: product.batch,
      product_code: product.product_code,
      sales_unit: product.sales_unit,
      product_name: product.product_name
    };
  };

  // Function to get products by page
  const getProductByCurrentPage = async (page: number): Promise<ApiResponse<EnhancedProduct[]>> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Convert inventory products to enhanced products
      const enhancedProducts = inventoryProducts.map(convertToEnhancedProduct);
      
      // Set to state for easy access
      setProducts(enhancedProducts);
      
      // Set pagination info
      setProductTotalPage(1); // Just one page for sample data
      setIsLoading(false);
      
      return {
        success: true,
        data: enhancedProducts
      };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: "Failed to fetch products"
      };
    }
  };

  // Load products on initial mount
  useEffect(() => {
    getProductByCurrentPage(1);
  }, []);

  return {
    isLoading,
    productTotalPage,
    getProductByCurrentPage,
    products
  };
};

export default useProduct;
