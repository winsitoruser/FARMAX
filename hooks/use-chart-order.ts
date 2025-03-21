import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { TypesChartOrder } from "@/types/chart-order";
import useSWR from "swr";

const useChartOrder = () => {
  const { data, error, isLoading } = useSWR<TypesChartOrder[]>(`${BASE_URL}/order/total/month`, fetcher);

  return {
    data, error, isLoading
  }
}

export default useChartOrder