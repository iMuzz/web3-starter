// `npx hardhat run <script>`
const hre = require('hardhat')

async function main() {
  const SquidArena = await hre.ethers.getContractFactory('SquidArena')
  const baseURI = 'https://squid-game.vercel.app/'
  const baseTokenURI = baseURI + 'api/token?id='
  const SquidArenaRes = await SquidArena.deploy(baseTokenURI)

  ;('https://squid-game.vercel.app/api/token?id=')
  await SquidArenaRes.deployed()
  console.log('Squid Arena Contract deployed to:', SquidArenaRes.address)

  console.log(`\n To Verify your contract on Etherscan run the following command:

  > npx hardhat verify --network kovan ${SquidArenaRes.address} \'${baseTokenURI}\'
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
