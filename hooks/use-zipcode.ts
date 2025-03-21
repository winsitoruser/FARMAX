import { BASE_URL } from "@/lib/constants";
import fetcher from "@/lib/fetcher";
import { Province } from "@/types";
import useSWR from "swr";


const useZipcode = () => {
  const { data: province, error, isLoading } = useSWR<Province[]>(`${BASE_URL}/MD/province`, fetcher);

  const getDistricts = async (provinceId: string) => {
    const res = await fetch(`${BASE_URL}/MD/districts?id_prov=${provinceId}`);
    const resJson = await res.json()
    return resJson;
  }

  const getSubDistricts = async (districtId: string) => {
    const res = await fetch(`${BASE_URL}/MD/sub-district?id_dist=${districtId}`);
    const resJson = await res.json()
    return resJson;
  }

  return {
    province,
    error,
    isLoading,
    getDistricts,
    getSubDistricts,
  }
}

export default useZipcode;