/// https://github.com/monosux/ethereum-block-by-date

import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, ethers, providers } from "ethers";
import { BigNumber } from "bignumber.js";
import { Comptroller__factory, CUNI__factory as cToken_factory } from "./types";
import Bull from "bull";
import { storeExchangeRates } from "./db";
const myQuee = new Bull("my-first-queue");

// TODO : Move to .env
const provider = new ethers.providers.JsonRpcProvider("http://159.69.75.162:8545");

const cTokenDecimals = 8; // All cTokens have 8 decimal places = 8
const underlyingDecimals = 18;
const mantissa = 18 + underlyingDecimals - cTokenDecimals;
const CTOKEN_ADDRESS = "0x5d3a536e4d6dbd6114cc1ead35777bab948e3643"; // cDai
const cTokenContract = new ethers.Contract(CTOKEN_ADDRESS, cToken_factory.abi, provider);

interface ExchangeData {
  blockNumber: number;
  exchangeRate: string;
}

let _data: ExchangeData[] = [];

async function main() {
  console.log("Currenbt Block Number : ", await provider.getBlockNumber());
  const startBlock = 10463454;
  const endBlock = startBlock + 500000;

  for (let i = startBlock; i < endBlock; i++) {
    myQuee.add({ blockNumber: i });
  }
}

myQuee.process(90, async (job, done) => {
  const { blockNumber } = job.data;
  let result = await fetchExchangeRate(blockNumber);
  // console.log("result : ", result.);
  // console.log(" BlockNumebr:  ", blockNumber);
  await storeExchangeRates(blockNumber, result.toString());
  done(null, result);
});

myQuee.on("completed", (job, result) => {
  // console.log(`Job completed with result ${result}`);
});

myQuee.on("global:completed", jobId => {
  // console.log(`Job with id ${jobId} has been completed`);
});

setInterval(function () {
  myQuee
    .getJobCounts()
    .then(function (result) {
      console.log("\r" + "Queue status: ", result);
      console.log("----------");
    })
    .catch(function () {
      console.log("Error in finding out the status of the queue");
    });
}, 10000);

async function fetchExchangeRate(blockNumber: number): Promise<string> {
  let exchangeRateCurrent: string = "0";
  try {
    exchangeRateCurrent = await cTokenContract.exchangeRateStored({
      blockTag: blockNumber,
    });
    return exchangeRateCurrent.toString();
  } catch (err) {
    console.log("Error : ", blockNumber);
  } finally {
    return exchangeRateCurrent;
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
