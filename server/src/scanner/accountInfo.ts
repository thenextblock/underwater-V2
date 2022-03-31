console.log(" ... ACCOUNT INFO !!! .... ");
require("dotenv").config();
import { utils, ethers, BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Comptroller__factory } from "./types";
import { AccountInfo__factory } from "./typechain";
import { getMarketEnteredAccountData } from "./db";

import Queue from "bull";
const ACCOUNT_INFO_QUEUE = new Queue("account_info");
const RPC_HOST = process.env.RPC_HTTP;
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
// const COMPTORLLER_ADDRESS = process.env.COMPTORLLER_ADDRESS || "";
// const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
const ACCOUNT_INFO_ADDRESS = "0x71BdD2FF5f6aaC9bae395aec148762349A44b6D5";

const accountInfoContract = AccountInfo__factory.connect(ACCOUNT_INFO_ADDRESS, provider);

(async () => {
  console.log("START ACCOUNT INFO  SCANNER ...");
  ACCOUNT_INFO_QUEUE.empty();
  await startCompoundScanner();
})();

export async function startCompoundScanner(): Promise<Number> {
  const blockNumber = await provider.getBlockNumber();
  console.log("BlockNumber : ", blockNumber);
  await startScanner(blockNumber);

  queeMonitor();
  return blockNumber;
}

/**
 * Scanner
 */
export async function startScanner(blockNumber: number) {
  const rows = await getMarketEnteredAccountData();
  console.log("Rows : ", rows?.length);
  rows?.map((row, key) => {
    ACCOUNT_INFO_QUEUE.add({ account: row.account, blockNumber: blockNumber });
  });
}

///////// QUEUE //////////
ACCOUNT_INFO_QUEUE.process(400, async (job, done) => {
  const { account, blockNumber } = job.data;
  //   console.log(account, " | ", blockNumber);
  const { collateral, borrows } = await accountInfoContract.getLiquidity(account);
  console.log(collateral, borrows);
  console.log("-----------------------------------");
  done(null);
});

ACCOUNT_INFO_QUEUE.on("completed", async (job, result) => {
  job.remove();
});

ACCOUNT_INFO_QUEUE.on("failed", async (job, error) => {
  console.log(error.message);
  job.remove();
});

/**
 * Montor Redis Jobs
 */
async function queeMonitor() {
  let counter = 0;
  setInterval(function () {
    ACCOUNT_INFO_QUEUE.getJobCounts()
      .then(function (result) {
        console.log("\r" + "Queue status: ", result);
        console.log("\r" + "Counter: ", counter, "Running Time : ", (counter * 10) / 60, "Minutes");
        counter++;

        console.log("----------");
        if (result.active === 0 && counter > 10) {
          console.log("Process Finished !!! FLUSH REDIS DATABASE !!!");
          ACCOUNT_INFO_QUEUE.empty();
          return true;
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, 5000);
}
