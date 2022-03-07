import DarkModeToggle from './darkModeToggle'
// import Emoji from '../util/emoji'
import ConnectWallet from './connectWallet'
import Link from 'next/link'
// import { NetworkSwitcher } from '../networkSwitcher'
import { useAccount } from 'wagmi'

interface IProps {
  displayConnectButton?: boolean
  isDarkModeToggleVisible?: boolean
  // isNetworkSwitcherVisible?: boolean
}

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Navbar = ({
  isDarkModeToggleVisible = false,
  displayConnectButton = true,
}: // isNetworkSwitcherVisible = true,
IProps) => {
  // const [{ data: accountData }] = useAccount()

  return (
    <nav className="flex justify-between w-full py-8">
      {/* Logo */}
      <div className="ml-1 transition duration-200 transform hover:rotate-20">
        <Link href="/">
          <a>{/* <Emoji className="text-4xl cursor-pointer " label="logo" symbol="🧑🏻‍🎨" /> */}</a>
        </Link>
      </div>

      {/* Connect to web3, dark mode toggle */}
      <div className="flex items-center space-x-2">
        {isDarkModeToggleVisible && <DarkModeToggle />}
        {/* {accountData && isNetworkSwitcherVisible && <NetworkSwitcher />} */}
        {displayConnectButton && <ConnectWallet />}
      </div>
    </nav>
  )
}

export default Navbar
