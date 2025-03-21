import { BASE_URL } from "@/lib/constants";
import { mutate } from "swr";
import { toastAlert } from '@/components/common/alerts'

const useCertificate = () => {
  const performRequest = async (method: string, url: string, formData?: FormData, rest?: any) => {
    try {
      const response = await fetch(url, {
        method,
        ...rest,
        body: formData,
      });

      if (response.ok) {
        return response.json();
      } else {
        toastAlert(response.statusText, "error");
      }
    } catch (error) {
      toastAlert(error as string, "error");
    }
  }

  const createCertificate = async (id: string, formData: FormData) => {
    try {
      await performRequest('POST', `${BASE_URL}/staff/license?id_staff=${id}`, formData);
      toastAlert('Sertifikat berhasil dibuat', 'success');
      mutate(`${BASE_URL}/staff/${id}`)
    } catch (err) {
      toastAlert('Gagal membuat sertifikat', 'error')
    }
  }

  const getCertificateById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/staff/license/all_by?id_staff=${id}`)
    const resJson = await res.json()
    if (res.ok || res.status === 200) {
      return resJson
    } else {
      return [];
    }

  }
  return {
    createCertificate,
    getCertificateById
  }
}

export default useCertificate