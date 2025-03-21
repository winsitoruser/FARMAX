import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetrivePurchase } from "@/types/retrive-master";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

const API_URL = `${BASE_URL}/MD/purchase`;

const usePurchase = () => {
  const { data, error } = useSWR<RetrivePurchase[]>(API_URL, fetcher);

  const performRequest = async (method: string, url: string, formData?: FormData, rest?: any) => {
    try {
      const urlEncodedData = new URLSearchParams();

      if (formData) {
        for (const pair of formData.entries()) {
          if (!(pair[1] instanceof File)) {
            urlEncodedData.append(pair[0], pair[1]);
          }
        }
      }
      const response = await fetch(url, {
        method,
        ...rest,
        body: new URLSearchParams(urlEncodedData),
      });
      const responseData = await response.json();
      if (response.ok) {
        return responseData;
      } else {
        const errorMessage = responseData.message || 'Request failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    }
  }

  const refreshPurchase = () => {
    mutate(API_URL);
  }

  const updatePurchase = async (id: string, formData: FormData) => {
    try {
      await performRequest('PATCH', `${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      toastAlert('Purchase updated successfully', 'success');
      refreshPurchase();
    } catch (error) {
      toastAlert('Failed to update Purchase', 'error');
    }
  }

  const createPurchase = async (formData: FormData) => {
    try {

      await performRequest('POST', API_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      toastAlert('Purchase created successfully', 'success');
      refreshPurchase();
    } catch (error) {
      toastAlert('Failed to create Purchase', 'error');
    }
  };

  const deletePurchase = async (id: string) => {
    try {
      await performRequest('DELETE', `${API_URL}/${id}`);
      toastAlert('Purchase deleted successfully', 'success');
      refreshPurchase();
    } catch (error) {
      toastAlert('Failed to delete Purchase', 'error');
    }
  }

  return {
    isLoading: !error && !data,
    isError: error,
    data: data || [],
    refreshPurchase,
    updatePurchase,
    createPurchase,
    deletePurchase,
  }
}

export default usePurchase;
