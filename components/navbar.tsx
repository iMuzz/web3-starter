import { useState } from 'react'
import classnames from 'classnames'
import { utils } from 'ethers'
import { LogoutIcon } from '@heroicons/react/solid'

import useWeb3Container from '../hooks/useWeb3User'
import AddressPill from './addressPill'
import Button from './button'
import ConnectModal from './connectWalletModal'

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = () => {
  const { wallet, ensName } = useWeb3Container.useContainer()
  const { status, reset, networkName, account, balance } = wallet
  const [connectModalIsOpen, setConnectModalIsOpen] = useState(false)

  const { formatUnits } = utils

  const handleLogout = () => {
    reset()
  }

  const formattedETH = parseFloat(formatUnits(balance)).toFixed(2)

  return (
    <nav className="flex justify-between w-full px-4 py-8">
      {/* Logo */}
      <div className="w-8 h-8 bg-black rounded-full border dark:border-white text-white flex justify-center items-center text-xs">
        W3
      </div>

      <ConnectModal setIsOpen={setConnectModalIsOpen} isOpen={connectModalIsOpen} />

      {/* Connect to web3, dark mode toggle */}
      <div className="flex items-center space-x-2">
        {status === 'connected' ? (
          <div className="flex items-center space-x-2">
            <span
              className={classnames(
                'inline-flex items-center px-3 py-0.5 rounded-full text-xs md:text-sm font-medium',
                {
                  'bg-indigo-100 text-indigo-800': networkName == 'main',
                  'bg-yellow-100 text-yellow-800': networkName !== 'main',
                },
              )}
            >
              <svg
                className={classnames('-ml-1 mr-1.5 h-2 w-2', {
                  'text-indigo-400': networkName == 'main',
                  'text-yellow-400': networkName !== 'main',
                })}
              >
                <svg
                  className={classnames('-ml-1 mr-1.5 h-2 w-2', {
                    'text-indigo-400': networkName == 'main',
                    'text-yellow-400': networkName !== 'main',
                  })}
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx={4} cy={4} r={3} />
                </svg>
              </svg>
              {networkName == 'main' ? `Mainnet` : networkName}
            </span>
            <AddressPill address={account ? account : ''} ensName={ensName} balance={formattedETH} />
            <Button
              type="button"
              className="transition-all duration-200  inline-flex items-center p-2 rounded-md shadow-sm bg-white text-white border border-solid border-gray-200 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogoutIcon fill="#000000" className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={() => setConnectModalIsOpen(true)}>Connect Wallet</Button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
