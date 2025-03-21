
export const formatRupiah = (value: number) => Intl.NumberFormat('id', {
  currency: 'IDR',
  style: 'currency',
  minimumFractionDigits: 0,
}).format(value);

export const formatDate = ({ date }: { date: Date }) => {
  let options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};

export const parseDate = (strDate: string) => {
  if (strDate.substr(0, 1) === '"') {
    strDate = JSON.parse(strDate);
  }

  const fromUtc = strDate.endsWith('Z');
  let date = new Date(strDate);

  if (!fromUtc) {
    date = new Date(Date.parse(strDate));
  }

  return date;
};