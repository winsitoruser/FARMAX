import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { ProductRetur } from "@/types/retur";
import useSWR from "swr";
import { ApiResponse, handleApiResponse } from '@/lib/api-utils';

const useStock = () => {
  const { data: products, isLoading: isLoadingProducts, error } = useSWR<ProductRetur[]>(`${BASE_URL}/stock/pharmacy`, fetcher);

  // Add a function to get stock by ID
  const getStockById = async (id: string): Promise<ApiResponse<ProductRetur>> => {
    try {
      const res = await fetch(`${BASE_URL}/stock/pharmacy/${id}`);
      return await handleApiResponse<ProductRetur>(res, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stock';
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  };

  return {
    products: products || [],
    isLoadingProducts,
    error,
    getStockById
  };
};

export default useStock;