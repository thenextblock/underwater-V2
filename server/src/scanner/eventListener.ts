
// TODO: remove this file 

export  function empty() {
  return null;
}

// import Web3 from "Web3";
// import abi from "./abi/oracle.json";
// import {
//   Comptroller__factory,
//   CUNI__factory as cToken_factory,
//   Oracle__factory,
//   Oracle,
// } from "./types";

// (async () => {
//   // const RPC_WS = "http://159.69.75.162:8545";
//   const RPC_WS = "wss://eth-mainnet.alchemyapi.io/v2/HWlk4Sy0ek094_wjLN7Ptk9qCH0wFUOl";
//   const web3 = new Web3(new Web3.providers.WebsocketProvider(RPC_WS));

//   console.log(await web3.eth.getBlockNumber());

//   const oracleContract = (new web3.eth.Contract(
//     // @ts-ignore: Unreachable code error
//     abi,
//     "0x6d2299c48a8dd07a872fdd0f8233924872ad1071"
//   ) as any) as Oracle;
//   // @ts-ignore: Unreachable code error
//   let price = await oracleContract.methods.price("UNI").call();
//   console.log("UNI PRICE : ", price);

//   console.log("Subscribe Event ...");
//   // @ts-ignore: Unreachable code error
//   const pastEents = await oracleContract.getPastEvents(
//     "PriceUpdated",
//     {
//       fromBlock: 13808514,
//       toBlock: 13808525,
//     },
//     (errors: any, events: any) => {
//       console.log("Errors: ", errors);
//       if (!errors) {
//         console.log(events);
//       }
//     }
//   );

//   // // @ts-ignore: Unreachable code error
//   // let priceEvent = await oracleContract.events.PriceUpdated(async cb => {
//   //   console.log("message : ", cb);
//   //   // await startScanner();
//   // });
//   // priceEvent.on("data", (event: any) => {
//   //   console.log("---------------");
//   //   console.log("Event :  ", event);
//   // });
// })();

// //function transferAllErc20Tokens(address _erc20address, address _to)
