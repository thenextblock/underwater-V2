import { Pool, Client } from "pg";
import config from "../config";

const pool = new Pool(config.db);

// insert into accounts_info (blockNumber, collateral, borrows) values ($1,$2,$3);

export const dbSaveAccountSnapshotByBlockNumber = async (
  blockNumber: number,
  account: string,
  collateral: any,
  borrows: any
) => {
  const sql = `
        insert into accounts_info (blockNumber,account,  collateral, borrows) values ($1,$2,$3, $4);  
  `;
  const data = [blockNumber, account, collateral, borrows];
  try {
    await pool.query(sql, data);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Store MarketEndtered Account into database
 * @param Accont Address
 */
export const storeMarketEnteredAccont = async (accountAddress: string, blockNumber: number) => {
  const sql = `
        insert into accounts ("account", blockNumber) values ($1,$2)
            ON CONFLICT (account) DO NOTHING;  
  `;
  const data = [accountAddress, blockNumber];
  try {
    await pool.query(sql, data);
  } catch (err) {
    console.log(err);
  }
};

export const getMarketEnteredAccountData = async () => {
  // const sql = `SELECT * FROM accounts;`;
  const sqlOld = ` 
            WITH A AS (
                select max(blocknumber) as maxBlockNumber from accounts_info
            ), B AS (
                SELECT
                      blocknumber,
                      account,
                      collateral/ pow(10,18) as collateral,
                      borrows/ pow(10,18) as borrows,
                        (collateral/borrows) AS health
                  FROM accounts_info
                            WHERE collateral > 0 AND borrows > 0
                                AND blocknumber = (select maxBlockNumber from A)
            )
            SELECT * FROM B  WHERE health between 0.9 and 1  ORDER BY  collateral desc ;
    `;

  const sql = `select * from accounts;`

  try {
    return (await pool.query(sql, [])).rows;
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param blockNumber
 * @param exchangeRate
 */
export const storeExchangeRates = async (blockNumber: number, exchangeRate: string) => {
  const sql = `insert into exchange_rates ("blockNumber", price) values ($1,$2);`;
  const data = [blockNumber, exchangeRate];
  try {
    await pool.query(sql, data);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Store market Data
 * @param _blockNumber
 * @param _market
 * @param _marketsymbol
 * @param _collateralFactor
 * @param _oraclePriceMantissa
 */

export const storeMarket = async (
  _blockNumber: number,
  _market: string,
  _marketsymbol: string,
  _collateralFactor: string,
  _oraclePriceMantissa: string,
  _underlyingSymbol: string,
  _underlyingDecimals: number,
  _underlyingAddress: string
) => {
  const sql = `INSERT INTO markets 
                (blockNumber, market, marketsymbol, collateralFactor, oraclePriceMantissa, 
                      underlyingSymbol, underlyingDecimals, underlyingAddress) 
                  VALUES  ($1,$2,$3,$4,$5,$6,$7,$8)`;

  const data = [
    _blockNumber,
    _market,
    _marketsymbol,
    _collateralFactor,
    _oraclePriceMantissa,
    _underlyingSymbol,
    _underlyingDecimals,
    _underlyingAddress,
  ];

  try {
    const res = await pool.query(sql, data);
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param blockNumber
 * @param account
 * @param _error
 * @param market
 * @param marketSymbol
 * @param cTokenBalance
 * @param borrowBalance
 * @param exchangeRateMantissa
 * @param collateralFactor
 * @param oraclePriceMantissa
 */
export const storeAccountSnapshot = async (
  blockNumber: number,
  account: string,
  _error: number,
  market: string,
  cTokenBalance: string,
  borrowBalance: string,
  exchangeRateMantissa: string,
  liquidity: string,
  shortfall: string
) => {
  const sql = `insert into account_snapshot
                (
                  blockNumber, 
                  account, 
                  error, 
                  market,
                  cTokenBalance, 
                  borrowBalance, 
                  exchangeRateMantissa,
                  liquidity,
                  shortfall
                )
                values ($1,$2,$3,$4,$5,$6,$7,$8,$9);`;

  const data = [
    blockNumber,
    account,
    _error,
    market,
    cTokenBalance,
    borrowBalance,
    exchangeRateMantissa,
    liquidity,
    shortfall,
  ];

  try {
    const res = await pool.query(sql, data);
  } catch (err) {
    console.log(err);
  }
};
