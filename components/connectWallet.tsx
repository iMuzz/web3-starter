import { useAccount, useBalance } from 'wagmi'
import Davatar from '@davatar/react'
import { useState } from 'react'
import { LogoutIcon } from '@heroicons/react/solid'
import ConnectWalletModal from './connectWalletModal'
import Button from './button'

const ConnectWallet = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const [{ data }] = useBalance({
    addressOrName: accountData?.address,
    formatUnits: 'ether',
  })
  const [connectModalIsOpen, setConnectModalIsOpen] = useState(false)

  if (accountData) {
    const splitAddress =
      accountData.address?.substr(0, 6) +
      `....` +
      accountData.address?.substr(accountData.address.length - 5, accountData.address.length - 1)
    return (
      <>
        <div className="flex justify-center">
          <div className="inline-flex items-center mr-2 bg-gray-100 border border-gray-200 border-solid rounded-full dark:text-black">
            <div className="px-2 py-0 overflow-hidden text-xs font-medium md:px-3 md:py-1 md:text-sm whitespace-nowrap overflow-ellipsis">
              {parseFloat(data?.formatted || '').toFixed(2)} {data?.symbol}
            </div>
            <div className="flex items-center py-1 pl-2 text-xs font-medium text-black bg-white border border-gray-200 border-solid rounded-full md:pl-3 md:px-1 md:text-sm">
              {accountData.ens?.name ? accountData.ens?.name : splitAddress}
              <div className="mx-1 md:ml-2">
                <Davatar
                  size={20}
                  address={accountData.address}
                  generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
                />
              </div>
            </div>
          </div>
          <Button
            type="button"
            className="inline-flex items-center p-2 text-white transition-all duration-200 bg-white border border-gray-200 border-solid rounded-md shadow-sm hover:bg-gray-100"
            onClick={disconnect}
          >
            <LogoutIcon fill="#000000" className="w-4 h-4" />
          </Button>
        </div>
      </>
    )
  }
  return (
    <div>
      <Button bgColor="blue-500" darkBgColor="blue-500" onClick={() => setConnectModalIsOpen(true)}>
        Connect Wallet
      </Button>
      <ConnectWalletModal setIsOpen={setConnectModalIsOpen} isOpen={connectModalIsOpen} />
    </div>
  )
}
export default ConnectWallet
