import hre, { ethers, hardhatArguments } from "hardhat";
import { BigNumber } from "ethers";
import { expect, assert } from "chai";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, providers } from "ethers";
import { CEther__factory, Comptroller__factory } from "../typechain";

const gasParams = {
  gasLimit: "4000000",
  gasPrice: parseUnits("100", "gwei"),
};

const COMPTORLLER_ADDRESS = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";

describe.only("::: COMPOUND  TEST ", function () {
  it("Liquidate It !!! ", async function () {
    const [liquidator, userA, userB, userC] = await ethers.getSigners();

    console.log("Deployer: ", await liquidator.getAddress());

    const comptroller = Comptroller__factory.connect(
      COMPTORLLER_ADDRESS,
      liquidator
    );
    console.log("Block Number : ", await ethers.provider.getBlockNumber());
    console.log("Deployer : ", liquidator.address);

    const signerAddress = await liquidator.getAddress();
    console.log("address: ", signerAddress);
    console.log("Oracle address : ", await comptroller.oracle());
    console.log("BlockNumber : ", await ethers.provider.getBlockNumber());
    console.log("------------------------");

    const amountToLiquidate = parseUnits("4067962942", 0);
    console.log("Amount To Liquidate: ", amountToLiquidate.div(2).toString());

    const borrower = "0x27769d8663a157af4d0cdaeb436b54f4a87791fa";
    const repayAmount = amountToLiquidate.div(2);
    const cTokenAddress = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5"; // Borrowed Address

    const cTokenCollateral = "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC";

    const cEthInstance = CEther__factory.connect(cTokenAddress, liquidator);

    let tx = await cEthInstance.liquidateBorrow(borrower, cTokenCollateral, {
      value: repayAmount,
      ...gasParams,
    });

    console.log(tx);
    console.log("-----");

    let response = await tx.wait(1);
    console.log(response);

    assert(true);
  });
});
