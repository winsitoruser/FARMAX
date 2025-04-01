import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetriveStaff } from "@/types/staff";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts';
import { z } from "zod";
import { ApiResponse, handleApiResponse, safeAsync } from "@/lib/api-utils";

type RetriveStaff = z.infer<typeof RetriveStaff>

const useStaff = () => {
  const { data: staffs, error, isLoading } = useSWR<RetriveStaff[]>(`${BASE_URL}/staff`, fetcher);

  const refresh = () => mutate(`${BASE_URL}/staff`);
  
  const getStaffId = async (slug: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${BASE_URL}/staff/${slug}`);
      return await handleApiResponse(res, false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch staff';
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  }

  const createStaff = async (formData: FormData): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${BASE_URL}/staff`, {
        method: 'POST',
        // Removed Content-Type header as it's automatically set for FormData
        body: formData
      });
      
      const result = await handleApiResponse(res);
      
      if (result.success) {
        refresh();
        toastAlert('Berhasil menambahkan staff', 'success');
      } else {
        toastAlert('Gagal menambahkan staff', 'error')
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create staff';
      toastAlert('Gagal menambahkan staff', 'error');
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  }

  const archive = async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await fetch(`${BASE_URL}/staff/archived/${id}`, {
        method: 'PATCH',
      });
      
      const result = await handleApiResponse(res);
      
      if (result.success) {
        refresh();
        toastAlert('Berhasil archive staff', 'success')
      } else {
        toastAlert('Gagal archive staff', 'error')
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive staff';
      toastAlert('Gagal archive staff', 'error');
      return { data: null, error: errorMessage, success: false, status: 500 };
    }
  }

  return {
    staff: staffs || [],
    isLoading,
    error,
    getStaffId,
    createStaff,
    archive
  }
}

export default useStaff;