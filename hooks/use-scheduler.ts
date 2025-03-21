import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { TypeAppoimentStaff, TypeScheduleStaff } from "@/types/staff";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

const useScheduler = () => {
  const { data, isLoading } = useSWR<TypeAppoimentStaff[]>(`${BASE_URL}/staff/schedule/all`, fetcher);

  const sortOrders = (sortBy: 'createdAt' | 'updatedAt') => {
    if (data) {
      return data.slice().sort((a: { createdAt: string | number | Date; updatedAt: string | number | Date; }, b: { createdAt: string | number | Date; updatedAt: string | number | Date; }) => {
        const dateA = sortBy === 'createdAt' ? new Date(a.createdAt) : new Date(a.updatedAt);
        const dateB = sortBy === 'createdAt' ? new Date(b.createdAt) : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return [];
  };
  const refresh = () => mutate(`${BASE_URL}/staff/schedule/all`)
  const createScheduler = async (id: string, data: TypeScheduleStaff) => {
    const res = await fetch(`${BASE_URL}/staff/addSchedule/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: [data] })
    });

    if (res.ok || res.status === 201) {
      refresh();
      toastAlert('Berhasil menambahkan jadwal', 'success')
    } else {
      toastAlert('Gagal menambahkan jadwal', 'error')
    }
  }

  const getScheduleById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/staff/schedule/by?staff_id=/${id}`);
    const resJson = await res.json()

    return resJson;
  }

  return {
    data: sortOrders('updatedAt'), isLoading,
    createScheduler,
    getScheduleById
  }
}

export default useScheduler;