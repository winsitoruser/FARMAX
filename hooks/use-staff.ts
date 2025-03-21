import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetriveStaff } from "@/types/staff";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'
import { z } from "zod";

type RetriveStaff = z.infer<typeof RetriveStaff>

const useStaff = () => {
  const { data: staffs, error, isLoading } = useSWR<RetriveStaff[]>(`${BASE_URL}/staff`, fetcher);

  const refresh = () => mutate(`${BASE_URL}/staff`)
  const getStaffId = async (slug: string) => {
    const res = await fetch(`${BASE_URL}/staff/${slug}`)
    const resJson = await res.json()
    if (res.ok) {
      refresh();
      return resJson;
    } else {
      return resJson.error
    }
  }

  const createStaff = async (formData: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      });
      const resJson = await res.json()

      if (res.ok || res.status === 201) {
        refresh();
        toastAlert('Berhasil menambahkan staff', 'success');
        return resJson;
      } else {
        toastAlert('Gagal menambahkan staff', 'error')
      }
    } catch (error) {
      toastAlert('Gagal menambahkan staff', 'error')
    }
  }

  const archive = async (id: string) => {
    const res = await fetch(`${BASE_URL}/staff/archived/${id}`, {
      method: 'PATCH',
    });
    const resJson = await res.json();
    if (res.ok || res.status === 201) {
      toastAlert('Berhasil archive staff', 'success')
    } else {
      toastAlert('Gagal archive staff', 'error')
    }
    return resJson
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