const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Squid Game', function () {
  // it("Should return the new greeting once it's changed", async function () {
  //   const Greeter = await ethers.getContractFactory("Greeter");
  //   const greeter = await Greeter.deploy("Hello, world!");
  //   await greeter.deployed();

  //   expect(await greeter.greet()).to.equal("Hello, world!");

  //   const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

  //   // wait until the transaction is mined
  //   await setGreetingTx.wait();

  //   expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });
  it('Should deploy the contract successfully', async function () {
    const SquidGame = await ethers.getContractFactory('SquidGame')
    const baseURI = 'https://squid-game.vercel.app/'
    const baseTokenURI = baseURI + 'api/token?id='

    const SquidGameRes = await SquidGame.deploy(baseTokenURI)
    await SquidGameRes.deployed()
  })
})
