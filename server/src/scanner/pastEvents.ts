require("dotenv").config();
import { utils, ethers, BigNumber, Signer } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Comptroller__factory, CUNI__factory as cToken_factory } from "./types";
import { getMaxBlockNumberFromAccouns, storeMarketEnteredAccont } from "./db";
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
  // await queeMonitor();
})();

export async function getMarketEnteredAccounts() {
  console.log("GET MARKET ENTERED ACCOUNTS  ...");
  console.log("GET latestBlockNumebr From database ... ");

  let latestBlockNumberFromDb = await getMaxBlockNumberFromAccouns();
  console.log("latest Block Number: ", latestBlockNumberFromDb);

  const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
  let eventFilter = comptroller.filters.MarketEntered();

  /*
    // This params we use only w fetching from the scratch ...
    let startBlock = 15953102;
    let paging = 2000000;
    let page = 0;

    let events = await comptroller.queryFilter(
      eventFilter,
      startBlock + paging * page,
      startBlock + paging * page + paging
    );
  */

  let events = await comptroller.queryFilter(
    eventFilter,
    parseInt(latestBlockNumberFromDb) // the name is confusing , this is start Block Number
  );

  console.log(`All Events Count: = ${events.length} since ${latestBlockNumberFromDb}`);

  events.map(event => {
    let { cToken, account } = event.args;
    ACCOUNT_QUEUE.add({ id: account, blockNumber: event.blockNumber });
  });
}

ACCOUNT_QUEUE.process(5, async (job, done) => {
  const { id, blockNumber } = job.data;
  await storeMarketEnteredAccont(id, blockNumber);
  done(null, job.data);
});

ACCOUNT_QUEUE.on("completed", async (job, result) => {
  job.remove();
});

// async function queeMonitor() {
//   let counter = 0;
//   const start = new Date().getTime();
//   let int = setInterval(function () {
//     ACCOUNT_QUEUE.getJobCounts()
//       .then(function (result) {
//         console.log("\r" + "Queue status: ", result);
//         console.log("\r" + "Counter: ", counter, "Running Time : ", (counter * 10) / 60, "Minutes");
//         counter++;

//         console.log("----------");
//         if (result.active === 0 && counter > 2) {
//           console.log("Process Finished !!! FLUSH REDIS DATABASE !!!");
//           const elapsed = new Date().getTime() - start;
//           console.log(`--> Get Pairs Time:  ${elapsed / 1000}s`);
//           clearInterval(int);
//         }
//       })
//       .catch(function () {
//         console.log("Error in finding out the status of the queue");
//       });
//   }, 5000);
// }
