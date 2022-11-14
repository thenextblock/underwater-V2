console.log("... START COMPOUND SCANNER !!! .... ");
require("dotenv").config();
import { utils, ethers, BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import {
  Comptroller__factory,
  CUNI__factory as cToken_factory,
  Oracle__factory,
} from "./types";
import { getFilteredAccountsFromAccountInfo, getMarketEnteredAccountData, storeAccountSnapshot, storeAccountSnapshotBulk, storeMarket } from "./db";
import { underlyingTokens } from "./MarketStore";
import { queeMonitor } from "../utils/redisHelper";

import Queue from "bull";


const SCANNER_QUEUE = new Queue("scanner:compound");
const SCANNER_PRICES_QUEUE = new Queue("scanner:price");
const SCNANNER_DB_QUEE = new Queue("scanner:db")

const RPC_HOST = process.env.RPC_HTTP;
const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
const COMPTORLLER_ADDRESS = process.env.COMPTORLLER_ADDRESS || "";
const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);

let cTokens: string[] = [];

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

let _markets: IMarkets = {};
let marketMap = new Map<string, Imarket>();

(async () => {
  console.log("COMPOUND SCANNER ...");
  SCANNER_QUEUE.empty();
  SCANNER_PRICES_QUEUE.empty();
  await startCompoundScanner(); // todo comment !!! 
})();

export async function startCompoundScanner(): Promise<Number> {
  
  const blockNumber = await provider.getBlockNumber();
  console.log("BlockNumber : ", blockNumber);
  
  console.log("#1 ---- GET MARKET DATA ---");
  await getMarkets(blockNumber);

  console.log("#2 ---- START GLOBAL SCANNER ---");
  await startScanner(blockNumber);
  
  console.log("#3 Start Quee Monitor : ");

  queeMonitor(SCANNER_QUEUE);
  queeMonitor(SCNANNER_DB_QUEE);

  return blockNumber;
}

/**
 * get Market proces
 * @returns IMarkets
 */
async function getMarkets(blockNumber: number): Promise<IMarkets> {
  cTokens = await comptroller.getAllMarkets();
  for (let address of cTokens) {
    SCANNER_PRICES_QUEUE.add({
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


let values: any = [];

// Get Accopunt Snapshot
async function readAndStoreAccountSnapshot(account: string, blockNumber: number, fullScan: boolean): Promise<any> {
  
  const { liquidity, shortfall } = await getAccountLiquidity(account);

  // Reduce Addtional calls get only underwater Accounts
  // If fullscan is a false and shrotfall > 0

  if (!fullScan && shortfall.isZero()) {
    //console.log("!fullScan->", !fullScan , "!shortfall.isZero() ->", !shortfall.isZero())
    return [];
  }

  console.log('Underwater->', account);

  // Get only assets Account exists in !
  const accountAssets = await getAssetsIn(account); //

  let _values = [];
  
  for (let cTokenAddress of accountAssets) {
    try {

      const cToken = cToken_factory.connect(cTokenAddress, provider); // TODO: optimize cToken Initialisation
      const [error, cTokenBalance, borrowBalance, exchangeRateMantissa] = await cToken.getAccountSnapshot(account);

      // insert only non zero balances !
      if (!cTokenBalance.isZero() || !borrowBalance.isZero()) {

        values.push([
              blockNumber, 
              account, 
              error.toNumber(),
              cTokenAddress,
              cTokenBalance.toString(),
              borrowBalance.toString(),
              exchangeRateMantissa.toString(),
              liquidity.toString(),
              shortfall.toString()
        ])
      }


      // SCNANNER_DB_QUEE.add({ 
      //     blockNumber: blockNumber, 
      //     account: account, 
      //     error: error.toNumber(),
      //     cToken: cTokenAddress,
      //     cTokenBalane: cTokenBalance.toString(),
      //     borrowBalance: borrowBalance.toString(),
      //     exchangeRateMantissa: exchangeRateMantissa.toString(),
      //     liquidity: liquidity.toString(),
      //     shortfall: shortfall.toString()
      // });
      // }


    } catch (error) {
      console.log("Error On Market :  ", cTokenAddress); // cTokenAddress
      console.log("Account : ", account);
      console.log("------");
      console.log(error);
    }
  }


  if(values.length != 0) {
    SCNANNER_DB_QUEE.add({ values: values });
  }
  
  return values;
}


SCNANNER_DB_QUEE.process(100, async (job, done) => { 

  await storeAccountSnapshotBulk(job.data.values);

  // const {  
  //         blockNumber, 
  //         account, 
  //         error, 
  //         cToken, 
  //         cTokenBalane, 
  //         borrowBalance,
  //         exchangeRateMantissa,
  //         liquidity,
  //         shortfall
  //     } = job.data;

  //  await storeAccountSnapshot(
  //         blockNumber,
  //         account,
  //         error,
  //         cToken,
  //         cTokenBalane,
  //         borrowBalance,
  //         exchangeRateMantissa,
  //         liquidity,
  //         shortfall
  //   );

  done(null)
})

SCNANNER_DB_QUEE.on("completed", async(job, result)=> {
  job.remove();
});

SCANNER_QUEUE.on("failed", async (job, error) => {
  console.log(error.message);
  job.remove();
});

/**
 * Scanner
*/
export async function startScanner(blockNumber: number) {

  // Get All Accounts !!! 
  // const rows = await getMarketEnteredAccountData(); 
  const rows = await getFilteredAccountsFromAccountInfo();

  console.log("Accounts Total : ", rows?.length);  
  rows?.map(row => {
    SCANNER_QUEUE.add({ account: row.account, blockNumber: blockNumber });
  });
}

SCANNER_QUEUE.process(3500, async (job, done) => {
  const { account, blockNumber } = job.data;
  let response = await readAndStoreAccountSnapshot(account, blockNumber, false); // fullscan
  done(null);
});

SCANNER_QUEUE.on("completed", async (job, result) => {
  job.remove();
});

SCANNER_QUEUE.on("failed", async (job, error) => {
  console.log(error.message);
  job.remove();
});



// Market Data ! 

SCANNER_PRICES_QUEUE.process(20, async (job, done) => {
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
    // Very Riski Part, if new tokens added !!!

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
    }else{
      console.error("NO Underlying Token!!! Please add: ", address);
    }
  } catch (err: any) {    
    console.log("Error : ", err);
    console.log("address : ", _address);
  } finally {
    done(null);
  }
});

SCANNER_PRICES_QUEUE.on("completed", async job => {
  job.remove();
});

SCANNER_PRICES_QUEUE.on("failed", async (job, error) => {
  console.log(error.message);
  job.remove();
});


