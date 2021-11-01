import { useState, useEffect } from 'react'
import { useContainer } from 'unstated-next'
import web3UserContainer from './useWeb3User'
import { toast } from 'react-hot-toast'
import { ExternalLinkIcon } from '@heroicons/react/solid'

const usePause = () => {
  const [loading, setLoading] = useState(false)
  const [isPaused, setIsPaused] = useState()
  let { provider, contract } = useContainer(web3UserContainer)

  const getPaused = async () => {
    setLoading(true)
    // TODO: Error handling for contract state fetches
    try {
      if (!contract) {
        console.log(`provider or contract is unavailable.`)
        return
      } else {
        setIsPaused(await contract.paused())
      }
    } catch (error: any) {
      console.log({ error })
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
      const { hash } = transaction
      const transactionEtherscanUrl = `https://kovan.etherscan.io/tx/${hash}`

      // Toast based on whether the contract is successfully submitted
      await toast.promise(transaction.wait(), {
        loading: (
          <span className="flex items-center space-x-4">
            Transaction submitted{' '}
            <a className="ml-2 font-bold inline-block" target="_blank" rel="noreferrer" href={transactionEtherscanUrl}>
              <ExternalLinkIcon fill="#000000" className="h-4 w-4" />
            </a>
          </span>
        ),
        success: (
          <span className="flex items-center space-x-4">
            Transaction confirmed{' '}
            <a className="ml-2 font-bold inline-block" target="_blank" rel="noreferrer" href={transactionEtherscanUrl}>
              <ExternalLinkIcon fill="#000000" className="h-4 w-4" />
            </a>
          </span>
        ),
        error: 'Error submitting transaction',
      })

      const response = await transaction.wait()

      // wait() returns null if the transaction has not been mined
      if (response === null) toast.error('Transaction has not been mined')

      // Refetch the paused() state on the contract
      await getPaused()
    } catch (e: any) {
      toast.error(`An error occurred:\n${e.message}`)
      console.log(e)
      setLoading(false)
    }
  }

  return { pause, isPaused, data: { loading } }
}

export { usePause }
