require("dotenv").config();
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { utils, ethers, providers } from "ethers";
import { Comptroller__factory, CUNI__factory as cToken_factory, Oracle__factory, Oracle } from "./types";
import newOracleAbi from "./abi/oracle.json";
ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF); // turn off warnings

import Queue from "bull";
const KEEPALIVE_QUEUE = new Queue("keepalive");

import { startCompoundScanner } from "./accountSnapshot";

// const RPC_WS = "wss://eth-mainnet.alchemyapi.io/v2/HWlk4Sy0ek094_wjLN7Ptk9qCH0wFUOl";
const RPC_WS = process.env.RPC_WS || "";
const COMPTORLLER_ADDRESS = process.env.COMPTORLLER_ADDRESS || "";

// Connection Keep Alive Code : https://github.com/ethers-io/ethers.js/issues/1053
type KeepAliveParams = {
  provider: ethers.providers.WebSocketProvider;
  onDisconnect: (err: any) => void;
  expectedPongBack?: number;
  checkInterval?: number;
};

const keepAlive = ({ provider, onDisconnect, expectedPongBack = 15000, checkInterval = 7500 }: KeepAliveParams) => {
  let pingTimeout: NodeJS.Timeout | null = null;
  let keepAliveInterval: NodeJS.Timeout | null = null;

  provider._websocket.on("open", () => {
    keepAliveInterval = setInterval(() => {
      provider._websocket.ping();

      // Use `WebSocket#terminate()`, which immediately destroys the connection,
      // instead of `WebSocket#close()`, which waits for the close timer.
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.

      pingTimeout = setTimeout(() => {
        provider._websocket.terminate();
      }, expectedPongBack);
    }, checkInterval);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider._websocket.on("close", (err: any) => {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    if (pingTimeout) clearTimeout(pingTimeout);
    onDisconnect(err);
  });

  provider._websocket.on("pong", () => {
    if (pingTimeout) clearInterval(pingTimeout);
  });
};

const startListener = async () => {
  console.log("START LISTENER");
  const provider = new ethers.providers.WebSocketProvider(RPC_WS);

  keepAlive({
    provider,
    onDisconnect: err => {
      startListener();
      console.error("The ws connection was closed", JSON.stringify(err, null, 2));
    },
  });

  let blockNumber = await provider.getBlockNumber();
  console.log(blockNumber);
  const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
  const oracleAddress = await comptroller.oracle();
  console.log(oracleAddress);
  const oracleInstance = Oracle__factory.connect(oracleAddress, provider);

  oracleInstance.once("PriceUpdated", async (symbolHash, anchorPrice, extra) => {
    console.log("-------------------------------------");
    console.log("Price Updated %s", new Date());
    console.log("SymbolHash: ", symbolHash, " | ", anchorPrice);

    console.log("Extra: ", extra);

    if (BLOCK_NUMBER === (await provider.getBlockNumber())) {
      console.log("IN THIS BLOCK WE ALREADY HAVE AN ONE EVENT !!! ");
    } else {
      console.log("Function:: startListener::: ", BLOCK_NUMBER);
      // await startCompoundScanner();
    }

    console.log("Update Block Number !!!");
    BLOCK_NUMBER === (await provider.getBlockNumber());
    console.log("-------------------------------------");
  });
};

// Global Variable need for Checking
let BLOCK_NUMBER = 0;
///|||||||||| !!! ///////|||||//////
const provider = new ethers.providers.WebSocketProvider(RPC_WS);

(async () => {
  const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
  const oracleAddress = await comptroller.oracle();
  const oracleInstance = new ethers.Contract(oracleAddress, newOracleAbi, provider);

  // Set blockNumber at First time 
  BLOCK_NUMBER = await provider.getBlockNumber();

  oracleInstance.on("PriceUpdated", async (symbolHash, anchorPrice, extraData) => {
    console.log("----------------------------------------");
    console.log("PriceUpdated %s", new Date());
    console.log(symbolHash, " | ", formatUnits(anchorPrice));
    // console.log("ExtraData : ", extraData);
    const { blockNumber: eventBlockNumber } = extraData;
    const currentBlockNumber = await provider.getBlockNumber();

    console.log("Event BlockNumber: ", eventBlockNumber);
    console.log("Current BlockNumber: ", currentBlockNumber);
    console.log("GLOBAL BLOCK NUMBER: ", BLOCK_NUMBER);
    console.log("currentBlockNumber === eventBlockNumber", currentBlockNumber === eventBlockNumber)

    if (BLOCK_NUMBER === eventBlockNumber) {
      console.log("IN THIS BLOCK WE ALREADY HAVE AN ONE EVENT !!! ");
    } else {
      console.log("--> () main Function: block: ", BLOCK_NUMBER);
      console.log("START SCANNER !!! ")
      startCompoundScanner();
    }

    console.log("Update Block Global Number !!!");
    BLOCK_NUMBER = currentBlockNumber;
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
