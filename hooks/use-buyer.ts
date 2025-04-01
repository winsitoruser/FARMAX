import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Selling } from "@/types/order";
import useSWR, { mutate } from "swr";
import { ApiResponse, handleApiResponse } from '@/lib/api-utils';
import { toastAlert } from '@/components/common/alerts'


const createBuyer = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch(`${BASE_URL}/buyer`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await handleApiResponse(response);
    
    if (result.success) {
      // Only mutate buyer-related endpoints
      mutate(`${BASE_URL}/buyer/all`);
      toastAlert('Order Berhasil', 'success');
    }
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create buyer';
    toastAlert(errorMessage, 'error');
    return { data: null, error: errorMessage, success: false, status: 500 };
  }
};

const useBuyer = () => {
  const { data, isLoading, error } = useSWR<Selling[]>(`${BASE_URL}/buyer/all`, fetcher);
  
  const getBuyerById = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${BASE_URL}/buyer/product/id?product_id=${id}`);
      return await handleApiResponse(res, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch buyer';
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  };

  return {
    data,
    isLoading,
    error,
    createBuyer,
    getBuyerById
  };
};

export default useBuyer;