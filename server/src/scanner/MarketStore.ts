interface IUnderlying {
  address: string;
  symbol: string;
  decimals: number;
}
/*
    [
        "0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E", // Compound BAT, (cBat)
        "0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643", // Compound Dai (cDAI) 
        "0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5", // Compound Ether (cETH) 
        "0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1", // Compound Augur (cREP)
        "0x39AA39c021dfbaE8faC545936693aC917d5E7563", // Compound USD Coin (cUSDC) 
        "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9", // Compound USDT (cUSDT)
        "0xC11b1268C1A384e55C48c2391d8d480264A3A7F4", // Compound Wrapped BTC (cWBTC) 
        "0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407", // Compound 0x (cZRX) 
        "0xF5DCe57282A584D2746FaF1593d3121Fcac444dC", // Compound Sai (cSAI) 
        "0x35A18000230DA775CAc24873d00Ff85BccdeD550", // Compound Uniswap (cUNI) 
        "0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4", // Compound Collateral (cCOMP)
        "0xccF4429DB6322D5C611ee964527D42E5d685DD6a", // Compound Wrapped BTC (cWBTC) NEW Please Check 
        "0x12392F67bdf24faE0AF363c24aC620a2f67DAd86", // Compound TrueUSD (cTUSD)
        "0xFAce851a4921ce59e912d19329929CE6da6EB0c7", // Compound ChainLink Token (cLINK)
        "0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b", // Compound Maker (cMKR)
        "0x4B0181102A0112A2ef11AbEE5563bb4a3176c9d7", // Compound Sushi Token (cSUSHI)
        "0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c", // Compound Aave Token (cAAVE)
        "0x80a2AE356fc9ef4305676f7a3E2Ed04e12C33946", // Compound yearn.finance (cYFI)
        "0x041171993284df560249B57358F931D9eB7b925D", // Compound Pax Dollar (cUSDP)
        "0x7713DD9Ca933848F6819F38B8352D9A15EA73F67", // Compound Fei USD (cFEI)
    ];
*/

export let underlyingTokens = new Map<string, IUnderlying>();

underlyingTokens.set("0x7713DD9Ca933848F6819F38B8352D9A15EA73F67", {
  address: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
  symbol: "FEI",
  decimals: 18,
});

underlyingTokens.set("0x041171993284df560249B57358F931D9eB7b925D", {
  address: "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
  symbol: "USDP",
  decimals: 18,
});

underlyingTokens.set("0x80a2AE356fc9ef4305676f7a3E2Ed04e12C33946", {
  address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
  symbol: "YFI",
  decimals: 18,
});

underlyingTokens.set("0xe65cdB6479BaC1e22340E4E755fAE7E509EcD06c", {
  address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  symbol: "AAVE",
  decimals: 18,
});

underlyingTokens.set("0x4B0181102A0112A2ef11AbEE5563bb4a3176c9d7", {
  address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
  symbol: "SUSHI",
  decimals: 18,
});

underlyingTokens.set("0x95b4eF2869eBD94BEb4eEE400a99824BF5DC325b", {
  address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
  symbol: "MKR",
  decimals: 18,
});

underlyingTokens.set("0xFAce851a4921ce59e912d19329929CE6da6EB0c7", {
  address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  symbol: "LINK",
  decimals: 18,
});

underlyingTokens.set("0xFAce851a4921ce59e912d19329929CE6da6EB0c7", {
  address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  symbol: "LINK",
  decimals: 18,
});

underlyingTokens.set("0x12392F67bdf24faE0AF363c24aC620a2f67DAd86", {
  address: "0x0000000000085d4780B73119b644AE5ecd22b376",
  symbol: "TUSD",
  decimals: 18,
});

underlyingTokens.set("0xccF4429DB6322D5C611ee964527D42E5d685DD6a", {
  address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  symbol: "WBTC",
  decimals: 8,
});

underlyingTokens.set("0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4", {
  address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
  symbol: "COMP",
  decimals: 18,
});

underlyingTokens.set("0x35A18000230DA775CAc24873d00Ff85BccdeD550", {
  address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  symbol: "UNI",
  decimals: 18,
});

underlyingTokens.set("0xF5DCe57282A584D2746FaF1593d3121Fcac444dC", {
  address: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
  symbol: "SAI",
  decimals: 18,
});

underlyingTokens.set("0xB3319f5D18Bc0D84dD1b4825Dcde5d5f7266d407", {
  address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
  symbol: "ZRX",
  decimals: 18,
});

underlyingTokens.set("0xC11b1268C1A384e55C48c2391d8d480264A3A7F4", {
  address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  symbol: "WBTC",
  decimals: 8,
});

underlyingTokens.set("0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9", {
  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  symbol: "USDT",
  decimals: 6,
});

underlyingTokens.set("0x39AA39c021dfbaE8faC545936693aC917d5E7563", {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  decimals: 6,
});

underlyingTokens.set("0x39AA39c021dfbaE8faC545936693aC917d5E7563", {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  symbol: "USDC",
  decimals: 6,
});

underlyingTokens.set("0x6C8c6b02E7b2BE14d4fA6022Dfd6d75921D90E4E", {
  address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
  symbol: "BAT",
  decimals: 18,
});

underlyingTokens.set("0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643", {
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  symbol: "DAI",
  decimals: 18,
});

underlyingTokens.set("0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5", {
  address: "", // No underlying for ETH
  symbol: "ETH",
  decimals: 18,
});

underlyingTokens.set("0x158079Ee67Fce2f58472A96584A73C7Ab9AC95c1", {
  address: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
  symbol: "REP",
  decimals: 18,
});
