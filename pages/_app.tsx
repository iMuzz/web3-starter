import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'

import { ThemeProvider } from 'next-themes'
import { UseWalletProvider } from 'use-wallet'
import Web3UserProvider from '../hooks/web3UserProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <UseWalletProvider>
          <Web3UserProvider>
            <Component {...pageProps} />
          </Web3UserProvider>
        </UseWalletProvider>
      </div>
    </ThemeProvider>
  )
}
export default MyApp
