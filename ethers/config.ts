// Next.js detects if deployed on vercel, or running locally
const IS_PROD = process.env.NODE_ENV === 'production'

// Retrieve the name of the network the contract is deployed on
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME

// Hard-coded contract addresses so easy to change in development
const DEV_CONTRACT_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9'

// Address of the contract is fetched from env vars in production, but hard-coded when in development
export const CONTRACT_ADDRESS = IS_PROD ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS : DEV_CONTRACT_ADDRESS
