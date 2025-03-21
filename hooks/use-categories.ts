import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetriveCategory } from "@/types/retrive-master";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

const API_URL = `${BASE_URL}/MD/category`;

const useCategories = () => {
  const { data, error } = useSWR<RetriveCategory[]>(API_URL, fetcher);

  const performRequest = async (method: string, url: string, formData?: FormData) => {
    try {
      const response = await fetch(url, {
        method,
        body: formData,
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

  const refreshCategories = () => {
    mutate(API_URL);
  }

  const updateCategory = async (id: string, formData: FormData) => {
    try {
      await performRequest('PATCH', `${API_URL}/${id}`, formData);
      toastAlert('Category updated successfully', 'success');
      refreshCategories();
    } catch (error: unknown) {
      toastAlert('Failed to update category', 'error');
    }
  }

  const createCategory = async (formData: FormData) => {
    try {
      await performRequest('POST', API_URL, formData);
      toastAlert('Category created successfully', 'success');
      refreshCategories();
    } catch (error: unknown) {
      toastAlert('Failed to create category', 'error');
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await performRequest('DELETE', `${API_URL}/${id}`);
      toastAlert('Category deleted successfully', 'success');
      refreshCategories();
    } catch (error: unknown) {
      toastAlert('Failed to delete category', 'error');
    }
  }

  return {
    isLoading: !error && !data,
    isError: error,
    categories: data || [],
    refreshCategories,
    updateCategory,
    createCategory,
    deleteCategory,
  }
}

export default useCategories;
