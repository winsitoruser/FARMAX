import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal",
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
    }`;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ");
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

export function calculateAge(birthDateStr: string): number {
  const birthDate = new Date(birthDateStr);
  const currentDate = new Date();
  const diffInMilliseconds = currentDate.getTime() - birthDate.getTime();
  const ageDate = new Date(diffInMilliseconds);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export function extractTimeFromISOString(isoString: string | number | Date) {
  const dt = new Date(isoString);

  const hours = dt.getUTCHours();
  const minutes = dt.getUTCMinutes();

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return formattedTime;
}

export const convertToISOString = (date: { toISOString: () => string }, time: any) => {
  const isoString = new Date(`${date.toISOString().split('T')[0]}T${time}:00.000Z`);
  return isoString.toISOString();
};

export function getTimeClassNames(startTime: string, endTime: string) {
  // Parse the time strings to get hours
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);

  // Define the time ranges and corresponding classNames
  const timeRanges = [
    { start: 7, end: 10, classNames: 'hms-time-green' },
    { start: 10, end: 15, classNames: 'hms-time-blue' },
    { start: 15, end: 20, classNames: 'hms-time-orange' },
    { start: 20, end: 23, classNames: 'hms-time-red' },
  ];

  // Find the matching classNames for the given time range
  for (const range of timeRanges) {
    if (startHour >= range.start && endHour <= range.end) {
      return range.classNames;
    }
  }

  return 'hms-time-blue';
}
