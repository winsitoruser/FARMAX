import Swal, { SweetAlertIcon } from "sweetalert2";

const genericText = {
  confirmButtonText: 'Ya, saya yakin',
  denyButtonText: 'Tidak jadi',
  ok: 'Oke'
}

export const confirmAlert = (title: string, text = '') => Swal.fire({
  title,
  text,
  icon: 'warning',
  showConfirmButton: true,
  confirmButtonText: genericText.confirmButtonText,
  showDenyButton: true,
  denyButtonText: genericText.denyButtonText
});

export const infoAlert = (title: string, text = '', onOk?: Function, onDeny?: Function) => Swal.fire({ title, text, icon: 'info' });

export const errorAlert = (title: string, text = '') => Swal.fire({ title, text, icon: 'error' });

export const successAlert = (title: string, text = '') => Swal.fire({ title, text, icon: 'success' });

export const infoConfirmAlert = (title: string, text = '') => Swal.fire({
  title,
  text,
  icon: 'info',
  showConfirmButton: true,
  showDenyButton: true,
  confirmButtonText: 'Mengerti',
  denyButtonText: 'Batal',
})

export const toastAlert = (text: string, icon: SweetAlertIcon = 'info') => Swal.fire({
  text,
  icon,
  showCloseButton: false,
  showCancelButton: false,
  showDenyButton: false,
  toast: true,
  timer: 4000,
  timerProgressBar: true,
  position: 'top-end',
  showConfirmButton: false,
  customClass: 'hms-swal2-popup-small'
});