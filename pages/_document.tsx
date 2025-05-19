import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Loan Chaiye - Fast and easy loan application portal" />
        <meta name="keywords" content="loan, quick loan, personal loan, business loan, loan application" />
        <meta property="og:title" content="Loan Chaiye - Apply for Loans Online" />
        <meta property="og:description" content="Apply for personal, business, and other loans quickly and easily with our streamlined process." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://loanchaiye.com" />
        <link rel="icon" href="/favicon.ico" />
        <script dangerouslySetInnerHTML={{
          __html: `
          (function() {
            // Get stored theme or use system preference
            const storedTheme = localStorage.getItem('theme') || 'system';
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Set the initial theme
            if (storedTheme === 'dark' || (storedTheme === 'system' && prefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
          `
        }} />
      </Head>
      <body className="min-h-screen bg-background text-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}