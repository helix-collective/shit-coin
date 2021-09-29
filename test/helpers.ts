import { network, ethers } from "hardhat";
import { BigNumber, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

export async function shouldThrow(p: Promise<any>, matches: RegExp) {
  try {
    await p;
  } catch(e) {
    expect(() => { throw e } ).throws(matches);
    return
  }

  expect.fail("Expected error matching: " + matches.source + " none thrown");
}

export async function mineNBlocks(numBlocks: number) {
  const blocks: Promise<any>[] = [];

  for (let i = 0; i < numBlocks; i++) {
    blocks.push(network.provider.send("evm_mine"));
  }

  return Promise.all(blocks);
}

export function toAtto(n: number): BigNumber {
  return ethers.utils.parseEther(n.toString());
}

export function fromAtto(n: BigNumber): number {
  return Number.parseFloat(ethers.utils.formatUnits(n, 18));
}
