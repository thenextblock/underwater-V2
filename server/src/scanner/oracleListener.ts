require("dotenv").config();
import { formatUnits } from "ethers/lib/utils";
import { ethers } from "ethers";
import { Comptroller__factory, CUNI__factory as cToken_factory, Oracle__factory, Oracle } from "./types";
import newOracleAbi from "./abi/oracle.json";
ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF); // turn off warnings

import Queue from "bull";
const KEEPALIVE_QUEUE = new Queue("oracle:keepalive");

import { startCompoundScanner } from "./accountSnapshot";

const RPC_WS = process.env.RPC_WS || "";
const COMPTORLLER_ADDRESS = process.env.COMPTORLLER_ADDRESS || "";
const provider = new ethers.providers.WebSocketProvider(RPC_WS);

// Connection Keep Alive depricated but keep the public solution here
// Connection Keep Alive Code : https://github.com/ethers-io/ethers.js/issues/1053

let BLOCK_NUMBER = 0;

(async () => {
  console.log("Start Oracle Listener: Price Update Event");

  const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
  const oracleAddress = await comptroller.oracle();
  const oracleInstance = new ethers.Contract(oracleAddress, newOracleAbi, provider);

  oracleInstance.on("PriceUpdated", async (symbolHash, anchorPrice, extraData) => {
    console.log("----------------------------------");
    console.log("PriceUpdated %s", new Date());
    console.log(symbolHash, " | ", formatUnits(anchorPrice));
    console.log("ExtraData : ", extraData);

    const { blockNumber: eventBlockNumber } = extraData;
    // const currentBlockNumber = await provider.getBlockNumber();

    console.log("Event BlockNumber: ", eventBlockNumber);
    startCompoundScanner(eventBlockNumber);
  });

  // At every 3rd minute. https://crontab.guru/#*/3_*_*_*_*
  KEEPALIVE_QUEUE.add({ provider: provider }, { repeat: { cron: "*/3 * * * *" } });
})();

KEEPALIVE_QUEUE.process(async job => {
  let blockNumber = await provider.getBlockNumber();
  console.log(`I'm Keepalive ping WS connection every 3 min`);
  console.log(`Current BlockNumber : ", ${blockNumber}`);
  console.log(`---`);
});
