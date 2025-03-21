import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetriveProductType } from "@/types/retrive-master";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

const API_URL = `${BASE_URL}/MD/prod_type`;

const useProductType = () => {
  const { data, error } = useSWR<RetriveProductType[]>(API_URL, fetcher);

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
        body: urlEncodedData,
      });
      const responseData = await response.json();
      console.log({ response });
      console.log({ responseData });
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

  const refreshProductType = () => {
    mutate(API_URL);
  }

  const updateProductType = async (id: string, formData: FormData) => {
    try {

      await performRequest('PATCH', `${API_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      toastAlert('ProductType updated successfully', 'success');
      refreshProductType();
    } catch (error) {
      toastAlert('Failed to update ProductType', 'error');
    }
  }

  const createProductType = async (formData: FormData) => {
    try {

      const res = await performRequest('POST', API_URL, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log({ res });
      toastAlert('ProductType created successfully', 'success');
      refreshProductType();
    } catch (error) {
      toastAlert('Failed to create ProductType', 'error');
    }
  };

  const deleteProductType = async (id: string) => {
    try {
      await performRequest('DELETE', `${API_URL}/${id}`);
      toastAlert('ProductType deleted successfully', 'success');
      refreshProductType();
    } catch (error) {
      toastAlert('Failed to delete ProductType', 'error');
    }
  }

  return {
    isLoading: !error && !data,
    isError: error,
    data: data || [],
    refreshProductType,
    updateProductType,
    createProductType,
    deleteProductType,
  }
}

export default useProductType;
