import '@/styles/global.scss';
import type { AppProps } from 'next/app';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
