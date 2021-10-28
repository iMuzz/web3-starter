import Davatar from '@davatar/react'

interface IProps {
  address: string
  balance: string
  ensName: string | null
}

const AddressPill: React.FC<IProps> = ({ address, balance, ensName }) => {
  const splitAddress = address?.substr(0, 6) + `....` + address?.substr(address.length - 5, address.length - 1)

  return (
    <div className="flex items-center bg-gray-100 rounded-full border border-solid border-gray-200">
      <div className="px-3 py-1 font-medium">{balance} ETH</div>
      <div className="pl-3 px-1 py-1 flex items-center text-sm font-medium bg-white text-black rounded-full border border-solid border-gray-200">
        {ensName !== null ? ensName : splitAddress}
        <div className="ml-2">
          <Davatar
            size={25}
            address={address}
            generatedAvatarType="jazzicon" // optional, 'jazzicon' or 'blockies'
          />
        </div>
      </div>
    </div>
  )
}

export default AddressPill
