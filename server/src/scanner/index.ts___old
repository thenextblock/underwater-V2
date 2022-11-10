console.warn("THIS IS DEPRICATED CODE , SEE account_snapshot file");

// console.log("... START COMPOUND SCANNER !!! .... ");
// require("dotenv").config();
// import { utils, ethers } from "ethers";
// import { queryAccounts } from "./graph/index";
// import {
//   Comptroller__factory,
//   CUNI__factory as cToken_factory,
//   Oracle__factory,
//   Oracle,
// } from "./types";

// import { storeAccountSnapshot } from "./db";
// import Queue from "bull";
// const COMPOUND_QUEUE = new Queue("compound");

// // import BigNumber from "bignumber.js";

// const RPC_HOST = process.env.RPC_HTTP;

// const COMPTORLLER_ADDRESS = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";
// const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
// const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
// let cTokens: string[] = [];
// let priceOracleAddress: string;
// let oracle: Oracle;

// import * as MARKET_DATA_TEMP from "./markets.json";

// // Market Interface

// interface Imarket {
//   address: string;
//   symbol: string;
//   collateralFactorMantissa: string;
//   marketPrice: string;
// }

// interface IMarkets {
//   [key: string]: Imarket;
// }

// let markets: IMarkets;

// (async () => {
//   //   markets = MARKET_DATA_TEMP;

//   cTokens = await comptroller.getAllMarkets();
//   priceOracleAddress = await comptroller.oracle();
//   oracle = Oracle__factory.connect(priceOracleAddress, provider);
//   let markets: IMarkets = {};
//   for (let address of cTokens) {
//     const cToken = cToken_factory.connect(address, provider);
//     const collateralFactor = await (await comptroller.markets(address)).collateralFactorMantissa;
//     const assetPrice = await oracle.getUnderlyingPrice(address);
//     const marketSymbol = await cToken.symbol();
//     let _market: Imarket = {
//       address: address,
//       symbol: marketSymbol.toString(),
//       collateralFactorMantissa: collateralFactor.toString(),
//       marketPrice: assetPrice.toString(),
//     };
//     markets[address] = _market;
//   }

//   await startScanner();
// })();

// // Get Accopunt Snapshot
// async function readAndStoreAccountSnapshot(account: string): Promise<boolean> {
//   for (let cTokenAddress in markets.default) {
//     try {
//       // console.log("cToken : ", cTokenAddress); // cTokenAddress
//       const cToken = cToken_factory.connect(cTokenAddress, provider);
//       const [
//         error,
//         cTokenBalance,
//         borrowBalance,
//         exchangeRateMantissa,
//       ] = await cToken.getAccountSnapshot(account);

//       const collateralFactor = markets[cTokenAddress].collateralFactorMantissa;
//       const assetPrice = markets[cTokenAddress].marketPrice;
//       const marketSymbol = markets[cTokenAddress].symbol;

//       // console.log("cToken Symbol : ", marketSymbol);
//       // // console.log("cTokenBalance ", cTokenBalance.toString());
//       // // console.log("borrowBalance ", borrowBalance.toString());
//       // // console.log("exchangeRateMantissa ", exchangeRateMantissa.toString());
//       // // console.log("collateralFactor: ", collateralFactor.toString());
//       // // console.log("Asset Price : ", assetPrice.toString());
//       // // console.log("Balances > : ", !cTokenBalance.isZero(), !borrowBalance.isZero());

//       // insert only non zero balances !
//       if (!cTokenBalance.isZero() || !borrowBalance.isZero()) {
//         await storeAccountSnapshot(
//           1,
//           account,
//           error.toNumber(),
//           cTokenAddress,
//           marketSymbol,
//           cTokenBalance.toString(),
//           borrowBalance.toString(),
//           exchangeRateMantissa.toString(),
//           collateralFactor.toString(),
//           assetPrice.toString() // TODO: Change Name to orcalePriceMantissa
//         );
//       }
//     } catch (error) {
//       console.log("Error On Market :  ", cTokenAddress); // cTokenAddress
//       console.log("Account : ", account);
//       console.log("------");
//       console.log(error);
//     }
//   }

//   return true;
// }

// /**
//  * Scanner
//  */
// export async function startScanner() {
//   console.log("RPC ENDPOINT :  ", process.env.RPC_HTTP);
//   // await readAndStoreAccountSnapshot("0xfdb213e95ce0a79935d13ff62e22eb29dbff2c6d");

//   let accountsCount = 1;
//   let page = 0;
//   let lastId = "";

//   while (accountsCount !== 0) {
//     const res = await queryAccounts(1000, lastId);
//     console.log("Page : ", page, "Fetched : ", res.data.accounts.length);
//     accountsCount = res.data.accounts.length;

//     if (accountsCount !== 0) {
//       lastId = res.data.accounts[res.data.accounts.length - 1].id;
//       console.log("---------------------------");
//       console.log(`PAGE: ${page}  ADD JOBS IN QUEE`);
//       res.data.accounts.map((item: any) => {
//         COMPOUND_QUEUE.add(item);
//       });
//     }

//     // accountsCount = 0; // using for stop
//     page += 1;
//   }
// }

// ///////// QUEUE //////////

// COMPOUND_QUEUE.process(100, async (job, done) => {
//   // console.log("Process : ", job.data);
//   const { id } = job.data;
//   const status = await readAndStoreAccountSnapshot(id);
//   done(null, status);
// });

// COMPOUND_QUEUE.on("completed", async (job, result) => {
//   // console.log("Result : ", result);
//   if (result) {
//     console.log("Finished ... ");
//   }
//   job.remove();
// });
