import React, { useEffect, useState } from 'react'

import { handleAsync, middleEllipses } from '../lib/util'
import ReactSpinnerTimer from './spinner'
import { data } from '../ethers'

// The interval to refresh data in seconds
const REFRESH_INTERFVAL = 5

const ETHERSCAN_LINK = process.env.NEXT_PUBLIC_ETHERSCAN_LINK
const OPENSEA_LINK = process.env.NEXT_PUBLIC_OPENSEA_LINK

/**
 * Navigation bar that enables connect/disconnect from Web3.
 */
const Header = () => {
  const { address, balance, isConnected, connect, disconnect, loading, refetchData, network } = data.useContainer() // Global data store
  const [localLoading, setLocalLoading] = useState(false) // Connect/disconnect loading
  const [isRefresh, setIsRefresh] = useState(false) // Refresh

  async function connectWithLoading() {
    setLocalLoading(true)
    handleAsync(connect, true)
    setLocalLoading(false)
  }

  async function disconnectWithLoading() {
    setLocalLoading(true)
    handleAsync(disconnect)
    setLocalLoading(false)
  }

  async function handleChange() {
    try {
      refetchData()
    } catch (e: any) {}
  }

  async function onTimerClick() {
    try {
      refetchData()
    } catch (e: any) {}
    setIsRefresh(true)
  }

  useEffect(() => {
    if (isRefresh) setIsRefresh(false)
  }, [isRefresh])

  return (
    <header className="flex justify-between w-full mx-8 my-8 ">
      {/* Logo place-holder */}
      <div></div>
      {/* Show the control panel to only the creator */}

      <div className="flex flex-col items-end">
        <div className="flex items-center space-x-2">
          <p>{network?.name === 'unknown' ? 'localhost' : network?.name}</p>
          <p>{isConnected && `${balance?.toString().slice(0, 10)}Ξ`}</p>
          <button onClick={isConnected ? disconnectWithLoading : connectWithLoading}>
            {isConnected ? (
              <div className="overflow-hidden overflow-ellipsis">{address && middleEllipses(address, 10, 5, 5)}</div>
            ) : localLoading || loading ? (
              'Loading...'
            ) : (
              'Connect'
            )}
          </button>
          <div className="timer">
            <ReactSpinnerTimer
              timeInSeconds={REFRESH_INTERFVAL}
              isRefresh={isRefresh}
              onLapInteraction={handleChange}
              onClick={onTimerClick}
            />
          </div>
        </div>

        {/* Etherscan and Opensea links */}
        <div className="flex flex-col absolute space-y-2 right-10 top-20">
          {ETHERSCAN_LINK && (
            <a href={ETHERSCAN_LINK} target="_blank" rel="noreferrer">
              <img src="/etherscan.png" width={30} />
            </a>
          )}
          {OPENSEA_LINK && (
            <a href={OPENSEA_LINK} target="_blank" rel="noreferrer">
              <img src="/opensea.png" width={30} />
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .timer:hover {
          cursor: pointer;
        }
      `}</style>
    </header>
  )
}

export default Header
