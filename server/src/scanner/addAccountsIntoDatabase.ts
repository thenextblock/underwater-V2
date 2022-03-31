// This is a scheduling script loads new borrowd accounts and adds into database
console.log("... ADD ACCOUNTS INTO DATABASE !!! .... ");
require("dotenv").config();
import { queryAccounts } from "./graph/index";
import { storeMarketEnteredAccont } from "./db";
import Queue from "bull";

const ACCOUNTS_QUEUE = new Queue("compound_accounts");
const KEEPALIVE_QUEUE = new Queue("keepalive_accounts");

(async () => {
  console.log("START FETCH BORROWD ACCOUNTS FROM COMPOUND (Scheduler)  ...");
  //   await KEEPALIVE_QUEUE.empty();
  //   await ACCOUNTS_QUEUE.empty();
  //   await startAddingBorroedwdAccounts();

  // At every minute. https://crontab.guru/#*/1_*_*_*_*
  KEEPALIVE_QUEUE.add({ name: "IM A KEEP ALIVE !!! " }, { repeat: { cron: "*/30 * * * *" } });
})();

KEEPALIVE_QUEUE.process(async job => {
  console.log(`Start New Proccess : ${new Date()}`);
  console.log("START ACCOUNT FETCHING ...");
  await startAddingBorroedwdAccounts();
});

/**
 * Satrt Adding Accounts Into Database (Needed for fast fetching)
 */
export async function startAddingBorroedwdAccounts() {
  let accountsCount = 1;
  let page = 0;
  let lastId = "";
  let totaAccounts = 0;

  while (accountsCount !== 0) {
    const res = await queryAccounts(1000, lastId);
    // console.log("Page : ", page, "Fetched : ", res.data.accounts.length);
    accountsCount = res.data.accounts.length;
    totaAccounts += res.data.accounts.length;

    if (accountsCount !== 0) {
      lastId = res.data.accounts[res.data.accounts.length - 1].id;
      res.data.accounts.map((account: any) => {
        ACCOUNTS_QUEUE.add({ account: account });
      });
    }

    // console.log("Fetched : ", totaAccounts);
    // accountsCount = 0; // using for stop // DO NOT FORGET COMMENT !!!
    page += 1;
  }
  console.log("Fetched Total : ", totaAccounts);
}

///////// QUEUE //////////
ACCOUNTS_QUEUE.process(200, async (job, done) => {
  const { account } = job.data;
  //console.log(account.id);
  await storeMarketEnteredAccont(account.id);
  done(null);
});

ACCOUNTS_QUEUE.on("completed", async (job, result) => {
  job.remove();
});

ACCOUNTS_QUEUE.on("failed", async (job, error) => {
  console.log(error.message);
  job.remove();
});

/**
 * Montor Redis Jobs
 */
function queeMonitor() {
  let counter = 0;
  setInterval(function () {
    ACCOUNTS_QUEUE.getJobCounts()
      .then(function (result) {
        console.log("\r" + "Queue status: ", result);
        console.log("\r" + "Counter: ", counter, "Running Time : ", (counter * 10) / 60, "Minutes");
        counter++;

        console.log("----------");
        if (result.active === 0 && counter > 10) {
          console.log("Process Finished !!! EXIT");
          process.exit(0);
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, 5000);
}
