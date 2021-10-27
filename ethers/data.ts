import { useEffect, useState } from 'react'
import { ethers, Contract, BigNumber } from 'ethers'
import { Web3Provider, JsonRpcProvider, BaseProvider } from '@ethersproject/providers'
import { createContainer } from 'unstated-next' // Unstated containerization
import { Network } from '@ethersproject/networks'

import SquidArena from '../artifacts/contracts/SquidArena.sol/SquidArena.json'
import { CONTRACT_ADDRESS, NETWORK_NAME } from './config'

// Removes window.ethereum linting errors
declare let window: any

interface IToken {
  id: number // ID for this token
  tokenURI: string // The tokenURI
  metadata: any // The metadata
}

export enum GameState {
  PREMINT = 0,
  MINT = 1,
  STARTED = 2,
  FINISHED = 3,
}

/**
 * This context is the single interface with everything ethers.js
 * This provides the state of the data in the smart contract at CONTRACT_ADDRESS.
 * @returns
 */
function useData() {
  // Provider and contract state
  const [provider, setProvider] = useState<Web3Provider | JsonRpcProvider | null>(null) // Ethers provider
  const [contract, setContract] = useState<Contract | null>(null) // Token contract

  // User-specific state
  const [ownedTokens, setOwnedTokens] = useState<IToken[]>([]) // The tokens owned by the current user
  const [address, setAddress] = useState<string>() // Current user address
  const [balance, setBalance] = useState<string>() // Current user ether balance
  const [loading, setLoading] = useState<boolean>() // Loading state

  // Game-specific state
  const [mintPrice, setMintPrice] = useState<number>() // Cost to mint an NFT in Ether
  const [currentRound, setCurrentRound] = useState<number>() // Current round
  const [totalRounds, setTotalRounds] = useState<number>() // Total rounds
  const [winnerAddress, setWinnerAddress] = useState<string>() // The winner of the game
  const [gameState, setGameState] = useState<GameState>() // The current state of the game as index of enum
  const [totalSupply, setTotalSupply] = useState<number>() // The number of tokens in supply (not burned)
  const [currentBurn, setCurrentBurn] = useState<number>() // The number of burns that have been requested so far
  const [creatorCut, setCreatorCut] = useState<number>() // The percentage of the pot that the creator will earn

  // Contract-specific state
  const [mintedSupply, setMintedSupply] = useState<number>() // Number of currently minted tokens
  const [maxSupply, setMaxSupply] = useState<number>() // Maximum number of tokens to be minted
  const [creatorAddress, setCreatorAddress] = useState<string>() // Address of the creator of this contract
  const [paused, setPaused] = useState<boolean>() // Paused state of the contract
  const [network, setNetwork] = useState<Network>() // Network of the current provider
  const [etherPrice, setEtherPrice] = useState<number>()

  /**
   * Updates provider in state, generates contract, updates contract in state
   * @param {Object} provider ethers provider
   * @returns ethers contract
   */
  async function updateProvider(provider: Web3Provider | JsonRpcProvider | BaseProvider) {
    // TODO: FIX THIS!!!!!!!!!!!!!!!!
    // @ts-ignore
    setProvider(provider) // Update provider
    setNetwork(await provider?.getNetwork())

    if (!CONTRACT_ADDRESS) return console.error('Could not find contract address')
    // Create contract
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      SquidArena.abi,
      provider, // With local provider
    )
    setContract(contract)
    return contract
  }

  /**
   * Connects to wallet through a Web3Provider and returns the signer when finished
   */
  async function connect(requestAccounts?: boolean) {
    if (requestAccounts) await window.ethereum.request({ method: 'eth_requestAccounts' })
    // Collect and store provider from window
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    updateProvider(provider)
    // Collect and store address
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setAddress(address)

    const etherBalance = ethers.utils.formatEther(await signer.getBalance())
    setBalance(ethers.utils.commify(etherBalance))
    return signer
  }

  function getDefaultProvider() {
    return ethers.getDefaultProvider(NETWORK_NAME)
  }

  /**
   * Disconnects from a wallet
   */
  async function disconnect() {
    // Collect and store default provider via RPC
    // const provider = getDefaultProvider()

    // Nullify address
    setAddress(undefined)
    setBalance(undefined)
  }

  /**
   * Mint new NFT
   * @returns error if any
   */
  async function mint(mintAmount: number) {
    if (!provider || !contract || !mintPrice) return
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    // Calculate value of transaction
    const value = ethers.utils.parseEther((mintAmount * mintPrice).toString())
    // Send mint() to contract
    const tx = await contractWithSigner.mint(address, mintAmount, { value })
    // Wait for a confirmation
    return await tx.wait()
  }

  /**
   * Fetches the metadata for a given token
   * @param tokenURI The tokenURI
   * @returns
   */
  async function getTokenMetadata(tokenURI: string) {
    const resp = await fetch(tokenURI)
    return await resp.json()
  }

  /**
   * Retrieves the balance for the current user
   * @param userAddress optional given address to check balance for
   * @param givenContract
   * @returns
   */
  async function getBalance(userAddress?: string, givenContract?: Contract) {
    const localAddress = userAddress || address
    const localContract = givenContract || contract
    if (!localContract) return

    // Retrieve tokens for user address
    const tokens: BigNumber[] = await localContract.walletOfOwner(localAddress)
    const ownedTokens = await Promise.all(
      tokens.map(async (token) => {
        const tokenURI = await localContract.tokenURI(token)
        const metadata = await getTokenMetadata(tokenURI)
        return {
          id: token.toNumber(),
          tokenURI,
          metadata,
        }
      }),
    )
    setOwnedTokens(() => {
      // Store in localStorage
      const storageKey = `${CONTRACT_ADDRESS}-${localAddress}`
      const storedTokens = window.localStorage.getItem(storageKey)
      if (storedTokens !== null) {
        const parsedTokens = JSON.parse(storedTokens)
        if (parsedTokens.length < ownedTokens.length) {
          window.localStorage.setItem(storageKey, JSON.stringify(ownedTokens))
        }
      } else {
        window.localStorage.setItem(storageKey, JSON.stringify(ownedTokens))
      }
      return ownedTokens
    })

    // Update the current minted supply
    const currentMintedSupply: BigNumber = await localContract.totalMint()
    setMintedSupply(currentMintedSupply.toNumber())

    return tokens
  }

  /**
   * Collect initial data on pageload
   */
  async function initiateData() {
    if (window.ethereum === undefined) return
    try {
      window.ethereum.request({ method: 'eth_requestAccounts' })
      // Setup provider
      const provider = getDefaultProvider()

      const contract = await updateProvider(provider)

      if (!contract) return console.error('Could not instantiate contract')

      // Fetch contract state
      setCreatorAddress(await contract.owner())

      // Fetch game state
      const currentMaxSupply: BigNumber = await contract.MAX_ELEMENTS()
      setMaxSupply(currentMaxSupply.toNumber())
      const mintPrice = await contract.PRICE()
      setMintPrice(parseFloat(ethers.utils.formatEther(mintPrice.toString())))
      setTotalRounds((await contract.NUM_ROUNDS()).toNumber())
      setCreatorCut((await contract.CREATOR_PERCENTAGE()).toNumber() / 100)

      await refetchData(contract)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Fetch on-chain data that might be updated frequently.
   * In our case, the minted/total supply, the current round, and the user's wallet.
   */
  async function refetchData(givenContract?: Contract) {
    setLoading(true)
    const localContract = givenContract || contract
    if (!localContract) {
      setLoading(false)
      return console.error('Unable to refetch data')
    }

    // Fetch game state
    try {
      setPaused(await localContract.paused())
      const currentMintedSupply: BigNumber = await localContract.totalMint()
      setMintedSupply(currentMintedSupply.toNumber())
      setCurrentRound((await localContract.currentRound()).toNumber())
      setGameState(await localContract.gameState())
      setCurrentBurn((await localContract.currentBurn()).toNumber())
      setWinnerAddress(await localContract.winnerAddress())
      setTotalSupply((await localContract.totalSupply()).toNumber())

      // Get ether price
      var provider = new ethers.providers.EtherscanProvider()
      setEtherPrice(await provider.getEtherPrice())

      // Collect contract with signer
      const signer = await connect() // Auto-connect the user
      const address = await signer.getAddress()

      // Fetch user-specific state
      const contractWithSigner = localContract.connect(signer)
      await getBalance(address, contractWithSigner)
    } catch (e) {}
    setLoading(false)
  }

  async function showRandomNumber() {
    if (!contract) return
    return await contract.randomResult()
  }

  async function unpause() {
    if (!provider || !contract) return
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const transaction = await contractWithSigner.pause(false)
    await transaction.wait()
  }

  async function burnSupply() {
    if (!provider || !contract) return
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const transaction = await contractWithSigner.burnSupply()
    await transaction.wait()
  }

  async function startBurn() {
    if (!provider || !contract) return
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const transaction = await contractWithSigner.startBurn()
    return await transaction.wait()
  }

  async function claimCreatorReward() {
    if (!provider || !contract) return
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const transaction = await contractWithSigner.claimCreatorReward()
    return await transaction.wait()
  }

  async function claimWinnerReward() {
    if (!provider || !contract) return
    // Collect contract with signer
    const signer = await provider.getSigner()
    const contractWithSigner = contract.connect(signer)
    const transaction = await contractWithSigner.claimWinnerReward()
    return await transaction.wait()
  }

  // On load, collect required data
  useEffect(() => {
    initiateData()
  }, [])

  return {
    // user-specific
    address,
    ownedTokens,
    isConnected: address !== undefined,
    isTokenHolder: ownedTokens.length > 0,
    isCreator: address === creatorAddress,
    isWinner: address === winnerAddress && winnerAddress !== undefined,
    // contract-specific
    balance,
    mintedSupply,
    maxSupply,
    totalSupply,
    soldOut: mintedSupply === maxSupply,
    mintPrice,
    unpause,
    getBalance,
    mint,
    paused,
    CONTRACT_ADDRESS,
    // game-specific
    currentRound,
    currentBurn,
    winnerPrizeEther:
      mintPrice !== undefined &&
      mintedSupply !== undefined &&
      creatorCut !== undefined &&
      mintPrice * mintedSupply * (1 - creatorCut),
    winnerPrizeDollars:
      etherPrice !== undefined &&
      mintPrice !== undefined &&
      mintedSupply !== undefined &&
      creatorCut !== undefined &&
      mintPrice * mintedSupply * etherPrice * (1 - creatorCut),
    // If these counters are out of sync, it means we've just requested a burn
    isCurrentlyBurning: currentRound !== currentBurn,
    totalRounds,
    startBurn,
    claimCreatorReward,
    claimWinnerReward,
    showRandomNumber,
    burnSupply,
    gameState,
    // connect/disconnect
    connect,
    disconnect,
    // misc
    network,
    refetchData,
    loading,
    etherPrice,
  }
}

// Create data container
const data = createContainer(useData)
// Export container
export default data
