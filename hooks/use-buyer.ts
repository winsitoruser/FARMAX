import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Selling } from "@/types/order";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'


const createBuyer = async (data: any) => {
  try {
    const response = await fetch(`${BASE_URL}/buyer`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const resJson = await response.json();
      mutate(`${BASE_URL}/product/all`)
      mutate(`${BASE_URL}/product/total/page`)
      toastAlert('Order Berhasil', 'success');
      return resJson;
    } else {
      const errorJson = await response.json();
      toastAlert(errorJson.error, 'error');
      throw new Error(errorJson.error);
    }
  } catch (error) {
    throw error;
  }
};

const useBuyer = () => {
  const { data, isLoading, error } = useSWR<Selling[]>(`${BASE_URL}/buyer/all`, fetcher);
  const getBuyerById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/buyer/product/id?product_id=${id}`)
    const resJson = await res.json()

    return resJson;
  }
  return {
    data: data || [],
    isLoading,
    error,
    createBuyer,
    getBuyerById
  };
};

export default useBuyer;