import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'

import { ThemeProvider } from 'next-themes'
import { UseWalletProvider } from 'use-wallet'
import Web3UserProvider from '../hooks/web3UserProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-white">
        <UseWalletProvider
          connectors={{
            walletconnect: {
              // TODO: support testnet configurations
              // chainId 1 is mainnet
              chainId: 1,
              rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/GBjvplStTQ2x1FiAa5-5Qdyv2_8ZBuwe',
            },
          }}
        >
          <Web3UserProvider>
            <Component {...pageProps} />
          </Web3UserProvider>
        </UseWalletProvider>
      </div>
    </ThemeProvider>
  )
}
export default MyApp
