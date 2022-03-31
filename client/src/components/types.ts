export interface IMarket {
  id: string;
  blockNumber: string;
  market: string;
  marketsymbol: string;
  collateralFactor: string;
  oraclePriceMantissa: string;
}

// data: [
//     {
//       account: "0x4707207F89136C1f1e4b67BC1Bee349149a18843";
//       blocknumber: "14456907";
//       totalcollateral: "1394.02577460363117569895589000739888920000000000000000000000000000000000";
//       totalborrow: "532.9546170000000000000000000000000000000000000000000000";
//     }
// ];

export interface ISnapshot {
  account: string;
  blocknumber: number;
  totalcollateral: number;
  totalborrow: number;
  // statement: number;
  // shortfall: number;
  // health: number;
}

// {
//       "collateral": "281.6772",
//       "borrow": "0.0000",
//       "blocknumber": "14461107",
//       "error": 0,
//       "account": "0xca54c3123c855bceceb0db69B034E45530020F26",
//       "market": "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643",
//       "ctokenbalance": "1284861652510",
//       "borrowbalance": "0",
//       "exchangeratemantissa": "219243021763636779360479601",
//       "liquidity": "15838801153868015721160",
//       "shortfall": "0",
//       "collateralfactor": "800000000000000000",
//       "marketsymbol": "cDAI",
//       "oraclepricemantissa": "999930000000000000",
//       "underlyingdecimals": 18,
//       "underlyingsymbol": "DAI"
// }

export interface IAccountSnapshot {
  collateral: number;
  borrow: number;
  blocknumber: number;
  error: number;
  account: string;
  market: string;
  ctokenbalance: string;
  borrowbalance: string;
  exchangeratemantissa: string;
  liquidity: string;
  shortfall: number;
  collateralfactor: string;
  marketsymbol: string;
  oraclepricemantissa: string;
  underlyingdecimals: 18;
  underlyingsymbol: string;
}

// I think this interface is depricated , we dont need anymore that
export interface IAccountRowSnapshot {
  blockNumber: string;
  account: string;
  market: string;
  cTokenBalance: string;
  borrowBalance: string;
  exchangeRateMantissa: string;
  marketsymbol: string;
  oraclePriceMantissa: string;
  collateralFactor: string;
}
