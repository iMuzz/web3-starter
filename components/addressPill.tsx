import { utils } from 'ethers'

interface IProps {
  address: string | null
  balance: number
}

const AddressPill: React.FC<IProps> = ({ address, balance }) => {
  const { formatUnits } = utils
  const splitAddress = address?.substr(0, 6) + `....` + address?.substr(address.length - 5, address.length - 1)
  const parsedEth = parseFloat(formatUnits(balance)).toFixed(3)
  return (
    <div className="flex items-center bg-gray-100 rounded-full border border-solid border-gray-200">
      <div className="px-3 py-1 font-medium">{parsedEth} ETH</div>
      <div className="px-3 py-1 text-sm font-medium bg-white text-black rounded-full border border-solid border-gray-200">
        {splitAddress}
      </div>
    </div>
  )
}

export default AddressPill
