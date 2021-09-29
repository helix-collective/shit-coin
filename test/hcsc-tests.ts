import { ethers, network } from "hardhat";
import { Signer } from "ethers";
import {HelixCollectiveShitCoin, HelixCollectiveShitCoin__factory} from '../typechain'
import { expect } from "chai";

import { fromAtto, shouldThrow, toAtto } from "./helpers";

describe("ERC20 Token tests", async () => {
  let HCSC: HelixCollectiveShitCoin;
  let owner: Signer
  let ash: Signer
  let amanda: Signer
  const totalSupply = 1000000000;
  const err = /ERC20: transfer amount exceeds balance/
 
  beforeEach(async () => {
    [owner, ash, amanda] = await ethers.getSigners();
    HCSC = await new HelixCollectiveShitCoin__factory(owner).deploy();
  })

  it("Total supply is fixed", async () => {
    expect(fromAtto(await HCSC.totalSupply())).eq(totalSupply);
    await HCSC.transfer(await ash.getAddress(), toAtto(100));
    expect(fromAtto(await HCSC.totalSupply())).eq(totalSupply);
  })

  it("Can transfer between coin holders", async () => {
    await HCSC.transfer(await ash.getAddress(), toAtto(1000));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(1000);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply - 1000);

    await HCSC.connect(ash).transfer(await amanda.getAddress(), toAtto(500));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(500);
    expect(fromAtto(await HCSC.balanceOf(await amanda.getAddress()))).eq(500);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply - 1000);
  })

  it("Can't transfer more than your balance", async () => {
    await shouldThrow(HCSC.connect(ash).transfer(await amanda.getAddress(), toAtto(500)), err);
  })

  it("Can allocate an allowance without the necessary balance. It's only flagged as an error when the spender tries to spend", async () => {
    await HCSC.connect(ash).approve(await amanda.getAddress(), toAtto(500));
    expect(fromAtto(await HCSC.allowance(await ash.getAddress(), await amanda.getAddress()))).eq(500);
    await shouldThrow(HCSC.connect(amanda).transferFrom(await ash.getAddress(), await amanda.getAddress(), toAtto(500)), err);
  })

  it("Can allocate an allowance for another user to spend on your behalf", async () => {
    await HCSC.approve(await ash.getAddress(), toAtto(1000));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(0);
    expect(fromAtto(await HCSC.balanceOf(await amanda.getAddress()))).eq(0);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply);

    await HCSC.connect(ash).transferFrom(await owner.getAddress(), await ash.getAddress(), toAtto(500));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(500);
    expect(fromAtto(await HCSC.balanceOf(await amanda.getAddress()))).eq(0);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply - 500);

    await HCSC.connect(ash).transferFrom(await owner.getAddress(), await amanda.getAddress(), toAtto(500));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(500);
    expect(fromAtto(await HCSC.balanceOf(await amanda.getAddress()))).eq(500);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply - 1000);
  })

  it("balanceOf respects transfers, but doesn't include allowances", async () => {
    // Owner has all coins at the start
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply);
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(0);

    // Check book keeping post transfer
    await HCSC.transfer(await ash.getAddress(), toAtto(100));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(100);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply - 100);

    // Approve spending shouldn't change balances, until coin is pulled by spender
    await HCSC.approve(await ash.getAddress(), toAtto(100));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(100);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply - 100);

    await HCSC.connect(ash).transferFrom(await owner.getAddress(), await amanda.getAddress(), toAtto(100));
    expect(fromAtto(await HCSC.balanceOf(await ash.getAddress()))).eq(100);
    expect(fromAtto(await HCSC.balanceOf(await amanda.getAddress()))).eq(100);
    expect(fromAtto(await HCSC.balanceOf(await owner.getAddress()))).eq(totalSupply - 200);
  })
});
