import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'

import { UseWalletProvider } from 'use-wallet'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <UseWalletProvider>
        <Component {...pageProps} />
      </UseWalletProvider>
    </div>
  )
}
export default MyApp
