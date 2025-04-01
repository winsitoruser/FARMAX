import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add fallback script to detect and handle white screen issues */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Detect and fix white blank page issues
            (function() {
              function checkForContent() {
                // If the page appears to be blank (no visible content)
                if (document.body && !document.body.firstElementChild) {
                  console.log('Detected possible white blank page, attempting to fix...');
                  
                  // Force a reload after a short delay
                  setTimeout(function() {
                    window.location.reload();
                  }, 500);
                }
              }
              
              // Check soon after page load
              setTimeout(checkForContent, 1000);
              
              // Also check if page appears blank after 3 seconds
              setTimeout(function() {
                if (document.body && document.body.scrollHeight < 100) {
                  console.log('Page content seems minimal, forcing reload...');
                  window.location.reload();
                }
              }, 3000);
            })();
          `
        }} />
      </Head>
      <body className='bg-slate-100 scroll-smooth'>
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Additional fix for white blank pages
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(function() {
                // If no visible content is rendered after 2 seconds
                if (document.body.scrollHeight < 100) {
                  console.log('No visible content detected, forcing reload');
                  window.location.reload();
                }
              }, 2000);
            });
          `
        }} />
      </body>
    </Html>
  )
}
