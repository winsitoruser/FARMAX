import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { StockExpired } from "@/types/stock";
import useSWR from "swr";


const useExpired = () => {
  const { data, error } = useSWR<StockExpired[]>(`${BASE_URL}/stock/expire/date/soon`, fetcher);
  return {
    stock: data || [],

    isLoading: !error && !data,
    isError: error
  }
}
export default useExpired;