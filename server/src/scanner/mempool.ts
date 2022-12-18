require("dotenv").config();
import { utils, ethers, BigNumber, Signer } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Comptroller__factory, Oracle__factory, Oracle } from "./types";
import newOracleAbi from "./abi/oracle.json";
ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.OFF); // turn off warnings

const RPC_WS = process.env.RPC_WS || "";
const COMPTORLLER_ADDRESS = process.env.COMPTORLLER_ADDRESS || "";
const provider = new ethers.providers.WebSocketProvider(RPC_WS);

const connectWSS = async (oracleAddress: string) => {
  console.log(`[${new Date().toLocaleTimeString()}] Connecting via WebSocket... ${RPC_WS}`);
  let network = provider.getNetwork();
  network.then(res => console.log(`[${new Date().toLocaleTimeString()}] Connected to chain ID ${res.chainId}`));
  console.log("Oracle Address: ", oracleAddress);

  /*
    Function: transmit(bytes _report, bytes32[] _rs, bytes32[] _ss, bytes32 _rawVs) ***
    MethodID: 0xc9807539
  */

  provider.on("pending", async txHash => {
    if (txHash) {
      process.stdout.write(`[${new Date().toLocaleTimeString()}] Scanning transactions: ${txHash} \r`);
      let pendingTx = await provider.getTransaction(txHash);
      if (pendingTx) {
        if (pendingTx.data.indexOf("0xc9807539") !== -1) {
          console.log(pendingTx.hash, pendingTx.from, pendingTx.to);
          // console.log(pendingTx.data);
          console.log("-----------------------------");
        }
      }
    }
  });
};

(async () => {
  const comptroller = Comptroller__factory.connect(COMPTORLLER_ADDRESS, provider);
  const oracleAddress = await comptroller.oracle();

  await connectWSS(oracleAddress);

  ///////////////  ORACLE EVENT LISTENER !!! /////////////////////
  const oracleInstance = new ethers.Contract(oracleAddress, newOracleAbi, provider);

  oracleInstance.on("PriceUpdated", async (symbolHash, anchorPrice, extraData) => {
    console.log("----------------------------------");
    console.log("PriceUpdated %s", new Date());
    // console.log(symbolHash, " | ", formatUnits(anchorPrice));
    console.log("ExtraData : ", extraData);

    const { blockNumber: eventBlockNumber } = extraData;
    const currentBlockNumber = await provider.getBlockNumber();
    console.log("Event BlockNumber: ", eventBlockNumber, currentBlockNumber);
  });
})();
