import '@/styles/global.scss'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/shared/layout'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ClientOnly from '@/components/common/client-only'
import ErrorBoundary from '@/components/common/error-boundary'

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Check if we're on a POS page
  const isPosPage = router.pathname.startsWith('/pos');

  useEffect(() => {
    // Set a timeout to ensure the app renders properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    // Handle route changes
    const handleRouteChange = () => {
      // Force a reflow on route change
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      clearTimeout(timer);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  // Simple loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ClientOnly fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      }>
        {isPosPage ? (
          // Render POS pages without the shared Layout
          <>
            <Component {...pageProps} />
            <Toaster position="top-right" />
          </>
        ) : (
          // Render other pages with the shared Layout
          <Layout>
            <Component {...pageProps} />
            <Toaster position="top-right" />
          </Layout>
        )}
      </ClientOnly>
    </ErrorBoundary>
  )
}
