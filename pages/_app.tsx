import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'

import { UseWalletProvider } from 'use-wallet'
import Web3UserProvider from '../hooks/web3UserProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-white min-h-screen">
      <UseWalletProvider>
        <Web3UserProvider>
          <Component {...pageProps} />
        </Web3UserProvider>
      </UseWalletProvider>
    </div>
  )
}
export default MyApp
