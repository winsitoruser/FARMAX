import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Supplier } from "@/types/supplier";
import useSWR, { mutate } from "swr";
import { ApiResponse, handleApiResponse } from '@/lib/api-utils';
import { toastAlert } from '@/components/common/alerts';

const API_URL = `${BASE_URL}/supplier`;

const useSupplier = () => {
  const { data, error, isLoading } = useSWR<Supplier[]>(API_URL, fetcher);

  const performRequest = async <T>(method: string, url: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const options: RequestInit = {
        method,
        headers: data ? { 'Content-Type': 'application/json' } : undefined,
        body: data ? JSON.stringify(data) : undefined,
      };
      
      const response = await fetch(url, options);
      return await handleApiResponse<T>(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed';
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  };

  const refreshSupplier = () => {
    mutate(API_URL);
  };

  const getSupplierById = async (id: string): Promise<ApiResponse<Supplier>> => {
    return performRequest<Supplier>('GET', `${API_URL}/${id}`);
  };

  const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<ApiResponse<Supplier>> => {
    const result = await performRequest<Supplier>('POST', API_URL, supplierData);
    
    if (result.success) {
      refreshSupplier();
      toastAlert('Supplier berhasil ditambahkan', 'success');
    }
    
    return result;
  };

  const updateSupplier = async (id: string, supplierData: Partial<Supplier>): Promise<ApiResponse<Supplier>> => {
    const result = await performRequest<Supplier>('PUT', `${API_URL}/${id}`, supplierData);
    
    if (result.success) {
      refreshSupplier();
      toastAlert('Supplier berhasil diperbarui', 'success');
    }
    
    return result;
  };

  const deleteSupplier = async (id: string): Promise<ApiResponse<void>> => {
    const result = await performRequest<void>('DELETE', `${API_URL}/${id}`);
    
    if (result.success) {
      refreshSupplier();
      toastAlert('Supplier berhasil dihapus', 'success');
    }
    
    return result;
  };

  return {
    suppliers: data || [],
    data: data || [], // Add data property for backward compatibility
    isLoading,
    error,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSupplier
  };
};

export default useSupplier;
