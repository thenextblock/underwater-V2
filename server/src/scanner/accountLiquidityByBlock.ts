/// https://github.com/monosux/ethereum-block-by-date

require("dotenv").config();
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, ethers, providers } from "ethers";
import { Comptroller__factory, CUNI__factory as cToken_factory } from "./types";

const RPC_HOST = process.env.RPC_HTTP;
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const COMPTORLLER_ADDRESS = "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B";
const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);

async function main() {
  const startBlock = 16014219 - 5;
  const endBlock = 16014219 + 5;

  const borrower = "0x0F4dD7d08213a02aEfAF9EbFF4b9A83b13fCd8e2";

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
