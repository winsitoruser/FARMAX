import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Prescription } from "@/types/prescription";
import useSWR, { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'


const usePrescription = () => {
  const { data, error } = useSWR<Prescription[]>(`${BASE_URL}/poly/prescriptions`, fetcher);

  const sortedData = data
    ? [...data].sort((a, b) => new Date(b.updatedAt as string).getTime() - new Date(a.updatedAt as string).getTime())
    : undefined;

  const unpaid = sortedData?.filter((item) => !item?.pres_filled);
  const paid = sortedData?.filter((item) => item?.pres_filled);

  const updatePrescription = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/POS/poly/prescription/presfilled?prescription_id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ pres_filled: true })
      });
      const resJson = await response.json()
      if (response.ok) {
        mutate(`${BASE_URL}/poly/prescriptions`)
        toastAlert('Resep Berhasil Dibayar', 'success');
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
    data: {
      unpaid,
      paid
    },
    updatePrescription
  };
};


export default usePrescription