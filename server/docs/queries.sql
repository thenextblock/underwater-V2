
--- Calculate Account Liquidity ---

WITH A AS (
    select * from account_snapshot
), B AS (
SELECT
        A.account,
        (A."collateralFactor" * A."exchangeRateMantissa" * A."oraclePriceMantissa" * A."cTokenBalance")/pow(10,18)/pow(10,18)/pow(10,18)  as collateral,
        (A."borrowBalance" * A."oraclePriceMantissa")/pow(10,18) AS borrowPlusEffects
        FROM A
), C As (
    select B.account, sum(collateral/pow(10, 18) ) as totalCollateral, sum(borrowPlusEffects/pow(10,18)) as totalBorrow
    from B
    GROUP BY B.account
), D AS (
    SELECT *, totalCollateral - totalBorrow as statement FROM  C
)

select * from D where statement < 0  order by statement





-- Data querirs  Old Depricated 

select
        block,
        account,
        data->>'blockNumebr' AS bn,
        data->>'totalBorrowUSD' as totalBorrowUSD,
        data->>'totalCollateralUSD' as totalCollateralUSD,

       -- Borrowed Data
        data ->'maxBorrowedAsset'->>'asset' borrowedAsset,
        data ->'maxBorrowedAsset'->>'symbol' borrowedAssetsymbol,
        data ->'maxBorrowedAsset'->>'borrowedTokens' borrowedTokens,
        
       -- Collateral Data
        data ->'maxCollateralAsset'->>'asset' collatralAssetAsset,
        data ->'maxCollateralAsset'->>'symbol' collatrealAssetAssetsymbol,
        data ->'maxCollateralAsset'->>'cTokenBalance' cTokenBalance
FROM underwater;


