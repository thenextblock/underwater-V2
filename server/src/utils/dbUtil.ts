import { Client, Pool, QueryResult } from "pg";
import config = require("../config");
import logger = require("./logger");

export const pgconfig = {
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
};

const pool = new Pool(pgconfig);

logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

pool.on("error", function (err: Error) {
  logger.error(`idle Pool client error, ${err.message} | ${err.stack}`);
});

/*
 * Single Query to Postgres
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlToDB = async (sql: string, data: string[][], local: boolean = true) => {
  logger.debug(`sqlToDB() sql: ${sql} | data: ${data}`);

  let result: QueryResult;
  try {
    result = await pool.query(sql, data);
    return result;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/*
 * Execute a sql statment with a single row of data
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
export const sqlExecSingleRow = async (client: Client, sql: string, data: string[][]) => {
  logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
  let result: QueryResult;
  try {
    result = await client.query(sql, data);
    logger.debug(`sqlExecSingleRow(): ${result.command} | ${result.rowCount}`);
    return result;
  } catch (error: any) {
    logger.error(`sqlExecSingleRow() error: ${error.message} | sql: ${sql} | data: ${data}`);
    throw new Error(error.message);
  }
};
