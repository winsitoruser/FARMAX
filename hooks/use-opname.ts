import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { RetriveOpname } from "@/types/opname";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

type Props = {
  status: number,
  data: RetriveOpname[]
}
const useOpname = () => {
  const { data: opnames, isLoading } = useSWR<Props>(`${BASE_URL}/stock/opname/all`, fetcher);

  const sortOrders = (sortBy: 'createdAt' | 'updatedAt') => {
    if (opnames) {
      return opnames.data.slice().sort((a: { createdAt: string | number | Date; updatedAt: string | number | Date; }, b: { createdAt: string | number | Date; updatedAt: string | number | Date; }) => {
        const dateA = sortBy === 'createdAt' ? new Date(a.createdAt) : new Date(a.updatedAt);
        const dateB = sortBy === 'createdAt' ? new Date(b.createdAt) : new Date(b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      });
    }
    return [];
  };


  const performRequest = async (method: string = 'GET', url: string, formData: FormData | undefined = undefined, rest: any = {}) => {
    try {
      const response = await fetch(url, {
        method,
        ...rest,
        body: formData,
      });

      if (response.ok) {
        return response.json();
      } else {
        console.error('Request failed with status:', response.status);
        const responseText = await response.text();
        console.error('Response body:', responseText);
        toastAlert('Request failed with status ' + response.status, 'error');
      }
    } catch (error) {
      console.error('Request failed with an error:', error);
      toastAlert(error as string, 'error');
    }
  }


  const handleRequest = async (method: string, url: string, formData: FormData | null, successMessage: string) => {
    try {
      await performRequest(method, url, formData !== null ? formData : undefined);
      toastAlert(successMessage, 'success');
      refreshOpname();
    } catch (error) {
      toastAlert(`Failed to ${successMessage.toLowerCase()}`, 'error');
    }
  }


  const refreshOpname = () => {
    mutate(`${BASE_URL}/stock/opname/all`);
  }

  const createOpname = async (formData: FormData) => {
    handleRequest('POST', `${BASE_URL}/stock/opname`, formData, 'Opname created successfully');
  }

  const updateOpname = async (id: string, formData: FormData) => {
    handleRequest('PATCH', `${BASE_URL}/stock/opname/?id_opname=${id}`, formData, 'Opname updated successfully');
  }

  const deleteOpname = async (id: string) => {
    handleRequest('DELETE', `${BASE_URL}/stock/opname/id?id_opname=${id}`, null, 'Opname deleted successfully');
  }

  const putStatusAcceptOpname = async (id: string, formData: FormData) => {
    handleRequest('PUT', `${BASE_URL}/stock/opname/accept?id_opname=${id}`, formData, 'Status updated successfully');
  }

  const putStatusRejectOpname = async (id: string) => {
    handleRequest('PUT', `${BASE_URL}/stock/opname/reject?id_opname=${id}`, null, 'Status updated successfully');
  }

  const getOpnameById = async (id: string) => {
    const url = `${BASE_URL}/stock/opname/id?id_opname=${id}`;
    const response = await performRequest('GET', url);
    if (response.status === 200 || 201)
      return response.data;
  }


  return {
    opnames: sortOrders('createdAt'),
    getOpnameById,
    createOpname,
    refreshOpname,
    putStatusAcceptOpname,
    putStatusRejectOpname,
    updateOpname,
    deleteOpname,
    isLoading
  }
}

export default useOpname;
