/// https://github.com/monosux/ethereum-block-by-date

require("dotenv").config();
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, ethers, providers } from "ethers";
import { Comptroller__factory, CUNI__factory as cToken_factory } from "./types";

const RPC_HOST = process.env.RPC_HTTP;
// const RPC_HOST = "https://eth-mainnet.alchemyapi.io/v2/HWlk4Sy0ek094_wjLN7Ptk9qCH0wFUOl";
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const COMPTORLLER_ADDRESS = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);

async function main() {
  const startBlock = 14955093 - 10;
  const endBlock = 14955093 + 10;

  const borrower = "0xca54c3123c855bceceb0db69B034E45530020F26";

  for (let i = startBlock; i < endBlock; i++) {
    let accountLiquidity = await comptroller.getAccountLiquidity(borrower, {
      blockTag: i,
    });

    let [error, liquidity, shortfall] = accountLiquidity;

    console.log(
      `BlockNumber: ${i} - error: ${error.toString()} | liquidity: ${liquidity.toString()},  shortfall: ${shortfall.toString()}`
    );
  }

  console.log("Finished !!! ");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
