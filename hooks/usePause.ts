import { useState, useEffect } from 'react'
import { useContainer } from 'unstated-next'
import web3UserContainer from './useWeb3User'

const usePause = () => {
  const [loading, setLoading] = useState(false)
  const [isPaused, setIsPaused] = useState()
  let { provider, contract } = useContainer(web3UserContainer)

  const getPaused = async () => {
    setLoading(true)
    if (!contract) {
      console.log(`provider or contract is unavailable.`)
      return
    } else {
      setIsPaused(await contract.paused())
    }
    setLoading(false)
  }

  useEffect(() => {
    getPaused()
  }, [])

  // Pauses or unpauses the contract given the value
  async function pause(value: boolean) {
    setLoading(true)
    if (!provider || !contract) {
      console.log(`provider or contract is unavailable.`)
      return
    }
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)

    try {
      const transaction = await contractWithSigner.pause(value)
      const response = await transaction.wait()
      await getPaused()
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  return { pause, isPaused, data: { loading } }
}

export { usePause }
