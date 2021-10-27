import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import type { AppProps } from 'next/app'

import EthersProvider from '../ethers'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EthersProvider>
      <div>
        <Component {...pageProps} />
        <style jsx global>{`
          body {
            background: black;
            color: white;
          }
        `}</style>
      </div>
    </EthersProvider>
  )
}
export default MyApp
