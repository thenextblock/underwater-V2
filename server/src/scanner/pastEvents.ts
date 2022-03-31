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
})();

export async function getMarketEnteredAccounts() {
  console.log("GET MARKET ENTERED ACCOUNTS  ...");
  const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
  let eventFilter = comptroller.filters.MarketEntered();

  let startBlock = 7710671;
  let paging = 500000;
  let page = 0;

  let events = await comptroller.queryFilter(
    eventFilter,
    startBlock + paging * page,
    startBlock + paging * page + paging
  );

  let accounts: any = [];
  console.log("All Events : ", events.length);

  events.map(event => {
    let { cToken, account } = event.args;
    ACCOUNT_QUEUE.add({ id: account, blockNumber: event.blockNumber });
  });

  // events.map(event => {
  //   let { cToken, account } = event.args;
  //   accounts.push(account);
  // });

  // let _accounts: string[] = _.uniq(accounts);
  // console.log("Unique Accounts : ", _accounts.length);
  // return _accounts;
}

ACCOUNT_QUEUE.process(100, async (job, done) => {
  const { id, blockNumber } = job.data;
  console.log(id, blockNumber);
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
