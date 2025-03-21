import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { ProductAcceptance } from "@/types/products";
import useSWR from "swr";

const useOrder = () => {
  const { data: order, error, isLoading } = useSWR<ProductAcceptance[]>(`${BASE_URL}/order/origin/pharmacy`, fetcher);

  const sortOrders = (sortBy: 'createdAt' | 'updatedAt') => {
    if (order) {
      return order.slice().sort((a, b) => {
        const dateA = sortBy === 'createdAt' ? new Date(a.createdAt) : new Date(a.updatedAt);
        const dateB = sortBy === 'createdAt' ? new Date(b.createdAt) : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return [];
  };

  const getOrderById = async (id: string) => {
    const res = await fetcher(`${BASE_URL}/order/${id}`);
    return res;
  };

  return {
    order: sortOrders('updatedAt'),
    error,
    getOrderById,
    isLoading
  };
};

export default useOrder;
