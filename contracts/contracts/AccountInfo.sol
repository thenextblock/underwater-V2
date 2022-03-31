// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ExpMath.sol";

// import "hardhat/console.sol";

interface CToken {
    function getAccountSnapshot(address account)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256
        );
}

interface PriceOracle {
    /**
     * @notice Get the underlying price of a cToken asset
     * @param cToken The cToken to get the underlying price of
     * @return The underlying asset price mantissa (scaled by 1e18).
     *  Zero means the price is unavailable.
     */
    function getUnderlyingPrice(address cToken) external view returns (uint256);
}

abstract contract IComptroller {
    struct Market {
        bool isListed;
        uint256 collateralFactorMantissa;
        mapping(address => bool) accountMembership;
        bool isComped;
    }

    mapping(address => Market) public markets;

    PriceOracle public oracle;

    function getAssetsIn(address account)
        external
        view
        virtual
        returns (CToken[] memory);
}

contract AccountInfo is ExponentialNoError {
    IComptroller public comptroller;
    PriceOracle public oracle;
    address public admin;

    constructor(address comptroller_) {
        comptroller = IComptroller(comptroller_);
        oracle = PriceOracle(comptroller.oracle());
        admin = msg.sender;
    }

    function changeComptroller(address _newComptroller) public {
        require(msg.sender == admin, "Only Admin");
        comptroller = IComptroller(_newComptroller);
    }

    struct AccountLiquidityLocalVars {
        uint256 sumCollateral;
        uint256 sumBorrowPlusEffects;
        uint256 cTokenBalance;
        uint256 borrowBalance;
        uint256 exchangeRateMantissa;
        uint256 oraclePriceMantissa;
        Exp collateralFactor;
        Exp exchangeRate;
        Exp oraclePrice;
        Exp tokensToDenom;
    }

    /// Wrapper Function get Account liqudity info
    function getLiquidity(address account_)
        external
        view
        returns (
            uint256 error,
            uint256 collateral,
            uint256 borrows
        )
    {
        AccountLiquidityLocalVars memory vars;

        error = 0;
        collateral = 0;
        borrows = 0;

        uint256 oErr;

        // For each asset the account is in
        CToken[] memory assets = comptroller.getAssetsIn(account_);

        for (uint256 i = 0; i < assets.length; i++) {
            CToken asset = assets[i];

            // console.log("-----------------------------------------------");
            // console.log("SM >>> Asset:  %s", address(asset));

            // Read the balances and exchange rate from the cToken
            (
                oErr,
                vars.cTokenBalance,
                vars.borrowBalance,
                vars.exchangeRateMantissa
            ) = asset.getAccountSnapshot(account_);
            if (oErr != 0) {
                // semi-opaque error code, we assume NO_ERROR == 0 is invariant between upgrades
                return (0, 0, 0);
            }

            (, uint256 collateralFactorMantissa, ) = comptroller.markets(
                address(asset)
            );

            vars.collateralFactor = Exp({mantissa: collateralFactorMantissa});
            vars.exchangeRate = Exp({mantissa: vars.exchangeRateMantissa});

            // Get the normalized price of the asset
            vars.oraclePriceMantissa = oracle.getUnderlyingPrice(
                address(asset)
            );

            if (vars.oraclePriceMantissa == 0) {
                return (1, 0, 0);
            }
            vars.oraclePrice = Exp({mantissa: vars.oraclePriceMantissa});

            // console.log("SM >>> oraclePrice:  %s",  oraclePriceMantissa);
            // console.log("SM >>> exchangeRate:  %s",  exchangeRate.mantissa);

            // Pre-compute a conversion factor from tokens -> ether (normalized price value)
            vars.tokensToDenom = mul_(
                mul_(vars.collateralFactor, vars.exchangeRate),
                vars.oraclePrice
            );

            // console.log("SM >>> tokensToDenom:  %s",  tokensToDenom.mantissa);

            // sumCollateral += tokensToDenom * cTokenBalance
            vars.sumCollateral = mul_ScalarTruncateAddUInt(
                vars.tokensToDenom,
                vars.cTokenBalance,
                vars.sumCollateral
            );

            // console.log("SM >>> oraclePrice:  %s",  oraclePriceMantissa);
            // console.log("SM >>> sumCollateral:  %s",  sumCollateral);

            // sumBorrowPlusEffects += oraclePrice * borrowBalance
            vars.sumBorrowPlusEffects = mul_ScalarTruncateAddUInt(
                vars.oraclePrice,
                vars.borrowBalance,
                vars.sumBorrowPlusEffects
            );

            // console.log("SM >>> vars.sumBorrowPlusEffects:  %s",  vars.sumBorrowPlusEffects);
        }

        collateral = vars.sumCollateral;
        borrows = vars.sumBorrowPlusEffects;
    }
}
