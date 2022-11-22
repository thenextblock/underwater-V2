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
const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);

(async () => {
  console.log("Get Past Liquidations Events ....");
  console.log("RPC : ", RPC_HOST);
  console.log("Comptorller : ", COMPTORLLER_ADDRESS);
  //await getMarketEnteredAccounts();

  let markets = await getMarkets();

  // cUSDC
  await getLiquidationLogsByCtoken("0x39AA39c021dfbaE8faC545936693aC917d5E7563");

  //   for (let marketAddress of markets) {
  //     await getLiquidationLogsByCtoken(marketAddress);
  //   }
})();

export async function getLiquidationLogsByCtoken(ctokenAddress: string) {
  const cTokenInstance = cToken_factory.connect(ctokenAddress, provider);
  let eventFilter = cTokenInstance.filters.LiquidateBorrow();

  let blockNumber = 16024540 - 20000;
  let events = await cTokenInstance.queryFilter(eventFilter, blockNumber);
  console.log(
    `All Events ${await cTokenInstance.name()}  Count: = ${events.length} since ${blockNumber} ${ctokenAddress}`
  );

  if (events.length !== 0) {
    console.log(events);
  }
}

async function getMarkets(): Promise<any[]> {
  let cTokens = await comptroller.getAllMarkets();
  console.log("cTokens: ", cTokens.length);
  return cTokens;
}
