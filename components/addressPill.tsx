import Davatar from '@davatar/react'

interface IProps {
  address: string
  balance: string
  ensName: string | null
}

const AddressPill: React.FC<IProps> = ({ address, balance, ensName }) => {
  const splitAddress = address?.substr(0, 6) + `....` + address?.substr(address.length - 5, address.length - 1)

  return (
    <div className="inline-flex dark:text-black items-center bg-gray-100 rounded-full border border-solid border-gray-200">
      <div className="px-2 md:px-3 py-0 md:py-1 text-xs md:text-sm whitespace-nowrap overflow-hidden overflow-ellipsis	 font-medium">
        {balance} ETH
      </div>
      <div className="pl-2 md:pl-3 md:px-1 py-1 flex items-center text-xs md:text-sm font-medium bg-white text-black rounded-full border border-solid border-gray-200">
        {ensName !== null ? ensName : splitAddress}
        <div className="mx-1 md:ml-2">
          <Davatar
            size={20}
            address={address}
            generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
          />
        </div>
      </div>
    </div>
  )
}

export default AddressPill
