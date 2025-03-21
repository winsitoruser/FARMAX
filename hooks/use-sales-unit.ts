import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetriveSalesUnit } from "@/types/retrive-master";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

const API_URL = `${BASE_URL}/MD/sales_unit`;

const useSalesUnit = () => {
  const { data, error } = useSWR<RetriveSalesUnit[]>(API_URL, fetcher);

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

  const refreshSalesUnit = () => {
    mutate(API_URL);
  }

  const updateSalesUnit = async (id: string, formData: FormData) => {
    try {
      await performRequest('PATCH', `${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      toastAlert('Updated successfully', 'success');
      refreshSalesUnit();
    } catch (error) {
      toastAlert('Failed to update', 'error');
    }
  }

  const createSalesUnit = async (formData: FormData) => {
    try {
      await performRequest('POST', API_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      toastAlert('Created successfully', 'success');
      refreshSalesUnit();
    } catch (error) {
      toastAlert('Failed to create', 'error');
    }
  };

  const deleteSalesUnit = async (id: string) => {
    try {
      await performRequest('DELETE', `${API_URL}/${id}`);
      toastAlert('SalesUnit deleted successfully', 'success');
      refreshSalesUnit();
    } catch (error) {
      toastAlert('Failed to delete', 'error');
    }
  }

  return {
    isLoading: !error && !data,
    isError: error,
    data: data || [],
    refreshSalesUnit,
    updateSalesUnit,
    createSalesUnit,
    deleteSalesUnit,
  }
}

export default useSalesUnit;
