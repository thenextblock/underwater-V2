import { utils, ethers } from "ethers";
import { CETH__factory } from "./types/factories/CETH__factory";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const RPC_HOST = process.env.RPC_HTTP;
const CETH_ADDRESS = "0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5";

const account = "0xc3f81edBdb1DA5c065B6466bB07a486221ca267e";

async function main() {
  console.log("Network Address : ", RPC_HOST);
  const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
  const ceth = CETH__factory.connect(CETH_ADDRESS, provider);
  const balance = await ceth.balanceOf(account);
  console.log(`Our Ceth balance is: ${ethers.BigNumber.from(balance).toNumber()}`);

  /**
   * GetAccountSnapshot
   *
   * @notice Get a snapshot of the account's balances, and the cached exchange rate
   * @dev This is used by comptroller to more efficiently perform liquidity checks.
   * @param account Address of the account to snapshot
   * @return (possible error, token balance, borrow balance, exchange rate mantissa)
   */

  let [error, tokenBalance, borrowBalance, exChangeRate] = await ceth.getAccountSnapshot(account);
  // let collateralFactor = await ceth.get

  console.log(`  ---
      Error: ${error.toString()} 
      cToken Balance: ${tokenBalance.toString()} 
      Borrow Balance: ${borrowBalance.toString()} 
      ExChange Rate:  ${exChangeRate.toString()} 
  `);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
