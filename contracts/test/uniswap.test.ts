import hre, { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect, assert } from "chai";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, providers } from "ethers";

import { Swap__factory, Swap } from "../typechain";

const gasParams = {
  gasLimit: "4000000",
  gasPrice: parseUnits("100", "gwei"),
};

// https://github.com/Netswap/exchange-contracts
// const FACTORY = "0x70f51d68D16e8f9e418441280342BD43AC9Dff9f";
// const UNISWAP_ROUTER = "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56";

// https://github.com/https://github.com/Tethys-Finance/tethys-contracts-Finance/tethys-contracts
const FACTORY = "0x2cdfb20205701ff01689461610c9f321d1d00f80";
const UNISWAP_ROUTER = "0x81b9FA50D5f5155Ee17817C21702C3AE4780AD09";

describe("::: UNISWAP TEST ", function () {
  it("Should swap between pairs", async function () {
    const [deployer, userA, userB, userC] = await ethers.getSigners();
    console.log("Block Number : ", await ethers.provider.getBlockNumber());
    console.log("Deployer : ", deployer.address);

    const swap = await new Swap__factory(deployer).deploy(
      FACTORY,
      UNISWAP_ROUTER
    );
    await swap.deployed();
    console.log("uniswap Contract address ; ", swap.address);

    const token0 = "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"; // METIS
    const token1 = "0xEA32A96608495e54156Ae48931A7c20f0dcc1a21"; // mUSDC

    const amount0 = parseUnits("259", 18);
    const amount1 = parseUnits("0", 18);

    await swap.startArbitrage(token0, token1, amount0, amount1);

    assert(true);
  });
});
