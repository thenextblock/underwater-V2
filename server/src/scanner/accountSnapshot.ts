console.log("... START COMPOUND SCANNER !!! .... ");
require("dotenv").config();
import { utils, ethers, BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
// import { queryAccounts } from "./graph/index";
// import { getMarketEnteredAccounts } from "./pastEvents";
import {
  Comptroller__factory,
  CUNI__factory as cToken_factory,
  Oracle__factory,
  Oracle,
  Erc20Abi__factory,
} from "./types";
import { getMarketEnteredAccountData, storeAccountSnapshot, storeMarket } from "./db";
import { underlyingTokens } from "./MarketStore";

import Queue from "bull";
import { getBorrowdAccountsFromGraph } from ".";
const COMPOUND_QUEUE = new Queue("compound");
const COMPOUND_PRICES_QUEUE = new Queue("price");
const RPC_HOST = process.env.RPC_HTTP;
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const COMPTORLLER_ADDRESS = process.env.COMPTORLLER_ADDRESS || "";
const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
let cTokens: string[] = [];
let priceOracleAddress: string;
let oracle: Oracle;

// import * as MARKET_DATA_TEMP from "./markets.json";

interface Imarket {
  address: string;
  symbol: string;
  collateralFactorMantissa: string;
  marketPrice: string;
}

interface IMarkets {
  [key: string]: Imarket;
}

interface Liquidity {
  liquidity: BigNumber;
  shortfall: BigNumber;
}

let markets: IMarkets;
let _markets: IMarkets = {};
let marketMap = new Map<string, Imarket>();

(async () => {
  console.log("COMPOUND SCANNER ...");
  COMPOUND_QUEUE.empty();
  COMPOUND_PRICES_QUEUE.empty();
  // await startCompoundScanner();
})();

export async function startCompoundScanner(): Promise<Number> {
  console.log("get Block Number ???? ");
  const blockNumber = await provider.getBlockNumber();
  console.log("BlockNumber : ", blockNumber);
  console.log("#1 ---- GET MARKET DATA ---");
  await getMarkets(blockNumber);
  // console.log("#2 ---- START GLOBAL SCANNER ---");
  await startScanner(blockNumber);
  // console.log("#3 Start Quee Monitor : ");
  queeMonitor();

  return blockNumber;
}

/**
 * get Market proces
 * @returns IMarkets
 */
async function getMarkets(blockNumber: number): Promise<IMarkets> {
  cTokens = await comptroller.getAllMarkets();
  for (let address of cTokens) {
    COMPOUND_PRICES_QUEUE.add({
      address: address,
      count: cTokens.length,
      blockNumber: blockNumber,
      underlyingToken: underlyingTokens.get(address),
    });
  }
  // Return Depricated !!!
  return _markets;
}

async function getAccountLiquidity(account: string): Promise<Liquidity> {
  let accountLiquidity: Liquidity = {
    liquidity: parseUnits("0"),
    shortfall: parseUnits("0"),
  };
  try {
    const [, liquidity, shortfall] = await comptroller.getAccountLiquidity(account);
    return (accountLiquidity = {
      liquidity: liquidity,
      shortfall: shortfall,
    });
  } catch (err) {
    console.log("Err: ", err);
  } finally {
    return accountLiquidity;
  }
}

export async function getAssetsIn(account: string): Promise<string[]> {
  try {
    return await comptroller.getAssetsIn(account);
  } catch (err) {
    return [];
  }
}

// Get Accopunt Snapshot
async function readAndStoreAccountSnapshot(account: string, blockNumber: number): Promise<boolean> {
  const { liquidity, shortfall } = await getAccountLiquidity(account);

  // Reduce Addtional calls
  if (shortfall.isZero()) {
    return false;
  }

  console.log('Underwater->', account);

  // Get only assets Account exists in !
  // const accountAssets = await getAssetsIn(account); //

  for (let id in cTokens) {
    try {
      const cToken = cToken_factory.connect(cTokens[id], provider); // TODO: optimize cToken Initialisation
      const [error, cTokenBalance, borrowBalance, exchangeRateMantissa] = await cToken.getAccountSnapshot(account);

      // insert only non zero balances !
      if (!cTokenBalance.isZero() || !borrowBalance.isZero()) {
        await storeAccountSnapshot(
          blockNumber,
          account,
          error.toNumber(),
          cTokens[id],
          cTokenBalance.toString(),
          borrowBalance.toString(),
          exchangeRateMantissa.toString(),
          liquidity.toString(),
          shortfall.toString()
        );
      }
    } catch (error) {
      console.log("Error On Market :  ", cTokens[id]); // cTokenAddress
      console.log("Account : ", account);
      console.log("------");
      console.log(error);
      return false;
    }
  }

  return true;
}

/**
 * Scanner
 */
export async function startScanner(blockNumber: number) {
  const rows = await getMarketEnteredAccountData(); // the old way from database

  console.log("Rows : ", rows?.length);
  rows?.map((row, key) => {
    COMPOUND_QUEUE.add({ account: row.account, blockNumber: blockNumber });
  });

  // const _accounts = await getBorrowdAccountsFromGraph();
  // _accounts.map(item => {
  //   COMPOUND_QUEUE.add({ account: item.id, blockNumber: blockNumber });
  // });

}

///////// QUEUE //////////
COMPOUND_QUEUE.process(3500, async (job, done) => {
  const { account, blockNumber } = job.data;
  const status = await readAndStoreAccountSnapshot(account, blockNumber);
  done(null, status);
});

COMPOUND_QUEUE.on("completed", async (job, result) => {
  job.remove();
});

COMPOUND_QUEUE.on("failed", async (job, error) => {
  console.log(error.message);
  job.remove();
});

COMPOUND_PRICES_QUEUE.process(20, async (job, done) => {
  let _address = "";
  try {
    const { address, count, blockNumber } = job.data;
    _address = address;

    const priceOracleAddress = await comptroller.oracle();
    const oracle = Oracle__factory.connect(priceOracleAddress, provider);
    const cToken = cToken_factory.connect(address, provider);

    const marketSymbol = await cToken.symbol();
    const collateralFactor = await (await comptroller.markets(address)).collateralFactorMantissa;
    const assetPrice = await oracle.getUnderlyingPrice(address);

    const underlyingToken = underlyingTokens.get(address);

    // Using here cToken ABI, because we just need Decimals and Name
    // Very Riski Part , if new tokens added !!!

    if (underlyingToken) {
      await storeMarket(
        blockNumber,
        address,
        marketSymbol,
        collateralFactor.toString(),
        assetPrice.toString(),
        underlyingToken?.symbol,
        underlyingToken?.decimals,
        underlyingToken?.address
      );
    }
  } catch (err: any) {    
    console.log("Error : ", err);
    console.log("address : ", _address);
  } finally {
    done(null);
  }
});

COMPOUND_PRICES_QUEUE.on("completed", async job => {
  job.remove();
});

COMPOUND_PRICES_QUEUE.on("failed", async (job, error) => {
  console.log(error.message);
  job.remove();
});

/**
 * Montor Redis Jobs
 */
async function queeMonitor() {
  let counter = 0;
  let int = setInterval(function () {
    COMPOUND_QUEUE.getJobCounts()
      .then(function (result) {
        console.log("\r" + "Queue status: ", result);
        console.log("\r" + "Counter: ", counter, "Running Time : ", (counter * 10) / 60, "Minutes");
        counter++;

        console.log("----------");
        if (result.active === 0 && counter > 2) {
          console.log("Process Finished !!! FLUSH REDIS DATABASE !!!");
          COMPOUND_QUEUE.empty();
          COMPOUND_PRICES_QUEUE.empty();
          // process.exit(1);
          clearInterval(int);
        }
      })
      .catch(function () {
        console.log("Error in finding out the status of the queue");
      });
  }, 2000);
}
