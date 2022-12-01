import { Pool, Client } from "pg";
import config from "../config";
import format from "pg-format";

const pool = new Pool(config.db);

// Get Max Block Number from accounts
export async function getMaxBlockNumberFromAccouns(): Promise<any> {
  let sql = ` select max(blocknumber) as blockNumber from accounts; `;
  try {
    let result = await pool.query(sql);
    let { blocknumber } = result.rows[0];
    return blocknumber;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export const dbSaveAccountSnapshotByBlockNumberBulk = async (values: any) => {
  //-- Check aditional values
  if (values.length === 0) return;

  const sql = format(
    `
        insert into accounts_info ( 
                blockNumber, 
                account,  
                collateral, 
                borrows
            ) values %L; `,
    values
  );

  try {
    await pool.query(sql);
  } catch (err) {
    console.log(err);
  }
};

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

export const getUnderWaterAccounts = async () => {
  const sql = ` select distinct account from account_snapshot `;

  try {
    return (await pool.query(sql, [])).rows;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get Market Account infos: Filtered with  special condition
 * collateral > 500
 * health factor: between 0.7 and 1.8;
 * @returns
 *
 */

export const getFilteredAccountsFromAccountInfo = async () => {
  const sql = `
          WITH A AS (
            SELECT *, collateral/borrows as health FROM accounts_info WHERE
              blocknumber = (SELECT max(blocknumber) FROM accounts_info)
                  AND (borrows != 0)
            )
              SELECT blocknumber, account FROM A
                               WHERE collateral > 500
                                   AND
                                        health between 0.7 and 1.8; `;

  try {
    return (await pool.query(sql, [])).rows;
  } catch (err) {
    console.log(err);
  }
};

export const getMarketEnteredAccountData = async () => {
  const sql = ` select * from accounts `;

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

export const storeAccountSnapshotBulk = async (values: any) => {
  let sql = format(
    `INSERT INTO account_snapshot ( 
                        blockNumber, 
                        account, 
                        error, 
                        market,
                        cTokenBalance, 
                        borrowBalance, 
                        exchangeRateMantissa,
                        liquidity,
                        shortfall
              ) VALUES %L `,
    values
  );

  try {
    await pool.query(sql);
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
