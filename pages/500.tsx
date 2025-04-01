import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

export default function Custom500() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
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
          className="text-red-500 w-12 h-12"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Kesalahan Server Internal
      </h1>
      <p className="text-lg mb-6 text-gray-600 max-w-md mx-auto">
        Maaf, terjadi kesalahan pada server kami. Tim teknis kami telah diberitahu dan sedang bekerja untuk memperbaikinya.
      </p>
      <div className="flex gap-4">
        <Button 
          onClick={() => router.push('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Kembali ke Beranda
        </Button>
        <Button 
          variant="outline" 
          onClick={() => router.reload()}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
