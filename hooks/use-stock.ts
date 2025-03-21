import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { ProductRetur } from "@/types/retur";
import useSWR from "swr";


const useStock = () => {
  const { data: products, isLoading: isLoadingProducts } = useSWR<ProductRetur[]>(`${BASE_URL}/stock/pharmacy`, fetcher)
  return {
    products: products || [],
    isLoadingProducts,

  }
}
export default useStock;