DROP TABLE accounts;
DROP TABLE markets;
DROP TABLE account_snapshot;

CREATE TABLE accounts
(
    account varchar(43),
    blockNumber bigint
    -- unique (account)
);

alter table accounts owner to postgres;

CREATE TABLE markets
(
    id  bigserial
            constraint markets_pk
                primary key,
    blockNumber         numeric,
    market              varchar(42),
    marketsymbol        varchar(10),
    collateralFactor    numeric,
    oraclePriceMantissa numeric,
    underlyingSymbol    varchar(10),
    underlyingDecimals  integer,
    underlyingAddress   varchar(42)
);

ALTER TABLE markets OWNER TO postgres;


create table account_snapshot
(
    id  bigserial
        constraint account_snapshot_pk
            primary key,
    blockNumber          numeric,
    error                integer,
    account              varchar(42),
    market               varchar(42),
    cTokenBalance        numeric,
    borrowBalance        numeric,
    exchangeRateMantissa numeric,
    liquidity numeric,
    shortfall numeric
);

alter table account_snapshot
    owner to postgres;


DROP TABLE IF EXISTS  accounts_info;
create table accounts_info (
    id bigserial,
    blockNumber numeric,
    account varchar(42),
    collateral numeric,
    borrows numeric
)

alter table accounts_info
    owner to postgres;


--- *** --- 

create function get_account_balance(
        underlyingdecimals numeric, 
        exchangerate numeric, 
        ctokenbalance numeric, 
        oraclepricemantissa numeric, 
        OUT underlyingusd numeric
) returns numeric
    language plpgsql
as
$$
DECLARE
        CTOKEN_DECIMALS NUMERIC = 8;
        oracleMantissa NUMERIC;
        oraclePrice NUMERIC;
        oneCTokenInUnderlying NUMERIC;
        mantissa NUMERIC;
        underlyingBalance NUMERIC;
BEGIN

        -- ### CTokens ###
        mantissa := pow(10, (18 + underlyingDecimals - 8)) ;
        oneCTokenInUnderlying := ExchangeRate / mantissa;
        underlyingBalance := (cTokenBalance / pow(10, CTOKEN_DECIMALS)) * oneCTokenInUnderlying;

        --- ### Oracle Price ###
        oracleMantissa := pow(10, (36 - underlyingDecimals));
        oraclePrice := oraclePriceMantissa / oracleMantissa;
        underlyingUSD := underlyingBalance * oraclePrice;

END;
$$;

alter function get_account_balance(numeric, numeric, numeric, numeric, out numeric) owner to postgres;



---- *** ---- 
create function get_borrow_balance(
    underlyingdecimals numeric, 
    borrowbalance numeric, 
    oraclepricemantissa numeric, 
    OUT borrowbalanceusd numeric
) returns numeric
    language plpgsql
as
$$
DECLARE
    oraclePrice NUMERIC;
BEGIN
    --- ### Oracle Price ###
    oraclePrice := oraclePriceMantissa / pow(10, (36 - underlyingDecimals));
    borrowBalanceUSD := borrowBalance/pow(10,underlyingdecimals) * oraclePrice;
END;
$$;

alter function get_borrow_balance(numeric, numeric, numeric, out numeric) owner to postgres;





