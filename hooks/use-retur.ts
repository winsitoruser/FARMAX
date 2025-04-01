import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { ProductRetur, ReturNew } from "@/types/retur";
import useSWR, { mutate } from "swr";
import { ApiResponse, handleApiResponse } from '@/lib/api-utils';
import { toastAlert } from '@/components/common/alerts';

const useRetur = () => {
  const { data, error } = useSWR<ProductRetur[]>(`${BASE_URL}/stock/retur/all`, fetcher);

  const createRetur = async (data: ReturNew): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${BASE_URL}/stock/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      
      const result = await handleApiResponse(res);
      
      if (result.success) {
        // Refresh related data
        mutate(`${BASE_URL}/stock/pharmacy`);
        mutate(`${BASE_URL}/stock/retur/all`);
        toastAlert('Product Retur Berhasil Dikirim', 'success');
      } else {
        // Fix: Check if error is null before using it
        if (result.error) {
          toastAlert(result.error, 'error');
        } else {
          toastAlert('Unknown error occurred', 'error');
        }
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create return';
      toastAlert(errorMessage, 'error');
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  };

  const getReturById = async (id: string): Promise<ApiResponse<ProductRetur>> => {
    try {
      const res = await fetch(`${BASE_URL}/stock/retur/${id}`);
      return await handleApiResponse<ProductRetur>(res, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch return';
      toastAlert(errorMessage, 'error');
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  };

  return {
    data,
    isLoading: !error && !data,
    error,
    createRetur,
    getReturById
  };
};

export default useRetur;