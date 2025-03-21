import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { ProductRetur, ReturNew } from "@/types/retur";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'


const useRetur = () => {
  const { data, error } = useSWR<ProductRetur[]>(`${BASE_URL}/stock/retur/all`, fetcher);

  const createRetur = async (data: ReturNew) => {
    try {
      const res = await fetch(`${BASE_URL}/stock/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      const resJson = await res.json();
      if (res.ok) {
        mutate(`${BASE_URL}/stock/pharmacy`)
        mutate(`${BASE_URL}/stock/retur/all`)
        toastAlert('Product Retur Berhasil Dikirim', 'success');
        return resJson;
      } else {
        toastAlert(resJson.error, 'error');
      }
    } catch (error) {
      toastAlert(error as string, 'error');

    }

  }

  return {
    isLoading: !error && !data,
    isError: error,
    data: data || [],
    createRetur,
  }
}

export default useRetur;