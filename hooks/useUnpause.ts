import { useState } from 'react'
import { useContainer } from 'unstated-next'
import web3UserContainer from './useWeb3User'

const useUnpause = () => {
  const [loading, setLoading] = useState(false)
  let { provider, contract } = useContainer(web3UserContainer)

  async function unpause() {
    setLoading(true)
    if (!provider || !contract) {
      console.log(`provider or contract is unavailable.`)
      return
    }
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)

    try {
      const transaction = await contractWithSigner.pause(false)
      await transaction.wait()
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  return { unpause, data: { loading } }
}

export { useUnpause }
