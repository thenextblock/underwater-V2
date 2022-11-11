require("dotenv").config();
import { ethers } from "ethers";
import { storeMarketEnteredAccont } from "./db";
import * as _ from "lodash";
import Queue from "bull";
import { getBorrowdAccountsFromGraph } from "./index";

const DB_ACCOUNT_KEEPALIVE_QUEUE = new Queue("db_account_keepalive");
const DB_ACCOUNT_QUEUE = new Queue("db_account");

const RPC_HOST = process.env.RPC_HTTP || "";
const RPC_WS = process.env.RPC_WS || "";
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
/*
    On Intialisation , we just setip data fetching scheduler and starting fetchin new accounts
*/

(async () => {
  console.log("THIS IS ACCOUNT FETCHER SCHEDULER JOB");
  fetchNewAccounts()
//   DB_ACCOUNT_KEEPALIVE_QUEUE.add({ provider: provider }, { repeat: { cron: "*/59 * * * *" } });
})();

DB_ACCOUNT_KEEPALIVE_QUEUE.process(async job => {
  console.log("Hi I'm scheduler job ... fetching new accounts from graph !!!");
  fetchNewAccounts()
  console.log(`--------------------------------------------------------`);
});


async function fetchNewAccounts() {
    let blockNumber = await provider.getBlockNumber();
    let borrowdAccounts = await getBorrowdAccountsFromGraph()  
    borrowdAccounts.map( acc => {
        DB_ACCOUNT_QUEUE.add({
            account: acc.id,
            blockNumber: blockNumber
        });
    })

    await queeMonitor();
}

// I just set 50 concurent connections to avoid bottolnek for other proccesses
DB_ACCOUNT_QUEUE.process(50, async (job, done) => {
  const { account, blockNumber } = job.data;
  await storeMarketEnteredAccont(account, blockNumber);
  done(null, job);
});

DB_ACCOUNT_QUEUE.on("completed", async (job, result) => {
    console.log("COMPLETED JOB: ", job);
    console.log("COMPLETED RESULT: ", result);
    if (result) {
        console.log("Finished ... ", job.data);
    }
    job.remove();
});

async function queeMonitor() {
  let counter = 0;
  const start = new Date().getTime();
  setInterval(function () {
    DB_ACCOUNT_QUEUE.getJobCounts()
      .then(function (result) {
        console.log("\r" + "Queue status: ", result);
        console.log("\r" + "Counter: ", counter, "Running Time : ", (counter * 10) / 60, "Minutes");
        counter++;

        console.log("----------");
        if (result.active === 0 && counter > 2) {
          console.log("PROCESS FINISHED .... ");
          const elapsed = new Date().getTime() - start;
          console.log(`--> Get new accounts scheduler :  ${elapsed / 1000}s`);
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, 5000);
}

