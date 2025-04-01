import { NextPage } from 'next'
import Error, { ErrorProps } from 'next/error'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { NextPageContext } from 'next'
import { useEffect } from 'react'

interface CustomErrorProps extends ErrorProps {
  hasError?: boolean;
  errorMessage?: string;
}

const ErrorPage: NextPage<CustomErrorProps> = ({ statusCode, hasError, errorMessage }) => {
  const router = useRouter()

  useEffect(() => {
    // Log detailed error information to help with debugging
    console.error('Error page rendered with status code:', statusCode);
    console.error('Current route:', router.pathname);
    console.error('Error message:', errorMessage);
  }, [statusCode, router.pathname, errorMessage]);

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
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {statusCode
          ? `Error ${statusCode}: Terjadi kesalahan pada server`
          : 'Terjadi kesalahan pada aplikasi'}
      </h1>
      <p className="text-lg mb-6 text-gray-600 max-w-md mx-auto">
        Mohon maaf atas ketidaknyamanan ini. Tim kami sedang bekerja untuk memperbaiki masalah ini.
      </p>
      {errorMessage && (
        <div className="bg-red-50 p-4 rounded-md mb-6 max-w-md mx-auto text-left">
          <p className="text-red-700 font-medium">Detail Kesalahan:</p>
          <p className="text-red-600 mt-1">{errorMessage}</p>
        </div>
      )}
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
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404
  const errorMessage = err ? err.message : 'Unknown error occurred'
  
  // Log error details server-side
  if (err) {
    console.error('Server-side error:', err);
  }
  
  return { 
    statusCode: statusCode as number,
    hasError: !!err,
    errorMessage
  }
}

export default ErrorPage
