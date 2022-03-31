import hre, { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect, assert } from "chai";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, providers } from "ethers";
import {
  CompoundLoan__factory,
  CompoundLoan,
  CTokenInterface__factory,
  CTokenInterface,
} from "../typechain";

const gasParams = {
  gasLimit: "4000000",
  gasPrice: parseUnits("100", "gwei"),
};

const COMPTROLLER = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";
let cTokens = new Map<string, string>([
  ["cAAVE", "0xe65cdb6479bac1e22340e4e755fae7e509ecd06c"],
  ["cDAI", "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"],
  ["cETH", "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"],
  ["cUSDC", "0x39aa39c021dfbae8fac545936693ac917d5e7563"],
  ["cUSDT", "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9"],
]);

describe("Compound", function () {
  it("Should call flashloan succesfully", async function () {
    console.log("Start Compound test .... ");
    const [deployer, userA, userB, userC] = await ethers.getSigners();
    console.log("Block Number : ", await ethers.provider.getBlockNumber());
    console.log("Deployer : ", deployer.address);

    const compound = await new CompoundLoan__factory(deployer).deploy(
      COMPTROLLER
    );
    await compound.deployed();
    console.log("Contract address ; ", compound.address);

    const cETHAddress = cTokens.get("cETH") || "";
    await compound.enterMarkets([cETHAddress], {
      value: parseUnits("100", 18),
    });

    console.log(
      "CURRENT cToken BALANCE: ",
      formatUnits(await compound.getContractCTokenBalance(cETHAddress), 8)
    );

    const _borrower = "0x8a43fad47ab354c98a136b234bada4163a255f62";
    const _cTokenColllateral = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5"; // cETH; 0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5
    const _cTokenRepay = "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9"; // , cUSDT;
    const _repayAmount = parseUnits("1000", 6);

    let tx = await compound.liquidate(
      _borrower,
      _cTokenRepay,
      _repayAmount,
      _cTokenColllateral
    );

    let result = await tx.wait(1);
    // console.log(result.logs);

    const iface = new ethers.utils.Interface(CTokenInterface__factory.abi);
    const log0 = iface.parseLog(result.logs[0]);

    console.log(log0);
    console.log("--------------------------------");
    const log1 = iface.parseLog(result.logs[result.logs.length - 1]);
    console.log(log1);

    assert(true);
  });
});
