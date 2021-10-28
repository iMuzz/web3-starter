import classnames from 'classnames'
import { utils } from 'ethers'
import { LogoutIcon } from '@heroicons/react/solid'

import useWeb3Container from '../hooks/useWeb3User'
import AddressPill from './addressPill'
import Button from './button'

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = () => {
  const { wallet, ensName } = useWeb3Container.useContainer()
  const { status, reset, networkName, account, balance } = wallet

  const { formatUnits } = utils

  const handleConnect = () => {
    wallet.connect('injected')
  }

  const handleLogout = () => {
    reset()
  }

  const formattedETH = parseFloat(formatUnits(balance)).toFixed(3)

  return (
    <nav className="flex justify-between w-full py-8 ">
      <div className="w-8 h-8 bg-black rounded-full" />
      {status === 'connected' ? (
        <div className="flex items-center space-x-2">
          <span
            className={classnames('inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium', {
              'bg-indigo-100 text-indigo-800': networkName == 'main',
              'bg-yellow-100 text-yellow-800': networkName !== 'main',
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
            {networkName == 'main' ? `Mainnet` : networkName}
          </span>
          <AddressPill address={account ? account : ''} ensName={ensName} balance={formattedETH} />
          <button
            type="button"
            className="transition-all duration-200  inline-flex items-center p-2 rounded-md shadow-sm text-white border border-solid border-gray-200 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogoutIcon fill="#000000" className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <Button onClick={handleConnect}>Connect Wallet</Button>
      )}
    </nav>
  )
}

export default Navbar
