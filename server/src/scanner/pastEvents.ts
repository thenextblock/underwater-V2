require("dotenv").config();
import { utils, ethers, BigNumber, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Comptroller__factory, CUNI__factory as cToken_factory } from "./types";
import { storeMarketEnteredAccont } from "./db";
import * as _ from "lodash";
import Queue from "bull";
const ACCOUNT_QUEUE = new Queue("account");

const RPC_HOST = process.env.RPC_HTTP || "";
const RPC_WS = process.env.RPC_WS || "";
const COMPTORLLER_ADDRESS = process.env.COMPTORLLER_ADDRESS || "";

const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
// const wsProvider = new ethers.providers.WebSocketProvider(RPC_WS);

(async () => {
  console.log("Get past Events ....");
  console.log("--------------------");
  console.log("RPC : ", RPC_HOST);
  console.log("Comptorller : ", COMPTORLLER_ADDRESS);
  await getMarketEnteredAccounts();
  await queeMonitor();
})();

export async function getMarketEnteredAccounts() {
  console.log("GET MARKET ENTERED ACCOUNTS  ...");
  const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
  let eventFilter = comptroller.filters.MarketEntered();

  let startBlock = 7710671;
  let paging = 500000;
  let page = 1;

  // 6000000

  let events = await comptroller.queryFilter(
    eventFilter,
    // startBlock + 6000000
    startBlock + paging * page,
    startBlock + paging * page + paging
  );

  let accounts: any = [];
  console.log("All Events : ", events.length);

  events.map(event => {
    let { cToken, account } = event.args;
    ACCOUNT_QUEUE.add({ id: account, blockNumber: event.blockNumber });
  });

  let _accounts: string[] = _.uniq(accounts);
  console.log("Unique Accounts : ", _accounts.length);
}

ACCOUNT_QUEUE.process(100, async (job, done) => {
  const { id, blockNumber } = job.data;
  // console.log(id, blockNumber);
  await storeMarketEnteredAccont(id, blockNumber);
  // const status = await readAndStoreAccountSnapshot(id);
  done(null, job);
});

ACCOUNT_QUEUE.on("completed", async (job, result) => {
  if (result) {
    console.log("Finished ... ", job.data);
  }
  job.remove();
});

async function queeMonitor() {
  let counter = 0;
  const start = new Date().getTime();
  setInterval(function () {
    ACCOUNT_QUEUE.getJobCounts()
      .then(function (result) {
        console.log("\r" + "Queue status: ", result);
        console.log("\r" + "Counter: ", counter, "Running Time : ", (counter * 10) / 60, "Minutes");
        counter++;

        console.log("----------");
        if (result.active === 0 && counter > 2) {
          console.log("Process Finished !!! FLUSH REDIS DATABASE !!!");
          const elapsed = new Date().getTime() - start;
          console.log(`--> Get Pairs Time:  ${elapsed / 1000}s`);
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, 5000);
}
