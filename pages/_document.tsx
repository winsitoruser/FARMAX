import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='bg-slate-100 overflow-hidden scroll-smooth focus:scroll-auto'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
