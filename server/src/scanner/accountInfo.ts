console.log(" ... ACCOUNT HEALTH INFO !!! .... ");
require("dotenv").config();
import { utils, ethers, BigNumber } from "ethers";
import { AccountInfo__factory } from "./typechain";
import { dbSaveAccountSnapshotByBlockNumber, getMarketEnteredAccountData } from "./db";
import Queue from "bull";

const ACCOUNT_INFO_QUEUE = new Queue("account_info");
const RPC_HOST = process.env.RPC_HTTP;
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const ACCOUNT_INFO_ADDRESS = "0x71BdD2FF5f6aaC9bae395aec148762349A44b6D5";

const accountInfoContract = AccountInfo__factory.connect(ACCOUNT_INFO_ADDRESS, provider);

(async () => {
  console.log("START ACCOUNT INFO SCANNER ...");
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

// 100 , 200
///////// QUEUE //////////
ACCOUNT_INFO_QUEUE.process(450, async (job, done) => {
  const { account, blockNumber } = job.data;
  try {
    const { collateral, borrows } = await accountInfoContract.getLiquidity(account);
    await dbSaveAccountSnapshotByBlockNumber(blockNumber, account, collateral.toString(), borrows.toString());
  } catch (error: any) {
    console.log("Error : ", account);
  }
  // if (borrows.gt(collateral)) {
  //   if (!collateral.isZero()) {
  //     console.log(account, collateral.div(borrows).mul(100).toString(), "%"),
  //       console.log(collateral.toString(), borrows.toString(), borrows.gt(collateral));
  //     console.log("-----------------------------------");
  //   }
  // }
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
  const start = new Date().getTime();
  setInterval(function () {
    ACCOUNT_INFO_QUEUE.getJobCounts()
      .then(function (result) {
        console.log("\r" + "Queue status: ", result);
        console.log("\r" + "Counter: ", counter, "Running Time : ", (counter * 10) / 60, "Minutes");
        counter++;

        console.log("----------");
        if (result.active === 0 && counter > 2) {
          console.log("Process Finished !!! FLUSH REDIS DATABASE !!!");
          const elapsed = new Date().getTime() - start;
          console.log(`--> Get Pairs Time:  ${elapsed / 1000}s`);
          // ACCOUNT_INFO_QUEUE.empty();
          return true;
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, 5000);
}
