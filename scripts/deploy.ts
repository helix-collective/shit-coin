import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import {HelixCollectiveShitCoin, HelixCollectiveShitCoin__factory} from '../typechain'

async function main() {
  // Address which creates the contract
  const [owner] = await ethers.getSigners();

  // Create the transaction to create the contract onto the network
  const HCSC: HelixCollectiveShitCoin = await new HelixCollectiveShitCoin__factory(owner).deploy();

  // Wait for the transaction to be mined. In this case, the contract to
  // be deployed
  await HCSC.deployed();

  console.log('Helix collective shit coin deployed @', HCSC.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
