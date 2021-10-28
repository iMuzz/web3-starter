## How to Setup Development Environment

#### A. Start the local hardhat ethereum node

```bash
npx hardhat node
```

#### B. In a seperate shell, start the NextJS Server.

```bash
yarn && yarn dev
```

Navigate to `http://localhost:3000` to see your app.

## First Time Project Template Setup

#### 1. Create a `.env` file.

```bash
# Private key used for testnets (ropsten)
ETH_PRIVATE_KEY=""

# This is the private key you will used to deploy to mainnet
ETH_MAINNET_PRIVATE_KEY=""

# This API Key is used for Etherscan contract verifications
# To obtain the API Key go here -> https://etherscan.io/apis
ETHERSCAN_API_KEY=""

# This is the address of the contract that will be used in production
# You'll neeed to set it here, and in Vercel (or wherever you choose
# to deploy the app.)
NEXT_PUBLIC_CONTRACT_ADDRESS=""

# Name of the network contract is deployed on
NEXT_PUBLIC_NETWORK_NAME=""

# This API is needed when you run `npx hardhat test` -- so that
# you can approximate the cost of deployin your contract on mainnet
COIN_MARKETCAP_API_KEY=""
```

## Resources

#### Frontend

- **[Tailwind UI](https://tailwindcss.com/docs)**
- **[Tailwind UI Components](https://tailwindui.com/)**
- **[Tailwind Community Components](https://tailwindcomponents.com/)**
