import { QueryResult } from "pg";
import * as dbUtil from "../../utils/dbUtil";
import logger from "../../utils/logger";
import { Request, Response } from "express";

const exceuteSql = async (sql: string, data: any): Promise<QueryResult> => {
  try {
    return await dbUtil.sqlToDB(sql, data);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * Get Unique Blocks
 * @returns
 */

export const getBlocks = async (req: Request, res: Response): Promise<any> => {
  const query = `select distinct blockNumber from markets order by 1 desc;`;
  let dbResponse = await exceuteSql(query, []);
  return res.status(200).json({ data: dbResponse.rows });
};

/**
 * Get Market By BlockNumber
 * @param blockNumber
 * @returns
 */

export const getMarketsByBlockNumber = async (req: Request, res: Response): Promise<any> => {
  const query = `select * from markets where blockNumber = $1 
                          order by marketsymbol; `;

  console.log(req.params);
  let data = [req.params.blockumber];
  let dbResponse = await exceuteSql(query, data);
  return res.status(200).json({ data: dbResponse.rows });
};

/**
 * getSnapshoDataByBlockNumber
 * @param req
 * @param res
 * @returns
 */
export const getSnapshoDataByBlockNumber = async (req: Request, res: Response): Promise<any> => {
  console.log("get Snapshot Data by BlockNumber");
  const query = `
          WITH A AS (
        SELECT
                snapshot.blockNumber,
                snapshot.error,
                snapshot.account,
                snapshot.market,
                snapshot.cTokenBalance,
                snapshot.borrowBalance,
                snapshot.exchangeRateMantissa,
                snapshot.liquidity,
                snapshot.shortfall,
                m.collateralFactor,
                m.marketsymbol,
                m.oraclePriceMantissa,
                m.underlyingdecimals,
                m.underlyingsymbol
                    FROM account_snapshot as snapshot
                        LEFT JOIN markets m ON snapshot.market = m.market
                            AND snapshot.blockNumber = m.blockNumber
                                    WHERE snapshot.blockNumber = $1
    ),B AS (

        SELECT  get_account_balance(underlyingdecimals, exchangeratemantissa,ctokenbalance, oraclepricemantissa ) as collateral,
        get_borrow_balance(underlyingdecimals, borrowbalance, oraclepricemantissa ) as borrow,
            * FROM A
    )

  select account, blocknumber,  round(sum(collateral), 2)  as totalCollateral, round(sum(borrow), 2)  as totalBorrow  from  B
      group by account, blocknumber
         order by 3 desc
`;

  console.log(req.params);
  let data = [req.params.blockumber];
  let dbResponse = await exceuteSql(query, data);
  return res.status(200).json({ data: dbResponse.rows });
};

/**
 * Get Account Snapshot details ...
 * @param req
 * @param res
 * @returns
 */

export const getAccountSnapshotDetails = async (req: Request, res: Response): Promise<any> => {
  const query = `

                WITH A AS (
                      SELECT
                              snapshot.blockNumber,
                              snapshot.error,
                              snapshot.account,
                              snapshot.market,
                              snapshot.cTokenBalance,
                              snapshot.borrowBalance,
                              snapshot.exchangeRateMantissa,
                              snapshot.liquidity,
                              snapshot.shortfall,
                              m.collateralFactor,
                              m.marketsymbol,
                              m.oraclePriceMantissa,
                              m.underlyingdecimals,
                              m.underlyingsymbol
                                  FROM account_snapshot as snapshot
                                      LEFT JOIN markets m ON snapshot.market = m.market
                                          AND snapshot.blockNumber = m.blockNumber
                                              WHERE account = $1
                                                  AND snapshot.blockNumber = $2
                  ),B AS (

      select round( get_account_balance(underlyingdecimals, exchangeratemantissa,ctokenbalance, oraclepricemantissa ), 2)  as collateral,
           round( get_borrow_balance(underlyingdecimals, borrowbalance, oraclepricemantissa), 2) as borrow,
              * FROM A
                      
                  )

              SELECT * FROM B;         
    `;

  console.log(req.params);
  let { account, blockumber } = req.params;
  let data = [account, blockumber];
  let dbResponse = await exceuteSql(query, data);
  return res.status(200).json({ data: dbResponse.rows });
};

/**
 *
 * @param req
 * @param res
 * @returns
 */

export const getAccountSnapshotRow = async (req: Request, res: Response): Promise<any> => {
  const query = `
        SELECT
            acc.blockNumber,
            acc.account,
            acc.market,
            acc.cTokenBalance,
            acc.borrowBalance,
            acc.exchangeRateMantissa,
            m.marketsymbol,
            m.oraclePriceMantissa,
            m.collateralFactor
        FROM account_snapshot AS acc
            LEFT JOIN markets m ON acc.market = m.market AND  acc.blockNumber = m.blockNumber
                WHERE account = $1
                        AND  m."blockNumber" = $2
  `;

  console.log(req.params);
  let { account, blockumber } = req.params;
  let data = [account, blockumber];
  let dbResponse = await exceuteSql(query, data);
  // return res.status(200).json({ data: dbResponse.rows });
  return res.status(200).json({ data: [] });
};
