require("dotenv").config();
import { utils, ethers, BigNumber, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { queryAccounts } from "./graph/index";
import { Comptroller__factory, CUNI__factory as cToken_factory } from "./types";

const RPC_HOST = process.env.RPC_HTTP;
const PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
const COMPTORLLER_ADDRESS = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);

(async () => {
  console.log("START LIQUIDATION ...");
  let signer: Signer;
  if (PRIVATE_KEY) {
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log("address: ", await signer.getAddress());

    const amt = parseUnits("4591204423000000000000", 0);
    console.log(amt.div(2).toString());

    const cTokenAddress = "0x39AA39c021dfbaE8faC545936693aC917d5E7563"; // cUSDC
    const borrower = "0x2be7a29b871af04ee8897a6252daf6b365762429";
    const repayAmount = amt.div(2);
    const cTokenCollateral = "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643";

    const cTokenContract = cToken_factory.connect(cTokenAddress, provider);
    console.log(" Symbol : ", await cTokenContract.symbol());
    await cTokenContract.connect(signer).liquidateBorrow(borrower, repayAmount, cTokenCollateral);
  }
})();
