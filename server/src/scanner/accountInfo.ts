console.log(" ... ACCOUNT HEALTH INFO !!! .... ");
require("dotenv").config();
import { ethers } from "ethers";
import Queue from "bull";
import { AccountInfo__factory } from "./typechain";
import { dbSaveAccountSnapshotByBlockNumberBulk, getMarketEnteredAccountData } from "./db";
import { formatUnits } from "ethers/lib/utils";


const ACCOUNT_INFO_QUEUE = new Queue("account:nfo");
const ACCOUNT_INFO_KEEPALIVE = new Queue("accountinfo:keepalive");
// const ACCOUNT_INFO_DB_QUEE = new Queue("account_info_db")

const RPC_HOST = process.env.RPC_HTTP;
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const ACCOUNT_INFO_ADDRESS = "0x71BdD2FF5f6aaC9bae395aec148762349A44b6D5";

const accountInfoContract = AccountInfo__factory.connect(ACCOUNT_INFO_ADDRESS, provider);


// Define Values for bulk insert 
let values: any = [];
// Define Total count rows ? 


(async () => {
  console.log("START ACCOUNT INFO SCANNER ...");
  
  ACCOUNT_INFO_QUEUE.empty();
  ACCOUNT_INFO_KEEPALIVE.empty();
  
  // At every 3rd minute. https://crontab.guru/#5_*_*_*_* 
  // Evrt 1 hour at “At minute 5.
  ACCOUNT_INFO_KEEPALIVE.add({ provider: provider }, { repeat: { cron: "5 * * * *" } });

  // await fetchAccountInfos()
})();


ACCOUNT_INFO_KEEPALIVE.process(async job => {
  let blockNumber = await provider.getBlockNumber();
  console.log(`JOB: Account Info fetcher`);
  console.log(`Current BlockNumber : ", ${blockNumber}`);
  await fetchAccountInfos()
  console.log(`---`);
});

export async function fetchAccountInfos(): Promise<Number> {
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
  // const rows = await getUnderWaterAccounts();

  console.log("Rows : ", rows?.length);
  rows?.map((row, key) => {
    ACCOUNT_INFO_QUEUE.add({ account: row.account, blockNumber: blockNumber });
  });
}

///////// QUEUE //////////

ACCOUNT_INFO_QUEUE.process(4500, async (job, done) => {
  const { account, blockNumber } = job.data;
  try {
    const { collateral, borrows } = await accountInfoContract.getLiquidity(account);

    values.push( [blockNumber, account, formatUnits(collateral, 18) , formatUnits(borrows, 18 )])

    // console.log(collateral, borrows);
    // TODO: move separate thread 
    // await dbSaveAccountSnapshotByBlockNumber(blockNumber, account, collateral.toString(), borrows.toString());

    // ACCOUNT_INFO_DB_QUEE.add( { blockNumber: blockNumber, account: account,collateral: collateral.toString(), borrows: borrows.toString() } )

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
   done(null, job.data);
});


ACCOUNT_INFO_QUEUE.on("completed", async (job, result) => {
  // console.log("Completed: ", job.data);
  // const { account, blockNumber } = job.data;
  job.remove();
});


/// DB INFO QUEEE . remove after Buclk insert testing 
// ACCOUNT_INFO_QUEUE.on("failed", async (job, error) => {
//   console.log(error.message);
//   job.remove();
// });

// // TODO: Save this job in REDIS !!! 
// ACCOUNT_INFO_DB_QUEE.process(140, async( job, done ) => {
//     const { blockNumber, account, collateral , borrows  } = job.data;
//     await dbSaveAccountSnapshotByBlockNumber(blockNumber, account, collateral, borrows);
//     done(null);
// }); 

// ACCOUNT_INFO_DB_QUEE.on("completed", async (job, result) => {
//   console.log('Completed: ', job.data)
//   job.remove();
// });


/**
 * Montor Redis Jobs
 */
async function queeMonitor() {
  let counter = 0;
  const start = new Date().getTime();
  let t = setInterval(function () {
    ACCOUNT_INFO_QUEUE.getJobCounts()
      .then(function (result) {
        console.log("\r" + "Queue status: ", result);
        const _elapsed = new Date().getTime() - start;
        console.log(`Counter: ", ${counter}, "Running Time : ", ${_elapsed / 1000}s`);
        counter++;
        console.log("----------");

        if (result.active === 0 && counter > 1) {

          console.log("Process Finished !!! FLUSH REDIS DATABASE !!!");
          const elapsed = new Date().getTime() - start;
          console.log(`--> Time elapsed :  ${elapsed / 1000}s`);

          dbSaveAccountSnapshotByBlockNumberBulk(values);

          values = []; // Reset values !!! 
          ACCOUNT_INFO_QUEUE.empty();
          
          clearInterval(t);
          return true;
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, 1000);
}
