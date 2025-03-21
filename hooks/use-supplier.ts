import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Supplier } from "@/types/supplier";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

const API_URL = `${BASE_URL}/supplier`;

const useSupplier = () => {
  const { data, error } = useSWR<Supplier[]>(API_URL, fetcher);

  const performRequest = async (method: string, url: string, data?: any, rest?: any) => {
    try {
      const response = await fetch(url, {
        method,
        ...rest,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  const refreshSupplier = () => {
    mutate(API_URL);
  }

  const updateStatusSupplier = async (id: string, formData: FormData) => {
    try {
      const urlEncodedData = new URLSearchParams();

      if (formData) {
        for (const pair of formData.entries()) {
          if (!(pair[1] instanceof File)) {
            urlEncodedData.append(pair[0], pair[1]);
          }
        }
      }
      const response = await fetch(`${BASE_URL}/supplier/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlEncodedData,
      })
      const responseData = await response.json();
      console.log(responseData)
      if (!response.ok) {
        toastAlert(responseData.message || 'Request Failed', 'error');
      } else {
        toastAlert('Status updated successfully', 'success');
        refreshSupplier();
      }
    } catch (error: unknown) {
      toastAlert('Failed to update', 'error');
    }
  }

  const createSupplier = async (data: any) => {
    try {
      await performRequest('POST', API_URL, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toastAlert('Supplier created successfully', 'success');
      refreshSupplier();
    } catch (error: unknown) {
      toastAlert('Failed to create', 'error');
    }
  }

  const deleteSupplier = async (id: string) => {
    try {
      await performRequest('DELETE', `${API_URL}/${id}`);
      toastAlert('Deleted successfully', 'success');
      refreshSupplier();
    } catch (error: unknown) {
      toastAlert('Failed to delete', 'error');
    }
  }

  const getSupplierById = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (response.ok) {
        return response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
      }
    } catch (error: unknown) {
      throw error;
    }
  }

  return {
    isLoading: !error && !data,
    isError: error,
    data: data || [],
    refreshSupplier,
    updateStatusSupplier,
    getSupplierById,
    createSupplier,
    deleteSupplier,
  }
}

export default useSupplier;
