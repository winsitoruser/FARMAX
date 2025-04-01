import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5 text-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500 w-12 h-12"
        >
          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
          <path d="M14 3v4a2 2 0 0 0 2 2h4" />
          <path d="M21 20h-7l-4-4m8 0l-4 4" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-lg mb-6 text-gray-600 max-w-md mx-auto">
        Maaf, halaman yang Anda cari tidak tersedia. Silakan kembali ke halaman utama.
      </p>
      <Link href="/">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
}