/*
    ########### CTokens ###########

    $underlyingDecimals = 18 
    $cTokenDecimals = 8

    $mantissa = 18 + $underlyingDecimals - 8  = 28

    $ExchangeRate = 200615148848647781614211634 = 200 615 148 848 647 781 614 211 634
    $oneCTokenInUnderlying = $ExchangeRate / (10 ^ $mantissa) = 0.02006151

    $cTokenBalance = 2243197471 / (10^$cTokenDecimals) = 22.43197471

    $underlyingBalance = ($cTokenBalance * $oneCTokenInUnderlying) = 0.45001939

    ########### Oracle Price ###########

    $oraclePriceMantissa = 10^(36 - $underlyingDecimals) = 1 000 000 000 000 000 000
    $oraclePrice = 2965248927000000000000 / $oraclePriceMantissa = 2 965.248927
    $collateralInUSD =  $underlyingBalance * $oraclePrice = 1 334.41952679

*/

const CTOKEN_DECIMALS = 8;

export function protocolMath() {
  const underlyingDecimals = 18;
  const mantissa = 18;
}
