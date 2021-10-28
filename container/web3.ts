import { useState } from 'react'
import { createContainer } from 'unstated-next'

const useWeb3Connect = (initialState = 0) => {
  let [count, setCount] = useState(initialState)
  let decrement = () => setCount(count - 1)
  let increment = () => setCount(count + 1)
  return { count, decrement, increment }
}

const web3State = createContainer(useWeb3Connect)

export default web3State
