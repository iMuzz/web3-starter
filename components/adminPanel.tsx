import { useEffect, useState } from 'react'
import { usePrepareContractWrite, useContractWrite, useContractRead } from 'wagmi'

import Button from './button'
import SquidArena from '../artifacts/contracts/SquidArena.sol/SquidArena.json'

const AdminPanel = () => {
  const [isPaused, setPaused] = useState<any>()

  const { data, isError, isLoading } = useContractRead({
    addressOrName: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    contractInterface: SquidArena.abi,
    functionName: 'paused',
    watch: true,
  })

  useEffect(() => {
    setPaused(data)
  }, [data])

  const { config } = usePrepareContractWrite({
    addressOrName: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    contractInterface: SquidArena.abi,
    functionName: 'pause',
    args: [!isPaused],
  })

  const { write } = useContractWrite(config)

  return (
    <div className="bg-white overflow-hidden border border-solid border-gray-100 shadow rounded-lg max-w-md m-auto">
      <div className="sm:p-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Contract Interactions Panel</h3>
        <div className="sm:grid sm:grid-cols-2 sm:gap-4 sm:items-start sm:pt-3">
          <Button classOverrides="w-full" onClick={() => write?.()}>
            {isPaused ? <>Unpause</> : <>Pause</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
