require("dotenv").config();

import { ethers } from "hardhat";
import { utils, BigNumber, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  Comptroller__factory,
  CErc20__factory,
  CEther__factory,
} from "../typechain";

const RPC_HOST = process.env.RPC_HTTP;
const PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;

const COMPTORLLER_ADDRESS = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);

const gasParams = {
  gasLimit: "600000",
  gasPrice: parseUnits("30", "gwei"),
};

(async () => {
  console.log("... START LIQUIDATION ...");
  let signer: Signer;

  console.log("PRIVATE_KEY: ", PRIVATE_KEY);
  console.log("RPC_HOST: ", RPC_HOST);

  if (PRIVATE_KEY) {
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const signerAddress = await signer.getAddress();
    console.log("address: ", signerAddress);
    console.log("Oracle address : ", await comptroller.oracle());
    console.log("BlockNumber : ", await provider.getBlockNumber());
    console.log("------------------------");

    const amountToLiquidate = parseUnits("1145139292786", 0);
    console.log(amountToLiquidate.div(2).toString());

    const borrower = "0x27769d8663a157af4d0cdaeb436b54f4a87791fa";
    const repayAmount = amountToLiquidate.div(2);
    const cTokenAddress = "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5"; // Borrowed Address
    const cTokenCollateral = "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC";

    const cEthInstance = CEther__factory.connect(cTokenAddress, signer);

    let tx = await cEthInstance.liquidateBorrow(borrower, cTokenCollateral, {
      value: repayAmount,
      ...gasParams,
    });

    console.log(tx);
    console.log("-----");

    let response = await tx.wait(1);
    console.log(response);

    // const cTokenContract = CErc20__factory.connect(cTokenAddress, provider);
    // console.log("Symbol : ", await cTokenContract.symbol());
    // await cTokenContract
    //   .connect(signer)
    //   .liquidateBorrow(borrower, repayAmount, cTokenCollateral, {});
  }
})();
