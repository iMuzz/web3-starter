import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

import { Button } from '../components/button'
import { data } from '../ethers'
import { middleEllipses, handleAsync } from '../lib/util'

const ControlPanel = () => {
  const {
    startBurn,
    claimCreatorReward,
    claimWinnerReward,
    unpause,
    showRandomNumber,
    isConnected,
    paused,
    burnSupply,
  } = data.useContainer()

  const [show, setShow] = useState(false)

  if (!isConnected) return <></>

  const showRandNumber = async () => {
    const randomResult = await handleAsync(showRandomNumber)
    toast(`Random number: ${middleEllipses(randomResult.toString(), 10, 5, 5)}`)
    console.log({ randomResult: randomResult.toString() })
  }

  return (
    <div className="flex flex-col space-y-2 justify-center z-10 p-4 border-2 border-gray-700 rounded-lg bg-gray-800 w-56">
      {/* <div className="text-center mb-2 text-gray-800">Control Panel</div> */}
      <Button onClick={() => setShow(!show)}>Control Panel</Button>
      {show && (
        <>
          <Button onClick={() => handleAsync(startBurn)}>1. Start Burn</Button>
          <Button onClick={() => handleAsync(burnSupply)}>2. Burn Supply</Button>
          <Button disabled={!paused} onClick={() => handleAsync(unpause)}>
            Unpause
          </Button>
          <Button onClick={() => handleAsync(claimCreatorReward)}>Claim Creator Reward</Button>
          <Button onClick={() => handleAsync(claimWinnerReward)}>Claim Winner Reward</Button>
          <Button onClick={() => handleAsync(showRandNumber)}>Fetch Random Number</Button>
        </>
      )}
    </div>
  )
}

export default ControlPanel
