import hre, { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect, assert } from "chai";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, providers } from "ethers";

import { MyV2FlashLoan__factory, MyV2FlashLoan } from "../typechain";

const gasParams = {
  gasLimit: "4000000",
  gasPrice: parseUnits("100", "gwei"),
};

const lendingPoolAddressProvider = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";

describe("Flashloan", function () {
  it("Should call flashloan succesfully", async function () {
    console.log("Start Flashloan .... ");
    const [deployer, userA, userB, userC] = await ethers.getSigners();

    console.log("Block Number : ", await ethers.provider.getBlockNumber());

    console.log("Deployer : ", deployer.address);

    const flashloanContract = await new MyV2FlashLoan__factory(deployer).deploy(
      lendingPoolAddressProvider
    );
    await flashloanContract.deployed();
    console.log("Flashloan Contract address ; ", flashloanContract.address);

    const _borrower = "0x31c4d313b237a7e78ff610173f56fc5cd1d6aab6";
    const _repayAmount = parseUnits("500", 6);
    const _cTokenRepay = "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9"; // cUSDT;
    const _cTokenCollateral = "0xccf4429db6322d5c611ee964527d42e5d685dd6a"; // cWBTC;

    console.log("repay amounT : ", _repayAmount.toString());

    await flashloanContract.myFlashLoanCall(
      _borrower,
      _repayAmount,
      _cTokenRepay,
      _cTokenCollateral
    );

    assert(true);
  });
});
