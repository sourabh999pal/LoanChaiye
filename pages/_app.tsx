import React from 'react';
import { AppProps } from 'next/app';
import { NextThemeProvider } from '../client/src/components/NextThemeProvider';
import '../client/src/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextThemeProvider>
      <Component {...pageProps} />
    </NextThemeProvider>
  );
}

export default MyApp;