import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetriveOpname } from "@/types/opname";
import useSWR, { mutate } from "swr";
import { ApiResponse, handleApiResponse } from '@/lib/api-utils';
import { toastAlert } from '@/components/common/alerts';

type Props = {
  status: number,
  data: RetriveOpname[]
}

const useOpname = () => {
  const { data: opnames, isLoading, error } = useSWR<Props>(`${BASE_URL}/stock/opname/all`, fetcher);

  const sortOrders = (sortBy: 'createdAt' | 'updatedAt') => {
    if (opnames) {
      return opnames.data.slice().sort((a: { createdAt: string | number | Date; updatedAt: string | number | Date; }, b: { createdAt: string | number | Date; updatedAt: string | number | Date; }) => {
        const dateA = sortBy === 'createdAt' ? new Date(a.createdAt) : new Date(a.updatedAt);
        const dateB = sortBy === 'createdAt' ? new Date(b.createdAt) : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return [];
  };

  const refreshOpname = () => {
    mutate(`${BASE_URL}/stock/opname/all`);
  };

  const performRequest = async <T>(
    method: string = 'GET', 
    url: string, 
    formData?: FormData, 
    showToast: boolean = true
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      return await handleApiResponse<T>(response, showToast);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      if (showToast) {
        toastAlert(errorMessage, 'error');
      }
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  };

  const handleRequest = async (
    method: string, 
    url: string, 
    formData: FormData | null, 
    successMessage: string
  ): Promise<ApiResponse<any>> => {
    try {
      const result = await performRequest(
        method, 
        url, 
        formData || undefined
      );

      if (result.success) {
        refreshOpname();
        toastAlert(successMessage, 'success');
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      toastAlert(errorMessage, 'error');
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  };

  const createOpname = async (formData: FormData): Promise<ApiResponse<any>> => {
    return handleRequest(
      'POST',
      `${BASE_URL}/stock/opname/create`,
      formData,
      'Stock opname berhasil dibuat'
    );
  };

  const updateOpname = async (id: string, formData: FormData): Promise<ApiResponse<any>> => {
    return handleRequest(
      'PUT',
      `${BASE_URL}/stock/opname/update?opname_id=${id}`,
      formData,
      'Stock opname berhasil diperbarui'
    );
  };

  const deleteOpname = async (id: string): Promise<ApiResponse<any>> => {
    return handleRequest(
      'DELETE',
      `${BASE_URL}/stock/opname/delete?opname_id=${id}`,
      null,
      'Stock opname berhasil dihapus'
    );
  };

  const getOpnameById = async (id: string): Promise<ApiResponse<any>> => {
    return performRequest(
      'GET',
      `${BASE_URL}/stock/opname/id?opname_id=${id}`,
      undefined,
      false
    );
  };

  const putStatusAcceptOpname = async (id: string, formData: FormData): Promise<ApiResponse<any>> => {
    return handleRequest('PUT', `${BASE_URL}/stock/opname/accept?opname_id=${id}`, formData, 'Status updated successfully');
  };

  const putStatusRejectOpname = async (id: string): Promise<ApiResponse<any>> => {
    return handleRequest('PUT', `${BASE_URL}/stock/opname/reject?opname_id=${id}`, null, 'Status updated successfully');
  };

  return {
    opnames: opnames?.data || [],
    isLoading,
    error,
    sortOrders,
    refreshOpname,
    createOpname,
    updateOpname,
    deleteOpname,
    getOpnameById,
    putStatusAcceptOpname,
    putStatusRejectOpname
  };
};

export default useOpname;
