import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Products } from "@/types/products";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

interface TotalPageProps {
  status: number,
  totalPages: number
}
const useProduct = () => {
  const { data, error } = useSWR<Products[]>(`${BASE_URL}/product/all`, fetcher);
  const { data: productTotalPage, error: totalPageError } = useSWR<TotalPageProps>(`${BASE_URL}/product/total/page`, fetcher);

  const getProductByCurrentPage = async (currentPage: number) => {
    const res = await fetcher(`${BASE_URL}/product/page?pageNumber=${currentPage}`);
    return res;
  }

  const createProduct = async (data: any, id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/product/add/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(data),
      })

      const resJson = await res.json();

      if (res.ok) {
        mutate(`${BASE_URL}/product/all`)
        mutate(`${BASE_URL}/product/total/page`)
        toastAlert('Product Berhasil Ditambahkan', 'success');
        return resJson;
      } else {
        toastAlert(resJson.error, 'error');
      }

    } catch (error) {
      toastAlert(error as string, 'error');
    }
  }

  const getProductById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/product/${id}`);
    const resJson = await res.json()

    return resJson;
  }

  return {
    isLoading: !error && !data && !totalPageError && !productTotalPage,
    isError: error || totalPageError,
    data: data || [],
    productTotalPage: productTotalPage?.totalPages || 0,
    getProductByCurrentPage,
    createProduct,
    getProductById
  }
}

export default useProduct;